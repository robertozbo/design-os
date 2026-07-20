# Cobrança Specification

## Overview
Central financeira operada pela **secretária** — sem acesso clínico. Concentra a cobrança particular (links PIX/cartão), recibos, histórico de pagamentos e o **tracking textual de convênio** (Unimed/Bradesco/Amil) previsto pro V1. Layout web de coluna única com faixa de KPIs no topo, duas abas (Particular · Convênio), busca/filtros e uma tabela de cobranças com ações por linha (copiar link, reenviar, emitir recibo, cancelar). Nenhum dado clínico aparece aqui: só nome do paciente, descrição comercial do atendimento, valor, método e status.

## User Flows

### Ver panorama financeiro do mês
- Faixa de 4 KPIs: Recebido no mês · A receber (pendente) · Links ativos · Convênio em análise
- Cada KPI com valor em BRL (tabular-nums) e delta vs mês anterior

### Criar link de cobrança particular
- Botão primário "Novo link de cobrança" abre drawer
- Campos: paciente (busca), descrição (ex: "Consulta 12/03", "Pacote Retornos 3x"), valor (BRL), método (PIX · Cartão · Ambos), vencimento opcional
- Gera link copiável + status inicial `link_enviado`

### Acompanhar cobranças particulares
- Aba "Particular": tabela com paciente · descrição · valor · método · status · data
- Status: `pago` (emerald) · `pendente` (amber) · `link_enviado` (sky) · `cancelado` (slate)
- Ações por linha: copiar link, reenviar, emitir recibo (só se pago), cancelar
- Filtro por status (chips) + período (7d · 30d · 90d · tudo) + busca por paciente

### Emitir e reenviar recibo
- Linha paga tem ação "Recibo" → gera/reenvia recibo por email/WhatsApp (mock)
- Histórico de recibos emitidos visível no detalhe da cobrança

### Tracking textual de convênio (V1)
- Aba "Convênio": lista de atendimentos vinculados a convênio com status **textual** (não é faturamento TUSS/SADT)
- Campos: paciente · convênio · procedimento (texto livre) · valor estimado · status (`enviado` · `em_analise` · `pago` · `glosado`)
- Secretária atualiza status manualmente (dropdown) e anota observação (ex: nº da guia)

### Exportar
- Botão "Exportar CSV" exporta a visão filtrada (particular ou convênio)

## UI Requirements
- Tema dark slate (bg-slate-950), cards rounded-2xl bg-slate-900 border-slate-800 — igual às demais sections clínicas
- Accent primário teal-500 (ativo/CTA); status por cor semântica (emerald/amber/sky/rose/slate)
- KPIs no topo em grid de 4 colunas (2 no mobile)
- Abas Particular · Convênio como segmented control
- Tabela responsiva: em < 768px vira lista de cards
- Valores monetários com IBM Plex Mono / tabular-nums
- Ações por linha em kebab menu (…) quando mais de 2
- Empty state quando não há cobranças no filtro
- **Nenhum dado clínico** — a section não importa prontuário, exames nem prescrição

## Configuration
- shell: false (web tem chrome próprio via shell-clinico persona "secretaria")
