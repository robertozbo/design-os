# Consultas Specification

## Overview
Section onde o paciente vê as consultas que os profissionais vinculados ou a clínica marcaram para ele. Não há agendamento por aqui: quem marca é o profissional. O paciente acompanha o que vem, sabe o que fazer no dia (chegar à clínica ou entrar na teleconsulta) e consulta o histórico.

Fonte no backend: `professional_appointments` onde `user_id` é o paciente. Hoje só existe a leitura das consultas **de hoje**, presenciais e com sala (`clinic.agendaMinhasConsultasDeHoje`). A lista completa (próximas + anteriores) precisa de uma procedure nova, só de leitura, para o paciente.

## User Flows

### Aba Próximas (default)
- Destaque **Hoje** no topo quando há consulta no dia: hora grande, profissional, serviço, local (clínica · sala) ou "Teleconsulta".
  - Presencial: botão **Fazer check-in** → abre o código de chegada (6 dígitos + QR, vale 5 minutos, com contagem `mm:ss`). Depois do check-in o card mostra "Chegada confirmada às HH:MM".
  - Teleconsulta: botão **Entrar na consulta**. Liberado 15 minutos antes do horário; antes disso aparece "Libera às HH:MM". Sem link ainda: "O profissional envia o link na hora".
- Abaixo, as próximas consultas agrupadas por mês: bloco de data (dia + mês curto), hora, profissional com selo do tipo, serviço e modalidade.
- Status visível no card: **Agendada**, **Confirmada** e **Cancelamento pedido**.
- Contador de próximas no chip da aba.

### Aba Anteriores
- Consultas passadas, da mais recente para a mais antiga.
- Status com cor neutra: **Realizada**, **Cancelada** (com quem cancelou) e **Faltou**.

### Detalhe da consulta (sheet)
- Toque no card abre o sheet com data por extenso, hora e duração, profissional, serviço, modalidade e local.
- Também mostra a orientação do profissional, se houver (ex.: "Venha em jejum de 8h").
- Ações: a ação do dia (check-in ou entrar), **Adicionar ao calendário** e **Conversar com o profissional**.
- Consulta cancelada mostra o motivo, quando houver.

### Vazio
- Sem nenhuma consulta: "Nenhuma consulta marcada". A explicação diz que as consultas aparecem aqui quando um profissional vinculado marcar, e o CTA leva para Profissionais.

## UI Requirements
- Header sub-page "Consultas", subtítulo "Marcadas pelos seus profissionais".
- Mesma linguagem visual de Profissionais: fundo slate-950, cards slate-900 com borda slate-800 e selos de tipo (Nutri, Personal, Médico, Psicólogo, Fisio).
- Hora e datas em Geist Mono com `tabular-nums`.
- Teal para ação principal, sky para teleconsulta, amber para "Cancelamento pedido", rose só para cancelada ou falta.
- O código de chegada só nasce por toque deliberado, nunca vem junto da lista. Não é credencial, é ponteiro de vida curta.
- Teleconsulta não tem check-in.

## Out of Scope (V2)
- Pedir cancelamento ou remarcação pelo paciente. O campo `cancellation_requested_by_user` existe, mas não há procedure de paciente; hoje o card só **mostra** o pedido.
- Confirmar presença pelo app. Hoje a confirmação vem por link com token (`clinicConfirmacao`), fora da sessão.

## Configuration
- shell: true
