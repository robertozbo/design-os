# App Paciente Nymos — Product Overview

## Summary

App de saúde para o paciente final acompanhar **nutrição, atividades, treinos, métricas corporais, biomarcadores e evolução visual**, com **análise IA** que consolida tudo em snapshots periódicos (Ótimo / Atenção / Risco) e — feature-âncora — gera **projeções visuais de corpo futuro** com base em fotos + bioimpedância + meta.

## Posicionamento

- **Audiência:** paciente adulto que mede saúde com bioimpedância, smartwatch, exames e fotos
- **Diferencial:** consolida tudo em "Minha Saúde" + análise IA + Projeção Corporal (Nano Banana)
- **Tom:** educativo, respeitoso, nunca diagnóstico ou prescritivo

## Stack atual

- **Framework:** Expo 55 (managed workflow)
- **Runtime:** React Native 0.76+
- **Navegação:** React Navigation 7 (native stack + bottom tabs)
- **State:** TanStack Query (server)
- **Auth:** JWT (access + refresh) via `expo-secure-store`
- **UI primitivos:** `@parisgroup-ai/pageshell-native` (interno)
- **Lógica core:** `@parisgroup-ai/pageshell-core` (interno)
- **i18n:** react-i18next (pt-BR, en-US, es-PY, fr-FR, de-DE, it-IT)
- **Pagamentos:** Stripe (`@stripe/stripe-react-native`)
- **Wearables:** HealthKit (`@kingstinct/react-native-healthkit`)
- **Build:** EAS

Repo: `/Users/roberto.zbo/Desktop/Projetos/Nymos/mobile`

## Estado atual (out of standard)

- ~85 telas em 20 features
- Paleta azul/indigo (não unificada com o design-os web)
- Tipografia padrão sistema (não DM Sans / IBM Plex Mono)
- Componentes próprios em `pageshell-native`

## Estratégia design-os-mobile

**Não refazer arquitetura.** Apenas:

1. Especificar visualmente cada feature MVP (`spec.md`, `data.json`, `types.ts`)
2. Redesenhar com **tokens unificados** + **DM Sans** + paleta consistente
3. Capturar screenshots como referência visual
4. RN reconstrói a tematização gradualmente em cima das telas existentes

## Features MVP (11)

Ver `product-roadmap.md` para detalhes. Resumo:

**Core navegação (5):** Início · Métricas · Objetivos · IA · Mais
**Quick actions (3):** Nutrição · Atividades · Treinos
**Feature-âncora (1):** Minha Saúde — agregador + análises IA + Projeção Corporal (Nano Banana) em uma section, alinhada ao backend Nymos
**Suporte (1):** Saúde Mental — chat com psicólogo + diário emocional

## Design system alvo

- **Tipografia:** DM Sans (heading + body) + IBM Plex Mono (números, timestamps, códigos)
- **Paleta:** a definir — provável teal/slate alinhado ao design-os web, com semânticos para status (emerald/amber/rose/sky)
- **Modo:** dark-first (o app atual já é dark)
- **Viewport alvo:** 375×812 (iPhone padrão) e 414×896

## Out of scope (V2+)

- Refatoração da arquitetura RN
- Migração de `pageshell-native` pro novo design system
- Features além das 10 MVP (challenges, exams detalhado, body-evaluations standalone (absorvido em Minha Saúde), ranking, reports, user-management)
- Web paciente (separado)
