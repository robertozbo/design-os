# Mensagens Specification

## Overview
Mensageria entre paciente e clínica em **dois canais isolados** (exigência LGPD):
- **Clínico** — paciente ↔ **médico do vínculo** (dúvidas clínicas, orientações, resultados). Só médicos com CareLink ativo acessam.
- **Admin** — paciente ↔ **recepção** (agendamento, cobrança, documentos). Recepção não vê o canal clínico; o médico não vê o canal admin.

A section serve personas diferentes: o **médico** enxerga o canal Clínico das suas conversas; a **recepção** enxerga o canal Admin. O protótipo abre na visão do médico, com o canal Admin **bloqueado** (mostra por que, sem expor conteúdo). Os alertas do Início ("mensagens não lidas") apontam para cá.

## User Flows

### Ler e responder (médico, canal clínico)
- Médico entra → lista de conversas do canal Clínico (paciente, prévia da última mensagem, não lidas, horário)
- Seleciona uma conversa → thread com bolhas (paciente à esquerda, profissional à direita) + composer
- Escreve e envia → mensagem entra na thread; contador de não lidas zera

### Alternar canal
- Abas Clínico / Admin. Na visão do médico, Admin aparece **bloqueado** com aviso LGPD (a recepção é quem acessa)

### Contexto do paciente
- Cabeçalho da conversa mostra o paciente (idade, condições) e atalho pro prontuário

## UI Requirements

### Layout (split inbox)
- **Abas de canal** no topo: Clínico (ativo) · Admin (com cadeado na visão médico) + nota "canais isolados (LGPD)"
- **Coluna esquerda — lista de threads**: busca + itens (avatar do paciente, nome, prévia truncada, horário, badge de não lidas). Thread ativa destacada.
- **Coluna direita — conversa**:
  - Cabeçalho: paciente (avatar, idade, condições) + link "Prontuário"
  - Corpo: bolhas por autor (paciente vs profissional), com hora; agrupadas por dia
  - Composer: input + enviar; nota de que respostas clínicas são registradas
- **Canal Admin (visão médico)**: painel de bloqueio explicando a separação LGPD (sem listar conversas)

### Estados & regras
- Não lidas: badge teal na thread + negrito no nome
- Bolha do profissional em teal; do paciente em cinza
- Enviar limpa o composer e adiciona a bolha
- Empty state quando nenhuma thread selecionada
- Mobile: lista e conversa alternam (uma por vez)

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Cores de especialidade compartilhadas (`CorEspecialidade`)
- Reforça a **separação de canais** como pilar de privacidade (LGPD)
- Sem realtime — mock estático + envio local
