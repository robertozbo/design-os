# Prontuário Compartilhado Specification

## Overview
O prontuário **único por paciente, compartilhado entre os médicos da clínica**. É o diferencial clínico do produto Clínica (vs. o prontuário single-doctor do Nymos Clínico). Um paciente atendido por endócrino, cardiologista e nutrólogo da mesma casa tem **um** prontuário longitudinal; cada médico autorizado acessa sob **vínculo ativo + consentimento**, e **toda leitura/edição/inferência de IA é registrada em audit log** (LGPD Art. 11). A tela enfatiza três coisas que o prontuário individual não tem: (1) **equipe de cuidado** multi-especialidade, (2) **timeline de evoluções com autor + especialidade**, (3) **audit log** de acesso.

## User Flows

### Abrir o prontuário compartilhado
- Médico abre um paciente da clínica → aba Prontuário
- **Banner de acesso**: "Prontuário da clínica · você está acessando via vínculo ativo (Endocrinologia)" + selo de consentimento de tutela da saúde
- Vê a **equipe de cuidado**: avatares dos médicos vinculados ao paciente, com especialidade e último atendimento; destaca o médico principal
- Vê a **anamnese compartilhada** (condições crônicas, medicações em uso agregadas por especialidade, alergias) e a **timeline de evoluções** de todas as especialidades

### Ler a timeline cross-especialidade
- Evoluções em ordem cronológica (mais recente no topo), cada card com: data, **autor (médico) + badge de especialidade**, modalidade (presencial/tele), selo IA (se assistida, com modelo), resumo do plano
- Filtro por especialidade e por médico (ver só cardio, só a Dra. Helena, etc.)
- Expandir um card revela o SOAP completo
- Evoluções de outros médicos são **read-only**; só o autor edita a própria

### Ver medicação agregada
- Card de medicações em uso mostra o remédio + **quem prescreveu + especialidade** (ex.: Levotiroxina — Dra. Helena · Endocrinologia; Losartana — Dr. Marcos · Cardiologia)
- Deixa claro que a lista é a soma dos vínculos, evitando duplicidade/interação

### Auditoria de acesso (o diferencial LGPD)
- Botão "Quem acessou" abre drawer com **audit log**: cada evento = ator (médico/recepção), papel/especialidade, ação (visualizou / editou / IA inferência / exportou / prescreveu), alvo (seção) e timestamp
- Direito do titular: o paciente também pode ver esse log (no app)

### Exportar
- "Exportar PDF" com opção de incluir SOAP completo; a exportação em si vira um evento no audit log

## UI Requirements

### Layout
- **Header sticky**: identidade do paciente (iniciais/avatar, nome, idade, condições) à esquerda; à direita ações (Quem acessou, Exportar PDF)
- **Banner de acesso** (faixa teal discreta) logo abaixo do header, com o vínculo/consentimento
- **Equipe de cuidado**: linha de avatares com tooltip (nome, especialidade, último atendimento); médico principal com anel/label
- **Grid 2 colunas** (desktop; empilha no mobile):
  - Coluna principal: **Timeline de evoluções** (cards expansíveis) com barra de filtro (especialidade/médico) no topo
  - Coluna lateral: **Anamnese compartilhada** (condições, medicações agregadas com autoria, alergias)
- **Audit drawer** à direita: lista de eventos com ícone por ação, ator + especialidade, e "há X" relativo

### Estados & regras
- Evolução de outro médico: badge "somente leitura"; a do próprio médico logado: editável (mock)
- Selo IA em evoluções assistidas, com modelo+versão (transparência)
- Cada ação relevante gera toast "· registrado no log de acesso"
- Cores de especialidade consistentes (endo=teal, cardio=rose, nutro=violet, geral=slate)

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- **Independente do prontuário do Nymos Clínico** — não importa componentes de `sections-doctor`
- Foco no que difere do individual: multi-autoria + auditoria; o template de anamnese por especialidade pode aprofundar em iterações futuras
