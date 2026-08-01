# Contas a Pagar Specification

## Overview
Página dedicada às **despesas** da clínica (fornecedores, aluguel, salários, insumos, impostos). Rota própria (`/clinic/sections/contas-pagar`). KPIs no topo, filtros por período/status/busca, tabela com status e ações, modal de nova conta a pagar e modal de confirmar pagamento.

## User Flows
- Filtra por período (de/até por vencimento), status (Todos/Em aberto/Pago/Vencido) e busca (fornecedor/descrição).
- **Confirmar pagamento**: na linha em aberto/vencida → modal com fornecedor, valor e data de pagamento → status vira Pago.
- **Adicionar**: botão "+ Adicionar conta a pagar" → modal com descrição, fornecedor, **categoria**, vencimento, valor, método, recorrência, status.
- Ações por linha: confirmar pagamento, ver, editar, excluir.

## UI Requirements
- Header: título "Contas a pagar" + botão adicionar.
- KPIs (4): A receber · Recebido · A pagar · Saldo previsto.
- Filtros: De, Até, Status, Busca, Limpar.
- Tabela: Fornecedor · Descrição (+categoria/método) · Vencimento · Valor (−) · Status · Ações. Rodapé com contagem e total.
- Modais: Nova conta a pagar, Confirmar pagamento.

## Estados & regras
- Vencido = aberto com vencimento < hoje (usa `hoje` do data.json).
- Categoria vem de `categoriasPagar`.

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based. Valores pt-BR, datas dd/mm/aaaa. Compartilha componentes com Contas a Receber.
