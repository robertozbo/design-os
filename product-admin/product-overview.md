# Nymos · Back-office

## Description
A plataforma vista por dentro. É o workspace **interno** da Nymos: quem são os clientes, o que cada
um contratou, e o conteúdo que a própria Nymos publica — pelo mesmo módulo que vende às clínicas.

Não é uma vertical a mais. As verticais (`product-clinic`, `product-doctor`, `product-mobile`…) são
o produto que o cliente usa; aqui é a operação que sustenta todas elas.

## Problems
1. **Não existe lugar para ver quem usa o produto.** Plano, uso, add-ons contratados e inadimplência
   vivem no Stripe e no banco, cada um com um recorte, e ninguém tem a resposta inteira.
2. **Add-on vendido não tem leitura de adoção.** Quantas clínicas contrataram Marketing, quanto isso
   é de receita e quantas usam de fato são três perguntas sem tela.
3. **A Nymos divulga a Nymos na mão.** O módulo de publicação existe e é vendido — e o marketing da
   própria empresa ficava fora dele.

## Solutions
- **Clientes**: um lugar com os workspaces, plano, consumo, add-ons e situação de cobrança.
- **Módulos**: o catálogo de add-ons pelo lado de quem vende — contratantes, receita e adoção real.
- **Publicações**: o mesmo módulo das clínicas, montado sobre o workspace interno.

## Key features
- Workspace interno é um tenant como outro qualquer: mesma tela, dados próprios.
- Nenhum acesso a dado clínico de paciente. O back-office vê contrato e uso, nunca prontuário.
