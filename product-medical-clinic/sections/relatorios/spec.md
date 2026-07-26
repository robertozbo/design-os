# Relatórios Specification

## Overview
O painel de **relatórios gerenciais** da clínica para o **Admin/Gestor** — indicadores operacionais e de produtividade, sem nenhum dado clínico do paciente. Complementa o Faturamento com a leitura de **eficiência**: produção por médico (atendimentos, teleconsultas, no-shows, receita), **ocupação de salas**, **receita por especialidade** e o acompanhamento de **no-show** por médico. V1 = visão agregada do período com export CSV; comparativos temporais e metas entram no V2. Só Admin acessa.

## User Flows

### Ver os relatórios do período
- Admin abre Relatórios → KPIs (total de atendimentos, taxa de no-show, ocupação média de salas, receita total) do período
- Alterna período (mês/trimestre)
- Vê a tabela de **produção por médico**: atendimentos, teleconsultas, no-shows, receita
- Vê a **ocupação de salas** (barra por sala)
- Vê a **receita por especialidade** (barra com valor e %)
- Vê o **no-show por médico** (barra com quantidade e taxa)

### Exportar
- "Exportar CSV" gera o relatório consolidado do período (mock) — para análise em planilha

### Detalhe de linha
- Clicar numa linha de produção por médico mostra um resumo (mock) — sem abrir prontuário

## UI Requirements

### Layout
- **Header**: "Relatórios" + nome da clínica + período (mês/trimestre) + "Exportar CSV"
- **KPIs** (4-5): Total atendimentos, Taxa de no-show %, Ocupação média %, Receita total, Teleconsultas
- **Produção por médico** (tabela): avatar + especialidade + atendimentos + teleconsultas + no-shows + receita
- **Ocupação de salas**: barras por sala (nome + % ocupação)
- **Receita por especialidade**: barras (especialidade + valor + %)
- **No-show por médico**: barras (nome + quantidade + taxa %)

### Estados & regras
- Percentuais (no-show, ocupação) exibidos com uma casa quando necessário
- Valores em R$ (pt-BR)
- Barra de no-show usa tom âmbar/rose (alerta); ocupação e receita usam teal
- Nenhum dado clínico do paciente — apenas contagens e valores agregados

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Independente de `sections-clinico`
- Cores de especialidade consistentes com o Faturamento (mesmos médicos)
