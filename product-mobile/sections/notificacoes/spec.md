# Notificações Specification

## Overview

Hub de notificações do paciente Nymos mobile — lista cronológica de mensagens e alertas vindos do sistema, do profissional vinculado e dos módulos de saúde. Captura o ciclo completo: chegada → leitura → ação (navegar pra origem) → arquivamento implícito.

**Esta section foi back-portada do live (`mobile/src/screens/notifications/NotificationsScreen.tsx`) em 2026-05-25** — o protótipo ficou pra trás e esta spec reflete o que está em produção.

## User Flows

- Paciente abre a tela Notificações via tab/menu/badge no header
- Vê stats topo (Total + Não lidas com dot teal)
- Lista cronológica agrupada por bucket de tempo (Hoje / Ontem / Esta semana / Mais antigas)
- Filtros horizontais (chips): Todas, Saúde, Conquistas, Sequências, Lembretes, Ranking, Sistema
- Tap em notificação não-lida → marca como lida + navega pra `link` (se houver CTA explícito)
- Tap em "Marcar todas como lidas" (só visível quando `unread > 0`)
- Pull-to-refresh atualiza a lista
- Empty state quando lista vazia ("Nenhuma notificação por aqui ainda")

## UI Requirements

### Estrutura geral
- Dark mode default (`bg-slate-950`)
- Stats topo: 2 cards horizontais (Total / Não lidas) — dot teal-400 no card de não lidas
- Chips de filtro horizontais com scroll, ativo = teal-500/15 + border teal-500/40
- CTA "Marcar todas como lidas" abaixo dos stats (caption + ícone CheckCheck teal), só renderiza quando `unread > 0`
- Lista agrupada por bucket de tempo com label uppercase tracking-wider muted
- Cada notificação = card com ícone tipado à esquerda (circle 36px com tint), título + timestamp curto à direita, mensagem em caption muted, dot de não-lida à direita

### Tipos e cores
- `lembrete-medicacao` → teal-400 (Pill)
- `alerta-exame` → amber-400 (FileText)
- `mensagem-profissional` → violet-400 (MessageCircle)
- `conquista` → amber-400 (Trophy)
- `sequencia` → rose-400 (Flame)
- `saude` → emerald-400 (Heart)
- `ranking` → orange-400 (Medal)
- `sistema` → slate-400 (Bell)

### Estados de leitura
- **Não lida** (`status: 'nao-lida'`): card com border colorida do tipo + tint sutil de fundo + título em bold + dot colorido à direita
- **Lida** (`status: 'lida'`): card com border slate-800 + título em medium, sem dot

### Timestamp curto (no card)
- `<1min` → "agora"
- `<60min` → "Xmin"
- `<24h` → "Xh"
- `<7d` → "Xd"
- mais antigo → "DD/MM"

## Data Shape

Ver `types.ts`:
- `Notificacao` — entry individual com `tipo`, `titulo`, `mensagem`, `status`, `criadaEmISO`, `link?`, `ctaLabel?`
- `TipoNotificacao` — union de 8 tipos
- `StatusLeitura` — 'lida' | 'nao-lida'
- `NotificacoesStats` — agregados (total + naoLidas)
- `NotificacaoBucket` — grouping por janela de tempo
- `NotificacoesData` — root contendo stats + buckets

## Notes

- Live agrupa em 5 tipos (reminder/achievement/streak/health/ranking); protótipo expande pra 8 cobrindo casos do Nymos paciente (medicação, exame, mensagem do profissional, sistema)
- Live tem `link: '/professionals'` como exemplo de CTA — protótipo mantém pattern de `link` opcional pra navegação
- Sem ações de swipe/arquivar no MVP — marcar como lida é implícito no tap
- Filtro persiste só na sessão atual (não vai pra storage)
