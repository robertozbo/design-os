# Perfil Profissional Specification

## Overview
O perfil do próprio médico logado — a "carteira profissional" da **Dra. Helena Prado** dentro da clínica. Reunido via `onProfileClick` no shell, mostra dados profissionais (CRM/UF, especialidades, RQE, formação), a **bio pública** que o paciente vê no app Nymos, contato, horários de atendimento, o status da **assinatura & credenciais digitais** (click-to-attest V1 ativo; ICP-Brasil é V2) e preferências rápidas do dia a dia. Read-only por padrão com ações de edição em mock — o médico só gerencia o próprio perfil, não o da clínica (isso é Configurações).

## User Flows

### Ver e editar o próprio perfil
- Médico abre Perfil pelo menu do usuário no shell → hero com avatar, nome, especialidade + CRM
- "Editar perfil" abre edição (mock toast) dos dados profissionais e da bio pública
- Ajusta a **bio pública** num textarea (o que o paciente lê no app) → "Salvar" (mock)

### Gerenciar credenciais
- Vê o status da **assinatura digital**: click-to-attest (V1, ativo) e ICP-Brasil (V2, pendente)
- Vê o certificado vinculado e validade — ações de gerenciar em mock

### Preferências rápidas
- Alterna toggles: receber notificações de encaminhamento, escriba IA ligado por padrão na consulta → mock toasts

## UI Requirements

### Layout
- **Hero header**: avatar (iniciais, teal), nome, especialidade + CRM, botão "Editar perfil"
- **Dados profissionais**: CRM/UF, especialidades (chips), RQE, formação/titulação (lista)
- **Bio pública**: parágrafo em textarea editable-looking + "Salvar"
- **Contato**: email, telefone, cidade
- **Horários de atendimento**: por dia (seg-sáb) com faixas de horário; dias sem atendimento marcados
- **Assinatura & credenciais**: status click-to-attest (ativo) + ICP-Brasil (pendente/V2) + certificado
- **Preferências rápidas**: toggles com label + descrição

### Estados & regras
- Assinatura: ativo = emerald, pendente = amber/slate
- Toggles controlados (Tailwind switch, sem lib externa)
- Bio limitada a ~500 caracteres (contador visual, mock)

## Design Notes
- Nymos (teal, DM Sans), light/dark em todas as cores, props-based, sem fetch interno
- Dados consistentes com o shell user (Dra. Helena Prado · Endocrinologista · CRM 456789-SP)
- Independente de `sections-doctor`
