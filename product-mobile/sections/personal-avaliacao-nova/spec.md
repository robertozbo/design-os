# Nova Avaliação Specification

## Overview
Registro de avaliação física no celular, durante a sessão: escolhe o tipo (antropometria, dobras, bioimpedância, força, mobilidade, cardio), preenche com o valor anterior ao lado e anexa fotos. Grava em professional.anthropometricAssessment / skinfold.

## User Flows
- Escolhe aluno (vem pré-selecionado quando aberto da ficha)
- Escolhe tipo
- Preenche campos com teclado numérico, vendo o valor anterior
- Adiciona fotos de frente, lado e costas
- Salvar → volta para a ficha com a avaliação nova

## UI Requirements
- Cabeçalho com aluno e data da última avaliação
- Grade de tipos 3×2
- Campo com unidade e valor anterior em cinza
- Bloco de fotos
- Botão Salvar fixo

## Configuration
- shell: true
