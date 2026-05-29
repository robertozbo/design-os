# Notificações Specification

## Overview
Preferências de notificações do fisioterapeuta — matriz de categorias × canais (WhatsApp, e-mail, push no app, SMS) controlando quais avisos chegam por onde. Também mostra feed das últimas notificações recebidas e um "horário de silêncio" (não disturbar).

## User Flows
- Ver matriz de preferências (5 categorias × 4 canais)
- Ativar/desativar checkbox individual
- Aplicar template ("Conservador" / "Completo" / "Só urgente")
- Configurar horário de silêncio (não disturbar) por canal
- Ver feed das 6 últimas notificações com timestamp + ação rápida

## UI Requirements
- Header padrão (eyebrow + ícone teal + título + subtítulo)
- Card "Preferências" com tabela: linhas = categorias (Operacional · Clínico · Comunicação · Cobrança · Marketing), colunas = canais (App · WhatsApp · E-mail · SMS)
- Cada categoria mostra label + descrição + checkboxes
- Toggle "Horário de silêncio" + range time picker (default 22:00 — 07:00)
- Card "Recentes" com timeline curto (últimas 6 notificações)

## Configuration
- shell: true
