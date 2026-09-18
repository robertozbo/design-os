# Detalhe da Métrica Specification

## Overview

Tela de detalhe de uma métrica individual (ex: frequência cardíaca), aberta ao tocar numa métrica na lista de Métricas. Mostra o valor atual, um gráfico grande interativo, filtro de período (7 dias a 1 ano), estatísticas (mín/média/máx) e o histórico cronológico de leituras. É a tela "como tá meu BPM" do paciente curioso. Renderiza full-screen com header próprio (sem a chrome de tab da shell).

## User Flows

- Usuário toca numa métrica na lista → abre este detalhe já no período de 7 dias
- Usuário troca o período (7 dias / 30 dias / 3 meses / 6 meses / 1 ano) → gráfico, stats e histórico recalculam
- Usuário toca/arrasta no gráfico → tooltip com valor + data do ponto
- Usuário toca em "Adicionar registro" → abre o formulário de cadastro de registro pra essa métrica
- Usuário toca em ← → volta pra lista de Métricas

## UI Requirements

Fundo `slate-950`, header próprio (sem header de tab da shell). Estrutura topo → base:

1. **Header:** ← voltar · ícone da métrica (cor da categoria) · nome + fonte humanizada (`Apple Watch · há 4 min`)
2. **Valor atual:** número grande mono 40px tabular-nums + unidade + delta colorido (`↑/↓/—`) "vs período anterior"
3. **Filtro de período:** pills `7 dias` (default) · `30 dias` · `3 meses` · `6 meses` · `1 ano`. Active `teal-500`.
4. **Gráfico (`BigChart`):** line chart SVG interativo (sem lib), área com gradient na cor da métrica, faixa normal sombreada (`emerald`) entre normalMin/normalMax quando houver, eixo X com 3 rótulos de data, tooltip + guia vertical + ponto no toque/hover, último ponto destacado
5. **Legenda da faixa normal** (quando aplicável)
6. **Stats:** 3 cards — Mín · Média · Máx (mono tabular-nums)
7. **Histórico:** lista cronológica (mais recente primeiro): data, fonte, valor; rodapé "+ N leituras anteriores"
8. **Botão "Adicionar registro"** (`teal-500`, full width) — oculto para métricas compostas (ex: pressão arterial)

**Navegação:** recebe a métrica via query param `?m=[id]` (default: frequência cardíaca em repouso).

**Dados:** no app real a série vem de `GET /metrics?metricTypeId=X&periodo=Y`. No protótipo, derivada do `sparkline` (7d usa o sparkline real; períodos maiores usam random walk determinístico ancorado no valor atual).

Fora do escopo: comparação com população, edição/exclusão de leituras, exportação.

## Configuration

- shell: false
