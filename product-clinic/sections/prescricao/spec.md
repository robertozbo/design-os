# Prescrição Specification

## Overview
Emissão e acompanhamento de **prescrições digitais** via **Memed** (validade ICP-Brasil). O médico prescreve — dentro da Consulta ou avulso — o paciente recebe a receita no app, e prescrições de uso **contínuo** podem ser **renovadas** sem nova consulta. Na clínica, as prescrições são **visíveis aos médicos autorizados** do paciente (mostra quem prescreveu e a especialidade), evitando duplicidade e interação medicamentosa entre especialidades. Alimenta o painel de contexto da Consulta e do Exame (medicação ativa).

## User Flows

### Ver prescrições
- Médico entra → KPIs (ativas, a renovar, expiradas, controladas) + lista das prescrições do pool
- Filtra por status (ativa / precisa renovar / expirada / cancelada) e busca por paciente
- Cada linha mostra paciente, medicamentos (resumo), prescritor (avatar+especialidade), validade, selo ICP-Brasil e se foi entregue no app

### Emitir nova prescrição (Memed)
- Clica "+ Nova prescrição" → seleciona o paciente → abre o **Memed embutido** (mock) pré-carregado com o contexto do paciente
- Adiciona medicamentos, assina com certificado ICP-Brasil, emite → receita entregue no app do paciente

### Renovar contínuo
- Prescrição de uso contínuo marcada "precisa renovar" → botão **Renovar** abre o Memed pré-preenchido com os mesmos itens → emite a renovação (sem nova consulta)

### Detalhe / cancelar
- Abre o drawer da prescrição → itens completos, histórico de renovações, PDF Memed, prescritor
- **Cancela** com motivo (erro, mudança de conduta, reação adversa) **+ justificativa em texto livre** — motivo e justificativa ficam em `motivoCancelamento` / `justificativaCancelamento` e vão para o audit log. O drawer da prescrição cancelada mostra a justificativa citada, abaixo de quem/quando/por quê.

## UI Requirements

### Lista (`PrescricaoLista`)
- **Header**: "Prescrições" + botão "+ Nova prescrição"
- **KPIs** (4 cards): Ativas · Precisam renovar · Expiradas · Controladas
- **Filtros**: busca por paciente + chips de status
- **Linhas**: avatar+paciente(idade) · resumo de medicamentos (nome + nº itens) · badge de especialidade do prescritor · tipo (comum/controlada/contínua) · validade (dias até vencer, vermelho se ≤7 ou expirada) · selo "ICP-Brasil" · selo "no app" · botão Renovar quando aplicável

### Memed embutido (modal mock)
- Cabeçalho "Memed" + paciente selecionado
- Área de medicamentos (lista editável mock) + botão adicionar
- Rodapé: assinatura ICP-Brasil (certificado do médico) + "Emitir e enviar ao app"

### Drawer de detalhe
- Paciente + status + prescritor + origem (consulta vinculada ou avulsa)
- Itens: medicamento, princípio ativo, dose, posologia, duração
- Histórico de renovações (data + médico)
- Acesso compartilhado (médicos autorizados) + ações (abrir PDF Memed, renovar, cancelar)

### Estados & regras
- Status: ativa (emerald) · expirada (slate) · cancelada (rose, riscada)
- "Precisa renovar" = contínua ativa vencendo em ≤7 dias
- Controlada leva selo especial (tarja)
- Validade ≤7 dias ou negativa em vermelho
- Cancelamento exige motivo; cancelada mostra quem/quando/por quê

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Memed é mock visual (protótipo) — sem integração real
- Cores de especialidade compartilhadas (`CorEspecialidade`)
- Reforça visibilidade intra-clínica (diferença vs. Nymos Clínico solo)
