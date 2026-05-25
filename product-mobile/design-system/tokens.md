# Design Tokens — App Paciente Nymos

Espelha os tokens do `design-os/` (web nutri) para manter **identidade Nymos unificada**: o paciente vê o trabalho do nutri renderizado dentro do app, então tudo precisa parecer da mesma família.

## Cores (Tailwind)

| Token | Tailwind | Uso |
|-------|----------|-----|
| **primary** | `teal-500` / `teal-600` | CTAs, anel de calorias, links, ícones ativos |
| **secondary** | `emerald-500` | Sucesso, tendências positivas, "Ótimo" |
| **accent** | `coral` (`rose-400`) | Métricas de "saves" / favoritos / engajamento |
| **neutral** | `slate-50` → `slate-950` | Texto, fundo, bordas |

## Semânticos compartilhados

| Função | Cor |
|--------|-----|
| Sucesso / positivo | `emerald-500` |
| Atenção | `amber-500` |
| Risco / negativo | `rose-500` |
| Informativo / IA | `sky-400` |

## Mobile-specific

- **Dark-first** — o app é dark por padrão (já é assim). Light mode é secundário.
- **Surface dark:** `slate-950` (fundo) + `slate-900` (cards) + `slate-800` (cards elevados/divisores)
- **Surface light:** `white` (fundo) + `slate-50` (cards)
- **FAB IA accent:** `sky-400` ou gradiente `teal-500 → sky-400` — o ícone de IA já tem destaque cyan no app atual, mantemos
- **Border:** `slate-800` (dark) / `slate-200` (light)

## Tipografia

| Função | Fonte |
|--------|-------|
| Heading | DM Sans 600/700 |
| Body | DM Sans 400/500 |
| Mono (números, timestamps, kcal, kg, %) | IBM Plex Mono 400/500 |

Tabular-nums em todos os valores numéricos para alinhamento em colunas.

## Escala visual (mobile)

- **Viewport alvo:** 375×812 (iPhone padrão), 414×896 (iPhone Plus)
- **Touch target mínimo:** 44×44 px
- **Cantos:** `rounded-2xl` para cards (16px), `rounded-full` para chips/pills/FAB
- **Sombras:** mínimas em dark (substituídas por elevação via `slate-800` border)
- **Status bar height:** 44px (área superior reservada)
- **Tab bar height:** 80px (com safe area inferior)
