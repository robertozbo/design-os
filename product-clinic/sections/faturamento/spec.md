# Faturamento Specification

## Overview
A visão financeira da clínica para o **Admin/Gestor** — receita, cobranças e **repasse por médico**. Complementa a Visão geral com o detalhe do dinheiro: quanto cada médico produziu, qual o repasse (percentual do profissional) e o líquido da clínica, além do extrato de cobranças (PIX/cartão/convênio) e o tracking textual de convênios. V1 = cobrança particular + convênio como texto (TUSS/SADT é V2+). Só Admin acessa; export CSV para o contador.

## User Flows

### Ver o faturamento do período
- Admin abre Faturamento → KPIs (receita, recebido, a receber, repasse total, líquido) do período
- Alterna período (mês/trimestre)
- Vê a tabela de **repasse por médico**: atendimentos, receita bruta, % repasse, valor de repasse, líquido da clínica
- Vê o extrato de **cobranças** recentes com filtro por status (pago/pendente/estornado) e forma de pagamento
- Vê a quebra por **convênio** (tracking textual)

### Exportar
- "Exportar CSV" gera o extrato do período (mock) — para o contador

### Detalhe de cobrança
- Clicar numa cobrança mostra detalhe (paciente, médico, valor, forma, status, data) — ações mock (marcar pago, estornar)

## UI Requirements

### Layout
- **Header**: "Faturamento" + nome da clínica + período + "Exportar CSV"
- **KPIs** (5): Receita bruta, Recebido, A receber, Repasse médicos, Líquido clínica
- **Repasse por médico** (tabela): avatar + especialidade + atendimentos + receita bruta + % + repasse + líquido
- **Cobranças** (lista/tabela): paciente, médico, valor, forma (ícone), status (badge), data; filtro-chip por status
- **Por convênio**: barras com valor por convênio (Particular, Unimed, Bradesco…)

### Estados & regras
- Status: pago = emerald, pendente = amber, estornado = slate/red
- Valores em R$ (pt-BR); repasse em %
- Convênio = texto (sem TUSS/SADT no V1)

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Independente de `sections-doctor`
- Cores de especialidade consistentes com o resto do produto
