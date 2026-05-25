# Medicação Specification

## Overview
Tab do paciente Nymos Clínico — espelho da prescrição emitida pelo médico via Memed. Foco único: **medicação ativa, lembretes do dia, adesão e histórico de receitas**. Não duplica funções de tracking de sinais vitais (peso/glicemia/PA estão em Métricas do app Nymos). Aparece apenas pra pacientes vinculados a um médico Nymos Clínico.

## User Flows

- Paciente vinculado abre tab Medicação → vê card "Hoje" com adesão da semana + doses do dia
- Toca dose pendente → marca como cumprido (otimista + toast emerald)
- Long-press → "Adiar 30min" / "Não tomei" (com motivo opcional)
- Rola → vê lista de medicações ativas (cada uma com posologia, data início, adesão 30d, atalho pra receita)
- Toca em "Ver receita →" → abre Memed (PDF/QR code mostrável na farmácia)
- Rola até "Histórico de receitas" → vê últimas alterações (ajustes de dose, novas medicações, descontinuações) com data + médico
- Toca em receita do histórico → abre detalhe read-only com motivo da prescrição (se anotado pelo médico)
- Push de lembrete chega no horário; tap leva direto pra confirmação da dose

## UI Requirements

### Estrutura geral
- Dark mode default (`bg-slate-950`)
- Wrapper `data-nymos-mobile` com DM Sans (body) e IBM Plex Mono (números/horários)
- Padding lateral 16px (mx-4)
- Bottom-nav existente do app (fora deste componente)

### Header
- Título "Medicação" (20px font-semibold slate-50)
- Sub-header: avatar pequeno + "Dr. Pedro Lima · Endocrinologista" (12px slate-400) — reforça que essas prescrições vêm de um médico Nymos vinculado
- Em pacientes não-vinculados a um médico Nymos Clínico: estado vazio "Você ainda não está vinculado a um médico. Use o código de convite pra liberar essa aba." (não deveria ser acessível, mas defensive)

### Bloco 1 · Hoje (MedicacaoHojeCard)
Card único `rounded-2xl bg-slate-900 border border-slate-800 p-4 mx-4`:
- Header esquerdo: "Adesão semana" + percentual em emerald-400 mono bold
- Header direito: 7 dots horizontais (S T Q Q S S D) — cumprido emerald · perdido rose · parcial amber · hoje teal pulsing · futuro slate-700
- Divider sutil
- Lista de doses do dia ordenadas por horário:
  - Cumprido (☑ emerald-400) → texto slate-400 line-through
  - Pendente (○ slate-600) → texto slate-100 bold (tap marca)
  - Em Nh (⏰ amber-300 + "em 4h" amber mono) → não-clicável
- Adesão <60% últimos 7d: banner amber acima do card "Bora retomar o ritmo?"

### Bloco 2 · Medicações Ativas
Header `MEDICAÇÕES ATIVAS` em text-slate-400 text-[11px] uppercase tracking-wider mx-4.

Lista vertical de cards (`rounded-2xl bg-slate-900 border-slate-800 p-4 mx-4 mb-2`):
- Linha 1: ícone Pill em rounded-xl bg-teal-500/15 + nome+dose (slate-100 15px semibold) com font-mono na dose
- Linha 2: posologia (slate-400 12px) — ex: "1x ao dia · 07h · em jejum"
- Linha 3 (chips inline): início (slate-500 11px mono) · duração ("contínua" / "30 dias") · próxima dose se relevante
- Linha 4: barra horizontal de adesão 30d (`Adesão 30d: 96%` + mini barra emerald/slate-800)
- Footer: link "Ver receita Memed →" alinhado à direita, teal-300 12.5px
- Tap no card → expande pra mostrar mais detalhes (orientações do médico se houver)

Sem medicação ativa: card vazio "Nenhuma medicação ativa." (slate-500 italic)

### Bloco 3 · Histórico de Receitas
Header `HISTÓRICO DE RECEITAS` em uppercase tracking.

Lista compacta (rows finas, sem card individual):
- Row: bullet • + data (mono 11px slate-500) + título da alteração + médico (slate-400 12.5px)
- Exemplos:
  - "28/abr · Levotiroxina · ajuste de dose pra 75mcg · Dr. Pedro"
  - "12/fev · Metformina + Ozempic prescritos · Dr. Pedro"
  - "05/dez · Levotiroxina iniciada 50mcg · Dr. Pedro"
- Footer: link "Ver todas →" pra abrir lista completa (subtela)

### Estados
- **Cumprido (sucesso):** toast emerald "Dose marcada · cumprido"
- **Hipo ou adesão crítica:** sem alerta automático nessa tela (a tela de Métricas já tem alertas de sinais; aqui o foco é só medicação)
- **Receita renovada pelo médico:** sistema dispara push "Sua receita de Levotiroxina foi renovada · disponível no Memed" e mostra badge na tab por 24h
- **Offline:** marcar dose entra na queue local; toast slate "Sem conexão · vai sincronizar"

### Tokens / visual
- teal-500 → ações primárias (botões de ver receita)
- emerald-400 → cumprido / adesão
- amber-300 → dose futura / alerta leve
- rose-300 → perdida / crítico
- slate-50/100 → primário · slate-400 → secundário · slate-500/600 → terciário
- Mono em horários, doses, percentuais
- Touch targets ≥44pt
- active:scale-[0.99] em tappables

## Extensão GLP-1 (Ozempic / Wegovy / Mounjaro / Rybelsus / Orforglipron)

Quando o paciente tem medicação ativa com `categoria = glp1_injetavel` ou `glp1_oral`, blocos adicionais aparecem **acima** do "Hoje" e cards específicos substituem/complementam a `MedicacaoAtivaCard`. Não duplica módulos existentes (peso, nutrição, atividade vivem em suas sections).

### Tipo de fármaco → UI

| Categoria | Via | Frequência | Card específico | Mapa de sítio | Curva PK | Log de sintoma |
|---|---|---|---|---|---|---|
| `glp1_injetavel` | subcutânea | semanal | `MedicacaoSemanaCard` | sim (8 zonas) | sim | sim |
| `glp1_oral` | oral | diária | `MedicacaoOralCard` | não | sim (estável, sem pico) | sim |
| `outros` | oral | diária | `MedicacaoAtivaCard` (legado) | não | não | não |

### Bloco 0 · Curva PK (CurvaPKCard)
**Aparece quando há pelo menos uma medicação GLP-1 ativa.** Posicionada **acima** do "Hoje".

- Header esquerdo: nome do fármaco + "Nível estimado" (label, sem unidade absoluta)
- Header direito: status semáforo grande em mono — **No pico · Subindo · Caindo · Vale**
- Tabs período: `14D · 30D · 90D` (tab pill bg-slate-800 com active bg-slate-700 text-slate-100)
- Gráfico SVG: curva slate-300 (linha sólida pra histórico, tracejada pra projeção até próxima dose)
- Linha vertical sutil em "Hoje" (slate-600 dashed) com pin do nível atual
- Picos sutis sem labels numéricos invasivos
- Disclaimer fixo no rodapé (slate-500 11px): "Estimativa baseada em farmacocinética populacional. Não substitui medição clínica."

### Bloco 1 · Hoje + Próxima dose

- Quando há GLP-1 semanal ativo, **substitui** o card "Hoje" tradicional por `MedicacaoSemanaCard`:
  - Header esquerdo: "Próxima: sex 22/05 · em 3 dias" (mono na data)
  - Barra de progresso entre doses (% do intervalo já passado · teal-500)
  - Sub-header: "Última: Ozempic 0,5mg · 15/05 · Abdômen sup. esq."
  - 7 dots da semana (S T Q Q S S D) com estados (cumprido emerald · dia da aplicação teal pulse · futuro slate-700)
  - CTA "Aplicar dose" (botão teal-500 full-width) ativo no dia da aplicação ou ±24h
- Quando há GLP-1 oral, coexiste com o card "Hoje" tradicional — o comprimido aparece também como dose do dia, mas adicionalmente mostra-se `MedicacaoOralCard`:
  - Streak de dias consecutivos ("12 dias consecutivos · siga firme") em emerald-400 mono
  - Lembrete janela em jejum (Rybelsus exige 30min antes de comer/beber)
  - CTA "Marcar comprimido" (teal-500) quando ainda não tomou hoje

### Bloco 2.1 · Medicações Ativas — GLP-1 detalhe

Quando o paciente tap no card de uma medicação GLP-1, **expande** mostrando:
- Histórico das últimas 3 injeções (data + sítio + dor) com link "Ver todas →"
- Última leitura de food noise (Pensamentos alimentares X/10) com seta de tendência
- CTA "Registrar sintomas" (link teal-300)

### Bloco 4 · Fluxo Registrar Injeção (modal full-screen)

Step 1 · **Sítio**
- Mapa visual com 8 botões nomeados (v1 — botões; v2 — ilustração corporal):
  - Abdômen sup. esq. · sup. dir. · inf. esq. · inf. dir.
  - Coxa esq. · dir.
  - Braço esq. · dir.
- Sítio usado nas últimas 2 doses → label "usado recentemente" amber
- Sítio usado 3x consecutivas → alerta "Risco de lipodistrofia · alterne para outra zona"

Step 2 · **Dor**
- Slider 0-10 com labels semânticos a cada nível:
  - 0-2: "Sem dor / Leve"
  - 3-5: "Moderada"
  - 6-8: "Forte"
  - 9-10: "Insuportável"
- Se dor ≥ 7: dica educativa pós-confirmação ("Gire o sítio · injete devagar · temperatura ambiente reduz dor")

Step 3 · **Confirmar**
- Resumo: fármaco · dose · sítio · dor · hora
- CTA "Confirmar aplicação" (teal-500)
- Pós-confirmação: toast emerald + agenda push 24h ("Como você está? Registre sintomas.")

### Bloco 5 · Fluxo Registrar Sintomas (modal full-screen)

Sliders 0-10 (label semântico "Sem · Leve · Moderado · Forte · Severo"):
- **Náusea**
- **Refluxo / azia**
- **Pensamentos alimentares** ⭐ (label de ajuda: "Quanto você pensou em comida hoje, fora das refeições?")
- **Fadiga**
- **Diarreia**
- **Constipação**

Textarea opcional "Outros sintomas / observações" (max 280 chars).

CTA "Salvar registro" — vincula automaticamente à injeção mais recente nos últimos 7 dias.

### Tokens visuais (GLP-1)
- teal-500 → CTA aplicar/marcar
- emerald-400 → cumprido, streak, food noise baixa
- amber-300 → alerta de rotação de sítio · dor moderada
- rose-300 → dor forte/perdida · food noise alta consistente
- slate-300/400 → linha do gráfico PK · valores neutros
- Mono em datas, doses, percentuais, valores 0-10

### Escopo NÃO incluso (GLP-1)
- Ajuste de dose pelo paciente → só endo via nova receita Memed
- Estimativa de eficácia ("você vai perder X kg") → minha-saude, com cautela
- Mostrar concentração em mg/dL ou µg/mL → nunca (modelo é populacional)
- Foto do sítio de aplicação → V2 (privacy)
- Quick-add inline de água/calorias/peso → ficam nas suas sections (nutricao/metricas)

## Escopo NÃO incluso
- Peso, glicemia, pressão → em Métricas do app
- Lembrete manual criado pelo paciente → não existe (deriva só do Memed)
- Edição de posologia pelo paciente → não existe (só médico via nova receita)
- Solicitação de renovação pelo paciente → V2 (vai por Mensagens canal clínico no V1)

## Configuration
- shell: false
