# Início (Médico) Specification

## Overview
A home do **médico** ao entrar no sistema. Centraliza o dia dele: a **agenda do dia** (suas consultas, presencial + teleconsulta), os **alertas acionáveis** (mensagens não lidas do canal clínico, exames novos aguardando revisão, encaminhamentos recebidos de colegas) e os **encaminhamentos internos** que colegas enviaram e aguardam aceite. **Escopo = só os pacientes/atendimentos do próprio médico + o que lhe foi encaminhado** (RBAC: não vê a agenda dos outros médicos). É a contraparte clínica da "Visão geral" do Admin.

## User Flows

### Começar o dia
- Médico entra → vê saudação, data e um resumo do dia (nº de consultas, quantas já realizadas, próxima)
- Vê a fila de alertas no topo (mensagens, exames a revisar, encaminhamentos) com contagem
- Rola a agenda do dia em ordem cronológica; a consulta "agora"/"próxima" fica destacada

### Iniciar um atendimento
- Clica numa consulta da agenda → abre a **Consulta** (atendimento) daquele paciente
- Consulta com status `em-atendimento` mostra CTA "Continuar"; as futuras mostram "Abrir"

### Agir sobre alertas
- Clica num alerta (mensagens / exames / encaminhamentos) → navega para a section correspondente

### Aceitar encaminhamento
- Bloco "Encaminhamentos recebidos" lista os que colegas enviaram (de quem, paciente, motivo, contexto)
- Médico **aceita** (assume o vínculo de cuidado) ou **abre** para ver o contexto clínico antes

## UI Requirements

### Layout
- **Header**: saudação ("Bom dia, Dra. Helena") + data por extenso + linha de resumo ("6 consultas · 2 realizadas · próxima 11:00")
- **Alertas** (3 cards clicáveis no topo): Mensagens não lidas, Exames a revisar, Encaminhamentos — ícone + label + contagem; badge de destaque quando count > 0
- **Agenda do dia** (coluna principal): timeline vertical das consultas com horário, paciente (avatar+nome+idade+convênio), motivo, modalidade (presencial/tele), sala e status. Consulta atual destacada (anel teal). Vindas de encaminhamento levam um marcador.
- **Encaminhamentos recebidos** (coluna lateral): cards com médico de origem (avatar+especialidade), paciente, motivo, contexto e ações Aceitar / Abrir

### Estados & regras
- Status da consulta: `confirmado`, `aguardando`, `em-atendimento`, `realizado`, `faltou`, `cancelado` — cada um com cor própria
- `realizado`/`cancelado`/`faltou` aparecem esmaecidos (dia já passou por eles)
- Modalidade `tele` mostra ícone de vídeo; `presencial` mostra a sala
- Alerta com count 0 fica neutro (sem badge)
- Sem consulta hoje → empty state na agenda

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Cores de especialidade compartilhadas com prontuário/agenda (`CorEspecialidade`)
- Sem charting lib
- Reforça o escopo: só dados do médico logado (nada de agregado da clínica aqui)
