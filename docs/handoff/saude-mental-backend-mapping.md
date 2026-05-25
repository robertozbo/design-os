# Saúde Mental — Backend Schema + Routes Mapping

**Status:** draft pra revisão · Design OS handoff doc · 2026-05-20
**Surfaces:** Mobile (paciente) · Web (paciente) · Backend · Profissional (psicólogo web)
**Premissas:**
- Mobile prototype já portado (commits `86e9c5bbb` + `446c26c3a` + `d144b782a` + `5a662879e`).
- Backend Nymos hoje só tem: flag `professional_patient_scopes.saude_mental` (permissão) + módulo `psychology_scores`/`psychology_plans` (questionários PHQ-9/GAD-7 do lado pro). **Zero infra** pra diário de humor ou chat 2-way.
- LGPD: diário fica visível só pro paciente até ele compartilhar explicitamente. Backend enforça via `saude_mental` scope.

---

## 1. Domínio

O fluxo tem 2 entidades de negócio + 2 entidades de infra:

| Entidade | Owner | Visível pra | Mutável por |
|---|---|---|---|
| **MoodEntry** (diário diário) | Paciente | Paciente sempre; psicólogo se entrada `compartilhada` E scope `saude_mental` ON | Paciente (CRUD) |
| **MoodEntryShare** (audit do "compartilhei") | Sistema | Paciente + psicólogo destinatário | Sistema (insert-only) |
| **MentalHealthChatThread** (1 por par paciente↔psicólogo) | Sistema | Ambos | Sistema (criada no aceite do escopo) |
| **MentalHealthChatMessage** | Autor da mensagem | Ambos do thread | Autor (insert-only; soft-delete por autor) |

PHQ-9/GAD-7 continuam em `psychology_scores` (lado profissional, sem espelho mobile salvo se psicólogo prescrever — fora deste escopo, ver memory `project_saude_mental_mobile_scope`).

---

## 2. Schema Drizzle

Arquivo proposto: `backend/src/schema/health/mental-health-schema.ts` (novo sub-schema dentro de `health/`).

### 2.1 `mood_entries`

```ts
export const moodEmocaoTomEnum = pgEnum('mood_emocao_tom', [
  'positivo', 'neutro', 'negativo',
]);

export const moodEntries = pgTable(
  'mood_entries',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    /** ISO date (YYYY-MM-DD). Uma entrada por dia por user — enforcement via uniq idx. */
    entryDate: date('entry_date').notNull(),

    /** Humor 1-10 */
    humor: integer('humor').notNull(),

    /** IDs canônicos do catálogo (texto livre — catálogo é seed/config, não FK) */
    emocaoIds: text('emocao_ids').array().notNull().default(sql`'{}'::text[]`),

    /** Energia 1-5 */
    energia: integer('energia').notNull(),

    /** Sono 1-5 */
    sono: integer('sono').notNull(),

    /** Nota livre (até 600 chars) */
    nota: text('nota').notNull().default(''),

    /** Defaults pro compartilhamento — explicado abaixo */
    compartilharComPsicologo: boolean('compartilhar_com_psicologo').notNull().default(false),

    submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    userDateUniq: uniqueIndex('mood_entries_user_date_uniq')
      .on(table.userId, table.entryDate)
      .where(sql`${table.deletedAt} IS NULL`),
    userDateIdx: index('mood_entries_user_date_idx').on(table.userId, table.entryDate),
    // CHECK constraints — não Drizzle-native mas Postgres aceita via raw
    humorRange: sql`CHECK (humor BETWEEN 1 AND 10)`,
    energiaRange: sql`CHECK (energia BETWEEN 1 AND 5)`,
    sonoRange: sql`CHECK (sono BETWEEN 1 AND 5)`,
  }),
);
```

**Notas:**
- `emocaoIds` é `text[]` (não FK) pra manter catálogo fora do DB. Catálogo vive em `i18n/mood-emocoes.ts` (config) — seed inicial: `calmo, feliz, grato, focado, esperancoso, neutro, cansado, indiferente, ansioso, estressado, triste, irritado, sobrecarregado, desmotivado`. Mudanças no catálogo não quebram entries antigos (chaves desconhecidas viram "?" no UI).
- Uniq index garante 1 entrada por dia por paciente. Editar = `UPDATE`, não novo `INSERT`.
- Soft delete via `deletedAt` consistente com outras tabelas Nymos.

### 2.2 `mood_entry_shares`

```ts
export const moodEntryShares = pgTable(
  'mood_entry_shares',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    moodEntryId: uuid('mood_entry_id')
      .notNull()
      .references(() => moodEntries.id, { onDelete: 'cascade' }),

    /** Psicólogo destinatário do snapshot */
    professionalId: uuid('professional_id')
      .notNull()
      .references(() => professionals.id, { onDelete: 'cascade' }),

    /** Snapshot imutável — não fica reativo às edições da entry */
    humorAtShare: integer('humor_at_share').notNull(),
    emocaoLabelsAtShare: text('emocao_labels_at_share').array().notNull(),
    notaPreviewAtShare: text('nota_preview_at_share').notNull().default(''),

    sharedAt: timestamp('shared_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    entryProfUniq: uniqueIndex('mood_entry_shares_entry_prof_uniq')
      .on(table.moodEntryId, table.professionalId),
    profIdx: index('mood_entry_shares_prof_idx').on(table.professionalId, table.sharedAt),
  }),
);
```

**Por que snapshot e não JOIN?**
- Diário pode ser editado depois do share — o que o psicólogo viu naquele momento permanece (auditoria + LGPD).
- A msg no chat (`type=diario_compartilhado`) referencia este share por id.

### 2.3 `mental_health_chat_threads`

```ts
export const mentalHealthChatThreads = pgTable(
  'mental_health_chat_threads',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    patientUserId: uuid('patient_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    professionalId: uuid('professional_id')
      .notNull()
      .references(() => professionals.id, { onDelete: 'cascade' }),

    /** Cache leve pra evitar JOIN no list */
    lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
    lastMessagePreview: text('last_message_preview'),

    /** Counters de não-lidas — atualizados via trigger ou app-side */
    unreadByPatient: integer('unread_by_patient').notNull().default(0),
    unreadByPsicologo: integer('unread_by_psicologo').notNull().default(0),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
  },
  (table) => ({
    pairUniq: uniqueIndex('mental_health_chat_threads_pair_uniq')
      .on(table.patientUserId, table.professionalId)
      .where(sql`${table.archivedAt} IS NULL`),
    patientIdx: index('mental_health_chat_threads_patient_idx').on(table.patientUserId),
    profIdx: index('mental_health_chat_threads_prof_idx').on(table.professionalId),
  }),
);
```

**Lifecycle:**
- Criada quando paciente aceita escopo `saude_mental` ON pra um psicólogo (trigger no aceite ou no primeiro POST de mensagem).
- Arquivada (não deletada) quando paciente desvincula psicólogo.

### 2.4 `mental_health_chat_messages`

```ts
export const mentalHealthChatAutorEnum = pgEnum('mental_health_chat_autor', [
  'paciente', 'psicologo', 'sistema',
]);

export const mentalHealthChatTipoEnum = pgEnum('mental_health_chat_tipo', [
  'texto', 'sistema', 'diario_compartilhado',
]);

export const mentalHealthChatMessages = pgTable(
  'mental_health_chat_messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    threadId: uuid('thread_id')
      .notNull()
      .references(() => mentalHealthChatThreads.id, { onDelete: 'cascade' }),

    autor: mentalHealthChatAutorEnum('autor').notNull(),
    tipo: mentalHealthChatTipoEnum('tipo').notNull().default('texto'),

    texto: text('texto').notNull(),

    /** Quando tipo=diario_compartilhado, referencia o share */
    moodEntryShareId: uuid('mood_entry_share_id').references(
      () => moodEntryShares.id,
      { onDelete: 'set null' },
    ),

    enviadaEm: timestamp('enviada_em', { withTimezone: true }).notNull().defaultNow(),
    lidaEm: timestamp('lida_em', { withTimezone: true }),
    deletadaEm: timestamp('deletada_em', { withTimezone: true }),
  },
  (table) => ({
    threadEnviadaIdx: index('mental_health_chat_messages_thread_enviada_idx')
      .on(table.threadId, table.enviadaEm),
  }),
);
```

**Notas:**
- `autor='sistema'` + `tipo='sistema'` pra mensagens automáticas ("Vocês começaram a conversar em 2 de maio").
- `autor='sistema'` + `tipo='diario_compartilhado'` pra cards de snapshot — `moodEntryShareId` aponta pro share.
- `deletadaEm` soft-delete pelo autor (psicólogo não pode deletar msg do paciente, e vice-versa).

---

## 3. Endpoints REST

Módulo proposto: `backend/api/modules/mental-health/` (paciente-side, paralelo a `nutrition/`, `metrics/`, etc).

### 3.1 Diário do paciente

| Método | Path | Body / Query | Resposta |
|---|---|---|---|
| `GET` | `/mood-entries?from=YYYY-MM-DD&to=YYYY-MM-DD` | range default = últimos 30 dias | `MoodEntry[]` |
| `GET` | `/mood-entries/today` | — | `MoodEntry | null` |
| `GET` | `/mood-entries/trends/7d` | — | `HumorSemana` (média atual, média anterior, delta, 7 pontos) |
| `GET` | `/mood-entries/trends/monthly` | `?month=YYYY-MM` | `TendenciaMensal` (média, direção, frase IA opcional) |
| `POST` | `/mood-entries` | `DiarioSubmission` | `MoodEntry` |
| `PATCH` | `/mood-entries/:id` | `Partial<DiarioSubmission>` | `MoodEntry` |
| `DELETE` | `/mood-entries/:id` | — | `204` (soft delete) |

**Body `DiarioSubmission`:**
```ts
{
  humor: 1..10,
  emocaoIds: string[],
  energia: 1..5,
  sono: 1..5,
  nota: string (max 600),
  compartilharComPsicologo: boolean,
}
```

**Side effect** ao criar/atualizar com `compartilharComPsicologo=true`:
1. Para cada profissional vinculado com scope `saude_mental=true`:
   - Cria `mood_entry_shares` (idempotente — `ON CONFLICT (entry, prof) DO NOTHING`)
   - Insere `mental_health_chat_messages` com `autor='sistema'`, `tipo='diario_compartilhado'`, `moodEntryShareId` apontando pro share
   - Atualiza thread `lastMessageAt` + `unreadByPsicologo++`
   - Emite WS event pro psicólogo (ver §5)

Permissão: paciente só vê/edita as próprias entradas. Profissional NUNCA toca via esses endpoints — endpoints separados em `psychology/`.

### 3.2 Chat — paciente side

| Método | Path | Body / Query | Resposta |
|---|---|---|---|
| `GET` | `/mental-health/threads/:professionalId` | — | `Thread` (cria thread se scope `saude_mental` ON e thread ainda não existe; 403 se scope OFF) |
| `GET` | `/mental-health/threads/:professionalId/messages?cursor=...&limit=50` | cursor pagination | `{ messages: Message[], nextCursor }` |
| `POST` | `/mental-health/threads/:professionalId/messages` | `{ texto: string }` | `Message` |
| `POST` | `/mental-health/threads/:professionalId/read` | — | `204` (zera `unreadByPatient`) |
| `DELETE` | `/mental-health/messages/:id` | — | `204` (só msgs próprias, soft delete) |

### 3.3 Chat — psicólogo side

Reusa o mesmo módulo `professional/psychology/`:

| Método | Path | Body / Query | Resposta |
|---|---|---|---|
| `GET` | `/professional/psychology/patients/:patientId/mental-health/thread` | — | `Thread` |
| `GET` | `/professional/psychology/patients/:patientId/mental-health/messages?cursor=...` | — | `{ messages, nextCursor }` |
| `POST` | `/professional/psychology/patients/:patientId/mental-health/messages` | `{ texto: string }` | `Message` |
| `POST` | `/professional/psychology/patients/:patientId/mental-health/read` | — | `204` (zera `unreadByPsicologo`) |
| `POST` | `/professional/psychology/patients/:patientId/mental-health/typing` | `{ on: boolean }` | `204` (broadcast efêmero — ver §5) |
| `GET` | `/professional/psychology/patients/:patientId/mental-health/shared-diaries?from&to` | — | `MoodEntrySnapshot[]` (entradas compartilhadas; nunca a entry crua, só o share snapshot) |

Permissão: `ProfessionalOwnershipGuard` + `requireScope('saude_mental')`.

### 3.4 Catálogo de emoções

| Método | Path | Resposta |
|---|---|---|
| `GET` | `/mental-health/emocoes-catalogo` | `EmocaoOption[]` (estático, cacheable) |

Catálogo vive em config + i18n. Endpoint só pra UI ter source-of-truth.

---

## 4. LGPD / Scope enforcement

Reusa o existente `professional_patient_scopes.saude_mental`:

| Operação | Guard |
|---|---|
| Paciente lê/escreve próprio diário | Sempre permitido (próprio user) |
| Paciente lê/posta chat com psi X | Scope `saude_mental` ON pra psi X |
| Psicólogo lê chat com paciente Y | Scope `saude_mental` ON pra Y + `requireScope('saude_mental')` middleware |
| Psicólogo lê shared diaries de paciente Y | Mesma regra acima |
| Paciente desliga scope `saude_mental` | Thread arquiva, msgs ficam no histórico do psi (já vistas), novas msgs bloqueadas |

**Crítico**: `mood_entries` cru NUNCA vai pro psicólogo — só via `mood_entry_shares` (snapshots imutáveis). Isso protege paciente de "psi vê tudo retroativo" quando ligar scope.

---

## 5. Realtime (WebSocket)

Backend Nymos já tem alguma infra WS? **Verificar antes de propor**. Se não, MVP pode usar polling:

- Mobile: pull `/threads/:id/messages?cursor=last` a cada 10s quando aba Chat ativa.
- Web: idem.

Evolução: WS com canais `mental-health:thread:{threadId}` emitindo:
- `message.new` (msg nova)
- `message.read` (read receipt)
- `typing.on` / `typing.off`

Padrão recomendado: reusar canal existente do app se houver (`notifications` channel já existe, mas é one-way).

---

## 6. Mapeamento por superfície

### 6.1 Mobile (paciente) — `~/Desktop/Projetos/Nymos/mobile/`

**Já implementado** (commits `86e9c5bbb` + `446c26c3a` + `d144b782a` + `5a662879e`):
- `screens/saude-mental/` com Diário + Chat completos
- `hooks/saude-mental/use-mood-mock.ts` — mock atual

**Migração pra backend real:**

| Hook mock | Hook real |
|---|---|
| `useMoodMock()` (retorna tudo junto) | Quebrar em: |
| | `useTodayMood()` → `GET /mood-entries/today` |
| | `useMoodTrends7d()` → `GET /mood-entries/trends/7d` |
| | `useMoodTrendsMonthly()` → `GET /mood-entries/trends/monthly` |
| | `useMoodHistorico({ limit: 5 })` → `GET /mood-entries?from&to&limit` |
| | `useSubmitMood()` → `POST /mood-entries` (mutation) |
| | `useMentalHealthThread()` → `GET /mental-health/threads/:profId` |
| | `useMentalHealthMessages(threadId)` → `GET /threads/:id/messages` + infinite scroll |
| | `useSendMessage()` → `POST /threads/:id/messages` (mutation com optimistic) |

Service: `mobile/src/services/mental-health.service.ts` (novo).

### 6.2 Web (paciente) — `~/Desktop/Projetos/Nymos/frontend/src/app/(patient)/`

**Não implementado**. Espelho do mobile (sincronia total per memória).

**Rota proposta**: `app/(patient)/saude-mental/page.tsx`

Layout segue padrão do `my-health/` (full-page com tabs internas).
- Componentes em `components/modules/saude-mental/` (espelham `screens/saude-mental/` do mobile)
- Mesmas hooks de TanStack Query (`useTodayMood`, etc) — frontend já consome mesma API
- Catálogo de emoções e shape de tipos importados de `mobile/src/screens/saude-mental/types.ts` (ou movidos pra `packages/shared-types` se houver)

Entry point no frontend: link no `(patient)/dashboard` igual ao quick-action do mobile.

### 6.3 Backend — `~/Desktop/Projetos/Nymos/backend/`

**Novo módulo `mental-health/`** paralelo a `nutrition/`, `metrics/`:

```
backend/api/modules/mental-health/
├── index.ts
├── routes.ts                       # rotas paciente-side
├── types.ts                        # zod schemas
├── services/
│   ├── MoodEntryService.ts         # CRUD mood entries
│   ├── MoodTrendService.ts         # agregações 7d / mensal
│   ├── MoodShareService.ts         # criação de shares + fanout pro chat
│   └── MentalHealthChatService.ts  # threads + messages
└── __tests__/
    └── routes.test.ts
```

**Schema novo**: `backend/src/schema/health/mental-health-schema.ts` registrado em `src/schema/index.ts`.

**Migração Drizzle**: `backend/drizzle/01XX_mental_health.sql` (próximo número disponível — atual cap é 0135).

**Profissional side**: adicionar endpoints em `api/modules/professional/psychology/routes.ts` (reusa orchestrator existente).

### 6.4 Profissional (psicólogo) — `~/Desktop/Projetos/Nymos/frontend/src/app/(professional)/professional/psychology/`

Página de paciente do psicólogo (`patients/[id]`) ganha card/aba **"Diário emocional"**:
- Mostra entradas compartilhadas (do `mood_entry_shares`) em ordem desc.
- Cada card mostra snapshot imutável: humor + emoções + nota preview + timestamp.
- Tap abre o detail expandido (toda nota + energia/sono).
- Side panel ou aba dedicada com **chat** (mesma UX da mobile, mas em desktop layout).
- Indicador de novas mensagens (badge no nav lateral do psicólogo).

Componentes esperados:
- `components/modules/professional/psychology/MoodDiaryFeed.tsx`
- `components/modules/professional/psychology/MentalHealthChat.tsx`
- Hooks: `useSharedDiaries(patientId)`, `usePsicologoChatThread(patientId)`, `usePsicologoSendMessage()`

---

## 7. Ordem de implementação sugerida

1. **Backend schema + migração** — `mental-health-schema.ts` + `01XX_mental_health.sql` + register
2. **Backend routes paciente** — `mental-health/` module com CRUD básico + trends
3. **Backend routes psicólogo** — endpoints em `psychology/routes.ts` (shared diaries + chat)
4. **Mobile** — trocar `useMoodMock()` pelos hooks reais (1 PR por hook pra rastreabilidade)
5. **Web (paciente)** — portar do mobile (mesmos hooks, layout adaptado)
6. **Web (psicólogo)** — adicionar MoodDiaryFeed + MentalHealthChat na página de paciente
7. **Realtime** — WS quando volume justificar (>50 msg/dia/par); polling antes

Cada fase é independente — backend pode ir antes; frontends consomem stub até backend ficar pronto.

---

## 8. Out of scope (V1)

- PHQ-9/GAD-7/DASS-21 do lado paciente (continua só lado profissional via `psychology_scores`)
- Anexos de foto/áudio no chat (placeholder Paperclip já visível na composer)
- Notificações push de "psicólogo respondeu" (pode ser feature flag separada)
- Filtros / busca no histórico do diário
- Exportação PDF do diário
- IA pra gerar frase contextual mensal (`tendenciaMensal.frase`) — usa heurística estática por enquanto

---

## 9. Riscos / observações

- **emocaoIds como text[]**: simples mas perde validação no DB. Se quiser FK, criar `mood_emocoes` table (catálogo seedado) + JOIN. Trade-off: mais joins vs catálogo imutável.
- **Snapshot vs reativo no share**: optei por snapshot. Se psi precisar ver versão atual do diário, vira UPDATE retroativo no share — quebra LGPD. Manter snapshot.
- **Uniq diária**: paciente edita = `UPDATE` da entry de hoje. Considerar histórico de edições? Hoje não previsto — entry é última versão.
- **Múltiplos psicólogos**: paciente pode vincular >1 psi. Cada um tem thread + scope independente. Diário compartilhado replica fanout pra todos com scope ON.
