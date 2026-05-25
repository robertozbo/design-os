# Chat IA Specification

## Overview
Tela fullscreen de conversa com a Nymos IA. Usuário escreve perguntas em linguagem natural sobre seus dados (sono, glicemia, treinos, exames) e a IA responde com análises contextuais. Diferente da seção IA (hub com quick actions de upload/OCR), aqui é chat conversacional puro.

## User Flows

### Entrada
- Acessada por:
  - CTA "Conversar com a IA" no HeroIA da seção IA
  - Toque em item do "Histórico" da seção IA (carrega contexto daquela análise)
  - Botão flutuante futuro em qualquer tela (descontinuado — vide decisão)

### Conversação
- Mensagem inicial automática da IA com saudação contextual.
- Sugestões iniciais (4 botões) com perguntas comuns:
  - "Como melhorar minha qualidade do sono?"
  - "Analisar minha glicemia da semana"
  - "Sugerir treino de hoje"
  - "Resumo dos meus exames"
- Toque em sugestão envia automaticamente como mensagem do usuário.
- Input no rodapé com placeholder + botão Send + botão `+` pra anexar (foto, exame).

### Streaming de resposta
- IA responde em streaming (efeito de digitação).
- Pode anexar gráficos, listas de números e cards de ação ("Ver no detalhe", "Marcar como meta").

### Anexos
- Toque em `+` abre menu: Foto · Galeria · Exame (PDF) · Métrica.
- Anexar conecta com os agentes OCR do backend (mesmo fluxo da seção IA).

## UI Requirements
- Fullscreen sem tab bar
- Header: voltar + avatar IA + status "Online" + nome "Nymos IA"
- Área scroll com bolhas de mensagem (user à direita teal, assistant à esquerda slate com border)
- Sugestões iniciais como chips quando histórico é só a primeira mensagem
- Footer fixo com input + botões `+` e Send
- Indicador "digitando..." durante streaming

## Configuration
- shell: false (fullscreen, sem header/tab bar do shell)
