# Prontuário Specification

## Overview
Prontuário psicológico digital compatível com Resolução CFP 001/2022. Estrutura formal com identificação do paciente, anamnese (queixa, história, antecedentes, hipótese diagnóstica), evolução cronológica por sessão, aplicações de instrumentos com delta, intervenções aplicadas com eficácia percebida, encaminhamentos e alta. Documento auditável com hash SHA256 do conteúdo, versão e profissional responsável (CRP). Exportação em PDF assinado digitalmente.

## User Flows

### Visualizar prontuário
- Header com nome do paciente · profissional responsável (CRP) · versão · última atualização
- Ações principais: Exportar PDF · Imprimir
- Hash de auditoria visível em font-mono no rodapé pra verificação de integridade

### Identificação
- Bloco Identificação: nome completo · CPF (mascarado) · data nasc · idade · gênero · estado civil · profissão · contato de emergência (nome + relação + telefone)

### Anamnese
- Queixa principal
- História atual (3 meses, gatilhos, evolução)
- História pregressa (episódios anteriores, tratamentos)
- Antecedentes familiares (psiquiátricos)
- Hábitos e contexto (sono, álcool, exercício, vida pessoal)
- Hipótese diagnóstica inicial (CID-10/CID-11 + plano)
- Data da anamnese (primeira sessão)

### Evolução cronológica
- Lista de entradas por sessão (mais recente primeiro ou mais antiga primeiro - toggle)
- Cada entrada: número da sessão, data/hora, duração, modalidade (presencial/online/híbrida)
- Resumo SOAP/DAP em texto
- Técnicas usadas (chips)
- Homework prescrito (se houve)
- Risco do encontro (sem · baixo · moderado · crítico) com cor

### Aplicações de instrumentos
- Tabela cronológica: data · instrumento · valor · severidade · delta vs aplicação anterior
- Delta colorido (rose piorou · emerald melhorou)

### Intervenções e encaminhamentos
- Lista de intervenções (técnica · abordagem · vezes aplicadas · eficácia 1-5 · notas)
- Lista de encaminhamentos (data · para quem · motivo · retorno)

### Alta (quando houver)
- Bloco Alta: data · motivo (objetivo alcançado · transferência · abandono · mútuo acordo) · evolução final · recomendações

## UI Requirements
- Layout coluna única max-w-4xl com tipografia print-friendly
- Cabeçalho fixo com ações de exportar/imprimir
- Cada bloco como `<section>` com `<h2>` semântico (acessibilidade + impressão)
- Edição inline por seção via lápis (callback `onEditarSecao`)
- Tabelas com tabular-nums em font-mono pra valores de score
- Risco crítico destacado com border-rose
- Hash de auditoria em font-mono truncado com tooltip pro hash completo
- Print stylesheet (`@media print`) preserva quebras lógicas e remove ações

## Configuration
- shell: false (web tem chrome próprio)
