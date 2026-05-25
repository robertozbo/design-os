# Objetivos Specification

## Overview

Tab principal "Objetivos" — metas pessoais de saúde (peso alvo, % gordura, passos diários, dias ativos por semana, etc.). Cada meta aponta pra um `metricType` do backend, tem faixa `initialValue → currentValue → targetValue` e janela de datas. Diferente de Métricas (que mostra histórico passivo), Objetivos é **proativo**: o paciente define onde quer chegar, e o app acompanha o progresso visualmente.

## User Flows

- Usuário toca tab Objetivos → vê lista de metas ativas com progress
- Usuário filtra por status: Ativos (default) · Concluídos · Cancelados
- Usuário toca em "+" no header → abre form pra criar nova meta (metricType + targetValue + datas)
- Usuário toca em uma meta → abre detalhe com gráfico de progresso, histórico de medições, ajustar/cancelar
- Usuário marca meta como concluída quando atingir alvo (ou auto-conclui via medição)
- Usuário pull-to-refresh recalcula progresso de todas as metas
- Empty state: "Defina sua primeira meta" + CTA grande

## UI Requirements

### Header (tab page, sem back)

- Título "Objetivos" + subtítulo "Onde você quer chegar"
- Ações direita: 🔍 search + ➕ add (padrão `search-and-add`)

### Stats row (3 cards)

- **Ativos** (count): emerald se >0
- **Progresso médio** (%): mono grande, gradient teal→sky
- **Concluídos** (count): amber/trophy

### Status pills

- **Ativos** (default ativo) · **Concluídos** · **Cancelados**

### Goal card

Card vertical `slate-900` border `slate-800` `rounded-2xl` p-4 com:

- **Topo:** ícone do metric (cor da categoria) + nome da meta + status dot + menu `...`
- **Descrição:** "Perder 4 kg até as férias" em `slate-300` 12.5px
- **Progress visual** (escolhe um dos dois conforme tipo da meta):
  - **Ring** (para metas decremento — ex: "perder peso", "reduzir % gordura"): SVG ring 72×72 com progresso `teal-500 → sky-400`, valor central mono
  - **Linear bar** (para metas incremento — ex: "8000 passos", "5 dias ativos"): barra horizontal com fill teal→sky + label percentual
- **Faixa de valores:** "83 kg → 79 kg" em mono pequeno, com initial → target visíveis. Atual destacado.
- **Footer:**
  - Tempo restante ("Faltam 12 dias", "Atrasado 3 dias")
  - Próximos passos sugestão IA (opcional, sky-400)

### Goal types layout

| Tipo metricType | Direção | Visual |
|---|---|---|
| weight, body_fat_percentage, visceral_fat | reduzir (current > target) | Ring com gradient teal→sky |
| daily_steps, sleep_hours, daily_hydration | aumentar (current < target) | Bar com fill teal→sky |
| muscle_mass | aumentar | Bar |
| blood_pressure (composite) | manter na faixa | Bar com zona "normal" highlighted |

### Cores semânticas pelo progresso

- **0-30%:** slate-400
- **30-70%:** teal-400
- **70-99%:** emerald-400
- **100%+:** emerald-500 (concluído)
- **Atrasado / vencido sem atingir:** rose-400

### Floating sheet "Nova Meta"

Quando user toca `+`:
- Bottom sheet
- Step 1: escolher métrica (peso, % gordura, passos, sono, etc.) — lista filtrada de metricTypes
- Step 2: definir target value + janela de datas (default: hoje + 30 dias)
- Step 3: descrição amigável (auto-gerada: "Atingir 79 kg até 03/06") — editável
- Botão "Criar meta" teal

### Empty states

- **Nenhuma meta ainda:** ilustração + título "Defina sua primeira meta" + descrição "Onde você quer chegar? Peso, sono, passos, gordura…" + CTA "Criar meta"
- **Filtro vazio:** "Nenhum objetivo nesse status"

### Cores e padrão

- Fundo: `slate-950`
- Cards: `slate-900` border `slate-800`
- Tabular-nums em todos os números (kg, %, passos, dias, %)
- DM Sans + IBM Plex Mono
- Padding lateral: 16px

## Configuration

- shell: true
