# Exames Specification

## Overview

Aba do paciente Nymos mobile — gerenciamento dos exames laboratoriais com upload, extração automática por IA e visualização de marcadores. Captura o ciclo completo: foto/PDF do laudo → extração de valores → comparação com faixas de referência → status (normal/warning/critical) → histórico longitudinal.

**Esta section foi back-portada do live (`mobile/src/screens/exams/`) em 2026-05-25** — o protótipo ficou pra trás e esta spec reflete o que está em produção.

## User Flows

- Paciente abre a tab Exames → vê resumo (total/processed/pending/failed) + breakdown por tipo
- Lista mostra exames agrupados por data (mais recente primeiro), com badge de status (normal/warning/critical)
- Tap em exame → abre modal de detalhe com todos os marcadores + valores + faixas de referência
- Tap no FAB / empty state CTA → fluxo de captura novo exame:
  1. ExamTypeSelect (selecionar tipo)
  2. ExamCapture (câmera ou galeria)
  3. ExamUpload (preview + confirma)
  4. ExamResult (loading durante processamento IA, depois resultado)
- Tap em "Histórico" → tela ExamHistory com filtros (tipo, período)
- Pull-to-refresh atualiza a lista
- Exame em processamento → badge "Processando..." + spinner
- Exame com falha → badge destructive + CTA "Refazer foto"

## UI Requirements

### Estrutura geral
- Dark mode default (`bg-slate-950`)
- Header com 3 stat cards horizontais: Total, Processados, Pendentes (com ícone + número grande)
- Card "Resumo por tipo" abaixo: list de tipos com count, link "Histórico →"
- Section list agrupada por data (label "Segunda, 25 maio" em uppercase tracking-wider muted)
- Cada exame = card com ícone (Droplets pra laboratorial), título (displayName), hora, summary do primeiro marcador, badge de status
- FAB ou button flutuante "+" pra novo exame
- Empty state quando lista vazia (CTA "Adicionar primeiro exame")

### Estados de exame
- **Processando** (`phase: 'validating' | 'extracting'`): badge "Processando..." cinza, sem summary visível
- **Processado** (`phase: 'done'`): badge colorido conforme worstStatus dos valores (success/warning/destructive)
- **Falha** (`failed: true`): badge "Análise falhou" destructive + erroMessage no subtitle

### Cores de status
- `normal` → emerald-500
- `warning` → amber-500
- `critical` → rose-500 (badge destructive)

## Data Shape

Ver `types.ts`:
- `Exam` — entry individual com `examType`, `fileName`, `extractedValues`, `processing`
- `ExtractedValue` — valor + unidade + range normal + status
- `ExamStats` — agregados (total/processed/pending/failed + byType)
- `ExamDateGroup` — grouping por data pra SectionList
- `ExamesData` — root contendo stats + groups

## Sub-screens (não cobertas neste protótipo, mas existem em live)

- `ExamTypeSelectScreen` — seleção do tipo de exame antes da captura
- `ExamCaptureScreen` — câmera/galeria pra foto do laudo
- `ExamUploadScreen` — preview + confirma upload
- `ExamResultScreen` — resultado pós-processamento IA
- `ExamHistoryScreen` — filtros por tipo/período
- `ExamDetailScreen` / `ExamDetailModal` — detalhe completo dos marcadores
- `LabExamResult` — view-only resultado com valores + faixas

## Notes

- Live também tem `BioimpedanceResult`, `BodyPhotoResult`, `BodyEvolutionTab`, `BodyScoreCard`, `BodySilhouette` dentro da pasta `exams/`, mas estes pertencem conceitualmente a `body-evaluations/` (também back-port pendente). Comentário no live: "Body evaluations moved to /body-evaluations module".
- A categoria atual é só `laboratorial`. Imagem (DICOM, ultrassom) está fora do escopo do MVP.
- Pipeline de IA tem fases (`validating` → `extracting` → `done`). UI mostra spinner durante as duas primeiras.
