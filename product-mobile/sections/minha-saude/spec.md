# Minha Saúde Specification

## Overview
Camada de síntese da Nymos. Combina todos os dados coletados (composição corporal, métricas, atividades, sono, nutrição, exames, fotos) num **score de saúde** com benchmarks oficiais **estratificados por idade × sexo**. Permite gerar análises pontuais (snapshots) e comparar a evolução ao longo do tempo, incluindo projeção corporal com IA (Nano Banana).

> **Projeção Corporal** é sub-fluxo desta section (aba Comparar). Detalhes completos em [`prd-projecao.md`](./prd-projecao.md): fluxo de upload, prompt da IA, restrições de segurança, critérios de aceite, MVP vs V2.

## Referências oficiais por idade × sexo

Cada `DimensionMetric` pode declarar `referenciaPorIdadeSexo` — faixas estratificadas em 6 décadas (`18-29` a `70+`) × `homem`/`mulher`/`unissex`. O app resolve a faixa em runtime usando o perfil do usuário; `faixaReferencia` (string) permanece como fallback de display.

**Métricas estratificadas (MVP):**

| Métrica | Fonte | Variação |
|---|---|---|
| % Gordura | ACSM | 6 décadas × 2 sexos |
| VO2 estimado | ACSM | 6 décadas × 2 sexos |
| Massa Muscular (SMI) | EWGSOP2 | 2 sexos + rastreio sarcopenia 60+ |
| Duração de sono | NSF | 7–9h (<60) → 7–8h (60+) |
| Passos/dia | JAMA Intern Med (Paluch 2022) | 8–10k (<60) → 6–8k (60+) |
| Proteína/kg | ISSN / PROT-AGE | 1,2–2,0 → 1,2–1,6 (60+, anti-sarcopenia) |

**Métricas não-estratificadas** (consenso = mesma faixa pra todos adultos): IMC (OMS), glicemia/HbA1c (ADA), LDL/triglicérides (SBC), pressão (AHA pós-2017), eficiência de sono (AASM), min/sem atividade (WHO).

## User Flows

### Estado Atual
- Usuário abre Minha Saúde e vê o score geral atual + breakdown por dimensão (composição, metabólico, cardiovascular, atividade, sono, nutrição, mental).
- Cada dimensão mostra valor atual + faixa de referência oficial (OMS/WHO/ADA/etc) + status semáforo.
- Indicador de "data sufficiency" por dimensão: se há dados suficientes pra avaliação confiável.

### Gerar Nova Análise (Snapshot)
- Usuário toca "Nova análise" na aba Análises.
- Sistema valida elegibilidade via **freshness gate**:
  - Bloqueia se desde a última análise não houve: nova bioimpedância, novo exame, novas fotos corporais E menos de 30 dias se passaram.
  - Mostra card de status "Aguardando novos dados" com checklist do que adicionar.
  - Permite override só com cooldown de 30 dias atingido.
- **Consentimento LGPD** (obrigatório quando há fotos): aceite explícito antes de gerar; registra `aceitoEm`, `versaoTermo` e `escopo` (`analise_visual`, `projecao_ia`, `armazenamento`, `export_profissional`).
- Se elegível: gera snapshot com IA, congela métricas + score + análise textual + **4 idades** + fotos do momento.

### Quatro Idades no Snapshot
Cada análise registra `SnapshotIdades`:

| Tipo | Origem | Apresentação |
|---|---|---|
| **Real** | Cronológica (data de nascimento) | Valor exato |
| **Corporal** | Bioimpedância | Valor exato (fonte do aparelho) |
| **Visual estimada** | Análise das fotos pela IA | **Faixa** (ex: "33–36 anos") |
| **Visual projetada** | Estimativa ao atingir meta | **Faixa** (ex: "30–33 anos") |

Idades visuais devem **sempre** aparecer com label "estimativa subjetiva" — nunca como medição científica.

### Ver Análises Anteriores
- Lista cronológica de snapshots armazenados.
- Cada item: data + score geral + delta vs análise anterior + thumbnail das fotos (se houver).
- Toque abre detalhes do snapshot.

### Evolução
- Gráficos de linha por dimensão ao longo dos snapshots.
- Filtros por período (3m, 6m, 1a, tudo).
- Realce de mudanças significativas.

### Comparar Snapshots
- Usuário escolhe 2 snapshots (ex: inicial vs hoje).
- Vê diff por dimensão: antes / depois / direção da mudança.
- Fotos corporais lado a lado (frontal/posterior/lateral).
- **Projeção Corporal IA (Nano Banana)**: gera imagem de "como ficaria" se atingir meta.
  - Input: `ProjecaoMeta` estruturada — `peso { atual, alvoMin, alvoMax }`, `gorduraPercent`, `massaMuscular { estrategia: 'manter' | 'ganhar' | 'reduzir' }`, `idadeCorporal`, `regioesPrioritarias[]` (abdomen, flancos, peitoral, costas, braços, pernas, cintura, ombros, postura), `prazoMeses`.
  - `ProjecaoPromptConfig.preservar`: identidade, proporções, iluminação, fundo, roupa, pose, enquadramento.
  - `disclaimerEducativo` embutido: "estimativa visual, não promessa de resultado".

### Discoverability
- **Hero card no topo da dashboard Início** com score do dia + setinha de tendência → toque abre Minha Saúde fullscreen.
- Atalho secundário em "Mais" no topo da lista.

## UI Requirements

- 4 abas top: **Estado Atual** · **Análises** · **Evolução** · **Comparar**
- Score geral 0-100 com cor por faixa (verde 80+, amarelo 60-79, vermelho <60)
- 7 dimensões com benchmark e semáforo
- Card de freshness gate na aba Análises (verde "elegível" / amarelo "aguardando")
- Botão "Nova análise" com estado disabled + tooltip explicativo quando não elegível
- Gráficos de linha simples (sparkline + eixo) por dimensão
- Picker de 2 snapshots na aba Comparar
- Slot pra projeção corporal (placeholder visual antes da geração)

## Configuration
- shell: true
