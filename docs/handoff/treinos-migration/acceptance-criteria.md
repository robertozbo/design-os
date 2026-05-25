# Checklist do "Done"

> Use este documento como gate de finalização. Cada item ✅ é obrigatório pra considerar a migração completa.

## Fase 0 · Limpeza

- [ ] Mocks de plano "Hipertrofia ABC" (ou similar) removidos
- [ ] Header "TREINO 02" (ou identificador interno) removido/renomeado
- [ ] Ícone engrenagem flutuante sobreposto **resolvido** (reposicionado ou removido)
- [ ] Imports não usados removidos
- [ ] Build passa sem warnings novos
- [ ] Lint passa

## Fase 1 · Contrato de dados

- [ ] Tipos do app real alinhados com `product-mobile/sections/treinos/types.ts`
- [ ] `TreinosData.abaAtiva` está sendo lido corretamente
- [ ] `TreinosData.agendaSemanal` está sendo consumido (não mais fallback estático)
- [ ] `TreinosData.treinosProprios` está sendo consumido
- [ ] Backend retorna o shape esperado (validar com 1 request real)

## Fase 2 · UI · Tab "Meu Personal"

### Tabs no topo
- [ ] 2 tabs: "Meu Personal" e "Meus treinos"
- [ ] Tab ativa tem bg teal-500 + texto slate-950
- [ ] Tab inativa tem bg slate-900 + border slate-800
- [ ] Counter aparece dentro do tab quando > 0
- [ ] Tap troca de aba sem flicker

### Hero card
- [ ] Faixa "por [Personal] · seu Personal" no topo (quando há Personal vinculado)
- [ ] Faixa NÃO aparece quando sem Personal (não quebra layout)
- [ ] Letra grande (A/B/C) com cor por sessão (`SessaoUI.cor`)
- [ ] Label "Treino de hoje · [agenda]"
- [ ] Nome do treino (`session.name`)
- [ ] Chips de grupos musculares com mesma cor da letra
- [ ] 2 stats: exercícios + duração (sem kcal no hero)
- [ ] CTA "Iniciar treino" gradient `from-teal-500 to-sky-500`
- [ ] Empty state "Dia de descanso" quando sem treino prescrito hoje

### Stats strip
- [ ] 4 cards: streak dias, total/mês, freq/sem, duração média
- [ ] Cada card tem icon + valor mono tabular + label uppercase pequena

### Bloco "Plano semanal"
- [ ] Header com icon CalendarDays + título + contador "Nx /sem"
- [ ] Lista vertical com 7 linhas (Seg-Dom)
- [ ] Cada linha: label dia + chip letra colorido + nome
- [ ] Dias de descanso: chip dashed border slate-700 + texto "descanso" italic slate-500
- [ ] Linha de hoje tem bg slate-800/30 + badge "HOJE" teal
- [ ] Toque em dia com sessão abre detalhe da sessão
- [ ] Toque em dia de descanso é no-op (não dispara nada)

### Bloco "Sessões do plano"
- [ ] Lista compacta de cards das sessões (A/B/C)
- [ ] Cada card: letra colorida + nome + meta info mono (`N ex · Nmin · dias`)
- [ ] Toque abre detalhe da sessão (sem iniciar execução)

### Histórico recente
- [ ] Header com icon History + título + link "Ver tudo"
- [ ] Empty state "Nenhum treino registrado ainda" se vazio
- [ ] Lista de `ExecucaoRow` com avatar letra + nome + tempo + duração + kcal + estrelas
- [ ] Toque abre detalhe da execução

## Fase 2 · UI · Tab "Meus treinos"

- [ ] Helper text explicativo no topo
- [ ] Lista de cards de treinos próprios
- [ ] Botão "+ Novo treino" dashed border slate-700 no fim da lista
- [ ] Empty state quando sem treinos próprios (só o botão Novo)
- [ ] Toque em card de treino próprio dispara callback de detalhe
- [ ] Toque em "+ Novo treino" dispara fluxo de criação

## Modo execução (já existe — validar que continua funcionando)

- [ ] Tap em "Iniciar treino" no hero abre o fullscreen `ExecutarTreinoFlow`
- [ ] Fase `doing`: cronômetro total, card do exercício, valores prescritos, "Concluir série", "Pular exercício"
- [ ] Fase `resting`: countdown circular + "Próximo · Série N" + "Pular descanso"
- [ ] Fase `finishing`: stats + rating 5 estrelas + textarea de notas + "Salvar treino"
- [ ] Payload final inclui `series[]` com `concluida: true` por cada série
- [ ] `repsReal` e `loadRealKg` defaultam pro valor prescrito (OK pra MVP — V2 vira input)

## Vocabulário

- [ ] "Plano" usado em vez de "Programa"/"Workout"
- [ ] "Treino" para A/B/C
- [ ] "Sessão" só quando se refere a estrutura
- [ ] "Série" em vez de "Set"
- [ ] "Carga" em vez de "Peso"/"Load"
- [ ] "Descanso" em vez de "Intervalo"/"Rest"
- [ ] "Personal" em vez de "Trainer"

## Visual fidelity

Comparar telas finais com screenshots em `screenshots/`:

- [ ] `01-tab-meu-personal-topo.png` — hero, stats, agenda visíveis
- [ ] `02-tab-meus-treinos.png` — lista vazia ou com card + botão Novo
- [ ] `03-execucao-serie.png` — modo execução fase doing
- [ ] `04-execucao-descanso.png` — cronômetro circular
- [ ] `05-execucao-finalizar.png` — tela final com estrelas e textarea

Pequenas diferenças (espaçamento, sombras) OK. Estrutura e hierarquia devem casar.

## Regressões a verificar

- [ ] Navegação pra outras sections continua funcionando
- [ ] Bottom tab bar com 5 itens não foi alterada
- [ ] Section `atividades` (que é vizinha de `treinos`) não foi quebrada
- [ ] Section `inicio` continua linkando pra Treinos via Quick Actions
- [ ] Nenhum endpoint backend foi alterado

## Performance

- [ ] Tela inicial carrega em < 500ms (com dados em cache)
- [ ] Transição entre tabs é instantânea (sem fetch a cada toque)
- [ ] Modo execução roda 60fps na fase `resting` (cronômetro animado)
