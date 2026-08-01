# tools/medical-clinic

Ferramentas da vertical **Nymos Clínica**: capturar os screenshots das telas e montar o pacote de
handoff. Vivem aqui, e não no scratchpad, porque o pacote é gitignored — se estas ferramentas se
perdem, os documentos escritos à mão têm de ser reescritos do zero.

## Os dois comandos

```bash
tools/medical-clinic/capture-screenshots.sh   # telas → product-medical-clinic/sections/*.png
tools/medical-clinic/build-export.sh          # pacote → product-plan-medical-clinic/ + .zip
```

Rode nessa ordem quando mudar dado ou componente: o export **copia** os PNGs, não os gera.

Para recapturar só uma tela, passe os alvos inline:

```bash
tools/medical-clinic/capture-screenshots.sh '[{"section":"agenda","design":"Agenda","file":"agenda"}]'
```

## O que é gerado e o que é escrito à mão

`build-export.sh` monta o pacote de duas fontes:

| Origem | O que sai |
|---|---|
| `product-medical-clinic/` + `src/sections-medical-clinic/` | componentes (imports reescritos), types, sample-data, screenshots, README e tests.md de cada section, as 27 instruções de milestone, `data-shapes/overview.ts` e `divergencias.md`, README do pacote |
| `handwritten/` | `product-overview.md`, os dois prompts, `design-system/*`, `data-shapes/README.md`, `shell/README.md`, `sections/financeiro/README.md` |

**Edite `handwritten/`, nunca o pacote** — `build-export.sh` começa com `rm -rf` no destino.

## Detalhes que economizam tempo

**Screenshots.** Playwright MCP não está instalado nesta máquina, então o `shot.mjs` fala CDP direto
com uma instância isolada do Chrome (o perfil padrão do Chrome 136+ ignora
`--remote-debugging-port`). Dois ajustes não óbvios estão embutidos:

- **Piso de 1100px na viewport.** A maioria das telas cabe em 900px, mas a nav lateral rola por
  dentro do shell e o último grupo do menu sairia cortado. `fullPage` não resolve — o scroll é de um
  container interno, não do body.
- **Tema forçado antes de navegar.** Vem de `localStorage('theme')` com fallback em
  `prefers-color-scheme`, e o headless herda dark do sistema. O script seta os dois e confere a
  classe `dark` no `<html>` depois de cada navegação.

**Persona por tela.** Cada section é capturada sob a navegação de quem pode abri-la — o mapa está em
`src/shell-medical-clinic/navs.ts` (`PERSONA_DA_SECTION` e `PERSONA_DO_DESIGN`). Não é cosmético:
uma tela de Faturamento com o menu do médico ensina o RBAC errado a quem for implementar.

**`sections/financeiro/` não é uma section.** É o módulo que Contas a receber e Contas a pagar
compartilham; entra no pacote por um passo próprio do script porque não tem `spec.md`.

## Ao adicionar uma section

1. `scripts/export.mjs` — inclua o id em `ORDEM` (define o número do milestone)
2. `scripts/targets.json` — inclua `{section, design, file}` para o screenshot
3. `src/shell-medical-clinic/navs.ts` — mapeie a persona dona da tela
