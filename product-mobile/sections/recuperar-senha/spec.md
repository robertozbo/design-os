# Recuperar Senha Specification

## Overview
Fluxo de recuperação de senha em 2 estados visíveis: input do email → confirmação "email enviado" com instruções. (O reset acontece via link no email recebido — fora do app.)

## User Flows
- Input email → submit → loading → estado "email enviado"
- Estado "email enviado" mostra: ícone de envelope + "Enviamos um link pra [email]" + botão "Reenviar" + voltar pra login

## UI Requirements
- AuthShell com logo + título contextual
- Estado 1: input email + CTA "Enviar link"
- Estado 2: ilustração + mensagem + countdown pra reenviar (60s)

## Configuration
- shell: false
