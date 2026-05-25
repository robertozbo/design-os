# Sessões Finalizadas Specification

## Overview
Hub da rotina clínica do psicólogo. Lista todas as sessões finalizadas (histórico cronológico cross-patient), permite busca/filtro, mostra resumo de risco e adendos, e tem CTA principal pra iniciar nova sessão (que abre o picker de paciente).

Substitui o estado atual de `/sessao` sem `pacienteId` (form vazio confuso) por uma página que faz sentido como destino do menu "Sessão".

## User Flows
- Abrir a página: vê última semana de sessões em ordem cronológica descendente
- **CTA primária "Nova sessão"** → abre picker de paciente → ao selecionar, navega pra sessão ativa
- Filtros: paciente (autocomplete), período (hoje/semana/mês/customizado), risco (qualquer/baixo/moderado/crítico), com/sem adendos
- Busca por nome do paciente (input no topo)
- Click numa linha → abre prontuário do paciente naquela sessão (scroll-to)
- Hover na linha → preview rápido (resumo SOAP, técnicas usadas)
- Badge de adendos: ícone com contagem (ex: 📎 2) — destaca sessões com correções/complementos
- Empty state: "Você ainda não finalizou nenhuma sessão" + CTA "Nova sessão"

## UI Requirements
- Layout: header com título + CTA "Nova sessão" (gradient violet→sky) à direita
- Métricas no topo (4 cards horizontais): sessões hoje · sessões semana · alto risco · com adendos
- Filtros em barra horizontal (chips de período + dropdown paciente + chips de risco)
- Lista em tabela responsiva (desktop) / cards stack (mobile):
  - Colunas: Data/hora · Paciente (avatar + nome) · Modo (SOAP/DAP/livre) · Duração · Técnicas · Risco · Adendos · Ações
  - Risco como chip colorido (sem_risco/baixo/moderado/crítico)
  - Modo como pequeno chip (S/D/L)
  - Click row → preview lateral OU navega pro prontuário
- Paginação ou scroll infinito (V0: 20 por página)
- Vazio: ilustração + CTA principal

## Configuration
- shell: true
- requires: pacientes carregados pro picker
