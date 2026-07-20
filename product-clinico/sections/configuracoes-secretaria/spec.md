# Configurações Secretária Specification

## Overview
Configurações **próprias da secretária** — escopo deliberadamente reduzido em relação ao `configuracoes-medico`. A secretária gerencia apenas sua conta pessoal (perfil, senha, notificações operacionais, preferências de interface). **Não tem acesso** a configurações do consultório: integrações (Memed/IA/teleconsulta), valores, convênios, disponibilidade do médico, audit log clínico nem convite de outros usuários. Layout web em coluna única com sidebar de abas, no mesmo padrão visual da config do médico, mais um card fixo de "Escopo de acesso" que explicita as fronteiras LGPD da persona.

## User Flows

### Editar perfil pessoal
- Foto/inicial · nome · email · telefone · cargo (fixo: "Secretária")
- Salvar dispara `onSalvar`

### Alterar senha
- Senha atual · nova senha · confirmar nova senha
- Validação de força mínima e confirmação

### Notificações operacionais
- Toggles (nada clínico):
  - Push: novo agendamento · cancelamento · mensagem administrativa (canal admin)
  - Email: resumo diário de agenda · pagamento confirmado
  - SMS: lembrete de plantão

### Preferências de interface
- Tema (sistema · claro · escuro)
- Idioma (pt-BR fixo no V1)
- Fuso horário

### Ver escopo de acesso (informativo, read-only)
- Card "Escopo de acesso" lista o que a secretária **pode** (agenda, cadastro admin, mensagens admin, cobrança) e o que **não pode** (prontuário, exames, prescrição, consulta, config do consultório)
- Reforça a separação LGPD entre operação e dado clínico
- Não é editável — é transparência

## UI Requirements
- Tema dark slate (bg-slate-950), sidebar de abas à esquerda + conteúdo à direita — igual `configuracoes-medico`
- Accent teal-500 (ativo/CTA)
- Footer/CTA "Salvar alterações" no header
- Card "Escopo de acesso" com duas colunas: permitido (emerald + check) · bloqueado (slate + cadeado)
- Badge "Secretaria" no header pra reforçar persona
- Toggles teal quando ativos
- **Nenhuma aba de integrações, valores, convênios ou audit** — essas pertencem só ao médico

## Configuration
- shell: false (web tem chrome próprio via shell-clinico persona "secretaria")
