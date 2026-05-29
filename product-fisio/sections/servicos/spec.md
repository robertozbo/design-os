# Serviços Specification

## Overview
Catálogo de tipos de atendimento que o fisioterapeuta oferece (avaliação, sessão ortopédica, Pilates clínico, RPG, teleconsulta, etc.). Cada serviço tem nome, descrição, duração padrão, valor e modalidade. Usado no fluxo de agendamento (paciente escolhe serviço) e no perfil público.

## User Flows
- Ver lista de serviços ativos e inativos
- Cadastrar novo serviço via drawer
- Editar serviço existente (mesmo drawer em modo edição)
- Ativar/desativar serviço (toggle inline)
- Duplicar serviço (criar variação)
- Reordenar arrastando (placeholder)
- Filtrar por modalidade (presencial / teleconsulta / domicílio / todos)

## UI Requirements
- Header: eyebrow + título "Serviços" + subtítulo + CTA "+ Novo serviço"
- Stats inline: total · ativos · valor médio · duração média
- Filtros de modalidade (chips com contadores)
- Cards de serviço em grid (2 colunas em desktop): ícone modalidade + nome + descrição + linha de stats (duração + valor) + toggle ativo + ações
- Drawer "Novo/Editar serviço" com campos: nome, descrição, modalidade, duração, valor, cor (chip), incluir avaliação inicial (toggle)

## Configuration
- shell: true
