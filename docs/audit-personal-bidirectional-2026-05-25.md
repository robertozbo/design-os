# Auditoria Bidirecional — Profissional Personal

**Data**: 2026-05-25
**Escopo**: `design-os/src/sections-personal/` (protótipo) ⇄ `frontend/(professional)/professional/personal/` (live impl)
**Método**: agent `Explore` cruzou componentes prototype vs rotas live, em ambas direções

**Legendas**:
- **Spec→Impl**: fidelidade do protótipo na implementação
  - `✓` impl fiel ao protótipo
  - `~` parcial (impl tem alguns aspectos mas não todos)
  - `✗` protótipo existe, impl não criada
  - `≠` diverge significativamente
  - `—` N/A (section só no impl, sem protótipo)
- **Impl→Spec**: presença reversa (drift do impl não refletido no protótipo)
  - `✓` impl reflete spec sem extras
  - `≠` impl tem extras menores não no protótipo
  - `⚠ back-port` impl tem feature inteira que não existe no protótipo (drift maior)
  - `—` N/A

---

## Tabela

| Section | Spec→Impl | Impl→Spec | Path impl | Notas |
|---|---|---|---|---|
| alunos | ✓ | ≠ | `personal/alunos/` | Impl reflete protótipo; ficha detalhada em `[id]/` |
| avaliacoes | ✓ | ≠ | `personal/avaliacoes/` | Impl cross-aluno c/ cards; detalhe vive em `alunos/[id]` |
| configuracoes | ~ | ≠ | `personal/configuracoes/` | Protótipo: painéis unificados; impl: 7 subrotas (calendario, equipe…) |
| exercicios | ✓ | ≠ | `personal/exercicios/` | Biblioteca; edit/delete via toast "em breve" |
| treinos | ✓ | ≠ | `personal/treinos/` | Prescrição de planos; tabs vazias até endpoint cross-paciente |
| indicacoes | ✗ | — | — | **Gap**: protótipo só; convite de alunos ainda em prep |
| inicio | — | ⚠ back-port | `personal/dashboard/` | Renomeado pra `dashboard`; reusa DashboardNutri c/ labels personal |
| agenda | — | ⚠ back-port | `personal/agenda/` | Nova; reusa AgendaWrapper vertical-agnostic + labels |
| bioimpedancia | — | ⚠ back-port | `personal/bioimpedancia/` | Novo fluxo cross-aluno; aluno picker → upload modal |
| conta | — | ⚠ back-port | `personal/conta/` | Shared page; re-exporta `configuracoes/ContaPage` |
| convites | — | ⚠ back-port | `personal/convites/` | Novo; `ConvitesList + NovoConviteDrawer` (seed data) |
| notificacoes | — | ⚠ back-port | `personal/notificacoes/` | Shared page; re-exporta `NotificacoesPage` |
| perfil | — | ⚠ back-port | `personal/perfil/` | Shared page; re-exporta `configuracoes/PerfilPage` |
| upgrade | — | ⚠ back-port | `personal/upgrade/` | Shared page; re-exporta `UpgradePage` |

---

## Resumo

- **Spec→Impl**: 5 ✓ / 1 ~ / 1 ✗ (de 7 do protótipo) ≈ **86% implementadas com fidelidade**
- **Impl→Spec**: **8 rotas live ausentes no protótipo** (1 renomeada + 7 back-ports)

### Ações sugeridas

#### Gap (spec→impl)
1. **`indicacoes`** — criar rota live (convite de alunos B2C). Decisão: implementar ou descontinuar do protótipo?

#### Back-ports (impl→spec)
Maioria são páginas **shared** entre verticais (notificacoes/conta/perfil/upgrade re-exportam). Não precisam de protótipo dedicado por vertical — basta documentar no protótipo personal que "essas rotas usam o componente shared X".

**Realmente novos** (precisam virar section no protótipo):
- `personal/agenda/` — vertical-agnostic com labels override; vale ter no protótipo
- `personal/bioimpedancia/` — fluxo cross-aluno novo; protótipo só tem `avaliacoes`
- `personal/convites/` — fluxo de convite de alunos (provavelmente é o `indicacoes` renomeado/reorganizado)
- `personal/dashboard/` — rename `inicio → dashboard`; só atualizar nome no protótipo

#### Verificar
- `personal/convites/` vs `indicacoes` do protótipo — pode ser o mesmo conceito reformulado
- `personal/exercicios/` — edit/delete via "em breve": spec deve refletir esse estado?

---

## Insights pra rodar nas outras verticais

1. **Pré-mapear "shared pages"** antes de classificar como back-port. Padrão Nymos: notificacoes/conta/perfil/upgrade são shared cross-vertical. Não precisam de protótipo por vertical.
2. **Rename detection**: `inicio → dashboard` é comum. Vale ter uma coluna de aliases conhecidos.
3. **Cross-cutting features**: agenda, bioimpedancia são vertical-agnostic (reusam AgendaWrapper, etc.). Decidir se viram protótipo "shared" ou se cada vertical tem o seu.
4. **Diferenças estruturais (≠)**: o ≠ marca casos onde impl tem **tabs/subrotas** que o protótipo não previa. Isso é normal e esperado (evolução depois do export) — não é erro, é registro de drift.

---

*Auditoria piloto. Aplicar mesmo método pras outras verticais (Psi, Mobile, Clínico) se calibração for considerada útil.*
