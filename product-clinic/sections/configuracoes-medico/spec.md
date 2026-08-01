# Configurações do Médico Specification

## Overview
As **preferências e conta pessoais** da médica logada (Dra. Helena Prado, Endocrinologista, CRM 456789-SP) — distinta das configurações da clínica (workspace/CNPJ/plano/auditoria, em `configuracoes-clinica`) e do perfil público (bio/horários, em `perfil`). Aqui a médica ajusta o que é **dela**: conta e segurança, notificações, comportamento do atendimento (Escriba IA, template de anamnese, duração e teleconsulta), prescrição (Memed + assinatura click-to-attest), privacidade LGPD e aparência. Página em seções (sectioned page), sem chrome de navegação. Todas as ações são mock (toast); toggles alternam estado local.

## User Flows

### Conta & segurança
- Vê e-mail da conta e último acesso
- "Alterar senha" abre fluxo (mock)
- Liga/desliga **autenticação em 2 fatores**

### Notificações
- Alterna, por canal (e-mail/push), os alertas: novo encaminhamento recebido, nova mensagem de paciente, exame novo pra revisar, resumo diário da agenda

### Atendimento & consulta
- **Escriba IA ligado por padrão** em novas consultas (toggle)
- Seleciona **template de anamnese** por especialidade (Endocrinologia default)
- Seleciona **duração padrão** de consulta
- Habilita/desabilita **teleconsulta**

### Prescrição
- Vê status da **integração Memed** (vinculada) e "Reconectar" (mock)
- Liga/desliga **assinatura click-to-attest** (V1) para prescrições

### Privacidade (LGPD)
- Exige **confirmação de consentimento de gravação por consulta** (toggle)
- "Exportar meus dados" (mock)

### Aparência
- Escolhe **tema**: claro / escuro / sistema (segmented, mock)

## UI Requirements

### Layout
- **Header**: "Configurações" + nome/especialidade/CRM da médica + avatar
- Cards em seção com ícone + título: Conta, Notificações, Atendimento & consulta, Prescrição, Privacidade (LGPD), Aparência
- Toggles = Switch Tailwind (mesmo look de `configuracoes-clinica`)
- Notificações: linha por evento com dois toggles (e-mail, push)

### Estados & regras
- 2FA ativo = badge emerald; inativo = slate
- Memed vinculada = badge emerald + botão Reconectar
- Assinatura click-to-attest é V1 (Certificado ICP/A3 é V2 — só menção)

## Design Notes
- Nymos (teal accent, DM Sans), light/dark completo, props-based, sem fetch interno
- Não duplica configurações de nível de clínica (essas vivem em `configuracoes-clinica`)
- Independente de `sections-doctor`; Switch é cópia local (seções autocontidas)
