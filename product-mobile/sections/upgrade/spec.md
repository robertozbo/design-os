# Upgrade Specification

## Overview
Tela de checkout do upgrade Stripe — formulário de cartão (número, validade, CVV, nome), CPF, email pra recibo, e CTA "Pagar". Diferente da page Plano (que é gestão da assinatura), Upgrade é focada em **converter** o usuário no momento da decisão de pagar.

## User Flows

### Entrada na tela
- Vem de:
  - Banner "Upgrade pra Pro" no Mais
  - Banner expirado/pendente na page Plano
  - Click "Assinar" num card de plano em /plano
  - Gate de feature locked (ex: tentando usar IA sendo Free)

### Preencher dados do cartão
- Número (auto-format + detecção de bandeira em tempo real)
- Validade MM/AA + CVV lado a lado
- Nome no cartão (auto-uppercase)
- CPF (necessário pra emissão de NF)
- Email (read-only do user)
- Aceite de termos + autorização de cobrança recorrente

### Submit
- Validação client-side antes de habilitar botão
- Backend `POST /payment/stripe/subscription` retorna `clientSecret`
- Stripe.js tokeniza cartão (raw data nunca toca nosso servidor)
- `confirmCardPayment(clientSecret)` confirma
- Webhook `customer.subscription.updated` sincroniza userPlans

### Estados pós-submit
- **Processando** — animação pulse "Confirmando com seu banco..."
- **Sucesso** — Check verde + "Bem-vindo ao Pro!" + recibo + CTA "Começar a usar"
- **Erro** — Banner rose "Pagamento não autorizado · Cartão recusado pelo banco"

## UI Requirements
- Header com X fechar + breadcrumb + chip SSL emerald
- Card de resumo do pedido (gradient teal) com plano + ciclo + total grande
- Card de dados do cartão com brand chips no header (VISA · MC · ELO · AMEX)
- Footer trust: "🛡 Pagamento processado pela Stripe · Seus dados nunca passam pelos nossos servidores"
- CTA principal sticky no rodapé "🔒 Pagar R$ XX,XX"

## Configuration
- shell: false (fullscreen, sem header/tab bar)
