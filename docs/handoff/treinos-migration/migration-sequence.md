# Sequência de migração

> Ordem obrigatória das fases. **Não pular etapas** — limpeza vem antes da implementação pra evitar mistura de código velho com novo.

## ⚠️ Premissa importante

**O backend já está pronto.** Esse handoff é puramente **frontend mobile**. O agente NÃO deve mexer em:
- Endpoints
- Schemas do DB
- Migrations
- API contracts

Se algum campo "novo" parecer faltar no backend, **pausar e perguntar** — provavelmente o nome já existe com outro shape, é só mapear.

---

## Fase 0 · Limpeza (antes de qualquer código novo)

Antes de implementar qualquer coisa, **remover** o seguinte da section `treinos` no app mobile real:

### Componentes a deletar/limpar
- [ ] Qualquer mock hardcoded de plano (ex: "Hipertrofia ABC", exercícios inventados que não vêm do backend)
- [ ] Header com "TREINO 02" (ou identificador interno equivalente) confuso
- [ ] Ícone engrenagem flutuante sobreposto nas telas (bug visual)
- [ ] Stats que não vêm do contrato oficial (`TreinosStats`)
- [ ] Vocabulário inconsistente (ex: "Sessão" misturado com "Treino", "Set" com "Série")

### Estado/lógica a remover
- [ ] Cálculos client-side que **devem** vir do backend (verificar via `TreinosData` no Design OS)
- [ ] Workarounds/hacks que existem só pra fazer o mock funcionar
- [ ] Imports não usados

### Asserção de saída da Fase 0
Ao final da limpeza, a tela `Treinos` deve estar **vazia ou com placeholder** — sem mocks, sem dados estáticos. Isso garante que tudo o que aparece daqui pra frente veio de dado real ou do novo design.

**Commit da Fase 0**: `chore(treinos): remove legacy mock data and visual artifacts`

---

## Fase 1 · Estrutura de dados e contratos

- [ ] Comparar tipos do app real com `product-mobile/sections/treinos/types.ts` (Design OS)
- [ ] Identificar deltas (campos novos: `abaAtiva`, `agendaSemanal`, `treinosProprios`)
- [ ] Atualizar tipos/interfaces do app pra refletir o contrato canônico
- [ ] Verificar que o backend já responde com a shape esperada (provavelmente sim, conforme premissa)
- [ ] Se houver gap, mapear no client (não no backend)

**Commit da Fase 1**: `refactor(treinos): align types with canonical contract`

---

## Fase 2 · Implementação visual

Ordem sugerida (dependências):

1. [ ] **Tabs** "Meu Personal" / "Meus treinos" no topo
2. [ ] **HeroTreinoHoje** com referência ao Personal
3. [ ] **StatsStrip** alinhado com `TreinosStats`
4. [ ] **AgendaSemanal** (novo bloco — agenda dia-a-dia)
5. [ ] **SessoesList** compacta
6. [ ] **HistoricoSection** (manter funcionalidade existente, atualizar visual se necessário)
7. [ ] **MeusTreinosTab** content

Pra cada componente, **abrir o equivalente no Design OS** como referência visual (paths em `reference-files.md`).

**Commits da Fase 2** (um por componente):
- `feat(treinos): add tabs Meu Personal / Meus treinos`
- `feat(treinos): hero card with personal reference`
- `feat(treinos): weekly agenda block`
- etc.

---

## Fase 3 · Validação

- [ ] Rodar a tela `Treinos` no app real e comparar com os screenshots em `screenshots/`
- [ ] Validar contra `acceptance-criteria.md` linha-por-linha
- [ ] Testar com plano vinculado (happy path)
- [ ] Testar com plano não-vinculado (empty state)
- [ ] Testar modo execução completo (3 séries × 1 exercício × 3 treinos)
- [ ] Verificar que dados do backend chegam corretamente sem mocks

**Commit final**: `chore(treinos): complete migration to new prototype`

---

## Recomendações para o agente

- Trabalhar em PR único OU sequência de PRs pequenos por fase — preferência do time
- Não introduzir nada fora do `acceptance-criteria.md`
- Se encontrar regressões em outras sections (ex: navegação), pausar e reportar — não corrigir no mesmo PR
- Screenshots do Design OS são **referência visual** — pequenas diferenças (espaçamento, sombras) são aceitáveis. Estrutura e hierarquia devem casar
- Se o backend NÃO estiver pronto pra algum campo: **pausar e reportar**, não implementar workaround
