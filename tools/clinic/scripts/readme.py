import json, pathlib

OUT = pathlib.Path('product-plan-clinic')
resumo = json.loads((OUT / '_resumo.json').read_text())['resumo']

linhas = []
for r in resumo:
    comps = 'via `_contas`' if r['comps'] == 0 else str(r['comps'])
    linhas.append(f"| {r['milestone']:02d} | {r['titulo']} | `{r['section']}` | {comps} |")
tabela = '\n'.join(linhas)

(OUT / 'README.md').write_text(f"""# Nymos Clínica — Design Handoff

Tudo o que é necessário para implementar a Nymos Clínica: 26 sections desenhadas, o shell por
persona, tokens, contratos de dados e specs de teste.

## O que tem aqui

**Prompts prontos**
- `prompts/one-shot-prompt.md` — implementação completa numa sessão
- `prompts/section-prompt.md` — template para implementar uma section por vez

**Instruções**
- `product-overview.md` — resumo do produto (forneça em toda sessão)
- `instructions/one-shot-instructions.md` — todos os milestones num documento
- `instructions/incremental/` — 27 documentos, um por milestone

**Ativos de design**
- `design-system/` — cores, fontes, tokens
- `data-shapes/` — contratos de dados da UI + relatório de divergências
- `shell/` — componentes do shell
- `sections/` — componentes, tipos, dados de exemplo, testes e screenshots de cada section

## Como usar

### Opção A — incremental (recomendado)

1. Copie `product-plan-clinic/` para o seu código
2. Comece pelo Shell (`instructions/incremental/01-shell.md`)
3. Para cada section: abra `prompts/section-prompt.md`, preencha as três variáveis do topo, cole no
   seu agente
4. Revise e teste antes de seguir para a próxima

### Opção B — one-shot

1. Copie a pasta para o seu código
2. Abra `prompts/one-shot-prompt.md`, acrescente suas notas, cole no agente
3. Responda as perguntas e deixe planejar antes de implementar

## Milestones

| # | Section | id | Componentes |
|---|---|---|---|
| 01 | Shell | `shell` | 5 |
{tabela}

A ordem importa até o milestone 9: Agenda depende de Salas e Serviços (duração e valor), Consulta
depende de Pacientes. Do 16 em diante o grupo Financeiro pode ir em qualquer ordem, lembrando que
**Serviços** e **Tipos de conta** são cadastros-mãe.

## Quatro coisas para saber antes de começar

**1. Isto é um produto de saúde sob LGPD.** Três consequências que atravessam a implementação
inteira: admin e recepção não podem ver conteúdo clínico; todo acesso a dado clínico é auditado
(inclusive inferência de IA); exclusão é lógica, nunca física. A navegação já reflete o primeiro
ponto, mas **esconder item de menu não é controle de acesso** — proteja no servidor.

**2. `sections/_contas/` não é uma section.** É o módulo que Contas a receber e Contas a pagar
compartilham — as duas telas são a mesma `ContasPage` configurada por props. Não tem rota nem
screenshot, e as duas sections **não compilam sem ele**. Copie as três juntas — o `_` no nome existe para ela não parecer uma section pela metade.

**3. Leia `data-shapes/divergencias.md` antes de derivar o schema.** 15 nomes de tipo aparecem em
mais de uma section com definições diferentes, porque as telas foram desenhadas uma a uma. No
`overview.ts` eles vêm sufixados só para o arquivo compilar; não reproduza o sufixo no seu modelo.
Isso é divergência de **tipo** — o **dado** já está unificado (ver abaixo).

**4. Os `sample-data.json` são coerentes entre si.** Todas as sections rodam na mesma clínica
fictícia (Clínica Nymos · Vila Mariana), com um corpo clínico e um pool de 22 pacientes
compartilhado: quando Marcos Vinícius Lima aparece na Agenda, em Exames e em Contas a receber, é o
mesmo paciente. Dá para usar como seed de ambiente de desenvolvimento, não só como fixture de
componente.

## O que os componentes são

Props-based e portáteis: recebem dados, disparam callbacks, não importam dado nem roteador. Os
wrappers de preview do Design OS — que faziam as duas coisas — ficaram de fora de propósito.

Estilização em **Tailwind CSS v4**, sem cor customizada e sem `tailwind.config.js` (v4 não usa).
Todos trazem variantes `dark:`; o tema é a classe `dark` no elemento raiz.

## Testes

Cada section traz `tests.md` com specs framework-agnósticas — descrevem **o que** verificar, não
como escrever o teste. Adapte a Vitest, Jest, Playwright, Cypress ou RTL.

---

*Gerado pelo Design OS*
""")
print('README.md escrito')
