# Histórico de avaliações Specification

## Overview
**Visão de histórico/triagem global** — mostra ao personal as últimas avaliações realizadas em todos os alunos. Responde perguntas como "quais avaliações fiz esta semana?", "quem precisa reavaliar?", "como foi a evolução geral da minha carteira?". É **somente leitura/navegação** — todas as ações (criar, editar, ver detalhe, comparar) acontecem dentro da **ficha do aluno → tab Avaliações**, não aqui.

Quando o personal clica num card desta lista, é redirecionado pra ficha do aluno correspondente com a tab Avaliações pré-aberta. A página mostra cards cronológicos com data, aluno, badges (Antro/Funcional/Completa), métricas-chave (peso, %G, FMS, RM Sup) e delta vs avaliação anterior do mesmo aluno.

## User Flows
- Listar avaliações cronologicamente (todas / esta semana / mês / período custom)
- Buscar por nome do aluno
- Filtrar por tipo (todas / só antropometria / só funcional / completas)
- Ordenar por data (mais recente / mais antiga) ou por aluno
- Click no card → **redireciona pra ficha do aluno (`/alunos/[id]`) na tab Avaliações pré-aberta**
- A partir da ficha do aluno, todas as ações: criar nova, editar, duplicar, comparar, ver detalhe, exportar PDF, excluir, compartilhar com Nutri

> **Importante**: nesta tela **não** existe criar/editar/excluir/duplicar/comparar inline. A tela é só leitura/triagem. Click sempre leva pro contexto do aluno onde as ações vivem (ficha do aluno → tab Avaliações).

## UI Requirements
- Cabeçalho com título "Histórico de avaliações", subtítulo "Visão geral de todas as avaliações realizadas — clique pra abrir na ficha do aluno"
- **NÃO tem** botão "+ Nova avaliação" (criação acontece na ficha do aluno)
- Search full-width abaixo do header com placeholder "Buscar por aluno…"
- Filtros: chips de Tipo (Todas N · Antropometria N · Funcional N · Completas N) + select de período (Últimos 30 dias, 90 dias, Ano, Todas)
- Ordenação: dropdown (Recentes · Mais antigas · Por aluno)
- Counter "Mostrando X de Y" em uppercase mono
- Lista em grid responsivo (1/2 colunas) de cards de avaliação:
  - Avatar + nome do aluno (link)
  - Data formatada (DD MMM YYYY) + tempo relativo ("há 12 dias")
  - Badges dos blocos incluídos (Antropometria teal / Funcional violet)
  - Mini-stats (3 métricas-chave): peso, %G (se disponível), FMS score (se disponível)
  - Indicador de delta vs última avaliação anterior (peso ↓, %G ↓, etc.) com seta colorida
  - Thumbnail de foto frontal (se houver) + ícone "+N fotos"
  - Ações: Ver detalhe (botão) + menu (Editar · Duplicar · Comparar · Exportar PDF · Excluir)
- Empty state: "Nenhuma avaliação registrada" com CTA "Nova avaliação"
- Drawer "Nova avaliação" (right-side, ~720px):
  - Step header: Aluno (search) + Data (date picker, default hoje) + Observações (collapsible)
  - 2 abas: **Antropometria** e **Funcional**
  - Toggle por bloco: dentro de cada aba, cards expansíveis pra cada sub-bloco (ex: dentro de Antropometria → "Básico" / "Circunferências" / "Dobras" / "Bioimpedância" / "Fotos")
  - Inputs numéricos com unidade (kg, cm, %)
  - Cálculos automáticos: IMC (peso/altura²), %G via Pollock 7-dobras (Jackson-Pollock), 1RM via Brzycki (peso × 36 / (37 - reps))
  - Upload de fotos (drag-drop ou click) — frontal/lateral/posterior
  - Preview de % gordura calculado em tempo real conforme insere dobras
  - FMS: 7 sub-testes com seletor 0/1/2/3 cada — total calculado
  - Botões: Salvar como rascunho · Salvar e finalizar
- Página de detalhe (rota: /avaliacoes/:id):
  - Header: avatar + nome + data + ações (Editar · Duplicar · Comparar · Exportar PDF · Excluir · Voltar)
  - Stats row: 4-5 cards-resumo (peso, %G, FMS score, RM total, VO2)
  - Tabs: **Antropometria · Funcional · Histórico · Comparação · Fotos**
  - Antropometria: 4 cards (Básico, Circunferências, Dobras+%G, Bioimpedância) com tabela de valores e mini-gráfico de tendência (sparkline) por métrica
  - Funcional: cards de cada bloco (1RM, FMS, Flexibilidade, Cardio, Resistência) + **Radar chart** central comparando perfil funcional (com opção de comparar avaliação anterior em fantasma)
  - Histórico: gráficos de linha por métrica selecionável (peso, %G, RM supino/squat/deadlift, FMS score, VO2)
  - Comparação: ao entrar, abre seletor de avaliação anterior pra comparar; mostra duas colunas com delta entre cada métrica (verde se melhor, vermelho se pior, slate se neutro)
  - Fotos: galeria + slider antes/depois (split-view com seletor de qual avaliação anterior)
- Modal "Comparar avaliações" (acessível da lista ou do detalhe):
  - Topo: 2 seletores (Avaliação A · Avaliação B), restritas ao mesmo aluno
  - Corpo: tabela com cada métrica em linhas, A na esquerda, B na direita, delta em coluna central com cor
  - Inclui sub-tab pra comparação de fotos
- Toggle "Compartilhar com nutricionista" no detalhe (só visível se aluno tem nutri vinculado no Nymos) — quando ativo, antropometria aparece também no app do nutri
- Confirmação destrutiva pra excluir avaliação
- Estilo visual igual Treinos/Exercícios (gradient bg, reveal animations, max-w-[1400px], teal primary, lucide icons)
- Light & dark mode + responsive (drawer e detalhe otimizados pra desktop; lista funciona em tablet)

## Configuration
- shell: true
