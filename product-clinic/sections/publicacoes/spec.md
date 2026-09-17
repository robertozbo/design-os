# Publicações Specification

## Overview
A fila de conteúdo da clínica para o Instagram: o profissional **dita ou escreve uma pauta**, a IA
devolve um post pronto (legenda, hashtags e os cartões no template da marca), e alguém **revisa
antes de agendar**. Nada sai sozinho. Rota própria (`/clinic/sections/publicacoes`), grupo
**Operacional** do admin.

É a superfície do **add-on pago Marketing** — o único módulo da clínica com cota própria
(`N posts/mês`) porque tem custo variável de IA e de publicação. A tela mostra a cota onde ela
importa (no header e na hora de gerar), nunca como banner.

O que a torna diferente de um Buffer com IA é a camada do meio: **conselho de classe**. Antes e
depois, promessa de resultado e foto de paciente são vedados pelo CFN 599/2018 e pelo CFM
2.336/2023 — então o post que infringe **não chega a poder ser agendado**, e a tela diz qual regra
e qual trecho.

> **Fora desta section:** o **app mobile do profissional** (ditar post do celular entre consultas)
> é **ferramenta separada** — produto próprio, não uma tela do app do paciente. Esta section é só o
> painel web da clínica.

## User Flows
- Vê a **fila** de publicações com tema, formato, status e quando vai ao ar. Filtra por
  **Tudo / Revisar / Agendados / Publicados / Problemas**.
- **Ditar post** → grava, a transcrição aparece, e a IA extrai um **brief estruturado** (tema, tom,
  formato, data) com todos os campos editáveis antes de gerar. É o caminho principal: uma frase
  falada vira post.
- **Novo post** manual → o mesmo brief, digitado. Mesmo destino, sem microfone.
- Seleciona uma publicação e vê o **preview fiel ao Instagram** — cartão 4:5, legenda truncada no
  "mais", hashtags separadas, carrossel navegável slide a slide.
- **Editar a legenda** direto no preview. Salvar reabre a revisão: post editado volta para
  *Revisar*, nunca continua aprovado por inércia.
- **Refazer** com instrução ("mais curto", "sem emoji", "cita a consulta"). Conta uma versão e
  gasta cota — o contador de versões fica visível por isso.
- **Agendar** para data e hora, ou **publicar agora**. Agendar exige que não haja alerta de
  bloqueio pendente.
- **Excluir** rascunho ou agendado. Publicado não se exclui por aqui — sai pelo Instagram, e o link
  fica registrado.
- Post **bloqueado** mostra a regra, o trecho e o que fazer: editar o trecho ou refazer. Aviso
  (não bloqueio) deixa agendar com o alerta reconhecido.
- Post que **falhou** mostra o motivo em português e o botão de tentar novamente. `token_expirado`
  leva a reconectar a conta, não a tentar de novo.
- Liga/desliga a **pauta semanal**: a IA gera 1 rascunho por semana a partir de uma lista de temas.
  Gera em *Revisar*, nunca em *Agendado* — recorrência automatiza a escrita, não a aprovação.
- Vê o estado da **conta conectada** (@, publicados hoje / limite diário, quando o token expira) e
  reconecta quando pedido.

## Regras que a tela materializa
- **Aprovação humana é obrigatória.** Não existe caminho de brief → publicado sem alguém abrir o
  preview. O status `publicando` é do robô; `revisar` é da pessoa.
- **Bloqueio de conselho não tem "publicar mesmo assim".** Aviso tem; bloqueio não. Quem escolhe o
  conjunto de regras é o **conselho do autor** (CRN, CRM, CREF, CRP), não a clínica.
- **Limite de 50 publicações por dia por conta** é da API do Instagram, não nosso. A tela mostra
  `publicados hoje / 50` e não deixa agendar o 51º no mesmo dia.
- **Cota do add-on é por mês e por clínica.** Refazer gasta. Esgotada, gerar e refazer desligam; a
  fila continua agendando e publicando o que já existe.
- **Sem imagem generativa.** Os cartões saem de **template da marca** com o texto renderizado —
  identidade visual consistente e texto legível, que é onde modelo de imagem falha. Upload de foto
  própria é permitido.

## Fora de escopo (de propósito)
- **Métricas de engajamento** (alcance, curtidas, seguidores). É outra tela e outro problema; aqui
  o único dado pós-publicação é o link.
- **Inbox de comentários e DM.** Responder paciente em rede social é conversa clínica em canal
  errado — o caminho é Mensagens.
- **Outras redes.** Só Instagram nesta fatia. Facebook e TikTok reusam a fila; o que muda é o
  conector.
- **Editor de imagem.** Escolhe template e troca a foto de fundo. Não recorta, não desenha.
- **Reels e qualquer vídeo.** Sem geração de vídeo, o formato não existe na tela — oferecer Reels
  seria prometer um pipeline que não há.
- **Estado "add-on não contratado".** O gate de entitlement e o upsell são componentes
  compartilhados do plano — esta tela assume o módulo ativo e cuida só da cota.
- **Aprovação em duas etapas** (marketing escreve, profissional assina). A clínica de V1 tem uma
  pessoa fazendo os dois.

## UI Requirements
- Header: título "Publicações" + resumo (**N a revisar**, **N agendados**, **N publicados no mês**)
  + chip de cota (`12/30 posts · renova em 1º out`) + botões **Ditar post** (microfone, primário) e
  **Novo post**.
- Faixa da conta conectada: `@nutriclinicavida` · `3/50 publicados hoje` · aviso âmbar quando o
  token expira em menos de 7 dias, com **Reconectar**.
- Layout de duas colunas no desktop: **fila à esquerda**, **preview do selecionado à direita**
  (sticky). No mobile a fila ocupa a tela e o preview abre como drawer de tela cheia.
- Item da fila: tema · badge de formato (Feed/Carrossel/Story) · badge de status colorido ·
  quando vai ao ar (ou "sem data") · autor · ícone de origem (microfone = ditado). Item com
  bloqueio ganha borda âmbar.
- Preview: moldura de post com cabeçalho da conta, cartão do template (4:5), legenda com "… mais",
  hashtags em bloco separado e esmaecido. Carrossel com pontos e navegação.
- Painel de alertas acima das ações: bloqueio em vermelho com a regra citada, aviso em âmbar. Cada
  alerta mostra o **trecho** que o disparou.
- Ações do preview: **Refazer** (abre campo de instrução), **Editar texto**, **Agendar**,
  **Publicar agora**, **Excluir**. Desabilitadas com motivo no `title` quando não cabem.
- Card da pauta semanal: toggle, dia/hora, os temas da lista e a próxima geração.
- Estado vazio: fila sem nenhuma publicação → explica o caminho do ditado e oferece os dois botões.
- Estado de cota esgotada: chip vermelho, Ditar/Novo/Refazer desabilitados com motivo; agendar e
  publicar continuam vivos.

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based. Datas e números em pt-BR.
- Persona: **admin** (gestor da clínica). O nav do médico não recebe o link no V1 — quem opera o
  marketing da clínica é a gestão; o profissional entra como **autor** do post, e é o conselho dele
  que define as regras aplicadas.
- shell: true
