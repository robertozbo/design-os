# Handoff · Migração da section Treinos (app mobile)

> Pacote de entrega pro agente realizar a migração da section `treinos` no app mobile real, alinhando com o protótipo atualizado no Design OS.

## Contexto

Hoje no app de produção, a section **Treinos** mostra dados de mock antigos (plano "Hipertrofia ABC" com 5+ exercícios por sessão, vocabulário próprio) que **não casam com o que o Personal prescreve** no painel web. O loop "Personal cria → aluno recebe → aluno executa → Personal vê adesão" está quebrado porque:

1. App mostra um treino diferente do que foi prescrito
2. Não há indicação de **quem é o Personal** que prescreveu o plano
3. Não há separação entre **treinos do Personal** e **treinos próprios do aluno**
4. Plano semanal não é visível como agenda

O novo protótipo no Design OS resolve esses gaps e está MVP-ready.

## Objetivos da migração

1. **Alinhar contrato** — usar os mesmos tipos e shape de dados do `product-mobile/sections/treinos/types.ts` como source of truth
2. **Reproduzir UI do protótipo** — tabs, hero com referência ao Personal, agenda semanal, sessões compactas
3. **Manter o modo execução** — o flow set-by-set já existe e está validado, não precisa redesenhar
4. **Corrigir bugs visuais** — ícone engrenagem flutuante, header "TREINO 02"

## Escopo

### ✅ Em escopo
- Reescrita da tela principal de `treinos` no app mobile
- Adição de tabs "Meu Personal" / "Meus treinos"
- Hero card com referência ao Personal vinculado
- Bloco "Plano semanal" como agenda dia-a-dia
- Lista compacta de "Sessões do plano"
- Mostrar prescrição **exatamente como vinda do backend** (sem mocks)
- Correção do bug "ícone engrenagem flutuante"
- Renomear/remover "TREINO 02" do header da tela de detalhe do treino

### ❌ Fora de escopo (V2+)
- Captura editável de `repsReal` e `loadRealKg` por série (hoje defaultam pro prescrito — OK pra MVP)
- Reintrodução de RPE (foi removido a pedido do profissional)
- Observação por treino (não-urgente)
- Heatmap mensal de adesão
- Section órfã `mental-health` (cleanup é outro PR)

## Premissa crítica

**O backend já está pronto.** Este handoff é puramente **frontend mobile**. Antes de implementar qualquer coisa nova, o agente DEVE **limpar o código visual atual** (mocks, hacks, vocabulário inconsistente) — ver `migration-sequence.md` Fase 0.

## Estrutura do pacote

```
docs/handoff/treinos-migration/
├── README.md                ← este arquivo
├── migration-sequence.md    ← ordem obrigatória (Fase 0 limpeza → 3 validação)
├── target-state.md          ← descrição completa do estado-alvo
├── reference-files.md       ← arquivos canônicos no Design OS
├── acceptance-criteria.md   ← checklist do "done"
├── diff-summary.md          ← antes/depois lado-a-lado
└── screenshots/
    ├── 01-tab-meu-personal-topo.png
    ├── 02-tab-meus-treinos.png
    ├── 03-execucao-serie.png
    ├── 04-execucao-descanso.png
    └── 05-execucao-finalizar.png
```

## Como o agente deve usar este pacote

1. Ler `migration-sequence.md` **primeiro** — entender que limpeza vem antes de implementação
2. Executar Fase 0 (limpeza) e commitar antes de seguir
3. Ler `target-state.md` pra entender **o quê** construir
4. Abrir os arquivos listados em `reference-files.md` pra entender **como** construir (são source of truth)
5. Validar progresso contra `acceptance-criteria.md`
6. Usar os screenshots como **referência visual final** — o app deve parecer com esses prints

## Ambiente

- App em React Native (presumido — confirmar antes de codar)
- Design OS roda como referência visual em `http://localhost:3000/mobile/sections/treinos`
- Não é necessário pull do Design OS — todos os arquivos canônicos estão referenciados no `reference-files.md`

## Quem prescreve este plano

O sample data foi modelado pra refletir um caso real:

- **Personal**: Rafa Costa (CREF 67890)
- **Plano**: ABC · Peito · Costas · Cardio (3 sessões · 1 exercício cada)
- **Treino A**: Crossover alto · 3 séries × 10 reps · 33kg · 120s descanso
- **Treino B**: Barra fixa assistida · 3×10 · 32.5kg · 120s
- **Treino C**: Afundo com salto · 3×10 · 33kg · 120s
- **Agenda**: Seg=A, Ter=B, Qua=A, Qui=B, Sex=C, Sáb/Dom=descanso
