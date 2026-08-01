# Pacientes Specification

## Overview
O **pool compartilhado de pacientes** da clínica — a lista única de pacientes que pertencem à clínica (não a um médico). É o coração conceitual do produto Clínica: cada paciente tem uma **equipe de cuidado** multi-especialidade, e qualquer médico autorizado o encontra aqui. Diferente do consultório individual (onde a lista é "meus pacientes"), aqui há o toggle **Toda a clínica ↔ Meus pacientes**, e cada linha exibe os **vários médicos** vinculados ao paciente. Recepção vê só dados administrativos; médico abre o prontuário compartilhado a partir daqui.

## User Flows

### Ver o pool
- Médico/recepção abre Pacientes → lista de pacientes da clínica (a recepção sob escopo administrativo — ver abaixo)
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

## Escopo por persona — dois screen designs

A tela serve **médico e recepção**: as duas personas cadastram paciente e enviam convite. Mas a
recepção não pode ver diagnóstico (LGPD Art. 11), então o componente aceita
`escopo: 'clinico' | 'administrativo'` — é o mesmo componente recortado, não uma segunda tela.

| | `clinico` (médico) | `administrativo` (recepção) |
|---|---|---|
| Condições crônicas na linha | ✅ | oculto |
| Condições no drawer e no cadastro | ✅ | oculto |
| Busca por condição | ✅ | só por nome |
| Nome, idade, convênio, status do app, convite | ✅ | ✅ |
| Equipe de cuidado e especialidade da próxima consulta | ✅ | ✅ |

Screen designs: `PacientesLista` (médico) e `PacientesAdmin` (recepção).

**Ao editar no escopo administrativo, as condições já registradas são preservadas** — o campo some,
o dado não. A recepção não apaga o que não vê.

**O que continua visível para a recepção, de propósito:** os médicos vinculados e a especialidade da
próxima consulta. Revelam área de saúde por inferência, mas o balcão não agenda sem isso — e a
alternativa (esconder) tornaria a tela inútil para quem mais a usa. Diagnóstico é a linha; a agenda
não é.

## Convite pro app

**O convite vai por email** — mesmo padrão da vertical Personal (`product-personal/sections/alunos`),
não por código digitado. O email é o identificador do paciente; sem email cadastrado o botão de
convite fica desabilitado, com tooltip explicando.

Fluxo completo, as duas pontas:

1. Clínica cadastra o paciente com email, ou abre um já existente e clica "Convidar app"
2. O paciente passa a `convite-pendente` e o convite é entregue por email **e** dentro do app
3. No app, "Aceitar" **não vincula na hora**: abre `PermissoesCompartilhamento`, onde o paciente
   escolhe que dados a clínica verá. **É confirmar as permissões que cria o vínculo** — só então o
   status vira `vinculado`
4. Enquanto pendente, a clínica pode reenviar (o botão troca de rótulo)

### Os dois caminhos do convidado

**Paciente que já usa o Nymos** — o convite aparece em `product-mobile/sections/profissionais` →
aba **Convites → Recebidos**, com o card do profissional e os botões Aceitar/Recusar. Esse caminho
já existe.

**Paciente que ainda não tem o app** — é o caso majoritário quando uma clínica convida. O email
precisa levar ao download, e **o convite pendente tem que aparecer no primeiro acesso**, logo após
o cadastro, antes ou junto do onboarding. Sem isso o paciente instala, entra num app vazio, não
entende por que foi convidado, e a clínica fica com "convite pendente" eterno — o vínculo morre no
meio do caminho.

> **Gap conhecido:** as specs de `onboarding`, `signup`, `welcome` e `onboarding-completo` do app
> **não mencionam convite pendente**. O contrato acima é o que a implementação precisa cobrir; a
> tela do primeiro acesso ainda não foi desenhada para ele.

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
- Independente de `sections-doctor`
- Cores de especialidade consistentes com Agenda/Prontuário (endo=teal, cardio=rose, nutro=violet, geral=sky)
- Reforça a mensagem "paciente da clínica" (pool), não "do médico"
