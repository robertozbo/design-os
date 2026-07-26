# Serviços Specification

## Overview
Cadastro-mãe do faturamento: os **serviços** que a clínica vende, cada um com **preço** e **duração (min)** e vinculado a um **tipo de receita** (categoria). É a fonte que popula o valor/duração automaticamente ao selecionar um serviço na **Consulta/Agendamento** (procedimento → duração) e em **Contas a Receber** (serviço → valor). Rota própria (`/medical-clinic/sections/servicos`), grupo Financeiro.

## User Flows
- Lista de serviços agrupados por categoria (tipo de receita), cada um mostrando **preço** e **tempo**.
- **Adicionar serviço** → modal: nome, categoria, **preço (R$)**, **duração (minutos)**, ativo.
- **Editar** / **excluir** / **ativar-desativar** serviço.
- Filtro por categoria e busca por nome.

## Integração (auto-popular)
- Ao escolher o serviço no **agendamento** (procedimento) → preenche a duração (e ajusta o horário de fim) e sugere o valor.
- Ao escolher o serviço em **Contas a Receber** → preenche o valor.
- (No protótipo cada tela tem seu dado; no produto real é a mesma fonte via API.)

## UI Requirements
- Header: título "Serviços" + resumo (nº serviços, ticket médio) + botão adicionar.
- Filtro por categoria + busca.
- Lista agrupada por categoria; item: nome · badge de duração (ex.: 40 min) · preço (R$) · ações (editar, excluir, ativar/desativar).
- Modal com nome, categoria, preço, duração, ativo.

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based. Valores pt-BR, duração em minutos.
