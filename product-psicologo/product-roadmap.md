# Roadmap — Nymos · Psicólogo (Web)

7 sections agrupadas em 3 categorias funcionais.

## Atendimento

### 1. Dashboard
**ID:** `dashboard`
Tela inicial pós-login. Visão do dia clínico: próxima sessão com countdown, sessões do dia, alertas de pacientes em risco (PHQ-9 agravamento, GAD-7 severo, faltas consecutivas, mensagens urgentes), KPIs da carteira (pacientes ativos, sessões/mês, evolução média, adesão), atalhos rápidos.

### 2. Pacientes
**ID:** `pacientes`
Carteira do psicólogo. Lista com filtros multi-select (em tratamento · pausa · alta · alto risco), busca por nome, KPIs no topo. Cards de paciente com avatar, score atual, severidade, próxima sessão e indicador de risco. Cadastro de novo paciente com convite por email pra app.

### 3. Sessão
**ID:** `sessao`
Sessão em andamento — feature âncora. Anotação em modo SOAP, DAP ou livre. Seleção de técnicas (TCC, ACT, mindfulness, EMDR, etc.) categorizadas. Prescrição de homework. Registro de risco do encontro (0-3). Notas privadas separadas do prontuário.

## Clínico

### 4. Instrumentos
**ID:** `instrumentos`
Biblioteca de escalas validadas (PHQ-9, GAD-7, etc.) por domínio clínico (depressão, ansiedade, stress, cognição, TDAH, trauma, sono, qualidade de vida). Aplicação online com cálculo automático de severidade. Histórico longitudinal por paciente.

### 5. Plano terapêutico
**ID:** `plano-terapeutico`
Plano por paciente com abordagem (TCC, ACT, etc.), frequência, objetivos SMART vinculados a indicadores clínicos (instrumento + valor atual/alvo). Status do plano (em curso, pausado, concluído) e dos objetivos.

### 6. Prontuário
**ID:** `prontuario`
Prontuário digital compatível com Resolução CFP 001/2022. Identificação, anamnese (queixa, história, antecedentes), evolução por sessão, registro de risco, anexos. Exportação assinada digitalmente.

## Operacional

### 7. Configurações
**ID:** `configuracoes`
Perfil profissional (foto, CRP, especialidade, abordagens, formação, bio), disponibilidade semanal, modalidades de atendimento (presencial · online · híbrida), valores e formas de pagamento.
