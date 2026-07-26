# Pacientes Specification

## Overview
O **pool compartilhado de pacientes** da clínica — a lista única de pacientes que pertencem à clínica (não a um médico). É o coração conceitual do produto Clínica: cada paciente tem uma **equipe de cuidado** multi-especialidade, e qualquer médico autorizado o encontra aqui. Diferente do consultório individual (onde a lista é "meus pacientes"), aqui há o toggle **Toda a clínica ↔ Meus pacientes**, e cada linha exibe os **vários médicos** vinculados ao paciente. Recepção vê só dados administrativos; médico abre o prontuário compartilhado a partir daqui.

## User Flows

### Ver o pool
- Médico/recepção abre Pacientes → lista de pacientes da clínica
- Cada linha: paciente (nome, idade, condições), **equipe de cuidado** (avatares dos médicos vinculados, com +N), última consulta (com especialidade), próxima consulta, status do app
- Busca por nome/CPF/condição; filtros por **especialidade vinculada**, status do app
- Toggle **Toda a clínica / Meus pacientes** (o médico logado filtra pra onde está na equipe)

### Abrir um paciente
- Clicar numa linha abre **drawer de resumo**: identidade, equipe de cuidado (nome + especialidade + principal), próxima consulta, status do app
- Botão **"Abrir prontuário compartilhado"** leva ao prontuário (cross-especialidade + audit log)
- Botão "Convidar pro app" (código) para paciente sem vínculo; "Nova consulta" agenda

### Novo paciente
- "+ Novo paciente" (mock): cadastro entra no pool da clínica; opcionalmente já vincula ao médico logado e dispara convite

## UI Requirements

### Layout
- **Header**: "Pacientes" + subtítulo "pool compartilhado da clínica · N pacientes" + "+ Novo paciente" (teal)
- **Toolbar**: busca à esquerda; toggle escopo (Toda a clínica / Meus pacientes); chips de especialidade; filtro de status do app
- **Lista** (tabela desktop / cards mobile):
  - Avatar + nome + idade + chips de condição
  - **Equipe de cuidado**: pilha de avatares coloridos por especialidade (sobrepostos), com +N se passar de 3; tooltip com nomes
  - Última consulta (data + especialidade que atendeu) · Próxima consulta
  - Status do app: badge (vinculado emerald / convite pendente amber / não convidado slate)
- **Drawer** de resumo à direita

### Estados & regras
- "Meus pacientes": filtra os que têm o médico logado na equipe
- Recepção: colunas clínicas ocultas (sem condições/equipe clínica detalhada) — no protótipo, indicar via nota
- Empty state se filtro não retorna ninguém

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Independente de `sections-clinico`
- Cores de especialidade consistentes com Agenda/Prontuário (endo=teal, cardio=rose, nutro=violet, geral=sky)
- Reforça a mensagem "paciente da clínica" (pool), não "do médico"
