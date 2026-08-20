# Meus Recebimentos Specification

## Overview
A página de **comissão do profissional** — quanto a clínica deve a ele, o que já está liberado e o que ainda depende de pagamento. Vale para qualquer profissional que atende por comissão (médico, nutricionista, fisioterapeuta, dentista), não só médico. A regra que organiza a tela é uma só: **o atendimento só vira dinheiro dele depois que o paciente paga**. Por isso "produzi" ≠ "vou receber", e a tela mostra os dois lados mais o **acumulado**, para ele se programar. V1 é só particular — convênio (e a glosa que vem junto) fica para depois. Só o próprio profissional vê; é o recorte dele do Faturamento, sem nenhum número dos colegas nem da clínica.

## User Flows

### Saber quanto vou receber e quando
- Profissional abre Meus recebimentos → card **Próximo repasse**: valor líquido e a data prevista (dia 10 do mês seguinte)
- Ao lado, **Ainda não liberado**: o que já foi atendido mas o paciente ainda não pagou, com a regra escrita
- Números da competência: atendimentos, produzido (bruto), sua comissão e o **recebido em 2026**

### Ver o acumulado e o ritmo do mês
- Curva de **comissão acumulada dia a dia**, com média por dia útil
- Linha tracejada projeta o fechamento no mesmo ritmo ("fecha ~R$ X em 31 ago")
- Rodapé lembra que o que cai na conta depende do que a clínica receber até o fechamento

### Entender a composição
- Barra única com **liberado / em aberto** sobre a comissão do mês
- **De onde vem sua comissão**: barra por tipo de atendimento (consulta, retorno, teleatendimento, sessão), com o % do contrato e quanto de cada um ainda está em aberto
- **Deduções do período**: materiais, adiantamentos já pagos — cada uma com descrição e valor

### Conferir atendimento por atendimento
- Extrato com filtro por situação (Todos · Liberado · Em aberto)
- Linha: data, paciente, atendimento, pagamento (forma + data, ou `paciente não pagou`), valor cobrado, **sua parte** com o % aplicado, e a situação
- Acima de 20 linhas, a tabela corta e oferece "Mostrar todos os N atendimentos"

### Histórico e recibo
- **Repasses já pagos** por competência, com atendimentos, data do pagamento e nº do recibo, e o **acumulado recebido** no canto
- Clicar abre o detalhe: produzido, comissão, deduções e líquido pago · "Baixar recibo" (mock)
- "Exportar extrato" gera CSV do período (mock)

## UI Requirements

### Layout
- **Header**: "Meus recebimentos" + profissional, conselho e clínica + "Exportar extrato"
- **Próximo repasse** (2/3, teal): valor grande, `liberado − deduções`, competência parcial até a data
- **Ainda não liberado** (1/3, âmbar): valor e a regra do pagamento
- **KPIs** (4): Atendimentos · Produzido (bruto) · Sua comissão (teal) · Recebido em 2026
- **Como está sua comissão do mês**: barra empilhada + legenda com os dois valores
- **Acumulado da competência**: área + linha teal, projeção tracejada, média por dia útil
- **De onde vem sua comissão** (por tipo de atendimento) | **Deduções do período** (2 colunas)
- **Extrato de atendimentos**: filtros + tabela (grid no desktop, blocos no mobile)
- **Repasses já pagos** + modal de recibo

### Estados & regras
- Situação: liberado (emerald) · em aberto (âmbar)
- % de repasse varia por tipo de atendimento (consulta/retorno 60%, teleatendimento 55%, sessão/procedimento 50%) e aparece em cada linha
- Valores em R$ (pt-BR), `tabular-nums` em toda coluna de número

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Os agregados (`resumo`, `porServico`) são **derivados do extrato** na geração do `data.json` — nenhum total é digitado à mão, senão a página soma diferente do que lista
- Julho no histórico bate com o repasse de Dra. Helena Prado no Faturamento do admin (R$ 28.800 · 60%)
- Nada de dado de colega: é o recorte individual, não o painel da clínica
