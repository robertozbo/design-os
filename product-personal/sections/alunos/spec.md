# Alunos Specification

## Overview
Carteira do personal — lista densa de todos os alunos com filtros por status (Em plano · Pausados · Sem plano · Em risco · Arquivados), busca, KPIs no topo (total ativo, em plano, em risco, novos no mês) e ações rápidas em cada linha. Cadastro de novo aluno é mínimo (nome + contato + convite app), o resto se preenche depois via fluxos das outras seções (avaliação, treino). A **ficha individual** (detalhe) é o coração: 4 tabs que consolidam tudo do aluno em um só lugar — Visão geral, Treino atual + histórico, Avaliações + evolução, Mensagens + anotações privadas. É a seção que cruza dados de praticamente todas as outras (Treinos, Avaliações, Atividades, Mensagens, Indicações).

## User Flows
- Listar alunos com tabs: Em plano · Pausados · Sem plano · Em risco · Arquivados (cada uma com contador)
- Buscar por nome ou email
- Filtrar adicional por objetivo (Hipertrofia, Emagrecimento, Performance, Reabilitação, Geral)
- Ordenar por: nome A-Z, mais recente, adesão (asc/desc), última sessão
- Ver KPIs no topo: total ativo, em plano, em risco, novos no mês
- Cadastrar novo aluno: drawer mínimo com nome (obrigatório) + email/celular + objetivo opcional + botão "Salvar e enviar convite app"
- Convidar aluno para o app (gera link/QR — reusa pattern de Indicações)
- Pausar / despausar / arquivar / restaurar aluno (ações inline na linha + na ficha)
- Mensagem rápida pro aluno (atalho na linha)
- Aplicar template de treino (atalho na linha)
- Iniciar nova avaliação (atalho na linha)
- Abrir ficha completa do aluno (clicar na linha)

### Ficha individual (detalhe)
- Header: avatar grande + nome + status badge + objetivo + data de início do vínculo + ações (Mensagem · Aplicar template · Nova avaliação · Pausar · Arquivar · Mais)
- Stats row: Adesão · Streak · Sessões totais · Última avaliação · Próxima sessão
- Tabs: **Visão geral · Treino · Avaliações · Mensagens**
- **Visão geral**: resumo do plano atual (link), próxima sessão, mini-gráfico de adesão semanal, alertas de risco (se houver), atividade recente (últimos 5 eventos), atalhos
- **Treino**: plano atual (com lista de treinos A/B/C clicáveis) + histórico de planos anteriores em accordion (data início/fim, adesão final, motivo de troca)
- **Avaliações**: lista cronológica de avaliações desse aluno + gráfico de evolução por métrica selecionável (peso, %G, RM Supino, FMS, VO2) + botão "Nova avaliação"
- **Mensagens**: conversa com bubble pattern (personal direita, aluno esquerda) + input de mensagem + bloco lateral (ou abaixo) "Anotações privadas" — só visíveis pro personal (ex: "se queixou de rotina turbulenta — flexibilizar")

## UI Requirements
- Cabeçalho com título "Alunos", contador total, botão "+ Novo aluno" (slate-900) à direita
- KPI strip (4 cards horizontais): Total ativos, Em plano, Em risco, Novos no mês (com delta)
- Tabs no topo (Em plano · Pausados · Sem plano · Em risco · Arquivados) com contador mono
- Search full-width abaixo das tabs (placeholder "Buscar por nome ou email…")
- Linha de filtros adicionais: chips de objetivo + sort dropdown
- **Lista em tabela densa** (não cards):
  - Header: Aluno · Plano · Adesão · Última sessão · Próxima · Status · Ações
  - Cada linha: avatar (32px) + nome + email pequeno · plano atual (nome curto) · barra de adesão + % + streak (chama) · "há X dias" · "em Y dias" · status badge · ações inline (Mensagem · Aplicar template · Nova avaliação · menu)
  - Hover destaca linha
  - Click na linha (não nas ações) abre ficha
  - Linhas em risco têm leve tinge amber/rose à esquerda
  - Linhas pausadas em opacidade 70%
  - Linhas arquivadas em opacidade 50%, sem ações primárias
- Empty state por tab com CTA contextual:
  - Em plano vazia: "Ainda sem alunos com plano · Aplicar template em sem-plano"
  - Sem plano: "Tudo atribuído · Convidar novo aluno"
  - Em risco: "Tudo sob controle 👌"
  - Arquivados: "Sem alunos arquivados ainda"
- Drawer "Novo aluno" (right-side, ~480px):
  - Nome (obrigatório)
  - Email
  - Celular (com máscara BR)
  - Objetivo inicial (select, opcional)
  - Observações curtas (textarea opcional)
  - Toggle "Enviar convite pelo app agora" (default ON)
  - Footer: Cancelar · Salvar (envia convite se toggle on)

### Ficha individual (página dedicada)
- Header full-width: avatar 64px + nome (texto grande) + linha com status badge + objetivo badge + "Aluno desde DD/MM/AAAA" + tag "Vinculado app" se sim
- Action bar à direita: Mensagem · Aplicar template · Nova avaliação · ⋯ (Pausar · Arquivar · Editar dados)
- Stats row em 5 colunas: Adesão · Streak · Sessões totais · Última avaliação · Próxima sessão (cada uma como mini-card)
- Tabs com underline teal estilo Treinos detail
- Em todas as tabs, mantém max-w-[1400px] e padding consistente

#### Visão geral
- Grid 2-col: esquerda (8) com plano atual destacado + atividade recente; direita (4) com alertas + atalhos
- Mini-gráfico de adesão das últimas 8 semanas (barras pequenas)

#### Treino
- Card grande com plano atual: nome, objetivo, treinos A/B/C como tabs internas com prescrição
- Histórico de planos como accordion (cada item: nome, datas, adesão final, motivo)

#### Avaliações
- Lista de cards de avaliação compactos (reusa AvaliacaoCard mas mais simples)
- Gráfico de evolução por métrica (selectable): line chart simples
- Botão "+ Nova avaliação"

#### Mensagens
- Layout 2-col: esquerda (8) conversa (bubble pattern, scroll), direita (4) "Anotações privadas" com lista de notas livres do personal (com timestamp)
- Input de mensagem fixo no rodapé esquerdo
- Notas privadas têm fundo amber leve pra distinguir visualmente que NÃO são compartilhadas

- Estilo visual igual outras seções (gradient bg, reveal animations, max-w-[1400px], teal primary, lucide icons)
- Light & dark mode + responsive (tabela vira cards empilhados em mobile; ficha tabs viram select dropdown em mobile)

## Configuration
- shell: true
