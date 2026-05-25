# Treinos Specification

## Overview
Section do app paciente pra ver e executar o plano de treino prescrito pelo profissional. Diferente de Atividades (livre/wearable), aqui é estruturado: sessões A-G com exercícios, sets, reps, carga e descanso. Permite iniciar treino, marcar como executado e ver histórico.

## User Flows

### Treino de hoje
- App detecta a sessão do dia (mapeia `dayOfWeek` da workout ativa).
- Card hero mostra: letra (A/B/C…) + nome ("Peito e Tríceps") + N exercícios + duração estimada + grupos musculares envolvidos.
- CTA grande "Iniciar treino" → abre modo execução.
- Se não tem treino prescrito hoje, mostra empty state ("Dia de descanso" ou "Sem treino prescrito").

### Modo execução
- Lista de exercícios em ordem.
- Cada exercício mostra: thumbnail/vídeo + nome + N séries × reps × carga + descanso entre séries.
- Toque em exercício abre detalhes (instruções + vídeo demonstrativo).
- Marcar exercício como concluído (visual feedback).
- Cronômetro de descanso ao concluir uma série.
- Ao final: salvar execução com duração + calorias estimadas + rating opcional 1-5 estrelas + notas.

### Plano semanal
- Lista de todas as sessões do plano (A-G) com dia da semana e nome.
- Próxima sessão destacada.
- Toque numa sessão abre seu detalhe (lista de exercícios) sem iniciar execução.

### Histórico
- Lista de execuções recentes (executions): data + sessão + duração + calorias + rating.
- Filtros por período.

### Stats
- Total de treinos no mês.
- Frequência semanal média.
- Distribuição por grupo muscular.
- Top exercícios (mais executados).
- Consistência semanal.

## UI Requirements

- Header sub-page: "Treinos" + subtítulo "Hoje · Quarta" (dia da semana atual)
- Card hero do treino do dia (gradient teal sutil) com letra grande + nome + meta info
- Lista de exercícios com chips de muscle group + sets×reps + carga
- Card pra cada execução no histórico (mesma DNA do AtividadeRow pra consistência)
- Stats em mini cards strip
- Vídeo/imagem demonstrativa em modal ao tocar no exercício
- Cronômetro grande circular durante descanso

## Configuration
- shell: true
