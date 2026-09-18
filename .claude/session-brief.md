# Session Brief — 2026-09-18

## Última sessão
Commitei e subi tudo que estava solto no design-os (9 commits) e fechei o fix que
faltava no PR #1122 do Nymos. A main do Nymos ficou vermelha por causas alheias a esse PR.

## Estado
- design-os: `main` = `d906047`, sincronizada. Fora do git (de propósito): `.mcp.json`,
  `docs/modelo-monetizacao.md`, `docs/parity-plano-upgrade.md`, `pnpm-lock.yaml`, `product-plan/`.
- Nymos: `main` sincronizada; `feat/marketing-module` = `7ce85f908` (PR #1122, F1+F2).

## Decisões desta sessão (não reabrir)
- `ModuloKeyAdmin` deriva de `ModuloKey` — a união literal duplicada foi o que quebrou o CI
  quando `marketing` entrou em `ADDON_KEYS`.
- Os commits do design-os foram agrupados por section, não por tipo de arquivo.

## Aberto (tasks criadas)
- BUG-057: `clinic-paciente-ficha.test.tsx` renderiza sem provider tRPC — 14 testes vermelhos.
- BUG-058: ratchets de lint e type-debt subiram na main.
- BUG-059: coverage abaixo do piso (clinic backend e mobile).

## Próximo passo
BUG-057 primeiro — é ele que derruba dois jobs de uma vez.
