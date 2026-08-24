# Atendimento por Profissional Specification

## Overview
A **tela de atendimento de cada profissão** da clínica — fisioterapia, nutrição, psicologia e fonoaudiologia. É a contraparte de `consulta`, que é a tela do médico (escriba IA + SOAP): a clínica é multiprofissional, e cada conselho registra coisas diferentes. Fisioterapeuta registra EVA, condutas e goniometria; nutricionista registra antropometria, metas e plano alimentar; psicólogo registra escalas, risco, técnicas e uma **nota privada que não vai para o prontuário compartilhado**; fonoaudiólogo **conta** — tentativa a tentativa, alvo a alvo — porque na fono a evolução é uma porcentagem, não um parágrafo. O que **não** muda é o esqueleto: mesmo cabeçalho de paciente, mesmo cronômetro, mesma coluna de contexto e as mesmas duas ações que encerram. Quatro telas diferentes que continuam sendo o mesmo produto.

## User Flows

### Atender (as três, igual)
- Profissional abre o atendimento a partir da Agenda ou do paciente → barra fixa com paciente, número da sessão no pacote, motivo e **cronômetro correndo** (pausa/retoma; passa a âmbar ao estourar a duração prevista)
- Observação crítica do paciente (alergia, comorbidade, medicação) fica sempre visível em rose sob o cabeçalho
- À direita: alertas + histórico das últimas sessões daquele paciente com aquele profissional
- "Salvar rascunho" a qualquer momento · "Finalizar e assinar" fecha e gera a evolução no Prontuário
- Sair sem assinar mantém o rascunho

### Sessão de fisioterapia
- **EVA na chegada e na saída** (0–10 em botões, verde→vermelho); a variação da sessão aparece no cabeçalho do bloco
- **Condutas aplicadas** em chips agrupados por natureza (eletroterapia, terapia manual, cinesioterapia, crioterapia), cada chip marcado mostra a dose ("20 min · 80 Hz")
- **Goniometria**: tabela articulação × movimento com direito/esquerdo e a referência; valor abaixo de 90% da referência sai em âmbar
- **Testes funcionais** com o resultado comparado ao inicial
- **Evolução da sessão** e **plano da próxima**
- Lateral: barras de **dor por sessão**, da primeira até hoje
- Finalizar sem EVA de saída avisa em vez de assinar

### Consulta de nutrição
- **Antropometria de hoje** comparada com a anterior: peso (editável, recalcula o IMC ao digitar), IMC, cintura, quadril, % de gordura e massa magra — cada uma com o delta no tom certo (para massa magra, subir é bom)
- **Metas do plano**: kcal, proteína, carboidrato, gordura
- **Recordatório alimentar 24h** por refeição
- **Plano alimentar** por refeição com horário e itens em chips
- **Orientações** ao paciente + **evolução da consulta**
- Lateral: barras da **curva de peso** e o total perdido no acompanhamento

### Sessão de psicologia
- **Foco da sessão** + abordagem (TCC)
- **Avaliação de risco** em 4 níveis; qualquer nível acima de zero abre o aviso de plano de segurança e bloqueia a assinatura
- **Registro SOAP** em quatro campos
- **Técnicas aplicadas** em chips por categoria (cognitiva, comportamental, terceira onda…)
- **Tarefa de casa** (vai para o app do paciente)
- **Nota privada** em bloco visualmente separado — impressões do profissional, fora do prontuário compartilhado e fora do que o paciente recebe
- Lateral: **escalas** (GAD-7, PHQ-9) com valor, faixa, barra e direção

### Sessão de fonoaudiologia
- **Foco da sessão** e **inteligibilidade de fala** em 4 níveis (só a família → todos entendem), com o delta desde a última avaliação
- **Treino por alvo**: cada alvo tem contador de **acerto/erro batido durante a sessão**, precisão recalculada na hora, barra no tom do critério daquele alvo e o **nível de apoio** (independente · com pista · com modelo)
- Alvo que sustenta o critério em três sessões seguidas ganha o chip **"pronto para avançar"** — uma sessão boa não é generalização
- **Exercícios aplicados** em chips por categoria (consciência fonológica, fonoarticulatório, motricidade orofacial, linguagem)
- **Orientação ao cuidador** (vai para o app do responsável) + **evolução** e **plano da próxima**
- Lateral: barras da **precisão por sessão** e quantos alvos estão prontos para avançar
- Finalizar sem nenhuma tentativa registrada avisa que a evolução fica sem número

## UI Requirements

### Esqueleto (`AtendimentoShell`)
- Barra fixa: sair (X) · avatar no tom da profissão · nome, idade, convênio · chip da tela · chip "Sessão N de M" · motivo e data · cronômetro `hh:mm:ss` com pausa · "Salvar rascunho" · "Finalizar e assinar" (teal)
- Faixa rose com a observação crítica quando existir
- Corpo em duas colunas no `lg` (miolo + 320px de contexto), empilhado no mobile
- Miolo é uma pilha de `Bloco` (título + acessório à direita); textos usam `Campo`

### Tom por profissão
- Fisioterapia `sky` · Nutrição `emerald` · Psicologia `violet` · Fonoaudiologia `orange` — avatar, chips e destaques da tela seguem o tom, para o profissional reconhecer a tela dele antes de ler o título

### Estados & regras
- EVA e escalas: verde embaixo, âmbar no meio, rose em cima — **nunca** o contrário
- Inteligibilidade e precisão de alvo **invertem**: são escala de função e de desempenho, não de sintoma — verde em cima. E o corte da precisão é o critério do próprio alvo, não um número fixo (70% pode ser alta numa meta de narrativa e insuficiente numa de fonema)
- Peso digitado recalcula o IMC na hora (dois números que se contradizem na mesma tela é pior que nenhum)
- Delta de massa magra inverte o sinal de "bom": perder peso derrubando massa magra é alerta, não vitória
- Risco > 0 na psicologia bloqueia a assinatura
- Fisioterapia sem EVA de saída avisa ao finalizar
- Fonoaudiologia sem nenhuma tentativa contada avisa ao finalizar

## Design Notes
- Nymos (teal nas ações, DM Sans), light/dark, props-based, sem fetch interno
- Um `data.json` com os quatro atendimentos; os quatro screen designs compartilham shell, contexto e helpers
- A tela do médico continua sendo `consulta` (escriba IA + SOAP) — esta section é o que faltava para as **outras** profissões
- Referências das verticais: `product-fisio/sections/evolucao`, `product-psicologo/sections/sessao`
