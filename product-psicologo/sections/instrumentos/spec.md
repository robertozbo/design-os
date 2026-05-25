# Instrumentos Specification

## Overview
Biblioteca de instrumentos psicométricos validados (PHQ-9, GAD-7, BDI-II, DASS-21, etc.) organizada por domínio clínico (depressão, ansiedade, stress, cognição, TDAH, trauma, sono, qualidade de vida). Cada card de instrumento mostra autor + ano, dimensões avaliadas, número de itens, tempo médio de aplicação, range de score, faixas de severidade e contador de aplicações na carteira do psicólogo. Painel lateral lista aplicações recentes com delta vs aplicação anterior.

## User Flows

### Explorar a biblioteca
- Header com título "Instrumentos" + busca textual (PHQ-9, ansiedade, depressão...)
- Filtros por domínio clínico (chips multi-select)
- Filtro "Apenas favoritos"
- Grid de cards 2-3 colunas em desktop

### Card de instrumento
- Nome curto (PHQ-9) + nome completo + autor/ano
- Chip de domínio clínico colorido
- Estatísticas inline: nº itens · tempo médio · range total
- Lista de dimensões avaliadas
- Range de severidade (mínima → severa) com chips
- Indicador "validado BR" quando aplicável
- Faixa etária alvo
- Contador de aplicações na carteira + última aplicação (relativa)
- Star icon pra favoritar/desfavoritar
- CTA principal "Aplicar" abre fluxo de aplicação online com seleção de paciente

### Aplicações recentes (sidebar)
- Lista das últimas aplicações da carteira ordenada por data desc
- Cada item: avatar + nome do paciente · instrumento · valor · severidade · delta vs aplicação anterior
- Delta colorido: rose se piorou (positivo em escalas de sintoma), emerald se melhorou
- Click leva pro detalhe da aplicação (relatório completo)
- Click no paciente leva pro prontuário/plano

## UI Requirements
- Layout 2 colunas em desktop largo (lista 8 col · sidebar 4 col), 1 coluna em mobile
- Cards consistentes em altura com header colorido por domínio
- Search com ícone lucide e debounce
- Chips de domínio horizontalmente scroll quando excedem largura
- Faixas de severidade visualmente distintas (emerald · teal · amber · orange · rose)
- Star toggle com transição suave
- Empty state quando filtros não retornam resultados ("Limpar filtros")
- Tabular-nums em font-mono pra valores de score e contadores

## Configuration
- shell: false (web tem chrome próprio)
