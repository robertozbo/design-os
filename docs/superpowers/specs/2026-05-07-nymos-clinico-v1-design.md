# Nymos Clínico V1 — Design Spec

**Data:** 2026-05-07
**Autor (sessão):** Roberto Zboralski (com brainstorming Claude)
**Status:** Rascunho aguardando review

---

## 1. Visão executiva

**Nome do módulo:** Nymos Clínico (módulo Nymos vertical médica, paralelo a Nymos Nutri).

**O que é:** SaaS para consultório médico de **endocrinologia** operado por **1 médico + 1 secretária**, com app mobile do paciente integrado. Substitui caderneta + WhatsApp + planilha + sistema de prontuário fragmentado por uma plataforma única, com **IA como copiloto clínico** (escriba e apoio à interpretação de exames), respeitando rigorosamente LGPD e ética médica brasileira (CFM).

**Pra quem:** endocrinologistas em consultório próprio (particular + tracking de convênio), com pacientes crônicos longitudinais — diabetes, tireoide, obesidade, SOP.

**Por que endocrinologia primeiro:**
- Pacientes crônicos longitudinais → app do paciente faz sentido (engajamento contínuo)
- Exames recorrentes (TSH, T4, HbA1c, glicemia, vit D, perfil hormonal) → o "apoio à interpretação" com comparação histórica brilha
- Prescrição contínua (Levotiroxina, Metformina, GLP-1) → integração Memed gera valor imediato
- **Sinergia com Nymos Nutri**: paciente com diabetes/obesidade frequentemente é atendido por endócrino + nutri simultaneamente — mesma plataforma, vínculos paralelos

---

## 2. Escopo do V1

### 2.1 Atores

| Persona | Plataforma | Acesso |
|---|---|---|
| **Médico** | Web (desktop primário) | Tudo dos seus pacientes (clínico + admin) |
| **Secretária** | Web (desktop primário) | Operacional/admin. **Sem acesso clínico** (anamnese, prontuário, exame, prescrição, mensagem clínica) |
| **Paciente** | Mobile (primário); web read-only | Seus próprios dados; vê os profissionais Nymos a que está vinculado |

**Multi-profissional / clínica com vários médicos = V2+.**

### 2.2 Doze sections do V1

1. **Shell** — chrome/navegação por persona (3 shells distintos)
2. **Onboarding** — setup do consultório, convite da secretária, primeira agenda, aceite LGPD do médico/clínica
3. **Agenda** — calendário compartilhado médico/secretária; presencial + teleconsulta no mesmo calendário; bloqueios, encaixes; paciente vê apenas as próprias consultas
4. **Pacientes** — cadastro, busca, vínculo, convite app, histórico (escopos diferentes pra médico/secretária)
5. **Consulta** — tela de atendimento com **escriba IA** (transcrição → SOAP estruturado → médico revisa e assina); fluxo único pra presencial e teleconsulta
6. **Prontuário** — anamnese estruturada (template endócrino — queixa, HMA, antecedentes, medicações em uso, exame físico), evolução (texto SOAP), timeline cronológica, exportação PDF
7. **Exames** — paciente envia laudo PDF + imagem (JPG/DICOM); médico vê viewer com **IA de apoio à interpretação** (resumo do laudo, comparação histórica, cruzamento com queixa); valores numéricos digitados ou sugeridos pra HbA1c, TSH, glicemia, T4, etc.
8. **Prescrição** — integração com **Memed** (prescrição com validade ICP-Brasil); paciente recebe no app
9. **Diário & Medicação (paciente)** — registro de peso, glicemia caseira, pressão; medicação ativa derivada de prescrições; lembretes de remédio
10. **Mensagens** — **dois canais separados**: admin (paciente↔secretária — confirmação, cobrança, agendamento) e clínico (paciente↔médico — sem SLA). Secretária só enxerga admin.
11. **Cobrança** — link PIX/cartão antes ou depois da consulta, recibo digital, histórico. Convênio = apenas tracking textual (Unimed/Bradesco/Amil), sem TUSS/SADT.
12. **Configurações & Consentimento** — perfil profissional, valores, horários, integrações; **central de consentimentos LGPD do paciente** (tutela da saúde, IA, teleconsulta, compartilhamento entre verticais V2+)

> **Teleconsulta não é section separada** — é uma modalidade que atravessa Agenda (marcação remota) + Consulta (sala de vídeo embutida) + Mensagens (link). CFM Resolução 2.314/2022.

### 2.3 IA — escopo, ética e limites

**No V1:**
- ✅ **Escriba clínico**: médico grava consulta (com consentimento do paciente — termo no V1), IA transcreve e estrutura em formato SOAP, médico revisa e assina. Reduz ~2h/dia de digitação.
- ✅ **Apoio à interpretação de exames**: IA NÃO faz laudo. Resume o laudo do radiologista/laboratório, compara achados com exames anteriores ("nódulo era 4mm, agora 6mm"), cruza com queixa do paciente e medicações em uso, destaca termos relevantes.

**Fora do V1:**
- ❌ **Triagem de mensagens por IA** → V2
- ❌ **Análise/laudo IA de imagem** (raio-X, ECG) → V3+ ou parceria com fornecedor já aprovado pela ANVISA (Lunit, Aidoc, Annalise.ai, Qure.ai). Construir do zero exige registro SaMD Classe II (12–24 meses + estudo clínico).

**Princípios éticos (não-negociáveis):**
- IA é sempre **copiloto, nunca decisor**. Médico revisa e assina toda saída.
- **Transparência no prontuário**: cada nota tem flag *gerado/assistido por IA* + versão do modelo + timestamp.
- **Audit log de toda inferência IA** (input, output, modelo, usuário, paciente).
- **Opt-in explícito do paciente** pra uso de áudio em escriba.
- **Viés/limitações documentadas** na central de configurações.

### 2.4 Pilares regulatórios e LGPD

- **LGPD (Lei 13.709)**: dados sensíveis de saúde Art. 11 — base legal = tutela da saúde + consentimento granular do paciente
- **CFM Resolução 2.299/2021** — prontuário eletrônico
- **CFM Resolução 2.314/2022** — telemedicina (consulta inicial e retorno permitidos)
- **Parecer CFM 02/2024** — uso de IA em medicina (responsabilidade final do médico)
- **ANPD** — DPO designado, DPIA pra features de IA
- **SBIS NGS1/NGS2** — referência de certificação futura (não obrigatório V1)
- **Dados clínicos no Brasil** — região cloud BR, BAA com providers (ou self-hosted pra dados mais sensíveis)
- **Criptografia em repouso e em trânsito**
- **Audit log** de leitura de prontuário, login, alterações, e cada inferência IA
- **Direitos do titular** — exclusão, portabilidade, retificação

### 2.5 Verticais Nymos = silos rígidos

**Decisão central:** mesmo paciente Nymos pode ter vínculos paralelos com múltiplos profissionais Nymos (ex: Maria atendida por Dra. Ana — nutri — e Dr. Pedro — endócrino), **mas cada vertical é um silo de dados independente**.

- Mesma conta de paciente, **uma pessoa, um login**
- No app, paciente vê os profissionais como tracks separadas
- **Profissionais NÃO veem dados de outras verticais por padrão** — endócrino não vê HbA1c que a nutri pediu, mesmo do mesmo paciente
- **Compartilhamento entre verticais = só com consentimento explícito** (V2+, fora do V1)
- Implementação técnica: a entidade `VinculoPacienteProfissional` é a junção, e cada `Consulta`, `Anamnese`, `Exame`, `Prescrição` pertence ao vínculo, não ao paciente diretamente. O paciente pode ler tudo (é dele); profissional só lê do próprio vínculo.

### 2.6 Fora do V1 (deliberadamente)

| Item | Adiado pra | Razão |
|---|---|---|
| WhatsApp Business (notificações) | V2 | Meta exige template approval, opt-in robusto, número dedicado — pesado pra MVP |
| Faturamento de convênio (TUSS, SADT, glosa, recurso) | V2+ | É praticamente um produto separado |
| Triagem de mensagens por IA | V2 | Foco V1 = escriba (ROI maior) |
| Compartilhamento entre verticais Nymos | V2 | Exige consentimento granular bem desenhado |
| Análise/laudo IA de imagem médica | V3+ ou parceria | SaMD Classe II — registro ANVISA caro/lento |
| Multi-profissional (clínica) | V2+ | Modelar permissões e escala financeira |
| Generalização pra outras especialidades | V2 | V1 vai vertical fundo em endócrino |

---

## 3. Data Shape (alto nível)

### 3.1 Tenancy & atores

- **Consultório** — tenant raiz (1 médico dono no V1)
- **Profissional** — médico (CRM, especialidade, perfil profissional, valores, horários)
- **Funcionário** — secretária (cargo, permissões — fixas no V1)
- **Paciente** — dados pessoais (nome, CPF, contato), convênio (texto livre)

### 3.2 Vínculo (chave LGPD/silos)

- **VínculoPacienteProfissional** — junção paciente↔profissional. Os silos entre verticais Nymos vivem aqui. Toda Consulta/Anamnese/Exame/Prescrição é do **vínculo**, não do paciente diretamente.

### 3.3 Atendimento

- **Agendamento** — slot, paciente, modalidade (`presencial` / `tele`), status, valor
- **Consulta** — atendimento realizado (linkado a agendamento), suporta presencial e teleconsulta
- **Anamnese** — campos estruturados por especialidade (template endócrino: queixa principal, HMA, antecedentes pessoais/familiares, medicações em uso, exame físico, antropometria)
- **Evolução** — texto SOAP, com flag `geradoPorIA: boolean`, `modeloIA: string`, `revisadoPor: profissionalId`, `assinadoEm: timestamp`
- **Exame** — laudo (PDF) + imagem (JPG/DICOM) + valores estruturados (HbA1c, TSH, glicemia, T4, etc.) com data e tipo
- **Prescrição** — referência Memed (`memedId`, items, validade, status)

### 3.4 Paciente longitudinal

- **Medição** — peso, glicemia caseira, pressão (do diário do paciente), com timestamp e fonte
- **MedicaçãoAtiva** — derivada de prescrições + ajustes manuais
- **Lembrete** — medicação a tomar, horário, recorrência, status (cumprido/perdido)

### 3.5 Comunicação & operacional

- **Mensagem** — texto, autor, lida, com `canal: 'admin' | 'clinico'` (corte de permissão da secretária)
- **Pagamento** — link, status, valor, vinculado a agendamento
- **Termo (LGPD)** — tipo (`tutela_saude`, `ia_escriba`, `ia_apoio_exame`, `teleconsulta`, `compartilhamento_vertical_X`), versão, aceite (timestamp + IP + dispositivo)
- **AuditLog** — ator, ação, entidade, paciente, timestamp; **registra toda leitura de prontuário e toda inferência IA**

---

## 4. Aspectos de UX por persona

### 4.1 Médico (web)

Layout primário desktop com side-nav (Início, Agenda, Pacientes, Mensagens, Configurações). Tela de **Consulta** é o coração:
- Painel esquerdo: anamnese estruturada (preenchível pelo paciente pré-consulta no app, médico revisa)
- Painel central: gravação + transcrição + SOAP gerado pela IA, com botão "Assinar"
- Painel direito: contexto (medicações ativas, últimos exames, evoluções recentes)
- Botão de prescrição abre Memed embutido

### 4.2 Secretária (web)

Side-nav reduzido: Agenda, Pacientes (admin), Mensagens (admin), Cobrança, Configurações.
- **Sem nenhum link pra prontuário ou exame** — UI não expõe nem em estado de erro
- Confirmação de consulta com 1 clique → dispara mensagem padronizada

### 4.3 Paciente (mobile)

Bottom-nav: Início, Agenda, Diário, Mensagens, Perfil.
- **Início**: próxima consulta + ações rápidas (entrar na sala, registrar peso, ver receita ativa)
- **Diário**: peso, glicemia, pressão — gráficos longitudinais
- **Exames**: upload (foto/PDF) com câmera nativa
- **Mensagens**: dois threads claramente separados ("Recepção" — secretária; "Dr. Pedro" — médico)
- **Perfil**: profissionais vinculados (vê Dra. Ana e Dr. Pedro como cards independentes), termos aceitos, central de consentimentos

---

## 5. Pontos de risco e decisões em aberto

| Risco / Pergunta | Mitigação proposta | Decisão pendente |
|---|---|---|
| Memed pode mudar política de pricing/integração | Avaliar API, SLA, contrato; ter contingência (PDF + ICP próprio) | Validar com Memed antes do V1 começar |
| Escriba IA depende de provedor (Anthropic / outro) com BAA | Selecionar provedor com BAA + região BR; fallback pra modelo open-weights self-hosted | Decisão de provedor IA |
| Vídeo de teleconsulta — provider | LiveKit (open-source self-hosted) vs Daily/Twilio (managed) | Custo vs controle |
| Assinatura digital da evolução | ICP-Brasil exigido pra prontuário "definitivo"? CFM 2.299/2021 sugere certificação, mas não obriga A3 | Confirmar com advogado |
| Dataset/regulamento pra "apoio à interpretação" — pode entrar em zona cinza de SaMD | Manter rigor: IA NÃO conclui, só resume/compara texto livre do laudo já produzido por radiologista. Documentar no termo. | DPIA antes de lançar |
| Convênios sem TUSS — médico ainda precisa faturar fora — fricção | Aceitar limitação V1; oferecer exportação CSV pra contador | OK pra V1 |

---

## 6. Próximos passos

Após aprovação deste spec, opções de continuação:

1. **Gerar artefatos Design OS** em `product-clinico/`:
   - `product-overview.md`
   - `product-roadmap.md` (12 sections)
   - `data-shape/data-shape.md`
   - `design-system/` (clonar tokens Nymos existentes)
2. **Avançar fluxo Design OS** com `/design-tokens` (validar paleta/tipo Nymos), `/design-shell` (3 shells), `/shape-section` (começar por Agenda ou Consulta)
3. **Escrever implementation plan** via skill `writing-plans` (caso o usuário queira modelar um sprint de implementação no produto real, não no Design OS)
4. **Validações externas** antes de implementação: cotação Memed, BAA com provider IA, opinião jurídica sobre escopo de SaMD da feature de "apoio à interpretação"

**Recomendação:** sequência (1) → (2) começando pelas sections de maior risco/aprendizado: **Consulta** (escriba IA — caso de uso central + risco regulatório/UX) e **Exames** (apoio IA — caso de uso central + risco regulatório).
