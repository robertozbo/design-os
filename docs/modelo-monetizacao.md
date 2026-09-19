# Modelo de Monetização — Nymos

> Tese de receita do produto. Define quem paga, pelo quê, e como os tiers se relacionam.
> **Status:** rascunho pra revisão · não implementado nos specs ainda.

---

## Narrativa do produto

O Nymos **nasceu B2C**: um app pro usuário monitorar saúde — métricas de wearables (Apple Health, Garmin, Mi, Strava), diário alimentar, questionário de humor, exames OCR, bioimpedância. O paciente é o usuário primário e o app é completo sozinho.

**Depois** vieram as parcerias com profissionais de saúde (nutri, médico, psicólogo, personal). O profissional usa o app pra se conectar com o paciente, acompanhar entre consultas e ver dados que antes só existiam em silos.

**Em paralelo**, surgiu o vertical SST/NR-1 (B2B enterprise) — empresas comprando o painel agregado pra cumprir a NR-1 sobre riscos psicossociais.

Essa narrativa importa porque define **quem é o produto e quem é o cliente** em cada vertente:

| Vertente | Produto | Cliente |
|---|---|---|
| B2C | App do paciente (acesso grátis) | Paciente |
| B2B2C | Pacientes vinculados (carteira) | Profissional |
| B2B | Painel SST + conformidade NR-1 | Empresa |

---

## Quem paga, pelo quê

### Paciente — Free (default) + Plus opcional (plano B)

O paciente baixa o app, se cadastra, e tem **acesso limitado** ao core. Existem **dois caminhos** pra destravar a IA:

1. **Caminho principal — vincular profissional ativo** → IA liberada de graça pro paciente (paga pelo seat)
2. **Caminho secundário (plano B) — assinar Plus avulso** → paciente paga assinatura mensal/anual via Stripe

A UX sempre apresenta vínculo **primeiro** e Plus como link discreto secundário (ver "Hierarquia do gate" abaixo).

**Liberado sempre (sem IA pesada, sem custo variável significativo):**
- ✅ Métricas integradas (Apple Health, Garmin, Mi, Strava) — leitura/sync grátis
- ✅ Diário alimentar **manual** (digitar refeição)
- ✅ Check-in de humor (entrada do usuário, sem análise IA do texto)
- ✅ **Foto de balança comum → extração só do peso** (OCR simples e barato, hook de hábito diário)
- ✅ Metas e progressão (regras simples, sem insights por IA)
- ✅ **Agenda** — visualização sempre acessível, mesmo vazia (sem profissional vinculado, mostra estado vazio com CTA pro diretório)
- ✅ Diretório de profissionais (`/profissionais`) e solicitação de vínculo

**Travado por padrão (tudo que envolve IA):**
- 🔒 **ai-chat** — módulo principal de conversa com IA
- 🔒 **Foto de refeição** — análise IA da foto (kcal/macros)
- 🔒 **Fotos corporais** — captura + análise IA (composição/postura/progressão)
- 🔒 **Exames laboratoriais** — OCR/extração IA do PDF pra valores estruturados
- 🔒 **Exames de bioimpedância** — leitura IA do laudo completo (% gordura, massa magra, hidratação, segmentos) · **só peso continua grátis via foto de balança comum**
- 🔒 **Análise de sentimento do diário reflexivo** (texto → emoção/tema)
- 🔒 **Insights cruzados e sugestões inteligentes** (correlações sono/humor/HRV)

**Para desbloquear:** ou **vincula um profissional ativo** (gratuito pro paciente, caminho principal), ou **assina Plus avulso** (caminho secundário, ver tabela do Plus abaixo).

### Plano Plus (paciente avulso) — plano B

| Campo | Valor |
|---|---|
| Preço sugerido | R$ 29,90/mês ou R$ 299/ano (~17% off) — calibrar |
| Cobrança | Stripe (Subscription, recorrente) |
| Inclui | Tudo do core grátis + **todos os módulos de IA listados acima** |
| Limites | Mesmo throughput de IA de um paciente vinculado (sem cap rígido inicial; rate-limit anti-abuso) |
| Cancelamento | A qualquer momento, mantém acesso até final do ciclo |
| Conflito com vínculo | Convivem — paciente Plus que vincula profissional **mantém os dois pagando** (decisão já tomada, ver Riscos #4) |

**Quando Plus é o caminho certo pro paciente:**
- Atleta amador disciplinado que treina sozinho
- Quem já tem nutri/médico **fora do Nymos** e só quer a IA pra rastreio próprio
- Cidade pequena sem profissional Plus+ no diretório (ainda)
- Quem não quer dar consentimento de dados a profissional algum — só uso pessoal

**Princípio de preço:** Plus tem que custar o suficiente pra que vincular continue parecendo melhor negócio pro paciente. Se Plus ficar barato demais, mata o funil do diretório → reduz valor do seat profissional → quebra o modelo todo.

### Ponto de entrada único da IA — ícone na tab bar

A IA do Nymos vive atrás de **um único ícone na base da tela** (tab bar central). Esse ícone abre o "Hub de IA" que agrupa todos os módulos travados:

```
Ao tocar no ícone IA →
  Tem profissional ativo vinculado OU assinatura Plus ativa?
    ✅ sim  →  abre o Hub de IA (ai-chat + atalhos pra foto refeição,
                fotos corporais, OCR de exame, bioimpedância, insights)
    ❌ não  →  gate fullscreen com hierarquia clara:

                ╭──────────────────────────────────────────╮
                │  A IA do Nymos é liberada de 2 formas:   │
                │                                          │
                │  ① VINCULE UM PROFISSIONAL  (recomendado)│
                │     "Grátis pra você. Seu nutri/médico   │
                │      acompanha junto."                   │
                │     [Ver profissionais]  ← CTA primário  │
                │     [Já tem um? Buscar por email]        │
                │                                          │
                │  ───────────── ou ──────────────         │
                │                                          │
                │  ② Assine Plus por R$ 29,90/mês          │
                │     "Use a IA sozinho, sem profissional."│
                │     [Assinar Plus]  ← link discreto      │
                ╰──────────────────────────────────────────╯
```

### Hierarquia do gate

A ordem visual é deliberada:

1. **Caminho principal — vincular profissional** ocupa o topo, com CTA primário visível e copy enfatizando "grátis"
2. **Plus** entra **embaixo**, como link de texto ou botão ghost, com preço explícito (pra reforçar que vincular é o melhor negócio)
3. **Nunca inverter** essa hierarquia — o modelo de receita depende do funil profissional ser dominante

**Vantagens dessa arquitetura:**
- **Um gate só** — não precisa replicar lógica de bloqueio em cada feature
- **Vitrine clara** da IA — paciente sempre vê o ícone, sempre lembra do valor que ganha
- **Funnel direto** — toque no gate cai no diretório (ou no checkout Plus, se insistir)
- **Profissional valorizado** — o gate menciona o profissional como "destravador" gratuito
- **Plus como saída de emergência** — captura quem ia churnar sem nenhuma opção

Cada módulo individual (foto refeição, OCR exame, etc.) também pode ter seu ponto de entrada em outras seções (ex: tela de exames tem botão "Extrair valores com IA"), mas **todos passam pela mesma validação** de vínculo ativo **ou** Plus ativo antes de chamar a IA.

### Profissional — Seat por tier com limite de pacientes

| Tier | Limite de pacientes | Acesso |
|---|---|---|
| **Free** | 0 (só perfil próprio) | Cadastro, sem vínculo, **não aparece no diretório** |
| **Plus** | até ~30 | Dashboard, vínculo de pacientes, **aparece no diretório `/profissionais`**, IA básica |
| **Pro** | até ~100 | Tudo do Plus + IA avançada, analytics, destaque visual no diretório |
| **Clínica** | ilimitado | Tudo do Pro + multi-profissional, white-label leve, suporte dedicado — **preço por faixa de médicos, ver abaixo** |

Os números são chute inicial — a calibragem real depende do custo de IA por paciente (ver seção "Calibragem").

#### Tier Clínica — faixa por nº de médicos

O eixo de preço da Clínica **não é limite de pacientes** (é ilimitado), e sim **quantos médicos** o
workspace tem. Só médico é seat pago:

| Faixa | Mensalidade | Preço efetivo/médico |
|---|---|---|
| até 1 médico | R$ 49,90 | R$ 49,90 |
| até 3 médicos | R$ 129,90 | R$ 43,30 |
| até 6 médicos | R$ 229,90 | R$ 38,30 |
| até 12 médicos | R$ 399,90 | R$ 33,30 |
| acima de 12 | sob consulta | — |

**Recepção e admin são ilimitados e gratuitos.** Duas razões: (1) quem gera receita e consome IA é o
médico — secretária e gestor são custo operacional da clínica, não do Nymos; (2) cobrar por seat
administrativo empurra a clínica a compartilhar o login do médico com a secretária, o que destrói a
trilha de auditoria e cria exposição de LGPD justamente no papel que **não** deveria ver prontuário.

A faixa embute desconto por volume (R$ 49,90 → R$ 33,30 por médico), então crescer dentro do Nymos
fica mais barato que sair. O upgrade é um evento explícito: ao tentar convidar o médico que estoura a
faixa, a tela de Equipe mostra o preço da faixa seguinte.

> **Aberto:** anual com desconto, período de teste, e o que acontece com o vínculo de pacientes de um
> médico removido da clínica.

### Empresa (SST/NR-1) — Contrato B2B

Vertical separado, fora do flow B2C. Modelo de contrato por número de trabalhadores + módulos contratados (Avaliação de Risco, Plano de Ação, Diagnóstico do Líder, Relatório de Conformidade). **Fora do escopo deste doc** — mantido aqui só pra mostrar que existe uma terceira fonte de receita independente.

---

## A regra-chave: vínculo ativo destrava IA (ou Plus avulso)

**Paciente conectado a profissional ativo → IA liberada automaticamente, sem cobrança extra pro paciente. Desvinculou → trava de volta (a menos que tenha Plus avulso ativo).**

Por que vínculo é o caminho principal:

- O profissional **precisa** que o paciente tire foto da refeição com análise por IA (nutri) ou faça upload de exame com OCR/IA (médico) pra ter dado estruturado pra trabalhar. Sem essas features, o vínculo perde sentido.
- O custo da IA pra esse paciente está **embutido no seat do profissional**.
- Vira **pitch comercial** do profissional: "comigo você usa a IA do Nymos sem pagar".
- Cria **funil principal**: paciente quer IA → procura profissional → vira receita maior que Plus avulso.

### Estados do paciente vs IA

| Situação | ai-chat / IA |
|---|---|
| Cadastrado, sem profissional, sem Plus | 🔒 Bloqueada (gate com 2 CTAs: vincular profissional [primário] ou assinar Plus [secundário]) |
| Vínculo com profissional ativo | ✅ Liberada (paga pelo seat do profissional) |
| Plus avulso ativo, sem profissional | ✅ Liberada (paga pela própria assinatura) |
| Plus ativo + vínculo ativo | ✅ Liberada (mantém os dois pagando — decisão registrada em Riscos #4) |
| Vínculo cancelado, sem Plus | 🔒 Volta a bloquear (dados ficam salvos, paciente é avisado, pode revincular ou assinar Plus) |
| Plus cancelado, com vínculo ativo | ✅ Continua liberada (vínculo cobre) |

**O que conta como "profissional ativo":**
- Profissional com tier Plus/Pro/Clínica vigente (assinatura ativa, não em past_due nem cancelada)
- Vínculo com consentimento granular ativo do lado do paciente
- Profissional não atingiu o limite do tier (ou está dentro)

**O que conta como "Plus do paciente ativo":**
- Subscription Stripe `active` ou `trialing`
- Não em `past_due`, `canceled` nem `unpaid`

---

## Por que o paciente Free é o motor, não o defeito

Pacientes Free que **nunca** vinculam profissional ainda são valiosos:

1. **Pool de demanda** — quanto mais paciente ativo, mais valioso o seat do profissional. Análogo: LinkedIn (free user) ↔ recruiter (paga); Strava (free) ↔ coach/marca (paga).
2. **Funil de longo prazo** — paciente saudável hoje pode buscar nutri em 6 meses, psicólogo em 1 ano. Já está dentro, com histórico. **CAC zero quando converter.**
3. **Dado agregado e SEO** — cada paciente ativo melhora benchmark/IA e leva o app pro próximo via boca-a-boca. Diretório `/profissionais` ganha SEO orgânico.

A pergunta certa **não** é "o paciente Free vale a pena?" — é **"qual % de pacientes Free vincula um profissional em 12 meses?"**

| Conversão 12m | Diagnóstico |
|---|---|
| > 10% | Modelo saudável |
| 5–10% | Funciona, ajustar funil |
| 2–5% | Reavaliar diretório, posicionamento, descoberta de IA |
| < 2% | Repensar (parceria com plano de saúde? ads? rever modelo?) |

---

## Calibragem — quanto cobrar pelo seat profissional e Plus

A precificação do seat profissional **precisa cobrir o custo de IA dos pacientes vinculados** + margem. O Plus avulso captura quem escaparia do funil, mas **não pode ser barato a ponto de canibalizar** o caminho do profissional.

Fórmula simples:

```
Seat profissional ≥ (limite_pacientes × adoção_IA × custo_IA_por_paciente_mês) × (1 + margem)
```

Onde **adoção_IA** = % de pacientes vinculados que efetivamente usam IA no mês (estimar entre 40–70%).

Exemplo hipotético (números a confirmar):

| Tier | Limite | Adoção esperada | Custo IA total | Piso de seat (margem 60%) |
|---|---|---|---|---|
| Plus | 30 | 50% = 15 ativos | 15 × R$ 8 = R$ 120 | R$ 192/mês |
| Pro | 100 | 50% = 50 ativos | 50 × R$ 8 = R$ 400 | R$ 640/mês |
| Clínica | ilimitado | varia | varia | contratado |

Valores reais saem só com dados pós-MVP.

### Plus avulso — sanity check de preço

| Item | Valor |
|---|---|
| Custo IA estimado por paciente Plus ativo | R$ 8/mês |
| Preço sugerido Plus | R$ 29,90/mês |
| Margem bruta | ~73% (sem CAC) |
| Anual com desconto ~17% | R$ 299/ano |

**Regra de ouro:** Plus mensal tem que ser **≥ 2× o preço efetivo "por paciente" do seat profissional**. Ex: se Plus profissional cobra R$ 192/mês pra 30 pacientes (= R$ 6,40/paciente/mês), o Plus avulso a R$ 29,90 fica ~4–5× mais caro. Vincular continua sendo claramente o melhor negócio pro paciente.

---

## Telemetria e atribuição de custo

A única forma de saber se Plus e seats estão lucrativos **por usuário** é instrumentar cada chamada de IA e atribuir o custo à carteira correta. Sem isso, voa cego e descobre o problema só quando a margem agregada explode.

### Princípios

1. **Toda chamada de IA passa por um único gateway** (`AIGateway.invoke()`). Sem gateway, sem log = sem dado.
2. **Custo calculado na hora da chamada** (tokens × preço do provider × taxa USD→BRL congelada do dia).
3. **Atribuição clara de carteira** — cada chamada pertence a uma fonte de receita só.
4. **Provider e preço versionados** — preço do OpenAI/Anthropic muda, custo histórico tem que refletir o vigente no dia da chamada.

### Modelo de dados

Tabela `ai_usage` (uma linha por chamada de IA):

```ts
ai_usage {
  id              uuid
  user_id         uuid           // paciente que disparou
  professional_id uuid | null    // se foi via vínculo, qual profissional "pagou"
  source          enum           // 'patient_plus' | 'vinculo' | 'enterprise'
  feature         enum           // 'food-photo' | 'lab-ocr' | 'body-photo' |
                                 // 'bioimpedance' | 'ai-chat' | 'diary-sentiment' |
                                 // 'cross-insights'
  provider        text           // 'openai-gpt-4o' | 'anthropic-claude-opus-4' | etc
  prompt_tokens   int
  output_tokens   int
  image_tokens    int            // pra vision
  cost_usd        numeric(10,6)
  cost_brl        numeric(10,4)  // cost_usd × taxa do dia
  latency_ms      int
  status          enum           // 'success' | 'error' | 'rate_limited'
  created_at      timestamptz
}
```

### Regra de atribuição (paciente com Plus + vínculo)

Quando o paciente tem **só Plus** ou **só vínculo**, atribuição é trivial.

Quando tem **os dois ativos**:

**Decisão: "vínculo primeiro"** — se vínculo ativo, atribui ao seat do profissional. Plus do paciente vira "redundante" no custo daquele mês.

| Razão | Impacto |
|---|---|
| Regra mais simples de implementar | Lookup direto, sem condicional complexo |
| Profissional carrega o custo do paciente que ele "encarteirou" | Margem do seat reflete realidade do uso |
| Plus do paciente continua sendo seguro (não some se vínculo cair) | Paciente mantém valor percebido |

### Views agregadas

Materialized views atualizadas de hora em hora:

| View | Granularidade | Uso |
|---|---|---|
| `v_ai_cost_per_patient_month` | user × mês × source | Identifica heavy users no Plus |
| `v_ai_cost_per_professional_month` | professional × mês | Margem por seat, top paciente consumidor |
| `v_ai_cost_per_feature_month` | feature × mês | Decide o que otimizar (provider, prompt, cache) |
| `v_ai_margin_per_user_month` | user × mês | Custo vs receita atribuída, % margem |

### Alertas operacionais

| Trigger | Ação |
|---|---|
| Paciente Plus com custo > 80% da assinatura no mês | Alerta interno (revisar cota) |
| Profissional com seat negativo (custo > preço pago) | Alerta + plano de ação (sugerir upgrade ao profissional) |
| Feature com custo médio crescendo > 20% mês/mês | Revisar provider/prompt/cache |
| Usuário com > 50 análises em 24h | Rate-limit anti-abuso |

### Interface admin

Página de monitoramento dedicada — ver spec em `product/sections/admin-custos-ia/spec.md`. Cobre 3 visões: por paciente Plus, por profissional, por feature. Dashboard de margem em (quase) tempo real.

---

## Decisão: um app, não dois (2026-09-19)

**Pergunta:** faz sentido publicar dois aplicativos — uma versão paga e outra grátis pra
clínicas e seus pacientes?

**Decisão: não.** Um app do paciente, com free e pago como estados de conta dentro dele.

Três razões, na ordem em que doem:

1. **O funil morre.** O paciente free é o ativo do modelo — ele vira receita ao vincular
   um profissional (ver "Por que o paciente Free é o motor"). Num app separado "de
   clínica", o diretório e o gate ficam do outro lado da App Store: o paciente que chega
   no gate não tem pra onde ir sem reinstalar.
2. **A conversão acontece justamente na troca.** Paciente que assina Plus teria que mudar
   de app, refazer login e re-autorizar Apple Health / Garmin / Health Connect. É pedir
   três passos de atrito no único momento em que ele já decidiu pagar.
3. **Custo duplicado e permanente:** dois reviews de loja, dois ASO, dois esquemas de deep
   link, dois canais de suporte — e o vínculo clínica↔paciente atravessando os dois.

### A separação que faz sentido é papel, não preço

| Eixo | Separa em apps? | Porquê |
|---|---|---|
| Free vs. pago | ❌ Não | É estado de conta. O gate de IA já resolve (ver "Hierarquia do gate") |
| Paciente vs. profissional/clínica | ✅ Sim | Jornadas sem sobreposição: uma é diário de saúde, outra é carteira de pacientes |

É o recorte que o produto já tem: mobile pro paciente, web pro profissional e pra clínica.

### Consequência de billing: venda de clínica fica na web

Assinatura vendida **dentro** do app iOS entra na taxa da Apple (15–30%). Então:

- **Plus do paciente** — compra no app, taxa da loja assumida (é compra por impulso no gate;
  tirar do app custaria mais em conversão do que a taxa).
- **Seat profissional e contrato de clínica** — fecham **na web**, fora do app. B2B com
  cartão ou boleto no Stripe, sem intermediação de loja.

---

## Consequências práticas pros specs atuais

O modelo atual (`product-mobile/sections/plano`) assume **3 tiers do paciente (Free/Plus/Pro)**. Precisa virar **2 tiers (Free vs Plus)** com gate único centrado em IA, e o `upgrade` é mantido (Plus continua tendo Stripe checkout).

Mudanças necessárias:

| Spec | Mudança |
|---|---|
| `product-mobile/sections/plano/spec.md` | **Reformular pra 2 tiers (Free vs Plus)**. Tira o Pro do paciente. Plus = "IA do Nymos liberada sem profissional". Mostra também o estado de vínculo ("ou ative IA grátis vinculando um profissional"). |
| `product-mobile/sections/upgrade/spec.md` | **Mantém** — fluxo de checkout Stripe pra Plus avulso. Ajustar copy pra reforçar que é o "plano B" (vínculo é o caminho preferencial). |
| `product-mobile/sections/plano-expirado/spec.md` | **Mantém + amplia** — gate dispara quando Plus expira **ou** vínculo é perdido (com CTAs separadas: renovar Plus ou achar outro profissional). |
| `product/sections/profissionais/spec.md` | Reforçar que Free profissional não lista. Tiers Plus/Pro/Clínica com limite de pacientes explícito. Adicionar mensagem clara pro paciente: "vinculando você ganha acesso à IA sem pagar". |
| `product/sections/my-professionals/spec.md` | Documentar que vínculo ativo libera IA pro paciente. Estado visual claro: "IA do Nymos: ✅ ativa via Dr. X" ou "via assinatura Plus" ou "via ambos". |
| `product/sections/configura-es-paciente/spec.md` | Card "Minha IA" mostra fonte: "Liberada pelo vínculo com Dr. X", "Liberada pela assinatura Plus", "Liberada por ambos" ou "Bloqueada — vincule um profissional ou assine Plus". |
| `product/sections/configura-es/spec.md` (profissional) | Card de seat: tier atual, X de N pacientes vinculados, "Upgrade pra Pro" quando aproximar do limite. |
| Mobile shell / navegação | Tab "Plano" do paciente vira **"IA / Plano"** ou incorpora ao "Mais", mostrando origem da liberação. Ícone IA central na tab bar (ver "Hierarquia do gate"). |

Specs novas que faltam:

- `product/sections/plano-profissional/spec.md` (ou similar) — gestão do seat do profissional: tier atual, contador de pacientes, upgrade/downgrade, billing, faturas Stripe.
- `docs/precificacao-detalhada.md` — uma vez calibrado com custo real de IA, fechar a tabela de preços.

---

## Riscos e perguntas em aberto

1. **Profissional cancela seat** — vínculos viram "pausados" por 30 dias (carência pra reativação ou troca de profissional), depois desligam e paciente perde acesso a IA (a menos que tenha Plus avulso). Dados nunca são apagados. Notificação clara em todas as etapas, incluindo CTA "ou assine Plus pra manter sua IA".

2. **Profissional excede o limite** — não permite vincular o próximo paciente até fazer upgrade. UX no painel profissional: card "Você atingiu 30/30 — vincular o próximo libera upgrade pra Pro" com CTA direto.

3. **Paciente vinculado a 2 profissionais** (ex: nutri + psicólogo) — cada profissional conta esse paciente no próprio limite (1× pra cada). Custo de IA na infra é compartilhado, mas comercialmente cada um paga pelo seu seat. Decidir se há regra anti-abuso (paciente vinculado a 5+ profissionais simultâneos, etc.).

4. **Paciente Plus que vincula profissional** — **decidido: mantém os dois pagando**. Paciente continua com Plus normalmente, profissional paga seu seat normalmente. Sem pausa, sem desconto, sem cancelamento automático. Razão: simplicidade operacional, evita confusão pós-desvínculo, e o paciente que já paga Plus demonstra disposição a pagar — não é prioridade descontar. **Mostrar UI sutil:** "Sua IA está coberta por 2 fontes — se cancelar uma, a outra continua ativa" (pra que o paciente saiba e possa optar por cancelar Plus se quiser).

5. **Tier Free do profissional faz sentido?** — usado pra cadastro/onboarding antes de pagar. Mas se ele nunca paga, é só custo. **Alternativa a decidir:** trial de 14 dias do Plus em vez de Free permanente. Profissional baixa, experimenta com 1–2 pacientes, depois precisa assinar.

6. **Paciente "passou pela IA" via profissional e depois desvinculou (e sem Plus)** — deve manter histórico de conversas/análises geradas? Sugestão: sim, ler é grátis, gerar nova mensagem precisa de vínculo ativo ou Plus. Mantém valor de longo prazo pro paciente e cria saudade da feature.

7. **Canibalização do Plus sobre o vínculo** — se Plus for barato demais ou bem posicionado demais no gate, paciente pode preferir Plus e o funil profissional seca. **Mitigações já no modelo:** (a) preço Plus 4–5× mais caro que custo "por paciente" no seat, (b) hierarquia visual sempre vínculo primeiro, (c) copy do gate enfatiza "grátis" no vínculo. Monitorar métrica chave: **taxa de Plus avulso vs vínculo entre quem chega no gate**. Se Plus passar de ~30%, revisitar preço/copy.

8. **Diretório de profissionais sem demanda real** — se paciente não chega no diretório, profissional não converte. **Onde colocar o pitch do diretório no app**: banner no topo do dashboard? Gate da IA? Sugestão no diário ("registre sua refeição com IA — vincule um profissional pra liberar")?

9. **Empresa NR-1 que quer dar IA pros funcionários** — fora do escopo deste doc, mas vira oportunidade B2B (mesma lógica do profissional: empresa "vincula" funcionários e libera IA).

---

## Resumo executivo

- **Paciente:** core sempre grátis (métricas via wearables, diário manual, humor, peso via foto de balança, metas, agenda mesmo vazia, diretório). **Toda a IA** — ai-chat, foto de refeição, fotos corporais, OCR de exame, bioimpedância, sentimento do diário, insights — **concentrada em um único ícone na tab bar**, com **dois caminhos pra destravar:**
  - **① Vincular profissional ativo (recomendado)** → IA grátis pro paciente, profissional paga via seat
  - **② Assinar Plus avulso (plano B)** → R$ 29,90/mês via Stripe, sem precisar de profissional
- **Profissional:** paga seat com limite de pacientes (Plus ~30, Pro ~100, Clínica ilimitado). Seat embute o custo da IA dos pacientes vinculados. Sem seat ativo, não aparece no diretório nem libera IA pros seus pacientes.
- **Empresa SST:** vertical separado, contrato B2B (NR-1).
- **Regra crítica:** vínculo ativo **ou** Plus ativo = IA liberada. Os dois ativos = paga os dois. Nenhum dos dois = trava.
- **Hierarquia inegociável do gate:** vínculo sempre apresentado primeiro com CTA primário, Plus aparece embaixo como link secundário. Se essa hierarquia inverter, o modelo quebra.
- **Funil principal:** paciente baixa app → usa core → quer IA → vê gate → 70%+ vai pra `/profissionais` (vínculo grátis) → profissional captura cliente. Plus captura os 30% restantes que não convertem via vínculo.
- **Um app só pro paciente** (decisão 2026-09-19): free e pago são estados de conta, não aplicativos separados. A separação por app é por **papel** — paciente (mobile) vs. profissional/clínica (web). Seat e contrato de clínica são vendidos **na web**, fora da taxa de loja; só o Plus do paciente é compra in-app.

---

*Atualizado: 2026-09-19 · próximo passo: validar números de calibragem (custo IA, taxa de adoção, preço Plus) e decidir se Free do profissional vira trial de 14 dias.*
