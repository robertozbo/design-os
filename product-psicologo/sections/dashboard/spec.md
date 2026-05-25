# Dashboard Specification

## Overview
Tela inicial do psicólogo após login — visão geral do dia clínico. Mostra sessões agendadas hoje, alertas de pacientes em risco, indicadores de evolução média da carteira, e atalhos rápidos. Otimizada pra desktop (informação densa em colunas).

## User Flows

### Visão geral do dia
- Card de boas-vindas com contagem (sessões hoje, próximo paciente, etc).
- Próxima sessão destacada com countdown ("em 23 min") e botão "Iniciar sessão".
- Lista das sessões do dia em ordem cronológica.

### Alertas
- Card destacado em rose/amber com pacientes que precisam atenção:
  - PHQ-9 com agravamento >5 pontos
  - GAD-7 score severo (>15)
  - Faltou 2+ sessões consecutivas
  - Mensagem urgente
- Toque abre detalhe do paciente.

### Métricas da carteira
- Total de pacientes ativos
- Sessões completadas no mês
- Evolução média (delta de score em PHQ-9/GAD-7)
- Adesão (% de sessões frequentadas)

### Atalhos
- Novo paciente
- Aplicar instrumento
- Anotação rápida

## UI Requirements
- Layout 3 colunas em desktop largo, 2 em médio, 1 em mobile
- Card hero "Próxima sessão" com paciente, horário, modalidade (presencial/online)
- Lista de sessões do dia com avatar + nome + horário + tipo + status (pendente/em andamento/concluída)
- Card de alertas em rose com 3-5 itens críticos
- Stats strip com 4 KPIs principais
- Quick actions como floating cards

## Configuration
- shell: false (web tem chrome próprio)
