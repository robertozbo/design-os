# Salas & Recursos Specification

## Overview
Cadastro e ocupação das **salas e recursos** da clínica — os consultórios, salas de procedimento e a "sala" virtual de teleconsulta que a Agenda usa. Fecha o pilar da agenda multi-profissional: sem sala cadastrada não há para onde alocar a consulta. Mostra, por sala, os equipamentos, o horário de funcionamento e a **ocupação do dia** (quantas horas/consultas), ajudando a gestão a ver gargalo de recurso. Papel Admin gerencia; recepção/médico consultam.

## User Flows

### Ver as salas
- Admin abre Salas & recursos → grid de cards, um por sala
- Cada card: nome, local (andar), tipo (consultório / procedimento / teleconsulta), status (ativa/inativa), equipamentos (chips), **barra de ocupação de hoje** (horas ocupadas / disponíveis + nº de consultas) e a próxima consulta agendada
- KPIs no topo: nº de salas ativas, ocupação média do dia, salas ociosas

### Detalhe / editar sala
- Clicar num card abre drawer: campos (nome, local, tipo, capacidade), lista de recursos (adicionar/remover), horário de funcionamento, toggle ativa/inativa
- Salvar (mock) atualiza o card

### Nova sala
- "+ Nova sala" (mock): cadastra sala que passa a aparecer como coluna na Agenda (visão Salas)

## UI Requirements

### Layout
- **Header**: "Salas & recursos" + "N salas · ocupação média X%" + "+ Nova sala" (teal)
- **KPIs**: 3 mini-cards (salas ativas, ocupação média, salas ociosas)
- **Grid** de cards (2–3 colunas): tipo com ícone, badge de status, chips de recursos, **barra de ocupação** colorida (verde ok / âmbar cheio), rodapé com próxima consulta
- **Drawer** de detalhe/edição à direita

### Estados & regras
- Sala inativa: card esmaecido + badge "inativa"; não recebe agendamento
- Ocupação ≥ 85%: barra âmbar/vermelha (gargalo); 0%: "ociosa hoje"
- Teleconsulta: tipo especial, sem local físico, capacidade ilimitada

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Independente de `sections-clinico`
- Salas devem casar com as usadas na Agenda (Sala 1/2/3 + Teleconsulta)
