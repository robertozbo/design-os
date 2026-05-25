# Arquivos de referência no Design OS

> Estes arquivos são o **source of truth** para a migração. O agente deve ler/copiar a estrutura, vocabulário e organização daqui.

## Contrato e dados

### `product-mobile/sections/treinos/types.ts`
Tipos canônicos. **Usar como referência absoluta** pra interfaces do app real.

Tipos principais:
- `TreinosData` — estado raiz da section
- `TreinosAba` (`'meu-personal' | 'meus-treinos'`)
- `SessaoUI` — view-model de uma sessão A/B/C
- `ExercicioUI` — view-model de exercício
- `ExecucaoUI` — view-model de execução
- `AgendaDia` — dia da semana → letra da sessão
- `TreinoProprio` — treino criado pelo aluno
- `TreinosStats` — stats agregados
- `TreinosProps` — interface do componente container

### `product-mobile/sections/treinos/data.json`
Sample data que reflete o caso real:
- 1 workout do Personal Rafa Costa
- 3 sessões (A Peito · B Costas · C Cardio) com 1 exercício cada
- Agenda semanal (Seg=A, Ter=B, Qua=A, Qui=B, Sex=C, Sáb/Dom=descanso)
- 2 execuções no histórico
- 1 treino próprio do aluno

Usar como base pra entender o shape esperado.

### `product-mobile/sections/treinos/spec.md`
Especificação narrativa da section. Texto livre descrevendo flows e UI.

## Componentes UI

### `src/sections-mobile/treinos/components/Treinos.tsx`
Container principal. Estado da aba, renderiza `MeuPersonalTab` ou `MeusTreinosTab`.

Estrutura interna:
- `TabButton` (linhas finais)
- `MeuPersonalTab`
- `MeusTreinosTab`
- `AgendaSemanal`
- `SessoesList`
- `HistoricoSection`

### `src/sections-mobile/treinos/components/HeroTreinoHoje.tsx`
Hero card do topo. Tem 3 estados:
1. Sem sessão hoje (descanso)
2. Com sessão + sem Personal (fallback)
3. Com sessão + Personal (caso comum)

Note o strip "por [Personal] · seu Personal" no topo do card.

### `src/sections-mobile/treinos/components/ExecutarTreinoFlow.tsx`
**Não migrar — já está pronto e validado.** Apenas verificar que ainda funciona após a migração da tela principal.

Flow:
- Fase `doing` → mostra exercício atual + valores prescritos
- Fase `resting` → cronômetro circular + próxima série
- Fase `finishing` → stats + rating + notas + salvar

### `src/sections-mobile/treinos/components/StatsStrip.tsx`
4 cards: streak dias, total/mês, freq/sem, duração média.

### `src/sections-mobile/treinos/components/ExecucaoRow.tsx`
Linha do histórico. Avatar letra + nome + tempo relativo + duração + kcal + estrelas.

### `src/sections-mobile/treinos/components/_shared.tsx`
Helpers compartilhados: `COR_BG`, `COR_TEXT`, `COR_GRADIENT`, `iconForExercise`, `formatLoad`.

## Como navegar localmente

O Design OS roda como app standalone:

```bash
cd design-os
pnpm dev
# abre http://localhost:3000

# Para a section Treinos:
# http://localhost:3000/mobile/sections/treinos

# Para a section Saúde Mental:
# http://localhost:3000/mobile/sections/saude-mental
```

Use o navegador pra inspecionar interatividade, transições e estados.

## Arquivos do contexto Personal (lado profissional)

Pra entender o que **vai chegar do backend**:

### `product-personal/sections/treinos/types.ts`
Tipos do lado Personal. Mesma vibe de vocabulário (`Plano`, `Treino`, `SeriePrescricao`, etc).

### `product-personal/sections/treinos/data.json`
Mock do plano criado pelo Personal — mesmas 3 sessões com prescrição rica.

⚠️ **Importante**: os contratos do Personal e do Mobile **deveriam ser unificados** no futuro (V2 — contrato compartilhado em `product/data-shape/`). Hoje, cada lado tem o seu. Pra MVP, alinhar nomes e shape sem unificar é suficiente.

## Convenções de código observadas no Design OS

- **Tailwind v4** (sem `tailwind.config.js`)
- Cores: paleta `slate-*` pro neutro, `teal/sky/emerald/amber/rose/violet` semânticas
- Tipografia: DM Sans (heading/body) + IBM Plex Mono (`.font-mono`/`.tabular-nums`)
- Componentes funcionais com props tipadas (TypeScript strict)
- Sem state global — props drilling é OK em sections pequenas
- Callbacks opcionais com `?` e chamados com `?.()`
