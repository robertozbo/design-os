# Atendimentos Specification

## Overview
A lista de **consultas finalizadas (assinadas)** do médico logado — o histórico de produção clínica dele, destino próprio no nav (grupo Clínico). No topo, **stats agregados** do período (nº de consultas, tempo médio, prescrições emitidas, exames solicitados, % com escriba IA). Abaixo, a **lista** de atendimentos com paciente, data/hora, especialidade, modalidade, duração e flag de IA — cada linha abre o registro no Prontuário. **Escopo = só os atendimentos do próprio médico.** É a contraparte "olhando para trás" da Consulta (que olha para o atendimento em curso).

## User Flows

### Ver a produção do período
- Médico entra → escolhe período (Hoje / Semana / Mês) no topo
- Vê os 5 stats do período e a lista de consultas assinadas correspondentes

### Abrir um atendimento
- Clica numa linha → abre o registro daquele atendimento no Prontuário compartilhado (evolução assinada)

### Filtrar/buscar
- Campo de busca por nome do paciente
- Filtro rápido por modalidade (todas / presencial / tele) e por "só com IA"

## UI Requirements

### Layout
- **Header**: "Atendimentos" + seletor de período (Hoje / Semana / Mês)
- **Stats row** (5 cards): Consultas, Tempo médio, Prescrições, Exames solicitados, % com IA escriba — cada um valor + sublinha
- **Barra de filtros**: busca por paciente + chips (modalidade, só IA)
- **Lista**: linhas com hora/data, avatar+paciente (idade), motivo, badge de especialidade, modalidade (ícone), duração, flag "IA" quando assistido, **ícone de celular verde** quando o paciente é vinculado ao app (com `title` e texto pra leitor de tela) e botão rotulado **"Prontuário"** à direita (não ícone — o destino é o prontuário do paciente, não o detalhe do atendimento) — hover destaca
- **Rodapé**: contagem de resultados

### Estados & regras
- Só consultas com status assinado aparecem (não mostra agendadas/canceladas)
- Flag IA = evolução gerada com escriba (mostra selo teal)
- Período muda stats + lista juntos (mock: dataset é o da semana)
- Busca/filtros sem resultado → empty state
- Duração e tempo médio em minutos; datas em pt-BR

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Sem charting lib — stats em cards simples
- Cores de especialidade compartilhadas (`CorEspecialidade`)
- Escopo pessoal reforçado (sem produção de outros médicos — isso é do Admin em Relatórios)
