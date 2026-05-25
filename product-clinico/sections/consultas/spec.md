# Consultas Specification

## Overview
Página de listagem de consultas finalizadas (assinadas) — destino próprio na navegação do consultório. Permite ao médico revisar o que foi feito hoje, na semana ou no mês com stats agregados (consultas, tempo total, prescrições emitidas, exames solicitados, imagens analisadas, % com IA escriba). Lista é agrupada por dia (mais recente primeiro) e cada item leva ao read-only do atendimento. NÃO inclui o fluxo da consulta ativa (esse é a section "consulta" singular).

## User Flows

### Revisar produção do dia
- Médico abre "Consultas" no menu lateral
- Filtro default = "Hoje"
- Vê stats no topo: 4 consultas · 1h57 totais · 3 prescrições · 9 exames sol. · 1 imagem IA · 3 com IA escriba
- Lista mostra cada atendimento com paciente, hora, queixa, hipótese e badges (modalidade, IA, rx, exames, imagens IA)

### Comparar período
- Clica em "Esta semana" / "Este mês" / "Tudo"
- Stats e lista se atualizam
- Lista agrupa por dia (cabeçalho "qua, 06 mai · 3", "ter, 05 mai · 2", etc.)

### Abrir um atendimento histórico
- Click no card → abre read-only drawer (reuso do AtendimentoDetalheDrawer da section pacientes)
- Vê SOAP completo, prescrições emitidas, exames solicitados, análises IA salvas

### Iniciar nova consulta
- Botão "Iniciar nova consulta" no header
- Navega para `/clinico/sections/consulta` (section ativa)

## UI Requirements
- Filtros pill (Hoje · Semana · Mês · Tudo) — default Hoje
- Header com título + CTA primário "Iniciar nova consulta"
- Stats em grid de 6 cards (responsivo: 2 col mobile, 4 col tablet, 6 col desktop)
- Lista agrupada por dia com header sticky-like
- Cards com avatar (iniciais), nome, hora, duração, queixa, hipótese itálica, badges coloridos por categoria
- Empty state quando filtro não retorna nada
- Click no card abre drawer read-only (não muda de página)

## Configuration
- shell: true
