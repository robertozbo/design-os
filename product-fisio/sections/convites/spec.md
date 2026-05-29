# Convites Specification

## Overview
Central de convites do fisioterapeuta — dois fluxos distintos em tabs:
1. **Recebidos**: solicitações de agendamento que pacientes mandaram pelo perfil público (nymos.app/fisio/slug). Fisio aceita, recusa ou reagenda.
2. **Enviados**: histórico de convites pro Nymos Move que o fisio mandou pra seus pacientes cadastrados (pendentes, aceitos, expirados).

## User Flows
### Tab Recebidos
- Ver lista de solicitações pendentes
- Aceitar com 1 click (entra direto na agenda no horário pedido)
- Reagendar (drawer com agenda + sugestão de horários alternativos)
- Recusar com motivo opcional
- Ver perfil/contato do paciente solicitante
- Filtrar por status (Pendente · Aceito · Recusado · Expirado)

### Tab Enviados
- Ver lista de convites Nymos Move enviados
- Status por convite: Pendente · Aceito · Recusado · Expirado (>7 dias)
- Reenviar convite expirado
- Cancelar convite pendente
- Copiar link do convite
- Filtrar por status

## UI Requirements
- Header padrão (eyebrow + ícone teal + título + subtítulo + CTA "+ Novo convite")
- 2 tabs com contadores: Recebidos (X) · Enviados (Y)
- KPIs inline por tab (pendentes / aceitos / taxa de aceitação)
- Cards densos com avatar, nome, info, ações inline
- Card de recebido: borda âmbar para pendente, verde para aceito, cinza para recusado
- Card de enviado: status badge + tempo desde envio + canal de envio (WhatsApp/Email/Link)

## Configuration
- shell: true
