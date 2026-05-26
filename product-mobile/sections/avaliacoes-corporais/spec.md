# Avaliações Corporais Specification

## Overview

Aba do paciente Nymos mobile — gerenciamento das avaliações corporais longitudinais. Combina duas modalidades complementares: **Bioimpedância** (composição corporal — peso, % gordura, massa muscular, IMC, água, taxa basal) e **Fotos corporais** (sessões com frente/lateral/costas pra acompanhar evolução visual).

**Esta section foi back-portada do live (`mobile/src/screens/body-evaluations/`) em 2026-05-25** — o protótipo ficou pra trás e esta spec reflete o que está em produção.

## User Flows

- Paciente abre a tab Avaliações Corporais → vê tabs/segmented control com **Bioimpedância** e **Fotos**
- Tab Bioimpedância:
  - Stats topo: Total, Último peso, % gordura
  - Lista agrupada por data (mais recente primeiro)
  - Cada item mostra fonte (IA/Aparelho/Manual) + hora + linha resumo "Peso 78kg · Gordura 22% · Músculo 35kg"
  - Tap → detalhe modal com 8 metric tiles (peso, %gordura, músculo, visceral, %água, taxa basal, idade metabólica, IMC) + observações + ação excluir
- Tab Fotos:
  - Stats topo: Sessões totais, Última (relative time)
  - Lista agrupada por data com card de cada sessão (ícone Camera + fonte + hora + notes)
  - Tap → detalhe modal com 3 fotos empilhadas (Frente / Lateral / Costas) + observações + ação excluir
- FAB "+" → fluxo de nova entrada (bioimpedância nova ou nova sessão de fotos, conforme tab ativa)
- Empty state por tab quando lista vazia (CTA "Adicionar primeira avaliação" / "Adicionar fotos")
- Pull-to-refresh atualiza a lista

## UI Requirements

### Estrutura geral
- Dark mode default (`bg-slate-950`, `text-slate-100`)
- Header com segmented control 2-opções: Bioimpedância / Fotos (toggle teal)
- Stats horizontais responsivos ao tab ativo (3 stat cards pra bioimpedância, 2 pra fotos)
- Section list agrupada por data ("Segunda, 25 maio" em uppercase tracking-wider muted)
- Cards: `border border-slate-800 bg-slate-900/60 rounded-xl`
- FAB redondo bottom-right `bg-teal-500 text-slate-950`

### Card de bioimpedância
- Ícone Activity (teal) + título (fonte: IA/Aparelho/Manual) + hora à direita
- Linha resumo com 3 métricas inline separadas por `·`
- Tap → modal detalhe

### Card de foto
- Ícone Camera (teal) + título "Sessão de fotos" / fonte + hora à direita
- Subtitle = notes (truncado) ou contagem de fotos (ex: "3 ângulos")
- Tap → modal detalhe

### Cores/accents
- Primary: `teal-500`
- Tiles métricos no detalhe usam cores distintas: teal (peso/músculo/IMC), amber (% gordura), rose (visceral), sky (% água), orange (taxa basal), violet (idade metabólica)
- Source badges: IA = teal, Aparelho = sky, Manual = slate

## Data Shape

Ver `types.ts`:
- `Bioimpedance` — entry com peso, % gordura, massa muscular, gordura visceral, % água, IMC, taxa basal, idade metabólica + source + dispositivo
- `BodyPhotoSession` — entry com array de `BodyPhoto` (cada uma com `photoType: 'front' | 'side' | 'back'` + `imageUrl`)
- `EvaluationStats` — agregados por modalidade
- `EvaluationDateGroup` — grouping por data pra SectionList
- `AvaliacoesCorporaisData` — root contendo bioimpedances + photoSessions + stats

## Sub-screens (não cobertas neste protótipo, mas existem em live)

- `BioimpedanceCaptureScreen` — entrada manual ou import via aparelho
- `BodyPhotoCaptureScreen` — captura sequencial dos 3 ângulos
- `BodyEvolutionScreen` — comparação temporal entre duas avaliações
- `BioimpedanceDetailModal` / `BodyPhotoDetailModal` — detalhes completos (cobertos em escopo desta spec via modal interno)

## Notes

- Live tem ambas as modalidades sob `body-evaluations/` no service único `body-evaluations.service.ts`, diferenciadas por `evaluationType`. O protótipo segue o mesmo modelo.
- Foto URL no live usa `resolveImageUrl()` pra prefixar baseURL — no protótipo usamos placeholders.
- Fluxo de captura via IA (Nano Banana) pra projeção corporal vive em `minha-saude/` (não nesta section).
