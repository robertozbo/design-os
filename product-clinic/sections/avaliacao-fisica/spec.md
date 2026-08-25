# Avaliação Física Specification

## Overview
A **antropometria e a composição corporal do paciente**, medidas dentro da clínica e compartilhadas entre a **nutrição** e a **educação física**. É a mesma tela para os dois conselhos porque é o mesmo corpo: sem um lugar comum, o nutricionista abre o adipômetro numa terça, o educador físico abre na quinta, e o paciente sai com dois percentuais de gordura diferentes e nenhum jeito de saber qual envelheceu.

Traz da vertical Personal o formulário completo — **oito protocolos de dobras cutâneas**, com as equações verbatim do motor que a Nymos já usa em produção (`backend/src/lib/body-composition/`) — e acrescenta o que só existe na clínica: o histórico é do **paciente**, não do profissional, e quem mediu vira uma coluna, não uma parede.

Não confundir com `acompanhamento`, que é o que o **paciente** compartilha pelo app (auto-medição, `avaliadoPor: null`). Aqui é **ato profissional**: alguém mediu, alguém assina, e o parecer vira evolução no prontuário compartilhado. `id: avaliacao-fisica`. Nested em Pacientes.

## User Flows

### Medir (nutricionista ou educador físico, mesma tela)
- Abre a avaliação a partir da ficha do paciente → cabeçalho com paciente, conselho de quem avalia e objetivo combinado
- Quatro blocos colapsáveis: **Básico** (peso, estatura, IMC) · **Dobras cutâneas** · **Circunferências** · **Bioimpedância** · **Parecer**
- O bloco que já abre depende do conselho: **CREF** abre em Dobras (adipômetro), **CRN** abre em Circunferências (fita e balança). Os dois blocos existem para os dois — o que muda é o que está na frente
- Escolhe o **protocolo**; a tela mostra a equação, a referência e a população em que foi validada
- **Nenhuma dobra some** ao trocar de protocolo: as exigidas ganham anel teal e um ponto, as demais recuam para 40% de opacidade e voltam no hover. Continuam editáveis — a medida vale mesmo fora do cálculo
- O painel à direita **recalcula a cada tecla**: IMC, Σ das dobras, densidade, % de gordura, massa gorda e magra, RCQ, RCE, CMB, fracionamento em 4 compartimentos, TMB, GET e as metas diárias
- "Salvar rascunho" a qualquer momento · "Concluir avaliação" fecha e gera a evolução no Prontuário
- Cada bloco pode ser pulado: a avaliação que só mediu peso e cintura continua valendo

### Ler o histórico do paciente (histórico da clínica)
- Lista **por paciente**, com KPIs da clínica no topo (avaliações, pacientes avaliados, % com dobras, rascunhos pendentes)
- Filtro por conselho (Todas · Nutrição · Educação física) — filtra a leitura, não esconde o dado do colega
- Cada paciente mostra o estado atual (peso, IMC, % de gordura, massa magra) com o delta desde a avaliação anterior, a linha do tempo das avaliações (data · quem mediu · protocolo · peso · %G) e a curva de peso em barras
- Rascunho aparece marcado na linha do tempo

### Comparar duas datas
- Seletores de **referência** e **atual**, ambos sobre a série do mesmo paciente
- Tabela métrica a métrica: valor na referência, Δ, valor atual. Linha com os dois lados nulos é filtrada
- Séries em SVG inline (peso, % de gordura, massa magra, cintura) com a linha tracejada da meta
- Exportar laudo em PDF · Enviar a evolução ao app do paciente

## UI Requirements

### Formulário (`NovaAvaliacaoForm`)
- Barra fixa: sair (X) · avatar no tom do conselho · nome, idade, sexo, convênio · chip "Avaliação física · {conselho}" · chip do objetivo · avaliador e registro · "Salvar rascunho" · "Concluir avaliação" (teal)
- Faixa rose com a observação crítica quando existir
- Corpo em duas colunas no `lg` (formulário + 380px de resultado, sticky), empilhado no mobile
- Campo numérico: rótulo em mono 10px uppercase, unidade dentro da borda, hint embaixo. Campo derivado é read-only em teal com hint "auto-calculado"

### Protocolos (equações verbatim do backend)
| Protocolo | Dobras ♂ | Dobras ♀ | Idade |
|---|---|---|---|
| Jackson-Pollock 3 | peitoral, abdominal, coxa | tríceps, supra-ilíaca, coxa | sim |
| Jackson-Pollock 7 | peitoral, axilar média, tríceps, subescapular, abdominal, supra-ilíaca, coxa | idem | sim |
| Durnin-Womersley | bíceps, tríceps, subescapular, supra-ilíaca | idem | sim |
| Guedes | tríceps, supra-ilíaca, abdominal | coxa, supra-ilíaca, subescapular | não |
| Petroski | subescapular, tríceps, supra-ilíaca, panturrilha | axilar média, supra-ilíaca, coxa, panturrilha | sim |
| Faulkner | tríceps, subescapular, supra-ilíaca, abdominal | idem | não |
| Yuhasz | tríceps, subescapular, supra-ilíaca, abdominal, coxa, panturrilha | idem | não |
| Slaughter-Lohman | tríceps, panturrilha | idem | não (8–18 anos) |

### Estados & regras
- **Nenhum resultado é armazenado.** Tudo é derivado das medidas a cada tecla — número derivado guardado ao lado da medida que o gerou é a mesma armadilha do peso que muda sem o IMC acompanhar
- **A Σ soma só as dobras exigidas pelo protocolo, e é `null` se faltar uma.** Uma soma que ignora o sítio que faltou não é soma parcial: é um número menor apresentado como se fosse o certo
- Sem dado, o campo mostra **"—" e diz o que falta** ("Falta medir: Axilar média · Panturrilha"). Zero no lugar do desconhecido é a mentira mais fácil da tela, porque zero também é um percentual de gordura plausível
- **Um só % de gordura por avaliação.** Se a bioimpedância for a fonte, a tela marca "por bioimpedância" e o cálculo das dobras sai de cena. Dois percentuais na mesma avaliação é o começo de um laudo que ninguém sabe ler
- **A TMB do aparelho vence a estimada** — o aparelho mediu, a equação estima
- **A cor segue a direção desejável, nunca o sinal aritmético**: massa magra, CMB e TMB caindo é piora. Perder peso derrubando músculo é exatamente o achado que a avaliação existe para flagrar
- Validação por faixa, não por obrigatoriedade: peso 20–300 kg, estatura 100–250 cm, dobra 2–80 mm, circunferência por sítio. Fora da faixa o campo fica em rose e o rodapé trava com "Corrija os campos em vermelho"
- Concluir exige peso e estatura ("Informe peso e estatura para concluir"); rascunho salva sem eles
- Protocolo com população restrita (Slaughter-Lohman, Petroski ♀) mostra o aviso em âmbar junto da equação
- Comparativo entre protocolos diferentes **avisa**: parte da diferença de %G é do método, não do paciente

### Classificações (tabelas do backend)
- **% de gordura** — Pollock & Wilmore (1993), por sexo e faixa etária (≤25, ≤35, ≤45, ≤55, 55+), seis níveis de "Muito baixo" a "Muito alto"
- **IMC** — OMS: Magreza · Eutrófico · Sobrepeso · Obesidade I/II/III
- **RCQ** — OMS: ♂ 0,90/1,00 · ♀ 0,80/0,85
- **Cintura** — OMS/NIH: ♂ 94/102 · ♀ 80/88
- **CMB** — Frisancho (1981) P50 + adequação de Blackburn (≥90% eutrofia)
- **Fracionamento** — Matiegka com residual de Würch (♂ 24,1% · ♀ 20,9%); ossos exige diâmetros que esta avaliação não coleta e fica em zero

### Gasto energético e a ponte com o plano
- **TMB por Katch-McArdle** (370 + 21,6 × massa magra) — a avaliação mede a massa magra, então a equação que parte dela é melhor que estimar por peso e altura
- **GET** = TMB × fator de atividade (1,2 · 1,375 · 1,55 · 1,725 · 1,9)
- **Metas diárias derivadas** (proteína, carboidrato, gordura, fibra, água) com os coeficientes de `ai-insights/utils/rda-guidelines.ts`. É aqui que a avaliação deixa de ser laudo e vira insumo: sem essa ponte, a nutricionista mede a composição numa tela e digita a meta calórica noutra, à mão
- **Peso-alvo por Behnke**, a partir da massa magra atual e da meta de % de gordura — peso-alvo por IMC ignora quanto daquele peso é músculo

## Design Notes
- Nymos (teal nas ações, DM Sans), light/dark, props-based, sem fetch interno
- Gráficos em **SVG inline** e barras CSS — sem biblioteca
- O motor de cálculo vive em `components/formulas.ts` e é **cópia verbatim** de `backend/src/lib/body-composition/protocols.ts` + `norms.ts`. Não redesenhe equação aqui: o número que sai desta tela vai para o prontuário, e precisa ser o mesmo que a clínica já calcula
- Três screen designs sobre um `data.json` só: `AvaliacaoFisicaLista` (histórico), `AvaliacaoFisicaNova` (formulário) e `AvaliacaoFisicaComparativo` (evolução)
- Referências: `product-personal/sections/avaliacoes` (formulário original) e a tela de atendimento de nutrição em `product-clinic/sections/atendimento`, que registra o peso do dia mas não faz avaliação — as duas se completam, não se repetem
