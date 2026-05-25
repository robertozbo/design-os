# Data Shape

## Entities

### Personal
O profissional usuário do app — personal trainer autônomo (CREF). Possui perfil, disponibilidade de agenda, plano de assinatura e preferências.

### Aluno
Pessoa atendida pelo personal. Tem dados pessoais, vínculo com personal, status (ativo, pausado, novo) e histórico de tudo que acontece (treinos, avaliações, mensagens, sessões).

### Exercício
Item da biblioteca de exercícios — pode ser curado (base do app) ou customizado pelo personal. Carrega nome, grupo muscular, equipamento, vídeo/GIF, variações e instruções.

### Treino
Plano de treino prescrito a um aluno. Composto por sessões (ex.: A, B, C) com lista de exercícios, séries, reps, carga sugerida, descanso e RPE alvo. Tem objetivo (hipertrofia, emagrecimento, performance, etc.).

### TreinoTemplate
Modelo de treino reutilizável criado pelo personal. Aplicado a um aluno gera um Treino vinculado — sem sync retroativo (igual padrão de templates do nutri).

### ExecuçãoTreino
Registro do aluno executando um treino — carga real usada, reps completadas, RPE percebido, observações e conclusão. Vem do app do aluno (vinculação Plus).

### Avaliação
Sessão de avaliação física do aluno. Pode ser antropométrica (peso, estatura, dobras, circunferências, bioimpedância, fotos) ou funcional (RM, mobilidade, flexibilidade, cardio). Cada avaliação tem data e pode ser comparada com anteriores.

### Agendamento
Sessão agendada entre personal e aluno (presencial ou remota), com data, duração, status (agendada, confirmada, realizada, cancelada) e tipo (treino, avaliação, primeira consulta).

### Mensagem
Conversa entre personal e aluno, com texto, anexos e timestamp.

### Indicação
Convite gerado pelo personal para um aluno baixar o app e vincular conta. Tem status (enviado, aceito, expirado).

### Notificação
Evento dirigido ao personal — adesão baixa de um aluno, reavaliação pendente, nova mensagem, indicação aceita, etc.

## Relationships

- Personal tem muitos Alunos
- Personal tem muitos Exercícios (customizados)
- Personal tem muitos TreinoTemplates
- Aluno tem muitos Treinos
- Aluno tem muitas Avaliações
- Aluno tem muitos Agendamentos
- Aluno tem muitas Mensagens
- Treino é composto por Exercícios (com séries/reps/carga)
- Treino pode ser gerado a partir de um TreinoTemplate (sem vínculo retroativo)
- Treino tem muitas ExecuçõesTreino (uma por sessão executada pelo aluno)
- ExecuçãoTreino pertence a um Treino e a um Aluno
- Avaliação pertence a um Aluno
- Agendamento pertence a um Personal e a um Aluno
- Mensagem pertence a um Personal e a um Aluno
- Indicação pertence a um Personal e gera um Aluno quando aceita
- Notificação pertence a um Personal
