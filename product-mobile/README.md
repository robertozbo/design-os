# Design OS Mobile — App Paciente Nymos

Estrutura paralela ao `design-os/` (web nutricionista) para **redesenhar visualmente** as features que o app mobile (Expo / React Native) já tem hoje.

## Objetivo

- Não refazer arquitetura, navegação ou lógica do app RN existente
- **Aplicar tema novo** (paleta unificada + DM Sans + IBM Plex Mono) nas features atuais
- Gerar specs portáteis (`spec.md`, `data.json`, `types.ts`, screenshots) que servem de **referência visual** pra retematizar o RN

## App de origem

- Repo: `/Users/roberto.zbo/Desktop/Projetos/Nymos/mobile`
- Stack: Expo 55 + RN 0.76 + React Navigation 7 + TanStack Query + `@parisgroup-ai/pageshell-native` + i18n 6 línguas
- ~85 telas em 20 features hoje

## Escopo MVP

11 features priorizadas (ver `product/product-roadmap.md`):

1. Início (Dashboard)
2. Métricas
3. Objetivos
4. IA (chat + análise)
5. Mais
6. Nutrição
7. Atividades
8. Treinos
9. Minha Saúde — agregador (composição corporal + biomarcadores + bioimpedância + fotos)
10. Análise de Saúde — IA gera snapshot Ótimo/Atenção/Risco + histórico
11. **Projeção Corporal** — feature-âncora: upload guiado de fotos + bioimpedância + análise IA + idade visual estimada + projeção Nano Banana + comparativo

## Estrutura

```
design-os-mobile/
├── README.md                  # este arquivo
└── product/
    ├── product-overview.md    # resumo do app e estratégia de retematização
    ├── product-roadmap.md     # 11 features MVP em ordem
    └── sections/
        └── [section-id]/
            ├── spec.md
            ├── prd-*.md       # PRDs de sub-fluxos (ex: minha-saude/prd-projecao.md)
            ├── api-contract.md # contrato com backend Nymos (quando aplicável)
            ├── data.json
            └── types.ts
```

## Próximos passos

1. Saved: `product/sections/minha-saude/prd-projecao.md` (sub-fluxo de Projeção Corporal — alinhado ao backend Nymos)
2. Pending: screenshots por feature, validação de paridade `src/sections-mobile/*` ↔ backend Nymos
3. Depois: retematização gradual do RN em cima das telas existentes
