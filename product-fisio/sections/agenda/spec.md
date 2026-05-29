# Agenda Specification

## Overview
Agenda visual do fisioterapeuta (dia e semana) com criação rápida de agendamento, bloqueio de horários, recorrências e lembrete automático via WhatsApp para o paciente. É a tela de entrada diária — o fisio abre o app pela manhã para ver "o que tenho hoje".

## User Flows
- Ver agenda em visualização Dia (foco hoje) ou Semana (planejamento)
- Criar agendamento: selecionar paciente (autocomplete) + data/hora + duração + recorrência opcional
- Confirmar / cancelar agendamento (paciente confirma via WhatsApp)
- Marcar sessão como **realizada** (vai pra Evolução) · **falta** · **cancelada**
- Bloquear horário (almoço, curso, indisponibilidade)
- Reenviar lembrete via WhatsApp manualmente
- Ver detalhes do paciente direto do agendamento (link pro Hub)

## UI Requirements
- Header: título "Agenda" · seletor de data + setas prev/next + botão "Hoje" · toggle Dia/Semana · botão "+ Agendar"
- KPIs do dia: Total agendado · Confirmados · Pendentes · Realizados até agora
- **Visão Dia**: timeline vertical (07:00 → 21:00) com slots de 30min, cards de agendamento ocupando o tempo correto, bloqueios em cinza
- **Visão Semana**: grid 7 colunas (Dom-Sáb), mesma timeline vertical, cards menores
- Card de agendamento: nome do paciente · queixa curta · status (badge) · ações (confirmar · realizar · cancelar) no hover
- Cor do card por status: cinza (agendado) · azul (confirmado) · verde (realizado) · âmbar (pendente) · vermelho (falta)
- Drawer "Novo agendamento":
  - Paciente (autocomplete, com opção "Cadastrar novo")
  - Data + hora início (inputs com máscara)
  - Duração (select: 30 / 45 / 60 / 90 min)
  - Recorrência (Nenhuma / Semanal / Quinzenal / Personalizada)
  - Observação curta opcional
  - Toggle "Enviar lembrete WhatsApp 24h antes" (default ON)

## Configuration
- shell: true
