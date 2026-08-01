import { readFileSync, writeFileSync } from 'node:fs'
const { titulos, resumo } = JSON.parse(readFileSync('product-plan-clinic/_resumo.json','utf8'))
const OUT='product-plan-clinic'

const PREAMBULO = `---

## Sobre este handoff

**O que você está recebendo:**
- Designs de UI prontos (componentes React, estilização completa, light e dark)
- Requisitos de produto e especificação dos fluxos de usuário
- Tokens do design system (cores, tipografia)
- Dados de exemplo mostrando a forma que os componentes esperam
- Specs de teste focadas em comportamento visível

**Seu trabalho:**
- Integrar os componentes à sua aplicação
- Ligar os callbacks ao seu roteador e à sua lógica de negócio
- Trocar os dados de exemplo por dados reais do backend
- Implementar os estados de carregamento e de erro

Os componentes são props-based: recebem dados e disparam callbacks. Como você arquiteta backend,
camada de dados e regra de negócio é decisão sua.

---
`

const SHELL = `# Milestone 1: Shell

> **Forneça junto:** \`product-overview.md\`
> **Pré-requisitos:** nenhum

${PREAMBULO}
## Objetivo

Configurar os tokens de design e o shell da aplicação — a moldura persistente que envolve todas as
sections.

## O que implementar

### 1. Tokens de design

- \`design-system/tokens.css\` — custom properties
- \`design-system/tailwind-colors.md\` — paletas e cores semânticas
- \`design-system/fonts.md\` — import das fontes

O projeto de origem é **Tailwind CSS v4**: não existe \`tailwind.config.js\` e não há cor
customizada — os componentes usam utilities nativas (\`bg-teal-500\`, \`text-slate-600\`). Se o seu
projeto for v3, você vai precisar do config equivalente; se for v4, não crie o arquivo.

### 2. Shell

Copie \`shell/components/\` para o seu projeto. São 5: \`AppShell\`, \`MainNav\`, \`UserMenu\`
(web) e \`MobileShell\`, \`MobileBottomNav\` (app do paciente).

Ligue \`onNavigate(href)\` ao seu roteador e passe \`activeHref\`. O shell não conhece rota.

### 3. Os três shells por persona

\`shell/README.md\` traz a navegação de cada persona. O ponto que **não** pode ser tratado como
detalhe visual: admin e recepção não têm rota clínica porque a LGPD não permite. Esconder o item de
menu não é controle de acesso — **proteja as rotas no servidor**.

Prontuário, Consulta e Prescrição são rotas **aninhadas em Pacientes**, não top-level.

## Pronto quando

- [ ] Tokens configurados, fontes carregando
- [ ] Shell renderiza com a navegação da persona correta
- [ ] Navegação liga às rotas certas e o item ativo destaca
- [ ] User menu mostra o usuário e dispara logout
- [ ] Side-nav vira drawer no mobile
- [ ] Light e dark conferem com os screenshots
- [ ] Rotas clínicas bloqueadas no servidor para admin e recepção
`
writeFileSync(`${OUT}/instructions/incremental/01-shell.md`, SHELL)

const nn = n => String(n).padStart(2,'0')
const arquivos = [{ nome:'01-shell.md', conteudo: SHELL }]

for (const r of resumo) {
  const sec = r.section
  const readme = readFileSync(`${OUT}/sections/${sec}/README.md`,'utf8')
  const pegar = (t) => { const m = readme.match(new RegExp(`^## ${t}\\s*$([\\s\\S]*?)(?=^## |\\Z)`,'m')); return m ? m[1].trim() : '' }
  const overview = pegar('Overview'), flows = pegar('User Flows'), cbs = pegar('Callbacks')
  const shots = pegar('Referência visual')

  const doc = `# Milestone ${r.milestone}: ${r.titulo}

> **Forneça junto:** \`product-overview.md\`
> **Pré-requisitos:** Milestone 1 (Shell), mais os milestones de section anteriores

${PREAMBULO}
## Objetivo

Implementar **${r.titulo}**.

## Overview

${overview}

## Componentes fornecidos

${r.comps} componente(s) em \`sections/${sec}/components/\`. Lista e descrição em
\`sections/${sec}/README.md\`.

## Props

Contrato completo em \`sections/${sec}/types.ts\` — entidades e interfaces \`Props\`.

Entidades desta section: ${r.entidades.length ? r.entidades.map(e=>`\`${e}\``).join(', ') : '—'}

⚠️ Antes de derivar seu schema, leia \`data-shapes/divergencias.md\`: alguns nomes de tipo aparecem
em mais de uma section com definições diferentes.

## Callbacks a ligar

${cbs}

## Fluxos esperados

${flows || '_Ver o spec da section._'}

## Dados de exemplo

\`sections/${sec}/sample-data.json\` — é o mesmo dado dos screenshots, então as asserções de texto
batem com a referência visual. Serve de fixture de componente, **não** de seed de banco: os
conjuntos de pacientes não são consistentes entre sections.

## Estados vazios

Os componentes trazem estado vazio desenhado. Garanta que aparecem: coleção principal vazia,
registro pai sem filhos, e as transições cheio→vazio e vazio→cheio.

## Testes

\`sections/${sec}/tests.md\`.

## Referência visual

${shots}

Cada tela tem screenshot em light e dark (o \`-dark\` no nome).

## Pronto quando

- [ ] Componentes renderizam com dados reais
- [ ] Estados vazios aparecem quando não há registro
- [ ] Todos os callbacks acima estão ligados a comportamento real
- [ ] Os fluxos acima rodam de ponta a ponta
- [ ] Confere com o screenshot, em light e em dark
- [ ] Responsivo no mobile
`
  const nome = `${nn(r.milestone)}-${sec}.md`
  writeFileSync(`${OUT}/instructions/incremental/${nome}`, doc)
  arquivos.push({ nome, conteudo: doc })
}

// one-shot: mesmo conteúdo, preâmbulo uma vez só
let one = `# Nymos Clínica — Instruções completas de implementação

${PREAMBULO}
## Testes

Cada section traz \`tests.md\` com specs de comportamento, framework-agnósticas. Para cada uma:
leia, escreva os testes dos fluxos principais (caminho feliz e falha), implemente até passar.

---

`
one += readFileSync(`${OUT}/product-overview.md`,'utf8')
for (const a of arquivos) {
  one += `\n\n---\n\n`
  one += a.conteudo.replace(PREAMBULO, '').replace(/^> \*\*Forneça junto.*$\n> \*\*Pré-requisitos.*$/m, '')
}
writeFileSync(`${OUT}/instructions/one-shot-instructions.md`, one)
console.log('instructions:', arquivos.length, '| one-shot linhas:', one.split('\n').length)
