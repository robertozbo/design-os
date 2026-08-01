import { readFileSync, writeFileSync } from 'node:fs'
const { titulos, resumo } = JSON.parse(readFileSync('product-plan-medical-clinic/_resumo.json','utf8'))
const ORDEM = resumo.map(r => r.section)

const defs = new Map() // nome -> [{sec, code, norm}]
for (const sec of ORDEM) {
  const code = readFileSync(`product-plan-medical-clinic/sections/${sec}/types.ts`,'utf8')
  const re = /(?:^\/\*\*[\s\S]*?\*\/\n)?^export (?:interface|type) (\w+)[\s\S]*?(?=^export |\Z)/gm
  let m
  while ((m = re.exec(code))) {
    if (m[1].endsWith('Props')) continue
    const bruto = m[0].trimEnd()
    // normaliza para comparar: sem comentários, sem espaços redundantes
    const norm = bruto.replace(/\/\*\*[\s\S]*?\*\//g,'').replace(/\/\/.*$/gm,'').replace(/\s+/g,' ').trim()
    if (!defs.has(m[1])) defs.set(m[1], [])
    defs.get(m[1]).push({ sec, code: bruto, norm })
  }
}

const compartilhados = [], porSection = new Map(), divergentes = []
for (const [nome, lista] of defs) {
  const formas = [...new Set(lista.map(d => d.norm))]
  if (lista.length === 1) {
    if (!porSection.has(lista[0].sec)) porSection.set(lista[0].sec, [])
    porSection.get(lista[0].sec).push(lista[0].code)
  } else if (formas.length === 1) {
    compartilhados.push({ nome, code: lista[0].code, secs: lista.map(d=>d.sec) })
  } else {
    divergentes.push({ nome, variantes: lista })
    for (const d of lista) {
      if (!porSection.has(d.sec)) porSection.set(d.sec, [])
      porSection.get(d.sec).push(d.code)
    }
  }
}

// Renomeia declaração E referências dentro da própria section: o tipo só existe uma vez por
// section, então o escopo do rename é exatamente o conjunto de blocos daquela section.
for (const { nome, variantes } of divergentes) {
  for (const v of variantes) {
    const alvo = `${nome}__${v.sec.replace(/-/g,'_')}`
    const blocos = porSection.get(v.sec).map(b => b.replace(new RegExp(`\\b${nome}\\b`,'g'), alvo))
    porSection.set(v.sec, blocos)
  }
}

let out = `// =============================================================================
// UI Data Shapes — Nymos Clínica (referência combinada)
//
// Estes tipos definem o que os componentes esperam receber via props. São um
// contrato de frontend, não um schema de banco: como você modela, guarda e busca
// esse dado é decisão da implementação.
//
// Gerado a partir dos types.ts de cada section. As interfaces \`*Props\` ficam de
// fora — pertencem a cada section, em sections/<id>/types.ts.
//
// ATENÇÃO aos tipos com sufixo \`__<section>\`: são nomes que aparecem em mais de uma
// section com DEFINIÇÕES DIFERENTES. Ver divergencias.md antes de unificar.
// =============================================================================

// -----------------------------------------------------------------------------
// Compartilhados — mesmo nome e mesma definição em várias sections
// -----------------------------------------------------------------------------

`
for (const c of compartilhados) out += `// usado em: ${c.secs.join(', ')}\n${c.code}\n\n`

for (const sec of ORDEM) {
  const blocos = porSection.get(sec)
  if (!blocos?.length) continue
  out += `// -----------------------------------------------------------------------------\n`
  out += `// ${titulos[sec]}  ·  sections/${sec}\n`
  out += `// -----------------------------------------------------------------------------\n\n`
  out += blocos.join('\n\n') + '\n\n'
}
writeFileSync('product-plan-medical-clinic/data-shapes/overview.ts', out)

let div = `# Divergências de contrato entre sections

Nomes de tipo que aparecem em mais de uma section com **definições diferentes**. No
\`overview.ts\` eles foram sufixados com a section (\`Nome__secao\`) para o arquivo compilar, mas
isso é sintoma, não solução: decida na implementação se são de fato conceitos distintos ou se é
divergência a unificar.

Os designs foram feitos section a section, então cada uma modelou o que precisava. Onde o conceito
é o mesmo (um paciente é um paciente), unifique no backend e deixe cada tela projetar o subconjunto
que usa.

`
for (const d of divergentes) {
  div += `## \`${d.nome}\`\n\n`
  for (const v of d.variantes) div += `**${v.sec}**\n\n\`\`\`ts\n${v.code}\n\`\`\`\n\n`
  div += '---\n\n'
}
writeFileSync('product-plan-medical-clinic/data-shapes/divergencias.md', div)
console.log('compartilhados:', compartilhados.length, '| divergentes:', divergentes.length)
console.log(divergentes.map(d=>`${d.nome} (${d.variantes.map(v=>v.sec).join(', ')})`).join('\n'))
