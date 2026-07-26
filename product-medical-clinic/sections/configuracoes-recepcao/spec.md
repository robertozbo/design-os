# Configurações da Recepção Specification

## Overview
Configurações **operacionais** da persona **Recepção / Front-desk** — distintas das configurações da clínica (Admin/Gestor) e do médico. A recepcionista NÃO tem acesso clínico: sem prontuário, exame ou prescrição. Suas preferências cobrem o dia a dia do balcão: conta pessoal, notificações operacionais, agenda, cobrança (links de pagamento), mensagens do canal administrativo e aparência. Página seccionada, tudo props-based, toggles em Tailwind puro. Todas as ações são mock (toast); os toggles apenas alternam estado local.

## User Flows

### Ajustar a conta
- Recepção vê nome/email, aciona "Alterar senha" (mock) e ativa a verificação em duas etapas (2FA).

### Escolher notificações
- Ativa/desativa alertas de: novo agendamento, cancelamento/no-show, nova mensagem administrativa de paciente e cobrança pendente/vencida.

### Preferências de agenda
- Define a visão padrão (por médico / por sala) via segmented.
- Consulta o horário de funcionamento (read-only, "gerenciado pela clínica").
- Liga o lembrete automático de consulta ao paciente e escolhe a antecedência (select).

### Preferências de cobrança
- Define a forma de pagamento padrão do link (PIX / cartão) e liga o envio automático de recibo.

### Mensagens (canal administrativo)
- Edita a assinatura automática das respostas e o horário de atendimento do canal (mock).

### Aparência
- Escolhe o tema (claro / escuro / sistema) via segmented (mock).

## UI Requirements

### Layout
- **Header**: "Configurações da recepção" + nome/persona ("Carla Menezes · Recepção")
- **Conta**: nome, email, botão "Alterar senha", toggle 2FA
- **Notificações**: 4 toggles operacionais
- **Agenda**: segmented visão padrão, horário de funcionamento (read-only chip "gerenciado pela clínica"), toggle lembrete + select antecedência
- **Cobrança**: select forma padrão do link, toggle recibo automático
- **Mensagens**: input assinatura, chip horário de atendimento do canal
- **Aparência**: segmented tema
- **Aviso de escopo**: nota informando que canais clínicos / prontuário não estão disponíveis à recepção (por LGPD/escopo)

### Estados & regras
- Toggle ativo = teal; inativo = slate
- Segmented ativo = fundo branco (dark: slate-700)
- Horário de funcionamento é read-only (a recepção não edita — pertence à clínica)

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Switch e layout consistentes com Configurações da clínica (cópia local do Switch, sem cross-import)
- Independente de `sections-clinico` — zero acesso clínico
