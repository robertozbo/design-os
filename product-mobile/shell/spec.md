# Shell Specification — App Paciente Nymos

## Overview

Chrome persistente do app: **status bar do sistema + header + bottom tab bar + FAB de IA**. Acompanha todas as telas de feature. Dark-first, alinhado à paleta teal Nymos.

## Estrutura visual

```
┌──────────────────────────────────┐
│  STATUS BAR (sistema)            │  ~44px
├──────────────────────────────────┤
│  HEADER                          │  ~80px
│  [N]  Olá, Roberto    ⌚ 🔔 ⚙   │
├──────────────────────────────────┤
│                                  │
│  CONTEÚDO DA SECTION             │  scroll
│                                  │
├──────────────────────────────────┤
│                          (FAB)   │  ↗ flutuante acima da tab bar
│  ▼ ◎ ⌂ 📷 ⊞                     │
│ Métric Obj Iníc IA Mais          │  ~80px (com safe area)
└──────────────────────────────────┘
```

## Header

### Estrutura

- **Esquerda:** avatar quadrado `rounded-2xl` 44×44 com inicial do usuário OU logo Nymos "N" — fundo `teal-600`, letra `white` em DM Sans semibold
- **Centro-esquerda:** saudação contextual ("Olá, [PrimeiroNome]") em DM Sans semibold 22px + subtítulo opcional em `slate-400` 13px (ex: data atual ou status)
- **Direita:** três ações em ícones circulares 40×40:
  - ⌚ Wearable (atalho rápido sync HealthKit) — só aparece se conectado
  - 🔔 Notificações (badge contador no canto superior direito quando >0)
  - ⚙ Configurações

### Estados

- **Default:** sem badge nas notificações
- **Com notificações:** ponto `rose-500` (sem número) ou badge contador `rose-500` com número
- **Tela de detalhe / sub-rota:** header substitui logo por ícone `<` (back) + título da tela centralizado (ex: "Minha Saúde")

### Saudações dinâmicas

- 5h–11h: "Bom dia, [Nome]"
- 12h–17h: "Boa tarde, [Nome]"
- 18h–4h: "Boa noite, [Nome]"

## Bottom tab bar

### 5 abas (ordem fixa)

| Posição | Ícone | Label | Rota |
|---------|-------|-------|------|
| 1 | `Activity` (lucide) | Métricas | `/metricas` |
| 2 | `Target` | Objetivos | `/objetivos` |
| 3 | `Home` | Início | `/inicio` (default) |
| 4 | `Camera` (com sparkle) | IA | `/ia` |
| 5 | `LayoutGrid` | Mais | `/mais` |

### Design

- Fundo: `slate-900` com border-top sutil `slate-800`
- Ícone ativo: `teal-400` + label `teal-400` semibold
- Ícone inativo: `slate-500` + label `slate-500`
- Aba "IA" (4ª) tem **accent permanente** `sky-400` ou gradiente `teal-400 → sky-400` mesmo quando inativa, pra sinalizar a feature de IA
- Touch target: 64×80, ícone 24×24 + label 11px
- Safe area inferior preservada (iOS notch)

### Comportamentos

- Tap = navega para a aba
- Tap na aba ativa = scroll-to-top da feature
- Long press na aba ativa = ação rápida da feature (ex: long press em Início abre quick action menu)

## FAB de IA (Floating Action Button)

Botão circular 56×56 fixo no canto inferior direito **acima da tab bar**, com ~16px de padding lateral e ~16px acima da tab bar.

- **Cor:** `teal-500` ou gradiente `teal-500 → sky-400`
- **Ícone:** robô / sparkle / chat (Lucide `Bot` ou `Sparkles`)
- **Sombra:** `shadow-2xl` com tinta `teal-500/40`
- **Estados:** scale 1.05 no press, animação subtle pulse a cada 8s pra atrair atenção quando há nova análise IA disponível
- **Tap:** abre IA (chat conversacional + atalho Análise de Saúde + Projeção Corporal)
- **Esconder:** quando teclado abrir ou em telas de IA propriamente

## Status bar (sistema)

- **Estilo:** light content (texto branco) sobre fundo dark
- Cor de fundo da status bar = mesma do header (`slate-950` ou `slate-900`)
- Não desenhamos a status bar — ela é nativa do iOS/Android

## Light mode (secundário)

Mesma estrutura, ajustes:
- Header / tab bar: `white` com border `slate-200`
- Ícone ativo: `teal-600`
- Ícone inativo: `slate-400`
- Texto: `slate-900` (primário) / `slate-500` (secundário)
- FAB mantém `teal-500` (alta legibilidade nos dois modos)

## Acessibilidade

- Touch target mínimo 44×44 em tudo
- Labels nas abas sempre visíveis (nunca só ícone)
- Contraste WCAG AA: ativo `teal-400` em `slate-900` = 7.2:1 ✅
- Badge de notificação tem `aria-label` "[N] notificações não lidas"
- Saudação tem nome do usuário, não só "Olá" (personalização melhora confiança)

## Configuration

- shell: true (este é o shell — wraps todas as features)
