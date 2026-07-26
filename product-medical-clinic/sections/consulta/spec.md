# Consulta (Atendimento) Specification

## Overview
A tela de **atendimento** do médico — presencial e teleconsulta no mesmo fluxo. O centro é o **Escriba IA**: com consentimento do paciente, a consulta é gravada, transcrita e resumida em **SOAP** automaticamente; o médico **revisa, edita e assina** (click-to-attest no V1). Ao lado, um **painel de contexto** mostra o que importa daquele paciente — medicações ativas, últimos exames e evoluções recentes de qualquer médico da clínica (sob escopo/consentimento). Ações rápidas ao final: prescrever, solicitar exame, encaminhar, finalizar. É **nested em Pacientes** (abre-se a partir do paciente/agenda). Alimenta o Prontuário compartilhado ao ser assinada.

## User Flows

### Atender com escriba IA
1. Médico abre a consulta → vê cabeçalho do paciente, contexto ao lado, escriba em estado **inativo**
2. Clica em **Iniciar gravação** → se o consentimento de IA-escriba ainda não foi dado, aparece o pedido de **consentimento** (o paciente autoriza) antes de gravar
3. Estado **gravando**: cronômetro correndo, aviso de captação de áudio, botão pausar/parar
4. Ao parar → estado **transcrevendo** (IA processando) → gera o **rascunho SOAP** (S/O/A/P)
5. Médico **edita** cada campo do SOAP (textarea), ajusta o que a IA sugeriu
6. Clica em **Assinar e finalizar** → confirma autoria (click-to-attest) → evolução é assinada e vai pro prontuário

### Teleconsulta
- Toggle presencial/tele no cabeçalho; em tele, mostra o painel de vídeo (mock) acima do escriba

### Ações clínicas
- Botões: **Prescrever** (abre Prescrição/Memed), **Solicitar exame**, **Encaminhar** (colega da equipe) — mock no protótipo

## UI Requirements

### Layout (2 colunas em desktop, empilha no mobile)
- **Cabeçalho fixo**: paciente (avatar, nome, idade, gênero, convênio, condições crônicas em chips), motivo da consulta, toggle **Presencial / Teleconsulta**, cronômetro da consulta
- **Coluna principal — Escriba IA**:
  - Estado **inativo**: card explicando o escriba + botão "Iniciar gravação"
  - Estado **consentimento**: painel de consentimento LGPD (IA escriba) com aceitar/recusar
  - Estado **gravando**: onda/indicador + cronômetro + pausar/parar; transcrição parcial aparecendo
  - Estado **transcrevendo**: shimmer "IA processando…"
  - Estado **rascunho**: 4 blocos SOAP editáveis (S/O/A/P) com badge "Gerado por IA · modelo", cada um editável; nota de que precisa de revisão humana
  - Estado **assinado**: SOAP travado, selo de assinatura (médico + data/hora + "assistido por IA")
- **Coluna lateral — Contexto do paciente**:
  - Medicações ativas (nome + quem prescreveu + especialidade)
  - Últimos exames (nome, data, valor/flag alterado)
  - Evoluções recentes (autor + especialidade + resumo) — cross-médico, sob escopo
  - **Desde a última consulta**: as 3 métricas do app que mais variaram, com delta colorido pela
    direção desejável, e atalho para o Acompanhamento em painel sobreposto (só se o paciente for
    vinculado)
- **Evolução sempre disponível**: o SOAP é um bloco próprio, aberto desde o início da consulta, com
  ou sem escriba. O médico anota enquanto atende; a IA preenche quando é usada. O escriba é
  acelerador, não porta de entrada — quem não usa (ou cujo paciente não consentiu) precisa poder
  escrever mesmo assim
- **Escriba compacto** no estado ocioso: uma linha com o convite e o botão, não um card de meia
  tela. A evolução é que manda na hierarquia visual
- **Crédito da IA vem da transcrição**, não do campo estar preenchido: texto digitado à mão nunca é
  atribuído ao modelo, e a assinatura registra `assistidoPorIA` conforme o que de fato ocorreu
- **Rótulo do SOAP explica o campo**: "Subjetivo" e "Objetivo" são jargão e não ensinam onde
  escrever o quê. Cada letra vem com a frase do que entra ali (relato do paciente · o que você mediu
  · sua interpretação · a conduta)
- **Queixas frequentes** no Subjetivo: chips clicáveis (dor no peito, tosse seca, tontura…) que
  acumulam no campo, sem impedir escrever livremente
- **Medidas de hoje** no Objetivo — campos numéricos, não prosa. Valor digitado em texto não vira
  série, não aparece no Acompanhamento e não dá para comparar com a consulta anterior. Alimentam a
  mesma série do app, com `fonte: 'Clínica'`
- **Pressão arterial é um par** (sistólica/diastólica): 138 sem o 88 é metade da informação
- **Altura** entra para calcular IMC, não como série — em adulto é praticamente fixa
- **Resultado de laboratório não se digita aqui**: colesterol, triglicerídeos e afins vêm pela
  section Exames, que guarda data de coleta, laboratório e laudo. Digitado no SOAP seria número sem
  procedência num registro com valor legal
- **Barra de ações** (rodapé): Prescrever · Solicitar exame · Encaminhar · Assinar e finalizar
- **Prontuário sem sair da consulta**: depois de assinar, "Abrir prontuário do paciente" abre um
  **painel do tamanho da página por cima** da consulta (`PainelSobreposto`), com "Voltar à consulta",
  X e fechamento por `Esc`. Nunca troca de rota: a consulta segue montada atrás, então a evolução
  assinada, os exames solicitados e as prescrições da sessão continuam na tela ao fechar.

### Estados & regras
- Não é possível assinar sem SOAP (rascunho existente)
- Consentimento de IA é obrigatório antes de gravar; se recusado, médico pode redigir o SOAP manualmente (estado rascunho vazio editável)
- SOAP gerado por IA sempre marca modelo/versão e exige revisão antes de assinar
- Depois de assinado, campos ficam read-only (V1: sem re-edição — nova evolução se necessário)
- Teleconsulta esconde a sala; presencial mostra

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Máquina de estados do escriba controlada por props/callbacks (sem áudio real — protótipo)
- Cronômetros/transcrição simulados via setInterval no wrapper de preview
- Cores de especialidade compartilhadas (`CorEspecialidade`) com prontuário
- IA sempre com disclaimer de apoio + revisão humana (não substitui o médico)
