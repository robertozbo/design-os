# Perfil Specification

## Overview
Tela de dados pessoais do usuário. Editável: foto, nome, data de nascimento (= idade), sexo, altura, peso atual. Inclui também profissionais vinculados (nutri, personal, médico) e contato de emergência. Os dados de idade/sexo são críticos pros benchmarks da seção Minha Saúde (OMS, ACSM, etc.).

## User Flows

### Editar dados pessoais
- Foto: toque na avatar abre câmera/galeria.
- Nome: tap to edit inline.
- Data de nascimento: date picker.
- Sexo biológico: chips (Masculino · Feminino) — usado pra cálculos antropométricos.
- Altura: input com unidade (cm).
- Peso atual: read-only, mostra última pesagem com link "Atualizar pesagem" → vai pra IA quick action `scale`.

### Profissionais vinculados
- Lista de profissionais (Nutricionista, Personal, Médico) com foto + nome + status conexão.
- Toque abre detalhe / chat.

### Contato de emergência
- Nome + telefone editáveis.

### Conta
- Email (read-only)
- "Alterar senha" link
- "Excluir conta" link em vermelho com confirmação dupla

## UI Requirements
- Header sub-page com botão voltar
- Foto grande (100px) + nome destaque
- Sections agrupadas com label
- Inputs read-only com link de edição contextual
- Status do peso atual com data ("78,4 kg · medido há 2d")

## Configuration
- shell: true
