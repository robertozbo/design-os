// Monta product-plan-clinic/ a partir de product-clinic/ + src/sections-clinic/.
// A parte mecânica: copiar componentes com imports reescritos, types, sample-data, screenshots,
// e derivar README/tests/instructions de cada spec.md. Os arquivos globais são escritos à mão.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, copyFileSync } from 'node:fs'
import { basename, join } from 'node:path'

const SRC = 'src/sections-clinic'
const PROD = 'product-clinic/sections'
const OUT = 'product-plan-clinic'

// Ordem dos milestones = ordem do roadmap, não alfabética.
export const ORDEM = [
  'inicio', 'inicio-gestao', 'equipe', 'salas', 'agenda', 'pacientes', 'consulta',
  'prontuario', 'acompanhamento', 'atendimento', 'atendimentos', 'exames', 'prescricao',
  'encaminhamento', 'relatorios-medicos', 'mensagens', 'cobranca', 'faturamento',
  'contas-receber', 'contas-pagar', 'fluxo-caixa', 'meus-recebimentos',
  'servicos', 'convenios', 'categorias-financeiras', 'fornecedores',
  'relatorios', 'configuracoes-clinica', 'configuracoes-medico',
  'configuracoes-recepcao', 'perfil', 'agendamento-whatsapp',
]

// `ORDEM` é escrita à mão, e sem esta trava uma section nova simplesmente não entra no pacote — sem
// erro, sem aviso, com o script imprimindo "sections: 26" como se estivesse tudo certo. Foi assim
// que `agendamento-whatsapp` e `fluxo-caixa` ficaram de fora do primeiro build.
const NO_DISCO = readdirSync(PROD).filter((d) => !d.startsWith('_') && existsSync(`${PROD}/${d}/spec.md`))
const ausentes = NO_DISCO.filter((d) => !ORDEM.includes(d))
const fantasmas = ORDEM.filter((d) => !NO_DISCO.includes(d))
if (ausentes.length || fantasmas.length) {
  console.error('ORDEM está fora de sincronia com o disco.')
  if (ausentes.length) console.error('  section com spec mas fora de ORDEM:', ausentes.join(', '))
  if (fantasmas.length) console.error('  em ORDEM mas sem spec no disco:', fantasmas.join(', '))
  process.exit(1)
}

/** Reescreve os imports de types para caminhos relativos ao pacote exportado. */
function reescrever(code, section) {
  return code.replace(
    /@\/\.\.\/product-clinic\/sections\/([^/']+)\/types/g,
    (_, alvo) => (alvo === section ? '../types' : `../../${alvo}/types`),
  )
}

/** Extrai uma seção `## Titulo` do markdown do spec. */
function bloco(spec, titulo) {
  const re = new RegExp(`^## ${titulo}\\s*$([\\s\\S]*?)(?=^## |\\Z)`, 'm')
  const m = spec.match(re)
  return m ? m[1].trim() : ''
}

/** Nomes das interfaces Props e das entidades declaradas no types.ts. */
function tiposDe(code) {
  const props = [...code.matchAll(/export interface (\w*Props)\b/g)].map((m) => m[1])
  const entidades = [...code.matchAll(/export interface (\w+)\b/g)]
    .map((m) => m[1])
    .filter((n) => !n.endsWith('Props'))
  return { props, entidades }
}

/** Callbacks `onX` declarados nas interfaces de um types.ts ou componente. */
function callbacks(code) {
  const set = new Map()
  for (const m of code.matchAll(/^\s*(on[A-Z]\w*)(\?)?:\s*\(([^)]*)\)/gm)) {
    if (!set.has(m[1])) set.set(m[1], { args: m[3].trim(), opcional: !!m[2] })
  }
  return [...set.entries()]
}

const titulos = {}
const resumo = []

for (const [i, section] of ORDEM.entries()) {
  const specPath = `${PROD}/${section}/spec.md`
  const spec = readFileSync(specPath, 'utf8')
  const titulo = (spec.match(/^# (.+?)( Specification)?\s*$/m) ?? [, section])[1]
  titulos[section] = titulo

  const dir = `${OUT}/sections/${section}`
  mkdirSync(`${dir}/components`, { recursive: true })

  // Componentes props-based (o `<Design>.tsx` da raiz é preview wrapper: importa data.json e
  // react-router, então fica fora do pacote).
  const compDir = `${SRC}/${section}/components`
  const comps = existsSync(compDir) ? readdirSync(compDir) : []
  for (const f of comps) {
    const code = readFileSync(join(compDir, f), 'utf8')
    writeFileSync(join(dir, 'components', f), reescrever(code, section))
  }

  // types + sample data
  const typesCode = readFileSync(`${PROD}/${section}/types.ts`, 'utf8')
  writeFileSync(`${dir}/types.ts`, reescrever(typesCode, section))
  if (existsSync(`${PROD}/${section}/data.json`)) {
    copyFileSync(`${PROD}/${section}/data.json`, `${dir}/sample-data.json`)
  }

  // screenshots
  const shots = readdirSync(`${PROD}/${section}`).filter((f) => f.endsWith('.png'))
  for (const s of shots) copyFileSync(`${PROD}/${section}/${s}`, `${dir}/${s}`)

  const { props, entidades } = tiposDe(typesCode)
  const cbs = callbacks(
    typesCode + comps.map((f) => readFileSync(join(compDir, f), 'utf8')).join('\n'),
  )
  const overview = bloco(spec, 'Overview')
  const flows = bloco(spec, 'User Flows')
  const ui = bloco(spec, 'UI Requirements')

  const componentesLista = comps
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => `- \`${basename(f, '.tsx')}\``)
    .join('\n')

  const tabelaCb = cbs.length
    ? ['| Callback | Assinatura |', '|---|---|', ...cbs.map(([n, v]) => `| \`${n}\`${v.opcional ? ' *(opcional)*' : ''} | \`(${v.args})\` |`)].join('\n')
    : '_Esta section não expõe callbacks — é somente leitura._'

  writeFileSync(
    `${dir}/README.md`,
    `# ${titulo}

## Overview

${overview}

## User Flows

${flows}

## UI Requirements

${ui}

## Componentes fornecidos

${componentesLista || '_Sem componentes._'}

Todos são props-based: recebem dados e disparam callbacks. Nenhum importa dados nem roteador —
o wrapper de preview do Design OS (que fazia isso) ficou de fora de propósito.

## Tipos

**Entidades:** ${entidades.length ? entidades.map((e) => `\`${e}\``).join(', ') : '—'}

**Props:** ${props.length ? props.map((e) => `\`${e}\``).join(', ') : '—'}

Definições completas em \`types.ts\`.

## Callbacks

${tabelaCb}

## Referência visual

${shots.map((s) => `- \`${s}\``).join('\n') || '_Sem screenshot._'}
`,
  )

  writeFileSync(
    `${dir}/tests.md`,
    `# Test Specs: ${titulo}

Framework-agnóstico — adapte a Vitest, Jest, Playwright, Cypress ou React Testing Library.
Descrevem **o que** verificar (comportamento visível), não como escrever o teste.

## Overview

${overview}

---

## Testes de fluxo

Para cada fluxo abaixo, escreva no mínimo: o caminho feliz asserindo a mudança visível na UI, o
caminho de falha mais provável, e o estado vazio quando fizer sentido.

${flows || '_O spec não lista fluxos._'}

---

## Estados vazios

- [ ] Coleção principal vazia (\`[]\`) → renderiza o estado vazio com CTA, não uma lista em branco
- [ ] Registro pai sem filhos → painel do filho mostra seu próprio vazio, o pai continua renderizando
- [ ] Transição cheio → vazio (apagar o último item) e vazio → cheio (criar o primeiro)

## Requisitos de UI a verificar

${ui || '_O spec não detalha UI._'}

---

## Acessibilidade

- [ ] Todo elemento interativo é alcançável por teclado
- [ ] Campos de formulário têm rótulo associado
- [ ] Botões só-ícone têm nome acessível (\`aria-label\`)
- [ ] \`Esc\` fecha modal/drawer e o foco volta para quem abriu
- [ ] Estado só por cor tem também texto ou ícone

## Dados de teste

Use \`sample-data.json\` como fixture — é o mesmo dado que alimenta os screenshots, então as
asserções de texto batem com a referência visual.
`,
  )

  resumo.push({ section, titulo, milestone: i + 2, comps: comps.filter((f) => f.endsWith('.tsx')).length, entidades, cbs: cbs.length, shots: shots.length })
}

writeFileSync(`${OUT}/_resumo.json`, JSON.stringify({ titulos, resumo }, null, 2))
console.log(`sections: ${resumo.length}`)
console.log(`componentes: ${resumo.reduce((a, r) => a + r.comps, 0)}`)
console.log(`screenshots: ${resumo.reduce((a, r) => a + r.shots, 0)}`)
