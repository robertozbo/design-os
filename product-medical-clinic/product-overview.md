# Nymos Clínica

## Description
Nymos Clínica é o módulo vertical para **clínicas médicas multi-especialidade** da suíte Nymos — vários médicos de especialidades diferentes (endocrinologia, cardiologia, nutrologia…) operando sob um mesmo CNPJ, com **pool compartilhado de pacientes**, gestão de equipe/salas, faturamento agregado e app mobile do paciente integrado. Diferente do **Nymos Clínico** (consultório de 1 médico + secretária), aqui o paciente pertence à **clínica** — qualquer médico autorizado atende e vê o prontuário sob **controle de acesso granular + audit log** (LGPD Art. 11). Mantém IA como copiloto clínico, prescrição via Memed e teleconsulta, agora coordenados entre múltiplos profissionais.

## Problems & Solutions

### Problem 1: Paciente é da clínica, mas o sistema trata como "de um médico só"
Numa clínica multi-especialidade, Maria vê o endócrino, a nutróloga e o cardiologista da **mesma casa** — mas prontuários fragmentados forçam recontar histórico a cada médico. Nymos Clínica dá **pool compartilhado**: o paciente é vinculado à clínica; qualquer médico da equipe autorizado abre um prontuário longitudinal único, com cada acesso registrado em **audit log** (quem viu o quê, quando).

### Problem 2: Compartilhar prontuário sensível sem virar terra-de-ninguém (LGPD)
Acesso irrestrito de todos a tudo é violação de LGPD; silo total mata a colaboração. Nymos resolve com **escopo por papel + por vínculo ativo**: médico da equipe acessa o prontuário de pacientes da clínica sob consentimento de tutela da saúde; admin e recepção **nunca** veem conteúdo clínico; toda leitura e toda inferência de IA ficam auditadas.

### Problem 3: Agenda de vários médicos + salas limitadas vira caos
Múltiplos médicos disputam poucas salas, equipamentos e horários. Nymos oferece **agenda multi-profissional** num calendário único (por médico, por sala, por especialidade), com gestão de **salas & recursos**, encaixes e bloqueios — presencial + teleconsulta no mesmo lugar.

### Problem 4: Dono/gestor não tem visão do negócio
Quem administra a clínica não é médico — precisa gerir equipe, contratos, ocupação e dinheiro sem tocar em dado clínico. Nymos entrega um **papel de Admin/Gestor**: convida/remove médicos, define permissões e limites do plano, e vê **faturamento agregado + relatórios** (produção por médico, ocupação de salas, receita por especialidade).

### Problem 5: Encaminhamento entre especialidades é WhatsApp e papel
Endócrino quer mandar Maria pra nutróloga da própria clínica — hoje é recado informal. Nymos tem **encaminhamento interno**: o médico encaminha para um colega da equipe, que recebe contexto clínico relevante (com consentimento) e assume o vínculo, tudo rastreado.

### Problem 6: Recepção precisa operar sem enxergar o clínico
Recepcionista agenda, cadastra, cobra e conversa no canal administrativo — mas não pode ver prontuário/exame/receita. Nymos fixa **RBAC operacional**: recepção faz tudo o que é administrativo, zero clínico. Canal de mensagem admin (paciente↔recepção) é separado do canal clínico (paciente↔médico).

### Problem 7: Consulta ainda vira datilografia — agora multiplicada por N médicos
Cada médico da clínica perde tempo digitando anamnese/evolução. **Escriba IA** (áudio com consentimento → SOAP estruturado, médico revisa e assina) escala o ganho de tempo para toda a equipe, com flag de transparência (modelo + versão) em cada nota assistida por IA.

### Problem 8: Exames e prescrição precisam funcionar entre médicos
Exames enviados pelo paciente e prescrições Memed devem estar disponíveis para os médicos autorizados da clínica, não presos a um profissional. Nymos centraliza **exames com IA de apoio à interpretação** e **prescrição Memed** no prontuário compartilhado, respeitando escopo de acesso.

### Problem 9: Faturamento da clínica ≠ faturamento de convênio pesado (não pode travar o V1)
TUSS/SADT/glosa é um sistema gigante (V2+). V1 entrega **cobrança particular** (PIX/cartão) com **repasse/produção por médico** e convênio como tracking textual, mais export CSV pro contador.

## Key Features
- **Workspace da clínica** — CNPJ, dados, plano e limites (nº de médicos, salas); base na tabela `workspaces` já existente no backend
- **Gestão de equipe** — convite/remoção de médicos por email, papéis (Admin, Médico, Recepção), permissões e status; usa `workspace_invites` já existente
- **Pool compartilhado de pacientes** — paciente vinculado à clínica; lista única com busca; vínculo médico↔paciente ativo por atendimento
- **Prontuário compartilhado + audit log** — prontuário longitudinal único acessível pelos médicos autorizados; toda leitura e inferência de IA auditadas (LGPD)
- **Controle de acesso granular** — escopo por papel (clínico vs. operacional) e por vínculo; recepção/admin sem acesso clínico
- **Encaminhamento interno entre especialidades** — passar paciente para colega da equipe com contexto e consentimento, rastreado
- **Agenda multi-profissional + salas & recursos** — calendário por médico/sala/especialidade, encaixes, bloqueios, presencial + teleconsulta
- **Consulta com escriba IA** — gravação (consentimento), transcrição, SOAP automático, revisão e assinatura (click-to-attest V1)
- **Prontuário por especialidade** — templates de anamnese por especialidade (endócrino, cardio, nutro…), evolução SOAP, timeline, export PDF
- **Exames com IA de apoio** — recebimento PDF/imagem, valores estruturados, comparação histórica, resumo do laudo
- **Prescrição digital Memed** — validade ICP-Brasil, paciente recebe no app, renovação de contínuo
- **Mensageria de dois canais** — admin (paciente↔recepção) e clínico (paciente↔médico), separados; recepção só vê admin
- **Faturamento agregado + relatórios de gestão** — cobrança particular, produção/repasse por médico, ocupação de salas, receita por especialidade, export CSV
- **Central de consentimentos LGPD** — tutela da saúde, IA escriba, IA apoio a exame, teleconsulta, compartilhamento intra-clínica
- **App do paciente** — agenda, medicação, diário (peso/glicemia/pressão), mensagens, perfil; vê os médicos da clínica a que está vinculado
