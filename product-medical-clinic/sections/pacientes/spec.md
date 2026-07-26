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
- Clicar numa linha abre **drawer de resumo**: identidade, equipe de cuidado (nome + especialidade
  + principal), próxima consulta e o bloco **App Nymos**
- O bloco App Nymos reúne status e ação no mesmo lugar: badge do vínculo, a frase do estado atual
  (vinculado por qual email · convite enviado aguardando aceite · ainda não convidado) e o botão
  "Enviar convite"/"Reenviar convite". Some quando já está `vinculado`; fica desabilitado sem email
- Botão **"Abrir prontuário compartilhado"** leva ao prontuário (cross-especialidade + audit log)
- Botão "Convidar app" para paciente sem vínculo (vira "Reenviar convite" se já pendente);
  "Nova consulta" agenda

### Novo paciente
- "+ Novo paciente" (mock): cadastro entra no pool da clínica com nome, idade, gênero, convênio e
  **email**, mais o toggle "Enviar convite do app agora" (default ligado, desabilitado sem email
  válido)

## Convite pro app

**O convite vai por email** — mesmo padrão da vertical Personal (`product-personal/sections/alunos`),
não por código digitado. O email é o identificador do paciente; sem email cadastrado o botão de
convite fica desabilitado, com tooltip explicando.

Fluxo completo, as duas pontas:

1. Clínica cadastra o paciente com email, ou abre um já existente e clica "Convidar app"
2. O paciente passa a `convite-pendente` e o convite chega **dentro do app** — em
   `product-mobile/sections/profissionais` → aba **Convites → Recebidos**
3. No app, "Aceitar" **não vincula na hora**: abre `PermissoesCompartilhamento`, onde o paciente
   escolhe que dados a clínica verá. **É confirmar as permissões que cria o vínculo** — só então o
   status vira `vinculado`
4. Enquanto pendente, a clínica pode reenviar (o botão troca de rótulo)

`statusApp` reflete isso o tempo todo: `nao-convidado` → `convite-pendente` → `vinculado`.

> **Aberto:** o convite é da **clínica** (workspace), não de um médico específico — coerente com o
> pool compartilhado e com a recepção podendo convidar. A equipe de cuidado se forma pelos
> atendimentos, não pelo convite. O backend hoje modela `professional_patients` (profissional ↔
> paciente), então esse vínculo no nível do workspace é o gap que o roadmap já aponta como o maior
> a construir.

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
