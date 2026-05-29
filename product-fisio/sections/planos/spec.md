# Planos Terapêuticos Specification

## Overview
Pacotes de tratamento que o fisioterapeuta oferece com múltiplas sessões e desconto progressivo. Diferente de "Serviços" (sessões avulsas) — Planos são contratos de tratamento (ex: "10 sessões de fisio ortopédica para lombalgia"). Cada plano referencia um ou mais serviços, número de sessões e condições de parcelamento.

## User Flows
- Ver lista de planos terapêuticos
- Cadastrar novo plano via drawer
- Editar plano existente
- Ativar/desativar
- Ver quantos pacientes estão usando cada plano
- Filtrar por categoria (Avulso · Mensal · Pacote fechado)

## UI Requirements
- Header: eyebrow + título "Planos terapêuticos" + subtítulo + CTA "+ Novo plano"
- Stats inline: total de planos · pacientes ativos em planos · receita recorrente estimada
- Cards de plano em grid: nome + categoria badge + número de sessões + valor + parcelamento + serviço(s) incluído(s) como chips + pacientes ativos
- Drawer "Novo/Editar plano": nome, descrição, categoria (avulso/mensal/pacote), serviços incluídos (multi-select), número de sessões, valor total, parcelamento (1x/2x/3x/6x/12x), validade em dias

## Configuration
- shell: true
