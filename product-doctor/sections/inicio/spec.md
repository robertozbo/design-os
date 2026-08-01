# Início Specification

## Overview
Tela inicial (Dashboard) do médico ao logar no consultório. Apresenta de uma só vez tudo o que precisa pra começar o dia: **agenda do dia** com ações inline (iniciar consulta, ver paciente), **pacientes que precisam atenção** (exames novos, mensagens não respondidas, retornos atrasados), **KPIs da semana** (consultas, pacientes ativos, faturamento, adesão média) e **próxima consulta destacada** com contagem regressiva. Layout em 1 tela com colunas — densidade alta sem scroll significativo em desktop.

## User Flows

### Abrir o app
- Médico loga → cai no Início como tela default
- Hero contextual: "Bom dia, Dr. Pedro 👋 — você tem 8 consultas hoje, 3 já confirmadas"
- Saudação muda conforme hora do dia (manhã/tarde/noite)

### Próxima consulta destacada
- Card grande no topo com paciente + horário + countdown + modalidade + observação
- Se faltam ≤15min: pulse teal + botão "Iniciar consulta" (link pra section Consulta)
- Se faltam >15min: botão "Ver paciente" (vai pra detalhe)
- Se não há próxima hoje: card mostra "Sem consultas restantes hoje"

### Agenda do dia (coluna principal)
- Lista vertical das consultas de hoje em ordem cronológica
- Cada item: hora · paciente · condições · modalidade · status colorido · ações
- Status visual:
  - Realizado → cinza
  - Em andamento (atual) → teal pulsante
  - Confirmado futuro → teal sólido
  - Pendente → amber tracejado
  - Cancelado → riscado
  - Faltou → rose
- Click em consulta → drill pra prontuário do paciente
- "Iniciar consulta" inline na consulta atual/próxima

### Pacientes que precisam atenção (sidebar direita)
- Lista priorizada por urgência:
  - **Exame novo pra revisar** (mais urgente — laudo recém-chegado)
  - **Mensagem clínica não respondida** (paciente fez pergunta)
  - **Retorno atrasado** (passou da data sugerida sem reagendar)
  - **Adesão crítica** (paciente com adesão < 50% nos últimos 30d)
- Cada item: nome + ícone do tipo + 1 linha de contexto + click abre paciente

### KPIs da semana
- Strip horizontal de 4 cards no topo da coluna principal:
  - Consultas realizadas (X esta semana, comparação vs semana anterior)
  - Pacientes ativos no app (X% engajados)
  - Faturamento (R$ X esta semana)
  - Adesão média (% medicação cumprida)
- Cada card tem mini-trend (sparkline ou seta)

### Mensagens clínicas no header
- Indicador de mensagens não respondidas (badge vermelho no sino)
- Click vai pra section Mensagens (canal clínico)

## UI Requirements

### Layout (desktop primary)
- **Hero contextual** full-width no topo (saudação + frase contextual)
- **Strip de KPIs** abaixo do hero, 4 cards em row
- **Próxima consulta** destacada full-width abaixo (card largo)
- **Grid 2 colunas** com:
  - **Coluna principal** (~60%): Agenda do dia (timeline vertical)
  - **Sidebar direita** (~40%): Pacientes que precisam atenção
- Mobile: tudo empilha vertical (uma coluna)

### Hero
- "Bom dia, Dr. Pedro 👋" em DM Sans semibold 24px
- Frase contextual abaixo: "Você tem 8 consultas hoje, 3 já confirmadas." em slate-500
- Avatar pequeno do médico à direita com indicador de status (online)

### KPIs (cards)
- 4 cards de altura igual, gap pequeno
- Cada um: ícone + valor grande + label + delta vs período anterior (verde se ↑, rose se ↓)
- Mini-sparkline ou comparação visual

### Próxima consulta destacada
- Card grande com gradient sutil teal→white
- Layout horizontal: avatar grande + info à esquerda | countdown + ação à direita
- Se for "agora" (≤15min): pulsing ring teal + botão grande "Iniciar consulta"
- Se for futuro: countdown em monospace grande + botão "Ver paciente"

### Agenda do dia (coluna principal)
- Header: "Agenda de hoje" + total + filtro rápido (Todos / Pendentes / Realizados)
- Lista vertical com tarja vertical colorida por status (linha do tempo visual)
- Item compacto:
  - Hora à esquerda em monospace
  - Paciente + condições + observação
  - Modalidade (ícone)
  - Status badge
  - "Iniciar" inline na consulta atual

### Sidebar — Pacientes que precisam atenção
- Header: "Precisam atenção" + count
- Cards compactos por tipo de pendência com cores diferentes:
  - Exame novo: violet
  - Mensagem clínica: emerald
  - Retorno atrasado: amber
  - Adesão crítica: rose
- Cada card: ícone tipo + nome + contexto curto + chevron
- Vazio: "Tudo em dia ✓" em teal

### Estados especiais
- Sem consultas hoje (domingo, feriado): hero diz isso + foco nos pendentes
- Primeira vez (sem dados): empty states amigáveis

### Acessibilidade
- Cada item de agenda tem aria-label completo (paciente, hora, status)
- Skip link "Pular pra agenda" / "Pular pra pendentes"
- KPIs anunciam delta com texto

## Configuration
- shell: true
