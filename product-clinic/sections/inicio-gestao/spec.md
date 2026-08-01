# Visão Geral (Gestão) Specification

## Overview
A home do **Admin/Gestor** da clínica — o painel de negócio que ele vê ao entrar. Mostra os indicadores da operação (atendimentos, receita, ocupação de salas, equipe, no-show, pacientes ativos), a **produção por médico**, a **receita por especialidade** e as **pendências** que exigem ação. **Não exibe nenhum conteúdo clínico de paciente** (RBAC: admin é gestão, não clínico). É a contraparte de gestão da "Início" do médico.

## User Flows

### Ver o painel
- Admin entra → vê KPIs do período (semana/mês) no topo
- Rola para produção por médico (atendimentos + receita + ocupação), receita por especialidade, ocupação de salas hoje e pendências
- Alterna período (Hoje / Semana / Mês) nos KPIs principais (mock)

### Agir sobre pendências
- Bloco "Pendências" lista itens acionáveis (convites aguardando aceite, agendamentos pendentes de confirmação, salas ociosas) com contagem e atalho para a section correspondente

## UI Requirements

### Layout
- **Header**: "Visão geral" + nome da clínica + seletor de período (Hoje/Semana/Mês)
- **KPI grid** (6 cards): Atendimentos, Receita, Ocupação média de salas, Médicos ativos, Taxa de no-show, Pacientes ativos — cada um com valor + delta vs. período anterior (↑/↓) + sublinha
- **Atendimentos por dia** (mini bar chart da semana)
- **Produção por médico**: lista com avatar + especialidade + nº atendimentos + barra + receita
- **Receita por especialidade**: barras horizontais com % e valor
- **Ocupação de salas hoje**: barras por sala
- **Pendências**: lista com ícone, label, contagem e link ("Ver")

### Estados & regras
- Delta positivo = emerald ↑; negativo = rose ↓
- Ocupação ≥85% âmbar/vermelho; no-show alto destacado
- Valores monetários em R$ (pt-BR)

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Independente de `sections-doctor`
- Sem charting lib — barras em CSS/Tailwind
- Zero dado clínico (só agregados de negócio)
