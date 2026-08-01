# Encaminhamento Interno Specification

## Overview
Encaminhamento de um paciente de um médico para **outro colega da mesma clínica** (outra especialidade). O médico seleciona o colega, escreve o **motivo** e o **contexto clínico**, e escolhe **o que compartilhar** (prontuário, exames, medicações) — sob **consentimento do paciente**. O colega recebe o encaminhamento na sua Home (Início), **aceita** e assume o vínculo de cuidado (CareLink), ou recusa. Tudo é rastreado no **audit log** (LGPD). Diferente de um encaminhamento externo (que sai da clínica), aqui a troca é intra-clínica e o contexto viaja junto — sem o paciente reexplicar a história. Conecta **Equipe** (de onde vêm os colegas) e **Início** (onde chegam).

## User Flows

### Ver encaminhamentos
- Médico entra → duas abas: **Recebidos** (colegas encaminharam para ele) e **Enviados** (ele encaminhou)
- Recebidos pendentes destacados; cada card mostra de/para quem, paciente, motivo, contexto e o que foi compartilhado

### Aceitar / recusar recebido
- Card recebido pendente → **Aceitar** (assume o vínculo, paciente entra na sua lista) ou **Recusar** (com motivo opcional)
- Aceito muda o status e some da fila de pendentes

### Novo encaminhamento
1. "+ Novo encaminhamento" → seleciona o **paciente**
2. Seleciona o **colega** (lista da equipe, por especialidade, com disponibilidade)
3. Escreve **motivo** + **contexto clínico**
4. Marca **o que compartilhar** (prontuário, exames, medicações ativas) + confirma **consentimento do paciente**
5. Envia → colega recebe na Home; entra em "Enviados" como pendente

## UI Requirements

### Lista (`EncaminhamentosLista`)
- **Header**: "Encaminhamentos" + botão "+ Novo encaminhamento"
- **Abas**: Recebidos (badge com nº pendentes) · Enviados
- **Card recebido**: avatar do remetente + especialidade + "há X" · paciente · motivo · contexto (trecho) · chips do que foi compartilhado · status · ações Aceitar/Recusar (se pendente) ou Abrir
- **Card enviado**: avatar do destinatário + especialidade · paciente · motivo · status (pendente âmbar / aceito emerald / recusado rose) · quando

### Novo encaminhamento (modal, multi-step)
- Passo 1: seletor de paciente
- Passo 2: seletor de colega (equipe, especialidade, disponível/ocupado)
- Passo 3: motivo (input) + contexto (textarea) + checklist do que compartilhar + toggle de consentimento do paciente
- Rodapé: voltar / avançar / enviar (enviar exige consentimento marcado)

### Estados & regras
- Status: pendente (âmbar) · aceito (emerald) · recusado (rose)
- Aceitar cria o vínculo (mock: toast + move card)
- Envio bloqueado sem consentimento marcado
- Recebidos pendentes ordenados primeiro
- Cada ação registrada no audit log (nota visível)

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Cores de especialidade compartilhadas (`CorEspecialidade`)
- Reforça a troca intra-clínica com contexto + consentimento (diferencial do produto)
- Colegas vêm da mesma fonte conceitual da Equipe
