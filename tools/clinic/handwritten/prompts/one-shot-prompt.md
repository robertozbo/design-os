# Prompt — implementação completa

Preciso que você implemente uma aplicação web completa a partir de designs de UI e especificações de
produto que estou fornecendo.

## Instruções

Leia e analise com atenção:

1. **@product-plan-clinic/product-overview.md** — resumo do produto, personas e entidades
2. **@product-plan-clinic/instructions/one-shot-instructions.md** — instruções de todos os
   milestones

Depois, revise:

- **@product-plan-clinic/design-system/** — cores e tipografia
- **@product-plan-clinic/data-shapes/** — contratos de dados da UI (leia
  `divergencias.md`, não só o `overview.ts`)
- **@product-plan-clinic/shell/** — shell da aplicação
- **@product-plan-clinic/sections/** — componentes, tipos, dados de exemplo e specs de teste
  de todas as 26 sections

## Contexto que muda decisões de arquitetura

Este é um produto de saúde no Brasil, sob LGPD. Três coisas não são preferência de UI:

1. **Controle de acesso é requisito legal.** Admin e recepção não podem ver conteúdo clínico
   (prontuário, exame, prescrição). A navegação já reflete isso, mas esconder o item de menu não é
   controle de acesso — proteja no servidor.
2. **Todo acesso a dado clínico é auditado.** Quem viu, o quê, quando. Inferência de IA também.
3. **Exclusão é lógica, nunca física.** Registro clínico tem valor legal.

## Antes de começar

Revise tudo e então me pergunte sobre:

1. **Stack** — framework, linguagem, ferramentas, convenções de um código existente
2. **Autenticação e usuários** — cadastro, login, e como os papéis (Admin, Médico, Recepção) mapeiam
   no seu modelo de sessão
3. **Requisitos** — o que estiver ambíguo nas specs ou nos fluxos
4. **Qualquer outra coisa** que precise saber antes de implementar

Por último, pergunte se tenho notas adicionais.

Depois que eu responder, monte um plano de implementação antes de escrever código.
