// Captura screenshots das sections do clinic via CDP direto (Playwright MCP indisponível).
import { writeFileSync, mkdirSync } from 'node:fs'

// O vite pula pra 3001/3002 quando a 3000 está ocupada (outra sessão) — daí o override por env.
const BASE = process.env.DESIGN_OS_BASE ?? 'http://localhost:3000'
const OUT = 'product-clinic/sections'
const WIDTH = 1440
const DSF = 1

// Sem argumento, captura todas as telas de targets.json. Com argumento, aceita um JSON inline
// (mesma forma do targets.json) para recapturar só o que mudou.
const { readFileSync } = await import('node:fs')
const { fileURLToPath } = await import('node:url')
const { dirname, join } = await import('node:path')
const AQUI = dirname(fileURLToPath(import.meta.url))
const TARGETS = process.argv[2]
  ? JSON.parse(process.argv[2])
  : JSON.parse(readFileSync(join(AQUI, 'targets.json'), 'utf8'))
const TEMA = process.argv[3] ?? 'light' // 'light' | 'dark'

const targets = await (await fetch(`http://127.0.0.1:${process.env.CDP_PORT ?? 9222}/json`)).json()
const page = targets.find((t) => t.type === 'page')
const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise((r) => (ws.onopen = r))

let id = 0
const pending = new Map()
ws.onmessage = (e) => {
  const msg = JSON.parse(e.data)
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id)
    pending.delete(msg.id)
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)
  }
}
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const mid = ++id
    pending.set(mid, { resolve, reject })
    ws.send(JSON.stringify({ id: mid, method, params }))
  })

await send('Page.enable')
await send('Runtime.enable')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Esconde o breadcrumb do Design OS ("← Sections / Título ... Web · Desktop"), que é chrome
// da ferramenta e não do produto. O shell (nav lateral) fica: é parte do design.
const HIDE_CHROME = `
  (() => {
    const link = [...document.querySelectorAll('a')].find(a => a.textContent.trim().startsWith('← Sections'))
    const bar = link?.closest('div.border-b')
    if (bar) bar.style.display = 'none'
    return !!bar
  })()
`

// O tema sai de localStorage('theme') (ThemeToggle) com fallback em prefers-color-scheme.
// Forçamos os dois para não depender do que o Chrome headless herda do sistema.
await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-color-scheme', value: TEMA }],
})
await send('Page.navigate', { url: BASE })
await sleep(1500)
await send('Runtime.evaluate', { expression: `localStorage.setItem('theme', '${TEMA}')` })

const results = []
for (const { section, design, file } of TARGETS) {
  const url = `${BASE}/clinic/sections/${section}?design=${design}`
  await send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH,
    height: 900,
    deviceScaleFactor: DSF,
    mobile: false,
  })
  await send('Page.navigate', { url })
  await sleep(2200) // lazy import do componente + render

  const hid = await send('Runtime.evaluate', { expression: HIDE_CHROME, returnByValue: true })

  // Confere que não ficou no estado de carregamento nem no fallback de componente ausente
  const state = await send('Runtime.evaluate', {
    expression: `(() => {
      const t = document.body.innerText
      return { loading: t.includes('Carregando...'), vazio: t.includes('Sem componente para esta section'), chars: t.length }
    })()`,
    returnByValue: true,
  })
  if (state.result.value.loading) {
    await sleep(2500)
  }

  // Confere que o tema pedido realmente aplicou (a classe .dark vai no <html>)
  const temaReal = await send('Runtime.evaluate', {
    expression: `document.documentElement.classList.contains('dark') ? 'dark' : 'light'`,
    returnByValue: true,
  })

  const metrics = await send('Page.getLayoutMetrics')
  // Piso de 1100: a nav lateral do shell tem 879px de conteúdo + header + rodapé de usuário e
  // rola por dentro; abaixo disso o menu sai cortado mesmo com o conteúdo principal cabendo.
  const h = Math.min(Math.max(Math.ceil(metrics.cssContentSize.height), 1100), 12000)
  await send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH,
    height: h,
    deviceScaleFactor: DSF,
    mobile: false,
  })
  await sleep(500)

  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
  mkdirSync(`${OUT}/${section}`, { recursive: true })
  const sufixo = TEMA === 'dark' ? '-dark' : ''
  const path = `${OUT}/${section}/${file}${sufixo}.png`
  if (temaReal.result.value !== TEMA) console.log(`  ⚠ tema aplicado=${temaReal.result.value}, pedido=${TEMA}`)
  writeFileSync(path, Buffer.from(shot.data, 'base64'))
  results.push({ path, h, ...state.result.value, chromeOculto: hid.result.value })
  console.log(`${path}  ${WIDTH}x${h}  texto=${state.result.value.chars}${state.result.value.vazio ? '  ⚠ SEM COMPONENTE' : ''}${state.result.value.loading ? '  ⚠ LOADING' : ''}${hid.result.value ? '' : '  ⚠ breadcrumb não escondido'}`)
}

ws.close()
