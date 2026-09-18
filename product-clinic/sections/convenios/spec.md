# Convênios Specification

## Overview
Catálogo dos **convênios** (operadoras de saúde) da clínica, com escopo de workspace. O convênio deixou de ser texto livre digitado na ficha e passou a ter **identidade**: é o que permite pré-selecionar o plano do paciente ao agendar, filtrar faturamento por operadora e saber que "Unimed" e "unimed" são a mesma coisa. Rota própria (`/clinic/sections/convenios`), grupo **Cadastros** — irmã de Serviços e Tipos de conta.

O cadastro continua acontecendo **ao digitar**, dentro do select da ficha do paciente: a recepção não abandona um atendimento para cadastrar operadora nova. Esta tela é o outro lado disso — o lugar onde alguém **arruma** o catálogo depois: corrige grafia, desativa o que não se usa mais, confere quantos pacientes cada convênio tem.

## User Flows
- Vê a lista de convênios com **nome**, **registro ANS** e **quantos pacientes** estão em cada um.
- Filtra por **Todos / Ativos / Inativos** e busca por nome ou ANS.
- **Adicionar convênio** → modal: nome (obrigatório), registro ANS (opcional), ativo.
- **Editar** convênio: corrigir a grafia do nome ou preencher o ANS que faltava.
- **Desativar / reativar** convênio. Desativar tira da oferta de novos cadastros; os pacientes que já o têm **continuam com ele**.
- **Não existe excluir.** Convênio com paciente não some, e sem paciente também não — desativar já resolve, e apagar deixaria ficha antiga sem referência.

## Duplicata por grafia
O preço de deixar a recepção criar ao digitar é a duplicata: "Unimed Regional" e "unimed regional" viram duas linhas. A tela não mescla — ela **mostra**:
- Convênios com nome parecido aparecem com um aviso discreto ("nome parecido com *X*"). A colisão é detectada na tela comparando os nomes normalizados (minúsculas, sem acento, espaços colapsados) — não é campo vindo do servidor, então **renomear faz o aviso sumir na hora**.
- O caminho de correção é **renomear** o certo e **desativar** o errado; ninguém move paciente de convênio por aqui.
- Mesclar (mover pacientes de um convênio para outro e apagar o vazio) é operação destrutiva sem desfazer — fica fora desta fatia.

## Fora de escopo (de propósito)
- **Tabela de preço / desconto por convênio.** Desconto sobre nada não existe: o preço é do serviço, e o catálogo de serviços com escopo de workspace é a peça que falta. Um `descontoPct` aqui seria número que a tela coleta, o banco guarda e ninguém aplica.
- **Contato da operadora** (telefone, e-mail, observações de autorização).
- **Faturamento de convênio** — TUSS, SADT, guia, glosa e recurso são V2 (ver `product-roadmap.md`).
- **Particular não é convênio.** É a ausência dele (`convenioId = null`); aparece só como contagem no resumo, nunca como linha da lista.

## UI Requirements
- Header: título "Convênios" + resumo (**N ativos**, **N pacientes conveniados**, **N particulares**) + botão "Adicionar convênio".
- Busca por nome/ANS + filtro segmentado Todos / Ativos / Inativos.
- Lista (não tabela densa): cada item mostra nome · badge **ANS 340** (ou "sem ANS", esmaecido) · contagem de pacientes · badge de status · ações (editar, desativar/reativar).
- Item inativo: esmaecido, badge âmbar "Inativo". Se tiver pacientes, o número continua visível — é o que impede alguém de achar que desativar apagou dado.
- Convênio com **0 pacientes** ganha marca discreta "sem pacientes" — é o que pode desativar sem consequência.
- Aviso de nome parecido inline no item, com link para o convênio irmão.
- Estado vazio: nenhum convênio cadastrado → explica que o convênio nasce no cadastro do paciente e oferece o botão de adicionar mesmo assim.
- Modal com nome, registro ANS e toggle ativo. Nome duplicado exato não dá erro: o servidor devolve o convênio que já existe.

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based. Números em pt-BR.
- PageShell composite: `ListPage`.
- Persona: **admin** (mesma família de Serviços e Tipos de conta). O link também vai no nav da **recepção** — quem cria convênio no balcão é ela, então é ela quem precisa arrumar a grafia que acabou de errar. A tela é a mesma para as duas; não há campo escondido por papel.
- shell: true
