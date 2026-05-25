# Início (Dashboard) Specification

## Overview

Tela de entrada do app. Painel diário **acionável**: responde "o que faço agora?" — não "como tô em geral?" (isso é trabalho da Minha Saúde / Análise). Cabe em 1–1.5 rolagens. Cada bloco tem CTA implícito ou explícito.

## Princípio

> **Dashboard ≠ resumo de números.** Cada elemento tem que disparar comportamento (registrar, tocar pra ir mais fundo, agir sobre o plano de hoje). Status puro vai pra Minha Saúde.

## User Flows

- Usuário abre o app → cai na Início (default tab) → em <1s vê: saudação + streak + status do dia + próxima ação esperada
- Usuário com **plano do nutri ativo** vê card "Plano de Hoje" no topo e toca pra ver as 5 refeições prescritas
- Usuário sem plano (free) vê anel de calorias + meta diária como CTA principal
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
3. **Card "Plano de Hoje"** (se houver plano ativo) OU **Anel de calorias** (se não)
4. **Anel de calorias** (sempre — quando há plano, vem abaixo do card de plano)
5. **Strip horizontal de mini-stats** (sempre)
6. **Quick actions** (3 cards)

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

### 3. Card "Plano de Hoje" (condicional, prioritário se ativo)

**Aparece quando o paciente tem plano alimentar ativo do nutri.**

Card grande `teal-500/8` background, border `teal-500/20`, `rounded-2xl` p-5:

- **Header:**
  - Ícone `Utensils` (lucide) 28×28 em fundo `teal-500/20` rounded-xl
  - Label "Plano de Hoje" em DM Sans semibold 16px
  - Subtítulo "por Dra. Ana · plano XP-12" `slate-400` 12px
- **Body:**
  - Progress horizontal: barra `slate-800` com fill `teal-400` proporcional + texto "3 de 5 refeições" mono medium 13px
  - Próxima refeição em destaque: ícone hora + "Próximo: almoço · 13:30" + macros em mono pequeno (ex: `52g P · 80g C · 22g G`)
- **Footer:** chevron + "Ver plano completo"
- Tap em qualquer área → abre Plano Alimentar (sub-rota de Nutrição)

**Estado vazio (free, sem plano):** este card **NÃO aparece**. Anel de calorias sobe pra posição 3.

### 4. Anel de calorias

Componente central. Anel circular SVG:

- **Diâmetro:** 240px (reduzido de 280 pra dar espaço ao plano acima)
- **Track:** `slate-800` 12px stroke
- **Progress arc:** gradiente `teal-500 → sky-400`, 12px stroke, animado ao montar (1s ease-out)
- **Centro:**
  - Número grande mono 56px bold tabular-nums (kcal consumidas)
  - "kcal consumidas" DM Sans 13px `slate-300`
  - "meta diária / [Y]" DM Sans 12px `slate-500`
- **Legenda abaixo do anel:**
  - `●` `sky-400` "Consumidas X kcal"
  - `●` `coral` (rose-400) "Gastas Y kcal"
- **Estados:**
  - Acima da meta: gradiente vira `amber-400 → rose-400`, centro mostra "+N kcal acima"
  - Sem meta definida: anel vazio com CTA central "Definir meta"
- Tap no anel → vai pra Nutrição com foco em macros do dia

### 5. Strip horizontal de mini-stats

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

### 6. Quick actions (3 cards)

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

- **Loading:** skeletons matchando layout (hero placeholder, anel cinza pulsante, strip com chips cinza)
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
