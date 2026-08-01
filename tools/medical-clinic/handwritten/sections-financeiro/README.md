# Financeiro — módulo compartilhado

**Isto não é uma section com rota própria.** É o módulo que **Contas a receber** (milestone 18) e
**Contas a pagar** (milestone 19) compartilham: as duas telas são a mesma `ContasPage` configurada
por props, porque só diferem no tipo de conta, no rótulo e na contraparte (paciente vs. fornecedor).

Não existe rota `/financeiro` e não existe screenshot deste diretório — as duas telas que ele
produz estão em `sections/contas-receber/` e `sections/contas-pagar/`.

## Por que está aqui

`contas-receber` e `contas-pagar` não têm `components/` próprios. Se você copiar só essas duas
pastas, elas não compilam: importam daqui. Copie as três juntas.

## Componentes

| Componente | Papel |
|---|---|
| `ContasPage` | A tela inteira — KPIs, filtros, tabela e ações. Recebe o tipo por prop |
| `NovaContaModal` | Criação de conta (a receber puxa valor do serviço; a pagar puxa categoria do fornecedor) |
| `ConfirmarPagamentoModal` | Baixa de uma conta em aberto ou vencida |
| `FinanceiroView` | Visão combinada das duas naturezas |
| `helpers.ts` | Formatação de valor e data, cálculo de status |

## Tipos

`types.ts` define `Conta`, `TipoConta` (`'receber' | 'pagar'`), `StatusConta`
(`'aberto' | 'pago' | 'vencido'`), `Servico` e `GrupoTipos`.

Um detalhe do contrato que costuma passar batido: em `Conta`, o campo `contraparte` é o **nome do
paciente** quando `tipo === 'receber'` e o **do fornecedor** quando `'pagar'`, e `categoria` só é
preenchida em contas a pagar. Se você normalizar isso em duas tabelas no backend, projete de volta
para essa forma ao alimentar o componente — ou ajuste o componente, mas então ajuste os dois usos.

## Origem dos dados

Contas a receber é alimentada pelo **"Gerar financeiro"** do agendamento: cada parcela vira uma
conta a receber. Ao implementar a Agenda (milestone 06), é esse o gancho.
