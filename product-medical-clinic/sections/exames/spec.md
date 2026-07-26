# Exames Specification

## Overview
Recebimento e revisão de **exames** do pool de pacientes da clínica — laudo (PDF) e imagem — com **IA de apoio à interpretação** (resumo do laudo, comparação com histórico, cruzamento com queixa e medicação). Os **valores estruturados** (HbA1c, TSH, glicemia, colesterol, etc.) são extraídos e **confirmados pelo médico**. O que diferencia a versão da **clínica** da versão do médico solo é a **camada de compartilhamento**: um exame é visível a todos os médicos autorizados do paciente (via CareLink), mostra **quem solicitou** e **quem confirmou/revisou**, e cada acesso/inferência IA é auditado (LGPD). Alimenta o painel de contexto da Consulta e do Prontuário.

## User Flows

### Triar exames recebidos
- Médico entra → vê a lista de exames do pool (foco nos "a revisar")
- Filtra por paciente (busca), tipo (laboratorial/imagem) e status (a revisar / revisado)
- Cada linha mostra paciente, tipo, laboratório, quem solicitou (avatar+especialidade), destaque de biomarcador alterado e com quantos médicos está compartilhado

### Revisar um exame
- Abre o detalhe → laudo original + **IA de apoio** (blocos: resumo, comparação histórica, cruzamento queixa/medicação) com disclaimer + **valores estruturados** (biomarcadores com faixa, tendência, mini-histórico)
- **Confirma os valores** extraídos (chancela clínica) e/ou **marca como revisado** com observação
- Vê o **acesso compartilhado**: quais médicos autorizados do paciente enxergam este exame
- **Compartilha um resumo simplificado** com o paciente pelo canal clínico

## UI Requirements

### Lista (`ExamesLista`)
- **Header**: "Exames" + contagem a revisar
- **Filtros**: busca por paciente + chips (tipo: todos/laboratorial/imagem · status: a revisar/revisado)
- **Linhas**: avatar+paciente(idade) · tipo+laboratório · badge de especialidade do solicitante · destaque de biomarcador alterado (valor + seta de tendência, cor por nível) · chip "compartilhado com N" · status de revisão · recebido há X

### Detalhe (`ExameDetalhe`)
- **Cabeçalho**: paciente (chips de condições), tipo do exame, laboratório, solicitante, datas, status
- **Coluna principal**: viewer do laudo (texto do PDF, nº de páginas) + painel **IA de apoio** (blocos com fonte + disclaimer "apoio à decisão, não substitui o médico")
- **Coluna lateral**:
  - **Valores estruturados**: biomarcadores (nome, valor, unidade, faixa de referência, nível colorido, tendência, mini-histórico) + botão "Confirmar valores"
  - **Acesso compartilhado**: lista dos médicos autorizados (avatar+especialidade) + nota de audit
  - **Contexto**: sintomas da anamnese + medicação ativa (cruzados pela IA)
- **Ações**: Confirmar valores · Marcar revisado (com observação) · Compartilhar resumo com paciente · Imprimir

### Estados & regras
- Nível de alerta: baixo/normal/alto/crítico → cores (crítico rose, alto âmbar, normal emerald)
- Tendência: subindo/caindo/estável → seta
- Exame "a-revisar" destacado; "revisado" mostra quem revisou + quando
- Valores só ficam "confirmados" após ação do médico (chancela)
- IA sempre com disclaimer + fonte de cada bloco
- Categoria imagem: viewer de imagem é V1 básico; DICOM embutido é V2 (nota no detalhe)

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Sem charting lib — mini-histórico em barras/sparkline CSS
- Cores de especialidade compartilhadas (`CorEspecialidade`)
- Reforça o compartilhamento intra-clínica e a auditoria (diferença vs. Nymos Clínico solo)
- IA de apoio à interpretação (V1); laudo IA de imagem médica é V3+/SaMD (fora de escopo)
