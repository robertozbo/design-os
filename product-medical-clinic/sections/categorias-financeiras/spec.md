# Tipos de Conta (Categorias Financeiras) Specification

## Overview
Cadastro das **categorias financeiras** da clínica: **tipos de receita** e **tipos de despesa**, estas classificadas por comportamento **fixa/variável**. Vem pré-carregado com um conjunto abrangente que cobre clínica, personal, psicólogo, médico e nutricionista. Rota própria (`/medical-clinic/sections/categorias-financeiras`), no grupo Financeiro. As contas (a receber/pagar) e os relatórios se apoiam nessas categorias.

## User Flows
- Vê dois painéis: **Tipos de receita** (por grupo) e **Tipos de despesa** (por grupo, com badge Fixa/Variável).
- Filtra despesas por Todas / Fixas / Variáveis.
- **Adicionar tipo** → modal: natureza (receita/despesa), nome, grupo, e comportamento (só despesa).
- **Editar** qualquer tipo. **Excluir** tipos criados pelo usuário; tipos **padrão** (de fábrica) não excluem, apenas **desativam/reativam** (Power).

## UI Requirements
- Header: título "Tipos de conta" + resumo (nº receitas, fixas, variáveis) + botão adicionar.
- Dois painéis lado a lado (empilham no mobile): Receitas (↑ emerald) e Despesas (↓ rose).
- Cada painel agrupa por `grupo`, item mostra nome + badge de comportamento (despesa) + ações (editar, excluir/desativar).
- Modal com toggle de natureza, nome, grupo (do conjunto certo), toggle fixa/variável.

## Estrutura pré-cadastrada
- **Receita**: Consultas, Retornos, Teleconsulta, Sessões, Avaliações, Exames, Procedimentos, Pacotes/mensalidades, Planos de treino/dieta, Convênios, Produtos, Aluguel de sala.
- **Despesa (fixa)**: Aluguel, Condomínio/IPTU, Energia, Água, Internet/telefonia, Limpeza, Salários, Pró-labore, Software, Aluguel de equipamentos, Contabilidade, Licenças/conselhos, Tarifas bancárias, Agência de marketing, Certificações, Financiamentos.
- **Despesa (variável)**: Sala por hora, Manutenção predial, Repasse/comissão, Estagiários, Insumos, EPI/descartáveis, Equipamentos, Manutenção de equipamentos, Exames terceirizados, Lavanderia, Esterilização, Material de expediente, Frete, Impostos sobre faturamento, Taxas de cartão, Tráfego pago, Materiais gráficos, Comissões (vendas/indicações), Supervisão, Cursos, Combustível, Manutenção de veículo, Juros/multas.

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based. Fixa = sky badge, Variável = amber badge.
