# Agenda Specification

## Overview
Calendário compartilhado entre médico e secretária do consultório de endocrinologia. Mostra consultas presenciais e teleconsultas no mesmo grid semanal (default), com bloqueios visíveis, status por consulta (pendente, confirmada, realizada, cancelada, faltou) e fluxo de criação/edição via drawer lateral. Painel esquerdo concentra navegação rápida (mini-calendário), operação da secretária (pendentes a confirmar), filtros e visão das próximas 3 consultas.

## User Flows

### Navegação básica
- Médico ou secretária abre Agenda
- Vê semana atual em grid de 7 dias × time slots; visão default = semana
- Pode trocar visão pra Dia ou Mês via toolbar
- Setas `←` `→` navegam pra semana anterior/próxima; botão "Hoje" volta pra semana corrente
- Click no mini-calendário lateral pula direto pra qualquer semana/dia

### Criar nova consulta
- **Caminho 1 (rápido)**: clica num slot vazio do grid → abre drawer direito com data/hora pré-preenchidas
- **Caminho 2**: clica no botão "Nova consulta" no topo → drawer abre vazio
- Preenche: paciente (autocomplete), data/hora, duração, modalidade (presencial/tele), valor, observação opcional, marca "encaixe" se aplicável
- Salvar cria com status `pendente` (a confirmar com paciente) ou `confirmado` (se feito pela secretária ao telefone)

### Editar consulta existente
- Click numa consulta do grid → drawer abre com dados preenchidos
- Edita campos, salva
- Botão "Cancelar consulta" disponível com confirmação

### Confirmar pendentes (secretária)
- Painel lateral mostra lista de **pendentes a confirmar**
- Cada item: nome do paciente, data/hora, modalidade
- CTA "Confirmar" dispara mensagem padronizada pro paciente (via canal admin); status muda pra `confirmado`
- CTA "Remarcar" abre drawer; "Cancelar" cancela

### Aplicar filtros
- Painel de filtros tem toggles: status (multi), modalidade (multi), paciente (autocomplete)
- Filtros aplicam visualmente — consultas filtradas ficam em opacidade reduzida ou escondidas (toggle de comportamento)

### Bloqueios
- Médico/secretária podem criar bloqueios (almoço, evento, viagem)
- Visualmente aparecem como faixas hachuradas no grid
- Não permitem agendamento de consulta no slot bloqueado

## UI Requirements

### Layout
- **Topbar** (sticky): "Hoje" + setas `←` `→` + label "Maio · semana 2/2026" + segmented (Dia · Semana · Mês) + botão "+ Nova consulta" (teal, prominente)
- **Sidebar esquerda** (~280px, fixa): mini-calendário, pendentes, filtros, próximas 3
- **Grid central** (flex 1): calendário semanal scrollável vertical (07h–20h); horários no eixo Y, dias no eixo X
- **Drawer direito** (~440px) quando criando/editando: formulário, sobreposto ao grid mas o grid continua visível atrás

### Grid de consulta
- Cada consulta = bloco colorido por status:
  - **Pendente** — amarelo suave com borda tracejada
  - **Confirmado** — teal sólido (Nymos primary)
  - **Realizado** — slate (passado, neutro)
  - **Cancelado** — riscado, opacidade reduzida
  - **Faltou** — coral/rose accent
- Modalidade indicada por **ícone**: 🏥 presencial · 🎥 tele
- Encaixe = badge "encaixe" + leve tilt visual
- Bloqueio = padrão diagonal hachurado + label
- Hover mostra tooltip com paciente + duração + valor

### Sidebar — pendentes
- Card compacto por pendente: avatar com iniciais + nome + data abreviada (06/05 14h) + ações (Confirmar / Remarcar / Cancelar) com ícones inline
- Vazio: "Sem pendentes pra confirmar 👌"

### Sidebar — próximas 3
- Cards com nome + condições crônicas + horário + modalidade + botão "Iniciar consulta" (quando estiver no horário) ou "Ver paciente"

### Sidebar — filtros
- Chips toggle por status (5 chips coloridos)
- Chip toggle por modalidade (presencial · tele)
- Autocomplete pra filtrar por paciente
- Botão "Limpar filtros" quando algum ativo

### Drawer de criação/edição
- Header: "Nova consulta" ou "Editar consulta — Maria Silva"
- Form: paciente (autocomplete com últimos atendidos no topo), data/hora (date+time picker), duração (preset 30/45/60min), modalidade (toggle presencial/tele), valor (input com R$), observação (textarea), checkbox "encaixe"
- Footer: "Cancelar" + "Salvar" (teal) — modo edição também tem "Cancelar consulta" em coral à esquerda

### Mini-calendário
- Grid mensal compacto; dia atual destacado com anel teal; dias com consulta com ponto teal; click muda foco do grid principal

### Estados vazios
- Semana vazia: ilustração leve + "Nada pra essa semana ainda. Comece com **Nova consulta**."

### Acessibilidade
- Setas teclado navegam slots
- Enter abre drawer
- Status anunciado via aria-live ao confirmar/cancelar

## Configuration
- shell: true
