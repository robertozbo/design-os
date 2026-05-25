# API Contract — Projeção Corporal (Nano Banana)

Endpoint do backend que recebe meta + fotos + prompt config e retorna a imagem gerada pela IA. Modelo **assíncrono** (Nano Banana leva ~30s, não bloqueia o app).

> **Disclaimer:** este contrato é parte do design (Design OS planejamento). A implementação real fica no backend do app — esse arquivo é o input pro coding agent durante handoff via `/export-product`.

---

## Fluxo geral

```
1. Cliente valida elegibilidade (freshness gate + consentimento) → POST /projecao
2. Backend cria job, valida consentimento, valida meta, agenda chamada Nano Banana
3. Cliente faz polling em GET /projecao/:jobId (ou recebe webhook se configurado)
4. Quando pronta: imagem disponível em ProjecaoCorporal.resultado (URLs assinadas, expiram)
```

---

## `POST /projecao`

Cria um job de projeção. Retorna **202 Accepted** + `jobId` pra polling.

### Request

```ts
interface CriarProjecaoRequest {
  /** Snapshot pai (a projeção sempre vive como atributo de um Snapshot). */
  snapshotId: string

  /** URLs assinadas das fotos atuais (privadas, geradas pelo backend após upload). */
  basePhotos: {
    frontal: string          // obrigatória
    posterior?: string
    lateralEsquerda?: string
    lateralDireita?: string
  }

  /** Meta estruturada — input principal pro prompt. */
  meta: ProjecaoMeta

  /** Configuração do gerador. */
  prompt: ProjecaoPromptConfig

  /**
   * ID do registro de consentimento que prova o usuário aceitou o escopo `projecao_ia`.
   * Backend valida em SnapshotConsentimento.escopo.includes('projecao_ia').
   */
  consentimentoId: string

  /** Idempotência: cliente envia um UUID; backend retorna mesmo job se vier duplicado. */
  idempotencyKey: string
}
```

### Response — sucesso

```ts
// HTTP 202 Accepted
interface ProjecaoJobCriado {
  jobId: string                    // ex: "proj_01HXYZ..."
  status: 'gerando'
  estimatedSeconds: number         // típico: 30
  pollUrl: string                  // "/projecao/:jobId"
  /** Webhook opcional configurado pelo cliente */
  webhookUrl?: string
}
```

### Response — erros

| HTTP | Código | Quando |
|---|---|---|
| `400` | `meta_invalida` | Validação falhou (ex: `gorduraPercent.alvo` < 5%, `prazoMeses` > 24, `regioesPrioritarias` vazio com massa "manter") |
| `401` | `nao_autenticado` | Sem JWT válido |
| `403` | `consentimento_ausente` | `SnapshotConsentimento.escopo` não inclui `projecao_ia` |
| `403` | `plano_insuficiente` | Usuário não tem **Pro** (IA gating) |
| `404` | `snapshot_nao_encontrado` | `snapshotId` não existe ou não pertence ao usuário |
| `404` | `fotos_nao_acessiveis` | URLs assinadas expiraram ou não pertencem ao snapshot |
| `409` | `projecao_ja_existe` | Já tem projeção pronta pra esse snapshot — usar `regenerar=true` no body |
| `422` | `meta_irrealista` | IA-side: alvo > 1kg/semana de perda, ou %gordura alvo < 8% (homem) / 12% (mulher) |
| `429` | `cooldown_ativo` | Cooldown mensal atingido (ver "Rate limiting") |
| `503` | `modelo_indisponivel` | Nano Banana down — cliente deve tentar de novo em ~5min |

```ts
interface ErroResponse {
  codigo: string
  mensagem: string                 // pt-BR, mostrável no UI
  detalhes?: Record<string, unknown>
  /** Quando código é cooldown_ativo */
  retryAfterSeconds?: number
}
```

---

## `GET /projecao/:jobId`

Polling do status. Cliente chama a cada 3-5s enquanto `status === 'gerando'`.

### Response

```ts
// HTTP 200 OK — sempre retorna ProjecaoCorporal completo
interface ProjecaoStatusResponse {
  jobId: string
  /** Espelha ProjecaoCorporal.status do tipo canônico */
  status: 'gerando' | 'pronta' | 'falhou' | 'sem_dados_suficientes'

  /** Preenchido quando status === 'pronta' */
  resultado?: {
    frontal: string                // URL assinada (expira em 7 dias)
    posterior?: string
    lateralEsquerda?: string
    lateralDireita?: string
  }

  /** Sempre presente */
  basePhotos: SnapshotFotos
  meta: ProjecaoMeta
  prompt: ProjecaoPromptConfig

  /** Metadados de auditoria */
  auditoria: {
    modeloVersao: string           // "nano-banana@v2.3"
    geradoEm?: string              // ISO date, presente quando pronta
    custoEstimadoCents?: number    // pra dashboard admin
    tempoGeracaoMs?: number
    /** Hash do prompt enviado (pra revisão LGPD) */
    promptHash: string
  }

  /** Quando status === 'falhou' */
  erro?: {
    codigo: string                 // 'modelo_indisponivel' | 'safety_filter' | 'timeout'
    mensagem: string
    permiteRetry: boolean
  }

  mensagem?: string                // pt-BR, pra exibir no UI
}
```

---

## `DELETE /projecao/:jobId`

Cliente apaga uma projeção pronta. Remove imagem do storage + log de auditoria mantido (LGPD: dado pessoal apagado, mas operação fica registrada).

| HTTP | Quando |
|---|---|
| `204` | Apagado |
| `404` | Não existe |
| `409` | Status `gerando` — esperar terminar antes de apagar |

---

## Rate limiting & cooldown

Custo de IA é alto. Limites por **plano**:

| Plano | Limite |
|---|---|
| Free | ❌ Bloqueado (gating) |
| Plus | 1 projeção / mês |
| Pro | 4 projeções / mês + 1 regeneração por snapshot |

Backend retorna `429 cooldown_ativo` com `retryAfterSeconds` quando excedido.

---

## Validações da meta (server-side)

Backend recusa metas irrealistas — alinhamento com restrição "criar projeções irreais" do PRD:

| Regra | Limite |
|---|---|
| Perda de peso | ≤ 1 kg/semana → `peso.atual - peso.alvoMin` ≤ `prazoMeses × 4` |
| % gordura mínimo (homem) | ≥ 8% (essencial) |
| % gordura mínimo (mulher) | ≥ 12% (essencial) |
| Massa muscular ganho | ≤ 0,5 kg/mês (natural) |
| Prazo | 1 ≤ `prazoMeses` ≤ 24 |
| Idade corporal alvo | ≥ `idadeReal - 10` |

Falha → `422 meta_irrealista` com `detalhes.regrasViolatdas: string[]`.

---

## Auditoria & LGPD

**Cada job gera registro em `projecao_audit_log`:**

```ts
interface ProjecaoAuditEntry {
  jobId: string
  userId: string
  snapshotId: string
  consentimentoId: string          // FK pra SnapshotConsentimento
  modeloVersao: string
  promptHash: string               // SHA-256 do prompt textual
  metaSnapshot: ProjecaoMeta       // congelado no momento
  basePhotosUrls: string[]         // URLs no momento (pra reprodutibilidade)
  custoEstimadoCents: number
  geradoEm: string
  apagadoEm?: string               // quando user apaga, vira null nas URLs mas log fica
}
```

Acessível só pra admin via dashboard interno. Retenção: 5 anos (compliance).

---

## Webhook (opcional)

Cliente registra `webhookUrl` no POST. Backend chama com payload:

```ts
// POST {webhookUrl}
interface ProjecaoWebhookPayload {
  jobId: string
  status: 'pronta' | 'falhou'
  signature: string                // HMAC-SHA256 do body com secret do cliente
  timestamp: string
}
```

Cliente busca detalhes em `GET /projecao/:jobId`. Webhook só notifica conclusão.

---

## Tipos canônicos referenciados

Todos os tipos `ProjecaoMeta`, `ProjecaoPromptConfig`, `SnapshotFotos` etc. vêm de `product-mobile/sections/minha-saude/types.ts` (re-exporta `api-types/metric.ts` quando aplicável). Não duplicar definições.

---

## Exemplo end-to-end

### 1. Cliente envia

```http
POST /projecao
Content-Type: application/json
Authorization: Bearer <jwt>
Idempotency-Key: 8f2b...

{
  "snapshotId": "snap-2026-04-04",
  "basePhotos": {
    "frontal": "https://storage.../signed?token=...",
    "posterior": "https://storage.../signed?token=..."
  },
  "meta": {
    "peso": { "atual": 78.5, "alvoMin": 75.0, "alvoMax": 76.0 },
    "gorduraPercent": { "atual": 18.5, "alvoMin": 14, "alvoMax": 16 },
    "massaMuscular": { "atual": 62.3, "estrategia": "manter" },
    "idadeCorporal": { "atual": 38, "alvoMin": 33, "alvoMax": 35 },
    "regioesPrioritarias": ["abdomen", "flancos", "cintura"],
    "prazoMeses": 4
  },
  "prompt": {
    "modelo": "nano-banana",
    "preservar": ["identidade", "proporcoes", "iluminacao", "fundo", "roupa", "pose", "enquadramento"],
    "disclaimerEducativo": "Imagem é estimativa visual educativa, não promessa de resultado.",
    "promptTexto": "Mesma pessoa, mesma pose..."
  },
  "consentimentoId": "consent-2026-04-04",
  "idempotencyKey": "8f2b..."
}
```

### 2. Backend responde 202

```json
{
  "jobId": "proj_01HXYZ123",
  "status": "gerando",
  "estimatedSeconds": 30,
  "pollUrl": "/projecao/proj_01HXYZ123"
}
```

### 3. Cliente polla — depois de ~30s

```http
GET /projecao/proj_01HXYZ123
```

```json
{
  "jobId": "proj_01HXYZ123",
  "status": "pronta",
  "resultado": {
    "frontal": "https://storage.../resultado-frontal?expires=...",
    "posterior": "https://storage.../resultado-posterior?expires=..."
  },
  "basePhotos": { "...": "..." },
  "meta": { "...": "..." },
  "prompt": { "...": "..." },
  "auditoria": {
    "modeloVersao": "nano-banana@v2.3",
    "geradoEm": "2026-04-04T08:13:42Z",
    "custoEstimadoCents": 18,
    "tempoGeracaoMs": 28400,
    "promptHash": "sha256:a3f1..."
  }
}
```
