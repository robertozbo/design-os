# Mais do Personal Specification

## Overview
5ª tab do app Personal. Concentra o que não cabe nas 4 tabs principais (Início, Alunos, Agenda, Treinos) e a **troca de perfil** para o app de Aluno.

## Mapa de menus (MVP mobile)
- **Tabs:** Início · Alunos · Agenda · Treinos · Mais
- **Atendimento:** Avaliações físicas · Mensagens · Solicitações de agendamento
- **Biblioteca:** Exercícios · Programas
- **Crescimento:** Convidar aluno (indicações)
- **Conta:** Perfil profissional (CREF) · Plano e assinatura · Notificações · Configurações
- **Trocar para perfil Aluno** (só se a conta tem os dois perfis)
- **Sair**

Fica de fora do mobile no MVP (só web): faturamento detalhado, builder completo de periodização, relatórios.

## User Flows
- Toca no card do perfil → perfil profissional
- Toca em item → navega para a tela
- Toca "Trocar para perfil Aluno" → troca o navigator raiz sem novo login
- Toca "Sair" → logout centralizado

## UI Requirements
- Header sub-page "Mais" sem seta (tab)
- Card de perfil: avatar, nome, CREF, chip do plano (Free/Plus/Pro)
- Grupos com label mono uppercase; itens com ícone Lucide + label + badge opcional + chevron
- Botão "Trocar para perfil Aluno" destacado (borda sky)
- Sair em vermelho no final

## Configuration
- shell: true
