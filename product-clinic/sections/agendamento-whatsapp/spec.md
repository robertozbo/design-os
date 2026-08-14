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
  1. **Identificação** — o telefone é a identidade; casa com o pool de pacientes. Achou: cumprimenta pelo
     nome. Não achou: pede nome e nascimento e encerra virando **lead**
  2. **Serviço** — lista dos serviços expostos. É ele que trava `duracaoMin` e o preço de tabela; sem ele
     não existe grade de horário
  3. **Profissional** — a **primeira linha é sempre "Primeiro horário disponível"**; abaixo, quem atende
     aquele serviço. Se só um atende, o passo é pulado
  4. **Data** — no máximo **3 botões** com as datas mais próximas + "outra data"
  5. **Hora** — lista com até **10 horários** do dia escolhido
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
- **Pré-agendamentos**: cartão com paciente, telefone, serviço, profissional, data/hora e quando chegou
  - `Confirmar` → some da fila, toast diz que virou consulta confirmada na Agenda
  - `Recusar` → pede motivo curto e some da fila
  - Cartão de paciente novo mostra badge **"Novo"**
- **Leads** (telefone não reconhecido): nome, nascimento, telefone, o que pediu
  - `Cadastrar` → toast (mock); o lead **não entra no pool sozinho**
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
- **Coluna esquerda (simulador)**: moldura de celular fixa (sticky), header verde de conversa com o nome
  da clínica, corpo com bolhas e o bloco de opções ao pé; "Reiniciar conversa" acima da moldura
- **Coluna direita**: blocos empilhados — Fila (pré-agendamentos + leads), Configuração, Limites, IA V2

### Chat
- Bolha do bot à esquerda (fundo claro/slate), bolha do paciente à direita (fundo teal)
- **Botões** renderizam como até 3 blocos empilhados de largura total; **lista** renderiza como um botão
  "Ver opções" que abre um painel com as linhas (rótulo + descrição) — igual ao WhatsApp
- Um rodapé mostra a restrição vigente do passo: "3 botões" ou "até 10 linhas"
- Passo final não tem opções, só o resumo e o "Reiniciar"

### Estados & regras
- Pré-agendamento pendente = amber; confirmado = emerald; recusado = slate
- Badge "Novo" em rose; contadores em pill teal
- Toggle travado fica esmaecido com ícone de cadeado e tooltip explicando por quê
- Serviço desmarcado some na hora da lista do simulador
- Datas em pt-BR (`ter, 19 ago`), horas em `HH:mm`, duração em minutos, preço em R$

## Design Notes
- Nymos (teal, DM Sans), light/dark em todas as cores, props-based, sem fetch interno
- O verde do WhatsApp aparece **só** dentro da moldura do celular; o resto da tela é Nymos
- Serviços e profissionais vêm do cadastro (`servicos`, `equipe`) — esta section não tem lista própria
- Nada de especialidade ou motivo clínico no texto que o bot envia: "sua consulta de quinta, 14h"
- Independente de `sections-doctor`
