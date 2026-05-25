# Disponibilidade Specification

## Overview
Tela onde o psicólogo configura sua **agenda recorrente** (dias da semana × intervalos × duração de slot). Backend já existe no Nymos e expõe `ProfessionalAvailability` por `dayOfWeek`; este redesign moderniza a UX da página antiga, que usava lista de selects rígida.

A configuração desta tela é **fonte de verdade** pra validação no fluxo de criar consulta (Agenda → escolher horário) — o backend já checa, falta a UI consumir.

## User Flows

- **Visão geral em 1 olhar** — header com 4 stats inline (dias ativos · horas/semana · slots totais · duração padrão), sem cards gigantes
- **Timeline semanal** — grade visual 7 colunas (Seg-Dom) × timeline vertical (06h-22h). Blocos preenchidos = horário ativo. Tap num dia inativo: ativa com padrão (08-18, 1h)
- **Lista por dia (collapsible)** — cada dia abre acordeão com pills de intervalo (`08:00–12:00`, `14:00–18:00`); botão `+ Adicionar intervalo`; suporte a múltiplos blocos por dia (manhã/tarde, ou matutino/vespertino/noturno)
- **Copy/paste entre dias** — menu `⋯` em cada dia: "Copiar de Segunda", "Aplicar a Ter–Sex", "Limpar dia"
- **Duração de slot** — segmented control (30 · 45 · 60 · 90 · 120 min). Suporte a override por dia (raro mas útil)
- **Template aplicado** — botão "Carregar template" → drawer com presets (Comercial 9-18 · Saúde estendida 7-21 · Apenas tardes · Apenas online · Personalizado)
- **Salvar com badge** — footer dock fixo só aparece quando há mudanças; mostra "X alterações pendentes" + botões `Descartar` / `Salvar disponibilidade`
- **Conflito com agenda existente** — se psicólogo desativa um dia que tem consulta agendada, modal de aviso "3 consultas existem neste dia — manter como exceção ou cancelar?"

## UI Requirements

### Estrutura geral
- Dark mode default (`bg-slate-950`)
- Wrapper `data-nymos-psicologo` com DM Sans (body) + IBM Plex Mono (números/horários)
- Container central max-w-5xl com padding lateral 24px
- Sem sidebar (vive dentro do shell psicologo existente)

### Header
- Sobre-título `DISPONIBILIDADE` em uppercase tracking text-slate-500 text-[11px]
- Título `Quando você atende` (28px font-semibold slate-50) — copy humana em vez de "Gestão de Disponibilidade"
- Subtítulo (14px slate-400): "Configure os horários recorrentes da sua semana. Pacientes só veem slots dentro dessa grade."
- Linha de ações secundárias à direita: `Carregar template ↗` (link teal) · `Limpar tudo` (link rose, com confirmação)

### Banner de stats (inline, sem card)
- 1 row, 4 stats separados por `·` em slate-500
- `5 dias` (mono semibold slate-100) `ativos` (slate-500)
- `50h` `por semana`
- `50 slots` `disponíveis`
- `60min` `por consulta`
- Mudanças refletem instantaneamente

### Bloco 1 · Timeline Visual da Semana (nova)
Card `rounded-2xl bg-slate-900 border border-slate-800 p-5`:
- Header esquerdo: `Timeline da semana` (15px font-semibold slate-100)
- Header direito: toggle de modo `Timeline · Lista` (segmented control compacto)
- Grade SVG:
  - 7 colunas (Seg–Dom em slate-400 text-[11px] uppercase no topo)
  - Linhas horizontais a cada 4h (06, 10, 14, 18, 22) com labels mono text-[10px] slate-500 na esquerda
  - Cada bloco ativo: retângulo `rounded-md bg-teal-500/25 border border-teal-500/40`
  - Bloco vazio: `bg-slate-800/40`
  - Dia inativo (sem nenhum bloco): coluna fica `bg-slate-900/40` com label "—" no centro
- Hover/tap num bloco: highlight + tooltip com horário do bloco
- Tap num dia "vazio": ativa com padrão (08-18, 1h)
- Width responsivo; em telas pequenas, scroll horizontal

### Bloco 2 · Lista por Dia (substitui o grid antigo)
Card `rounded-2xl bg-slate-900 border border-slate-800` SEM padding (linhas têm divider).

Cada dia é uma row collapsible:
- **Header da row** (sempre visível, h-14):
  - Esquerda: Toggle `Switch` slate-700/teal-500 + label dia em font-semibold slate-100 (`Segunda-feira`) + label curto em slate-500 (`Seg`)
  - Centro: resumo dos intervalos como pills inline (`08:00–12:00`, `14:00–18:00` — `IBMPlexMono_500Medium text-[12px]`, bg-slate-800 rounded-md)
  - Direita: `⋯` menu (icone MoreHorizontal) com Copy/Paste/Limpar
- **Expanded** (tap no dia ativo):
  - Lista de intervalos editáveis (cada um: range slider visual ou 2 selects time + delete)
  - Botão `+ Adicionar intervalo` em link teal
  - Duração específica (override): `Slot: 60min ▾` (link discreto)
- Dia inativo:
  - Sem pills; texto slate-500 italic "Sem atendimento"
  - Toggle ativa com padrão

### Bloco 3 · Configurações globais
Card `rounded-2xl bg-slate-900 border border-slate-800 p-5`:
- Linha 1: `Duração padrão da consulta` (slate-100) + segmented control horizontal (30 · 45 · **60** · 90 · 120) — destaque do ativo em `bg-teal-500/15 text-teal-200 border border-teal-500/40`
- Linha 2: `Antecedência mínima pra agendar` — segmented (1h · 4h · 12h · 24h · 48h)
- Linha 3: `Bloqueio entre sessões` — toggle "Pausa de 5min entre consultas"

### Footer Dock (sticky bottom)
- Só aparece quando `hasChanges`
- Background `bg-slate-900/95 backdrop-blur border-t border-slate-800 px-6 py-4`
- Esquerda: ícone Bell + `3 alterações pendentes` (slate-300 text-[13px])
- Direita: botões `Descartar` (ghost slate) + `Salvar disponibilidade` (teal-500 primary com Sparkles icon)
- z-index alto pra ficar sobre tudo

### Estados

- **Loading**: skeleton da timeline em slate-900/40, sem stats; lista com 3 rows skeleton
- **Empty (nunca configurou)**: estado vazio onboarding — card grande com ilustração + título "Configure quando você atende" + 3 botões `Template Comercial (9-18)` · `Saúde Estendida (7-21)` · `Começar do zero`
- **Saving**: footer com spinner + texto "Salvando..."
- **Saved**: toast emerald `Disponibilidade atualizada` aparece embaixo + footer some + stats reflete novo cálculo
- **Erro de save**: footer fica rose + texto erro + botão `Tentar de novo`

### Tokens / visual
- teal-500 → ações primárias, blocos ativos da timeline
- emerald-400 → feedback de salvo, sucesso
- rose-400 → ações destrutivas (limpar tudo)
- slate-950/900/800 → background hierarchy
- slate-50/100/300/400/500 → texto descendente
- DM Sans em headings/body, IBM Plex Mono em horários, durações, contagens

### Touch / interação
- Cada toggle: 44pt mínimo
- active:scale-[0.99] em cards tappables
- Transições subtle 150ms em todos os estados

## Diferenças vs página antiga (justificativa de redesign)
- **Antes**: lista linear de 7 selects "de/até/duração" — sem visão semanal nem multi-intervalo
- **Depois**: timeline visual + lista expandível com multi-intervalo + copy/paste entre dias + footer dock
- **Antes**: 4 KPIs em cards gigantes (Dias / Horas / Slots / Duração) ocupando toda a tela
- **Depois**: stats inline compactos (1 linha de texto)
- **Antes**: salvar fica espalhado pelos cards individuais
- **Depois**: footer dock único só aparece com mudanças, claro o que está pendente
- **Antes**: sem suporte a multi-intervalo (manhã/tarde com pausa)
- **Depois**: nativo, com `+ Adicionar intervalo`
- **Antes**: zero validação contra agenda existente
- **Depois**: confirma com modal quando muda dia que tem consulta

## Escopo NÃO incluso (V2)
- Bloqueios pontuais (férias, dia específico) → vive em sub-página "Exceções"
- Sincronia com Google Calendar — V2
- Visualização da agenda do paciente (preview do que ele vê) — drawer separado
- Disponibilidade por modalidade (presencial vs online) — V2
- Pacotes (clínicas com múltiplos psicólogos) — V2

## Configuration
- shell: true
