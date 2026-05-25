# Onboarding Specification

## Overview
Wizard fullscreen exibido na primeira vez que o usuário abre o app. Sequência de 8 passos guiando da landing page até estar pronto pra usar. Cada passo é otimizado pra reduzir fricção (skip onde possível) e capturar dados essenciais pra personalização (idade+sexo pros benchmarks de saúde, altura+peso pra antropometria, objetivo pra recomendações).

## User Flows

### Passo 1 — Welcome
- Logo Nymos grande + tagline "Sua saúde em um só lugar"
- 3 chips destacando o valor (IA · Profissional · Wearables)
- CTAs: **Começar** (primário) · **Já tenho conta** (secundário → vai direto pro login)

### Passo 2 — Conta (Signup)
- Email + senha + confirmar senha
- OR botões SSO: Continuar com Apple · Continuar com Google
- Aceite de termos de uso

### Passo 3 — Sobre você
- Nome completo
- Data de nascimento (date picker)
- Sexo biológico (4 chips: Masculino / Feminino / Intersexo / Prefiro não informar)

### Passo 4 — Antropometria
- Altura (slider 140-220 cm)
- Peso atual (input numérico)

### Passo 5 — Objetivo principal
- Cards visuais com 5 opções (single-select): Emagrecimento · Hipertrofia · Manutenção · Performance · Saúde geral

### Passo 6 — Conectar wearable
- Cards: Apple Health · Health Connect · Google Fit
- Pular ("Conectar depois")
- Permite múltiplos

### Passo 7 — Convite profissional
- Input "Código do profissional ou email" (opcional)
- Pular

### Passo 8 — Plano
- 3 cards: Free · Plus (recomendado · 7 dias trial) · Pro
- Default: Plus com trial

### Passo 9 — Pronto!
- Confetti emoji + "Tudo pronto, [nome]!"
- Resumo: dados capturados em chips
- CTA "Começar a usar" → vai pra /inicio

## UI Requirements
- Header sticky no topo: progresso linear (1 de 8) + botão back contextual
- Footer fixo no rodapé com CTA primária + botão "Pular" (quando aplicável)
- Transições smooth entre steps (slide horizontal)
- Sem tab bar, sem shell — fullscreen
- Background gradient sutil teal→slate em alguns passos pra dar sensação de jornada

## Configuration
- shell: false
