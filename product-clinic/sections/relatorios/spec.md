# Relatórios Specification

## Overview
O painel de **relatórios gerenciais** da clínica para o **Admin/Gestor** — indicadores operacionais e de produtividade, sem nenhum dado clínico do paciente. Complementa o Faturamento com a leitura de **eficiência**: produção por médico (atendimentos, teleconsultas, no-shows, receita), **ocupação de salas**, **receita por especialidade** e o acompanhamento de **no-show** por médico. V1 = visão agregada do período com export CSV; comparativos temporais e metas entram no V2. Só Admin acessa.

## User Flows

### Ver os relatórios do período
- Admin abre Relatórios → KPIs (total de atendimentos, taxa de no-show, ocupação média de salas, receita total) do período
- Alterna período (mês/trimestre)
- Ou define um **intervalo de datas** (de/até) no topo, antes do mês/trimestre — aplicar troca o período para `personalizado` e desmarca os atalhos
- Vê a tabela de **produção por médico**: atendimentos, teleconsultas, no-shows, receita
- Vê a **ocupação de salas** (barra por sala)
- Vê a **receita por especialidade** (barra com valor e %)
- Vê o **no-show por médico** (barra com quantidade e taxa)

### Filtrar por intervalo de datas
- Preencher de/até e "Aplicar" → o subtítulo passa a mostrar a nova janela (`15/07 – 14/08/2026`)
- Aplicado → **nem Mês nem Trimestre** ficam ativos, e surge o chip "Personalizado ×"
- Clicar no "×" → volta ao mês, e as datas voltam à janela do mês
- Data final anterior à inicial → erro inline e "Aplicar" desabilitado
- Intervalo igual ao vigente, ou uma das datas vazia → "Aplicar" desabilitado
- Alternar Mês ↔ Trimestre → os inputs se realinham à janela do atalho

### Exportar
- "Exportar CSV" gera o relatório consolidado do período (mock) — para análise em planilha

### Detalhe de linha
- Clicar numa linha de produção por médico mostra um resumo (mock) — sem abrir prontuário

## UI Requirements

### Layout
- **Header**: "Relatórios" + nome da clínica + janela vigente (dd/mm – dd/mm/aaaa) + **filtro de datas (de/até + Aplicar)** + período (mês/trimestre) + "Exportar CSV" — nessa ordem
- **KPIs** (4-5): Total atendimentos, Taxa de no-show %, Ocupação média %, Receita total, Teleconsultas
- **Produção por médico** (tabela): avatar + especialidade + atendimentos + teleconsultas + no-shows + receita
- **Ocupação de salas**: barras por sala (nome + % ocupação)
- **Receita por especialidade**: barras (especialidade + valor + %)
- **No-show por médico**: barras (nome + quantidade + taxa %)

### Estados & regras
- **Intervalo de datas**: "Aplicar" só habilita com as duas datas preenchidas e diferentes da janela vigente; data final anterior à inicial bloqueia e mostra erro inline. Com `personalizado` ativo, mês/trimestre ficam sem seleção e um chip "Personalizado ×" volta para o mês
- Percentuais (no-show, ocupação) exibidos com uma casa quando necessário
- Valores em R$ (pt-BR)
- Barra de no-show usa tom âmbar/rose (alerta); ocupação e receita usam teal
- Nenhum dado clínico do paciente — apenas contagens e valores agregados

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Independente de `sections-doctor`
- Cores de especialidade consistentes com o Faturamento (mesmos médicos)
