# Pacientes Specification

## Overview
Hub central de gestão de pacientes do consultório. Tem **duas views**: lista (busca, filtros, cadastro, convite app) e detalhe drill-down do paciente com tabs (Visão geral · Atendimentos · Exames · Prescrições). Médico vê tudo dos seus pacientes; secretária vê só dados administrativos. Cada paciente é a entrada principal pra prontuário, exames, prescrições, e histórico longitudinal.

## User Flows

### Lista de pacientes
- Médico/secretária abre Pacientes
- Vê tabela/cards de pacientes ativos com: nome, idade, condições crônicas, última consulta, próxima consulta, status do app
- Busca por nome, CPF ou condição
- Filtra por: status do app (vinculado / convite pendente / não convidado), convênio, condição crônica
- Clica num paciente → abre **detalhe**
- Botão "+ Novo paciente" abre drawer de cadastro
- Botão "Convidar pro app" em paciente sem vínculo dispara convite por código

### Cadastro de novo paciente
- Drawer direito com form: nome completo, CPF, data nascimento, gênero, telefone, email, endereço (opcional), convênio (texto livre)
- Salvar cria paciente no consultório; opcionalmente já dispara convite pro app
- Após salvar, redireciona pra detalhe do paciente recém-cadastrado

### Convite pro app
- Disponível pra paciente sem vínculo
- Gera código único (ex: `MARIA-7K3X`) + link
- Pode enviar por SMS, email, ou copiar
- Status muda pra "convite pendente"
- Quando paciente abre o app e usa o código, status vira "vinculado"

### Detalhe do paciente — navegação
- Header sticky com **identidade do paciente**: nome + idade + condições + foto/iniciais + status do app + ações rápidas (mensagem clínica, agendar, ver prontuário PDF)
- Tabs no topo: **Visão geral** · **Atendimentos** · **Exames** · **Prescrições**
- Default na entrada: **Visão geral**

### Tab Visão geral
- Card de **resumo clínico**: condições crônicas, medicação ativa (3 mais relevantes), última HbA1c/TSH com tendência
- Card de **próxima consulta** (se houver): data + modalidade + observação + botão "Iniciar"
- Card de **adesão** (últimos 30 dias): % de medicação cumprida, % de medições do diário registradas
- Card de **alertas** (se houver): exames pendentes, mensagens não lidas, retorno atrasado

### Tab Atendimentos
- Timeline cronológica de consultas (mais recente no topo)
- Cada item: data, modalidade (presencial/tele), médico, plano resumido (1-2 linhas), badge IA se evolução foi assistida
- Click abre evolução completa em modal/drawer

### Tab Exames
- Lista de exames recentes com biomarkers e sparklines (mesma estrutura usada na seção Exames)
- Filtro por tipo (laboratorial / imagem)
- Botão "Solicitar exame" (V1: simples — texto livre + envio por mensagem clínica; integração formal V2)

### Tab Prescrições
- Histórico de prescrições Memed (mais recente primeiro)
- Cada item: data, medicações + doses, validade, status (ativa/expirada/cancelada)
- Card destacado **medicação ativa atual** com adesão (do diário do app paciente)
- Botão "Nova prescrição" abre Memed embutido

## UI Requirements

### Lista — layout
- **Topbar** com busca (input com ícone), botões "+ Novo paciente" + "Importar" (V2) à direita
- **Filtros chip** abaixo: status do app (4 chips), convênio (autocomplete), condição (autocomplete)
- **Tabela responsiva** com colunas: Avatar+Nome / Idade / Condições / Última consulta / Próxima / Status app / Ações
  - Em mobile, vira cards verticais
  - Hover em linha mostra fundo sutil
  - Click na linha → detalhe
- **Vazio**: ilustração + "Cadastre seu primeiro paciente"
- **Paginação** simples (se > 20)

### Lista — status do app (visual)
- 🟢 Vinculado — chip teal
- 🟡 Convite pendente — chip amber + tooltip com data do envio
- ⚪ Não convidado — chip slate + ação "Convidar"

### Detalhe — layout
- **Header sticky**: avatar (iniciais com gradient teal→emerald) + nome (h1) + idade · gênero · convênio · condições (chips) + ações à direita (mensagem, agendar, prontuário PDF, mais ⋯)
- **Tabs horizontais** abaixo do header (4 tabs)
- **Tab content** com max-width centralizado e padding generoso

### Detalhe — Visão geral
- Grid de 4 cards (2x2 em desktop, 1 col em mobile):
  - Resumo clínico (alto + largo)
  - Próxima consulta (compacto)
  - Adesão (gráfico de barras horizontais por medicamento)
  - Alertas (lista compacta)

### Detalhe — Atendimentos
- Timeline vertical com linha tracejada conectando itens
- Cada item: dot teal + data + card com modalidade + plano + badge IA
- Item ativo (próxima consulta) em destaque

### Detalhe — Exames
- Reusa visual do painel de exames da Consulta (cards com sparkline)
- Agrupa por mês: "Maio 2026", "Abril 2026"

### Detalhe — Prescrições
- Card destaque "Medicação ativa atual" no topo (igual ao painel de contexto da Consulta)
- Lista de receitas anteriores em cards compactos com data e medicações

### Drawer de cadastro
- Mesma estrutura do drawer de Agenda mas com campos diferentes
- 2 colunas em desktop pra agrupar (dados pessoais | contato)
- Footer: Cancelar + Salvar + Salvar e convidar

### Performance
- Lista virtualizada se > 100 pacientes (V2)
- Skeleton loaders nos cards

### Acessibilidade
- Tabela tem cabeçalhos `<th>` com `scope="col"`
- Tabs com `role="tab"` + `aria-selected`
- Header de paciente com `aria-label` descritivo

## Configuration
- shell: true
