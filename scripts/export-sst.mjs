#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync, statSync, rmSync } from 'node:fs'
import { join, basename } from 'node:path'

const ROOT = process.cwd()
const OUT = join(ROOT, 'product-plan-sst')

const SST_SECTIONS = [
  { id: 'dashboard-sst', title: 'Dashboard SST', order: 1 },
  { id: 'empregadores', title: 'Empregadores', order: 2 },
  { id: 'estabelecimentos-and-setores', title: 'Estabelecimentos & Setores', order: 3 },
  { id: 'trabalhadores', title: 'Trabalhadores', order: 4 },
  { id: 'cat-logos', title: 'Catálogos', order: 5 },
  { id: 'avalia-es-de-risco', title: 'Avaliações de Risco', order: 6 },
  { id: 'plano-de-a-o-and-pgr', title: 'Plano de Ação & PGR', order: 7 },
  { id: 'relat-rios-de-conformidade', title: 'Relatórios de Conformidade', order: 8 },
  { id: 'eventos-esocial', title: 'Eventos eSocial', order: 9 },
  { id: 'diagn-stico-semanal-do-l-der', title: 'Diagnóstico Semanal do Líder', order: 10 },
  { id: 'encaminhamento-cl-nico', title: 'Encaminhamento Clínico', order: 11 },
  { id: 'notifica-es-sst', title: 'Notificações SST', order: 12 },
  { id: 'perfil', title: 'Perfil', order: 13 },
  { id: 'configura-es', title: 'Configurações', order: 14 },
]

const HANDOFF_PREAMBLE = `---

## About This Handoff

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Product requirements and user flow specifications
- Design system tokens (colors, typography)
- Sample data showing the shape of data components expect
- Test specs focused on user-facing behavior

**Your job:**
- Integrate these components into your application
- Wire up callback props to your routing and business logic
- Replace sample data with real data from your backend
- Implement loading, error, and empty states

The components are props-based — they accept data and fire callbacks. How you architect the backend, data layer, and business logic is up to you.

---
`

function read(p) { return readFileSync(p, 'utf8') }
function write(p, c) { mkdirSync(join(p, '..'), { recursive: true }); writeFileSync(p, c) }
function ensureDir(p) { mkdirSync(p, { recursive: true }) }

function transformImports(content) {
  // @/../product/sections/[id]/types -> ../types
  let out = content.replace(
    /from\s+['"]@\/\.\.\/product\/sections\/[^/]+\/types['"]/g,
    `from '../types'`
  )
  // @/../product/... -> remove these refs
  out = out.replace(/from\s+['"]@\/\.\.\/product\/[^'"]+['"]/g, `from '../types'`)
  return out
}

function copyTransformed(src, dst) {
  const c = read(src)
  write(dst, transformImports(c))
}

function listTsx(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter((f) => f.endsWith('.tsx'))
}

function copyScreenshots(srcDir, dstDir) {
  if (!existsSync(srcDir)) return []
  const pngs = readdirSync(srcDir).filter((f) => f.endsWith('.png'))
  ensureDir(dstDir)
  pngs.forEach((f) => copyFileSync(join(srcDir, f), join(dstDir, f)))
  return pngs
}

function extractSection(spec, header) {
  // Extract content of "## Header" until next "## "
  const re = new RegExp(`^## ${header}\\b[^\\n]*\\n([\\s\\S]*?)(?=\\n## |$)`, 'm')
  const m = spec.match(re)
  return m ? m[1].trim() : ''
}

// =============================================================================
// CLEAN + INIT
// =============================================================================

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true })
ensureDir(OUT)
console.log('🧹 Cleaned product-plan/')

// =============================================================================
// PRODUCT OVERVIEW
// =============================================================================

const productOverview = read(join(ROOT, 'product/product-overview.md'))
const productRoadmap = read(join(ROOT, 'product/product-roadmap.md'))
const colors = JSON.parse(read(join(ROOT, 'product/design-system/colors.json')))
const typography = JSON.parse(read(join(ROOT, 'product/design-system/typography.json')))

const productName = 'Nymos SST (Módulo NR-1 + eSocial)'

const productOverviewMd = `# ${productName} — Product Overview

## Summary

Módulo SST do Nymos para conformidade NR-1 e gestão de eventos eSocial. Atende profissionais de SST (técnicos de segurança, engenheiros, médicos do trabalho, SESMT) que gerenciam carteiras de empregadores e cumprem obrigações de saúde mental ocupacional + transmissão eSocial.

Recorte exportado: 14 sections do módulo SST. Outras verticais (Paciente, Nutri, Psicólogo, Clínico, Personal, Marketing) não estão neste export.

## Planned Sections

${SST_SECTIONS.map((s, i) => `${i + 1}. **${s.title}** — \`${s.id}\``).join('\n')}

## Product Entities

Entidades principais cobertas (ver \`data-shapes/overview.ts\` para tipos completos):

- **Empregador** — Empresa-cliente sob gestão NR-1
- **Estabelecimento** — Unidade física (matriz/filial) seguindo eSocial
- **Setor** — Subdivisão organizacional usada como eixo do PGR
- **Trabalhador** — Colaborador CLT vinculado a um Setor
- **Avaliacao** — Avaliação de risco psicossocial NR-1
- **MatrizCelula** — Cruzamento Fator × Setor com classificação de risco
- **PlanoAcao** + **PlanoAcaoItem** — Plano derivado da matriz publicada
- **EventoEsocial** — Eventos S-2210/2220/2221/2240/2245 + Lote envelope
- **Relatorio** — Relatório oficial NR-1 pra fiscalização MTE

## Design System

**Colors (Tailwind):**
- Primary: ${colors.primary}
- Secondary: ${colors.secondary}
- Accent: ${colors.accent ?? 'n/d'}
- Neutral: ${colors.neutral}

**Typography (Google Fonts):**
- Heading: ${typography.heading}
- Body: ${typography.body}
- Mono: ${typography.mono}

## Implementation Sequence

Build this module in milestones:

1. **Shell** — Set up design tokens and application shell
${SST_SECTIONS.map((s, i) => `${i + 2}. **${s.title}** — ${s.id}`).join('\n')}

Each milestone has a dedicated instruction document in \`instructions/incremental/\`.
`

write(join(OUT, 'product-overview.md'), productOverviewMd)
console.log('✅ product-overview.md')

// =============================================================================
// DESIGN SYSTEM
// =============================================================================

const tokensCss = `/* Design Tokens for ${productName} */

/* Add Google Fonts to your HTML <head>:
   <link href="https://fonts.googleapis.com/css2?family=${typography.heading.replace(/ /g, '+')}&family=${typography.mono.replace(/ /g, '+')}&display=swap" rel="stylesheet">
*/

:root {
  /* Colors — using Tailwind ${colors.primary}/${colors.neutral} palettes */
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent ?? 'orange'};
  --color-neutral: ${colors.neutral};

  /* Typography */
  --font-heading: '${typography.heading}', system-ui, sans-serif;
  --font-body: '${typography.body}', system-ui, sans-serif;
  --font-mono: '${typography.mono}', ui-monospace, SFMono-Regular, monospace;
}
`

write(join(OUT, 'design-system/tokens.css'), tokensCss)

const tailwindColors = `# Tailwind Color Configuration

## Color Choices

- **Primary:** \`${colors.primary}\` — Buttons, links, key accents (componentes usam \`bg-${colors.primary}-600\`, \`text-${colors.primary}-700\`, etc.)
- **Secondary:** \`${colors.secondary}\` — Highlights, secondary elements
- **Accent:** \`${colors.accent ?? 'n/d'}\` — Pontual (uso semântico)
- **Neutral:** \`${colors.neutral}\` — Backgrounds, text, borders

## Usage Examples nos componentes

\`\`\`tsx
// Primary button
className="bg-${colors.primary}-600 hover:bg-${colors.primary}-700 dark:bg-${colors.primary}-500 dark:hover:bg-${colors.primary}-400 text-white"

// Secondary badge
className="bg-${colors.secondary}-50 dark:bg-${colors.secondary}-950/40 text-${colors.secondary}-700 dark:text-${colors.secondary}-300"

// Neutral text
className="text-${colors.neutral}-600 dark:text-${colors.neutral}-400"
\`\`\`

## Semantic Colors (já presentes no Tailwind)

- **Rose** — Erros, prioridade alta, atrasados, rejeições
- **Amber** — Atenção, advertências, prazos próximos
- **Emerald** — Sucesso, aceito, concluído
- **Violet** — Retificação, revisão, instrumentos psi
- **Sky** — Aguardando, em processamento
`

write(join(OUT, 'design-system/tailwind-colors.md'), tailwindColors)

const fontsMd = `# Typography Configuration

## Google Fonts Import

Adicione no \`<head>\` do HTML:

\`\`\`html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${typography.heading.replace(/ /g, '+')}:wght@400;500;600;700&family=${typography.mono.replace(/ /g, '+')}:wght@400;500;600&display=swap" rel="stylesheet">
\`\`\`

## Font Usage

- **Headings:** ${typography.heading}
- **Body text:** ${typography.body}
- **Code / dados técnicos (CNPJ, recibos, CPF, datas, IDs):** ${typography.mono}

Aplique via CSS:

\`\`\`css
body { font-family: '${typography.body}', system-ui, sans-serif; }
.font-mono { font-family: '${typography.mono}', ui-monospace, monospace; }
\`\`\`

Os componentes usam \`font-mono\` em: CNPJ, CPF, recibos eSocial, hashes, IDs, datas e horas tabulares.
`

write(join(OUT, 'design-system/fonts.md'), fontsMd)
console.log('✅ design-system/')

// =============================================================================
// SHELL
// =============================================================================

const shellComponentsDir = join(ROOT, 'src/shell/components')
const shellPngDir = join(ROOT, 'product/shell')
const shellOutDir = join(OUT, 'shell/components')
ensureDir(shellOutDir)

const shellFiles = listTsx(shellComponentsDir)
shellFiles.push('index.ts')
shellFiles.forEach((f) => {
  const src = join(shellComponentsDir, f)
  const dst = join(shellOutDir, f)
  if (existsSync(src)) copyTransformed(src, dst)
})

const shellPngs = copyScreenshots(shellPngDir, join(OUT, 'shell'))

const shellSpec = existsSync(join(ROOT, 'product/shell/spec.md'))
  ? read(join(ROOT, 'product/shell/spec.md'))
  : ''

const shellReadme = `# Application Shell

Persistent navigation chrome wrapping all sections.

${shellSpec ? `## Spec\n\n${shellSpec.split('\n').slice(0, 30).join('\n')}\n` : ''}

## Components

${shellFiles.filter(f => f !== 'index.ts').map((f) => `- \`${f}\``).join('\n')}

## Screenshots

${shellPngs.length > 0 ? shellPngs.map((p) => `- \`${p}\``).join('\n') : 'No screenshots available.'}

## How to use

1. Import \`AppShell\` from \`components/AppShell\`
2. Pass current user info as props
3. Wrap your routed content as children
4. Wire up logout callback to your auth system
`

write(join(OUT, 'shell/README.md'), shellReadme)
console.log(`✅ shell/ (${shellFiles.length - 1} components, ${shellPngs.length} screenshots)`)

// =============================================================================
// SECTIONS
// =============================================================================

const allEntityTypes = []

for (const section of SST_SECTIONS) {
  const srcDir = join(ROOT, `src/sections/${section.id}`)
  const componentsDir = join(srcDir, 'components')
  const productDir = join(ROOT, `product/sections/${section.id}`)
  const outDir = join(OUT, `sections/${section.id}`)
  const outComponentsDir = join(outDir, 'components')

  ensureDir(outComponentsDir)

  // Copy components (transformed)
  if (existsSync(componentsDir)) {
    const files = readdirSync(componentsDir)
    files.forEach((f) => {
      if (f.endsWith('.tsx') || f === 'index.ts') {
        copyTransformed(join(componentsDir, f), join(outComponentsDir, f))
      }
    })
  }

  // Copy types.ts
  const typesSrc = join(productDir, 'types.ts')
  if (existsSync(typesSrc)) {
    copyFileSync(typesSrc, join(outDir, 'types.ts'))
    // Aggregate entity types
    const typesContent = read(typesSrc)
    allEntityTypes.push({ section: section.id, content: typesContent })
  }

  // Copy data.json -> sample-data.json
  const dataSrc = join(productDir, 'data.json')
  if (existsSync(dataSrc)) {
    copyFileSync(dataSrc, join(outDir, 'sample-data.json'))
  }

  // Copy screenshots
  const pngs = copyScreenshots(productDir, outDir)

  // Read spec
  const specPath = join(productDir, 'spec.md')
  const spec = existsSync(specPath) ? read(specPath) : ''
  const overview = extractSection(spec, 'Overview')
  const flows = extractSection(spec, 'User Flows')
  const uiReqs = extractSection(spec, 'UI Requirements')

  // Generate README
  const componentFiles = listTsx(componentsDir).filter((f) => !f.startsWith('index'))
  const previewFiles = listTsx(srcDir)

  const sectionReadme = `# ${section.title}

## Overview

${overview || 'Ver spec.md original.'}

## User Flows

${flows || 'Ver spec.md original.'}

## Visual Reference

${pngs.length > 0 ? pngs.map((p) => `- \`${p}\``).join('\n') : 'No screenshots.'}

## Components Provided

${componentFiles.map((f) => `- \`${f.replace('.tsx', '')}\``).join('\n')}

## Preview Wrappers (referência das telas)

${previewFiles.map((f) => `- \`${f.replace('.tsx', '')}\``).join('\n')}

## How to Wire

1. Import o componente principal de \`components/\`
2. Passe a data conforme \`types.ts\`
3. Implemente os callbacks (cada Props interface lista quais)
4. Substitua \`sample-data.json\` por chamadas reais ao seu backend
5. Trate loading, error e empty states
`

  write(join(outDir, 'README.md'), sectionReadme)

  // Generate tests.md (minimal but useful)
  const testsMd = `# Test Specs: ${section.title}

Framework-agnostic — adapte ao seu setup (Jest, Vitest, Playwright, Cypress, RTL).

## Overview

${overview || 'Ver README.md desta section.'}

## User Flow Tests

Para cada fluxo de usuário em README.md > "User Flows", escreva:

### Success Path
- **Setup**: estado inicial do app + sample data
- **Steps**: ações do usuário (clicar, digitar, navegar)
- **Expected Results**: mudanças visíveis na UI, dados atualizados, navegação

### Failure Paths
- Validação de campos obrigatórios
- Erro de rede / API
- Permissões insuficientes

## Empty State Tests

- [ ] Lista principal vazia → mostra empty state com CTA
- [ ] Filtros sem resultado → mostra mensagem + botão limpar
- [ ] Primeiro uso → guia o usuário pro próximo passo

## Component Interaction Tests

- [ ] Renderização com data válida
- [ ] Click em ações dispara callbacks corretos
- [ ] Hover/focus states funcionam
- [ ] Keyboard navigation (Escape fecha modais, Tab navega)

## Edge Cases

- [ ] Textos muito longos truncam corretamente
- [ ] 1 item vs 100+ items
- [ ] Preservação de estado em navegação
- [ ] Transição entre empty e populated

## Accessibility

- [ ] Elementos interativos acessíveis por teclado
- [ ] Labels associados a campos
- [ ] Mensagens de erro anunciadas a screen readers
- [ ] Focus management apropriado após ações

## Sample Test Data

Use \`sample-data.json\` ou crie variações baseadas em \`types.ts\`.

\`\`\`typescript
import sampleData from './sample-data.json'
// Use directamente nos tests
\`\`\`
`

  write(join(outDir, 'tests.md'), testsMd)

  // Generate per-section instruction (incremental)
  const milestoneNum = String(section.order + 1).padStart(2, '0')
  const instruction = `# Milestone ${section.order + 1}: ${section.title}

> **Provide alongside:** \`product-overview.md\`
> **Prerequisites:** Milestone 1 (Shell) complete, plus any prior section milestones

${HANDOFF_PREAMBLE}

## Goal

Implementar a section **${section.title}** — ${overview ? overview.split('\n')[0] : 'ver spec'}.

## Overview

${overview || 'Ver spec.md original.'}

## Components Provided

Copy de \`sections/${section.id}/components/\` para seu projeto:

${componentFiles.map((f) => `- \`${f.replace('.tsx', '')}\``).join('\n')}

## Props Reference

Veja \`sections/${section.id}/types.ts\` para definições completas.

## Expected User Flows

${flows || 'Ver spec.md original.'}

## UI Requirements

${uiReqs ? uiReqs.split('\n').slice(0, 40).join('\n') + (uiReqs.split('\n').length > 40 ? '\n\n_(...continua em spec.md)_' : '') : 'Ver spec.md original.'}

## Empty States

Os componentes incluem empty states. Garanta que cobre:
- Lista principal vazia (primeiro uso ou todos removidos)
- Registros relacionados ausentes
- Filtros sem resultado

## Testing

Veja \`sections/${section.id}/tests.md\` para specs framework-agnostic.

## Files to Reference

- \`sections/${section.id}/README.md\` — Feature overview
- \`sections/${section.id}/tests.md\` — UI behavior test specs
- \`sections/${section.id}/components/\` — React components
- \`sections/${section.id}/types.ts\` — TypeScript interfaces
- \`sections/${section.id}/sample-data.json\` — Test data
${pngs.map((p) => `- \`sections/${section.id}/${p}\` — Visual reference`).join('\n')}

## Done When

- [ ] Components renderizam com dados reais
- [ ] Empty states aparecem corretamente
- [ ] Todos os callbacks props estão wired
- [ ] User completa todos os fluxos esperados
- [ ] Visual bate com os screenshots
- [ ] Responsivo em mobile
`

  write(join(OUT, `instructions/incremental/${milestoneNum}-${section.id}.md`), instruction)

  console.log(`✅ ${section.id} (${componentFiles.length} comps, ${pngs.length} pngs)`)
}

// =============================================================================
// 01-SHELL INSTRUCTION
// =============================================================================

const shellInstruction = `# Milestone 1: Shell

> **Provide alongside:** \`product-overview.md\`
> **Prerequisites:** None

${HANDOFF_PREAMBLE}

## Goal

Setup design tokens + application shell — o chrome persistente que envolve todas as sections.

## What to Implement

### 1. Design Tokens

- Importe \`design-system/tokens.css\` no entry point
- Configure Tailwind com cores ${colors.primary}/${colors.neutral} (ver \`design-system/tailwind-colors.md\`)
- Adicione Google Fonts (${typography.heading}, ${typography.mono}) — ver \`design-system/fonts.md\`

### 2. Application Shell

Copy \`shell/components/\` pro projeto:

${shellFiles.filter(f => f !== 'index.ts').map(f => `- \`${f}\``).join('\n')}

**Wire Up Navigation:**

A nav espera links para as sections SST principais (Empregadores, Dashboard, Configurações). Conecte ao seu router.

**User Menu:**

Espera \`{ name, avatarUrl?, onLogout }\`.

## Files to Reference

- \`design-system/\` — Tokens
- \`shell/README.md\` — Design intent
- \`shell/components/\` — React components
${shellPngs.map(p => `- \`shell/${p}\``).join('\n')}

## Done When

- [ ] Design tokens configurados
- [ ] Shell renderiza com navegação
- [ ] Nav links apontam pra rotas corretas
- [ ] User menu mostra info do user
- [ ] Responsivo em mobile
- [ ] Dark mode funciona
`

write(join(OUT, 'instructions/incremental/01-shell.md'), shellInstruction)
console.log('✅ 01-shell.md')

// =============================================================================
// DATA SHAPES
// =============================================================================

const dataShapesReadme = `# UI Data Shapes

Estes types definem o **frontend contract** — o shape que os componentes UI esperam receber.

Como você modela, armazena e busca esses dados no backend é decisão de implementação. Combine, divida ou estenda os types pra caber na sua arquitetura.

## Entities Cobertas

${SST_SECTIONS.map((s) => `- **${s.title}** — \`sections/${s.id}/types.ts\``).join('\n')}

## Combined Reference

Ver \`overview.ts\` pra todos types agregados em um arquivo.
`

write(join(OUT, 'data-shapes/README.md'), dataShapesReadme)

const overviewTs = `// =============================================================================
// UI Data Shapes — Combined Reference (SST Module)
//
// Types que componentes UI esperam receber como props.
// Frontend contract, não schema de banco.
// =============================================================================

${allEntityTypes.map(({ section, content }) => `
// -----------------------------------------------------------------------------
// From: sections/${section}
// -----------------------------------------------------------------------------

${content
  // Remove Props interfaces (component-level, ficam em cada section)
  .split('\n')
  .join('\n')}
`).join('\n')}
`

write(join(OUT, 'data-shapes/overview.ts'), overviewTs)
console.log('✅ data-shapes/')

// =============================================================================
// PROMPTS
// =============================================================================

const oneShotPrompt = `# One-Shot Implementation Prompt — Nymos SST

I need you to implement the complete SST module of a web application based on detailed UI designs and product specifications.

## Instructions

Please carefully read and analyze the following files:

1. **@product-plan/product-overview.md** — Product summary with sections and entity overview
2. **@product-plan/instructions/one-shot-instructions.md** — Complete implementation instructions for all milestones

After reading these, also review:
- **@product-plan/design-system/** — Color and typography tokens
- **@product-plan/data-shapes/** — UI data contracts
- **@product-plan/shell/** — Application shell components
- **@product-plan/sections/** — All section components, types, sample data, and test specs

## Context Important

This is a Brazilian occupational health & safety (SST) management module. Domain-specific concepts:
- **NR-1** — Brazilian regulation requiring psychosocial risk assessment
- **eSocial** — Brazilian government event transmission (S-2210, S-2220, S-2221, S-2240, S-2245, S-3000)
- **PGR** — Programa de Gerenciamento de Riscos
- **CAT** — Comunicação de Acidente de Trabalho
- **ASO** — Atestado de Saúde Ocupacional
- **Lote** — Envelope of up to 50 events sent to eSocial in one transmission

Terms in code/UI are in Portuguese (PT-BR). Keep the domain language.

## Before You Begin

Review all the provided files, then ask me clarifying questions about:

1. **My tech stack** — Framework, language, tooling, existing codebase conventions
2. **Authentication & users** — How users sign up, log in, multi-tenant model (consultor SST has portfolio of empregadores)
3. **eSocial integration** — Will you implement actual government transmission or stub it?
4. **Certificate handling** — A1/A3 storage and signing (security-sensitive)
5. **Anything else** — Whatever you need to know

Lastly, ask me if I have any additional notes for this implementation.

Once I answer, create a comprehensive implementation plan before coding.
`

write(join(OUT, 'prompts/one-shot-prompt.md'), oneShotPrompt)

const sectionPrompt = `# Section Implementation Prompt — Nymos SST

## Define Section Variables

- **SECTION_NAME** = [Nome da section, ex: "Empregadores" ou "Eventos eSocial"]
- **SECTION_ID** = [Pasta em sections/, ex: "empregadores" ou "eventos-esocial"]
- **NN** = [Milestone number, ex: "02" (sections começam em 02; 01 é Shell)]

---

I need you to implement the **SECTION_NAME** section of the Nymos SST module.

## Instructions

Please carefully read and analyze the following files:

1. **@product-plan/product-overview.md** — Product summary
2. **@product-plan/instructions/incremental/NN-SECTION_ID.md** — Specific instructions for this section

Also review:
- **@product-plan/sections/SECTION_ID/README.md** — Feature overview
- **@product-plan/sections/SECTION_ID/tests.md** — UI behavior test specs
- **@product-plan/sections/SECTION_ID/components/** — React components to integrate
- **@product-plan/sections/SECTION_ID/types.ts** — TypeScript interfaces
- **@product-plan/sections/SECTION_ID/sample-data.json** — Test data

## Context Important

Brazilian SST module. Manter terminologia PT-BR em código e UI. Conceitos: NR-1, eSocial (S-22XX events), PGR, CAT, ASO, Lote, certificado digital A1/A3.

## Before You Begin

Review all the provided files, then ask me clarifying questions about:

1. **Integration** — Como esta section conecta com sections já implementadas
2. **Product requirements** — Qualquer ambiguidade nos specs
3. **Anything else** — O que precisa saber

Pergunte se tenho notas adicionais. Depois, implemente.
`

write(join(OUT, 'prompts/section-prompt.md'), sectionPrompt)
console.log('✅ prompts/')

// =============================================================================
// ONE-SHOT INSTRUCTIONS (combined)
// =============================================================================

let oneShotInstructions = `# ${productName} — Complete Implementation Instructions

${HANDOFF_PREAMBLE}

## Testing

Cada section inclui \`tests.md\` framework-agnostic. Adapte ao seu setup.

---

${productOverviewMd.split('\n').slice(2).join('\n')}

---

# Milestone 1: Shell

${shellInstruction.split('---\n').slice(2).join('---\n')}

`

for (const section of SST_SECTIONS) {
  const milestoneNum = String(section.order + 1).padStart(2, '0')
  const path = join(OUT, `instructions/incremental/${milestoneNum}-${section.id}.md`)
  if (existsSync(path)) {
    const c = read(path)
    const body = c.split('---\n').slice(2).join('---\n')
    oneShotInstructions += `\n---\n\n# Milestone ${section.order + 1}: ${section.title}\n\n${body}\n`
  }
}

write(join(OUT, 'instructions/one-shot-instructions.md'), oneShotInstructions)
console.log('✅ one-shot-instructions.md')

// =============================================================================
// ROOT README
// =============================================================================

const rootReadme = `# ${productName} — Design Handoff

Este pacote contém tudo necessário pra implementar o módulo SST do Nymos.

## What's Included

**Ready-to-Use Prompts:**
- \`prompts/one-shot-prompt.md\` — Prompt pra implementação completa
- \`prompts/section-prompt.md\` — Prompt template section-by-section

**Instructions:**
- \`product-overview.md\` — Resumo do produto
- \`instructions/one-shot-instructions.md\` — Todas milestones combinadas
- \`instructions/incremental/\` — Milestone-by-milestone (shell + 14 sections SST)

**Design Assets:**
- \`design-system/\` — Cores (teal/slate), fontes (DM Sans + IBM Plex Mono), tokens
- \`data-shapes/\` — UI data contracts (types agregados)
- \`shell/\` — Application shell
- \`sections/\` — 14 sections com components, types, sample data, tests

## How to Use

### Option A: Incremental (Recommended)

1. Copie \`product-plan/\` pro seu codebase
2. Comece com Shell (\`instructions/incremental/01-shell.md\`)
3. Pra cada section:
   - Abra \`prompts/section-prompt.md\`
   - Preencha as variáveis (SECTION_NAME, SECTION_ID, NN)
   - Cole no seu coding agent
   - Responda perguntas e implemente
4. Revise e teste após cada milestone

### Option B: One-Shot

1. Copie \`product-plan/\` pro seu codebase
2. Abra \`prompts/one-shot-prompt.md\`
3. Adicione notas extras se tiver
4. Cole no coding agent
5. Responda perguntas
6. Deixe o agent planejar e implementar tudo

## Testing

Cada section tem \`tests.md\` framework-agnostic. Descreve **o que** testar (behavior), não **como** (sintaxe). Adapte ao seu stack (Jest/Vitest/Playwright/RTL).

## Sections (14)

${SST_SECTIONS.map(s => `- **${s.title}** — \`${s.id}\``).join('\n')}

## Tips

- Use os prompts pre-escritos — eles pedem clarifying questions importantes
- Adicione contexto específico do seu projeto às prompts
- Components são props-based — você implementa routing, fetching, state
- Mantenha terminologia PT-BR em código e UI (domain SST brasileiro)

---

*Generated by Design OS · Recorte SST · ${SST_SECTIONS.length} sections*
`

write(join(OUT, 'README.md'), rootReadme)
console.log('✅ README.md')

// =============================================================================
// SUMMARY
// =============================================================================

console.log('')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log(`📦 Export completo em ${OUT}`)
console.log(`   ${SST_SECTIONS.length} sections + shell + design system`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
