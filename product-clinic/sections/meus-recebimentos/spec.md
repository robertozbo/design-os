# Meus Recebimentos Specification

## Overview
A página de **comissão do profissional** — quanto a clínica deve a ele, o que já está liberado e o que ainda depende de pagamento. Vale para qualquer profissional que atende por comissão (médico, nutricionista, fisioterapeuta, dentista), não só médico. A regra que organiza a tela é uma só: **o atendimento só vira dinheiro dele depois que o pagamento entra na clínica** — o particular quando o paciente paga, o convênio quando o convênio repassa. Por isso "produzi" ≠ "vou receber", e a tela mostra os dois lados mais o **acumulado**, para ele se programar. Só o próprio profissional vê; é o recorte dele do Faturamento, sem nenhum número dos colegas nem da clínica.

## User Flows

### Saber quanto vou receber e quando
- Profissional abre Meus recebimentos → card **Próximo repasse**: valor líquido e a data prevista (dia 10 do mês seguinte)
- Ao lado, **Ainda não liberado**: o que já foi atendido mas ainda não foi pago à clínica, com a regra escrita e o total glosado destacado
- Números da competência: atendimentos, produzido (bruto), sua comissão e **a receber acumulado** (liberado + aguardando)

### Ver o acumulado e o ritmo do mês
- Curva de **comissão acumulada dia a dia**, com média por dia útil
- Linha tracejada projeta o fechamento no mesmo ritmo ("fecha ~R$ X em 31 ago")
- Rodapé lembra que o que cai na conta depende do que a clínica receber até o fechamento

### Entender a composição
- Barra única com **liberado / aguardando / glosado** sobre a comissão do mês
- **De onde vem sua comissão**: barra por fonte (Particular e cada convênio), com quanto de cada uma ainda está aguardando
- **Deduções do período**: materiais, adiantamentos já pagos — cada uma com descrição e valor

### Conferir atendimento por atendimento
- Extrato com filtro por situação (Todos · Liberado · Aguardando · Glosado)
- Linha: data, paciente, atendimento, fonte, valor cobrado, **sua parte** com o % aplicado, e a situação
- Aguardando mostra o porquê: `convênio · set/2026` ou `paciente não pagou`
- Glosado mostra o motivo da glosa (guia sem autorização, divergência de código, carência)

### Histórico e recibo
- **Repasses já pagos** por competência, com atendimentos, data do pagamento e nº do recibo, e o **acumulado recebido** no canto
- Clicar abre o detalhe: produzido, comissão, deduções e líquido pago · "Baixar recibo" (mock)
- "Exportar extrato" gera CSV do período (mock)

## UI Requirements

### Layout
- **Header**: "Meus recebimentos" + profissional, conselho e clínica + "Exportar extrato"
- **Próximo repasse** (2/3, teal): valor grande, `liberado − deduções`, competência parcial até a data
- **Ainda não liberado** (1/3, âmbar): valor, regra do prazo, aviso de glosa em rose
- **KPIs** (4): Atendimentos · Produzido (bruto) · Sua comissão (teal) · A receber acumulado
- **Como está sua comissão do mês**: barra empilhada + legenda com os três valores
- **Acumulado da competência**: área + linha teal, projeção tracejada, média por dia útil
- **De onde vem sua comissão** | **Deduções do período** (2 colunas)
- **Extrato de atendimentos**: filtros + tabela (grid no desktop, blocos no mobile)
- **Repasses já pagos** + modal de recibo

### Estados & regras
- Situação: liberado (emerald) · aguardando (âmbar) · glosado (rose)
- **Glosa não entra na comissão** nem na curva acumulada — curva que sobe com valor glosado promete repasse que não existe
- % de repasse varia por tipo de atendimento (consulta/retorno 60%, teleatendimento 55%, sessão/procedimento 50%) e aparece em cada linha
- Convênio paga tabela própria, sempre menor que o particular — o extrato mostra o valor cobrado e a parte dele
- Valores em R$ (pt-BR), `tabular-nums` em toda coluna de número

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Os agregados (`resumo`, `porFonte`) são **derivados do extrato** na geração do `data.json` — nenhum total é digitado à mão, senão a página soma diferente do que lista
- Julho no histórico bate com o repasse de Dra. Helena Prado no Faturamento do admin (R$ 28.800 · 60%)
- Nada de dado de colega: é o recorte individual, não o painel da clínica
