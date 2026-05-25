# GLP-1 Integration — Nymos Mobile

> Análise estratégica + plano de execução de 3 frentes:
> 1. Permissões de compartilhamento pós-aceite de convite
> 2. Extensão de `medicacao` pra GLP-1 (injetável + oral)
> 3. Integração cross-section (modo Tratamento)
>
> Refs: GloWise (concorrente direto) + backend Nymos Clínico V1 (endo).
> Data: 2026-05-19

---

## Contexto

Nymos já tem `medicacao` como section ativa, ligada a prescrição Memed via médico Nymos Clínico (endo V1). Spec atual assume dose **diária**, sem sítio de aplicação, sem curva farmacocinética, sem log estruturado de side-effects.

Análise das refs GloWise mostra 3 elementos diferenciadores que valem incorporar:
- **Curva PK visual** (educacional, não medição real)
- **Log estruturado pós-dose** (dor + sítio + sintomas com escala 0-10)
- **Modo "Tratamento"** que reframenta `inicio` quando há GLP-1 ativo

Tudo cabe em sections existentes — **não vira módulo novo**.

---

## Tarefa 1 — Permissões de Compartilhamento

### Trigger

Tap em "Aceitar" no card de convite recebido (`profissionais` aba Convites) → abre tela `PermissoesCompartilhamento` antes de confirmar vínculo.

### Categorias de dados (por tipo profissional)

| Categoria | Personal | Nutri | Médico (endo) | Psicólogo |
|---|---|---|---|---|
| Métricas básicas (peso/altura/IMC) | ✅ default on | ✅ default on | ✅ default on | ⚠ opcional |
| Bioimpedância (composição) | ✅ default on | ✅ default on | ✅ default on | ❌ off |
| Exames laboratoriais | ❌ off | ⚠ opcional | ✅ default on | ❌ off |
| Atividades (HealthKit/wearables) | ✅ default on | ⚠ opcional | ✅ default on | ⚠ opcional |
| Treinos (histórico execução) | ✅ default on | ❌ off | ⚠ opcional | ❌ off |
| Fotos corporais | ⚠ opcional | ⚠ opcional | ⚠ opcional | ❌ off |
| Nutrição (refeições/macros) | ⚠ opcional | ✅ default on | ✅ default on | ❌ off |
| Objetivos | ✅ default on | ✅ default on | ✅ default on | ⚠ opcional |
| Medicação | ❌ off | ⚠ opcional | ✅ default on | ⚠ opcional |
| Saúde mental (diário/humor) | ❌ off | ❌ off | ⚠ opcional | ✅ default on |

Legenda: ✅ default ligado · ⚠ desligado mas visível · ❌ não aparece pra esse tipo

### UX

- **Tela full-screen** (não bottom sheet — escolha consciente, longo)
- Lista de toggles agrupados por categoria
- Cada toggle: ícone + label + descrição curta (1 linha) explicando o que o profissional vai ver
- CTA fixo no rodapé: "Confirmar vínculo" (teal-500)
- Header com avatar do profissional + nome + "Você está vinculando com..."

### Editável depois

Detalhe do profissional ganha link "Permissões de compartilhamento" → reabre a mesma tela em modo edição. Mudanças aplicam **prospectivamente** (dado histórico já visto continua visível, mas novo dado respeita escopo atual).

### Granularidade

**Por profissional individual**, não por tipo. Razão: paciente pode ter 2 personals (atual + ex) e querer escopos diferentes.

### Arquivos a tocar

```
product-mobile/sections/profissionais/
├── spec.md              # adicionar seção "Permissões"
├── types.ts             # EscopoCompartilhamento, defaults por tipo
└── data.json            # sample com permissões nos vinculados

src/sections-mobile/profissionais/components/
├── PermissoesCompartilhamento.tsx   # novo
└── Profissionais.tsx                # onAceitarConvite → abre permissões
```

---

## Tarefa 2 — Extensão de `medicacao` pra GLP-1

### Diff vs. spec atual

| Aspecto | Spec atual | Adicionar |
|---|---|---|
| Frequência | Diária assumida | `diaria` \| `semanal` \| `mensal` |
| Via | Implícita oral | `oral` \| `subcutanea` |
| Sítio de aplicação | N/A | Mapa visual 8 zonas (abdômen sup/inf esq/dir, coxa esq/dir, braço esq/dir) |
| Curva PK | N/A | Componente `CurvaPKCard` |
| Log pós-dose | Tap simples cumprido | Tela `RegistrarInjecao` (dor + sítio + foto opcional) |
| Side-effects | N/A | Tela `RegistrarSintomas` com sliders 0-10 |
| Categoria do fármaco | N/A | `glp1_injetavel` \| `glp1_oral` \| `outros` (pra ativar UI específica) |

### Componentes novos

#### `CurvaPKCard.tsx`

- Gráfico de linha mostrando **concentração relativa** (NÃO mg/dL — disclaimer + unidade qualitativa)
- Tabs de período: **14D / 30D / 90D**
- Marca picos e vales visualmente (sem labels numéricos invasivos)
- Linha tracejada à direita = projeção até próxima dose
- Tooltip educativo: "Você está no pico — saciedade alta esperada" / "Vale — fome pode voltar"
- Disclaimer fixo: "Estimativa baseada em farmacocinética populacional. Não substitui medição clínica."
- Status semáforo abaixo do gráfico: **Estável · Em alta · Em queda · Crítico**

**Modelo PK** — implementação inicial usa parâmetros publicados:
- Semaglutide (Ozempic/Wegovy/Rybelsus): t½ ~7 dias, pico ~3 dias pós-dose subcutânea
- Tirzepatide (Mounjaro/Zepbound): t½ ~5 dias, pico ~2-3 dias
- Liraglutide (Saxenda/Victoza): t½ ~13h (dose diária)
- Orforglipron (oral): t½ ~29-49h, dose diária

#### `RegistrarInjecao.tsx`

Fluxo step-by-step:
1. **Sítio** — mapa visual do tronco/membros com 8 zonas tocáveis + alerta se zona repetida nas últimas 2 doses ("Considere rotacionar")
2. **Dor** — slider 0-10 com labels "Sem dor / Leve / Moderada / Forte"
3. **Foto opcional** — sítio (privacidade local, não envia pro profissional sem permissão)
4. **Confirmar** → toast emerald + agenda push 24h depois "Como você está?"

**Edge cases:**
- Dor ≥ 7/10 → mostra dica educativa pós-confirmação ("Gire o sítio · injete devagar · temperatura ambiente reduz dor")
- Sítio repetido 3x consecutivas → alerta amarelo ("Risco de lipodistrofia · alterne para outra zona")

#### `RegistrarSintomas.tsx`

Sliders 0-10 (label semântico ao lado do número):
- Náusea
- Refluxo / azia
- **Pensamentos alimentares** (food noise — métrica-âncora pra GLP-1)
- Fadiga
- Diarreia
- Constipação
- Outros (textarea livre)

Liga automaticamente à dose atual via timestamp (dose mais recente nos últimos 7d).

#### `MedicacaoSemanaCard.tsx`

Substitui `MedicacaoHojeCard` quando há GLP-1 semanal ativo. Mostra:
- "Próxima: 30 mai · em 6 dias" + barra de progresso entre doses
- "Última: Ozempic 0.5mg · 23 mai · Abdômen sup. esq."
- 7 dots da semana (S T Q Q S S D) com status: aplicado (emerald) · dia da aplicação (teal pulse) · futuro (slate)
- Tap "Aplicar dose" leva pra `RegistrarInjecao`

**Coexistência:** se paciente tem GLP-1 semanal + medicação diária (ex: levotiroxina), mostra os 2 cards empilhados.

#### `MedicacaoOralCard.tsx`

Para GLP-1 oral (Rybelsus/Orforglipron):
- Streak de dias consecutivos: "12 dias consecutivos · siga firme"
- Lembrete de janela em jejum (Rybelsus exige 30min antes de comer/beber)
- Tap "Marcar comprimido" → confirmação rápida + toast
- Sem mapa de sítio (não aplica)

### Arquivos a tocar

```
product-mobile/sections/medicacao/
├── spec.md           # expandir com GLP-1, via, sítio, PK, log estruturado
├── types.ts          # Frequencia, Via, Sitio, Sintoma, RegistroInjecao
└── data.json         # adicionar paciente GLP-1 (injetável + oral)

src/sections-mobile/medicacao/components/
├── CurvaPKCard.tsx           # novo
├── MedicacaoSemanaCard.tsx   # novo (para semanal)
├── MedicacaoOralCard.tsx     # novo (para oral)
├── RegistrarInjecao.tsx      # novo (fluxo step-by-step)
├── RegistrarSintomas.tsx     # novo
├── MapaSitios.tsx            # novo (componente do mapa visual)
└── Medicacao.tsx             # orquestra os cards baseado em via/frequencia
```

---

## Tarefa 3 — Integração Cross-Section

### Modo "Tratamento" no `inicio`

Quando paciente tem GLP-1 ativo em `medicacao`, o `inicio` muda framing:

#### Topo: card "Tratamento ativo"

- Mini curva PK (3 dias antes / 3 depois)
- Próxima dose com countdown (compatível com imagem 1 de GloWise)
- Tap → leva pra `medicacao`
- Status semáforo do nível atual (Estável/Em queda/Em alta)

#### Quick actions adaptativas

Quando GLP-1 ativo:
- **Aplicar dose** (se hoje é dia da injeção) OU **Marcar comprimido** (se oral e ainda não tomou hoje)
- **Pesar** (atalho registro manual ou ler de balança conectada)
- **Hidratar** (atalho +copo — meta sobe automaticamente durante GLP-1 por causa de risco de desidratação)

Quando GLP-1 inativo: quick actions padrão (Nutrição · Atividades · Treinos).

#### Cards existentes ganham contexto

- **"Minha evolução" → "Evolução no tratamento"** + delta desde início da medicação
- **Anel de calorias** — meta calibrada pelo nutri vinculado (se tiver) ou heurística GLP-1 (déficit menor por saciedade aumentada)
- **Card "Sintomas recentes"** (NOVO) — só aparece se houve log nos últimos 7 dias. Mostra náusea média e food noise. Tap → histórico em `medicacao`.

### Projeção de peso em `objetivos`

Quando há meta de peso definida + GLP-1 ativo, adicionar:

#### `CurvaPesoProjetadoCard.tsx`

- Curva-S (NÃO linear) refletindo fases:
  1. Titulação (0-3 meses, perda lenta)
  2. Eficácia máxima (3-6 meses, perda acelerada)
  3. Platô (6+ meses, perda lenta ou estabilização)
- Eixo X: hoje → data alvo
- Eixo Y: peso atual → peso alvo
- 2 marcadores: "Hoje" + "Meta"
- Disclaimer: "Projeção baseada em dados populacionais de ensaios clínicos (STEP, SURMOUNT). Resultados individuais variam significativamente."

#### `BmiDeltaCard.tsx`

- Régua horizontal IMC com gradient sóbrio (não emerald saturado): `<18 · 18 · 25 · 30 · 35 · 35+`
- 2 marcadores na régua: atual + alvo
- Labels: "Abaixo · Normal · Sobrepeso · Obesidade I · Obesidade II · Obesidade III"
- Status textual: "Atual: Sobrepeso · Alvo: Sobrepeso · Redução prevista: 6%"
- **NÃO promete chegar em "Normal"** — meta deve ser clinicamente realista, definida com endo

### Espelhamento em `saude-mental`

"Pensamentos alimentares" (food noise) é métrica psicológica. Quando logada em `medicacao`:

- Dado vive em `medicacao` (acoplado à dose)
- **Espelha** em `saude-mental` aba Diário emocional como card "Food noise" (gráfico 30d)
- Psicólogo vinculado vê via lente clínica (se permitido nas permissões — tarefa 1)

### `ai-insights` (módulo existente backend)

Não é seção UI nova — é prompt novo no módulo `ai-insights` do Nymos:

- Insights diários contextuais cruzam: fase PK + sintomas recentes + nutrição/hidratação trackadas
- Exemplos:
  - "Você está no pico de Ozempic — fome baixa esperada. Foque em proteína (meta atual: 45g restantes) pra preservar massa magra."
  - "Náusea média subiu pra 5/10. Considere refeições menores e evite gorduras pesadas hoje."
  - "Pensamentos alimentares caíram 60% desde início do tratamento — sinal positivo do mecanismo."
- Aparecem no `inicio` (top card "Insight do dia") e arquivados em `minha-saude` aba Análises

---

## Cuidados médico-legais

### Não fazer

- ❌ Mostrar concentração em mg/dL — implica medição real
- ❌ Prometer perda de peso específica sem disclaimer pesado
- ❌ Sugerir ajuste de dose pelo paciente
- ❌ Auto-gerar metas de peso agressivas
- ❌ Alertar "tomar dose" se o paciente não confirmou prescrição ativa
- ❌ Compartilhar dados com profissional sem consentimento explícito (tarefa 1)

### Fazer

- ✅ Sempre disclaimer "estimativa baseada em modelo populacional"
- ✅ Meta de peso validada/definida pelo endo vinculado
- ✅ Dica educativa quando dor/sintoma intenso (não "consulte" — orientação prática)
- ✅ Push de renovação de receita apenas após médico atualizar Memed
- ✅ Permissões granulares por profissional (tarefa 1)

---

## Ordem de execução proposta

1. **Tarefa 1 (permissões)** — bloqueia compartilhamento de dados, é base ética + legal
2. **Extensão de types/spec de `medicacao`** — sem UI ainda, só modelo de dados
3. **`CurvaPKCard` + `MedicacaoSemanaCard` + `MedicacaoOralCard`** — visual core
4. **`RegistrarInjecao` + `RegistrarSintomas`** — fluxos de log
5. **Modo Tratamento no `inicio`** — refraine quick actions + card "Tratamento ativo"
6. **`CurvaPesoProjetadoCard` + `BmiDeltaCard` em `objetivos`**
7. **Espelhamento food noise em `saude-mental`** (V2 — depende de ai-insights ter o prompt)

---

## Decisões pendentes

1. **Status semáforo PK** — "Estável/Em alta/Em queda/Crítico" funciona ou prefere terminologia mais educativa? ("No pico / Vale / Subindo / Caindo")
2. **Mapa de sítios** — visual realista (ilustração corpo) ou abstrato (8 botões nomeados)?
3. **Foto do sítio** — vale a feature? privacy concerns vs. valor (acompanhar reações cutâneas)
4. **Streak gamificado em oral** — "12 dias consecutivos" — ou abandona gamificação pra manter tom clínico sério?
5. **Quem define a meta de peso** — paciente sozinho, endo no Memed, ou negociação no app?
