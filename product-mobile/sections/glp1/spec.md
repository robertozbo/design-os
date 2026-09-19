# GLP-1 Specification

## Overview

Módulo de acompanhamento para quem usa análogo de GLP-1 (semaglutida, tirzepatida,
liraglutida, retatrutida). Junta as duas coisas que o paciente hoje controla em
bloco de notas e print de balança:

1. **Medicação** — o que usa, qual dose, com que frequência, onde aplicou, quanto doeu.
2. **Evolução de peso** — peso inicial → peso atual → meta, com projeção até a data alvo.

> **Não é prescrição.** O Nymos organiza e mostra tendência. Dose e ajuste são
> decisão do médico — a tela diz isso em texto, no rodapé.

## Entrada pelo Dashboard

Card `Glp1Mini` na **Início**, logo abaixo das quick actions (Nutrição · Atividades ·
Treinos). Dois estados:

| Estado | Conteúdo |
|---|---|
| **Convite** (`configurado: false`) | Card tracejado "Usa GLP-1? Acompanhe aqui" + botão **Iniciar** `teal-500` → abre o wizard |
| **Ativo** | Medicamento + dose, peso atual, kg perdidos, sparkline de 7 pesos, kg que faltam pra meta, próxima dose e botão **Nova dose** |

O botão do rodapé é **Nova dose** e faz deep link — `/mobile/sections/glp1?dose=nova`
entra na section com o modal de aplicação já aberto (prop `abrirNovaDose`). O corpo do
card continua levando ao painel.

**O onboarding roda uma vez.** Depois de configurado, o card nunca mais mostra "Iniciar":
o wizard só reabre quando o paciente toca na engrenagem do card de protocolo, dentro da
section, e aí vem pré-preenchido.

## User Flows

- Paciente sem configuração → toca em **Iniciar** → **wizard de 6–7 passos** → o modal de
  aplicação abre emendado ("Agora registre sua primeira dose") → painel com a primeira dose
  e o peso do dia já lançados
- Paciente configurado → toca no card → painel com stats, gráfico e histórico
- Paciente toca **Nova dose** no card da Início → cai na section com o modal já aberto
- Paciente toca **Nova dose** → modal único (local, dose, medicamento, dor, efeitos
  colaterais, observação, peso do dia) → **Salvar aplicação** → modal fecha, toast confirma
  e a tela rola até o **gráfico de evolução**, que pulsa por ~3s
- Paciente toca na engrenagem do card de protocolo → reabre o wizard **pré-preenchido**
  (trocou de medicamento, subiu a dose, mudou a meta)
- Paciente toca "Compartilhar com meu médico" → handoff pro módulo de profissionais

## UI Requirements

### 1. Wizard de configuração (`SetupWizard`)

Tela cheia, uma pergunta por passo, no padrão do onboarding: chevron de voltar +
barra de progresso fina no topo, pergunta em 21px bold, lista de opções em cards
`rounded-xl` com radio à direita, botão **Continuar** fixo no rodapé (cinza enquanto
desabilitado, `teal-500` quando libera).

| # | Passo | Conteúdo |
|---|---|---|
| 1 | Medicação | 17 opções do catálogo (Mounjaro®, TG, Tirzepatida Composta, LipoLass®, Ozivy®, Retatrutida, Tirzec®, Tirzedral®, Ozempic®, Wegovy®, Semaglutida Composta, Zepbound®, Olire®, Rybelsus®, Saxenda®, Liraglutida Composta, Outro). Sublabel: princípio ativo · tipo · via |
| 2 | Dose atual | Escala de titulação **do fármaco escolhido** + "Dose personalizada" (input mg) + "Ainda não sei" |
| 3 | Frequência | Diariamente · Semanalmente · A cada duas semanas · Mensalmente · Outro · Ainda não sei. Subtítulo: "Para enviarmos lembretes no dia certo" |
| 4 | Agenda | Dia da semana (some quando frequência é diária) + chips de horário + toggle de lembrete. **Passo condicional**: não aparece em "Outro"/"Ainda não sei" |
| 5 | Dados | Data de nascimento (opcional), altura e peso atual (**obrigatórios**, asterisco âmbar no label) — **pré-preenchidos** do perfil/métricas, com badge `✓ do seu perfil` e banner verde "Achamos parte dos seus dados". Campo sem dado ganha label âmbar "falta preencher". Mostra IMC calculado ao vivo |
| 6 | Meta | Peso alvo (28px mono) + data alvo. Feedback ao vivo: "Perder 9,6 kg em 14 semanas · 0,71 kg/semana". Acima de **1% do peso/semana** o bloco vira âmbar e sugere esticar o prazo |
| 7 | Resumo | Todas as escolhas em linhas label/valor + disclaimer clínico. Botão "Começar acompanhamento" |

Campo obrigatório leva `*` âmbar; o resto é marcado `opcional` em cinza. Quando o
**Continuar** está travado, uma legenda âmbar abaixo dele diz o que falta — nos três
passos em que a causa não é óbvia:

| Passo | Legenda |
|---|---|
| Agenda | "Escolha o dia da semana e o horário" (só o que faltar) |
| Dados | "Preencha a altura e o peso atual" (só o que faltar) |
| Meta | "Informe o peso alvo" · "O peso alvo precisa ser menor que o atual" · "A data alvo precisa ser pelo menos uma semana à frente" |

O wizard é reaproveitado para **reconfigurar** — recebe `inicial` com os valores atuais.

### 2. Painel configurado

Ordem vertical:

1. **Card de protocolo** — medicamento + dose (mono teal), frequência · dia · horário,
   "semana N de tratamento", engrenagem de ajuste. Faixa de próxima dose com 3 estados:
   `teal` (hoje), `slate` (futura), `rose` + ícone de alerta (atrasada). Botão
   **Nova dose** full width `teal-500`.
2. **Stats** — grid 2×2: Peso atual (+ IMC e classificação), Já perdeu (kg + % do peso
   inicial), Falta pra meta (kg + dias restantes), Adesão (% + doses aplicadas/esperadas).
   Abaixo, faixa **Ritmo atual vs. Necessário** com chip `no prazo` / `adiantado` / `atrasado`.
3. **Gráfico de evolução** — SVG 320×168. Linha sólida `teal-400` no passado, tracejada
   no projetado, área com gradiente, linha pontilhada âmbar na meta (com o valor à direita),
   pontinhos `sky-400` no eixo marcando aplicações, ponto atual com halo. Toggle 30D · 90D · TUDO.
4. **Histórico de aplicações** — data/hora, medicamento + dose, sítio com ícone de pin,
   peso do dia, chip de dor colorido por faixa (0–2 emerald, 3–5 amber, 6–8 orange, 9–10 rose),
   chips âmbar de efeito colateral e observação em linhas próprias. Últimas 5 + "Ver todas".
5. **Compartilhar com meu médico** + disclaimer.

**Painel zerado (logo após o wizard).** Sem aplicação, o histórico vira card tracejado
"Nenhuma aplicação registrada" com botão **Registrar primeira aplicação**.

**Painel com uma pesagem só.** O gráfico já nasce completo: quando não vem projeção do
backend, a curva é traçada do peso de hoje até a meta na data alvo, em passos semanais —
mesmo desenho de sempre (área em gradiente, linha de meta âmbar, ticks), com a área a 60%
de opacidade porque é projeção, não histórico. Nesse estado o header troca o delta por
`ponto de partida` e o chip de projeção dá lugar à nota: "A tracejada é o ritmo necessário
pra bater a meta. Registre o peso a cada aplicação — na segunda pesagem a curva passa a
seguir o seu ritmo real."

> Um ponto não fecha polígono: a área tem que cobrir o trecho projetado aqui, senão o card
> fica com a tracejada solta no escuro e perde justamente o destaque da queda.

### 3. Modal de nova dose (`NovaDoseModal`)

**Tudo numa tela só** — bottom sheet `rounded-t-3xl` até 94% da altura, corpo rolável,
botão fixo no rodapé. Seis blocos numerados:

1. **Medicamento** — o do protocolo já selecionado, com "Trocar" que expande a lista inline
2. **Dose aplicada** — chips da escala do fármaco + "Outra" (input mg). Nota quando é a mesma do protocolo
3. **Local da aplicação** — `MapaSitios`: 8 zonas (abdômen ×4, coxa ×2, braço ×2).
   Zona usada nas 2 últimas doses ganha "usado recentemente" âmbar; 3× seguidas vira
   alerta rose "alterne de zona" (lipodistrofia)
4. **Nível de dor** — slider 0–10, número 34px mono colorido por faixa + label. Em ≥7,
   abre bloco âmbar com as 4 dicas de aplicação
5. **Efeitos colaterais** (opcional) — 12 chips multi-select das reações mais frequentes
   (náusea, vômito, diarreia, constipação, azia, dor abdominal, dor de cabeça, cansaço,
   tontura, sem apetite, arrotos, reação no local) + chip **Nenhum**, que é exclusivo.
   Marcado vira âmbar; o histórico mostra os chips abaixo da linha da aplicação
6. **Observação** (opcional) — textarea 280 chars com contador
7. **Quando** (opcional) — datetime-local default "agora" + campo "Peso de hoje"

Botão **Salvar aplicação** desabilitado até ter dose e local; a legenda abaixo diz
qual dos dois falta.

### Pós-salvamento

Modal fecha → toast `teal-500` "Aplicação registrada" (2,6s) → `scrollIntoView` no
gráfico, que fica com borda `teal-400` + halo por 2,8s. A aplicação entra no histórico
e, se o paciente informou peso, o último ponto real do gráfico atualiza e os stats
recalculam (perdido, falta, ritmo, adesão, próxima dose).

### Cores e padrão

- Fundo `slate-950`, cards `slate-900` com border `slate-800`, `rounded-2xl`
- Primário `teal-400/500` · meta `amber-400` · ganho `emerald-300` · aplicação `sky-400`
- Números sempre `font-mono tabular-nums`; vírgula decimal (pt-BR)
- Padding lateral 16px, espaço entre blocos 16px

## Dados

`data.json` traz um paciente na semana 12: Mounjaro® 5 mg semanal (quarta, 20:00),
96,4 kg → 87,6 kg, meta 78 kg até 20/12/2026, 11 de 12 doses (adesão 92%), 8 aplicações
no histórico e 27 pontos de peso (13 reais + 14 projetados).

Screen designs:
- `Glp1.tsx` — painel de quem já configurou. Aceita `?dose=nova` na URL pra entrar com o
  modal de aplicação aberto (é onde o botão do card da Início cai)
- `Glp1Setup.tsx` — primeiro acesso (`configuracao: null`) com o wizard
- `Glp1PrimeiraDose.tsx` — semana 1: uma aplicação, uma pesagem. Estado em que a curva é
  só projeção, sem ter que passar pelo wizard a cada verificação
- Na section **Início**, `InicioGlp1Convite.tsx` mostra o card no estado não-configurado

Backend esperado: `glp1_protocols` (configuração), `glp1_applications` (aplicações),
reuso de `metrics` (weight/height) e `users` (birthDate, sex) para o prefill.
`glp1_applications.sintomas` guarda os efeitos colaterais marcados (array de `SintomaId`).

Fora do escopo: titulação sugerida por IA, leitura de caneta por foto, integração com
farmácia. O log de sintomas por dia continua em Medicação — aqui só entra o que o
paciente marca no registro da aplicação.

## Configuration

- shell: true
