# Plano Terapêutico Specification

## Overview
Plano terapêutico estruturado por paciente — abordagem terapêutica, frequência, objetivo principal e objetivos SMART vinculados a indicadores clínicos (instrumento + valor atual + valor alvo). Mostra técnicas planejadas vs aplicadas, gráfico de progresso por indicador (PHQ-9, GAD-7), e histórico de versões do plano. Permite criar nova versão preservando histórico.

## User Flows

### Visualizar o plano vigente
- Header com paciente (avatar · nome · idade) + nome do plano + abordagem chip + status (Em curso · Pausado · Concluído)
- Strip de meta: sessão atual / total + frequência (semanal · quinzenal · mensal) + data de criação
- Bloco "Objetivo principal" em destaque com texto livre

### Objetivos SMART
- Card por objetivo SMART
- Specific: descrição clara do que será trabalhado
- Measurable: indicador clínico (ex: PHQ-9 17 → 9)
- Relevant: vínculo com objetivo principal
- Time-bound: data alvo
- Status (em andamento · concluído · abandonado · pausado)
- Barra de progresso 0-100%
- Direção (reduzir · aumentar · manter) + cor por status

### Técnicas planejadas vs aplicadas
- Lista de técnicas do plano com vezes planejadas (3x) vs vezes efetivamente aplicadas (1x)
- Indicador visual de gap (rose se aplicou pouco, emerald se está em dia)
- Click leva pro detalhe da técnica no catálogo

### Evolução por indicador
- Para cada indicador-alvo (ex: PHQ-9), mini-gráfico com pontos cronológicos
- Linha de base · valor atual · valor alvo
- Visualização de tendência (melhorou · piorou · estável)

### Versões do plano
- Lista cronológica de versões (v1 → v2 → v3)
- Cada versão: data, criada por, resumo das mudanças
- Versão atual destacada
- CTA "Nova versão" abre wizard pra editar e salvar como vN+1

## UI Requirements
- Layout em coluna única max-w-5xl pra leitura confortável
- Header sticky com ações principais (Nova versão · Editar · Voltar pro paciente)
- Cards de objetivo SMART com header colorido por status
- Mini-charts SVG simples (linha + pontos) sem libs pesadas
- Chips de abordagem com cores distintas (TCC teal · ACT sky · ACT mindfulness emerald · EMDR rose · etc.)
- Timeline de versões em vertical com versão atual em destaque
- Estado vazio quando paciente ainda não tem plano

## Configuration
- shell: false (web tem chrome próprio)
