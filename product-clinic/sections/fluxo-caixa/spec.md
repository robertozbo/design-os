# Fluxo de Caixa Specification

## Overview
A visão de **caixa** da clínica para o **Admin/Gestor**: quanto entrou, quanto saiu e — o que importa
de verdade — **em que dia o saldo projetado fica negativo**. Não é mais uma lista de contas: é a linha
do tempo do dinheiro, dia a dia, com o saldo acumulado correndo por cima.

A diferença para Contas a receber/pagar é o **regime**. Lá vale o vencimento (competência); aqui vale
**quando o dinheiro se move** (caixa). Uma conta paga entra no dia do pagamento; uma em aberto, no dia
do vencimento; e uma **vencida é reprojetada para hoje**, porque o dinheiro não entrou na data original
e continua pendurado. É essa regra que faz o número bater com o extrato bancário em vez de bater com o
relatório contábil.

## Personas
- **Admin/Gestor** — único acesso. Nenhum dado clínico aparece aqui.
- Recepção e médico **não** abrem esta tela.

## User Flows

### Ler a saúde do caixa
- Quatro KPIs no topo: **Saldo hoje** (só realizado) · **Entradas do período** · **Saídas do período** ·
  **Saldo projetado no fim**
- Cada KPI separa o que é realizado do que é previsto, para não misturar dinheiro que existe com
  dinheiro que talvez venha

### Enxergar o estouro
- Uma faixa de alerta aparece **quando** existe dia com saldo negativo: qual dia, quanto falta e o que
  cai naquele dia
- Sem estouro, a faixa vira o **menor saldo do período** — o dia mais apertado, em tom neutro
- Esse é o motivo da tela existir; ele fica acima do gráfico, não escondido no rodapé

### Ler o gráfico
- Barras por dia: **entrada acima do zero, saída abaixo**; a linha do **saldo acumulado** corre por cima
- Realizado é sólido; previsto é listrado — a fronteira é `hoje`, marcada no eixo
- Trecho em que o saldo é negativo fica vermelho, na linha e na área
- Passar o mouse num dia destaca a barra e mostra os números daquele dia

### Abrir um dia
- A tabela abaixo repete os dias: **data · entradas · saídas · resultado · saldo acumulado**
- Clicar num dia **expande** os lançamentos daquele dia (descrição, contraparte, método, valor)
- Dia negativo tem o saldo em vermelho; dia sem movimento não aparece

### Filtrar
- Alternar entre **Realizado + previsto** (padrão) e **Só realizado** — o segundo responde "quanto eu
  tenho", o primeiro responde "quanto eu vou ter"
- Navegar de mês (‹ ›) e voltar para o mês corrente

## UI Requirements

### Layout
- Header: "Fluxo de caixa" + nome da clínica + período; à direita o seletor de mês e o toggle de modo
- **Faixa de alerta** logo abaixo do header (vermelha com estouro, slate sem)
- **KPIs** em grid de 4 (2 colunas no `sm:`, 4 no `lg:`)
- **Gráfico** em card próprio, com legenda (entrada / saída / saldo / previsto)
- **Tabela por dia** em card, linhas expansíveis

### Gráfico
- Sem biblioteca externa: barras e linha desenhadas em SVG inline
- Eixo zero visível; eixo X com os dias que têm movimento
- Entrada em teal, saída em rose, linha de saldo em slate — e vermelha onde negativo
- Previsto com hachura (`pattern`) para nunca ser confundido com dinheiro que já entrou
- Marca vertical no dia de `hoje`, rotulada
- Precisa rolar horizontalmente no mobile sem quebrar o restante da página

### Estados & regras
- Realizado = `status === 'pago'`, e usa `pagoEm`; previsto usa `vencimento`
- **Vencido reprojeta para hoje** e recebe marca própria na tabela ("atrasado")
- Valores em pt-BR com R$; datas `dd/mm`; saldo negativo sempre em rose, com sinal
- Dia sem lançamento não vira linha nem barra
- Estado vazio: período sem lançamento nenhum mostra card explicativo, não gráfico vazio

## Design Notes
- Nymos (teal, DM Sans), light/dark em todas as cores, props-based, sem fetch interno
- Lançamentos usam a mesma entidade `Conta` de `_contas` — mesmos ids e valores das telas de contas
- Valores de receber são **líquidos** (já com desconto de convênio), que é o que cai na conta
- A tela **não** edita nem confirma pagamento: isso é Contas a receber/pagar. Aqui só se lê
- Fora de escopo: conciliação bancária, múltiplas contas bancárias e DRE (competência) — V2
