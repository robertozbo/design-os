# Product Roadmap — Nymos Clínico

> **Marcadores:**
> - `[V1]` = obrigatório pra primeiro release (consultório single-doctor de endocrinologia)
> - `[V2]` = entra após V1
> - `[V3+]` = posterior, ou via parceria com fornecedor SaMD aprovado pela ANVISA

> **Personas:** Médico (web), Secretária (web), Paciente (mobile primário; web read-only).
> **Especialidade V1:** Endocrinologia. Generalização → V2.
> **Multi-profissional / clínica com vários médicos:** V2+.

## V1 — 12 sections

> **Profissional não tem onboarding guiado.** Setup inicial (CRM, valores, horários, integração Memed, convite secretária, aceite LGPD) acontece em **Configurações** quando precisar. Vale pra todos os módulos profissionais Nymos.

### 1. Shell `[V1]`
Chrome de navegação por persona. **Três shells distintos:**
- **Médico (web)** — side-nav agrupado em 3 seções:
  - **Atendimento**: Início, Agenda, Pacientes
  - **Clínico**: Atendimentos, Exames, Prescrições
  - **Operacional**: Mensagens, Configurações
- **Secretária (web)** — side-nav reduzido: Agenda, Pacientes (admin), Mensagens (admin), Cobrança, Configurações. Sem links pra prontuário/exame.
- **Paciente (mobile)** — bottom-nav: Início, Agenda, Medicação, Mensagens, Perfil

### 2. Agenda `[V1]`
Calendário compartilhado médico/secretária; presencial + teleconsulta no mesmo calendário; bloqueios, encaixes, status (pendente, confirmado, realizado, cancelado, faltou). Visões diária/semanal/mensal. Paciente vê só as próprias consultas e pode agendar/cancelar com regras de antecedência.

### 3. Atendimentos `[V1]`
Lista de consultas finalizadas (assinadas) — destino próprio no nav do médico. Stats agregados por filtro (hoje/semana/mês): nº consultas, tempo total, prescrições emitidas, exames solicitados, % com IA escriba. Lista agrupada por dia (mais recente primeiro); cada item leva ao read-only do atendimento. NÃO é a consulta ativa (essa é a section `consulta` singular, nested em Paciente).

### 4. Pacientes `[V1]`
Cadastro, busca, vínculo paciente↔médico, **convite por código** (vincula ao app), histórico clínico longitudinal. Médico vê tudo dos seus pacientes; secretária vê só dados administrativos (nome, contato, convênio, agenda, financeiro) — **sem clínico**.

### 5. Consulta `[V1]`
Tela de atendimento — fluxo único pra presencial e teleconsulta. **Escriba IA**: gravação (com consentimento do paciente), transcrição em tempo real, estruturação SOAP automática; médico revisa, edita e assina. Painel de contexto (medicações ativas, últimos exames, evoluções recentes). Botão de prescrição abre Memed embutido. **"Assinar" V1 = click-to-attest** (assinatura ICP-Brasil/A3 → V2).

### 6. Prontuário `[V1]`
Anamnese estruturada com template **endócrino** (queixa principal, HMA, antecedentes pessoais/familiares, medicações em uso, exame físico, antropometria), evolução SOAP, timeline cronológica de atendimentos, exportação PDF do prontuário. Cada evolução marca se foi gerada/assistida por IA (com modelo + versão).

### 7. Exames `[V1]`
Paciente envia laudo PDF + imagem (JPG/DICOM) pelo app. Médico vê viewer com **IA de apoio à interpretação**: resumo do laudo (texto), comparação histórica de valores, cruzamento com queixa do paciente e medicações em uso. Valores numéricos estruturados pra HbA1c, TSH, T4, glicemia, vit D, perfil hormonal — digitados ou sugeridos pela IA a partir do PDF; médico confirma. **DICOM viewer V1 = armazenamento + download/abrir externamente**; viewer embutido (Cornerstone.js, windowing) → V2.

### 8. Prescrição `[V1]`
Integração com **Memed** (prescrição digital com validade ICP-Brasil). Médico prescreve dentro do fluxo de Consulta; paciente recebe no app. Renovação simplificada pra medicação contínua.

### 9. Diário & Medicação (paciente) `[V1]`
- **Diário** — paciente registra peso, glicemia caseira, pressão; gráficos longitudinais visíveis pro paciente e pro médico (do próprio vínculo)
- **Medicação ativa** — derivada da prescrição Memed
- **Lembretes de medicação** — horário, recorrência, status (cumprido/perdido) — fecha o loop **prescrição → execução → adesão**

### 10. Mensagens `[V1]`
**Dois canais separados** (decisão LGPD):
- **Admin** — paciente↔secretária. Confirmação, cobrança, agendamento, dúvidas operacionais.
- **Clínico** — paciente↔médico. Sem SLA. Médico responde quando puder.

Secretária NÃO enxerga o canal clínico, nem o conteúdo. Threads claramente separadas no app do paciente.

### 11. Cobrança `[V1]`
Link PIX/cartão antes ou depois da consulta, recibo digital, histórico de pagamentos. **Convênio = tracking textual** (Unimed/Bradesco/Amil) — sem TUSS/SADT (V2+). Exportação CSV pra contador.

### 12. Configurações & Consentimento `[V1]`
- Perfil profissional, valores, horários, integrações (Memed, vídeo, IA)
- **Central de consentimentos LGPD do paciente**: tutela da saúde (Art. 11), IA escriba (opt-in pra gravação de áudio), IA apoio à interpretação de exames, termo de teleconsulta, compartilhamento entre verticais Nymos (V2+)
- Configuração da secretária (RBAC fixo no V1; multi-secretária V2)
- Acesso a audit log do paciente (LGPD direito do titular)

## V2

- WhatsApp Business (notificações com template aprovado pela Meta + opt-in)
- Triagem de mensagens por IA (classificar urgência, sugerir resposta pra revisão humana)
- Faturamento de convênio (TUSS, SADT, fatura digital, controle de glosa, recurso)
- Multi-secretária (várias funcionárias na conta)
- Compartilhamento entre verticais Nymos (com consentimento explícito do paciente)
- Generalização pra outras especialidades (clínica geral, cardiologia, pediatria, ortopedia)
- Assinatura digital ICP-Brasil/A3 pra evolução do prontuário (substituir click-to-attest)
- DICOM viewer embutido (Cornerstone.js, windowing, multi-frame)
- Multi-profissional / clínica com vários médicos

## V3+ (ou parceria SaMD)

- Análise/laudo IA de imagem médica (raio-X, ECG, fundoscopia, dermatoscopia) — exige registro ANVISA SaMD Classe II/III ou parceria com fornecedor já aprovado (Lunit, Aidoc, Annalise.ai, Qure.ai)
- IA preditiva clínica (risco de descompensação, sugestão de ajuste de dose) — exige validação clínica robusta
- Codificação automática CID-10/TUSS pra faturamento
- Resumo automático de prontuário longo pra consulta de retorno
