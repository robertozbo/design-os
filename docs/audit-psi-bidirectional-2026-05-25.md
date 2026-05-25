# Auditoria Bidirecional — Profissional Psicólogo

**Data**: 2026-05-25
**Escopo**: `design-os/src/sections-psicologo/` (protótipo) ⇄ `frontend/(professional)/professional/psychology/` (live impl)
**Método**: agent `Explore` cruzou componentes prototype vs rotas live, em ambas direções

**Legendas** (idem Personal): `✓` fiel · `~` parcial · `✗` sem impl · `≠` diverge · `—` N/A · `shared` re-export cross-vertical · `⚠ back-port` impl tem feature ausente do protótipo

---

## Tabela

| Section | Spec→Impl | Impl→Spec | Path impl | Notas |
|---|---|---|---|---|
| configuracoes | ✓ | ✓ | `psychology/configuracoes/` | Inclui `disponibilidade` como sub-rota |
| dashboard | ✓ | ✓ | `psychology/dashboard/` | Ambos consomem backend de stats |
| disponibilidade | ✗ | — | `psychology/configuracoes/disponibilidade/` | Protótipo top-level, live refatorou em sub-rota |
| instrumentos | ✓ | ✓ | `psychology/instrumentos/` | Estrutura fiel; lista APL com pacientes |
| pacientes | ✓ | ✓ | `psychology/pacientes/` | Live integra API patients + psychology |
| perfil | ✓ | shared | `psychology/perfil/` | Re-export `PerfilPage` (shared cross-vertical) |
| plano-terapeutico | ✓ | ✓ | `psychology/plano-terapeutico/` | Hub + modal novo plano no live |
| prontuario | ✓ | ✓ | `psychology/prontuario/` | Integra encaminhamentos + evoluções |
| sessao | ✓ | ✓ | `psychology/sessao/` | Editor SOAP/DAP + painel IA insights |
| sessoes-finalizadas | ✓ | ≠ | `psychology/sessoes/` | Rename: virou hub cross-patient |
| agenda | — | shared | `psychology/agenda/` | Reuso `AgendaWrapper` vertical-agnostic |
| conta | — | shared | `psychology/conta/` | Re-export `ContaPage` shared |
| convites | — | ⚠ back-port | `psychology/convites/` | Novo: paciente→app referrals (Plus) |
| notificacoes | — | ⚠ back-port | `psychology/notificacoes/` | Novo: módulo com labels psychology |
| upgrade | — | shared | `psychology/upgrade/` | Re-export `UpgradePage` shared |

---

## Resumo

- **Spec→Impl**: 9 ✓ / 1 ✗ (de 10 do protótipo) ≈ **90% implementadas com fidelidade**
- **Impl→Spec**: 5 rotas live ausentes do protótipo
  - 3 shared (agenda, conta, upgrade) — não precisam de protótipo dedicado
  - 2 ⚠ back-port verdadeiros (convites, notificacoes)

### Ações sugeridas

#### Renames / refatorações estruturais
1. **`disponibilidade`** — protótipo tem como section top-level, live moveu pra `configuracoes/disponibilidade/`. **Atualizar protótipo** pra refletir nova arquitetura.
2. **`sessoes-finalizadas → sessoes`** — protótipo era "sessões finalizadas", live virou hub cross-patient mais amplo. **Atualizar protótipo** com novo conceito.

#### Back-ports verdadeiros (criar no protótipo)
1. **`convites`** — feature de referrals paciente→app (Plus tier). Adicionar como section no protótipo psi.
2. **`notificacoes`** — módulo com labels psychology. Pode virar protótipo "shared" se quisermos pattern reutilizável entre verticais.

#### Não precisam de protótipo dedicado
- `agenda`, `conta`, `upgrade`, `perfil` — re-exports de componentes shared. Documentar no protótipo "psi consome shared X" basta.

---

## Comparação com Personal

| Métrica | Personal | Psi |
|---|---:|---:|
| Spec→Impl fidelidade | 86% (5/7 ✓) | **90%** (9/10 ✓) |
| Back-ports verdadeiros | 3 (agenda, bioimped, convites) | **2** (convites, notificacoes) |
| Shared re-exports | 4 | 3 |
| Renames identificados | 1 (`inicio→dashboard`) | **2** (`disponibilidade`, `sessoes-finalizadas`) |

> **Psi tracking melhor**: impl mais alinhada ao protótipo. Personal teve mais drift (agenda, bioimped não estavam previstos; aqui essas features são genuínas adições do Psi, não erros do protótipo).

### Padrão recorrente cross-vertical

Confirmado nas 2 verticais: `notificacoes`, `conta`, `upgrade` (e talvez `perfil`) são sempre shared re-exports. Recomendo criar uma section "**`shared-pages`**" no Design OS principal documentando esses componentes uma vez, e cada vertical aponta pra ela.

---

*Auditoria piloto vertical 2/4. Próximas: Mobile (25 sections) e/ou Clínico (12 sections).*
