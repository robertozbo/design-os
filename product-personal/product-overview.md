# Personal

## Description
Plataforma de gestão para personal trainers autônomos (CREF) que prescrevem treino, avaliam composição corporal e performance, e acompanham a adesão dos alunos. Mesma arquitetura do nutri MVP — "mesmo aluno, lente de personal" + loop "treino → execução → adesão" — com escopo legal respeitado (antropometria e testes funcionais sim, prescrição de dieta não).

## Problems & Solutions

### Problem 1: Prescrição de treino vive no papel ou em PDFs estáticos
Personal trainer cria a ficha em planilha, manda PDF pro WhatsApp, e perde visibilidade total sobre se o aluno treinou, qual carga usou, ou se está progredindo. Personal resolve isso com biblioteca de exercícios curada + treinos vinculados ao aluno + execução registrada no app do aluno (carga real, RPE, conclusão), fechando o loop "prescreveu → executou → ajustar".

### Problem 2: Avaliação física e progressão são desconectadas do treino
Personal aplica antropometria e testes funcionais (RM, mobilidade, cardio) em sessões pontuais, anota num caderno, e nunca cruza esses dados com a evolução de carga e volume do aluno. Personal cruza avaliação com execução automaticamente — progressão de carga, ganho de massa magra e melhora de testes aparecem juntos na mesma timeline.

### Problem 3: Personal autônomo perde tempo em tarefas administrativas
Sem ferramenta integrada, o personal fragmenta agenda no Google Calendar, mensagens no WhatsApp, ficha no Excel, pagamento no Pix — e ainda assim refaz template de treino do zero pra cada novo aluno. Personal centraliza agenda, mensagens, templates de treino e biblioteca de exercícios, com aplicação rápida de template a aluno (sem sync retroativo, igual nutri).

### Problem 4: Difícil escalar para mais alunos sem perder qualidade de acompanhamento
Quanto mais alunos, mais difícil lembrar quem está estagnado, quem não treinou na semana, quem precisa de reavaliação. Personal mostra alunos em risco no dashboard (baixa adesão, sem avaliação recente, sem progressão de carga) — o personal age só onde precisa.

### Problem 5: Aluno trata treino como obrigação isolada, não como projeto
Sem visibilidade de progresso, o aluno desmotiva e cancela. Personal dá ao aluno uma timeline visual de evolução (carga, medidas, fotos, PRs) que aparece no app dele — adesão vira engajamento, e o personal usa isso como ferramenta de retenção.

## Key Features
- Biblioteca de exercícios curada (~200 essenciais com vídeo/GIF, grupo muscular, equipamento) + customizados
- Treinos com séries/reps/carga/descanso/RPE, organizados em mesociclos e periodização
- Templates de treino reutilizáveis (aplicar em aluno cria treino vinculado, sem sync retroativo)
- Avaliação física: antropometria (peso, dobras, circunferências, bioimpedância) + testes funcionais (RM, mobilidade, cardio, flexibilidade)
- Diário de execução do aluno (carga real, RPE, conclusão) sincronizado com app do aluno
- Métricas de progressão: carga, volume semanal, frequência, PRs, composição corporal
- Agenda de sessões presenciais e remotas
- Mensagens e notificações com o aluno
- Indicações (convite pro aluno baixar o app)
- IA para sugerir progressão de carga e ajustes de volume (Pro)
- Freemium gating: Free (gestão básica) / Plus R$49,90 (vinculação app) / Pro R$99,90 (IA + análises avançadas)
