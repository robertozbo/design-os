# Equipe Specification

## Overview
Gestão da equipe da clínica — a section onde o **Admin/Gestor** administra quem trabalha no workspace. Lista os membros (médicos, recepção, outros admins) com papel, especialidade e status; convida novos por email; ajusta papel; remove; e mostra o consumo do plano (nº de médicos usados vs. limite). É o diferencial multi-profissional do produto — não existe no Nymos Clínico (single-doctor). Só o papel Admin acessa esta tela.

## User Flows

### Ver a equipe
- Admin abre **Equipe**
- Vê o header com nome da clínica + **barra de consumo do plano** ("3 de 6 médicos"), a mensalidade
  vigente, a **composição da equipe por papel** (N médicos · N recepção · N admin) e o botão
  "Convidar membro"
- Vê a lista de membros agrupada/filtrável por papel (Admin · Médico · Recepção)
- Cada membro: avatar/iniciais, nome, papel (badge), especialidade + CRM (se médico), status (ativo / convite pendente / inativo), e — pra médicos — indicadores (pacientes ativos, atendimentos no mês)
- Busca por nome ou especialidade; filtro por papel e por status

### Convidar novo membro
- Botão "Convidar membro" abre drawer à direita — o convite serve para **médico,
  recepção ou admin**, por isso o rótulo não fala em médico
- Form: email, papel (Admin/Médico/Recepção), especialidade (só quando papel = Médico)
- Ao enviar: cria convite pendente (usa `workspace_invites`), dispara email, aparece na lista com status "convite pendente"
- Bloqueia convite de médico se o limite do plano foi atingido → mostra aviso + CTA de upgrade
- Convite tem validade (7 dias); mostra "expira em X dias"

### Gerir convite pendente
- Em um membro com status "convite pendente": ações **Reenviar** e **Revogar**
- Revogar remove da lista + registra no audit log

### Gerir membro ativo
- Kebab por membro: **Editar papel**, **Remover da clínica**
- Alterar papel muda permissões imediatamente (RBAC)
- Remover um médico com pacientes ativos → dialog de confirmação explicando o que acontece com os vínculos (pacientes ficam na clínica; CareLinks precisam ser reatribuídos/encaminhados)
- Não é possível remover o último Admin

## UI Requirements

### Layout
- **Header**: nome da clínica + CNPJ (discreto); à direita, chip de plano com barra de progresso de médicos e botão primário "Convidar médico" (teal)
- **Toolbar**: busca (input com ícone) à esquerda; filtros-chip de papel (Todos · Admin · Médico · Recepção) e status à direita
- **Lista**: cards ou linhas de tabela (responsivo: tabela em desktop, cards em mobile)
  - Coluna/linha 1: avatar + nome + email
  - Papel: badge colorido (Admin = âmbar, Médico = teal, Recepção = slate)
  - Médico: especialidade · CRM, + mini-stats (pacientes, atendimentos/mês)
  - Status: badge (ativo = emerald, convite pendente = amber com "expira em Xd", inativo = slate)
  - Ações: kebab (editar papel, remover) ou, se pendente, botões Reenviar/Revogar
- **Convite drawer**: form à direita, com validação de email e regra de limite de plano
- **Empty state** de convites: quando não há pendentes, some a seção

### Estados
- Consumo no limite: barra fica âmbar/vermelha e aparece o preço da faixa seguinte. O botão
  **continua habilitado** — o limite é de médicos, e recepção/admin seguem convidáveis; quem bloqueia
  por papel é o drawer, só quando o papel escolhido é "Médico"
- Loading/otimista: convite enviado aparece imediatamente com toast "Convite enviado para {email}"

### Comportamento
- Todas as ações mostram **toast** de confirmação
- Ações sensíveis (remover médico, revogar convite) passam por dialog
- Registrar que ações de equipe entram no **audit log** (texto no toast: "· registrado no log")

## Design Notes
- Reusa a identidade Nymos (teal, DM Sans), light/dark
- Props-based: a view recebe `clinica`, `membros`, `convites` e callbacks; sem fetch interno
- Badges de papel/status consistentes com o resto do produto

## Plano e preço

O tier **Clínica** é cobrado por **faixa de médicos** — só médico é seat pago; recepção e admin são
ilimitados e gratuitos (ver `docs/modelo-monetizacao.md`).

| Faixa | Mensalidade |
|---|---|
| até 1 médico | R$ 49,90 |
| até 3 médicos | R$ 129,90 |
| até 6 médicos | R$ 229,90 |
| até 12 médicos | R$ 399,90 |
| acima de 12 | sob consulta |

Por isso a tela precisa expor a **contagem por papel**: é ela que determina a fatura. Convite pendente
não consome seat — só membro `ativo` conta.
