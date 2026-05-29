# Pacientes Specification

## Overview
Carteira do fisioterapeuta — lista de pacientes ativos com busca, filtros por status (Em tratamento · Em alta · Inativos) e KPIs no topo (total ativos, em alta esta semana, sem evolução >7 dias, novos no mês). Cadastro de novo paciente é mínimo (nome + contato + convite Nymos Move). A **ficha individual / Hub do Paciente** é o coração da seção: tela única com 5 abas que consolidam tudo do paciente — Visão geral, Avaliações, Evolução, Agenda, Saúde (dados de wearable). É a tela que cruza dados de praticamente todas as outras seções (Avaliação, Evolução, Agenda) e do Nymos Move (prescrição + aderência).

## User Flows
- Listar pacientes com tabs: Em tratamento · Em alta · Inativos (com contadores)
- Buscar por nome ou telefone
- Filtrar adicional por queixa principal (Coluna, Joelho, Ombro, Pós-cirúrgico, Outros)
- Cadastrar novo paciente: drawer mínimo (nome obrigatório + telefone/email + queixa opcional + toggle "Enviar convite Nymos Move")
- Convidar paciente para o Nymos Move (gera link/QR — paciente entra grátis)
- Reenviar convite (se pendente)
- Arquivar / restaurar paciente
- Abrir Hub do Paciente (click na linha)

### Hub do Paciente (ficha individual)
- Header: avatar + nome + idade + queixa principal + data de início do tratamento
- Status badge condicional do Nymos Move:
  - **Não convidado** → botão primário "Enviar convite Nymos Move"
  - **Convite pendente** → badge âmbar "Convite pendente" + link "Reenviar"
  - **Conectado** → badge verde "Conectado ao Nymos Move" (sem botão)
- Action bar: Agendar sessão · Nova avaliação · Nova evolução · ⋯ (Editar dados · Arquivar)
- Stats row (5 colunas): EVA atual · Sessões realizadas · Última avaliação · Próxima sessão · Aderência exercícios domiciliares
- Tabs: **Visão geral · Avaliações · Evolução · Agenda · Saúde**

#### Visão geral
- Grid 2-col: esquerda (8) com card "Quadro atual" (queixa, hipótese, plano resumido) + atividade recente (últimos 5 eventos); direita (4) com alertas + próxima sessão
- Mini-gráfico de EVA das últimas 8 sessões (barras pequenas)
- Atalhos: Nova evolução · Agendar · Prescrever exercício (Nymos Move)

#### Avaliações
- Lista cronológica de avaliações (inicial + reavaliações periódicas)
- Cada card: data, EVA, ADM principal, observação resumida, link "Ver completa"
- Botão "+ Nova reavaliação"

#### Evolução
- Timeline cronológica de sessões com SOAP de cada uma
- Cada sessão: data, EVA, condutas aplicadas, observação curta
- Gráfico de evolução selecionável (EVA, ADM, função) ao longo do tratamento

#### Agenda
- Próximas sessões agendadas desse paciente
- Histórico de sessões com status (realizada/falta/cancelada)
- Botão "+ Agendar sessão"

#### Saúde (diferencial Nymos)
- Apenas visível se paciente conectado ao Nymos Move
- Dados do wearable: passos (7 dias), sono médio, FC repouso, FC em pico
- Aderência aos exercícios domiciliares prescritos (gráfico semanal)
- Alertas: "Dormiu <6h em 4 das últimas 7 noites" · "Não fez exercícios há 5 dias"

## UI Requirements
- Cabeçalho com título "Pacientes", contador total, botão "+ Novo paciente" (teal-600) à direita
- KPI strip (4 cards): Total ativos, Em alta esta semana, Sem evolução >7 dias, Novos no mês
- Tabs no topo (Em tratamento · Em alta · Inativos) com contador mono
- Search full-width (placeholder "Buscar por nome ou telefone…")
- Linha de filtros: chips de queixa principal
- **Lista em tabela densa**:
  - Header: Paciente · Queixa · EVA · Última sessão · Próxima · Status Nymos Move · Ações
  - Cada linha: avatar (32px) + nome + telefone · queixa curta · EVA atual (badge colorido) · "há X dias" · "em Y dias" · badge Nymos Move · ações inline (Agendar · Nova evolução · menu)
  - Hover destaca linha
  - Click na linha (não nas ações) abre Hub
  - Linhas sem evolução >7 dias com tinge âmbar à esquerda
  - Linhas inativas em opacidade 60%
- Drawer "Novo paciente" (right-side, ~480px):
  - Nome (obrigatório)
  - Telefone (com máscara BR)
  - Email
  - Data de nascimento
  - Queixa principal (textarea curta opcional)
  - Toggle "Enviar convite Nymos Move agora" (default ON)
  - Footer: Cancelar · Salvar
- Hub do Paciente em página dedicada (`/fisio/sections/pacientes/:pacienteId` ou via querystring)
- Estilo visual: gradient bg, max-w-[1400px], teal primary, lucide icons
- Light & dark mode + responsive (tabela vira cards em mobile; ficha tabs viram select dropdown)

## Configuration
- shell: true
