# Contas a Receber Specification

## Overview
Página dedicada aos **recebimentos** da clínica (pacientes e convênios). Rota própria (`/clinic/sections/contas-receber`). KPIs no topo, filtros por período/status/busca, tabela com status e ações, modal de nova conta a receber e modal de confirmar pagamento. Alimentada pelo "Gerar financeiro" do agendamento (cada parcela vira uma conta a receber).

## User Flows
- Filtra por período (de/até por vencimento), status (Todos/Em aberto/Pago/Vencido) e busca (paciente/descrição).
- **Confirmar pagamento**: na linha em aberto/vencida → modal com paciente, valor e data de pagamento → status vira Pago.
- **Adicionar**: botão "+ Adicionar conta a receber" → modal com **serviço** (do catálogo, preenche valor), paciente (opcional), vencimento, valor, método, recorrência, status.
- Ações por linha: confirmar pagamento, ver, editar, excluir.

## UI Requirements
- Header: título "Contas a receber" + botão adicionar.
- KPIs (4): A receber · Recebido · A pagar · Saldo previsto.
- Filtros: De, Até, Status, Busca, Limpar.
- Tabela: Paciente · Descrição (+método) · Vencimento · Valor (+verde) · Status · Ações. Rodapé com contagem e total.
- Modais: Nova conta a receber, Confirmar pagamento.

## Estados & regras
- Vencido = aberto com vencimento < hoje (usa `hoje` do data.json).
- Serviço vem do catálogo `servicos` (fonte da descrição); "Outro serviço…" libera texto livre.

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based. Valores pt-BR, datas dd/mm/aaaa. Compartilha componentes com Contas a Pagar.
