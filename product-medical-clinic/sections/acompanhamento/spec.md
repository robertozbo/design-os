# Acompanhamento Specification

## Overview
O que o paciente compartilhou pelo **app Nymos** entre as consultas, reunido num lugar só para o
médico. É o elo que faltava entre as duas metades do produto: o app captura (métricas de wearable,
atividade, composição corporal, avaliações, exames) e a clínica interpreta. Sem esta tela o app vira
diário pessoal e a clínica vira prontuário eletrônico comum — a tese do produto ("o app captura, o
profissional é o cérebro") depende de o profissional efetivamente enxergar o que foi capturado.

**Nested em Pacientes**, como Consulta e Prontuário — não aparece no nav. Só existe para paciente com
`statusApp: 'vinculado'`. `id: acompanhamento`.

## User Flows

### Ver o que mudou desde a última consulta
Três entradas, com doses diferentes de informação:
- **Drawer do paciente** — botão "Acompanhamento do app", só quando `statusApp === 'vinculado'`
- **Consulta** — o `ContextoPanel` mostra as **3 métricas que mais se mexeram** (ordenadas por
  variação absoluta) com o delta colorido, e "Ver acompanhamento completo" abre o painel sobreposto
  **sem trocar de rota** — a consulta continua montada atrás
- **Section completa** — a casa do dado: séries, comparações e histórico

A regra de "direção desejável" fica na section; o painel de contexto recebe o resumo **já
formatado** (`ResumoApp`) e só exibe. Assim a interpretação clínica não se duplica em dois lugares.
- Toda variação exibida é **relativa à última consulta** (`ultimaConsultaEm`), não ao início do
  acompanhamento — é a pergunta que o médico realmente faz
- Métricas em cards com valor atual, variação assinada, meta (quando combinada), fonte e sparkline

### Avaliar confiabilidade antes de decidir
- Cada dado mostra a **fonte**: wearable, balança, digitado à mão ou medido na clínica
- A **adesão** da atividade (% de dias com registro) é exibida como o que é — engajamento com o app,
  não desempenho. Adesão baixa desqualifica a leitura dos outros números e a tela avisa
- Avaliação física marca **quem mediu**: `avaliadoPor: null` é auto-medição do paciente

### Ver o que não foi liberado
- O painel de consentimento lista **todos** os escopos, inclusive os não compartilhados
- Escopo bloqueado aparece explicitamente bloqueado, nunca oculto — o médico precisa distinguir
  "o paciente não liberou" de "não há dado"

## UI Requirements

### Layout
- **Cabeçalho**: paciente, desde quando usa o app, última sincronização, dispositivos conectados
- **Métricas** — grid de cards (1 col mobile · 2 md · 3 lg) com sparkline SVG e linha de meta
- **Atividade** — card único: passos/dia, minutos ativos, treinos, adesão + barras SVG
- **Composição corporal** — bioimpedância mais recente com variação contra a anterior, histórico
  compacto, e a avaliação física com medidas e autoria
- **Consentimento & exames** — vínculo, escopos (liberados e bloqueados) e exames compartilhados

### Estados & regras
- **Direção desejável por métrica**: peso, glicemia e pressão caindo é bom; sono e passos subindo é
  bom. A cor da variação segue a direção desejável, nunca o sinal aritmético
- `nivel`: `normal` → slate/emerald · `atencao` → amber · `alterado` → rose
- Série constante (min === max) não pode quebrar a normalização do sparkline
- Paciente sem vínculo não tem esta tela — a entrada some

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Gráficos em **SVG inline** — sem biblioteca
- Dado do app **não entra na timeline do Prontuário**: prontuário é registro assinado, com autoria e
  valor legal; métrica de wearable é dado bruto auto-relatado. Misturar apaga a fronteira entre ato
  médico e auto-relato. O médico **cita** o dado dentro de uma evolução quando quiser que ele conte
- O consentimento vem do aceite do convite (`PermissoesCompartilhamento`, no app) e do
  `historico-consentimentos` — esta tela só reflete, nunca concede
