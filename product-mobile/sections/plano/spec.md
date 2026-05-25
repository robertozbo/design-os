# Plano Specification

## Overview
Section de assinatura/upgrade com integração Stripe. Mostra plano atual, planos disponíveis (Free/Plus/Pro) com comparação de features, e fluxo de checkout. Usuários pagantes têm seção "Gerenciar assinatura" (cancelar, alterar, faturas).

## User Flows

### Free → Upgrade
- Usuário em Free chega via "Upgrade pra Pro" no Mais ou via gate de feature locked.
- Vê 3 cards de plano com toggle mensal/anual (anual com desconto 16%).
- Compara features lado a lado (tabela).
- Toca "Assinar Plus" ou "Assinar Pro".
- App chama backend `POST /payment/stripe/subscription` → recebe `clientSecret` + Stripe Checkout URL.
- Abre Stripe Checkout em WebView.
- Após sucesso, webhook do backend atualiza userPlans → app sincroniza status.

### Upgrade Plus → Pro
- Usuário Plus toca "Upgrade pra Pro".
- Backend chama `PUT /payment/stripe/subscription/:id` com novo planType.
- Stripe faz proração e cobra diferença.

### Cancelar Assinatura
- Usuário pagante toca "Cancelar assinatura".
- Modal de confirmação com data de vigência ("até 04/06/2026").
- Backend chama `DELETE /payment/stripe/subscription/:id`.
- Plano fica `cancel_at_period_end = true`. Usuário continua usando até final do ciclo.

### Histórico de Pagamentos
- Lista de paymentTransactions: data + valor + status + invoice link Stripe.
- Toque abre fatura (PDF) hospedada na Stripe.

## UI Requirements
- Header sub-page "Plano" + back arrow
- Card de plano atual no topo (estado primário)
- Toggle mensal/anual com badge "Economize 16%" no anual
- 3 cards de plano em scroll vertical (mobile prioriza altura)
- Card "atual" com ring teal e label
- Card recomendado (Pro) com badge "Recomendado" violeta
- Lista de features com check verde / X cinza
- CTA grande sticky no final (gradient teal→sky pra Plus, violeta→sky pra Pro)
- Faq seção embaixo com 3-4 perguntas comuns
- Logo Stripe no rodapé pra confiança

## Configuration
- shell: true
