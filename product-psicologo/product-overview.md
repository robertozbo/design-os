# Nymos · Psicólogo (Web)

## Description
Plataforma web de atendimento psicológico para profissionais — desktop-primary. Centraliza o dia clínico do psicólogo: sessões agendadas, prontuário compatível com Resolução CFP 001/2022, plano terapêutico com objetivos SMART, biblioteca de instrumentos validados (PHQ-9, GAD-7, etc.) e gestão de carteira de pacientes com indicadores de risco.

## Problems & Solutions

**Problema:** Psicólogos gerenciam pacientes em planilhas, agenda em Google Calendar, prontuário em papel/Word, e instrumentos em PDFs avulsos. Sem visão consolidada de risco clínico nem rastreamento longitudinal de evolução.
**Solução:** Cockpit clínico unificado — dashboard com alertas baseados em scores, prontuário digital com modos SOAP/DAP/livre, plano terapêutico vinculando objetivos a indicadores.

**Problema:** Falta de padronização na avaliação clínica. Cada psicólogo aplica instrumentos de forma manual, calcula scores no papel.
**Solução:** Biblioteca de escalas validadas com cálculo automático de severidade, histórico longitudinal por paciente, alertas automáticos em agravamento (delta PHQ-9 > 5 pontos, GAD-7 severo).

**Problema:** Risco clínico (suicídio, abandono terapêutico, recaída) é detectado tarde demais.
**Solução:** Indicadores de risco em destaque no dashboard e nos cards de paciente — faltas consecutivas, agravamento de score, mensagens urgentes do paciente.

## Key Features
- Dashboard clínico com sessões do dia, alertas de risco e KPIs da carteira
- Carteira de pacientes com filtros multi-select, busca e indicadores de severidade
- Sessão ativa com anotação SOAP/DAP/livre, seleção de técnicas, homework, registro de risco
- Plano terapêutico com objetivos SMART vinculados a indicadores clínicos
- Prontuário digital compatível com CFP 001/2022 (identificação, anamnese, evolução)
- Biblioteca de instrumentos validados com aplicação online e cálculo automático
- Configurações de perfil profissional, disponibilidade e modalidades de atendimento

## Target Users
Psicólogos clínicos atuando em consultório, clínica multiprofissional ou home office. Atendimento presencial, online ou híbrido. Foco em adultos, mas extensível.

## Platform Context
**Web · Desktop-primary** — informação densa em colunas, navegação por sidebar persistente. Mobile responsivo (≥320px) mas otimização principal é desktop (≥1280px).
