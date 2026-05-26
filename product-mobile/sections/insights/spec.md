# Insights Specification

## Overview

Aba do paciente Nymos mobile — análises IA cross-feature que correlacionam dados de diferentes módulos (humor + atividade + sono + alimentação + exames + medicação) e entregam ao paciente em formato narrativo curto. Combina dois tipos de output: **micro-insights** (alertas/dicas pontuais geradas continuamente) e **resumos semanais** (narrativa longa fechando a semana).

**Esta section foi back-portada do live (`mobile/src/screens/insights/`) em 2026-05-25** — o protótipo ficou pra trás e esta spec reflete o que está em produção.

## User Flows

- Paciente abre a tab Insights → vê stats (Total / Não lidos / Semanais / Alertas)
- Filter chips horizontais: Todos / Semanal / Alertas / Nutrição / Atividade
- Lista mostra cards de insight ordenados por data desc (mais recente primeiro)
- Tap em card → expande in-place mostrando texto completo (e marca como lido se for micro)
- Pull-to-refresh refaz fetch dos dois endpoints (micro + semanal)
- Card não lido → border-left teal + dot teal no header
- Empty state quando lista vazia ("Ainda não temos insights pra você")

## UI Requirements

### Estrutura geral
- Dark mode default (`bg-slate-950`)
- Header com 4 stat cards (Total / Não lidos / Semanais / Alertas), ícone IA pra "Total"
- Filter chips horizontais scrolláveis logo abaixo dos stats
- Lista de cards de insight, padding vertical entre cards

### Card de insight
- Ícone circular à esquerda colorido pela categoria (violet pra IA/weekly, rose pra alert, emerald pra nutrição, amber pra atividade)
- Badge de categoria + dot "não lido" no topo do conteúdo
- Título (até 2 linhas, semibold)
- Snippet do conteúdo (truncado em 120 chars, "Ver mais" expande)
- Footer: relógio + data formatada `dd/mm HH:mm`
- Card não lido tem border-left de 3px na cor primary (teal)
- Tap expande/colapsa in-place

### Cores por categoria
- `weekly_summary` → violet-500 (gradient teal→violet pra ênfase IA)
- `metric_alert` / `metric_highlight` → rose-500 (destructive)
- `nutrition` / `nutrition_tip` → emerald-500 (success)
- `activity` / `activity_suggestion` / `weekend_tip` → amber-500 (warning)
- Default / fallback → teal-500

### Acentos IA
Brand Nymos usa teal+violet pra sinalizar conteúdo gerado por IA. Header "Sparkles" ou similar pode usar gradient `from-teal-400 to-violet-400`. Categorias específicas mantêm cores semânticas (severidade).

## Data Shape

Ver `types.ts`:
- `Insight` — entry individual com `category`, `severity`, `title`, `content`, `isRead`, `relatedMetrics`
- `InsightCategory` — taxonomia das categorias (weekly_summary / metric_alert / nutrition / activity / ...)
- `InsightSeverity` — `info` / `attention` / `alert`
- `InsightStats` — agregados (total / unread / weekly / alerts)
- `InsightsData` — root contendo stats + insights

## Notes

- Live combina dois endpoints (`useMicroInsights` + `useWeeklyGuidances`). No protótipo unificamos num único array `Insight[]` com campo `source: 'micro' | 'weekly'`.
- `relatedMetrics` é display-only no card (chips com label da métrica). Real fonte vem do payload do micro-insight (`mi.metrics?`).
- Não há criação manual de insight — todos são gerados pela IA backend. UI é read-only + "marcar como lido".
- Detalhe expandido aqui é in-place. Live também não navega pra tela separada.
