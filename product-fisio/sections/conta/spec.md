# Minha Conta Specification

## Overview
Conta e cobrança do fisioterapeuta no Atender Fisioterapeuta — plano atual, próxima cobrança, método de pagamento (Stripe), histórico de cobranças, upgrade/downgrade. Stripe é o processador oficial. Sem complexidade tributária — apenas SaaS B2B mensal recorrente.

## User Flows
- Ver plano atual com features inclusas
- Ver próxima cobrança (data + valor)
- Adicionar/remover método de pagamento (cartão via Stripe)
- Marcar cartão como principal
- Ver últimas 6 cobranças (status: paga · pendente · falhou)
- Baixar nota fiscal de cobrança (placeholder)
- Comparar planos disponíveis (Free · Plus · Pro · Premium)
- Iniciar upgrade — modal de Stripe checkout
- Cancelar assinatura (downgrade pra Free)

## UI Requirements
- Header: eyebrow + título "Minha conta" + subtítulo
- Card "Plano atual" destacado: badge do tier + nome + valor mensal + próxima cobrança + CTA "Upgrade pra X" (se não estiver no topo) + lista de features inclusas com checks
- Card "Método de pagamento": lista de cartões com bandeira + últimos 4 dígitos + validade + "Principal" badge + ações
- Card "Histórico de cobranças": tabela densa com data + descrição + valor + status + link nota
- Card "Comparar planos" (collapse): 4 colunas com tier name + valor + features
- Modal de upgrade: simulação de Stripe checkout (passo 1: selecionar plano; passo 2: confirmar cartão; passo 3: sucesso)
- Estilo: gradient bg, max-w-[1100px], teal accent, gradient orange→pink para CTA upgrade

## Configuration
- shell: true
