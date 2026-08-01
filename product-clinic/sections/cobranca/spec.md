# Cobrança Specification

## Overview
A visão operacional de cobrança para a **Recepção** — o dia a dia de criar, enviar e acompanhar cobranças individuais dos pacientes. Diferente do Faturamento (Admin, que agrega receita e repasse por médico), a Cobrança é focada na tarefa: gerar link PIX/cartão, registrar dinheiro/convênio, marcar como pago, emitir recibo e estornar. V1 = cobrança particular + convênio como **tracking textual** (TUSS/SADT/glosa é V2+). Export CSV do histórico. Sem qualquer dado clínico.

## User Flows

### Ver as cobranças do dia
- Recepção abre Cobrança → KPIs rápidos (recebido hoje, a receber, nº pendentes)
- Vê a lista de cobranças: paciente, médico/especialidade, valor, forma (PIX/cartão/dinheiro/convênio), status (pago/pendente/estornado), data
- Filtra por status via chips

### Criar uma cobrança
- "Nova cobrança" abre um painel leve (paciente, médico, valor, forma) — envio mock (gera link PIX/cartão)

### Acompanhar / agir numa cobrança
- Clicar numa cobrança mostra o detalhe (mock) com ações: enviar link, marcar pago, emitir recibo, estornar

### Exportar
- "Exportar CSV" gera o histórico de cobranças (mock)

## UI Requirements

### Layout
- **Header**: "Cobrança" + nome da clínica + "Nova cobrança" + "Exportar CSV"
- **KPIs** (3): Recebido hoje, A receber, Pendentes (contagem)
- **Cobranças** (lista): avatar + paciente, médico/especialidade (badge), valor, forma (ícone), status (badge), data; filtro-chip por status
- **Nova cobrança**: painel inline leve (mock) — não persiste

### Estados & regras
- Status: pago = emerald, pendente = amber, estornado = slate/red
- Valores em R$ (pt-BR)
- Convênio = texto (sem TUSS/SADT no V1)
- Sem repasse por médico nem líquido da clínica (isso é do Faturamento/Admin)

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Independente de `sections-doctor`
- Cores de especialidade consistentes com Faturamento e o resto do produto
