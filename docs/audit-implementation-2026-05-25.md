# Auditoria de Implementação — Design OS vs Superfícies Nymos

**Data**: 2026-05-25
**Escopo**: 7 superfícies × 48 sections do catálogo Design OS
**Método**: 7 agents `Explore` em paralelo cruzaram catálogo de specs com implementação real

**Legenda**:
- `✓` implementado (matches spec)
- `~` parcial (placeholder ou só parte do spec)
- `✗` missing (sem evidência de implementação)
- `≠` diverge (implementado mas diferente do spec)
- `—` não aplicável (section fora do escopo da superfície)

**Caveat SST**: o agent inicial localizou paths em `sst/product-plan/sections/` (export package, não rotas live). Verificação manual confirmou que sections SST estão implementadas **nested** sob `empregadores/[id]/<route>/`. Tabela SST abaixo corrigida.

---

## 1. Web Paciente — `frontend/src/app/(patient)/`

| Section | Status | Path | Notes |
|---|---|---|---|
| dashboard | ✓ | `(patient)/dashboard/` | Hero KPIs, status card, atividade 7/30d, nutrição dia |
| medication | ✗ | — | Spec completa (adesão, receitas, GLP-1) mas sem rota web |
| mental-health | ✓ | `(patient)/mental-health/` | Diário emocional + mood trends + histórico (protótipo V2) |
| exames-paciente | ✓ | `(patient)/exams/` | Upload modal + extração IA + review + comparação biomarcadores |
| activities | ✓ | `(patient)/activities/` | Cadastro modal, filtros, lista/grid, sincronização |
| metrics | ✓ | `(patient)/metrics/` | Cards por métrica, mini-gráfico, histórico, entrada manual |
| perfil-paciente | ✓ | `(patient)/profile/` | SettingsPage 4 seções (dados, saúde, conta, profissionais) |
| minha-sa-de-paciente | ~ | `(patient)/my-health/` | 4 abas; Estado Atual OK, Análises/Evolução/Comparar incompleto |
| my-professionals | ✓ | `(patient)/my-professionals/` | Vinculação + permissões granulares + primário + desvincular |
| appointments | ✓ | `(patient)/appointments/` | Agendamentos de consultas |
| notifications | ✓ | `(patient)/notifications/` | Hub de notificações |
| nutrition | ~ | `(patient)/nutrition/` | Diário + goals + meal-plan; faltam receitas e planos do nutri |
| evolution | ~ | `(patient)/evolution/` | Análises exames + raw data; incomplete vs spec |
| goals | ✓ | `(patient)/goals/` | Metas de saúde com tracking |
| insights | ✓ | `(patient)/insights/` | Insights/analytics personalizados |
| fotos-corporais-paciente | ~ | — | Sem rota dedicada; talvez integrado em evolution |
| bioimped-ncia-paciente | ~ | — | Sem rota dedicada; dados em metrics/evolution |
| agenda | — | — | Spec = calendário nutri (profissional, fora escopo) |
| alimentos | — | — | Catálogo TBCA (backend, sem UI paciente) |
| planos-alimentares | — | — | Spec = builder nutri (profissional) |
| receitas | — | — | Spec = biblioteca nutri (profissional) |

**Coverage relevante**: 11 ✓ / 5 ~ / 1 ✗ (de 17 sections aplicáveis) ≈ **65% completas, 94% iniciadas**.

---

## 2. Mobile — `mobile/src/screens/`

| Section | Status | Path | Notes |
|---|---|---|---|
| medication | ✓ | `screens/medication/MedicationScreen.tsx` | Listagem prescrições e doses do dia |
| metrics | ✓ | `screens/metrics/` | Criar, visualizar e histórico de métricas |
| activities | ✓ | `screens/activities/` | Criar, detalhe, compartilhamento, histórico |
| minha-sa-de-paciente | ✓ | `screens/minha-saude/` | Home com snapshots e detalhe |
| mental-health | ✓ | `screens/saude-mental/SaudeMentalHomeScreen.tsx` | Diário emocional do dia |
| planos-alimentares | ✓ | `screens/nutrition/` | Visualizar, registrar refeições |
| exames-paciente | ✓ | `screens/exams/` | Upload, histórico, tipos de exame |
| fotos-corporais-paciente | ✓ | `screens/body-evaluations/BodyPhotosListScreen.tsx` | Galeria de fotos corporais |
| bioimped-ncia-paciente | ✓ | `screens/body-evaluations/BioimpedanceListScreen.tsx` | Listagem de bioimpedâncias |
| perfil-paciente | ✓ | `screens/profile/` | Perfil + edição + segurança |
| dashboard | ✓ | `screens/dashboard/DashboardScreen.tsx` | Hero com KPIs e insight IA |
| my-professionals | ✓ | `screens/professionals/ProfissionaisScreen.tsx` | Lista de profissionais vinculados |
| notifica-es-nutri | ~ | `screens/notifications/` | Notificações genéricas, sem segmentação nutri |
| goals | ✓ | `screens/goals/` | Listagem e detalhes de metas |
| configura-es-paciente | ✓ | `screens/settings/` | Idioma, plano, termos, suporte |

**Coverage relevante**: 14 ✓ / 1 ~ ≈ **93% completas**.

> **Destaque**: mobile tem `fotos-corporais` e `bioimped-ncia` com rotas próprias — web paciente não tem.

---

## 3. Profissional Nutri — `frontend/src/app/(professional)/professional/nutrition/`

| Section | Status | Path | Notes |
|---|---|---|---|
| dashboard-nutri | ✓ | `nutrition/dashboard/` | DashboardNutri: KPIs + agenda + alerts |
| pacientes | ✓ | `nutrition/pacientes/` | List + detail c/ 8 tabs (incluindo Avaliação) |
| planos-alimentares | ✓ | `nutrition/planos-alimentares/` | Builder + list c/ templates |
| alimentos | ✓ | `nutrition/alimentos/` | TBCA + customizados, busca e favoritos |
| configura-es-nutri | ~ | `nutrition/configuracoes/` | Index + 7 sub-pages, layout sidebar |
| notifica-es-nutri | ✓ | `nutrition/notificacoes/` | Shared component + filtros + snooze |
| agenda | ✓ | `nutrition/agenda/` | Google Calendar sync + drag-drop |
| receitas | ✓ | `nutrition/receitas/` | Builder + library + tags dietéticas |
| avalia-o-antropom-trica | ~ | `nutrition/pacientes/[id]/` | AvaliacaoTab integrada em detalhe, não rota top-level |
| bioimped-ncia-paciente | ✗ | — | Fora escopo nutri web (paciente app) |

**Coverage relevante**: 8 ✓ / 2 ~ / 1 ✗ ≈ **80% completas**.

---

## 4. Profissional Psi — `frontend/src/app/(professional)/professional/psychology/`

| Section | Status | Path | Notes |
|---|---|---|---|
| dashboard-psi | ✓ | `psychology/dashboard/` | Layout 3-col, hero, KPIs, alertas |
| pacientes-psi | ✓ | `psychology/pacientes/` | Filtros multi-select, busca, cards |
| prontuario-psi | ✓ | `psychology/prontuario/` | 7 seções (Identificação→Alta), CFP 001/2022 |
| sessao-psi | ✓ | `psychology/sessao/` | Timer, SOAP/DAP/Livre, risk slider (V1 sem IA Insights) |
| plano-terapeutico-psi | ✓ | `psychology/plano-terapeutico/` | Criar plano, técnicas, sessões |
| instrumentos-psi | ✓ | `psychology/instrumentos/` | Biblioteca + aplicação + scoring (PHQ-9, GAD-7, DASS-21) |
| configuracoes-psi | ✓ | `psychology/configuracoes/` | Hub com 5 sub-pages |
| agenda | ✓ | `psychology/agenda/` | Google Calendar sync, reusa AgendaWrapper |
| encaminhamento-cl-nico | ✗ | — | Spec completo, sem rota implementada |
| profissionais | ~ | — | Spec é diretório público, não integrado à superfície Psi |
| perfil | ✓ | `psychology/perfil/` | Redireciona PerfilPage shared |
| notificacoes | ✓ | `psychology/notificacoes/` | Notificações genéricas |

**Coverage relevante**: 10 ✓ / 1 ~ / 1 ✗ ≈ **83% completas**.

---

## 5. Profissional SST — `frontend/src/app/(professional)/professional/sst/`

| Section | Status | Path | Notes |
|---|---|---|---|
| dashboard-sst | ✓ | `sst/dashboard/` | KPI strip + notificações |
| empregadores | ✓ | `sst/empregadores/` | Lookup CNPJ + grid/tabela |
| trabalhadores | ✓ | `sst/empregadores/[id]/trabalhadores/` | Nested por empregador, drawer LGPD |
| estabelecimentos-and-setores | ✓ | `sst/empregadores/[id]/estabelecimentos/` | Nested, 3 níveis breadcrumb |
| avalia-es-de-risco | ✓ | `sst/empregadores/[id]/avaliacoes/` | Wizard 5 passos + heatmap |
| plano-de-a-o-and-pgr | ~ | `sst/empregadores/[id]/plano-acao/` | Kanban implementado, toggle cronograma ausente |
| relat-rios-de-conformidade | ✓ | `sst/empregadores/[id]/relatorios/` | Wizard split + hash SHA-256 |
| diagn-stico-semanal-do-l-der | ✓ | `sst/diagnostico-lider/` | Wizard 3 passos + anonimato |
| cat-logos | ✓ | `sst/catalogos/` | Instrumentos + perigos |
| encaminhamento-cl-nico | ✓ | `sst/encaminhamento-clinico/` | Drawer + filtros |
| notifica-es-sst | ✓ | `sst/notificacoes/` | Inbox estilo Gmail + snooze |
| perfil | ✓ | `sst/perfil/` | Múltiplos registros + assinatura |
| indica-es | ✓ | `sst/indicacoes/` | (re-uso de spec paciente?) |
| eventos-esocial | ✗ | — | Não implementado no MVP |
| servi-os | — | — | Escopo nutri, não SST |
| profissionais | — | — | Página pública, fora superfície SST |

**Coverage relevante**: 12 ✓ / 1 ~ / 1 ✗ ≈ **86% completas**.

---

## 6. Profissional Personal — `frontend/src/app/(professional)/professional/personal/`

| Section | Status | Path | Notes |
|---|---|---|---|
| dashboard | ✓ | `personal/dashboard/` | KPIs + agenda hoje + alunos em risco |
| professional-dashboard | ≠ | — | Personal usa dashboard próprio, não reusa spec genérica |
| pacientes | ✓ | `personal/alunos/` | List + detail completo em `[id]/` |
| agenda | ✓ | `personal/agenda/` | Calendar view, reusa nutri backend c/ labels override |
| avalia-o-antropom-trica | ~ | `personal/alunos/[id]/?tab=avaliacoes` | Tab dentro ficha, sem page top-level |
| fotos-corporais-paciente | ~ | `personal/alunos/[id]/?tab=avaliacoes` | Drawer na ficha, sem top-level |
| bioimped-ncia-paciente | ✓ | `personal/bioimpedancia/` | Page cross-aluno + upload modal |
| activities | ✗ | — | Paciente-only; personal prescreve treinos |
| profissionais | — | — | Diretório B2C, personal não figura |
| perfil | ✓ | `personal/perfil/` | Redireciona PerfilPage shared |

**Extras** (sem spec Design OS, mas implementados):
- `personal/exercicios/` — Biblioteca de exercícios
- `personal/treinos/` — Prescrição de planos de treino

**Coverage relevante**: 6 ✓ / 2 ~ / 1 ✗ / 1 ≠ ≈ **60% completas**.

---

## 7. Landing — `frontend/src/app/(public)/`

| Seção (spec) | Status | Path | Notes |
|---|---|---|---|
| Header | ✓ | `components/landing-v2/LandingHeader.tsx` | Sticky blur + nav + toggles |
| Hero | ✓ | `LandingHero.tsx` | Bento dual-side + trust pills + integrations bar |
| Problem | ✓ | `LandingProblem.tsx` | 3 cards (consultas, apps, feedback) |
| Loop do Vínculo | ✓ | `LandingLoop.tsx` | 3 steps (convite, consentimento, acompanhamento) |
| Verticais | ✓ | `LandingVerticais.tsx` | 5 cards: Nutri, Personal, Psi, SST, Clínico (em breve) |
| Pra você, paciente | ✓ | `LandingPatient.tsx` | 5 capacidades + chips |
| Pra você, profissional | ✓ | `LandingProfessional.tsx` | 6 features (pacientes, planos, convites, agenda, dashboards, IA) |
| IA Diagnóstica | ✓ | `LandingAIDiagnostic.tsx` | 4 verticais c/ trust strip |
| Confiança & Consentimento | ✓ | `LandingTrust.tsx` | 4 pillars + selos |
| Pricing | ✓ | `LandingPricing.tsx` | Free/Plus/Pro + Clínica + Paciente grátis |
| Testimonials | ✓ | `LandingTestimonials.tsx` | 3 mix prof+patient + marquee |
| FAQ | ✓ | `LandingFAQ.tsx` | 8 accordion items |
| Final CTA | ✓ | `LandingFinalCTA.tsx` | Dual CTAs + social proof |
| Footer | ✓ | `LandingFooter.tsx` | 5 colunas + badges Brasil/LGPD/E2E |

**Coverage**: 14 ✓ / 14 = **100%**.

---

## Cross-surface — resumo

### Coverage por superfície

| Superfície | ✓ | ~ | ✗ | ≠ | Cobertura |
|---|---:|---:|---:|---:|---:|
| Landing | 14 | 0 | 0 | 0 | **100%** |
| Mobile | 14 | 1 | 0 | 0 | **93%** |
| Profissional SST | 12 | 1 | 1 | 0 | **86%** |
| Profissional Psi | 10 | 1 | 1 | 0 | **83%** |
| Profissional Nutri | 8 | 2 | 1 | 0 | **80%** |
| Web Paciente | 11 | 5 | 1 | 0 | **65%** |
| Profissional Personal | 6 | 2 | 1 | 1 | **60%** |

### Top gaps (✗)

1. **`medication` no web paciente** — spec completa (adesão, receitas, GLP-1), sem rota. Mobile tem.
2. **`encaminhamento-clinico` no Psi** — spec, sem implementação.
3. **`eventos-esocial` no SST** — não no MVP.
4. **`activities` no Personal** — intencional (Personal prescreve treinos, não atividades).
5. **`bioimped-ncia` no Nutri web** — só mobile/Personal.

### Partial (~) recorrentes

1. **`fotos-corporais-paciente` no web paciente** — sem rota dedicada (existe em mobile e Personal).
2. **`bioimped-ncia-paciente` no web paciente** — idem.
3. **`avalia-o-antropom-trica`** — Nutri e Personal embutem em `paciente/[id]`, não como rota top-level.
4. **`minha-sa-de-paciente` web** — 4 abas, mas Análises/Evolução/Comparar incompletas vs mobile.
5. **`nutrition` web paciente** — falta receitas e planos do nutri.

### Divergências (≠)

1. **`professional-dashboard` no Personal** — não reusa spec genérica; tem dashboard próprio.

### Inconsistências mobile vs web paciente

| Section | Mobile | Web Paciente |
|---|:---:|:---:|
| medication | ✓ | ✗ |
| fotos-corporais | ✓ | ~ |
| bioimped-ncia | ✓ | ~ |
| minha-saude | ✓ completa | ~ Análises/Evolução incompletas |

> Memória diz: "WEB e mobile devem ter mesma feature set". Atualmente há **4 gaps** entre as duas superfícies.

### Recomendações de próximos passos (ordem sugerida)

1. **`medication` web paciente** — bigger gap, spec já existe, mobile tem o modelo
2. **`fotos-corporais` + `bioimped-ncia` web paciente** — portar pattern do mobile
3. **`minha-saude` web** — completar Análises/Evolução/Comparar
4. **`encaminhamento-clinico` Psi** — implementar do zero
5. **`eventos-esocial` SST** — decidir se entra no MVP ou V2

---

*Gerado em 2026-05-25 com 7 agents `Explore` em paralelo + verificação manual SST.*
