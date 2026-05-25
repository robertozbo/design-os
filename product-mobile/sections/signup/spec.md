# Signup Specification

## Overview
Tela de cadastro pra novos usuários. SSO + email/senha. Após cadastro vai pra `/welcome` que ativa o fluxo de onboarding.

## User Flows
- Apple/Google SSO → cria conta → `/welcome`
- Email + senha + confirmar senha → submit → loading → `/welcome`
- Link "Já tenho conta · Entrar" → `/login`

## UI Requirements
- AuthShell com logo + "Crie sua conta" + subtítulo
- SSO buttons + divisor + campos
- Email + Senha + Confirmar senha com indicador de força
- Disclaimer Termos + Política
- CTA "Criar conta"
- Link "Já tem conta? Entrar"

## Configuration
- shell: false
