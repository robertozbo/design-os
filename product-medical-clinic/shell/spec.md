# Application Shell Specification — Nymos Clínica

## Overview

Nymos Clínica tem **3 shells distintos por persona**, refletindo papel e nível de acesso dentro da clínica multi-especialidade. Os três compartilham a identidade visual Nymos (logo, paleta teal, DM Sans); a navegação é específica por persona pra refletir o RBAC fixo do V1.

Preview interativo (toggle de persona): `/medical-clinic/shell`.

## Personas e Navegação

### Médico (web — side-nav)
Foco no fluxo clínico centrado no paciente. Acessa o **prontuário compartilhado** dos pacientes da clínica sob escopo (com audit log).

**O Início é o dashboard de trabalho do médico** — é dali que ele opera o dia: as **próprias** consultas em ordem cronológica, com a atual destacada e o CTA para abrir/continuar o atendimento, mais os alertas acionáveis (mensagens, exames a revisar) e os encaminhamentos recebidos aguardando aceite. Escopo = só os pacientes e atendimentos dele + o que lhe foi encaminhado.

A **Agenda é outra coisa**: o calendário compartilhado da clínica, multi-profissional, em colunas por médico ou por sala. Serve para enxergar disputa de horário, sala e recurso entre as especialidades — é ferramenta de coordenação, não a lista de trabalho do médico. Ele a consulta para marcar e para se situar no dia da clínica; para atender, usa o Início.
- **Atendimento**: Início, Agenda, Pacientes
- **Clínico**: Atendimentos, Exames, Prescrições
- **Operacional**: Mensagens (canal clínico), Configurações

> Prontuário, Consulta e Prescrição do paciente NÃO são top-level: o médico abre o paciente e navega pelas facetas dele (contexto ativo).

> **Cada section pertence a uma persona** e o preview a exibe sob a navegação de quem pode abri-la
> (mapa em `src/shell-medical-clinic/navs.ts`). Não é detalhe de preview: os screenshots do handoff
> são lidos como especificação, e uma tela de Faturamento com o menu do médico ensina o RBAC errado.

### Admin/Gestor (web — side-nav)
Gestão do negócio. **Nunca** vê conteúdo clínico de paciente.
- **Gestão**: Visão geral, Equipe, Salas & recursos
- **Financeiro**: Faturamento, Relatórios, Contas a receber, Contas a pagar
- **Cadastros**: Serviços, Fornecedores, Tipos de conta
- **Operacional**: Agenda (visão de ocupação), Configurações da clínica

> Preço de serviço, categorias financeiras, fornecedores, contas e convites de equipe são **do
> Admin**. O médico não vê nem edita nenhum deles — ele consome o resultado (o serviço já
> precificado aparece no wizard de agendamento), não o cadastro.

### Recepção (web — side-nav reduzida)
Operacional puro. Abre direto em Agenda. Sem acesso clínico.
- Agenda (multi-médico), Pacientes (só admin), Mensagens (canal admin), Cobrança, Configurações

### Paciente (mobile — bottom-nav)
- Início, Agenda, Medicação, Mensagens, Perfil
- Vê os médicos da clínica a que está vinculado, em tracks separadas.

## Identidade
- Logo "N" teal + badge de persona no topo do side-nav ("Clínica · Médico / Gestão / Recepção")
- User menu no rodapé (avatar + dropdown: perfil, configurações, logout)
- Responsivo (side-nav vira drawer em mobile), light/dark
