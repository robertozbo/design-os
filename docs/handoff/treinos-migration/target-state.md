# Estado-alvo · Section Treinos

## Hierarquia da tela

```
┌─ Header sub-page ─────────────────────────┐
│ < Treinos                          🔍 ⊕   │
│ Hoje · Quarta                              │
├────────────────────────────────────────────┤
│ [Meu Personal  3]  [Meus treinos  1]      │ ← tabs
├────────────────────────────────────────────┤
│                                            │
│  TAB "Meu Personal" (default):             │
│  ┌────────────────────────────────────┐   │
│  │ Hero card                          │   │
│  │  • "por Rafa Costa · seu Personal" │   │
│  │  • Letra grande A + nome (Peito)   │   │
│  │  • Chips de grupos musculares      │   │
│  │  • Stats: exercícios, duração       │   │
│  │  • CTA gradient "Iniciar treino"   │   │
│  └────────────────────────────────────┘   │
│  Stats strip · 4 cards (dias / mês / sem / min)
│  ─────────                                 │
│  📅 Plano semanal · 5× /sem                 │
│  ┌────────────────────────────────────┐   │
│  │ Seg  A  Peito                      │   │
│  │ Ter  B  Costas                     │   │
│  │ Qua  A  Peito           [HOJE]     │   │
│  │ Qui  B  Costas                     │   │
│  │ Sex  C  Cardio                     │   │
│  │ Sáb  ·  descanso                   │   │
│  │ Dom  ·  descanso                   │   │
│  └────────────────────────────────────┘   │
│  ─────────                                 │
│  🏋 Sessões do plano · 3                    │
│  ┌────────────────────────────────────┐   │
│  │ A  Peito · 1 ex · 8min · Seg, Qua  │   │
│  │ B  Costas · 1 ex · 8min · Ter, Qui │   │
│  │ C  Cardio · 1 ex · 8min · Sex      │   │
│  └────────────────────────────────────┘   │
│  ─────────                                 │
│  ⏱ Histórico recente               Ver tudo│
│  ┌────────────────────────────────────┐   │
│  │ B  Costas · ontem  · 8min · ★★★★☆  │   │
│  │ A  Peito  · há 3d · 9min · ★★★★★  │   │
│  └────────────────────────────────────┘   │
│                                            │
└────────────────────────────────────────────┘
```

### TAB "Meus treinos"
```
┌────────────────────────────────────────────┐
│ Treinos que você criou, separados do       │
│ plano do seu Personal.                     │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 🏋  Caminhada matinal                │ │
│  │    Cardio livre                      │ │
│  │    30min · 3x por semana             │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ + Novo treino                        │ │  ← dashed border
│  └──────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

## Componentes e responsabilidades

### `Treinos` (container)
- Mantém estado da aba ativa
- Decide qual tab renderizar
- Recebe `data: TreinosData` e callbacks

### `TabButton`
- Renderiza tabs com pill style
- Mostra contador se > 0
- Active state: bg teal + texto slate-950
- Idle state: bg slate-900 + border slate-800

### `HeroTreinoHoje`
- Faixa "por [Personal] · seu Personal" no topo (se houver)
- Letra grande (A/B/C…) com cor por sessão
- "Treino de hoje · [agenda label]"
- Nome do treino
- Chips dos grupos musculares
- Stats: exercícios, duração
- Botão grande "Iniciar treino" gradient `from-teal-500 to-sky-500`
- Empty state quando não há treino hoje ("Dia de descanso")

### `StatsStrip`
- 4 mini-cards: streak dias, total/mês, freq/sem, duração média

### `AgendaSemanal`
- Lista vertical com 7 linhas (Seg-Dom)
- Cada linha: label do dia + chip da letra (A/B/C com cor) + nome OU "descanso"
- Linha "hoje" tem destaque (bg slate-800/30 + badge "HOJE")
- Dias de descanso têm chip dashed border slate-700

### `SessoesList`
- Lista das sessões A/B/C com letra colorida + nome + meta info (N ex · Nmin · dias)
- Toque abre detalhe da sessão (sem iniciar execução)

### `HistoricoSection`
- Header "Histórico recente" + link "Ver tudo"
- Lista de `ExecucaoRow`: avatar com letra colorida + nome + tempo relativo + duração + kcal + estrelas
- Empty state se vazio

### `MeusTreinosTab`
- Helper text explicativo
- Lista de cards de treinos próprios (nome · tipo · duração · frequência)
- Botão "+ Novo treino" dashed no fim

### `ExecutarTreinoFlow` (já existe — não alterar)
- Fullscreen overlay com header (X · letra · nome · cronômetro · pause)
- Fase `doing`: card do exercício + vídeo placeholder + dots de progresso + "Série N de M" + "10 reps · 33kg" + "Concluir série" + "Pular exercício"
- Fase `resting`: cronômetro circular + "Próximo · Série N" + "Pular descanso"
- Fase `finishing`: stats + rating 5 estrelas + notas + "Salvar treino"

## Contrato de dados

Ver `product-mobile/sections/treinos/types.ts` — é o source of truth.

Tipos principais:
- `TreinosData` — estado raiz da section
- `TreinosAba` — `'meu-personal' | 'meus-treinos'`
- `SessaoUI` — view-model de uma sessão (A/B/C)
- `ExercicioUI` — view-model de exercício dentro de sessão
- `ExecucaoUI` — view-model de execução para histórico
- `AgendaDia` — mapeamento dia-da-semana → letra
- `TreinoProprio` — treino criado pelo aluno
- `TreinosStats` — stats agregados

## Cores semânticas

Por sessão (via `SessaoUI.cor`):
- `teal` (default · Peito/upper)
- `sky` (Costas/upper)
- `amber` (Cardio)
- `emerald` (Pernas/lower)
- `rose` (Core)
- `violet` (Ombros)
- `orange` (Braços)

## Vocabulário canônico (não usar sinônimos)

| Termo | Sinônimos a evitar |
|---|---|
| **Plano** | "Programa", "Workout" |
| **Treino** (sessão A/B/C) | "Sessão", "Dia" — usar só em contextos específicos |
| **Sessão** (do plano) | OK quando se refere a estrutura A/B/C |
| **Exercício** | "Movimento" |
| **Série** | "Set" |
| **Carga** | "Peso", "Load" |
| **Descanso** | "Intervalo", "Rest" |
| **Execução** | "Performance", "Log" |
| **Personal** | "Trainer", "Treinador" — "Personal" é o termo do produto |

## Estados especiais

### Sem plano vinculado
- Hero mostra "Dia de descanso" como fallback
- Tab "Meu Personal" mostra empty state com CTA "Convidar Personal" (link pra section Profissionais)

### Sem treinos próprios
- Tab "Meus treinos" mostra apenas o botão "+ Novo treino"
- Tab tem counter 0 (botão sem badge)

### Hoje sem treino prescrito
- Hero mostra "Dia de descanso · sem treino prescrito hoje"
- Stats strip continua visível
- Plano semanal continua visível (com a linha de hoje em destaque, indicando descanso)
