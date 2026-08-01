# Fornecedores Specification

## Overview
Cadastro básico de **fornecedores** da clínica, com **consulta de CNPJ** (auto-preenche razão social, nome fantasia, telefone e cidade), telefone e categoria (tipo de despesa padrão). Rota própria (`/clinic/sections/fornecedores`), grupo Financeiro. Ao lançar uma **conta a pagar**, o fornecedor é selecionado/pesquisado deste cadastro.

## User Flows
- Lista de fornecedores com razão social/fantasia, CNPJ, telefone, categoria e cidade/UF. Busca por nome, CNPJ ou telefone.
- **Adicionar/editar**: modal com CNPJ + botão **Consultar CNPJ** (mock: preenche razão social, fantasia, telefone, cidade/UF), telefone, e-mail, categoria (tipo de despesa), ativo.
- Excluir / ativar-desativar.

## Integração
- No **Nova conta a pagar**, o campo Fornecedor é um select/busca deste cadastro; ao escolher, sugere a **categoria (tipo de despesa)** padrão do fornecedor.
- (Protótipo: a consulta de CNPJ é simulada; no produto real usa BrasilAPI/ReceitaWS. Os dados são por section; no produto real é a mesma fonte.)

## UI Requirements
- Header: título "Fornecedores" + contagem + botão adicionar.
- Busca (nome/CNPJ/telefone).
- Lista em card: nome fantasia (+ razão social), CNPJ, telefone, categoria, cidade/UF, ações (editar, excluir, ativar/desativar).
- Modal: CNPJ + Consultar, razão social, nome fantasia, telefone, e-mail, categoria, cidade, UF, ativo.

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based. CNPJ formatado XX.XXX.XXX/XXXX-XX; telefone (XX) XXXX-XXXX.
