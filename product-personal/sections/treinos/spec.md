# Treinos Specification

## Overview
Seção onde o personal monta planos de treino (com treinos A/B/C…), atribui a alunos com agenda semanal, e acompanha a execução. O loop é: **personal cria → atribui ao aluno → aluno executa pelo app → personal vê adesão e progressão**. Cada plano tem objetivo (hipertrofia, emagrecimento, performance), múltiplos treinos com prescrição rica (séries × reps × carga × RPE × descanso × observações), e o aluno pode ajustar a carga no app conforme evolui (autonomia controlada). Mesma pattern de templates do nutri — "Aplicar em aluno" cria plano vinculado sem sync retroativo.

## User Flows
- Listar planos com tabs: Templates · Atribuídos · Arquivados
- Filtrar por objetivo (Hipertrofia, Emagrecimento, Performance, Reabilitação, Geral)
- Buscar plano por nome ou aluno
- Criar plano novo (builder em steps): Identificação → Treinos → Exercícios + prescrição → Configuração (agenda + duração padrão)
- Editar plano: mesmas etapas do builder
- Duplicar plano (template ou atribuído) — vira novo template
- **Salvar atribuído como template** — pega o plano de um aluno, gera template novo (sem dados do aluno) pra reusar em outros alunos sem montar do zero
- Arquivar plano (template não usado ou atribuído finalizado)
- Aplicar template em aluno: modal com aluno + data início + agenda semanal (qual treino em qual dia) + duração + toggle "Permitir aluno ajustar carga"
- Abrir detalhe de template: tabs Treinos · Configuração · Histórico de aplicações
- Abrir detalhe de plano atribuído: tabs Visão geral · Sessões · Treinos · Comparação carga
- Visão geral do plano atribuído: adesão %, streak, próxima sessão prevista, alertas (sessões puladas, queda de adesão)
- Timeline de sessões executadas com status (completa, parcial, pulada), data, duração, RPE médio
- Drill-down em sessão executada: vê carga prescrita vs real por exercício, comentários do aluno
- Comparação carga prescrita vs real ao longo do tempo (gráfico simples)
- Editar plano atribuído ativo: alerta "Próxima sessão em X dias já tem prescrição — atualizar a partir de quando?"
- Toggle "Permitir aluno ajustar carga": ativo por padrão, pode desligar pra alunos iniciantes
- No builder, adicionar exercício abre picker da biblioteca de Exercícios (com filtros) — selecionar move pro plano
- Cada exercício no plano: configurar séries (cada série pode ter reps OU tempo + carga + RPE alvo) + descanso + observações
- Reordenar exercícios dentro de um treino (drag handle)
- Duplicar treino dentro do plano (Treino A → A')

## UI Requirements
- Cabeçalho com título "Treinos", contador por tab (templates · atribuídos · arquivados), botão "+ Novo plano" (slate-900) à direita
- Tabs no topo (Templates · Atribuídos · Arquivados) com contador em mono
- Search full-width abaixo das tabs (placeholder muda por tab: "Buscar template…" / "Buscar por nome ou aluno…")
- Filtro de objetivo como pills horizontais: Todos · Hipertrofia · Emagrecimento · Performance · Reabilitação · Geral
- Lista em grid responsivo (1/2/3 colunas) de cards de plano:
  - **Card de template**: nome em destaque, badge de objetivo (cor por objetivo: hipertrofia teal, emagrecimento amber, performance violet, reabilitação rose, geral slate), descrição curta, contador "N treinos · M exercícios", "Aplicado em X alunos" mono pequeno, ações: Aplicar em aluno (botão primário) + Editar / Duplicar / Arquivar (menu)
  - **Card de plano atribuído**: avatar + nome do aluno em destaque, nome do plano abaixo, badge de objetivo, adesão % (barra verde→amber→red), streak (chama emoji + N), última sessão "há X dias", próxima sessão "em Y dias", ações: Ver detalhe + Mensagem
  - **Card de plano arquivado**: mais discreto, sem ações primárias, label "Arquivado em DD/MM"
- Builder de plano (drawer fullscreen ou página dedicada) em steps com indicador de progresso:
  - **Step 1 · Identificação**: Nome (obrigatório), Objetivo (select com cores), Descrição opcional
  - **Step 2 · Treinos**: Lista de treinos A, B, C… com nome editável; botão "+ Adicionar treino"; drag pra reordenar; duplicar/excluir por treino
  - **Step 3 · Exercícios + prescrição**: Para cada treino, lista de exercícios; "+ Adicionar exercício" abre picker (drawer secundário) com biblioteca de Exercícios (search + filtros); cada exercício no plano mostra:
    - Linha do exercício: thumb GIF + nome + grupo muscular + drag handle + remover
    - Mini-tabela de séries: # | Reps OU Tempo | Carga (kg) | RPE alvo
    - Botões "+ Série" e "Duplicar última"
    - Toggle "Reps / Tempo" por exercício
    - Campo "Descanso (s)" e "Observações" (textarea)
  - **Step 4 · Configuração**: Agenda semanal padrão (grid 7 dias, drag treinos pros dias), Duração padrão (4 / 8 / 12 / indeterminado)
  - Botões: Voltar / Avançar / Salvar como rascunho / Salvar e fechar
- Modal "Aplicar em aluno":
  - Selecionar aluno (search com avatar/nome)
  - Data início (date picker, default hoje)
  - Agenda semanal (preenchida com config padrão do template, ajustável)
  - Duração (4 / 8 / 12 / indeterminado)
  - Toggle "Permitir aluno ajustar carga" (default ON, com explicação)
  - Resumo final: "Aluno X recebe Plano Y começando em DD/MM, segunda/quarta/sexta, por 4 semanas"
  - Botões Cancelar / Confirmar e enviar
- Detalhe de plano atribuído (página dedicada, tabs):
  - **Header**: avatar + nome do aluno · nome do plano · objetivo badge · ações (Ajustar plano, Mensagem, Arquivar)
  - **Stats row**: Adesão (% + barra), Streak, Sessões (feitas/totais), RPE médio
  - **Tab Visão geral**: próxima sessão (card destacado com treino + dia), últimas 4 semanas (mini-gráfico de adesão), alertas se houver
  - **Tab Sessões**: timeline cronológica com status colorido, expandível pra ver detalhe (carga prescrita vs real + comentários)
  - **Tab Treinos**: lista A/B/C com prescrição (read-only, com botão Editar)
  - **Tab Comparação**: gráfico de carga prescrita vs real ao longo do tempo (linha) por exercício chave + tabela
- Detalhe de template (página, tabs Treinos · Configuração · Histórico de aplicações)
- Empty state em cada tab com CTA contextual ("Crie seu primeiro template", "Atribua um template a um aluno")
- Confirmação destrutiva: arquivar plano atribuído ativo mostra alerta com adesão atual
- Estilo visual igual Exercícios/Alimentos (gradient bg, reveal animations, max-w-[1400px], teal primary, lucide icons)
- Light & dark mode + responsive (builder otimizado pra desktop; lista funciona em tablet/mobile)

## Configuration
- shell: true
