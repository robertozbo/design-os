# Evolução Specification

## Overview
Registro rápido de evolução por sessão estilo SOAP (Subjetivo, Objetivo, Avaliação, Plano). É a tela mais usada no dia a dia — o fisio precisa registrar em ~30 segundos no fim de cada atendimento. EVA da sessão anterior pré-preenchida para acelerar o registro. Gera automaticamente o comparativo de dor, ADM e função ao longo do tratamento.

## User Flows
- Iniciar evolução a partir de um agendamento marcado como realizado (link automático)
- Iniciar evolução avulsa a partir do Hub do Paciente
- Preencher SOAP em formulário curto:
  - **S** (Subjetivo) — "Como o paciente chegou?" — texto livre + EVA atual (slider 0-10, pré-preenchido com último valor)
  - **O** (Objetivo) — "O que você observou?" — texto livre + ADM se relevante + testes específicos
  - **A** (Avaliação) — "Como está evoluindo?" — texto livre curto + radio (Melhora / Estável / Piora)
  - **P** (Plano) — "Próxima sessão" — condutas previstas + ajustes
- Selecionar condutas aplicadas (chips multi-select de biblioteca: TENS, ultrassom, exercícios, terapia manual, alongamento, etc.)
- Anexar foto (opcional) — antes/depois, postura, lesão
- Salvar evolução (gera entry na timeline do paciente)
- Ver gráfico de evolução: EVA, ADM ou função ao longo das sessões
- Indicar necessidade de reavaliação (alerta no Hub se >10 sessões sem reavaliar)

## UI Requirements
- Layout em coluna única curto (cabe na tela sem scroll em desktop)
- 4 campos SOAP empilhados, com label grande e textarea pequena (3-4 linhas cada)
- EVA com slider visual colorido (verde 0-3, amarelo 4-6, vermelho 7-10) + número
- Chips de condutas em strip horizontal scrollable
- Auto-save constante (sem botão "Salvar" prominente — só "Finalizar evolução" no fim)
- Quick-actions ao finalizar: "Agendar próxima sessão" · "Prescrever exercício (Nymos Move)" · "Voltar pro Hub"
- Modo leitura: timeline cronológica de evoluções na aba Evolução do Hub do Paciente
- Gráfico de evolução com toggle de métrica (EVA / ADM / função) e período (7d / 30d / tratamento todo)

## Configuration
- shell: true
