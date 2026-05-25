# PRD — Simulador de Aparência Corporal e Idade Visual

> **Nome do MVP:** Projeção Corporal
>
> **Posicionamento:** sub-fluxo dentro de **Minha Saúde** (aba Comparar / botão "Gerar projeção"). Não é feature paralela — resultado vive como `Snapshot` no histórico de Minha Saúde.
>
> **Tipos canônicos:** `ProjecaoCorporal`, `ProjecaoMeta`, `ProjecaoPromptConfig`, `SnapshotIdades`, `SnapshotConsentimento` em `minha-saude/types.ts`.

## 1. Objetivo

Adicionar ao app de saúde uma feature que combina **fotos corporais**, **dados de bioimpedância** e **metas físicas** para gerar uma análise visual estimada do corpo atual e uma projeção realista de evolução corporal.

A feature **não diagnostica doenças, não prescreve tratamentos e não substitui avaliação profissional**. O objetivo é gerar consciência corporal, motivação e acompanhamento visual da evolução.

## 2. Problema

Usuários recebem dados de bioimpedância (peso, gordura corporal, massa muscular, idade corporal) mas têm dificuldade de entender o **impacto visual** desses números.

Exemplo: o usuário pode ver "18% de gordura" ou "idade corporal de 50 anos", mas não entende claramente como isso aparece no corpo nem qual mudança visual ocorreria ao perder 3 a 5 kg de gordura mantendo massa muscular.

## 3. Solução

Feature chamada provisoriamente de **"Projeção Corporal"**.

Permite que o usuário envie fotos de frente, perfil e costas, adicione ou importe dados de bioimpedância e receba análise textual + projeção visual + comparativo evolutivo.

## 4. Funcionalidades principais

### 4.1 Upload guiado de fotos

| Foto | Finalidade |
|------|------------|
| Frente | Avaliar abdômen, peitoral, ombros, braços e pernas |
| Perfil esquerdo | Avaliar projeção abdominal, postura e tronco |
| Perfil direito | Validar simetria visual |
| Costas | Avaliar dorsais, cintura posterior, lombar e distribuição de gordura |

**Regras:**

| Item | Requisito |
|------|-----------|
| Ambiente | Boa iluminação |
| Distância | Corpo inteiro visível |
| Roupa | Roupa esportiva ou ajustada |
| Fundo | Preferencialmente neutro |
| Posição | Corpo relaxado, braços ao lado do corpo |
| Frequência | Recomendada a cada 15 ou 30 dias |

### 4.2 Entrada de bioimpedância

O usuário pode inserir manualmente ou importar relatório:

| Campo | Exemplo |
|-------|---------|
| Idade real | 44 anos |
| Altura | 1,80 m |
| Peso | 93,4 kg |
| IMC | 28,8 |
| Massa muscular esquelética | 44,2 kg |
| Massa de gordura | 16,8 kg |
| Percentual de gordura | 18% |
| Gordura visceral | 7 |
| Idade corporal | 50 anos |
| Taxa metabólica basal | 2022 kcal |

### 4.3 Análise visual assistida por IA

A IA compara fotos e dados corporais para gerar leitura textual.

**Exemplo:**
> "O usuário apresenta boa base muscular, principalmente em pernas, braços e ombros. O principal acúmulo de gordura está concentrado em abdômen, flancos e lombar. A bioimpedância indica 18% de gordura corporal, o que parece coerente com as fotos. A prioridade recomendada é reduzir gordura mantendo massa muscular."

A análise contém:

| Bloco | Conteúdo |
|-------|----------|
| Coerência visual | Se as fotos parecem compatíveis com os dados |
| Pontos fortes | Massa muscular, postura, simetria, definição |
| Pontos de atenção | Acúmulo de gordura, postura, desequilíbrios visuais |
| Meta sugerida | Perda estimada de gordura ou manutenção muscular |
| Limite da análise | Informação educativa, não diagnóstico médico |

### 4.4 Estimativa de idade visual corporal

Modelado como `SnapshotIdades` no snapshot (vive em Minha Saúde):

| Tipo | Origem | Tipo do valor |
|------|--------|---------------|
| Idade real | Cronológica | `number` (exato) |
| Idade corporal | Bioimpedância | `number` (exato) |
| Idade visual estimada | IA sobre fotos | `{ min, max }` (faixa, sempre como estimativa) |
| Idade visual projetada | Estimativa pós-meta | `{ min, max }` (faixa, sempre como estimativa) |

**Exemplo:**

| Indicador | Valor |
|-----------|-------|
| Idade real | 44 anos |
| Idade corporal | 50 anos |
| Idade visual atual estimada | 40 a 45 anos |
| Idade visual projetada | 38 a 40 anos |

A idade visual deve **sempre** ser apresentada como estimativa subjetiva, nunca como medição científica.

### 4.5 Projeção corporal visual

A feature gera uma imagem estimada de como o corpo poderia parecer após atingir uma meta realista (via **Nano Banana**).

**Input estruturado** (`ProjecaoMeta`):

```ts
{
  peso: { atual, alvoMin, alvoMax },          // kg
  gorduraPercent: { atual, alvoMin, alvoMax }, // %
  massaGordura?: { atual, alvoMin, alvoMax },  // kg
  massaMuscular: { atual, estrategia: 'manter' | 'ganhar' | 'reduzir', alvo? },
  idadeCorporal?: { atual, alvoMin, alvoMax },
  regioesPrioritarias: ('abdomen' | 'flancos' | 'peitoral' | 'costas' | 'bracos' | 'pernas' | 'cintura' | 'ombros' | 'postura')[],
  prazoMeses?: number
}
```

**Config do prompt** (`ProjecaoPromptConfig`):

```ts
{
  modelo: 'nano-banana',
  preservar: ['identidade', 'proporcoes', 'iluminacao', 'fundo', 'roupa', 'pose', 'enquadramento'],
  disclaimerEducativo: 'Imagem é estimativa visual educativa, não promessa de resultado.',
  promptTexto: '...'  // gerado a partir de meta + regiões
}
```

**Exemplo de meta:**

| Indicador | Atual | Projetado |
|-----------|-------|-----------|
| Peso | 93,4 kg | 89 a 90 kg |
| Gordura corporal | 18% | 13% a 15% |
| Massa de gordura | 16,8 kg | 12 a 13 kg |
| Massa muscular | 44,2 kg | Mantida |
| Idade corporal | 50 anos | 40 a 42 anos estimados |

A imagem gerada deve preservar identidade geral, proporções realistas e contexto visual, mas reduzir sinais corporais compatíveis com perda de gordura.

**Mudanças esperadas:**

| Região | Alteração visual |
|--------|------------------|
| Abdômen | Menor volume e mais definição |
| Flancos | Redução lateral |
| Peitoral | Aparência mais firme |
| Costas | Mais definição e menor dobra lombar |
| Braços | Mais destaque visual |
| Cintura | Mais marcada |
| Postura | Aparência mais atlética |

### 4.6 Próximos passos gerais

> **Mudança de escopo vs versão anterior:** removido "plano de ação" prescritivo (treino 4-5×, cardio 3-4×, déficit calórico, proteína alta). Conflitava com:
> - **Freemium gating** — prescrição numérica é IA Pro
> - **Silos por vertical** — prescrição é dos módulos profissionais (nutricionista/personal), não do app paciente

A IA pode sugerir **direções educativas** (sem volume/frequência/déficit numérico):

| Área | Sugestão educativa |
|------|---------------------|
| Treino | "Considere treino de força regular" |
| Atividade | "Mantenha consistência semanal" |
| Nutrição | "Priorize ingestão proteica" |
| Sono | "Priorize recuperação noturna" |
| Acompanhamento | "Reavalie em 30 dias com profissional vinculado" |

Prescrição real (volume, déficit, plano alimentar) continua via profissional vinculado no app.

## 5. Fluxo do usuário

1. Usuário acessa "Projeção Corporal"
2. App explica uso, limites e privacidade
3. Usuário aceita consentimento de análise de imagem
4. Usuário envia fotos guiadas
5. Usuário insere ou importa bioimpedância
6. App cruza dados visuais e métricas
7. App gera análise textual
8. App sugere meta realista
9. Usuário confirma meta
10. App gera imagem projetada (Nano Banana)
11. Usuário salva evolução
12. App compara versões futuras

## 6. Regras de segurança e privacidade

Dados corporais, fotos e métricas são tratados como **dados sensíveis**.

| Requisito | Descrição |
|-----------|-----------|
| Consentimento explícito | Modelado em `SnapshotConsentimento` — `aceitoEm`, `versaoTermo`, `escopo` (`analise_visual`, `projecao_ia`, `armazenamento`, `export_profissional`). Obrigatório quando snapshot inclui fotos. |
| Exclusão fácil | Usuário pode apagar fotos e análises |
| Armazenamento seguro | Criptografia em repouso e em trânsito |
| Não exposição pública | Imagens privadas por padrão |
| Controle de compartilhamento | Usuário decide se quer exportar (`escopo: export_profissional`) |
| Aviso de limitação | Não é diagnóstico médico — `disclaimerEducativo` no `ProjecaoPromptConfig` |
| LGPD | Base legal clara para tratamento de dados sensíveis |

## 7. Restrições da IA

**A IA NÃO deve:**
- Diagnosticar doenças
- Afirmar risco médico sem base clínica
- Fazer julgamento ofensivo do corpo
- Usar linguagem humilhante
- Prometer resultado garantido
- Criar projeções irreais
- Estimar fertilidade, saúde sexual ou doença
- Inferir atributos sensíveis não informados
- Expor fotos em comparativos públicos sem consentimento

**A IA DEVE:**
- Usar linguagem neutra
- Explicar que é uma estimativa
- Focar em evolução e saúde
- Sugerir acompanhamento profissional quando necessário
- Priorizar metas realistas
- Separar dado medido de percepção visual

## 8. Critérios de aceite

| Critério | Validação |
|----------|-----------|
| Upload de fotos funciona | Usuário consegue enviar 3 a 4 fotos |
| Dados corporais são capturados | Usuário consegue inserir bioimpedância |
| IA gera análise coerente | Texto cruza fotos e métricas |
| Idade visual aparece como estimativa | Sem tom diagnóstico |
| Projeção visual é gerada | Imagem mostra evolução realista |
| Comparativo atual vs projetado funciona | Tabela e imagem lado a lado |
| Usuário pode excluir dados | Fotos e análises removíveis |
| Consentimento é registrado | Aceite antes da análise |
| Aviso médico é exibido | Antes e depois da análise |

## 9. MVP

| Item | Incluído no MVP |
|------|----------------|
| Upload de fotos | Sim |
| Entrada manual de bioimpedância | Sim |
| Leitura automática de PDF | Não obrigatório |
| Análise textual por IA | Sim |
| Idade visual estimada | Sim |
| Meta corporal sugerida | Sim |
| Projeção visual (Nano Banana) | Sim |
| Histórico evolutivo | Básico |
| Integração com wearables | Não |
| Plano alimentar detalhado | Não |
| Prescrição de treino | Não |

## 10. Versões futuras

| Feature | Descrição |
|---------|-----------|
| OCR de bioimpedância | Ler PDF ou foto do relatório automaticamente |
| Comparativo mensal | Antes e depois com timeline |
| Score de recomposição | Índice próprio de evolução corporal |
| Integração com smartwatch | Sono, passos, batimentos e gasto calórico |
| Ajuste de meta | Simular 12%, 15%, 18% de gordura |
| Coach de hábitos | Rotina semanal de treino, sono e alimentação |
| Relatório para personal | Exportar PDF para profissional |
| Análise postural | Ombros, cabeça, quadril e curvatura |
| Alertas de inconsistência | Peso cai, mas gordura não muda, ou vice-versa |

## 11. Prompt interno da IA

> Você é um assistente de análise corporal educativa dentro de um app de saúde.
>
> Receberá fotos corporais do usuário e dados de bioimpedância. Sua função é gerar uma análise visual coerente, respeitosa e não diagnóstica.
>
> Use os dados informados como referência principal. Use as fotos apenas para avaliar coerência visual, distribuição corporal, postura aparente e evolução estética estimada.
>
> Nunca diagnostique doenças. Nunca faça afirmações médicas. Nunca use linguagem ofensiva. Nunca prometa resultados. Sempre trate idade visual, projeção corporal e aparência como estimativas.
>
> Gere a resposta com os seguintes blocos:
>
> 1. Resumo corporal atual
> 2. Coerência entre fotos e bioimpedância
> 3. Pontos fortes
> 4. Pontos de atenção
> 5. Meta realista
> 6. Projeção visual esperada
> 7. Próximos passos gerais
> 8. Limitações da análise
>
> Use linguagem objetiva, respeitosa e prática.

## 12. Nome sugerido da feature

| Nome | Posicionamento |
|------|---------------|
| **Projeção Corporal** ✅ | Técnico e direto (recomendado MVP) |
| Corpo Futuro | Mais emocional |
| Evolução Visual | Foco em acompanhamento |
| Simulador Corporal | Foco em simulação |
| Idade Visual Corporal | Foco em percepção |
| Recomp AI | Foco em recomposição corporal |
