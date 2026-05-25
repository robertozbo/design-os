# Métricas Specification

## Overview

Tab principal "Métricas" — lista granular de **todas as medidas individuais** que o app coleta (composição corporal, cardio, atividade, sono, hidratação, outros). Diferente de Minha Saúde (que agrega e analisa), Métricas é o **catálogo bruto** de cada indicador com sparkline, delta vs período, fonte do dado e atalho pra histórico detalhado. É onde o paciente curioso vai pra "como tá meu BPM essa semana" sem precisar abrir uma análise IA.

## User Flows

- Usuário toca na aba Métricas → vê lista de métricas agrupadas por categoria
- Usuário escolhe período no topo (Hoje / 7 dias / 30 dias / 6 meses / 1 ano) — todos os deltas e sparklines re-renderizam
- Usuário toca numa métrica → abre detalhe com gráfico grande, histórico, fonte do dado, botão "Registrar manualmente"
- Usuário toca em "+ Adicionar" no header → escolhe métrica pra registro manual (peso, água, etc.)
- Usuário busca por nome (pull-to-search ou ícone search no header)
- Usuário em métrica sem dados vê "Conecte [dispositivo] pra coletar" ou "Registre manualmente"
- Usuário pull-to-refresh sincroniza wearables/devices
- Usuário em modo "todas" vê tudo, em modo "destaque" vê só as 6 principais (peso, BPM, sono, passos, % gordura, água)

## UI Requirements

### Header (sub-page interno da tab — sem back arrow)

- Tab "Métricas" — header normal do shell + título da seção como primeiro elemento de scroll
- Título "Métricas" em DM Sans semibold 22px + subtítulo "Suas medidas no detalhe" `slate-400` 13px
- Ação direita: ícones search + "+" pra adicionar manualmente

### Period selector

Pills horizontais sticky logo abaixo do título:
- **Hoje** · **7 dias** · **30 dias** (default) · **6 meses** · **1 ano**
- Active: `teal-500` background, `white` texto
- Inactive: `slate-800` background, `slate-300` texto
- Tap = filtra/recalcula deltas + sparklines

### Categoria headers

Section labels (semibold uppercase tracking):
- **Composição Corporal** (slate-400)
- **Cardio**
- **Atividade**
- **Sono**
- **Hidratação**
- **Outros**

Cada categoria com contagem (ex: "6 métricas") em mono `slate-500`.

### Métrica row card

Card horizontal `slate-900` border `slate-800` `rounded-2xl` p-3, full width:

- **Esquerda:** ícone 36×36 em fundo colorido pelo categoria/métrica:
  - Peso/Composição: `teal-500/15` icon `teal-300`
  - Cardio: `rose-500/15` icon `rose-300`
  - Sono: `violet-500/15` icon `violet-300`
  - Atividade: `sky-500/15` icon `sky-300`
  - Hidratação: `cyan-500/15` icon `cyan-300`
  - Outros: `slate-700/40` icon `slate-300`
- **Centro-esquerda:** nome em DM Sans semibold 14px + fonte do dado (`Apple Watch · há 3 min`) em `slate-500` mono 11px
- **Centro:** valor mono 24px tabular-nums + unidade mono 11px
- **Direita:**
  - Sparkline SVG 64×24 com gradient (cor categoria) — últimos N pontos
  - Delta abaixo: `↑ +1,2%` ou `↓ -0,3 kg` em mono pequeno colorido
- Tap → detalhe (sub-rota `/metricas/[id]`)

### Detalhe (V2 — fora deste MVP de tela)

- Gráfico grande SVG (line chart)
- Histórico tabular
- Range picker custom
- Botão "Registrar manualmente"
- Comparação com população (futuro)

### Métricas inclusas (MVP)

| Categoria | Métrica | Unidade | Fonte exemplo |
|-----------|---------|---------|---------------|
| **Composição** | Peso | kg | Balança |
| **Composição** | IMC | — | calc |
| **Composição** | % Gordura | % | Balança |
| **Composição** | Massa Muscular | kg | Balança |
| **Composição** | Gordura Visceral | índice | Balança |
| **Composição** | Cintura | cm | manual |
| **Cardio** | BPM repouso | bpm | Apple Watch |
| **Cardio** | BPM máx (24h) | bpm | Apple Watch |
| **Cardio** | HRV | ms | Apple Watch |
| **Cardio** | Pressão arterial | mmHg | manual |
| **Atividade** | Passos | passos | Apple Watch |
| **Atividade** | Distância | km | Apple Watch |
| **Atividade** | Calorias gastas | kcal | Apple Watch |
| **Atividade** | Andares subidos | andares | Apple Watch |
| **Sono** | Horas | h | Apple Watch |
| **Sono** | Eficiência | % | Apple Watch |
| **Sono** | REM | min | Apple Watch |
| **Sono** | Sono profundo | min | Apple Watch |
| **Hidratação** | Copos d'água | copos | manual |
| **Outros** | SpO₂ | % | Apple Saúde |
| **Outros** | Temperatura | °C | manual |
| **Outros** | Estresse | índice | Apple Watch |

### Empty states

- **Categoria sem dados:** card cinza com "Conecte um dispositivo" + atalho pra Dispositivos
- **Métrica sem dados:** card sem sparkline + valor "—" + texto "Sem registro"
- **Sem dispositivos conectados:** banner topo `amber-500/20` "Conecte um wearable pra começar a coletar" + CTA

### Cores e padrão

- Fundo: `slate-950`
- Cards: `slate-900` border `slate-800`
- Tabular-nums em todos os números, valores e deltas
- DM Sans + IBM Plex Mono
- Sparkline: gradient suave da cor da categoria, 1.5px stroke, sem fill (apenas line)
- Padding lateral: 16px
- Espaçamento entre categorias: 20px

## Configuration

- shell: true
