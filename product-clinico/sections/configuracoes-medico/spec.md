# Configurações Specification

## Overview
Centro de configurações do psicólogo dividido em 6 blocos: Perfil profissional (foto, CRP, especialidade, abordagens, formação, bio), Disponibilidade semanal (grade dia × hora com slots por modalidade), Modalidades de atendimento (presencial · online · híbrida com endereço/plataforma), Valores (sessão padrão, online, primeira consulta, pacotes), Convênios aceitos, e Notificações (push · email · SMS). Layout de coluna única com seções claramente delimitadas e ações de salvar.

## User Flows

### Editar perfil profissional
- Foto/inicial · nome · CRP · email · telefone
- Especialidade (texto livre)
- Abordagens principais (chips multi-select)
- Formação (lista de instituição + título + ano, com adicionar/remover)
- Bio (textarea livre)

### Configurar disponibilidade semanal
- Grade visual dias × horas (seg-dom × 08:00-22:00)
- Cada slot ativo com modalidade (online · presencial · híbrida) e cor
- Click no slot toggle disponibilidade

### Habilitar modalidades de atendimento
- Toggles por modalidade (presencial · online · híbrida)
- Presencial revela campo de endereço completo
- Online revela campo de plataforma (Google Meet · Zoom · etc.) + observação sobre envio do link

### Definir valores e formas de pagamento
- Sessão padrão (BRL) · sessão online · primeira consulta
- Lista de pacotes (nome · nº sessões · preço total · validade meses)
- Formas de pagamento aceitas (chips multi-select: Pix · Cartão · Boleto · Transferência)

### Convênios aceitos
- Lista de convênios com toggle ativo/inativo
- Valor de repasse opcional por convênio

### Notificações
- Toggles individuais:
  - Push: sessão ao iniciar · alerta de paciente · mensagem de paciente
  - Email: resumo diário · novo agendamento
  - SMS: lembrete de sessão

## UI Requirements
- Layout coluna única max-w-4xl com seções `<section>`
- Cada seção em card com header colorido + ícone
- Footer sticky com botão "Salvar alterações" (CTA primário) que dispara `onSalvar`
- Toggles com cor teal quando ativos
- Grid de disponibilidade com cells coloridas por modalidade (online azul · presencial teal)
- Validação de campos obrigatórios (CRP, email)
- Estado de loading no botão Salvar
- Confirmação visual após salvar (toast emerald)

## Configuration
- shell: false (web tem chrome próprio)
