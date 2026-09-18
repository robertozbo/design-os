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

## Duas abas: Fila e Configurações
O módulo é **vendido à parte** (como o Fiscal), então ele é autocontido: carrega as próprias
configurações em vez de espalhá-las pelo cadastro da clínica. Clínica que não compra Marketing não
vê configuração de Instagram em lugar nenhum.

| Aba | O quê |
|---|---|
| **Fila** | A fila de posts e o preview. A conta só aparece aqui quando há o que fazer: autorização vencendo, em faixa âmbar com **Reconectar**. Alerta, não configuração |
| **Configurações** | Conta do Instagram (conectar/desconectar, validade, consumo do dia), pauta semanal, padrões da marca (tom, template, fecho fixo, registro no cartão) e aprovação (quem aprova, se aviso exige ciência) |

**Em Configurações da clínica fica só o que é cobrança:** o módulo aparece em *Plano & limites →
Módulos* com preço, consumo do ciclo e um link **Configurar** que traz para cá. Preço e cota não
são preferência, e um número de cobrança em duas telas envelhece em duas velocidades.

**Não existe credencial para digitar em lugar nenhum.** O aplicativo no Meta é da Nymos, com App
Review feito uma vez; cada clínica só passa pelo OAuth e escolhe a conta. É o que faz o módulo
escalar sem suporte manual por clínica.

## Multi-tenant: a Nymos publica pelo mesmo módulo
A fila é por **workspace**, e a Nymos é um workspace como qualquer outro — o mesmo módulo serve a
área administrativa da plataforma e as clínicas, sem segunda implementação. O que muda por tenant:

- **Conta conectada é uma por workspace** (`workspaceId + provider + contaExterna`), então o limite
  de 50/dia da API nunca é disputado entre tenants.
- **Cota é do add-on do workspace.** O workspace interno da Nymos não compra add-on: cota própria.
- **O validador é por autor, não por tenant.** Post de clínica tem autor com conselho (CRN/CRM/…) e
  cai no código de ética dele. Post da Nymos não tem conselho — cai em publicidade de produto de
  saúde (e nas vedações da LGPD, que valem para todo mundo). Por isso a regra vem de
  `autor.conselho`, e não de uma constante da tela: um `if tenant === 'nymos'` teria deixado o
  back-office publicando sem validação nenhuma.

## Regras que a tela materializa
- **Aprovação humana é obrigatória.** Não existe caminho de brief → publicado sem alguém abrir o
  preview. O status `publicando` é do robô; `revisar` é da pessoa.
- **Bloqueio de conselho não tem "publicar mesmo assim".** Aviso tem; bloqueio não. Quem escolhe o
  conjunto de regras é o **conselho do autor** (CRN, CRM, CREF, CRP), não a clínica.
- **Limite de 50 publicações por dia por conta** é da API do Instagram, não nosso. A tela mostra
  `publicados hoje / 50` e não deixa agendar o 51º no mesmo dia.
- **Cota do add-on é por mês e por clínica.** Refazer gasta. Esgotada, gerar e refazer desligam; a
  fila continua agendando e publicando o que já existe.
- **A tipografia é sempre nossa.** Seis layouts de marca — Editorial, Lista numerada, Estatística,
  Convite, Citação e Foto + faixa — com o texto renderizado por cima, nunca gerado dentro do pixel.
  Layouts de verdade, não a mesma caixa em seis cores: o que faz um post parecer template é a
  composição sempre igual. Cada um tem cor de acento própria, escolhida num leque em que cada carta
  é o layout escolhido naquela cor.
- **O fundo é o que pode virar IA depois.** `Foto + faixa` já é a peça com fotografia e faixa de
  texto na base — hoje foto própria da clínica, e é exatamente esse bloco que um modelo de imagem
  substitui quando essa etapa entrar. A tipografia continua fora do pixel: erro de acento não
  obriga a pagar outra geração, e a legenda segue editável.

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
- **Estado "add-on não contratado".** Quem contrata e cancela é *Plano & limites → Módulos*, que
  serve Marketing, Fiscal e os próximos. Esta tela assume o módulo ativo.
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
- Preview: moldura de post com cabeçalho da conta, cartão do template (4:5 no feed, 9:16 no story), legenda com "… mais",
  hashtags em bloco separado e esmaecido. Carrossel com pontos e navegação.
- Painel de alertas acima das ações: bloqueio em vermelho com a regra citada, aviso em âmbar. Cada
  alerta mostra o **trecho** que o disparou.
- Ações do preview: **Refazer** (abre campo de instrução), **Editar texto**, **Agendar**,
  **Publicar agora**, **Excluir**. Desabilitadas com motivo no `title` quando não cabem.
- Tab-rail de duas abas (Fila · Configurações) logo abaixo do header.
- Aba Configurações em grade de quatro blocos: Conta do Instagram, Pauta semanal, Padrões da marca,
  Aprovação. O template padrão é escolhido em grade de miniaturas com a arte real de cada layout,
  e a cor num leque de cartas sobrepostas — só a da frente escreve, as de trás provam a cor. Padrões salvam em lote (botão habilita só quando há mudança); o resto salva no toque.
- Estado vazio: fila sem nenhuma publicação → explica o caminho do ditado e oferece os dois botões.
- Estado de cota esgotada: chip vermelho, Ditar/Novo/Refazer desabilitados com motivo; agendar e
  publicar continuam vivos.

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based. Datas e números em pt-BR.
- Persona: **admin** (gestor da clínica). O nav do médico não recebe o link no V1 — quem opera o
  marketing da clínica é a gestão; o profissional entra como **autor** do post, e é o conselho dele
  que define as regras aplicadas.
- shell: true
