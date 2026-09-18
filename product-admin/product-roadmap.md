# Product Roadmap — Nymos Back-office

> **Personas:** Plataforma (fundador/operação). Sem acesso clínico, por construção.

## V1 — 3 sections

### 1. Clientes `[V1]`
Os workspaces que usam a Nymos: nome, tipo (clínica, profissional autônomo, empresa SST), plano,
profissionais de quantos permitidos, add-ons contratados, MRR e situação de cobrança. Busca e filtro
por situação. **Zero dado clínico** — o back-office vê contrato e uso, nunca paciente. `id: clientes`.

### 2. Módulos `[V1]`
O catálogo de add-ons pelo lado de quem vende: preço, quantas contas contrataram, receita mensal e a
**adoção real** — quantas usam de fato contra quantas pagam. É a métrica que decide se o módulo
cresce ou é cancelado no próximo ciclo. `id: modulos`.

### 3. Publicações `[V1]`
O módulo Marketing montado sobre o workspace interno da Nymos — a mesma tela da clínica, a mesma
implementação, dados próprios. Serve de prova do multi-tenant e é como a empresa publica de fato.
`id: publicacoes`.

## V2
- Faturamento e inadimplência (integração Stripe: tentativas, dunning, cancelamentos)
- Saúde da conta (uso semanal por módulo, risco de churn)
- Suporte: histórico de tickets por workspace
- Feature flags por workspace
