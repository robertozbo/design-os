# Prescrição Specification

## Overview
Section autônoma de gestão das receitas digitais emitidas pelo médico via **Memed** (validade ICP-Brasil). É a entrada lateral pra **lista global de receitas** com filtros e pro **hub de renovação simplificada** de medicação contínua — médico renova levotiroxina, metformina, GLP-1, insulina etc. sem precisar de consulta agendada (Memed pré-preenchido com a última prescrição). Detalhe abre em drawer lateral; cancelamento exige justificativa. Source-of-truth dos itens é o Memed; Nymos referencia, audita e organiza.

## User Flows

### Lista global de receitas
- Médico abre "Prescrição" no side-nav
- Vê todas as receitas emitidas pros próprios pacientes (escopo do `VínculoPacienteProfissional`)
- KPIs no topo: Ativas · Precisa renovar · Expiradas · Canceladas (últimos 30 dias)
- Filtros: busca (paciente ou medicação) · chips de status (Ativa · Expirada · Cancelada · Precisa renovar) · seletor de período (7d · 30d · 90d · tudo)
- Cada linha: avatar + paciente · medicações resumidas (até 2 chips + "+N") · data emissão · validade (countdown se ≤14d) · status · origem
- Ordenação default: mais recentes primeiro

### Detalhe de uma prescrição (drawer lateral)
- Clique numa linha abre drawer ~480px à direita (overlay leve no fundo)
- Cabeçalho fixo: avatar + nome paciente + condições crônicas + botão fechar
- Body scrollável:
  - Itens da receita — cards com medicação · princípio ativo · dose · posologia · duração · observação opcional
  - Validade ICP-Brasil + countdown
  - Origem: link "Ver consulta de DD/MM" (se origem = consulta) ou badge "Renovação sem consulta" / "Prescrição avulsa"
  - Histórico: "Renovada N vezes" + link pra prescrição original (se renovação)
- Footer fixo com 4 ações: **Abrir PDF Memed** · **Renovar** · **Cancelar** · **Fechar**

### Renovação simplificada (hub via filtro "Precisa renovar")
- Chip "Precisa renovar" destacado em âmbar (atenção, não erro)
- Filtro mostra apenas prescrições `ativa` com validade ≤14 dias
- Cada linha ganha botão "Renovar" inline (atalho — não precisa abrir drawer)
- Clique em "Renovar" abre Memed embutido com itens pré-preenchidos da prescrição atual
- Médico ajusta dose/posologia se quiser → emite
- Nova `Prescrição` é criada com `origem: renovacao_sem_consulta`; aponta pra prescrição anterior via `renovacaoDe`
- Audit log registra `tipo: renovacao_sem_consulta`
- Toast: "Receita renovada — paciente notificado no app"

### Nova prescrição direto (paciente sem consulta agendada)
- Botão "+ Nova prescrição" no header da lista abre seletor de paciente (search por nome/CPF)
- Após selecionar, abre Memed embutido em branco
- Após emitir: nova `Prescrição` com `origem: prescricao_avulsa`; audit log registra `tipo: prescricao_avulsa`
- (Atalho equivalente existe na section Pacientes → detalhe → "Nova prescrição")

### Cancelamento
- Drawer → botão "Cancelar"
- Modal centralizado exige:
  - Categoria do motivo (radio chips): **Erro de prescrição** · **Mudança de conduta** · **Reação adversa** · **Outro**
  - Justificativa textual (textarea, mínimo 10 caracteres)
- Botão primário "Cancelar prescrição" em vermelho, botão secundário "Voltar"
- Ao confirmar, dispara cancelamento no Memed via API + atualiza status pra `cancelada` + audit log
- Drawer atualiza pra estado cancelado: itens em opacidade reduzida + faixa vermelha "Cancelada em [data] — [Categoria]: [justificativa]"
- Receita continua na lista (read-only) com badge "Cancelada"

## UI Requirements

### Layout da lista
- Container full-width dentro do shell
- **Header da página**: título "Prescrição" + contador de total + botão primário "+ Nova prescrição"
- **Faixa de KPIs** (4 mini-cards): Ativas (número grande + label) · Precisa renovar (número + cor âmbar) · Expiradas · Canceladas (30d)
- **Faixa de filtros**:
  - Campo de busca à esquerda (paciente ou medicação)
  - Chips de status no centro (Ativa · Expirada · Cancelada · Precisa renovar — toggle, multi-select exceto "Precisa renovar" que filtra dentro de Ativa)
  - Seletor de período à direita (dropdown 7d/30d/90d/tudo)
- **Lista** densa, uma linha por receita:
  - Avatar (iniciais) · nome paciente + condições crônicas (chip pequeno embaixo)
  - Medicações resumo (chips coloridos por classe — antidiabético, hormônio tireoidiano, hipolipemiante, etc.) — máximo 2 visíveis + "+N"
  - Data emissão · validade (texto pequeno; se ≤14d aparece countdown âmbar "vence em 6d", se ≤2d vermelho "vence amanhã")
  - Status (badge: verde · cinza · vermelho)
  - Origem (texto sutil cinza: "consulta" / "renovação" / "avulsa")
  - Quando filtro "Precisa renovar" ativo: botão **"Renovar"** inline na linha (atalho, sem abrir drawer)

### Empty states
- Sem prescrições: ilustração + texto "Nenhuma receita ainda — emita pelo fluxo de Consulta ou clique em + Nova prescrição"
- Filtro sem resultado: "Nenhuma receita com esses filtros" + botão "Limpar filtros"

### Drawer de detalhe (~480px à direita)
- Header fixo: avatar grande + nome + condições crônicas (chips) + botão fechar (×)
- Status badge logo abaixo do nome (Ativa / Expirada / Cancelada)
- Body scrollável dividido em seções:
  1. **Itens da receita** — cada item em card com bordas suaves: nome comercial · princípio ativo (cinza, menor) · dose · posologia · duração · observação opcional. Quando cancelada, opacidade reduzida.
  2. **Validade ICP-Brasil** — bloco destacado com data e countdown
  3. **Origem & contexto**:
     - Se `consulta`: link "Ver consulta de DD/MM" (clicável → navega pra Consulta)
     - Se `renovacao_sem_consulta`: badge cinza "Renovação sem consulta" + link pra prescrição original
     - Se `prescricao_avulsa`: badge cinza "Prescrição avulsa"
  4. **Histórico** (se houver renovações): "Renovada 3 vezes" + lista compacta com datas
  5. **Cancelamento** (só se status = cancelada): faixa vermelha com data, médico que cancelou, categoria do motivo, justificativa
- Footer fixo:
  - Estado normal: 4 botões — **PDF Memed** (ícone download) · **Renovar** (primário) · **Cancelar** (texto vermelho) · **Fechar**
  - Estado cancelada: 2 botões — **PDF Memed** · **Fechar**
  - Estado expirada: 3 botões — **PDF Memed** · **Renovar** · **Fechar**

### Memed embutido (modal full-screen)
- Modal cobre quase toda a viewport com Memed UI nativa dentro de iframe
- Header customizado: contexto "Renovando receita de [Paciente]" / "Nova prescrição pra [Paciente]" + botão "Cancelar e voltar"
- Após emissão, Memed dispara callback → modal fecha → lista atualiza → toast "Receita emitida — paciente notificado"
- Cancelamento dentro do Memed: modal fecha sem alteração

### Modal de cancelamento
- Centralizado, largura ~480px
- Título: "Cancelar prescrição?"
- Resumo no topo: paciente + chips das medicações
- Pergunta: "Por que essa receita está sendo cancelada?"
- 4 chips de motivo (radio, single-select):
  - Erro de prescrição
  - Mudança de conduta
  - Reação adversa
  - Outro
- Textarea "Justificativa (obrigatória)" — placeholder explicativo, contador de caracteres, mínimo 10
- Aviso pequeno: "Esta ação registra cancelamento no Memed e no audit log. Não é reversível."
- Botões: **Cancelar prescrição** (vermelho, primário, desabilitado até motivo + justificativa válida) · **Voltar** (secundário)
- Após confirmar: estado loading "Cancelando no Memed..." (~1-2s) → toast sucesso → drawer atualiza

### Origem da prescrição (visualização)
- Badges discretos na lista e no drawer:
  - `consulta` → texto "consulta" cinza, clicável no drawer
  - `renovacao_sem_consulta` → badge cinza pequeno "Renovação"
  - `prescricao_avulsa` → badge cinza pequeno "Avulsa"

### Estados de validade
- Validade ≥14 dias: texto cinza padrão "vence em DD/MM"
- Validade ≤14 dias: âmbar "vence em 6 dias"
- Validade ≤2 dias: vermelho "vence amanhã" / "vence hoje"
- Expirada: badge vermelho "Expirada há Nd"

### Acessibilidade & atalhos
- `Esc` fecha drawer ou modal aberto
- `R` com foco numa linha aciona renovação (quando ativa/precisa renovar)
- Lista navegável por setas + Enter abre drawer
- Drawer com `aria-modal="true"`, foco preso enquanto aberto
- Modal de cancelamento com confirmação verbal ao screen reader
- Contraste AA mínimo

## Configuration
- shell: true
