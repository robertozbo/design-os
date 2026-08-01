# Data Shape — Nymos Clínico

## Entities

### Consultório
Tenant raiz do módulo Clínico. Representa o consultório de um único médico no V1 (multi-profissional → V2+). Tem dados administrativos (CNPJ ou CPF, razão social, endereço, contato) e configuração geral (horários padrão, valores, integrações Memed e vídeo).

### Profissional
Médico dono do consultório. Tem CRM, especialidade (V1: Endocrinologia), perfil profissional (foto, bio, formação), valores de consulta e horários de atendimento. No V1 há um único `Profissional` por `Consultório`.

### Funcionário
Secretária do consultório. Tem cargo, contato e permissões — **fixas no V1** (operacional, sem acesso clínico). Multi-funcionário → V2.

### Paciente
Pessoa atendida pelo médico. Tem dados pessoais (nome, CPF, nascimento, gênero), contato (telefone, email, endereço), convênio (texto livre — Unimed, Bradesco, Amil, particular). É a mesma entidade de paciente compartilhada entre módulos Nymos: a Maria que é paciente do endócrino aqui é a mesma Maria que pode ser paciente da nutri em outro vínculo.

### VínculoPacienteProfissional
**Junção paciente↔profissional — chave dos silos LGPD entre verticais Nymos.** Toda `Consulta`, `Anamnese`, `Evolução`, `Exame`, `Prescrição`, `Mensagem`, `Medição` pertence ao vínculo, não ao paciente diretamente. Profissional só lê o que é do próprio vínculo. Paciente lê tudo (é dele). Compartilhamento entre vínculos de verticais diferentes = só com `Termo` de consentimento explícito (V2+).

### Agendamento
Slot de tempo agendado pra um paciente. Tem modalidade (`presencial` | `tele`), data/hora, duração, status (pendente, confirmado, realizado, cancelado, faltou), valor cobrado, observação. Pode ser criado por médico, secretária ou paciente (com regras de antecedência).

### Consulta
Atendimento realizado, vinculado a um `Agendamento`. Suporta presencial e teleconsulta no mesmo modelo. Tem início, fim, modalidade efetiva, link de sala (se tele), gravação (se houver, opt-in do paciente), e referencia uma `Anamnese` + `Evolução`.

### Anamnese
Conjunto de campos estruturados preenchidos durante a consulta. Template **endócrino** no V1: queixa principal, HMA (história da moléstia atual), antecedentes pessoais, antecedentes familiares, medicações em uso, exame físico, antropometria (peso, altura, IMC, circunferência abdominal). Pode ser pré-preenchida pelo paciente no app antes da consulta.

### Evolução
Texto SOAP da consulta (Subjective, Objective, Assessment, Plan). Pode ser gerada/assistida pela **IA escriba** a partir da gravação. Tem flags de transparência: `geradoPorIA` (boolean), `modeloIA` (string), `revisadoPor` (profissionalId), `assinadoEm` (timestamp), `assinadoPor`. **Assinatura V1 = click-to-attest** (registra atestação simples); ICP-Brasil/A3 → V2.

### Exame
Resultado de exame laboratorial ou de imagem enviado pelo paciente. Tem laudo (PDF do laboratório), imagem (JPG/DICOM se aplicável), tipo (laboratorial, imagem), data de coleta/realização, e laboratório de origem. Pode ter `valoresEstruturados` (lista de `Biomarker`) digitados pelo médico ou sugeridos pela IA a partir do PDF (médico confirma).

### Biomarker
Valor numérico individual associado a um `Exame`. Tem nome (HbA1c, TSH, T4, glicemia, vitamina D, etc.), valor, unidade, faixa de referência, data. Permite comparação histórica longitudinal.

### Prescrição
Receita médica emitida via Memed. Tem `memedId` (referência externa), itens (medicação, dose, posologia, duração), validade (ICP-Brasil via Memed), status (ativa, expirada, cancelada). Source-of-truth é o Memed; Nymos referencia. Mudanças = nova prescrição (não há merge mutável).

### MedicaçãoAtiva
Visão derivada das `Prescrição` ativas + ajustes anotados na evolução. Apresentada ao paciente como "medicações em uso" e ao médico como contexto na consulta. Não é entidade de escrita independente.

### Lembrete
Lembrete de medicação derivado de uma `Prescrição` ativa. Tem horário, recorrência (diário, semanal, custom), próxima ocorrência, status (cumprido, perdido, pulado), histórico de check-ins. Fecha o loop **prescrição → execução → adesão**.

### Medição
Registro do diário do paciente: peso, glicemia caseira, pressão arterial. Tem tipo, valor, unidade, timestamp, fonte (manual, balança Bluetooth, glicosímetro). **Não se confunde com `Exame`/`Biomarker`** — glicemia caseira (`Medição`) e HbA1c laboratorial (`Biomarker` de `Exame`) vivem em entidades separadas e não são reconciliadas no V1; o médico interpreta as duas em conjunto no prontuário.

### Mensagem
Texto trocado entre paciente e profissional ou paciente e secretária. Tem `canal` (`'admin'` | `'clinico'`), autor, lida/não lida, timestamp, anexo (opcional). **Corte de permissão:** secretária só lê/escreve `canal: 'admin'`; canal `'clinico'` é exclusivo paciente↔médico.

### Pagamento
Cobrança de uma consulta. Tem link de pagamento (PIX, cartão), valor, status (pendente, pago, cancelado), método, vinculado a um `Agendamento`. Recibo digital gerado ao confirmar pagamento. Convênio = apenas tag textual no `Agendamento` (sem fluxo de TUSS/SADT no V1).

### Termo
Aceite de termo pelo paciente. Tem tipo (`tutela_saude`, `ia_escriba`, `ia_apoio_exame`, `teleconsulta`, `compartilhamento_vertical_X`), versão do termo, timestamp do aceite, IP, dispositivo. Suporta a base legal LGPD Art. 11 + consentimento granular.

### AuditLog
Registro auditável de cada acesso a dado clínico e cada inferência de IA. Tem ator (profissionalId ou pacienteId), ação (read, write, sign, ai_inference), entidade afetada, paciente envolvido, timestamp, e detalhes (input/output da IA, modelo, versão). Imutável, append-only. Acessível ao paciente (direito do titular LGPD).

## Relationships

- `Consultório` 1—1 `Profissional` (V1; 1—N em V2+)
- `Consultório` 1—N `Funcionário`
- `Consultório` 1—N `Paciente`
- `Paciente` 1—N `VínculoPacienteProfissional` (paciente pode ter vínculos paralelos com múltiplos profissionais Nymos de verticais diferentes)
- `Profissional` 1—N `VínculoPacienteProfissional`
- `VínculoPacienteProfissional` 1—N `Agendamento` 1—1 `Consulta` 1—1 `Anamnese` 1—1 `Evolução`
- `VínculoPacienteProfissional` 1—N `Exame` 1—N `Biomarker`
- `VínculoPacienteProfissional` 1—N `Prescrição` → derivam `MedicaçãoAtiva` + `Lembrete`
- `VínculoPacienteProfissional` 1—N `Medição` (do diário do paciente, no contexto do vínculo)
- `VínculoPacienteProfissional` 1—N `Mensagem` (com canal `admin` envolvendo `Funcionário` ou `clinico` envolvendo `Profissional`)
- `Agendamento` 1—1 `Pagamento`
- `Paciente` 1—N `Termo`
- Toda escrita ou leitura sensível gera 1 `AuditLog`
