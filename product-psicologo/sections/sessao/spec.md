# Sessão Specification

## Overview
Tela da sessão clínica em andamento — feature âncora do produto. Layout dedicado em tela cheia (sai do shell de navegação) com header fixo (paciente · timer · finalizar), corpo em duas colunas: à esquerda o editor de anotação clínica (modo SOAP, DAP ou texto livre) + homework + notas privadas; à direita um sidebar com avaliação de risco (0-3), seleção de técnicas terapêuticas categorizadas e instrumentos recentes do paciente. Otimizada pra desktop com largura máxima de 1600px.

## User Flows

### Iniciar e cronometrar a sessão
- Psicólogo clica "Iniciar sessão" no Dashboard ou Pacientes e cai nesta tela
- Header mostra strip do paciente (avatar · idade · plano · abordagem · número da sessão)
- Timer roda em tempo real desde `iniciadaEm` (formato `00:00:00`)
- Botão Pause/Play congela ou retoma o cronômetro
- Botão Finalizar grava a sessão e leva pro prontuário; "X" cancela sem salvar

### Anotar em modo SOAP
- Padrão é SOAP (Subjetivo · Objetivo · Avaliação · Plano)
- Cada campo SOAP é um painel com cor própria, label, hint e textarea
- Toggle no topo alterna entre SOAP, DAP (3 painéis) e Texto livre (textarea única)
- Mudança de modo preserva o que já foi escrito em cada modo

### Selecionar técnicas e prescrever homework
- Sidebar lista o catálogo de técnicas agrupado por categoria (cognitiva, comportamental, experiencial, corporal, narrativa)
- Cada técnica mostra abordagem (TCC, ACT, etc.) com chip colorido
- Click toggle adiciona/remove da lista de técnicas usadas na sessão
- Painel Homework recebe texto + tags + prazo opcional

### Registrar risco do encontro
- Painel Risco com 4 níveis (0=sem risco · 1=baixo · 2=moderado · 3=crítico)
- Nível 3 destaca em rose com mensagem do protocolo de crise
- Avaliação obrigatória antes de finalizar

### Notas privadas e instrumentos recentes
- `<details>` colapsável com textarea pra notas privadas (não vão pro prontuário)
- Sidebar mostra os 2-3 instrumentos mais recentes do paciente (PHQ-9, GAD-7) com valor + severidade
- Botão "Aplicar instrumento" abre o fluxo de aplicação online

## UI Requirements
- Layout full-screen com header fixo de 72px e grid 12 colunas (8 + 4) no corpo
- Tema dark slate (slate-950 background, slate-900 cards, slate-800 borders)
- Timer em font-mono tabular-nums no header
- Modo tabs em pill cards com estado ativo violet
- Painéis SOAP coloridos por campo (teal · sky · amber · violet)
- Catálogo de técnicas com ícones lucide por categoria
- Botão Finalizar com gradiente violet→sky e ícone de check
- Risco crítico em rose com banner de protocolo
- Responsive: stacking em < 1024px (corpo vira coluna única, sidebar abaixo)

## Configuration
- shell: false (sessão é tela cheia, sai do shell pra foco)
