# IA Specification

## Overview

Tab "IA" — hub central de inteligência artificial do app. Combina **upload + análise** de fotos/PDFs (balança, glicímetro, monitor de pressão, alimento, exame laboratorial, bioimpedância, foto corporal) com **chat conversacional** sobre saúde do usuário. Cada foto vira dados estruturados via OCR/IA do backend (`ai-chat` module) e é salva na tabela apropriada (metrics, nutrition, exams, body_evaluations). Acessada pela tab IA (4ª) com ícone câmera/sparkle accent sky.

## User Flows

- Usuário toca tab IA → vê hero com saudação IA + grid de 7 quick actions
- Usuário toca "Foto da Balança" → câmera abre → tira foto → IA extrai peso → salva em metrics → toast de confirmação
- Usuário toca "Exame Laboratorial" → escolhe PDF da galeria → IA extrai biomarcadores → salva em exams
- Usuário toca "Foto Corporal" → flow guiado de 4 fotos (frente/perfil esq/perfil dir/costas) → análise visual + opcional projeção corporal (Nano Banana)
- Usuário toca "Conversar com IA" → abre chat conversacional (livre)
- Usuário vê histórico de análises recentes → toca em uma → vê dados extraídos detalhados
- Empty state: "Comece tirando uma foto" + 1ª action destacada

## UI Requirements

### Header (sub-page com back)

- Back `<` + título "IA" + subtítulo "Análise inteligente"
- Right action: pode ter `Sparkles` ícone de configuração IA, mas no MVP basta título

### Hero IA (topo)

- Card grande gradient suave `slate-900 → teal-950/40` com:
  - Ícone Bot/Sparkles 36×36 em fundo sky-500/15
  - Título "Como posso te ajudar?" DM Sans semibold 18px
  - Subtítulo curto "Tire uma foto ou pergunte" `slate-400` 12.5px
  - CTA "Conversar com a IA" pill teal embaixo

### Quick action grid (2 colunas)

7 cards na ordem:

1. **Foto da Balança** — ícone Scale teal · "Peso instantâneo"
2. **Foto Corporal** — ícone Camera sky · "Análise + projeção"  
3. **Exame Laboratorial** — ícone FileText emerald · "Biomarcadores"
4. **Bioimpedância** — ícone Activity amber · "Composição corporal"
5. **Foto de Glicemia** — ícone Droplet rose · "Açúcar no sangue"
6. **Foto de Pressão** — ícone HeartPulse rose · "PA sistólica/diastólica"
7. **Foto de Alimento** — ícone Apple violet · "Calorias do prato"

Cada card:
- Quadrado `aspect-square`, `rounded-2xl`, fundo `slate-900` border `slate-800`
- Ícone 24×24 colorido em fundo `*-500/15` rounded-xl
- Label DM Sans semibold 13px
- Subtítulo descrição em `slate-400` 11px
- Tap: scale 0.98 + highlight da cor

### Histórico recente (lista vertical)

Section header "RECENTES" + lista de ChatHistoryItem:

Cada item card horizontal:
- Ícone do optionType (mesmo do quick action) em fundo da cor
- Tipo + data ("Foto da Balança · há 2h")
- Resumo extraído ("83,4 kg · 92% confiança")
- Chevron `>` direita

Empty: "Nenhuma análise ainda · Comece pelo grid acima"

### Cores e padrão

- Fundo: `slate-950`
- Cards: `slate-900` border `slate-800`
- Hero gradient: `from-slate-900 to-teal-950/40`
- Quick actions: cores temáticas por tipo (teal/sky/emerald/amber/rose/violet)
- DM Sans + IBM Plex Mono
- Padding lateral: 16px

## Configuration

- shell: true
