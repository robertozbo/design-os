# Auditoria Bidirecional — Mobile (React Native)

**Data**: 2026-05-25
**Escopo**: `design-os/src/sections-mobile/` (protótipo, PT-BR) ⇄ `mobile/src/screens/` (live RN, EN)
**Método**: agent `Explore` cruzou componentes prototype vs screens live, em ambas direções

**Legendas** (idem outras verticais): `✓` fiel · `~` parcial · `✗` sem impl standalone · `≠` diverge · `—` N/A · `shared` re-export · `⚠ back-port` impl tem feature ausente do protótipo

**Padrão**: mobile traduziu PT→EN nos nomes de rota (atividades→activities, etc.) e consolidou várias telas relacionadas em pastas únicas (login+signup+welcome+recuperar-senha → auth/).

---

## Tabela

| Section (proto/live) | Spec→Impl | Impl→Spec | Path | Notas |
|---|---|---|---|---|
| atividades / activities | ✓ | ✓ | `screens/activities/` | Rename PT→EN |
| chat-ia / ia | ≠ | ✓ | `screens/ia/` | Proto: wrapper ChatIAFullscreen; live: unificado em `ia` |
| configuracoes / settings | ✓ | ✓ | `screens/settings/` | Rename; live estendeu com MyPlan + UpgradePlans |
| dispositivos / devices | ✓ | ✓ | `screens/devices/` | Rename |
| ia / ia | ✓ | ✓ | `screens/ia/` | Equivalente funcionalmente |
| inicio / dashboard | ✓ | ✓ | `screens/dashboard/` | Rename; live expandiu com tabs |
| login / auth | ✓ | ✓ | `screens/auth/` | Consolidação: login+signup+reset → auth |
| mais / more | ✓ | ✓ | `screens/more/` | Rename |
| medicacao / medication | ✓ | ✓ | `screens/medication/` | Rename |
| metricas / metrics | ✓ | ✓ | `screens/metrics/` | Rename |
| minha-saude / minha-saude | ✓ | ✓ | `screens/minha-saude/` | Mantém PT; live expandido c/ múltiplas screens |
| nutricao / nutrition | ✓ | ✓ | `screens/nutrition/` | Rename |
| objetivos / goals | ✓ | ✓ | `screens/goals/` | Rename |
| onboarding / onboarding | ✓ | ✓ | `screens/onboarding/` | Live unificou com onboarding-completo + welcome |
| onboarding-completo / — | ✓ | — | — | Consolidado em `onboarding/` live |
| perfil / profile | ✓ | ✓ | `screens/profile/` | Rename |
| plano / — | ✗ | — | — | Sem rota standalone; talvez integrado em settings/upgrade |
| plano-expirado / — | ✗ | — | — | Cenário sem rota dedicada |
| profissionais / professionals | ✓ | ✓ | `screens/professionals/` | Rename |
| recuperar-senha / — | ✓ | — | — | Integrado em `auth/ForgotPasswordScreen` |
| saude-mental / saude-mental | ✓ | ✓ | `screens/saude-mental/` | Mantém PT em ambos |
| signup / — | ✓ | — | — | Integrado em `auth/RegisterScreen` |
| treinos / workouts | ✓ | ✓ | `screens/workouts/` | Rename |
| upgrade / — | ✗ | — | — | Integrado em `settings/UpgradePlansScreen` |
| welcome / — | ✓ | — | — | Integrado em `onboarding/SplashScreen` |
| — / body-evaluations | — | ⚠ back-port | `screens/body-evaluations/` | Bioimpedância + fotos corporais — **ausente do protótipo** |
| — / challenges | — | ⚠ back-port | `screens/challenges/` | Desafios gamificados — **novo** |
| — / exams | — | ⚠ back-port | `screens/exams/` | Exames laboratoriais — **ausente do protótipo (importante!)** |
| — / insights | — | ⚠ back-port | `screens/insights/` | Análises inteligentes — **novo** |
| — / notifications | — | ⚠ back-port | `screens/notifications/` | Gerenciador de notificações — **novo** |

---

## Resumo

- **Spec→Impl**: 16 ✓ / 1 ≠ / 3 ✗ / 4 ✓-consolidados (de 24 do protótipo)
  - 16 sections totalmente fiéis (com rename PT→EN)
  - 4 sections consolidadas com sucesso (onboarding-completo, recuperar-senha, signup, welcome → auth/onboarding)
  - 3 ✗ verdadeiros: `plano`, `plano-expirado`, `upgrade` (integradas em outras rotas, mas protótipo as previa standalone)
  - 1 ≠: `chat-ia` vs `ia` (refatoração de IA)
- **Impl→Spec**: **5 back-ports verdadeiros** — features inteiras que não estão no protótipo

### Decisões a tomar

#### Renames PT→EN — atualizar protótipo?
13 sections com nomes PT no protótipo viraram EN no live. Decisão: o protótipo Design OS adota EN (alinha com código) ou mantém PT (DX de design)?

Memória diz: "naming canônico PT-BR" pra paciente. Então **manter PT no protótipo** e marcar os renames como "decisão de implementação" — não exigir mudança no protótipo. ✅

#### Consolidações — atualizar protótipo
Refletir no protótipo que estas sections são tela única, não múltiplas:
1. **`auth`** = login + signup + recuperar-senha + welcome (4 telas viraram 1 fluxo)
2. **`onboarding`** = onboarding + onboarding-completo (2→1)

#### Sections proto-only — decidir
1. **`plano` / `plano-expirado` / `upgrade`** — protótipo previa screens standalone, live consolidou em `settings/UpgradePlansScreen`. Atualizar protótipo pra refletir consolidação OU manter standalone como referência de UX (3 contextos diferentes).

#### Back-ports verdadeiros (criar no protótipo)
Por prioridade:
1. **`exams`** 🚨 — exames laboratoriais é feature CORE do paciente, ausente do protótipo é grave. Criar section.
2. **`body-evaluations`** — bioimped + fotos corporais. Cross-vertical (existe em Personal também).
3. **`insights`** — análises IA. Pode ser parte de `ia` ou section separada.
4. **`notifications`** — gerenciador. Pattern shared cross-vertical.
5. **`challenges`** — gamificação. Feature mais nova, talvez ainda em validação.

---

## Comparação com outras verticais

| Métrica | Personal | Psi | Mobile |
|---|---:|---:|---:|
| Sections no protótipo | 7 | 10 | 24 |
| Spec→Impl fidelidade | 86% | 90% | **83%** (16/24 ✓) — mais consolidações |
| Back-ports verdadeiros | 3 | 2 | **5** |
| Shared re-exports | 4 | 3 | 0 (mobile não usa pattern) |
| Renames | 1 | 2 | **13** (PT→EN) |

**Observações Mobile**:
- Mais drift na nomeação (PT→EN sistemático)
- Mais back-ports verdadeiros (5) — protótipo mobile ficou para trás em features importantes (exams!)
- Sem pattern de "shared pages" — cada screen é própria

---

## Próximos passos cross-vertical

Após Personal + Psi + Mobile auditados, **3 padrões consistentes**:

1. **Cada vertical adiciona ~2-5 features depois do protótipo** — drift é inerente, não é problema
2. **Shared pages cross-vertical** (notificacoes, conta, perfil, upgrade) — criar section única no Design OS
3. **Mobile precisa de update mais profundo no protótipo** — `exams`, `body-evaluations`, `insights` são features importantes ausentes

Sugestão de ação: focar em **atualizar o protótipo mobile** com as 5 back-ports prioritárias antes de seguir auditando outras verticais (Nutri, SST, Paciente Web).

---

*Auditoria piloto vertical 3/4. Pendente: Clínico (12 sections sem impl live — audit não-bidirecional) e/ou retomar Nutri/SST/Paciente Web com a metodologia bidirecional.*
