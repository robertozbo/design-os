# Mais Specification

## Overview
Hub do menu lateral acessado pela 5ª tab "Mais". Mostra o card do perfil resumido + atalhos pra todas as áreas secundárias do app (Minha Saúde, Receitas, Configurações, Suporte, Sobre, Sair).

## User Flows

### Acesso ao perfil
- Usuário toca na tab Mais → vê card grande com sua foto, nome, email e plano (Free/Plus/Pro).
- Toque no card abre `/perfil`.

### Atalhos agrupados
- Lista vertical com seções:
  - **Saúde** — Minha Saúde · Receitas · Histórico de exames
  - **Conta** — Perfil · Plano e assinatura · Notificações · Privacidade
  - **Suporte** — FAQ · Falar com suporte · Avaliar app
  - **Sair** (vermelho, destacado)
- Toque em cada item navega pra rota correspondente.

### Plano de assinatura
- Card no topo de "Conta" mostrando plano atual + CTA "Upgrade" se Free.

## UI Requirements
- Header sub-page "Mais" sem back arrow (é tab top-level, mas mantemos consistência visual)
- Card de perfil grande com avatar 56px + nome + email + chip do plano
- Itens da lista com ícone colorido + label + chevron
- Separadores sutis entre grupos (label + items)
- Botão Sair em vermelho no final

## Configuration
- shell: true
