# Início (Dashboard) Specification

## Overview

Tela de entrada do app. Painel diário **acionável**: responde "o que faço agora?" — não "como tô em geral?" (isso é trabalho da Minha Saúde / Análise). Cabe em 1–1.5 rolagens. Cada bloco tem CTA implícito ou explícito.

## Princípio

> **Dashboard ≠ resumo de números.** Cada elemento tem que disparar comportamento (registrar, tocar pra ir mais fundo, agir sobre o plano de hoje). Status puro vai pra Minha Saúde.

## User Flows

- Usuário abre o app → cai na Início (default tab) → em <1s vê: saudação + streak + status do dia + próxima ação esperada
- Usuário com **plano do nutri ativo** vê card "Plano de Hoje" no topo e toca pra ver as 5 refeições prescritas
- Usuário sem plano (free) vê o card de Nutrição + meta diária como CTA principal
- Usuário toca em **mini-stat de peso** → vai pra Minha Saúde / Métricas
- Usuário toca em **mini-stat de sono** → vai pra Métricas filtrada em sono
- Usuário toca em **quick action (Nutrição/Atividades/Treinos)** → vai registrar
- Usuário recebe **análise IA nova** → banner aparece com CTA → toca → vai pra Análise de Saúde
- Usuário recebe **mensagem/plano novo do nutri** → banner aparece → toca → vai pro Plano
- Usuário arrasta de cima pra baixo → pull-to-refresh sincroniza HealthKit + servidor
- Usuário toca **FAB IA** → abre chat com contexto do dia
- Usuário toca em **streak** no hero → mostra histórico de dias seguidos (modal leve)

## UI Requirements

### Layout vertical (rolagem única)

Ordem dos blocos (sempre na mesma posição, alguns condicionais):

1. **Hero contextual** (sempre)
2. **Banner "Novidade"** (condicional)
3. **Card de Nutrição** (sempre — o plano alimentar entra como faixa dentro dele)
4. **Strip horizontal de mini-stats** (sempre)
5. **Quick actions** (3 cards)

---

### 1. Hero contextual (1 linha de personalidade)

Logo abaixo do header do shell. Sem card próprio — texto + chips inline.

- **Linha 1:** saudação + nome em DM Sans semibold 16px `slate-100`
  *"Bom dia, Roberto"*
- **Linha 2:** frase IA contextual em DM Sans regular 13px `slate-400` + streak chip à direita
  *"Você dormiu 8h, ótimo dia pra treino"* `🔥 12 dias`
- Streak chip: `amber-500/15` background, `amber-400` texto, IBM Plex Mono medium 12px, tap → modal com histórico de streak
- Frase IA é **sempre 1 linha** (truncate com ellipsis se passar) — quem quer mais profundidade vai pro chat IA

### 2. Banner "Novidade" (condicional)

Aparece **só quando** há:
- Nova análise IA gerada
- Nova mensagem ou novo plano do nutri / médico
- Lembrete de medição (ex: "Hora de tirar fotos da Projeção Corporal")
- Lembrete de meta semanal (ex: "Você bate sua meta de proteína há 7 dias 🎯")

**Visual:**
- Card horizontal `sky-400/10` background com border-left 3px `sky-400`
- Ícone à esquerda (Sparkles, Heart, Camera, etc.) em `sky-400`
- Texto em DM Sans medium 14px `slate-100`: título + subtítulo
- Chevron `>` à direita
- Tap → navega pra feature relevante
- Dismissable (X discreto) — uma vez dispensado, não volta no mesmo dia

### 3. Card de Nutrição

Card `slate-900` `rounded-2xl`. É onde o paciente **registra** — o anel sozinho só
informava. O antigo card "Plano de Hoje" foi absorvido aqui como faixa: dois cards de
comida empilhados repetiam ícone, cor e metade da informação.

- **Header:** ícone garfo/faca `teal-300` + "Nutrição" 15px semibold + botão **`+`**
  circular 36px (`slate-800`, borda `slate-700`, `Plus` teal) na ponta direita
- **Anel:** arco aberto de 270° (abre na base), 168px, stroke 13px
  - Track `slate-800`; progresso em gradiente `teal-500 → sky-400`, animado (1s)
  - Centro: kcal restantes mono 32px bold · "kcal restantes" 11,5px · "X de Y" 10px `slate-600`
  - Acima da meta: gradiente vira `amber-400 → rose-400` e o número vira `+N` rose
  - Sem meta: centro vira CTA "Definir meta"
- **Macros:** 3 colunas (Proteína · Carbo · Gordura) com barra de 5px na cor do macro
  e `consumido/meta` mono abaixo. Os mesmos 3 da section Nutrição — dashboard e
  detalhe não podem divergir
- **Plano alimentar** (só com plano ativo): "Plano XP-12 · Dra. Ana Carolina" +
  `3/5 refeições`, barra fina de progresso e a linha "Próximo: almoço · 13:30" com os
  macros da refeição em mono `slate-500`. Tap → Plano Alimentar
- **Último registro do dia:** emoji + "Café da manhã · Plano alimentar" + "08:00 · 410 kcal".
  Sem nada registrado hoje vira CTA "Nada registrado hoje · comece pela foto do prato",
  que abre o mesmo sheet do `+`
- **Rodapé:** "Ver plano alimentar completo ›" `teal-300`

Tap no anel ou no último registro → Nutrição.

#### Sheet do "+" (`RegistrarRefeicaoSheet`)

Bottom sheet `rounded-t-3xl` `slate-900` com três caminhos, foto primeiro porque é o
do dia a dia:

| Opção | Peso visual | Texto |
|---|---|---|
| **Foto do prato** | Card `teal-500` cheio, ícone câmera | "A IA identifica os alimentos e estima calorias e macros" |
| Buscar alimento | `slate-800/60`, ícone lupa `sky-300` | "Tabela TACO e marcas do mercado brasileiro" |
| Do meu plano alimentar | `slate-800/60`, ícone prancheta `amber-300` | "Marque a refeição planejada como consumida" — **some** sem plano alimentar ativo |

Escolha dispara `onRegistrarRefeicao(modo)` e fecha o sheet.

### 4. Strip horizontal de mini-stats

Substitui os cards grandes "Minha evolução" e "Horas de Sono" da versão atual. Carrossel horizontal com swipe:

- Container scroll-x sem scrollbar, `gap-3`, padding-x 16px
- Cada chip 100×96 `rounded-2xl`, fundo `slate-900` border `slate-800`
- **Conteúdo de cada chip:**
  - Topo: ícone 18×18 + label DM Sans medium 11px `slate-400`
  - Centro: valor grande mono 24px bold tabular-nums + unidade mono 12px
  - Rodapé: delta colorido (`emerald-400` ↑ / `rose-400` ↓ / `slate-500` —) mono 11px

**Chips padrão (ordem):**

| # | Label | Valor exemplo | Delta | Cor ícone |
|---|-------|---------------|-------|-----------|
| 1 | Peso | `83 kg` | ↓ -0.3 vs semana | `teal-400` |
| 2 | Sono | `8h 12m` | 😊 ótimo | `violet-400` |
| 3 | Passos | `6.230` | ↑ vs ontem | `sky-400` |
| 4 | Água | `4/8 copos` | em dia | `cyan-400` |
| 5 | BPM repouso | `64 bpm` | estável | `rose-400` |
| 6 | % Gordura | `12,0%` | ↓ -0,4% | `amber-400` |

Tap em qualquer chip → vai pra Métricas filtrada nesse indicador (ou Minha Saúde no caso de peso/gordura).

### 5. Quick actions (3 cards)

Grid 3-col, abaixo da strip de stats:

| Card | Ícone | Label | Ação |
|------|-------|-------|------|
| Nutrição | `Apple` | Nutrição | abre diário do dia |
| Atividades | `Flame` | Atividades | abre lista do dia |
| Treinos | `Dumbbell` | Treinos | abre treino de hoje |

**Visual:**
- Aspect-ratio 1:1.1, `rounded-2xl`, fundo `slate-900` border `slate-800`
- Ícone 32×32 `teal-400`
- Label DM Sans medium 13px `slate-400`
- Tap: scale 0.98 + highlight `teal-500/10`

---

### Estados especiais

- **Loading:** skeletons matchando layout (hero placeholder, card de nutrição cinza pulsante, strip com chips cinza)
- **Erro de sync:** banner topo `amber-500/20` com texto + "Tentar novamente"
- **Onboarding (1º acesso):** todos os blocos viram CTAs convidativos: "Conecte um wearable", "Adicione seu primeiro registro", "Defina sua meta"

### Cores e padrão

- Fundo: `slate-950` (dark) / `slate-50` (light)
- Cards: `slate-900` / `white` com border `slate-800` / `slate-200`
- Primários: `teal-400/500`
- Acentos: `sky-400` (consumo, IA, novidade), `rose-400` (gasto, BPM), `violet-400` (sono), `cyan-400` (água), `amber-400/500` (atenção, streak), `emerald-400/500` (positivo)
- **Tabular-nums em todos os números**
- Espaçamento entre blocos: 12-16px (compacto)
- Padding lateral: 16px

### Comportamentos

- **Pull-to-refresh** sincroniza HealthKit + wearables + servidor (spinner teal 1-2s)
- **Tap feedback** em todos os cards: scale 0.98 + opacity 0.9
- **FAB IA** (do shell) auto-hide ao rolar pra baixo, reaparece ao parar
- **Hero IA frase** atualiza 1×/dia ou após sync significativo (novo registro de sono, novo treino registrado, etc.)

## Configuration

- shell: true
