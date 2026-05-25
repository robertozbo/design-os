# Saúde Mental Specification

## Overview
Section que conecta o paciente ao psicólogo vinculado via chat 1-1 e oferece um diário emocional diário (humor, emoções, energia, sono e nota livre). Layout em 2 tabs: Chat e Diário. O Diário funciona offline e sem vínculo profissional; o Chat depende de psicólogo vinculado e exibe empty state com CTA de convite quando não há.

## User Flows

### Tab Chat (psicólogo vinculado)
- Strip topo com avatar · nome · CRP · status (online · visto há X · em sessão) + chip do próximo agendamento se houver.
- Histórico de mensagens em bubbles cronológicas: paciente à direita (tom primário), psicólogo à esquerda (tom neutro), sistema centralizada (cinza).
- Separadores de data ("Hoje", "Ontem", "13 mai").
- Mensagens próprias mostram check de envio + leitura.
- Indicador "digitando..." quando o psicólogo está respondendo.
- Composer fixo no rodapé: textarea autoexpansível + botão enviar + ícone anexo (foto/áudio — placeholder V2, visual desabilitado).
- Toque no strip do psicólogo abre detalhe (fluxo da section Profissionais).

### Tab Chat (sem psicólogo vinculado)
- Empty state com ilustração + título "Converse com um psicólogo" + descrição curta + CTA "Convidar psicólogo" que abre o fluxo de busca da section Profissionais.

### Tab Diário — registrar humor de hoje
- Se ainda não preenchido: card grande "Como você está hoje?" com slider de humor 1-10 (com emoji dinâmico), grade de chips de emoções (categorizadas por tom), sliders de energia 1-5 e qualidade de sono 1-5, textarea opcional "O que aconteceu hoje?", toggle "Compartilhar com [psicólogo]" (só visível se psicólogo vinculado) e botão "Salvar entrada".
- Se já preenchido: card resumo com humor + emoções + sliders + nota + indicador de compartilhamento + botão "Editar".

### Tab Diário — visualizar tendências
- Card "Últimos 7 dias" com mini-gráfico (barras ou pontos) do humor diário; dias sem registro marcados visualmente; mostra média + delta vs. semana anterior.
- Card "Tendência mensal" com humor médio do mês atual, comparação com mês anterior e frase curta de contexto.
- Lista "Histórico" com últimas entradas (data + humor + emoções top 2 + nota truncada); toque expande a entrada completa.

### Compartilhamento com psicólogo
- Quando o toggle "Compartilhar com [psicólogo]" está ativo no momento de salvar, a entrada é enviada como mensagem do sistema no chat com snapshot do humor + emoções.
- Diário próprio fica visível só pro paciente; psicólogo só vê o que foi compartilhado.

## UI Requirements
- Header sub-page "Saúde Mental".
- 2 tabs no topo: **Diário** · **Chat** (badge de não-lidas se houver).
- Default tab: Diário (primária — sempre funcional, sem dependência de vínculo). Chat fica em segundo plano, acionado quando o usuário precisa conversar.
- Empty state robusto na tab Chat quando sem psicólogo vinculado, com CTA primário.
- Mensagens em bubbles com cor por autor; placeholders de foto/áudio visualmente desabilitados no MVP.
- Composer com textarea autoexpansível (1-4 linhas), botão enviar desabilitado quando vazio.
- Diário usa escala 1-10 (humor) consistente com check-ins clínicos; sliders 1-5 (energia, sono); chips de emoções categorizados por tom (positivo, neutro, negativo).
- Mini-gráfico de 7 dias com pontos para registros e marca visual nos dias sem check-in.
- Mobile responsive (Tailwind sm/md/lg/xl), suporte completo a light e dark mode, usa design tokens do produto (fallback stone/lime).
- Toggle "Compartilhar com [psicólogo]" só aparece quando há psicólogo vinculado.

## Configuration
- shell: true
