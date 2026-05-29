# Início Specification

## Overview
Dashboard de entrada do fisioterapeuta — primeira tela que ele vê ao abrir o Atender pela manhã. Mostra "o que tenho hoje, o que está pegando fogo, e quanto está rendendo o mês". Combina visão operacional (próximas sessões, pendências) com visão clínica (alertas de pacientes em risco) e visão de negócio (KPIs financeiros). É o hub onde o fisio decide o próximo movimento.

## User Flows
- Ver agenda do dia em um glance (próximas 4 sessões com hora + paciente + status)
- Ver KPIs do dia (sessões marcadas, confirmadas, faltas)
- Ver alertas clínicos (pacientes sem evolução há mais de 7 dias, aderência aos exercícios caindo, sono ruim segundo wearable)
- Ver atividade recente (últimas evoluções salvas, novos pacientes, convites aceitos no Nymos Move)
- Ver KPIs do mês (pacientes ativos, sessões realizadas, receita estimada, novos pacientes)
- Acesso rápido às ações principais: Nova evolução · Novo paciente · Agendar sessão · Nova avaliação
- Click em qualquer card leva pra seção/paciente correspondente

## UI Requirements
- Header com saudação contextual ("Bom dia, Roberto") + data + indicador de "hoje você tem N sessões"
- Strip de KPIs do dia (4 cards: total, confirmados, realizados, próxima sessão)
- Layout grid 12 colunas em 2 fileiras:
  - **Fileira 1**: Próximas sessões (col-span-8) · Quick actions (col-span-4)
  - **Fileira 2**: Alertas clínicos (col-span-5) · Atividade recente (col-span-4) · Mini-KPIs do mês (col-span-3)
- Próximas sessões: cards horizontais com hora destacada · avatar + nome do paciente · queixa curta · status badge · botão "Confirmar" se pendente
- Quick actions: 4 botões grandes com ícone + label (Nova evolução · Novo paciente · Agendar · Nova avaliação)
- Alertas clínicos: lista densa, ícone por severidade (atenção/info/risco) + texto + paciente + CTA contextual
- Atividade recente: timeline curta dos últimos 6 eventos
- KPIs do mês: 4 mini-cards empilhados verticalmente com delta vs mês anterior
- Indicador "now" em destaque na primeira sessão pendente do dia
- Estilo visual: gradient bg, max-w-[1400px], teal primary, cards arredondados (2xl)
- Light & dark mode + responsive (em mobile vira coluna única, ordem: KPIs > Próximas > Quick actions > Alertas > Atividade > Mês)

## Configuration
- shell: true
