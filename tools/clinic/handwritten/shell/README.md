# Application Shell — Nymos Clínica

## Overview

A clínica tem **3 shells web distintos por persona**, refletindo papel e nível de acesso. Os três
compartilham a identidade Nymos (logo, teal, DM Sans) e o mesmo componente `AppShell` — o que muda é
o conjunto de `navigationGroups` e a `persona` passados como props.

A navegação **não é cosmética**: ela materializa o RBAC fixo do V1. Admin e recepção não têm rota
clínica porque não podem ter — é requisito de LGPD, não decisão de layout. Ao ligar seu roteador,
proteja as rotas no servidor também; esconder o item do menu não é controle de acesso.

## Personas e navegação

### Médico
Fluxo clínico centrado no paciente. **Não administra o workspace nem o financeiro da clínica.**

- **Atendimento**: Início, Agenda, Pacientes
- **Clínico**: Atendimentos, Exames, Prescrições
- **Operacional**: Mensagens (canal clínico), Configurações

> Prontuário, Consulta e Prescrição do paciente **não são top-level**: o médico abre o paciente e
> navega pelas facetas dele. Preserve isso ao montar as rotas — são rotas aninhadas em Pacientes.

O **Início é o dashboard de trabalho** do médico: as próprias consultas do dia, a atual destacada,
alertas acionáveis e encaminhamentos a aceitar. A **Agenda** é o calendário compartilhado da
clínica, em colunas por médico ou por sala — ferramenta de coordenação, não lista de trabalho. Por
isso ela não tem toggle "Meus/Todos": o recorte pessoal vive no Início.

### Admin/Gestor
Gestão do negócio e o dinheiro. **Nunca** vê conteúdo clínico.

- **Gestão**: Visão geral, Equipe, Salas & recursos
- **Financeiro**: Faturamento, Relatórios, Contas a receber, Contas a pagar
- **Cadastros**: Serviços, Fornecedores, Tipos de conta
- **Operacional**: Agenda (visão de ocupação), Configurações da clínica

Preço de serviço, categorias financeiras, fornecedores, contas e **convite de novo membro da
equipe** são do Admin. O médico consome o resultado — o serviço já precificado aparece no wizard de
agendamento — mas não abre o cadastro.

### Recepção
Operacional puro. Abre direto em Agenda. Sem acesso clínico.

- Agenda (multi-médico), Pacientes (só dados administrativos), Mensagens (canal admin), Cobrança,
  Configurações

### Paciente (mobile)
Bottom-nav: Início, Agenda, Medicação, Mensagens, Perfil. Componentes `MobileShell` e
`MobileBottomNav`.

## Componentes fornecidos

| Componente | Papel |
|---|---|
| `AppShell` | Wrapper de layout web: side-nav + conteúdo + user menu |
| `MainNav` | Navegação agrupada, com estado ativo |
| `UserMenu` | Avatar + dropdown (perfil, configurações, logout) |
| `MobileShell` | Wrapper do app do paciente |
| `MobileBottomNav` | Bottom-nav do mobile |

## Props do `AppShell`

```ts
interface AppShellProps {
  children: ReactNode
  navigationGroups: NavGroup[]
  activeHref?: string
  user: ShellUser
  persona?: 'medico' | 'admin' | 'recepcao'   // define o badge do topo
  onNavigate?: (href: string) => void          // ligue ao seu roteador
  onLogout?: () => void
  onProfileClick?: () => void
  onSettingsClick?: () => void
}
```

`NavGroup` e `NavItem` estão em `components/MainNav.tsx`; `ShellUser` em `components/UserMenu.tsx`.

O shell não conhece roteador: ele chama `onNavigate(href)` e destaca o item cujo href bate com
`activeHref`. Ligue esses dois pontos ao seu router e o resto funciona.

## Quem abre o quê

A tabela abaixo é o RBAC do V1 e vale para as rotas, não só para o menu:

| Section | Médico | Admin | Recepção |
|---|---|---|---|
| Início (dashboard do médico) | ✅ | — | — |
| Consulta, Prontuário, Acompanhamento, Exames, Prescrições, Atendimentos, Encaminhamento | ✅ | ❌ | ❌ |
| Pacientes (com condição crônica e equipe de cuidado) | ✅ | ❌ | ❌ |
| Pacientes (só dados administrativos) | ✅ | — | ✅ |
| Agenda | ✅ | ✅ | ✅ |
| Mensagens — canal clínico | ✅ | ❌ | ❌ |
| Mensagens — canal administrativo | — | — | ✅ |
| Cobrança | — | ✅ | ✅ |
| Visão geral, Equipe (e convites), Salas | — | ✅ | — |
| Faturamento, Relatórios, Contas a receber/pagar | — | ✅ | — |
| Serviços, Fornecedores, Tipos de conta | — | ✅ | — |
| Configurações | própria | da clínica | própria |

❌ = proibido por LGPD, não é preferência de layout. — = fora do escopo do papel.

Duas notas: a variante administrativa de Pacientes (sem dado clínico) **não foi desenhada** como
tela separada — o componente entregue é o do médico, e cabe à implementação recortar os campos para
a recepção. E os dois canais de Mensagens são a mesma tela com escopos distintos.

## Responsivo e tema

Side-nav vira drawer no mobile (breakpoint `lg`). Todos os componentes trazem variantes `dark:`;
o tema é a classe `dark` no elemento raiz.

## Nota sobre a nav em telas curtas

A lista de navegação do médico é longa (5 grupos) e rola por dentro do side-nav. Em viewport de
altura pequena, o último grupo fica fora da área visível sem indicação óbvia. Se o seu público usa
laptop de 13", considere um indicador de scroll ou agrupar Financeiro sob um item recolhível.

## Referência visual

O shell aparece em torno de todas as telas nos screenshots de cada section — veja qualquer
`sections/<id>/*.png`.
