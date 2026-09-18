# Clientes Specification

## Overview
Os workspaces que usam a Nymos: clínica, profissional autônomo e empresa (SST). Mostra plano,
profissionais em uso, add-ons contratados, MRR, situação de cobrança e **último acesso**.

É a tela do negócio, não do produto. **Nenhum dado clínico aparece aqui** — o back-office vê contrato
e uso, nunca paciente, prontuário ou exame. Isso não é escolha de layout: é o recorte que a LGPD
impõe a quem opera a plataforma.

## User Flows
- Vê o resumo: workspaces ativos, MRR total, quantos em trial e quantos inadimplentes.
- Filtra por situação (Todos · Ativos · Trial · Inadimplentes · Cancelados) e busca por nome ou cidade.
- Vê, em cada linha, o plano, o uso de profissionais (`3 de 6`), os add-ons com consumo do ciclo, o
  MRR e há quanto tempo ninguém entra.
- **Cobrar** um inadimplente dispara a régua de cobrança.
- Abre o workspace para ver o contrato — nunca o conteúdo clínico.

## Sinais que a tela precisa dar
- **Parado há mais de 30 dias** ganha marca âmbar, mesmo pagando em dia. Churn aparece no uso antes
  de aparecer na fatura, e o plano sozinho não conta isso.
- **Trial e inadimplente carregam prazo**: "trial termina em 4 dias", "vencida há 12 dias". O rótulo
  sem data não diz o que fazer hoje.
- **No limite do plano** (`6 de 6` profissionais) é oportunidade de upgrade, não erro — marca teal.

## Fora de escopo
- Faturamento e régua de cobrança de verdade (Stripe: tentativas, dunning, cancelamento) — V2.
- Qualquer conteúdo clínico, em qualquer circunstância.
- Impersonar usuário ("entrar como") — exige trilha de auditoria própria e consentimento.

## UI Requirements
- Header "Clientes" + resumo (ativos, MRR, em trial, inadimplentes) em quatro números.
- Busca por nome/cidade + filtro segmentado por situação.
- Lista com: nome + badge de tipo · cidade · plano · uso de profissionais · add-ons (chips com
  consumo) · MRR · situação com prazo · último acesso.
- Inadimplente em vermelho com botão **Cobrar**; trial em âmbar; cancelado esmaecido.
- Estado vazio por filtro.

## Configuration
- shell: true
