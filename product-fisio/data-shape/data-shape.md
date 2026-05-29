# Data Shape

## Entities

### Fisioterapeuta
Profissional de fisioterapia que assina o Atender Fisioterapeuta. Cadastra pacientes, gerencia agenda, registra avaliações e evoluções. É quem paga a mensalidade do produto.

### Paciente
Pessoa em tratamento com um fisioterapeuta. Recebe convite para acessar o Nymos Move (gratuito) e tem ficha clínica completa: dados pessoais, histórico de atendimentos, avaliações e dados de wearable (passos, sono, FC).

### Agendamento
Horário marcado entre fisioterapeuta e paciente. Tem status (agendado, confirmado, realizado, faltou). Quando realizado, dá origem a uma Sessão.

### Sessao
Atendimento concluído, vinculado a um Agendamento. Contém o registro de evolução estilo SOAP (subjetivo, objetivo, avaliação, plano) feito pelo fisio, incluindo EVA da sessão e condutas aplicadas.

### Avaliacao
Avaliação cinético-funcional do paciente — inicial ou reavaliação periódica. Contém anamnese, queixa principal, EVA, goniometria/ADM, testes funcionais, hipótese diagnóstica e plano terapêutico.

## Relationships

- Fisioterapeuta has many Pacientes
- Fisioterapeuta has many Agendamentos
- Paciente has many Agendamentos
- Paciente has many Sessoes
- Paciente has many Avaliacoes
- Agendamento has one Sessao
- Sessao belongs to Paciente and Fisioterapeuta
- Avaliacao belongs to Paciente
