# Application Shell Specification — Nymos Clínica

## Overview

Nymos Clínica tem **3 shells distintos por persona**, refletindo papel e nível de acesso dentro da clínica multi-especialidade. Os três compartilham a identidade visual Nymos (logo, paleta teal, DM Sans); a navegação é específica por persona pra refletir o RBAC fixo do V1.

Preview interativo (toggle de persona): `/medical-clinic/shell`.

## Personas e Navegação

### Médico (web — side-nav)
Foco no fluxo clínico centrado no paciente. Vê a **própria** agenda + encaminhamentos recebidos; acessa o **prontuário compartilhado** dos pacientes da clínica sob escopo (com audit log).
- **Atendimento**: Início, Agenda, Pacientes
- **Clínico**: Atendimentos, Exames, Prescrições
- **Operacional**: Mensagens (canal clínico), Configurações

> Prontuário, Consulta e Prescrição do paciente NÃO são top-level: o médico abre o paciente e navega pelas facetas dele (contexto ativo).

### Admin/Gestor (web — side-nav)
Gestão do negócio. **Nunca** vê conteúdo clínico de paciente.
- **Gestão**: Visão geral, Equipe, Salas & recursos
- **Financeiro**: Faturamento, Relatórios
- **Operacional**: Agenda (visão de ocupação), Configurações da clínica

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
