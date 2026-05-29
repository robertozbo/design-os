# Avaliação Specification

## Overview
Formulário estruturado de avaliação cinético-funcional (inicial ou reavaliação) em padrão COFFITO. Anamnese, queixa principal, EVA, goniometria/ADM, testes funcionais, hipótese diagnóstica e plano terapêutico. Cada avaliação fica salva na ficha do paciente e gera comparativo automático com avaliações anteriores.

## User Flows
- Iniciar nova avaliação a partir do Hub do Paciente
- Preencher seções em ordem (com possibilidade de pular e voltar):
  1. **Anamnese** — HMA, HMP, medicações, atividade física, ocupação
  2. **Queixa** — descrição livre + escala EVA (0-10) + localização (mapa corporal simplificado)
  3. **Inspeção / palpação** — observações livres + checkboxes (edema, atrofia, hipertrofia, etc.)
  4. **Goniometria (ADM)** — articulações relevantes com inputs numéricos (graus) e comparativo direito/esquerdo
  5. **Testes funcionais** — biblioteca de testes (TUG, Romberg, Berg, Lasègue, etc.) com resultado positivo/negativo + observação
  6. **Hipótese diagnóstica** — texto livre + sugestões CIF opcionais
  7. **Plano terapêutico** — objetivos SMART + condutas previstas + frequência + número de sessões estimadas
- Salvar como rascunho a qualquer momento
- Finalizar e assinar (carimbo CREFITO automático)
- Visualizar avaliação salva em modo leitura
- Comparar com avaliação anterior (diff visual nas métricas)
- Gerar PDF da avaliação (para arquivo do paciente)

## UI Requirements
- Layout em stepper vertical (esquerda mostra seções, direita preenche)
- Indicador de progresso (X de 7 seções completas)
- Auto-save a cada 10 segundos
- Validação leve (campos obrigatórios marcados, mas permite rascunho)
- Goniometria com tabela de articulações pré-configuradas por queixa (ex: queixa "joelho" → mostra flexão/extensão de joelho automaticamente)
- Testes funcionais com vídeo curto explicando cada teste (opcional, expansível)
- Hipótese e plano com sugestões baseadas em queixa
- Footer fixo: Salvar rascunho · Voltar · Próximo · Finalizar (no último step)
- Modo leitura: layout em 1 coluna, scroll, com botão "Reavaliar" e "Gerar PDF" no topo

## Configuration
- shell: true
