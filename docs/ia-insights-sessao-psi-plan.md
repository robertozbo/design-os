# IA Insights — Sessão Psi (Plano de implementação)

> Plano completo para a feature **"IA Insights"** no fluxo de Sessão do módulo Psicólogo do Nymos.
> Este doc é referência cruzada com `product/sections/sessao-psi/spec.md` (UI) e serve de PRD pro backend.

**Status:** rascunho · aguardando aprovação pra execução
**Última atualização:** 2026-05-23

---

## 1. Objetivo

Oferecer ao psicólogo um botão "Gerar insight" durante a Sessão que retorna 3 cards (padrões longitudinais, hipóteses clínicas com CID-11, sugestões de homework) baseados no SOAP em rascunho + histórico do paciente.

**Não é**: substituto de raciocínio clínico, diagnóstico autônomo, prescrição.
**É**: assistente de raciocínio — o psicólogo decide o que aplicar.

---

## 2. Decisões-chave já tomadas

| Decisão | Valor | Motivo |
|---------|-------|--------|
| Provider LLM | Anthropic Claude (já em uso no Nymos) | Reaproveita `tracked-anthropic.ts` + budget tracking |
| Tier de acesso | Pro | Alinha com gating Nymos: "IA é Pro" |
| Trigger | On-demand (botão), não automático | Custo + controle clínico do psi |
| Modelo de entrega | Cards estruturados, não texto livre | Cada card é actionable (aplicar/descartar) |
| Persistência dos insights | Salva por sessão (auditoria) | LGPD art. 20 — direito de explicação |

---

## 3. Backend

### 3.1 Estrutura de pastas

Criar `backend/api/modules/professional-psychology/ai/`:

```
ai/
├── agents/
│   └── session-insight.agent.ts        # Prompt + chamada Claude
├── services/
│   ├── PsychologyContextService.ts     # Agrega contexto pro prompt
│   └── PsychologyInsightService.ts     # Orquestra agent + persistência
├── controller.ts                       # Handler HTTP
├── routes.ts                           # POST /sessions/ai/insight
├── types.ts                            # Request/Response interfaces
├── validation.ts                       # Zod schemas
└── __tests__/
    └── session-insight.agent.test.ts
```

### 3.2 Endpoint

```
POST /api/professional/psychology/sessions/ai/insight
Auth: middleware psi existente (psicólogo vinculado ao paciente)
Budget feature: 'psychology_session_insight'
```

**Request:**
```ts
interface SessionInsightRequest {
  patientId: string;           // UUID
  appointmentId?: string;      // UUID opcional (se a sessão tem appt vinculado)
  soapDraft: {
    subjetivo?: string;
    objetivo?: string;
    avaliacao?: string;
    plano?: string;
  };
  homeworkDraft?: string;
}
```

**Response:**
```ts
interface SessionInsightResponse {
  insightId: string;           // UUID para persistir audit trail
  generatedAt: string;         // ISO timestamp
  patterns: Array<{
    text: string;              // 1–2 frases
    sourceWindow: '7d' | '30d' | '90d' | 'all';
  }>;
  hypotheses: Array<{
    cid?: string;              // ex: "6A70" (TDM)
    label: string;             // "Episódio depressivo moderado"
    confidence: 'low' | 'medium' | 'high';
    rationale: string;         // 1–3 frases — por quê
  }>;
  homework: Array<{
    text: string;              // sugestão
    rationale: string;         // por quê alinhado à sessão
  }>;
  tokensUsed: number;          // pra dashboard de custo
}
```

### 3.3 PsychologyContextService

Agrega o que vai no prompt. Input mínimo: `(patientId, professionalId)`. Output:

```ts
interface SessionAIContext {
  // Anonimizado — sem nome/CPF
  patientRef: string;          // hash curto do UUID (ex: "p_a347f")
  patientAge: number;
  patientGenderHint?: 'M' | 'F' | 'NB';
  scores: {
    instrument: 'PHQ-9' | 'GAD-7' | 'DASS-21' | 'IES-R';
    value: number;
    severity: string;
    appliedAt: string;         // ISO date
  }[];                         // últimas 4 aplicações
  recentSessions: {
    sessionDate: string;
    mode: 'soap' | 'dap' | 'livre';
    soap?: { subjetivo?: string; objetivo?: string; avaliacao?: string; plano?: string };
    techniques: string[];      // ids do CATALOGO_TECNICAS
    riskLevel: 0 | 1 | 2 | 3;
    homework?: string;
  }[];                         // últimas 3
  activePlan?: {
    abordagem: string;         // tcc, act, mindfulness...
    sessionCurrent: number;
    totalSessions: number;
  };
}
```

**Privacidade:** `patientRef` é hash do UUID, não o UUID inteiro. Idade vai (relevante clinicamente), gênero só hint, sem identificadores.

### 3.4 Prompt do agente (session-insight.agent.ts)

```
SYSTEM PROMPT:
Você é um assistente de raciocínio clínico para psicólogos brasileiros.

PAPEL E LIMITES:
- Você NUNCA diagnostica autonomamente. Sempre fala em "considerar", "possibilidade", "compatível com".
- O psicólogo é o responsável clínico — você oferece insights, ele decide.
- Sempre use CID-11 (não DSM) como referência diagnóstica oficial no Brasil.
- Use português do Brasil, linguagem técnica mas acessível.
- Nunca prescreva medicação. Se psiquiatra parece indicado, sugira "considerar encaminhamento".

ENTRADA:
Você recebe:
1. Contexto longitudinal do paciente (scores PHQ-9/GAD-7, últimas 3 sessões, plano ativo)
2. Rascunho SOAP da sessão atual

TAREFA:
Devolva JSON estruturado com 3 áreas:

1. PATTERNS (1–3 itens): tendências longitudinais visíveis nos dados.
   - Compare scores entre aplicações
   - Note evolução de técnicas/homework
   - Sinalize sourceWindow ('7d', '30d', '90d', 'all')

2. HYPOTHESES (1–4 itens): hipóteses clínicas a considerar.
   - Cada uma com: CID-11 code (se aplicável), label, confidence (low/medium/high), rationale (1–3 frases)
   - Confidence: low = sinal fraco, medium = padrão consistente, high = critérios bem atendidos
   - Critério crítico: se ideação suicida/autolesão mencionada, SEMPRE incluir hipótese de risco com confidence ao menos medium

3. HOMEWORK (1–3 itens): sugestões de tarefa pro paciente.
   - Alinhadas à abordagem do plano ativo (TCC, ACT, etc)
   - Concretas e mensuráveis
   - Cada uma com rationale curto

REGRAS DE OUTPUT:
- Responda APENAS com JSON válido no schema fornecido. Nada de markdown, nada de texto antes/depois.
- Se contexto for insuficiente pra alguma área (ex: 1ª sessão sem histórico), devolva array vazio nessa área.
- Nunca invente scores, datas ou eventos não presentes no contexto.

GUARD-RAILS DE SEGURANÇA:
- Se detectar ideação suicida ou autolesão no SOAP/homework, incluir em hypotheses uma entrada com label "Risco de autolesão/ideação — protocolo CVV 188" e confidence "high".
- Se contexto sugerir mania/hipomania (energia muito elevada, falta de sono sem cansaço, comportamento desinibido), incluir hipótese de transtorno bipolar com sugestão de "considerar encaminhamento psiquiátrico".
```

### 3.5 Budget e auditoria

- Feature key: `psychology_session_insight`
- Estimar tokens: ~3K input + 1K output = ~$0.045 por chamada (Claude 4.6 Sonnet)
- Limite default: 20 insights/psi/dia (configurável por admin)
- Audit table: `psychology_ai_insights` — patient_id, professional_id, session_id, prompt_hash, response_json, applied_cards_ids[], created_at

---

## 4. Frontend

### 4.1 Componente

`frontend/src/components/modules/professional/psychology-sessao/IaInsightsPanel.tsx`

Renderizado dentro do `PsychologySessao.tsx`, sidebar direita, abaixo de `InstrumentosPanel`:

```tsx
<IaInsightsPanel
  patientId={data.paciente.id}
  appointmentId={appointmentId}
  soapDraft={data.soap}
  homeworkDraft={data.homework.texto}
  onApplyToSoap={(campo, texto) => onSoapChange?.(campo, texto)}
  onApplyToHomework={(texto) => onHomeworkChange?.('texto', texto)}
/>
```

### 4.2 Estados

| Estado | UI |
|--------|----|
| Idle | Card collapsado, botão "Gerar insight" + ícone Sparkles |
| Loading | Skeleton dos 3 cards + "Analisando contexto…" + spinner |
| Success | 3 grupos (Padrões / Hipóteses / Homework), cada card com `[Aplicar]` `[Descartar]` |
| Error | Mensagem + botão "Tentar novamente" |
| Locked (free/plus) | "Disponível no Plano Pro" + link upgrade |

### 4.3 Hook

`frontend/src/hooks/professional-psychology/usePsychologySessionInsight.ts`:

```ts
export function usePsychologySessionInsight() {
  return useMutation<SessionInsightResponse, Error, SessionInsightRequest>({
    mutationFn: (request) =>
      ProfessionalPsychologyAIService.generateSessionInsight(request),
  });
}
```

### 4.4 Disclaimer

`<AiDisclaimer variant="detailed" />` no rodapé do painel, sempre que houver insights renderizados.

---

## 5. Compliance / consent

| Item | Onde mexer |
|------|------------|
| Termo de consent do paciente | Adicionar cláusula sobre processamento por IA no fluxo de vinculação app paciente |
| Termo de uso profissional | Onboarding psi precisa incluir aceite de responsabilidade clínica + uso de IA assistiva |
| LGPD art. 20 | Endpoint de "explicação" (`GET /psychology/insights/:id/explanation`) opcional V2 |
| Anonimização | Hash de UUID no prompt — implementado no `PsychologyContextService` |
| Auditoria | Tabela `psychology_ai_insights` com prompt_hash + response_json — retenção 5 anos (compliance CFP) |

---

## 6. Rollout

| Fase | Escopo |
|------|--------|
| **V0 (interno)** | Liga só pra conta `psicology@nymos.app` — testar prompt, ajustar, medir custo real |
| **V1 (alpha Pro)** | 5–10 psicólogos Pro, feature flag manual, coletar feedback |
| **V2 (GA Pro)** | Rollout pra todos os Pro, dashboard de custo, configuração de budget por admin |
| **V3 (opcionais)** | Integração com áudio (IA Escriba para preencher SOAP automaticamente), endpoint de explicação LGPD |

---

## 7. Esforço estimado

| Etapa | Esforço | Quem |
|-------|---------|------|
| Backend agent + service + rota + tests | 1.5 dias | Backend dev |
| Frontend painel + hook + integração | 1 dia | Frontend dev |
| Termos consent + onboarding | 0.5 dia | Product + jurídico |
| QA + ajuste de prompt | 0.5 dia | Self |
| **Total MVP V0** | **~3.5 dias** | — |

---

## 8. Métricas de sucesso (V1)

| Métrica | Target |
|---------|--------|
| Adoção: % psi Pro que usa pelo menos 1x/semana | ≥40% |
| Aproveitamento: % cards `[Aplicar]` / total cards gerados | ≥30% |
| Satisfação: NPS ad-hoc no painel ("útil?" 👍/👎) | ≥60% positivo |
| Custo médio por psi/mês | ≤R$ 8 |
| Incidentes de hipótese errada/perigosa reportados | 0 |

---

## 9. Riscos e mitigação

| Risco | Mitigação |
|-------|-----------|
| Psicólogo apoia decisão clínica em IA cegamente | Disclaimer + confidence levels explícitos + treinamento no onboarding |
| Hallucination (IA inventa CID, score, sintoma) | Prompt explícito + structured output + JSON schema validation |
| Vazamento de dado sensível em log | Anonimização no service + log filter (não logar prompt completo, só hash) |
| Custo explode | Budget enforcement por feature + limite diário + alerta admin |
| CFP muda regulamentação | Audit table permite rollback total + opt-out por psi |

---

## 10. Próximas decisões pendentes

- [ ] **Validar com 1–2 psicólogos clínicos**: o output proposto (padrões/hipóteses/homework) é útil ou intrusivo?
- [ ] **Definir limite diário default**: 20/dia/psi é razoável?
- [ ] **Termo de consent**: redação revisada por advogado?
- [ ] **Decisão**: implementar primeiro a feature inteira, ou começar só com "Padrões longitudinais" (mais seguro, menos custo)?

---

## Referências

- Backend infra reusada: `backend/api/modules/ai-chat/agents/tracked-anthropic.ts`
- Padrão de agent: `backend/api/modules/ai-chat/agents/food-recognition.agent.ts`
- Service tracking: `backend/src/services/ai-usage-tracker.ts`, `ai-budget.service.ts`
- Disclaimer: `frontend/src/components/ai/ai-disclaimer.tsx`
- Spec da UI: `product/sections/sessao-psi/spec.md` (seção "IA Insights Panel")
- Resolução CFP 11/2018 (telepsicologia)
- LGPD art. 11 (dado sensível), art. 20 (decisão automatizada)
