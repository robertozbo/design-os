# Prompt — implementação de uma section

## Preencha antes de usar

- **SECTION_NAME** = [nome legível, ex.: "Prescrição"]
- **SECTION_ID** = [pasta em `sections/`, ex.: `prescricao`]
- **NN** = [número do milestone, ex.: `13` — sections começam em 02, o 01 é o Shell]

Consulte a tabela de milestones no `README.md` do pacote para os três valores.

---

Preciso que você implemente a section **SECTION_NAME** da minha aplicação.

## Instruções

Leia e analise com atenção:

1. **@product-plan-clinic/product-overview.md** — contexto geral do produto
2. **@product-plan-clinic/instructions/incremental/NN-SECTION_ID.md** — instruções desta
   section

E os arquivos dela:

- **@product-plan-clinic/sections/SECTION_ID/README.md** — overview, fluxos, requisitos de UI
- **@product-plan-clinic/sections/SECTION_ID/tests.md** — specs de comportamento
- **@product-plan-clinic/sections/SECTION_ID/components/** — componentes a integrar
- **@product-plan-clinic/sections/SECTION_ID/types.ts** — interfaces
- **@product-plan-clinic/sections/SECTION_ID/sample-data.json** — dados de exemplo
- **@product-plan-clinic/data-shapes/divergencias.md** — antes de derivar schema

## Antes de começar

Revise tudo e então me pergunte sobre:

1. **Integração** — como esta section conversa com o que já foi construído, e quais APIs já existem
2. **Requisitos** — o que estiver ambíguo nas specs ou nos fluxos
3. **Acesso** — quais papéis podem ver esta section (o produto é sob LGPD; se ela expõe dado
   clínico, admin e recepção não entram)
4. **Qualquer outra coisa** que precise saber

Por último, pergunte se tenho notas adicionais.

Depois que eu responder, siga com a implementação.
