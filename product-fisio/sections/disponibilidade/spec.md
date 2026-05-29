# Disponibilidade Specification

## Overview
Configuração dos horários recorrentes em que o fisioterapeuta atende. Define a "grade-mãe" do consultório: o paciente só consegue agendar sessões em horários dentro dessa configuração. Inclui visualização timeline da semana, edição por dia (intervalos múltiplos por dia), regras gerais (duração padrão de sessão, antecedência mínima, pausa entre sessões) e templates rápidos (horário comercial padrão).

## User Flows
- Ver visualização semanal da disponibilidade (timeline com blocos verdes nas faixas de atendimento)
- Alternar entre Timeline e Lista
- Ativar/desativar um dia da semana (toggle por linha)
- Editar intervalos de atendimento de cada dia (08:00-12:00 + 14:00-18:00 por exemplo)
- Adicionar múltiplos intervalos no mesmo dia (almoço, pausa)
- Override do tamanho do slot por dia (ex: sex usar 45min ao invés do padrão 60)
- Copiar configuração de um dia pra outros dias (Aplicar a Ter-Sex, Aplicar a todos)
- Limpar configuração de um dia / Limpar todos
- Carregar template "Horário comercial padrão" (Seg-Sex 08-18)
- Configurar regras gerais: duração padrão (30/45/60/90/120 min), antecedência mínima de agendamento (1/4/12/24/48 h), pausa entre sessões (5min)
- Salvar / descartar alterações (footer dock aparece quando há mudanças)

## UI Requirements
- Header: eyebrow "Disponibilidade" + título "Quando você atende" + subtítulo + ações ("Carregar template" + "Limpar tudo")
- Stats inline em uma linha (dias ativos · horas/semana · slots totais · slot padrão)
- Card "Timeline da semana": grade 7 colunas com timeline 06h-22h vertical, blocos teal mostrando atendimento; toggle Timeline/Lista
- Card "Horários por dia da semana": 7 linhas (Seg a Dom)
  - Cada linha: toggle on/off + nome do dia + pills com intervalos (08:00-18:00) + chevron expand + menu (Copiar / Limpar)
  - Linha expandida: time inputs (início + até + fim), duração calculada, botão "+ Adicionar intervalo", indicador de slot override
- Card "Regras gerais": Duração padrão (segmented), Antecedência mínima (segmented), Pausa entre sessões (toggle)
- Footer dock fixo (aparece quando há mudanças não salvas): contador de alterações + Descartar + Salvar

## Configuration
- shell: true
