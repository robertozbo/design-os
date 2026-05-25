# Pacientes Specification

## Overview
Carteira de pacientes do psicólogo. Lista com filtros multi-select (em tratamento · pausa · alta · alto risco), busca por nome, KPIs da carteira no topo, e cards de paciente com avatar + score atual + severidade + próxima sessão + indicador de risco.

## User Flows

### Lista da carteira
- Header com título + counter total + CTA "Novo paciente"
- Strip de KPIs (Total · Em tratamento · Em alerta · Adesão média)
- Chips de filtro multi-select (status + alto risco)
- Search por nome com debounce
- Grid de cards de pacientes (3 colunas em desktop largo, 2 em médio, 1 mobile)

### Card de paciente
- Avatar + nome + idade + gênero
- Status badge (Em tratamento teal · Pausa amber · Alta emerald · Inativo slate)
- **Indicador de risco** (chip rose com ícone alerta) quando aplicável
- Score atual (PHQ-9 ou GAD-7) com chip de severidade
- Progresso do plano terapêutico (8/12 sessões)
- Próxima sessão (data + hora + modalidade)
- Última interação ("ontem", "há 2d")
- Click → abre detail do paciente

### Adicionar paciente
- CTA "Novo paciente" abre modal/sheet
- Formulário: nome · email · telefone · data nasc · sexo
- Opção "Enviar convite por email pra app paciente" — gera código de vinculação
- Cadastro cria paciente em status "Aguardando primeira sessão"

### Filtros
- Status: Em tratamento / Em pausa / Alta / Inativo
- Risco: Alto risco
- Combina filtros (AND lógico, OR dentro do mesmo grupo)

## UI Requirements
- Layout grid 3 colunas em desktop (max-w-7xl), 2 em tablet, 1 em mobile
- Filter chips horizontal scroll se exceder largura
- Cards consistentes em altura
- Avatar 56px com inicial + cor de fallback
- Score chip com gradação de severidade (mínima emerald · leve teal · moderada amber · mod-severa orange · severa rose)
- Indicador de risco como overlay no canto superior direito do card
- Estado vazio com CTA pra adicionar primeiro paciente

## Configuration
- shell: false (web tem chrome próprio)
