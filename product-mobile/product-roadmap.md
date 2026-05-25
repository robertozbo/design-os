# Roadmap — App Paciente Nymos (MVP)

10 features priorizadas pra retematização visual. Cada uma terá `spec.md`, `data.json`, `types.ts` e screenshots em `product/sections/[id]/`.

> Ordem reflete dependências visuais: tabs e shell primeiro, agregadores depois, feature-âncora (Minha Saúde + Projeção Corporal) por último — precisa de tudo que veio antes.

> **Projeção Corporal** não é section paralela: vive **dentro de Minha Saúde** como sub-fluxo da aba Comparar. Alinhado ao backend Nymos (`screens/minha-saude/components/ProjecaoCard.tsx` + types em `screens/minha-saude/types.ts`). PRD detalhado em `sections/minha-saude/prd-projecao.md`.

## Shell (precondição)

**Status bar + Header + Bottom tab bar de 5 itens**

Tab bar: `Métricas · Objetivos · Início · IA · Mais`
- "Início" é o tab do meio, com ícone de casa
- "IA" tem ícone destacado (câmera/sparkle) — ponto de entrada do chat IA + atalho pra Minha Saúde (Análise + Projeção Corporal vivem lá)
- Header: avatar/inicial + saudação + (relógio · sino · engrenagem)

## Features MVP

### 1. Início (Dashboard)

`/sections/inicio`

Visão geral do dia. Centraliza:
- Quick actions: Nutrição · Atividades · Treinos (3 cards)
- Anel de calorias (consumidas vs gastas vs meta)
- Card "Minha evolução" (peso atual, % gordura, IMC, classificação)
- Card "Horas de Sono" com strip dos últimos 7 dias
- FAB de IA (atalho para chat)

### 2. Métricas

`/sections/metricas`

Lista de métricas individuais: peso, altura, % gordura, gordura visceral, cintura, etc. Cada métrica tem histórico, gráfico e adição manual.

### 3. Objetivos

`/sections/objetivos`

Metas configuradas pelo usuário (peso alvo, % gordura alvo, calorias diárias, passos diários, etc.). Card de progresso por meta.

### 4. IA

`/sections/ia`

Chat conversacional. Consulta dados do app pra responder perguntas educativas. Atalhos pra fluxos de análise/projeção apontam pra Minha Saúde (onde a feature vive).

### 5. Mais

`/sections/mais`

Hub para sub-features fora das tabs principais: Minha Saúde, Notificações, Perfil, Configurações, Wearables, Plano (free/plus/pro), etc.

### 6. Nutrição

`/sections/nutricao`

Diário alimentar: refeições do dia, kcal e macros consumidos, busca de alimentos, foto de prato (IA estima kcal).

### 7. Atividades

`/sections/atividades`

Registro de atividades físicas (corrida, caminhada, ciclismo, etc.). Sincronização com HealthKit/wearables. Calorias gastas, distância, tempo, FC.

### 8. Treinos

`/sections/treinos`

Treinos prescritos ou avulsos: lista de exercícios, séries, reps, carga. Histórico de execução.

### 9. Minha Saúde ⭐

`/sections/minha-saude`

**Feature-âncora.** Agregador + análises IA + projeção corporal em uma única section, alinhada ao backend Nymos. 4 abas:

- **Estado Atual** — score geral + 7 dimensões (composição, metabólico, cardio, atividade, sono, nutrição, mental) com benchmarks oficiais estratificados por idade × sexo
- **Análises** — snapshots por período com Ótimo/Atenção/Risco + narrativa IA + freshness gate. Info de plano (Premium · análises restantes no mês) aparece aqui
- **Evolução** — gráficos de linha por dimensão ao longo dos snapshots
- **Comparar** — diff entre 2 snapshots + fotos lado a lado + **Projeção Corporal IA (Nano Banana)** com idade visual estimada + meta + imagem projetada. Detalhe completo em `prd-projecao.md`

### 10. Saúde Mental

`/sections/saude-mental`

Conexão paciente↔psicólogo vinculado. Layout em 2 tabs:

- **Chat** — conversa 1-1 com o psicólogo (bubbles, separadores de data, indicadores de leitura/digitando, composer com anexos). Sem psicólogo vinculado: empty state com CTA "Convidar psicólogo".
- **Diário emocional** — entrada diária com humor 1-10, chips de emoções (positivas/neutras/negativas), sliders de energia + qualidade de sono e textarea livre. Cards de tendência (7 dias + mês). Toggle "Compartilhar com [psicólogo]" envia entrada como mensagem do sistema no chat.

Diário sempre disponível (offline-friendly). Instrumentos clínicos (PHQ-9, GAD-7) ficam pra V2.

## Fora do MVP (V2+)

Features que existem no app mas não entram nesta retematização inicial:

- challenges, exams (detalhado), insights (separado), ranking, reports, user-management
- health-analysis e body-evaluations standalone (ambos absorvidos por Minha Saúde — análises + projeção corporal vivem lá)
- onboarding flows
- profile completo / settings completo (entra parcial via "Mais")
