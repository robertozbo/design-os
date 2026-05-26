# Desafios Specification

## Overview

Aba de gamificação de saúde do app paciente Nymos. Desafios incentivam adesão a hábitos (passos, hidratação, sono, treinos, refeições) através de metas individuais com progresso, recompensas em pontos e ranking competitivo entre pacientes da plataforma.

**Esta section foi back-portada do live (`mobile/src/screens/challenges/`) em 2026-05-25** — o protótipo ficou pra trás e esta spec reflete o que está em produção (ChallengesScreen + ChallengeDetailScreen + RankingScreen).

## User Flows

- Paciente abre a tab Desafios → vê tabs **Ativos | Concluídos | Ranking**
- Tab **Ativos**: hero card do desafio em destaque (maior progresso ou próximo de concluir) + lista de desafios ativos com progress bar
- Tab **Concluídos**: lista de desafios finalizados com badge "Concluído" emerald + pontos ganhos
- Tab **Ranking**: pódio top 3 + lista paginada com filtro de período (Semana | Mês | Todos os tempos)
- Tap em um desafio → tela de detalhe com progress ring (%), descrição, regras, mini-ranking (top 5) do próprio desafio, botão "Sair" se já participando
- Tap em desafio disponível (não-aderido) → botão "Aceitar desafio"
- Pull-to-refresh atualiza a lista
- Empty state quando sem desafios ativos → CTA "Explorar desafios disponíveis"

## UI Requirements

### Estrutura geral
- Dark mode default (`bg-slate-950`)
- Header com stat cards horizontais: Pontos totais, Posição global, Desafios concluídos
- Tabs segmentadas no topo (Ativos / Concluídos / Ranking)
- Hero card com desafio em destaque (gradient emerald → teal, progress bar grande, dias restantes)
- Lista de cards: ícone categoria, título, badge de categoria, progress bar fina, % à direita, "X de Y" abaixo, dias restantes

### Categorias e cores
- `atividade` → emerald (corrida, passos, treino)
- `nutricao` → amber (refeições, água)
- `sono` → indigo (horas dormidas, regularidade)
- `habito` → teal (mindfulness, leitura)
- `medicacao` → rose (adesão a remédio prescrito)

### Estados de desafio
- **Em andamento** (`status: 'active'`): progress bar emerald, % bold, dias restantes em muted
- **Concluído** (`status: 'completed'`): badge "Concluído" emerald-500/15, ícone Trophy amber, pontos ganhos destacados
- **Falhou** (`status: 'failed'`): badge "Não concluído" muted, sem progress

### Gamificação
- **Trofeu** (ícone amber-400) pra concluídos
- **Medalha** (gold/silver/bronze) pra top 3 do ranking
- **Progress ring** (% no centro) na tela de detalhe
- **Highlight do paciente** no ranking (border teal + bg teal/8)

## Data Shape

Ver `types.ts`:
- `Challenge` — desafio individual com `category`, `target`, `currentProgress`, `status`, `pointsReward`
- `ChallengeCategory` — atividade | nutricao | sono | habito | medicacao
- `ChallengeStatus` — active | completed | failed
- `RankingEntry` — entry do ranking global com `rank`, `userName`, `points`, `isCurrentUser`
- `DesafiosStats` — agregados (totalPoints / globalRank / completedCount)
- `DesafiosData` — root com active, completed, ranking, stats

## Sub-screens (não cobertas neste protótipo, mas existem em live)

- `ChallengeDetailScreen` — progress ring + descrição + mini-ranking + botão participar/sair
- `RankingScreen` — pódio + lista paginada com filtro de período

## Notas

- Desafios são **opt-in** — paciente escolhe participar; não há atribuição automática pelo profissional (live: `useJoinChallenge` mutation)
- Pontos acumulam por todos os desafios do paciente (`totalPoints`) e definem o ranking global
- Ranking tem 3 períodos: weekly / monthly / all_time (live: `useGlobalRanking(period)`)
- Mini-ranking dentro do detalhe mostra ranking só daquele desafio específico (live: `useChallengeLeaderboard`)
