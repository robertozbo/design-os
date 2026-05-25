# Login Specification

## Overview
Tela de entrada do app pra usuário existente. Email + senha + SSO (Apple/Google) + link "Esqueci minha senha". Após login bem-sucedido vai pra `/welcome` (que detecta se é primeiro acesso ou retorno).

## User Flows
- Email + senha → submit → loading → `/welcome`
- Apple/Google SSO → loading → `/welcome`
- Link "Esqueci minha senha" → `/recuperar-senha`
- Link "Não tenho conta · Cadastrar" → `/signup`

## UI Requirements
- AuthShell com logo Heart + "Bem-vindo de volta" + subtítulo
- 2 botões SSO grandes (Apple branco, Google escuro com logo G colorido)
- Divisor "OU COM EMAIL"
- Campos email + senha com toggle eye/eye-off
- Link "Esqueci minha senha" alinhado direita
- CTA grande "Entrar"
- Link "Não tem conta? Cadastrar" no rodapé

## Configuration
- shell: false
