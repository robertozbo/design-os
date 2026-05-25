# Onboarding Completo Specification

## Overview
Tela de migração final do onboarding. Mostra animação de processamento dos dados (Salvando perfil → Configurando métricas → Linha de base → IA → Finalizando), seguida de celebração breve "Tudo pronto, [nome]!" e auto-redirect pra dashboard.

## User Flows
- Usuário termina o chat onboarding → cai aqui
- Vê 5 steps animados (~4.5s)
- Vê tela de celebração com 🎉 (~2s)
- Auto-navega pra `/mobile/sections/inicio`

## UI Requirements
- 5 cards de steps animados (pending → loading spinner → check verde)
- Background gradient sutil teal/slate
- Tela final: emoji 🎉 + "Tudo pronto, [nome]!" + spinner "Abrindo"

## Configuration
- shell: false
