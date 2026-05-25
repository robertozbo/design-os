# Início Specification

## Overview
Dashboard inicial do personal — pulled-together view do dia: quem treina hoje, quem tá em risco e precisa de atenção, e quem tá pra reavaliar. Em paralelo mostra os KPIs do mês (alunos ativos, sessões, MRR, novas indicações) pra dar leitura rápida da saúde do negócio. Atalhos pra ações comuns (nova avaliação, aplicar template, convidar aluno) e timeline de atividade recente fecham a tela. É a primeira coisa que o personal vê ao logar e a única tela que cruza dados de **todas** as outras seções (Agenda, Treinos, Avaliações, Atividades, Indicações).

## User Flows
- Greeting contextual ("Bom dia / tarde / noite, Roberto") com data atual e clima opcional
- Ver agenda do dia com horários, alunos, tipo de sessão (treino A/B/C, avaliação, primeira consulta) e modalidade (presencial/online)
- Confirmar/marcar sessão como realizada direto do dashboard
- Clicar em sessão → vai pra detalhe do aluno
- Ver alunos em risco com motivo categorizado (adesão baixa <60%, sem sessão 7+ dias, comentário de dor, reavaliação atrasada >60 dias)
- Clicar em aluno em risco → vai pra ficha do aluno
- Ver próximas reavaliações sugeridas (alunos com >60 dias da última)
- Iniciar nova avaliação a partir do dashboard (atalho)
- Aplicar template de treino em aluno (atalho)
- Convidar aluno (gera link de indicação)
- Adicionar/marcar como feito notas no diário do dia
- Ver KPIs do mês com delta vs mês anterior (alunos ativos, sessões realizadas, MRR, novas indicações)
- Ver timeline de atividade recente (últimas 24-48h): sessões completas, mensagens, indicações aceitas, comentários de dor

## UI Requirements
- Cabeçalho com greeting contextual ("Bom dia, Roberto") + data formatada extensa ("Quarta-feira, 6 de maio de 2026") + tag "Personal · CREF" do lado direito
- Grid principal em 12 colunas (desktop) que reorganiza pra 1 coluna (mobile):
  - **KPI strip no topo** (4 cards horizontais, ocupando 12 colunas):
    - Alunos ativos (número grande + delta vs mês anterior com seta)
    - Sessões no mês (número + barra de progresso vs alvo)
    - MRR estimado (R$ formatado + delta com seta)
    - Novas indicações (aceitas + N pendentes em linha pequena)
  - **Coluna esquerda (8 col)**:
    - **Agenda do dia** (card grande com header "Hoje · N sessões"): timeline vertical com cada sessão como linha (hora 09:00 · avatar · nome · badge tipo · status · ações inline). Hora atual destacada com linha colorida atravessando. Sessões passadas em opacity reduzida.
    - **Alunos em risco** (card): grid 2x2 (4 alunos) com motivo, ícone do critério, e CTA "Ver aluno"
    - **Próximas reavaliações** (card): lista compacta com avatar + nome + última avaliação + "vence em X dias" / "atrasada por Y dias"
  - **Coluna direita (4 col)**:
    - **Atalhos rápidos** (card): grid 2x2 de tiles grandes (Nova avaliação, Novo treino, Convidar aluno, Anotar) com ícone + label
    - **Diário do dia** (card): textarea-style livre com notas, cada nota tem checkbox e timestamp; "+ Nova nota" no rodapé
    - **Atividade recente** (card): timeline vertical compacta com últimos 6-8 eventos (avatar pequeno + descrição inline + tempo relativo)
- Cards usam padrão Nymos (rounded-2xl, border slate-200, bg branco, header com mono uppercase label)
- KPI cards têm padding maior, valor em font-mono semibold tamanho grande, delta em verde/vermelho com seta
- Badges de risco com ícones distintos por critério:
  - Adesão baixa: TrendingDown (rose)
  - Sem sessão: Clock (amber)
  - Dor: AlertTriangle (red)
  - Reavaliação atrasada: Calendar (slate)
- Atividade recente com ícone colorido por tipo (verde sessão completa, rose pulada, teal mensagem, violet avaliação)
- Linha de hora atual na agenda em teal-500 com timestamp à direita ("14:32")
- Status de sessão na agenda: dot colorido (verde realizada, teal agendada, amber confirmada pelo aluno, rose cancelada)
- Empty states elegantes em cada card ("Sem sessões hoje · próxima é amanhã às 09:00")
- Responsive: em mobile, cards empilham na ordem KPIs → Agenda → Em risco → Próximas reavaliações → Atalhos → Diário → Atividade
- Light & dark mode + reveal animations + max-w-[1400px]

## Configuration
- shell: true
