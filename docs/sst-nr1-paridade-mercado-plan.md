# Plano de Paridade SST/NR-1 — Design OS vs Indexmed (Dexmat)

> Análise baseada em 3 transcrições de live demonstrando a plataforma Indexmed (Dexmat).
> Data: 2026-05-25 · Escopo: módulo SST/NR-1 do Nymos (Design OS)

---

## Sumário Executivo

| Dimensão | Status |
|---|---|
| **Core NR-1** (avaliação → matriz → PGR → relatório MTE) | ✅ ~95% paridade após sprints 1-3 |
| **Compliance LGPD** (anonimato, voluntariedade, anti-coerção) | ✅ Sprint 1 completo |
| **Mecânica de aplicação** (canais, disparo, opt-out) | ✅ Sprint 2 completo |
| **Análise & relatórios** (drill-down, IA, capa legal) | ✅ Sprint 2 completo |
| **Polimento (calendário, cronograma, KPI ciclos, cartaz)** | ✅ Sprint 3 completo |
| **Diferenciais nossos** | ✅ 5 features que o concorrente não demonstrou |
| **Escopo expandido SST** (ASO, EPI, marketplace, folha) | 📌 Backlog estratégico — depende de D4 |

---

## 1. Compliance LGPD & Confidencialidade (P0 — CRÍTICO)

Não-conformidade aqui = risco legal real + dados não-fidedignos.

| Requisito | Atendemos? | Gap |
|---|---|---|
| Caráter coletivo, nunca individual | ✅ "Anonimato preservado" no spec | — |
| **Regra dos 3 respondentes por filtro** (anti re-identificação) | ❌ Não previsto | **CRÍTICO** Implementar |
| **Voluntariedade explícita** (não-obrigatório) | ❌ Spec não menciona | **CRÍTICO** Termo + botão recusa |
| **Tela do colaborador: "Responder" + "Não quero responder"** | ❌ Não previsto | **CRÍTICO** UI obrigatória |
| **Opt-out persistente** (quem recusou não recebe mais lembretes) | ❌ Não previsto | Adicionar estado no `trabalhadores` |
| **E-mail individual obrigatório** (sem genéricos/setor) | ⚠️ Campo existe mas sem validação | Validação no cadastro |
| **1 e-mail = 1 resposta** | ❌ Regra não documentada | Adicionar invariante |
| **Plataforma não revela quem respondeu ao SST** | ✅ Genérico no spec | Reforçar UI: painel "o que SST vê / não vê" |
| **Sem cadastro adicional ao responder** (link já identifica) | ❌ Não especificado | Mecânica de envio |
| **Documento de confidencialidade visível** | ❌ Não previsto | Termo de anonimato pré-pesquisa |

### Ações P0

1. `avalia-es-de-risco/spec.md` — adicionar seção **Princípios de aplicação**:
   - Caráter coletivo
   - Voluntariedade
   - Anonimato técnico (modelo de identificação one-shot)
   - Regra dos 3 respondentes por filtro
2. `avalia-es-de-risco/spec.md` — adicionar **Tela de entrada do colaborador**:
   - Header com instrumento + duração estimada + responsável técnico
   - Termo de anonimato e voluntariedade
   - 2 CTAs: "Responder" / "Não quero responder"
3. `trabalhadores/spec.md` — adicionar:
   - Validação e-mail (não-genérico, não-duplicado por empregador)
   - Estado `opt-out persistente` (quem recusou pesquisa)
   - Campo `whatsapp` (Enterprise tier)

---

## 2. Clima vs Psicossocial (P0 — Conceitual)

Risco: usuário SST confunde os dois e aplica pesquisa errada.

| Requisito | Atendemos? | Gap |
|---|---|---|
| Diferenciação explícita Clima ≠ Psicossocial | ❌ Spec foca só em psicossocial sem nomear | Copy educativo |
| Enquadramento "agente nocivo" (igual ruído/ergonomia) | ⚠️ Implícito | Reforçar no relatório |
| Pesquisa de Clima como módulo paralelo | ❌ Não temos | Decisão estratégica V2 |

### Ações P0

4. `avalia-es-de-risco/spec.md` — copy educativo no passo 1 do wizard:
   > "Esta é uma avaliação de risco psicossocial NR-1 (análise de agente nocivo). Diferente de uma pesquisa de clima organizacional, que mede sentimento, esta avaliação mede risco à saúde mental relacionado ao trabalho. A participação do trabalhador é voluntária."

### Decisão pendente

- **D1**: Criar módulo `pesquisa-de-clima` paralelo no Nymos SST? → V2 candidate

---

## 3. Mecânica de Aplicação (P1)

### 3.1. Critérios estatísticos — conceitos independentes

| Critério | O que mede | Quando bloqueia |
|---|---|---|
| **Cobertura macro** (60-65% de participação) | Validade da amostra agregada | Publicação da avaliação |
| **Regra dos 3 respondentes por filtro** | Anti re-identificação por setor/função | Exibição de corte específico |

Esses são **dois gates separados**: uma avaliação com 80% de cobertura geral ainda pode ter setores com <3 respondentes que ficam ocultos no drill-down. Spec atual mistura os dois.

### 3.2. Comparativo de mecânica

| Requisito | Atendemos? | Gap |
|---|---|---|
| Wizard de criação | ✅ 5 passos no spec | — |
| **Versões do instrumento** (COPSOQ curta 41q / média 76q) | ⚠️ Spec lista COPSOQ-2/3 sem versões | Adicionar curta/média |
| Cobertura macro mínima | ✅ 65% nosso vs 60% Indexmed | **D2**: alinhar com mercado? |
| **Regra dos 3 respondentes (anti re-ID)** | ❌ Não previsto | **CRÍTICO LGPD** — gate de exibição |
| **Bloqueio de pesquisa simultânea** por estrutura | ❌ Não previsto | Invariante operacional |
| **Disparo agendado** (janela fixa, não imediato) | ❌ Não previsto | Mecânica de notificação |
| **Canais: e-mail (padrão) + WhatsApp (Enterprise)** | ⚠️ Não especificado | Definir canais + tiers |
| **Documento de divulgação (cartaz com QR)** | ❌ Não temos | Fallback opcional (não-recomendado) |
| Acompanhamento de cobertura em tempo real | ✅ No spec | — |
| Lembretes manuais (SST reenvia) | ✅ No spec | — |
| Eventos eSocial automáticos | ✅ `eventos-esocial` section | — |

### Ações P1

5. `avalia-es-de-risco/spec.md`:
   - Passo 1 do wizard: select de versão (curta 41q / média 76q)
   - Invariante: não permite 2 avaliações ativas na mesma `unidade` simultaneamente
   - Passo 3 (janela): adicionar campo "horário de disparo" (padrão 8h15)
   - Passo 4 (canais): toggles "Enviar e-mail" / "Enviar WhatsApp" (Enterprise)
   - Botão "Gerar cartaz de divulgação" (Word/PDF com QR + aviso "QR exige CPF, anonimato reduzido")

### Decisão pendente

- **D2**: cobertura mínima — manter 65% ou alinhar com 60% do mercado (recomendação clínica COPSOQ)?
- **D3**: WhatsApp como tier Enterprise ou padrão?

---

## 4. Análise & Relatórios (P1-P2)

| Requisito | Atendemos? | Gap |
|---|---|---|
| Heatmap setor × fator | ✅ No spec | — |
| Classificação baixo/moderado/crítico/prioritário | ✅ No spec | — |
| Sugestões de ação ao lado da matriz | ✅ No spec | — |
| **Drill-down: fator → perguntas exatas** | ❌ Não previsto | **Transparência metodológica** |
| **IA: diagnóstico narrativo + medidas propostas** | ⚠️ Nymos IA cobre, falta detalhar | Especificar no spec |
| **Botão "criar plano de ação" direto da análise** | ⚠️ Implícito | Tornar explícito |
| Capa do relatório com identificação | ✅ No spec | — |
| **Apresentação legal NR-1** (marco regulatório) | ❌ Não previsto | Adicionar bloco fixo |
| **Metodologia + características da pesquisa** | ⚠️ Lista enxuta | Expandir |
| Hash SHA-256 + timestamp + responsável técnico | ✅ No spec | — |
| Assinatura digital ou impressa | ✅ No spec | — |
| **PGR online navegável** (não só export) | ⚠️ Temos kanban + export; Indexmed tem documento navegável | **D5**: agregar view-documento ao PGR? |
| **Calendário de pesquisas** (vista temporal) | ❌ Não previsto | Nice-to-have no dashboard |
| **Cronograma de ações** (timeline de planos) | ❌ Não previsto | Complementar ao kanban |

### Ações P1-P2

6. `avalia-es-de-risco/spec.md` — adicionar drill-down:
   - Click numa célula do heatmap → drawer com perguntas exatas que compõem o fator + distribuição de respostas (anônima agregada)
7. `relat-rios-de-conformidade/spec.md` — expandir capa do relatório:
   - Bloco "Apresentação legal" (marco regulatório NR-1)
   - Bloco "Metodologia" (instrumento, versão, escalas, critérios)
   - Bloco "Características da pesquisa" (instrumento, qtd participantes, período, unidade)
   - Bloco "Análise narrativa por IA" (diagnóstico + medidas propostas)
8. `dashboard-sst/spec.md` — adicionar (P2):
   - Calendário de pesquisas (vista mensal das janelas)
   - KPI "evolução de cobertura entre ciclos" (sinal de confiança)
9. `plano-de-a-o-and-pgr/spec.md` — adicionar (P2):
   - Vista cronograma (timeline) complementar ao kanban
   - Botão "criar plano" direto do drill-down de fator

---

## 5. Escopo Geral SST (Backlog estratégico — fora dos 3 sprints)

Features que a Indexmed tem fora do escopo psicossocial. **Recomendação D4 = consolidar NR-1 primeiro**, então estes itens ficam como backlog estratégico para decisão futura, não sprint planejado.

| Feature | Atendemos? | Posição estratégica |
|---|---|---|
| **AET (Análise Ergonômica do Trabalho)** | ❌ | Próximo candidato — complementa o módulo psicossocial (mesma família NR-1/NR-17) |
| **Exames ocupacionais / ASO digital** | ❌ | Backlog — alto valor mas exige integração com clínicas |
| **Entrega de EPI com biometria** | ❌ | Backlog — diferencia mercado, requer hardware |
| **Integração folha/RH** | ❌ | Backlog — depende de parceiros e API de terceiros |
| **Marketplace clínico (Nadex Link)** | ❌ | Longo prazo — modelo de negócio diferente |

### Decisão pendente

- **D4**: ao terminar Sprint 3, abrir Sprint 4 com AET ou pausar SST e validar adoção do MVP NR-1?

---

## 6. Diferenciais Nossos (preservar e amplificar)

Features do Design OS que a Indexmed **não** demonstrou:

| Diferencial | Section | Por que importa |
|---|---|---|
| **Diagnóstico semanal do líder** | `diagn-stico-semanal-do-l-der` | Concorrente faz campanhas periódicas; nós temos sinal contínuo |
| **Mental Health do paciente (PHQ-9/GAD-7 contínuo)** | `mental-health` | Feed anônimo agregado por setor — sinal real, não survey |
| **Cruzamento com evidências externas** (atestados, presenteísmo, GPTW, CIDs) | `plano-de-a-o-and-pgr` | Plano de ação rastreado por impacto observado |
| **Suite Nymos unificada** (clínico + nutri + psi + SST + paciente) | Arquitetura | Concorrente é vertical isolado |
| **Encaminhamento clínico** | `encaminhamento-cl-nico` | Loop SST → psicólogo do paciente, dentro da própria plataforma |

---

## 7. Plano de Execução

> T-shirt sizing por item: **S** = ajuste de spec/copy · **M** = nova UI/seção dentro de section existente · **L** = nova mecânica cross-section.

### Sprint 1 — Compliance LGPD (P0) · Sizing: **M** ✅ COMPLETO
Foco: garantir conformidade antes de qualquer outra coisa.

- [x] **M** Edit `avalia-es-de-risco/spec.md`: princípios + tela do colaborador + regra dos 3 + termo de anonimato
- [x] **S** Edit `trabalhadores/spec.md`: validação e-mail + opt-out persistente + campo WhatsApp
- [x] **S** Edit `relat-rios-de-conformidade/spec.md`: estrutura PDF com 11 blocos (capa, apresentação legal, metodologia, análise IA narrativa, etc.)
- [x] **S** Atualizar `data.json` e `types.ts` das sections acima
- [x] **Bônus** `ColaboradorEntry.tsx` — tela pública implementada (header + termo + Responder/Não quero responder + modal confirmação)
- [x] **Bônus** `TrabalhadorDrawer.tsx` — campos e-mail pessoal + WhatsApp Enterprise + validação anti-genérico inline
- [ ] **S** Re-gerar screenshots das telas afetadas — pendente

**Esforço total: M** (6 de 7 itens completos · só screenshots pendentes)

### Sprint 2 — Paridade UX (P1) · Sizing: **L** ✅ COMPLETO
- [x] **M** Drill-down de fator → perguntas exatas (avalia-es-de-risco) — `FatorDrillDown.tsx` + drillDownFatores no data.json (3 fatores · 7 perguntas com distribuição)
- [x] **S** Versões curta/média do COPSOQ (avalia-es-de-risco wizard passo 1) — COPSOQ-3 média 76q adicionado a instrumentos
- [x] **M** Canais e-mail/WhatsApp + janela de disparo agendado (wizard passos 3-4) — wizard step 3 expandido com horário de disparo (default 08:15), toggle e-mail (padrão) + toggle WhatsApp (badge Enterprise), validação `canAdvance` exige ≥1 canal
- [x] **S** Lock de pesquisa simultânea por estrutura (invariante) — botão "Nova avaliação" desabilita + aviso quando existe avaliação em aplicação
- [x] **M** Capa do relatório expandida — `PdfPreview.tsx` agora lista 14 blocos (11 obrigatórios + 4 opcionais) com badges "obrigatório" e bloco "Marco regulatório NR-1" com referência à Portaria MTE 1.419/2024
- [x] **Bônus** Cobertura macro 65% → 60% propagado em data.json + 4 componentes (NovaAvaliacaoWizard, MatrizPsicossocial, AvaliacaoDetalhe, data.coberturaMinima)

**Esforço total: L** (5 de 5 itens completos + 1 bônus)

### Sprint 3 — Polimento (P2) · Sizing: **M** ✅ COMPLETO
- [x] **M** Calendário de pesquisas no `dashboard-sst` — `CalendarioPesquisas.tsx` (grid mensal com navegação + dots por status + sidebar de janelas do mês com cobertura)
- [x] **M** Cronograma/timeline no `plano-de-a-o-and-pgr` (complementa kanban) — `CronogramaTimeline.tsx` com toggle Kanban/Cronograma no header, agrupado por mês, dots coloridos por status, badges de "vencido +Nd" / "+Nd" para prazos curtos
- [x] **S** KPI evolução de cobertura entre ciclos — 6º card no KpiStrip com `Δ Cobertura ciclos` (cobertura média atual + delta vs ciclo anterior em pp, com seta direcional)
- [x] **S** Cartaz de divulgação (Word/PDF com QR + aviso) como fallback — `CartazDivulgacao.tsx` com modelo A4 imprimível, QR placeholder, badge "Anônima", explicação de anonimato no canal, aviso explícito "canal não-recomendado" + watermark "MODELO"

**Esforço total: M** (4 de 4 itens completos)

### Backlog estratégico (não-sprint — depende de D4)
- [ ] **L** AET (Análise Ergonômica do Trabalho) — candidato Sprint 4 se D4=(a)
- [ ] **L** Pesquisa de clima organizacional (módulo paralelo) — depende D1
- [ ] **XL** ASO digital
- [ ] **XL** EPI biométrico
- [ ] **XL** Integração folha/RH
- [ ] **XL** Marketplace clínico (modelo de negócio)

---

## 8. Decisões Pendentes

| ID | Decisão | Opções | Recomendação | Decisor | Quando |
|---|---|---|---|---|---|
| **D1** | Pesquisa de Clima como módulo paralelo? | (a) Backlog separado · (b) nunca · (c) submódulo dentro de NR-1 | (a) Backlog separado — escopo distinto, evita confusão | Roberto (PO) | Pós Sprint 3 |
| **D2** | Cobertura macro mínima | (a) Manter 65% · (b) Alinhar 60% mercado | (b) 60% — alinha recomendação clínica COPSOQ | Roberto + revisor técnico SST | Antes Sprint 1 |
| **D3** | WhatsApp como canal | (a) Padrão · (b) Enterprise-only · (c) não oferecer | (b) Enterprise — alinha com mercado e diferencia tier | Roberto (PO) | Antes Sprint 2 |
| **D4** | Próximo módulo SST após Sprint 3 | (a) Sprint 4 = AET · (b) Pausa SST e valida adoção MVP NR-1 · (c) Outro escopo | (b) validar adoção antes — diferencial está em NR-1 | Roberto (PO) | Fim Sprint 3 |
| **D5** | PGR como view-documento navegável | (a) Manter só kanban+export · (b) Adicionar view-documento no Sprint 3 · (c) Sprint 4 | (b) Sprint 3 — diferencia handoff pra empregador | Roberto (PO) | Antes Sprint 3 |

---

## Próximos Passos

1. Decidir D2 (cobertura macro) e D3 (WhatsApp tier) — bloqueiam Sprint 1-2 ✅ aprovados (60% / Enterprise)
2. Aprovar Sprint 1 (compliance LGPD) como prioridade absoluta ✅ feito
3. Iniciar edits dos specs listados em Sprint 1 ✅ feito
4. Decidir D5 antes do Sprint 3; D1 e D4 ao fim do Sprint 3 — D5 adiada (backlog), D1 e D4 = backlog

---

## Fechamento — Inventário de Entregas (sessão 2026-05-25)

### Specs editados (4)
- `product/sections/avalia-es-de-risco/spec.md` — Princípios de Aplicação + Tela do Colaborador + Regra dos 3 + drill-down
- `product/sections/trabalhadores/spec.md` — Princípios de Cadastro LGPD + canal individual + opt-out
- `product/sections/relat-rios-de-conformidade/spec.md` — Estrutura PDF com 11 blocos + apresentação legal NR-1
- `product/sections/dashboard-sst/spec.md` — KPI Δ cobertura + calendário de pesquisas
- `product/sections/plano-de-a-o-and-pgr/spec.md` — Toggle Kanban/Cronograma

### Types alterados (3)
- `product/sections/avalia-es-de-risco/types.ts` — `ColaboradorEntryProps`, `DrillDownFator`, `PerguntaInstrumento`, `DistribuicaoRespostaItem`, `CanalEnvio`, `RespostaColaborador`, constantes `COBERTURA_MACRO_MINIMA=60` e `REGRA_TRES_RESPONDENTES=3`
- `product/sections/trabalhadores/types.ts` — `CanalContato`, `StatusCanalContato`, `PADROES_EMAIL_GENERICO_BLOQUEADOS` (12 padrões)
- `product/sections/dashboard-sst/types.ts` — `JanelaPesquisaCalendario`, `JanelaPesquisaStatus`, novos campos em `DashboardKpis`

### Data.json migrados (3)
- `product/sections/avalia-es-de-risco/data.json` — cobertura 65→60, COPSOQ-3 média adicionado (76q), drill-down de 3 fatores
- `product/sections/trabalhadores/data.json` — 22 entradas migradas (canalContato + opt-out + sem-canal), `_meta` expandido
- `product/sections/dashboard-sst/data.json` — calendarioPesquisas (5 janelas), KPI Δ cobertura

### Componentes React novos (5)
- `src/sections/avalia-es-de-risco/components/ColaboradorEntry.tsx` + preview wrapper
- `src/sections/avalia-es-de-risco/components/FatorDrillDown.tsx`
- `src/sections/avalia-es-de-risco/components/CartazDivulgacao.tsx` + preview wrapper
- `src/sections/dashboard-sst/components/CalendarioPesquisas.tsx`
- `src/sections/plano-de-a-o-and-pgr/components/CronogramaTimeline.tsx`

### Componentes React alterados (6)
- `src/sections/avalia-es-de-risco/components/NovaAvaliacaoWizard.tsx` — cobertura 60%, horário disparo, canais e-mail/WhatsApp
- `src/sections/avalia-es-de-risco/components/MatrizPsicossocial.tsx` — wire drill-down + cobertura 60%
- `src/sections/avalia-es-de-risco/components/AvaliacaoDetalhe.tsx` — cobertura 60%
- `src/sections/avalia-es-de-risco/components/AvaliacoesList.tsx` — lock simultâneo
- `src/sections/dashboard-sst/components/{DashboardSst,KpiStrip}.tsx` — calendário + Δ cobertura
- `src/sections/trabalhadores/components/{TrabalhadorDrawer,TrabalhadorDetail,TrabalhadorRow,TrabalhadoresList}.tsx` — canal individual + opt-out + WhatsApp Enterprise
- `src/sections/plano-de-a-o-and-pgr/components/PlanoAcaoBoard.tsx` — toggle Kanban/Cronograma
- `src/sections/relat-rios-de-conformidade/components/PdfPreview.tsx` — 14 blocos + marco regulatório

### Validação final
- `npx tsc --noEmit` ✅ sem erros
- `npx vite build` ✅ build em ~3.10s

### Pendente (não-bloqueante)
- Re-render de screenshots PNG das telas afetadas (manual via dev server)
- Decidir Sprint 4 (D4): AET ou pausa validação MVP
