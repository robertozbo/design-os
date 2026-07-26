# Data Shape — Nymos Clínica

## Entities

### Clinic
A clínica em si — o workspace multi-especialidade sob um CNPJ. Guarda dados cadastrais, plano, limites (nº de médicos, salas) e configurações. Mapeia para `workspaces` (workspaceType `clinic`) no backend.

### Professional
Um médico da clínica, com especialidade, CRM e status. Pertence a uma Clinic. Mapeia para `professionals` (com `workspaceId`).

### Membership
O vínculo de uma pessoa (Professional ou funcionário) à Clinic com um Role. Define papel e permissões. Convites pendentes mapeiam para `workspace_invites`.

### Role
Papel dentro da clínica: **Admin/Gestor**, **Médico**, **Recepção**. Determina o escopo de acesso (clínico vs. operacional). RBAC fixo no V1.

### Patient
Pessoa atendida pela clínica. **Pertence à Clinic** (pool compartilhado), não a um médico. Pode ter conta no app (linkedUser) ou ser só cadastro.

### CareLink
Vínculo ativo Patient↔Professional (o médico que atende/acompanha o paciente). Um paciente pode ter vários CareLinks (várias especialidades). Governa, junto com Role, o acesso ao prontuário.

### Appointment
Um agendamento no calendário: Patient + Professional + Room + horário + tipo (presencial/teleconsulta) + status. Base da agenda multi-profissional.

### Room
Sala/consultório ou recurso da clínica, com disponibilidade. Um Appointment ocupa uma Room.

### MedicalRecord
O prontuário longitudinal **único por Patient**, compartilhado entre os Professionals autorizados. Contém anamnese (template por especialidade) e a coleção de Encounters.

### Encounter
Uma consulta finalizada e assinada: evolução SOAP, autor (Professional), timestamp, flag de IA (modelo + versão). Pertence a um MedicalRecord.

### Exam
Um exame do Patient (laudo PDF/imagem + valores estruturados), com apoio de IA à interpretação. Visível aos Professionals autorizados.

### Prescription
Prescrição digital (Memed, validade ICP-Brasil) emitida por um Professional numa Encounter, entregue ao Patient no app.

### Referral
Encaminhamento interno: um Professional encaminha o Patient para outro Professional da mesma Clinic, com motivo e contexto compartilhado (sob consentimento).

### MessageThread
Conversa de um Patient num de dois canais: **admin** (com Recepção) ou **clínico** (com o Médico do vínculo). Canais isolados.

### Charge
Cobrança de um Appointment/atendimento (particular via PIX/cartão; convênio como tracking textual). Agrega em produção/repasse por Professional.

### Consent
Consentimento LGPD do Patient: tutela da saúde, IA escriba, IA apoio a exame, teleconsulta, compartilhamento intra-clínica. Governa o que pode ser acessado/processado.

### AuditEvent
Registro imutável de cada acesso a prontuário/exame e cada inferência de IA: quem, o quê, quando. Base da conformidade LGPD do prontuário compartilhado.

## Relationships

- Clinic has many Professionals
- Clinic has many Patients (pool compartilhado)
- Clinic has many Rooms
- Professional belongs to one Clinic; has one Membership with one Role
- Membership belongs to Clinic and to a person (Professional/funcionário)
- Patient belongs to one Clinic; has many CareLinks
- CareLink links one Patient to one Professional
- Patient has one MedicalRecord
- MedicalRecord has many Encounters, many Exams, many Prescriptions
- Encounter belongs to one Professional (autor) and one MedicalRecord
- Appointment links Patient + Professional + Room
- Referral links Patient from one Professional to another (same Clinic)
- MessageThread belongs to one Patient (canal admin ou clínico)
- Charge belongs to one Appointment; aggregates by Professional
- Consent belongs to one Patient
- AuditEvent references a Professional (ator), a Patient (alvo) e o recurso acessado
