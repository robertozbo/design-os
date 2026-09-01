# Chegada Specification

## Overview
A **tela do balcão** — a primeira coisa que a recepção vê ao abrir o sistema, e onde ela passa o dia. Responde a única pergunta que o balcão faz o tempo todo: *quem já está aqui, quem falta chegar e quem está esperando demais.*

Existe porque a Agenda não serve para isso. A Agenda é grade de coordenação — 07h–19h × N profissionais, sem busca e sem linha do agora —, e registrar que alguém chegou virava caçar um bloco de 40 minutos numa parede de blocos. Coordenar disputa de sala e receber gente na porta são trabalhos diferentes, e a recepção faz o segundo cem vezes por dia.

É a contraparte operacional do **Início** do médico: o mesmo dia, recortado por quem está no balcão em vez de por quem atende. Zero clínico — nome, horário, profissional, sala e convênio. Nada de prontuário, exame ou prescrição.

Materializa a issue **#808**: `chegou` (`checked_in`) nasce aqui, pelo código de 6 dígitos do app ou pela mão da recepcionista.

## User Flows

### Registrar chegada pelo código (caminho principal)
- Paciente chega e mostra o QR/código de 6 dígitos que o app gerou (TTL de 5 min)
- O campo do código está **sempre em foco** ao abrir a tela — a recepcionista digita ou lê sem clicar em lugar nenhum
- Ao completar 6 dígitos a validação dispara sozinha: sem botão "confirmar", porque o gesto já terminou
- Acertou: a linha do paciente sobe para **Na clínica**, marcada com a hora e o nome de quem registrou, e o campo se limpa para o próximo
- Errou: o campo fica vermelho com o motivo (código não confere · expirado · consulta não é de hoje) e **não** limpa, para dar chance de corrigir o dígito errado

### Registrar chegada na mão (fallback)
- Paciente sem app — todo o legado importado — ou código expirado
- Busca por nome no campo ao lado, ou acha a linha na lista do dia
- "Registrar chegada" na própria linha grava do mesmo jeito, com método `manual`
- **Nunca há caminho sem saída**: qualquer linha do dia aceita chegada manual, mesmo com o app fora do ar

### Acompanhar quem espera
- **Na clínica** fica no topo, ordenada por quem chegou primeiro, com o tempo de espera correndo
- Passou de 15 minutos de espera, o tempo vira âmbar; passou de 30, vermelho — a recepção vê a fila azedar antes do paciente reclamar
- **Próximas** lista quem ainda não chegou, em ordem de horário, com uma linha marcando o agora
- Consulta cuja hora já passou sem ninguém chegar aparece como **atrasada**, com quantos minutos
- **Encerradas** (realizadas, faltas, cancelamentos) ficam recolhidas no fim, fora do caminho

### Marcar falta
- Só aparece em quem **não** chegou — `chegou` não transita para `faltou` (`_shared/status.ts`)
- Quem já teve chegada registrada não pode ser marcado como falta em lugar nenhum do produto: presença registrada é prova, e paciente que chegou e não foi atendido é problema de operação, não falta dele

## UI Requirements

### Layout
- **Header**: data por extenso, hora atual, e quatro contadores — Na clínica · Por vir · Encerradas · Faltas
- **Barra de captura** (destaque, largura cheia): campo de código de 6 dígitos com fonte mono grande e dígitos espaçados, à esquerda; busca por nome à direita
- **Lista** em três grupos na ordem: `Na clínica` → `Próximas` (com a régua do agora) → `Encerradas` (recolhida)
- Linha: hora + duração · avatar com iniciais na cor da especialidade · nome do paciente · profissional e especialidade · sala ou "Teleconsulta" · convênio · chip de status · ação à direita
- Observação do balcão, quando existe, em âmbar sob o nome — é o que a recepcionista precisa lembrar de falar

### Estados & regras
- Vocabulário de status e transições vêm de `_shared/status.ts`; cores, de `src/sections-clinic/_shared/status-meta.ts`. Esta section não declara status próprio.
- A ação oferecida em cada linha é **derivada de `TRANSICOES`**, nunca fixa
- Chegada registrada mostra `chegou HH:MM · Nome · código|manual` — hora, autor e método, os três campos que a #808 grava
- Teleconsulta não tem chegada física: a linha mostra "Teleconsulta" e não oferece registro de chegada
- Vazio: dia sem consultas mostra o estado limpo com a data
- Mobile: a barra de captura empilha e a lista vira cartão; o campo do código continua sendo o primeiro elemento focável
