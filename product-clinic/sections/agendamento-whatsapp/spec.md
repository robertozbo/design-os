# Agendamento por WhatsApp Specification

## Overview
O canal de auto-agendamento da clínica no WhatsApp, visto de dentro — pela **Recepção/Admin**, não pelo
paciente. A tela tem duas metades: à esquerda um **simulador do chat** numa moldura de celular, onde se
percorre exatamente o fluxo que o paciente vê; à direita a **configuração do bot** e a **fila do bot** —
os pré-agendamentos e leads que ele produziu e que alguém precisa validar.

O bot é **determinístico**: menus de botão e lista, nenhuma geração de texto livre. Ele não confirma
consulta, não gera cobrança e não responde nada clínico. Tudo que ele cria nasce **pendente** e cai
na fila. A camada de IA é V2 e aparece na tela desligada, com o escopo já escrito.

## Personas
- **Recepção** — vive na fila: confirma, recusa, cadastra lead.
- **Admin** — configura o bot (serviços expostos, janelas, saudação) e lê os limites.
- **Paciente** — nunca abre esta tela; ele está do outro lado, no simulador.

## User Flows

### Simular a conversa
- A moldura de celular abre no primeiro passo ("Bom dia") com os **dois botões**: `Agendar` e `Dúvidas`
- Clicar numa opção avança o passo: a escolha vira bolha do paciente e o bot responde
- A ordem é **serviço → profissional → data → hora**, nunca outra:
  1. **Identificação** — o telefone é a identidade; casa com o pool de pacientes. Achou: confirma o
     nome ("é você?"). Não achou (ou não é a pessoa): abre o **único passo de texto livre** do fluxo —
     o campo de mensagem destrava, o paciente **digita** nome e nascimento, e a conversa encerra
     virando **lead**
  2. **Serviço** — lista dos serviços expostos. É ele que trava `duracaoMin` e o preço de tabela; sem ele
     não existe grade de horário
  3. **Profissional** — a **primeira linha é sempre "Primeiro horário disponível"**; abaixo, quem atende
     aquele serviço. Se só um atende, o passo é pulado
  4. **Data** — no máximo **3 botões** com as datas mais próximas + "outra data"
  5. **Hora** — lista com até **10 horários**, **calculados a partir da agenda real**: o bot varre o
     expediente e descarta tudo que colide com bloco já ocupado do médico. Ele não tem lista própria
     de horário. Trocar o serviço muda a duração e, com ela, os vãos que cabem — é por isso que o
     serviço vem antes da data
  6. **Confirmação** — resumo e aviso explícito de que **a recepção ainda vai confirmar**
- "Reiniciar conversa" volta ao passo 1
- O ramo `Dúvidas` responde do FAQ configurado e oferece "falar com a recepção"

### Configurar o bot
- **Saudação** editável (textarea) com contador de caracteres
- **Serviços expostos**: lista dos serviços do cadastro com toggle — só os marcados aparecem no chat
- **Antecedência mínima** (horas) e **janela máxima** (dias) — definem quais datas o bot pode oferecer
- **Horário de atendimento do bot**; fora dele responde a mensagem de ausência
- Dois interruptores **travados** e explicados: "cria como pendente" (sempre ligado) e "gerar cobrança"
  (sempre desligado) — a etapa Financeiro do wizard não cabe em chat
- "Salvar" dispara toast (mock)

### Tratar a fila
As duas listas são **excludentes**, e é essa a regra que a tela precisa deixar óbvia: quem vira lead
**não** gera pré-agendamento, porque o bot interrompe antes de oferecer horário.

- **Pré-agendamentos** — pacientes **já no pool** que saíram da conversa com horário reservado:
  paciente, telefone, serviço, profissional, data/hora e quando chegou
  - `Confirmar` → some da fila, toast diz que virou consulta confirmada na Agenda
  - `Recusar` → pede motivo curto e some da fila
- **Leads** — telefone que **não** casou com o pool. Aqui o bot parou: coletou nome e nascimento e
  encerrou, **sem marcar nada**. Sem cadastro não há convênio, e a Agenda não aceita nome livre
  - `Cadastrar` → toast (mock); o lead **não entra no pool sozinho**
  - Depois de cadastrado, a pessoa volta ao WhatsApp e aí sim consegue agendar
- Contador de pendências no topo de cada bloco; ambos têm estado vazio

### Ler os limites
- Bloco **"O que o bot nunca faz"** com as regras de escalonamento: gatilho → ação → exemplo real
- Cobre no mínimo: sintoma/queixa clínica, urgência, pedido de resultado de exame, pedido de receita
- A regra de urgência aparece destacada em vermelho, com o texto de emergência que o bot envia

### Camada de IA (V2)
- Card desabilitado e esmaecido, com os três usos previstos (classificar intenção, responder FAQ,
  redigir rascunho pra recepção) e a nota de que ela nunca entra no meio do agendamento
- Toggle desativado; clicar dispara toast "Disponível na V2"

## UI Requirements

### Layout
- Header: "Agendamento por WhatsApp" + nome da clínica + badge de status do canal (conectado/mock)
- Duas colunas em `lg:`; empilha no mobile com o simulador primeiro
- **Coluna esquerda (simulador)**: moldura de celular com status bar do sistema, ilha, papel de parede,
  barra de digitar e home indicator; sticky no `lg:`. "Reiniciar" acima da moldura
- **O aparelho tem tamanho fixo** — a área de conversa é de altura constante e **rola por dentro**, como
  num celular. Ele não pode crescer conforme o fluxo avança
- **Coluna direita**: blocos empilhados — Fila (pré-agendamentos + leads), Configuração, Limites, IA V2

### Chat
- Bolha do bot à esquerda (fundo claro/slate), bolha do paciente à direita (fundo teal)
- **As opções são parte da mensagem**: vêm coladas embaixo da última bolha do bot, mesma largura e
  divisória fina — não flutuando no rodapé da conversa
- **Botões** = até 3 blocos empilhados; **lista** = um "Ver opções" que abre o painel com as linhas
  (rótulo + descrição), igual ao WhatsApp
- **Barra de digitar**: inerte nos passos de menu (ali o bot só aceita opção) e **viva** no passo de
  `entrada`, com o placeholder do próprio passo; o ícone de microfone vira "enviar" quando há texto,
  e Enter também envia
- Abaixo do aparelho, uma legenda do Design OS mostra a restrição vigente: "3 botões", "até 10 linhas"
  ou "texto livre"
- Passo final não tem opções nem botão dentro da tela — a conversa só termina

### Estados & regras
- Pré-agendamento pendente = amber; confirmado = emerald; recusado = slate
- Contadores em pill teal
- Toggle travado fica esmaecido com ícone de cadeado e tooltip explicando por quê
- Serviço desmarcado some na hora da lista do simulador
- Datas em pt-BR (`ter, 21 jul`), horas em `HH:mm`, duração em minutos, preço em R$

## Design Notes
- Nymos (teal, DM Sans), light/dark em todas as cores, props-based, sem fetch interno
- O verde do WhatsApp aparece **só** dentro da moldura do celular; o resto da tela é Nymos
- Serviços, profissionais e **horários livres** vêm da Agenda e do cadastro (`agenda`, `servicos`,
  `equipe`) — mesmos ids, mesmos blocos. Esta section não tem lista própria de nada disso
- Nada de especialidade ou motivo clínico no texto que o bot envia: "sua consulta de quinta, 14h"
- Independente de `sections-doctor`
