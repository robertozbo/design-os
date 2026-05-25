# Atividades Specification

## Overview

Lista de atividades físicas do usuário — **híbrida**: combina registros automáticos vindos de smartwatch (via HealthKit / Health Connect) com registros manuais ("Fiz uma caminhada de 60min"). Cada item mostra origem (auto / manual), tipo, duração real, calorias, pontos e horário. Acessada pelo Quick Action "Atividades" no Início ou pela tab Métricas (link contextual). É a tela onde o paciente vê o que se moveu hoje/semana, antes de qualquer agregação.

## User Flows

- Usuário toca "Atividades" no Início → vê lista do dia com totais agregados (qtd, kcal, min)
- Usuário muda período: Hoje · 7 dias · 30 dias
- Usuário filtra por categoria: Cardio · Força · Flexibilidade · Esportes · Outros (pills)
- Usuário toca "+ Registrar" (FAB ou botão header) → abre form de registro manual
- Usuário toca numa atividade → abre detalhe (gráfico de BPM se vier do watch, splits, etc.)
- Usuário pull-to-refresh → re-importa do HealthKit/Health Connect
- Atividades **auto-detectadas** mostram badge `🔄 auto · Apple Watch` em cyan
- Atividades **manuais** mostram badge `✍ manual` em slate
- Empty state: "Nenhuma atividade ainda" + CTA "Registrar primeira" + nota "Conecte um wearable pra detecção automática"

## UI Requirements

### Header (sub-page)

- Botão back `<` à esquerda
- Título "Atividades" + subtítulo "Maio 2026" (mês corrente)
- Ação direita: ícone search + botão `+` teal pra registro manual

### Stats row (3 cards)

- **Atividades** (count): ícone `Flame` em sky/emerald se >0, slate se 0
- **Calorias gastas** (soma): ícone `Flame` rose-300, valor mono + " kcal"
- **Tempo total** (soma minutos formatado): "2h 45min", ícone `Clock` violet-300

Tudo do período selecionado.

### Period pills

- **Hoje** (default) · **7 dias** · **30 dias**
- Active: `teal-500` background, white texto
- Inactive: `slate-800/70` background, slate-300 texto

### Categoria pills (multi-select)

Logo abaixo do período:
- **Todas** (default selecionada — limpa multi-select)
- **Cardio** · **Força** · **Flexibilidade** · **Esportes** · **Outros**
- Active: chip teal outline (`teal-500/30 border-teal-500/60 text-teal-300`)
- Inactive: chip slate-800

### Lista de atividades

Cada item é um card horizontal `slate-900` border `slate-800` `rounded-2xl`:

- **Esquerda:** ícone 36×36 colorido por categoria:
  - Cardio: `rose-500/15` icon `rose-300`
  - Força: `amber-500/15` icon `amber-300`
  - Flexibilidade: `violet-500/15` icon `violet-300`
  - Esportes: `sky-500/15` icon `sky-300`
  - Outros: `slate-700/40` icon `slate-300`
- **Centro:**
  - Linha 1: `activityType.name` em DM Sans semibold 14px (ex: "Corrida", "Caminhada", "Yoga")
  - Linha 2: badge de origem inline + duração + horário em mono 11px
    - Badge auto: `cyan-500/15` text `cyan-300` "🔄 auto · Apple Watch"
    - Badge manual: `slate-700/60` text `slate-400` "✍ manual"
    - Depois: " · 45 min · 14:30"
- **Direita:** kcal mono 16px + linha 2: pontos pequenos `+18 pts` mono em `emerald-400`

Tap → detalhe da atividade.

### Floating "+ Registrar" button

FAB secundário (alternativa ao header `+`) — não no MVP, basta o header.

### Form de registro manual (modal/sheet)

Quando user toca `+` no header:
- Bottom sheet com:
  - Categoria selector (pills horizontal)
  - Tipo selector (lista filtrada pela categoria)
  - Duração buckets: pills `30 · 45 · 60 · 80 · 120 min`
  - Data/hora picker (default: agora)
  - Notas (textarea opcional)
  - Preview de pontos + calorias estimadas
  - Botão "Salvar" teal

### Estados especiais

- **Loading:** skeletons matchando layout
- **Sem dados período:** "Nenhuma atividade no período" + sugestão "Aumentar pra 30 dias"
- **Sem dados ever:** empty state grande com ilustração + CTA `Registrar primeira` + nota "Conecte um wearable pra detecção automática" linka pra `/dispositivos`

### Cores e padrão

- Fundo: `slate-950`
- Cards: `slate-900` border `slate-800`
- Tabular-nums em todos os números (kcal, min, pts)
- DM Sans + IBM Plex Mono
- Padding lateral: 16px
- Espaçamento entre items: 8-10px

## Configuration

- shell: true
