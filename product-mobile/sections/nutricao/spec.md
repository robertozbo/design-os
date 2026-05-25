# Nutrição Specification

## Overview

Diário alimentar do paciente — tela onde ele **registra o que comeu** e vê progresso vs meta diária. Combina histórico (NutritionMeal logs do backend) com plano prescrito (PatientDiet/DietTemplate quando ativo) e meta diária (NutritionGoal). Layout por refeição (Café da manhã / Almoço / Lanche / Jantar) com cards expandíveis. Acessada via Quick Action "Nutrição" no Início.

## User Flows

- Usuário toca Nutrição → vê dia atual com totais agregados (kcal, P/C/G)
- Usuário muda dia: ontem / hoje / amanhã (date picker horizontal ou setas)
- Usuário toca refeição expandida → vê items registrados + ainda planejados
- Usuário toca "+ Adicionar alimento" numa refeição → abre busca/foto (Pro: IA estima kcal de foto)
- Usuário marca refeição planejada como consumida → atualiza progresso
- Usuário vê pill "Plano de Hoje" no topo (se houver PatientDiet ativo) → link pro plano completo
- Empty state: "Registre sua primeira refeição" + atalho pra escanear foto/buscar alimento

## UI Requirements

### Header (sub-page)

- Back `<` + título "Nutrição" + subtítulo dia formatado ("Hoje · 04 mai")
- Ações: 🔍 search + ➕ add (padrão)

### Day picker (logo abaixo do header)

Strip horizontal:
- Setas `<` `>` pra navegar dias
- Centro: chip selecionável com data ("Hoje", "Ontem · 03/05", "Amanhã · 05/05")
- Tap nas setas muda dia + recalcula stats

### Calorie ring + macro bars

Card hero com:
- **Anel de calorias** (esquerda, ~140px): consumidas vs meta diária. Centro mostra "kcal restantes" em mono grande
- **Macros bars** (direita): 3 barras horizontais finas (Proteína / Carbo / Gordura) com:
  - Label + valor mono "32g · 80g"
  - Barra preenchida proporcional a meta. Cor: P=`emerald`, C=`amber`, G=`rose`
  - Pequeno % à direita

### Plano de Hoje pill (condicional)

Se PatientDiet ativo:
- Pill horizontal `teal-500/8` border-l-3 `teal-500`
- Ícone Utensils + "Plano XP-12 · por Dra. Ana" + chevron
- Tap → abre detalhe do plano

### Refeições (lista)

Para cada NutritionType (Café/Almoço/Lanche/Jantar) — render mesmo se vazio:

- Card `slate-900` border `slate-800` `rounded-2xl`:
- **Header (sempre visível, tappable pra colapsar/expandir):**
  - Ícone hora à esquerda em fundo da cor (`amber` café, `teal` almoço, `violet` lanche, `rose` jantar)
  - Nome refeição + horário planejado (ex: "Almoço · 13:30")
  - Direita: contador "X de Y refeições" se plano ativo, ou só kcal consumida ("420 kcal")
  - Status dot: emerald se completo, amber se em andamento, slate se vazio
- **Body (expandido, default expandido se for refeição corrente do horário):**
  - Lista de NutritionMeal já registrados: nome porção + qty + kcal + P/C/G mono pequeno
  - Linha "+ Adicionar alimento" no final (atalho pra search ou camera)

### Floating sheet "Adicionar alimento"

Quando usuário toca search/+:
- Bottom sheet
- Tabs no topo: **Buscar** / **Foto IA (Pro)** / **Recentes** / **Favoritos**
- Buscar: input + lista de NutritionType matches
- Foto IA: prompt "Tire foto do prato — IA estima kcal e macros" com botão câmera
- Cada item tem: ícone, nome, kcal/100g, botão "+" pra adicionar com qty

### Quando não há plano ativo

- Pill "Plano de Hoje" some
- Refeições genéricas continuam (Café/Almoço/Lanche/Jantar) sem alvo por refeição — só meta diária

### Empty states

- **Sem registros ainda hoje:** ilustração discreta + "Registre sua primeira refeição" + 2 botões (busca + foto IA)
- **Sem meta definida:** banner topo `amber-500/20` "Defina sua meta diária pra ver progresso" + CTA

### Cores e padrão

- Fundo: `slate-950`
- Cards: `slate-900` border `slate-800`
- Macros: P=`emerald-400`, C=`amber-400`, G=`rose-400`, Fibra=`teal-400`, Sódio=`sky-400`
- Tabular-nums em todos números (kcal, g, %)
- DM Sans + IBM Plex Mono

## Configuration

- shell: true
