# Plano Expirado Specification

## Overview
Tela fullscreen exibida no login quando o usuário tem `userPlans.status === 'expired'` ou `'past_due'` há mais de 0 dias e ainda não viu o aviso. Mostra mensagem amigável de boas-vindas, lista o que ele perdeu acesso, e oferece 2 CTAs: renovar agora ou continuar com Free (downgrade).

## User Flows

### Detecção
- App splash → checa userPlans.status
- Se expired/past_due/cancelled (sem `cancel_at_period_end`) → roteia pra esta tela
- Caso contrário → /inicio

### Ações
- **Renovar plano** → navega pra /upgrade (CheckoutSheet pre-selecionado com tier anterior)
- **Continuar com Free** → set tier=free no backend + navega pra /inicio (com cadeado nas features Pro)
- **Voltar/fechar** → bloqueado (essa tela é gate, não dispensável). Se usuário tentar dispensar via gesture, não fecha.

### Pós-decisão
- Se renovou: webhook reativa subscription, próximo login não mostra essa tela.
- Se continuou Free: app marca uma flag `lastExpiredScreenSeenAt` pra não mostrar de novo na próxima sessão.

## UI Requirements
- Fullscreen com gradient sutil rose→slate de fundo
- Avatar + "Bem-vindo de volta, [primeiro nome]"
- Card central destacado com:
  - Ícone alerta rose
  - "Seu plano [Tier] expirou em DD/MM/YYYY"
  - Subtítulo curto explicando situação
  - Lista "Você perdeu acesso a:" com 3-4 chips de features Pro
- 2 CTAs grandes empilhados:
  - **Renovar [Tier] por R$ XX,XX/mês** (gradient teal→sky, primário)
  - **Continuar com Free** (outline, secundário)
- Footer: "Você sempre pode renovar depois nas configurações"

## Configuration
- shell: false (fullscreen, sem header/tab bar)
