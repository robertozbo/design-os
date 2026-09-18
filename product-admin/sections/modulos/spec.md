# Módulos Specification

## Overview
O catálogo de add-ons pelo lado de quem vende: preço, quantos workspaces contrataram, quanto isso é
de receita e — o número que importa — **quantos usam de fato**.

É o espelho da tela que a clínica vê em *Plano & limites → Módulos*. Lá a pergunta é "quanto eu pago
e quanto já usei"; aqui é "isso paga o custo de manter?".

## User Flows
- Vê o resumo: MRR de add-ons, quantos workspaces têm ao menos um, e a penetração sobre a base.
- Em cada módulo: preço, contratantes, receita mensal, penetração (`contratantes / elegíveis`) e
  **adoção** (`ativos em 30 dias / contratantes`).
- **Ver contratantes** leva para Clientes filtrado por quem assina aquele módulo.
- **Abrir** entra na section do módulo — a mesma que o cliente usa, no workspace interno.

## A adoção é o número que decide
Receita de add-on é enganosa sozinha: quem contratou no impulso continua pagando por alguns ciclos e
some na renovação. Por isso a tela mostra os dois lado a lado e marca em âmbar a adoção abaixo de
60% — é o aviso de que o módulo vende bem e entrega mal, que é o pior estado possível: cresce a
receita e cresce o churn futuro junto.

## Fora de escopo
- Precificação e cupons (mora no Stripe).
- Coorte e retenção por safra — V2.
- Habilitar módulo manualmente para um workspace; entitlement se muda pela cobrança, não pela mão.

## UI Requirements
- Header "Módulos" + três números: MRR de add-ons, workspaces com add-on, penetração da base.
- Um card por módulo: nome, status (Ativo · Beta · Planejado), descrição, preço mensal.
- Duas barras por card: **penetração** (teal) e **adoção** (teal, âmbar quando abaixo de 60%).
- Receita do módulo em destaque (`contratantes × preço`).
- Módulo **planejado** não tem número: mostra a previsão e fica esmaecido — zero contratante não é
  adoção 0%, é ausência de dado, e desenhar barra vazia mentiria.
- Ações: **Ver contratantes** e **Abrir** (só quando a section existe).

## Configuration
- shell: true
