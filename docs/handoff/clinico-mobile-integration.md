# Integração Clínico ↔ Backend ↔ Mobile

> Mapa de fluxos cross-system pro Nymos Clínico V1 (endo) integrar com app paciente Nymos Mobile via backend Nymos existente.
>
> Audiência: backend dev + dev mobile + dev clínico web.
> Data: 2026-05-19

---

## Sumário executivo

| Fluxo | Trigger (Clínico) | Recepção (Mobile) | Mecanismo |
|---|---|---|---|
| 1. Prescrição de medicação | Médico cria/ajusta receita | Banner + card atualizado | Memed + push + WebSocket |
| 2. Solicitação de exame | Médico solicita exame | Notificação + lista pendentes | Push + GET polling |
| 3. Upload de exame pelo paciente | — | Paciente sobe PDF/imagem | POST + IA job |
| 4. Análise IA de exame | Médico revisa laudo + IA | Paciente vê laudo + análise | GET após status=analisado |
| 5. Consulta + anamnese (IA escriba) | Médico finaliza consulta | Resumo + recomendações | POST + push |
| 6. Mensagens canal clínico | Médico envia / Paciente envia | Push + badge | WebSocket bidirectional |
| 7. Vínculo + escopo de compartilhamento | Paciente define no app | Backend filtra queries do médico | PUT + enforcement |
| 8. Registro de aplicação GLP-1 | — | Paciente registra sítio + dor + foto | POST + alimenta curva PK |
| 9. Registro de sintomas pós-dose | — | Paciente loga food noise + náusea etc | POST + alimenta gráficos médico |
| 10. Renovação de receita (paciente solicita) | Médico aprova / nega | Paciente vê status atualizado | POST + WebSocket |

---

## Arquitetura geral

```
┌─────────────────────────────┐    HTTPS/WSS    ┌─────────────────────────────┐    HTTPS/WSS    ┌─────────────────────────────┐
│   CLÍNICO (Web)             │  ◄────────────► │   BACKEND NYMOS             │  ◄────────────► │   MOBILE (App Paciente)     │
│   - Next.js                 │                 │   - API REST + WebSockets   │                 │   - React Native (Expo 55)  │
│   - src/sections-clinico/   │                 │   - PostgreSQL              │                 │   - src/sections-mobile/    │
│   - Auth: JWT (médico)      │                 │   - Memed integration       │                 │   - Auth: JWT (paciente)    │
│                             │                 │   - IA: OpenAI + Anthropic  │                 │   - HealthKit/Wearables     │
│                             │                 │   - S3: PDFs + imagens      │                 │                             │
└─────────────────────────────┘                 └─────────────────────────────┘                 └─────────────────────────────┘
                                                          │
                                                          ▼
                                                 ┌──────────────────┐
                                                 │  Memed (3rd)     │
                                                 │  Recibo + QR     │
                                                 └──────────────────┘
                                                 ┌──────────────────┐
                                                 │  Push (FCM/APNs) │
                                                 └──────────────────┘
```

**Princípios:**
- **Source of truth = Backend Nymos**. Frontend nunca calcula nada que precise ser confiável (PK, adesão, status de exame).
- **Realtime via WebSocket** pra eventos críticos (receita atualizada, mensagem chegando). Polling pra dados não-críticos.
- **Push notifications são tap-deeplinks** — abre tela específica direto.
- **Permissões aplicam no backend** — frontend nem recebe dado não-autorizado.
- **Memed é write-only do médico**, read-only do paciente. Backend é proxy.

---

## Fluxo 1 — Prescrição de medicação

### 1.1 Médico prescreve (Clínico → Backend)

**Trigger UI:**
- `src/sections-clinico/prescricao/components/PrescricaoLista.tsx` → "Nova prescrição"
- OU `src/sections-clinico/consulta/components/Consulta.tsx` → finalizar consulta com receita

**Payload (POST `/api/clinico/prescricoes`):**

```typescript
interface CriarPrescricaoRequest {
  pacienteId: string
  origem: 'consulta' | 'renovacao_sem_consulta' | 'prescricao_avulsa'
  consultaId?: string   // se origem=consulta
  itens: Array<{
    medicamento: string         // "Ozempic"
    principioAtivo: string      // "Semaglutide"
    dose: string                // "0,5mg"
    posologia: string           // "1x por semana · sexta-feira 09h"
    via: 'oral' | 'subcutanea' | 'topica' | 'outro'
    frequencia: 'diaria' | 'semanal' | 'mensal' | 'sob_demanda'
    duracaoDias: number | null  // null = contínua
    quantidade: string          // "3 canetas"
    classe: ClasseTerapeutica
    orientacao?: string
    /** Marca pra UI mobile ativar curva PK + injeção + sintomas */
    categoria?: 'glp1_injetavel' | 'glp1_oral' | 'outros'
    farmaco?: FarmacoId         // pra modelo PK
  }>
  observacoesMedico?: string
}
```

**Side effects (backend):**
1. Cria registro `Prescricao` no DB
2. Chama Memed API → recebe `memedId` + PDF/QR URL
3. Para cada item, cria/atualiza `MedicacaoAtiva` do paciente (medicoId = JWT do médico)
4. Cria `RegistroReceita` no histórico
5. Dispara evento `prescricao.criada` (Webhook → push + WS)

**Response:**

```typescript
{
  prescricao: PrescricaoDetalhe
  memedUrl: string
  memedQrCode: string
}
```

### 1.2 Notificação ao paciente

**Mecanismo:**
- **Push** (APNs/FCM) — tap leva direto pra `medicacao` com banner ativo
- **WebSocket** (se app aberto) — atualiza state em tempo real

**Payload push:**

```json
{
  "type": "prescricao_atualizada",
  "title": "Receita atualizada",
  "body": "Dr. Pedro Lima atualizou sua receita de Ozempic",
  "data": {
    "deepLink": "nymos://medicacao?medicacaoId=med-ozm",
    "medicacaoId": "med-ozm",
    "memedId": "memed-rx-1029"
  }
}
```

### 1.3 Recepção (Mobile)

**UI atualizada:**
- `src/sections-mobile/medicacao/components/Medicacao.tsx` carrega `receitaRenovada` na próxima query
- `ReceitaRenovadaBanner` aparece no topo (auto-some <24h ou ao dispensar)
- `MedicacaoAtivaCard` correspondente ganha badge "atualizado" (`atualizadoEm < 24h`)

**Endpoint mobile:**

```
GET /api/paciente/medicacao
→ MedicacaoData (medicosVinculados + medicacoesAtivas + historicoReceitas + receitaRenovada + curvasPK + injecoes + sintomas)
```

**Frequência:**
- On-mount + ao receber WS event `prescricao.atualizada`
- Pull-to-refresh manual

### 1.4 Cancelamento / ajuste

Mesmo fluxo, com:
- `PUT /api/clinico/prescricoes/:id/cancelar` + payload `{ motivo: MotivoCancelamento }`
- `PUT /api/clinico/prescricoes/:id/ajustar` + payload com diff
- Push diferenciado: "Sua receita de X foi ajustada/cancelada"

---

## Fluxo 2 — Solicitação de exame

### 2.1 Médico solicita (Clínico → Backend)

**Trigger UI:**
- `src/sections-clinico/exames/components/ExameDetalhe.tsx` → "Solicitar novo exame"
- OU dentro da consulta (AnamneseView com bloco "Solicitar exames")

**Payload (POST `/api/clinico/exames/solicitar`):**

```typescript
interface SolicitarExameRequest {
  pacienteId: string
  consultaId?: string
  exames: Array<{
    examType: 'lab_exam' | 'bioimpedance' | 'imaging' | 'body_photos'
    /** Categoria específica (TSH, hemograma, RX tórax, US tireoide, etc) */
    categoria: string
    /** Justificativa clínica obrigatória */
    motivo: string
    urgencia: 'rotina' | 'urgente'
    prazoIdealDias: number
  }>
}
```

**Side effects:**
1. Cria `Exam` com `status=pendente` pra cada exame solicitado
2. Adiciona à fila de exames do paciente em `/exams/`
3. Dispara push "Você tem X exames novos pra fazer"

### 2.2 Recepção (Mobile)

**UI atualizada:**
- Tela `Exames` do paciente (`/exams/`) lista exames com `status=pendente`
- Badge no header se houver pendentes
- Cada card mostra: tipo + categoria + motivo + prazo + médico solicitante

**Endpoint mobile:**

```
GET /api/paciente/exames?status=pendente
→ Exam[]
```

---

## Fluxo 3 — Upload de exame pelo paciente

### 3.1 Paciente sobe arquivo (Mobile → Backend)

**Trigger UI:**
- Tela `Exames` → tap em exame pendente → "Subir resultado"
- Picker: câmera, galeria, arquivo (PDF)

**Payload (POST `/api/paciente/exames/:id/upload`):**

```typescript
// multipart/form-data
{
  files: File[]               // PDFs ou imagens
  dataRealizacao: string      // ISO
  laboratorio?: string
  observacoes?: string
}
```

**Side effects:**
1. Upload pra S3 → cria `imageUrls[]` ou `pdfUrl`
2. Atualiza `Exam.status = "em_analise"`
3. Dispara job de IA de interpretação (assíncrono)
4. Notifica médico no clínico ("Paciente enviou resultado de X")

### 3.2 Job de IA (Backend interno)

**Pipeline:**
1. OCR do PDF (Tesseract / Vision API) → texto bruto
2. Para `lab_exam`: extrai analitos + valores + referência → `Exam.results` estruturado
3. Para `imaging`: vision LLM (Anthropic Claude) → laudo narrativo + achados
4. Análise IA: cruza com histórico do paciente → `Exam.analysis` (narrativa + flags)
5. Atualiza `Exam.status = "analisado"`
6. Dispara WS pro clínico ("Análise IA pronta")
7. (Opcional) push pro paciente: "Seu exame está pronto"

---

## Fluxo 4 — Médico revisa e libera laudo

### 4.1 Médico revisa (Clínico)

**Trigger UI:**
- `src/sections-clinico/exames/components/ExameDetalhe.tsx` mostra:
  - Imagem do exame (visualizador inline)
  - Análise IA gerada
  - Campo "Laudo médico" editável
  - CTA "Liberar pro paciente"

**Payload (PUT `/api/clinico/exames/:id/liberar`):**

```typescript
{
  laudoMedico: string         // texto livre, pode editar análise IA
  status: 'liberado'
  recomendacoes?: string[]    // ações pro paciente
}
```

### 4.2 Recepção (Mobile)

**Push:**

```json
{
  "type": "exame_liberado",
  "title": "Resultado de TSH disponível",
  "body": "Dr. Pedro Lima analisou seu exame. Veja agora.",
  "data": { "deepLink": "nymos://exames/:id" }
}
```

**UI mobile:**
- Tela `Exames` mostra exame com status "Liberado"
- Tap abre `ExameDetalhe` com:
  - PDF/imagem
  - Análise IA narrativa (linguagem leiga)
  - Recomendações do médico
  - Botão "Falar com médico" (linka pra Mensagens)

---

## Fluxo 5 — Consulta + anamnese (IA escriba)

### 5.1 Médico inicia consulta (Clínico)

**Trigger UI:**
- `src/sections-clinico/consulta/components/Consulta.tsx` → "Iniciar consulta"
- Modo presencial: grava áudio em background
- Modo telemedicina: grava áudio do call (paciente também consente)

**Side effects:**
- Cria `Consulta` com `status=em_andamento`
- IA escriba transcreve áudio em tempo real (Whisper / Deepgram)
- LLM estrutura em **SOAP** (Subjetivo / Objetivo / Avaliação / Plano)

### 5.2 Médico finaliza (Clínico → Backend)

**Trigger UI:**
- Aba "Anamnese" preenchida → "Finalizar consulta"
- Pode incluir prescrição (Fluxo 1) e solicitação de exame (Fluxo 2)

**Payload (POST `/api/clinico/consultas/:id/finalizar`):**

```typescript
{
  anamnese: {
    subjetivo: string
    objetivo: string
    avaliacao: string
    plano: string
  }
  exameFisico?: object
  imagensAnexadas?: string[]      // URLs de imagens analisadas durante consulta
  proximosPassos: string[]
  proximaConsultaSugerida?: string // ISO
  resumoParaPaciente: string      // gerado por IA, médico edita
}
```

**Side effects:**
1. Cria `Prontuario` (registro permanente)
2. Atualiza `Consulta.status = "finalizada"`
3. Push pro paciente: "Resumo da consulta disponível"

### 5.3 Recepção (Mobile)

**UI:**
- Tela `Início` paciente mostra card "Última consulta · resumo"
- Tela `Mais` → "Histórico de consultas"
- Próxima consulta sugerida vira evento no calendário (HealthKit opcional)

---

## Fluxo 6 — Mensagens canal clínico

### 6.1 Médico envia (Clínico → Backend → Mobile)

**Trigger UI:**
- `src/sections-clinico/mensagens/components/MensagensInbox.tsx`
- Por paciente, modo chat

**Payload (POST `/api/mensagens`):**

```typescript
{
  pacienteId: string
  conteudo: string
  anexos?: string[]    // URLs
  categoria: 'clinica' | 'administrativa' | 'emergencia'
}
```

**Side effects:**
1. Salva no DB
2. Push pro paciente com prioridade alta se `emergencia`
3. WS pra paciente (se app aberto)

### 6.2 Paciente envia (Mobile → Backend → Clínico)

**Trigger UI:**
- Em qualquer detalhe (MedicacaoDetalhe → "Médico", ExameDetalhe → "Falar com médico", etc)
- OU tela dedicada de Mensagens no Mais

**Payload (POST `/api/paciente/mensagens`):**

```typescript
{
  medicoId: string
  conteudo: string
  contexto?: {
    tipo: 'medicacao' | 'exame' | 'sintoma' | 'consulta'
    refId: string     // medicacaoId, examId, etc
  }
}
```

**Side effects:**
- WS pro clínico (médico vê badge novo no inbox)
- Contexto vira link clicável no inbox do médico

---

## Fluxo 7 — Vínculo + escopo de compartilhamento

### 7.1 Paciente vincula (Mobile → Backend)

**Já documentado em `glp1-integration.md` e implementado.** Resumo:

**Aceite de convite (médico convidou):**

```
PUT /api/paciente/convites/:id/aceitar
{ escopo: EscopoCompartilhamento }
```

**Vínculo por código:**

```
POST /api/paciente/vinculos/por-codigo
{ codigo: "RAFA-7K2X", escopo: EscopoCompartilhamento }
```

**Edição posterior:**

```
PUT /api/paciente/vinculos/:profId/escopo
{ escopo: EscopoCompartilhamento }
```

### 7.2 Enforcement no backend (crítico)

Toda query do médico em qualquer endpoint filtra pelo escopo:

```typescript
// Pseudo-código middleware
function aplicarEscopo(medicoId, pacienteId, categoria) {
  const escopo = getEscopoVinculo(medicoId, pacienteId)
  if (!escopo[categoria]) throw new ForbiddenError()
}
```

Exemplos:
- `GET /api/clinico/pacientes/:id/medicacao` → só retorna se `escopo.medicacao === true`
- `GET /api/clinico/pacientes/:id/exames` → só retorna se `escopo.examesLaboratoriais === true`
- `GET /api/clinico/pacientes/:id/fotos-corporais` → só retorna se `escopo.fotosCorporais === true`

**Histórico anterior à mudança permanece visível** (cache no clínico). Mudanças aplicam **prospectivamente**.

---

## Fluxo 8 — Registro de aplicação GLP-1

### 8.1 Paciente aplica (Mobile → Backend)

**Trigger UI:**
- `src/sections-mobile/medicacao/components/RegistrarInjecao.tsx` confirma aplicação

**Payload (POST `/api/paciente/injecoes`):**

```typescript
{
  medicacaoId: string
  aplicadoEm: string         // ISO
  sitio: SitioAplicacao      // 8 zonas
  dor: number                // 0-10
  doseLabel: string          // snapshot
}
```

**Side effects:**
1. Cria `RegistroInjecao`
2. **Recalcula `CurvaPK`** da medicação (modelo populacional por fármaco)
3. Atualiza `MedicacaoAtiva.adesao30d`
4. Agenda push 24h depois: "Como você está se sentindo após Ozempic?"
5. Se `dor >= 7`: NÃO alerta médico automaticamente (paciente decide via "Falar com médico")

### 8.2 Visibilidade no clínico

Médico vê em `src/sections-clinico/pacientes/components/PacienteDetalhe.tsx`:
- Adesão GLP-1 do paciente
- Mapa de rotação de sítios (alerta se lipodistrofia)
- Histórico de dor (trend)

**Endpoint clínico (com escopo `medicacao=true`):**

```
GET /api/clinico/pacientes/:id/injecoes?medicacaoId=&periodo=30d
→ RegistroInjecao[]
```

---

## Fluxo 9 — Registro de sintomas pós-dose

### 9.1 Paciente loga (Mobile → Backend)

**Trigger UI:**
- `src/sections-mobile/medicacao/components/RegistrarSintomas.tsx` salva

**Payload (POST `/api/paciente/sintomas`):**

```typescript
{
  injecaoId?: string         // vincula automaticamente se houver injeção <7d
  nausea: number             // 0-10
  refluxo: number
  pensamentosAlimentares: number   // food noise
  fadiga: number
  diarreia: number
  constipacao: number
  observacoes?: string
}
```

### 9.2 Visibilidade no clínico

Médico vê gráfico de tendências (especialmente food noise — mecanismo psicológico do GLP-1):

```
GET /api/clinico/pacientes/:id/sintomas?medicacaoId=&periodo=90d
→ Array com séries temporais por sintoma
```

**No detalhe do paciente do clínico**, novo bloco "Sintomas GLP-1" com:
- Gráfico de linha: food noise ao longo do tempo
- Tendência: subindo / caindo / estável
- Correlação com mudanças de dose (overlay)

---

## Fluxo 10 — Renovação de receita (paciente solicita)

### 10.1 Estado atual (V1)

> "Solicitação de renovação pelo paciente → V2 (vai por Mensagens canal clínico no V1)"

Em V1, paciente **não tem botão dedicado** pra solicitar renovação — usa "Falar com médico" do `MedicacaoDetalhe` (Fluxo 6) com contexto.

### 10.2 V2 — fluxo automatizado

**Trigger UI (Mobile):**
- `MedicacaoDetalhe` ganha card "Renovação · faltam X dias" quando próximo do fim
- CTA "Solicitar renovação"

**Payload (POST `/api/paciente/renovacoes`):**

```typescript
{
  medicacaoId: string
  motivo?: string
}
```

**Side effects:**
1. Cria `SolicitacaoRenovacao` com status=pendente
2. Aparece em fila no clínico `src/sections-clinico/prescricao/` com badge urgência
3. Médico aprova → vira Fluxo 1 (prescrição) com origem=renovacao_sem_consulta
4. Médico nega → push pro paciente com motivo

---

## Cross-cutting concerns

### Autenticação

- **Médico:** JWT com `role=medico` + `medicoId`
- **Paciente:** JWT com `role=paciente` + `pacienteId`
- Mobile usa `expo-secure-store` pra access + refresh
- Todo endpoint que cruza identidade verifica vínculo: `GET /api/clinico/pacientes/:id` 403 se não vinculado

### Realtime

**WebSocket conexão única por usuário:**
- Mobile: conecta após login, mantém em foreground
- Clínico: conecta no app boot, mantém em background
- Eventos por canal: `paciente:{id}` e `medico:{id}`
- Heartbeat 30s, reconexão automática

**Eventos críticos (WS):**
- `prescricao.criada/atualizada/cancelada`
- `exame.liberado`
- `mensagem.nova`
- `consulta.finalizada`

**Eventos não-críticos (polling):**
- Adesão, gráficos, histórico — refresh on focus + pull-to-refresh

### Push notifications

- FCM (Android) + APNs (iOS) via Expo Push
- Deep link pattern: `nymos://[section]?[params]`
- Categorias: medicacao, exames, mensagens, consultas, emergencia
- Paciente customiza em Configurações → Notificações

### Cache + sincronização

**Mobile (TanStack Query):**
- `staleTime: 30s` pra dados frequentes (medicação, adesão)
- `staleTime: 5min` pra histórico
- Invalida cache no WS event
- Optimistic updates pra ações do paciente (marcar dose, registrar injeção)

**Clínico:**
- React Query similar
- Invalida na finalização de consulta / prescrição

### Offline

**Mobile:**
- Marcar dose offline: queue local + sync ao reconectar
- Registrar injeção offline: queue local
- Registrar sintomas: queue local
- Receber receita nova: **requer online** (Memed integration)
- Banner "Sem conexão · Suas ações sincronizam quando voltar"

### Permissões granulares (recap)

Backend filtra automático com base no `escopo` do vínculo. Frontend nunca recebe dado não-autorizado. Mudanças aplicam prospectivamente.

| Categoria escopo | Endpoints afetados |
|---|---|
| `metricasBasicas` | `/medicacao`, `/metricas`, `/perfil` (parcial) |
| `bioimpedancia` | `/exames?examType=bioimpedance` |
| `examesLaboratoriais` | `/exames?examType=lab_exam` |
| `atividades` | `/atividades`, HealthKit data |
| `treinos` | `/treinos` |
| `fotosCorporais` | `/exames?examType=body_photos`, `/evolution` |
| `nutricao` | `/nutricao` |
| `objetivos` | `/objetivos` |
| `medicacao` | `/medicacao`, `/injecoes` |
| `saudeMental` | `/saude-mental`, `/sintomas?categoria=mental` |

### Memed integration

**Quando:** Apenas no Fluxo 1 (prescrição) e Fluxo 4 (exames) — Memed também gera pedidos de exame.

**Como:**
- Médico tem credencial Memed vinculada no perfil clínico
- Backend Nymos chama Memed API → recebe PDF + QR
- Salva `memedId` no `MedicacaoAtiva` / `Exam`
- Frontend (clínico + mobile) abre via `GET /api/proxy-memed/:memedId` (não expõe Memed API key)

### Auditoria

Todas as ações cross-system geram audit log:
- Médico prescreveu → `audit.prescricao.criada`
- Paciente mudou escopo → `audit.escopo.atualizado`
- Médico viu dado sensível → `audit.acesso.fotos_corporais`

Histórico imutável, exportável (LGPD).

---

## Status de implementação UI

| Fluxo | Clínico UI | Mobile UI | Backend |
|---|---|---|---|
| 1. Prescrição | ✅ | ✅ | ⚠ wire Memed |
| 2. Solicitação exame | ✅ | ⚠ tela exames precisa "pendente" badge | ⚠ |
| 3. Upload paciente | — | ✅ via `/evolution/` ou `/exams/` | ⚠ pipeline IA |
| 4. Liberação laudo | ✅ | ✅ tela exames | ⚠ |
| 5. Consulta + IA escriba | ✅ | ⚠ resumo no início precisa card | ⚠ Whisper + LLM SOAP |
| 6. Mensagens | ✅ | ⚠ tela mensagens dedicada falta | ⚠ WebSocket |
| 7. Permissões | — | ✅ (sessão atual) | ❌ enforcement crítico |
| 8. Aplicação GLP-1 | ⚠ visualização no clínico | ✅ (sessão atual) | ⚠ recálculo PK |
| 9. Sintomas | ⚠ visualização no clínico | ✅ (sessão atual) | ⚠ |
| 10. Renovação | — | — | — (V2) |

**Legenda:** ✅ pronto · ⚠ parcial · ❌ falta · — não aplica

---

## Próximos passos sugeridos

### Pra backend
1. Mapear endpoints existentes vs sugeridos aqui → identificar gaps
2. Implementar **enforcement de escopo** (Fluxo 7) — crítico, segurança
3. Definir contrato WebSocket + canais por usuário
4. Pipeline IA pra exames (Fluxo 3-4)
5. IA escriba (Fluxo 5) — Whisper + LLM SOAP

### Pra mobile
1. Visualização de exames pendentes (Fluxo 2)
2. Tela dedicada de Mensagens no Mais (Fluxo 6)
3. Resumo de consulta no Início (Fluxo 5)
4. Offline queue pra ações críticas (Fluxos 1, 8, 9)

### Pra clínico
1. Bloco "Sintomas GLP-1" no detalhe do paciente (Fluxo 9)
2. Mapa de rotação de sítios (Fluxo 8)
3. Fila de renovações (Fluxo 10 — V2)
