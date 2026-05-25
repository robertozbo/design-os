# Welcome Specification

## Overview
Tela inicial pós-login. Mostra mensagem "Bem-vindo ao Nymos · Plataforma de saúde integrada" com spinner por 3 segundos e redireciona automaticamente pra `/onboarding` (chat questionnaire).

## User Flows
- Usuário faz login → cai aqui
- Espera 3s vendo branding
- Auto-navega pra `/mobile/sections/onboarding`

## UI Requirements
- Background gradient teal sutil
- Logo Heart gradient teal→sky animado (zoom-in)
- "Bem-vindo ao Nymos" título grande
- "Plataforma de saúde integrada" subtítulo
- Spinner teal com "Preparando sua experiência..."

## Configuration
- shell: false
