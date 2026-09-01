# Product Roadmap — Nymos Clínica

> **Marcadores:**
> - `[V1]` = obrigatório pro primeiro release (clínica multi-especialidade, pool compartilhado)
> - `[V2]` = entra após V1
> - `[V3+]` = posterior, ou via parceria com fornecedor SaMD aprovado pela ANVISA

> **Personas:** Médico (web), Admin/Gestor (web), Recepção (web), Paciente (mobile primário; web read-only).
> **Escopo V1:** clínica multi-especialidade sob 1 CNPJ, pool compartilhado de pacientes com controle de acesso.
> **Relação com Nymos Clínico:** o produto `clinico` (1 médico + secretária) continua como vertical própria. `clinica` **reusa** as sections clínicas (Consulta, Prontuário, Exames, Prescrição) e adiciona a camada multi-profissional (equipe, salas, prontuário compartilhado, gestão).
> **Base já existente no backend:** `workspaces` (workspaceType `clinic`, `maxProfessionals`), `workspace_invites`, `professional_patients` + `professional_patient_scopes`. **Maior gap a construir:** compartilhamento de paciente/prontuário no nível do workspace (hoje é isolado por profissional).

## V1 — 34 sections

### 1. Shell `[V1]`
Três shells por persona, identidade Nymos (teal, DM Sans):
- **Médico (web)** — side-nav: Atendimento (Início, Agenda, Pacientes), Clínico (Atendimentos, Exames, Prescrições), Operacional (Mensagens, Configurações). Prontuário/Consulta nested em Pacientes.
- **Admin/Gestor (web)** — side-nav: Gestão (Visão geral, Equipe, Salas & recursos), Financeiro (Faturamento, Relatórios), Operacional (Agenda, Configurações). **Sem acesso clínico.**
- **Recepção (web)** — side-nav reduzida: Agenda, Pacientes (admin), Mensagens (admin), Cobrança, Configurações. **Sem prontuário/exame/prescrição.**
- **Paciente (mobile)** — bottom-nav: Início, Agenda, Medicação, Mensagens, Perfil.

### 2. Início (médico) `[V1]`
Home do médico: sua agenda do dia, alertas (mensagens não lidas, exames novos pra revisar, encaminhamentos recebidos), pacientes do dia. Escopo = só os pacientes/atendimentos do próprio médico + o que lhe foi encaminhado.

### 3. Visão geral (gestão) `[V1]`
Home do Admin: KPIs da clínica (atendimentos hoje/semana, ocupação de salas, receita, nº de médicos ativos, pendências de convite). Sem qualquer dado clínico de paciente. `id: inicio-gestao`.

### 4. Equipe `[V1]`
Gestão de profissionais do workspace: lista de médicos com especialidade/CRM/status, **convite por email** (usa `workspace_invites`), atribuição de papel (Admin/Médico/Recepção), permissões, remoção, limite do plano (`maxProfessionals`). Aceite de convite (colega). `id: equipe`.

### 5. Salas & recursos `[V1]`
Cadastro de salas/consultórios e recursos (equipamentos), disponibilidade, e vínculo com a agenda (uma consulta ocupa médico + sala). Evita conflito de sala. `id: salas`.

### 6. Chegada `[V1]`
A **tela do balcão** e a landing da Recepção. Lista o dia inteiro em três grupos — quem já está na
clínica (com o tempo de espera correndo), quem ainda vem (com a régua do agora e o atraso de quem
não apareceu) e o que já encerrou. A chegada é registrada pelo **código de 6 dígitos** do app do
paciente (campo sempre em foco, valida ao sexto dígito) ou **na mão**, para quem não tem o app —
todo o legado importado. Grava hora, autor e método. Materializa a issue **#808**: é aqui que
`chegou` (`checked_in`) nasce. Presença registrada bloqueia `faltou`. `id: chegada`.

> Existe porque a Agenda não serve para isso: ela é grade de coordenação (07h–19h × N
> profissionais, sem busca e sem linha do agora), e receber gente na porta é outro trabalho.

### 7. Agenda `[V1]`
Calendário multi-profissional compartilhado: visão por médico, por sala e por especialidade; presencial + teleconsulta; encaixes, bloqueios, status (pendente, confirmado, realizado, cancelado, faltou). Recepção agenda para qualquer médico; médico vê a própria. Paciente vê/agenda as próprias.

### 8. Pacientes `[V1]`
**Pool compartilhado**: lista única de pacientes da clínica, busca, cadastro, **convite por email** (paciente aceita no app e confirma permissões). Abrir paciente revela tabs (Resumo, Prontuário, Exames, Prescrição, Consulta, Financeiro). Médico vê clínico sob escopo; recepção vê só admin (nome, contato, convênio, financeiro). Mostra os médicos da clínica vinculados ao paciente.

### 9. Consulta `[V1]`
Tela de atendimento (presencial + teleconsulta), fluxo único. **Escriba IA**: gravação com consentimento, transcrição, SOAP automático; médico revisa, edita e assina (click-to-attest V1). Painel de contexto (medicações ativas, últimos exames, evoluções recentes de qualquer médico da clínica — sob escopo). Nested em Pacientes. `id: consulta`.

### 10. Prontuário compartilhado `[V1]`
Prontuário longitudinal **único por paciente**, acessível pelos médicos autorizados da clínica. Anamnese estruturada com **template por especialidade**, evolução SOAP, timeline cronológica cross-médico, export PDF. Cada evolução marca autor (médico) e se foi assistida por IA (modelo + versão). Nested em Pacientes. `id: prontuario`.

### 11. Atendimentos `[V1]`
Lista de consultas finalizadas (assinadas) do médico logado — destino no nav. Stats agregados (nº consultas, tempo, prescrições, exames solicitados, % com IA escriba) por filtro (hoje/semana/mês). `id: atendimentos`.

### 12. Exames `[V1]`
Recebimento de laudo PDF + imagem pelo app; viewer com **IA de apoio à interpretação** (resumo, comparação histórica, cruzamento com queixa/medicação). Valores estruturados (HbA1c, TSH, glicemia, etc.), confirmados pelo médico. Compartilhado entre médicos autorizados do paciente. `id: exames`.

### 13. Prescrição `[V1]`
Integração **Memed** (validade ICP-Brasil), médico prescreve dentro da Consulta, paciente recebe no app, renovação de contínuo. Prescrições visíveis aos médicos autorizados. `id: prescricao`.

### 14. Encaminhamento interno `[V1]`
Médico encaminha o paciente para um colega da equipe (outra especialidade): seleciona médico, motivo, contexto clínico compartilhado (com consentimento). Colega recebe na Home e assume vínculo. Rastreado no audit log. `id: encaminhamento`.

### 15. Mensagens `[V1]`
Dois canais separados (LGPD): **admin** (paciente↔recepção) e **clínico** (paciente↔médico do vínculo). Recepção não vê o canal clínico. Threads separadas no app do paciente. `id: mensagens`.

### 16. Cobrança & Faturamento `[V1]`
- **Cobrança** (recepção): link PIX/cartão, recibo, histórico, convênio como tracking textual, export CSV. `id: cobranca`.
- **Faturamento** (admin): visão agregada, **produção/repasse por médico**, receita por especialidade. `id: faturamento`.

### 17. Financeiro — contas `[V1]`
Grupo Financeiro do Admin, alimentado pelo "Gerar financeiro" do agendamento (cada parcela vira uma conta a receber):
- **Contas a receber** (`id: contas-receber`): recebimentos de pacientes/convênios, KPIs, filtro por período/status, confirmar pagamento, nova conta a partir do catálogo de serviços.
- **Contas a pagar** (`id: contas-pagar`): despesas da clínica (fornecedor, aluguel, salários, insumos, impostos), mesmos KPIs/filtros, confirmar pagamento, recorrência.
- Ambas compartilham tipos e componentes em `_contas/` — módulo interno, sem rota nem spec; o `_` marca que não é section.

### 18. Cadastros do financeiro `[V1]`
- **Serviços** (`id: servicos`): cadastro-mãe do faturamento — nome, **preço** e **duração**, vinculado a um tipo de receita. Popula duração/valor no agendamento e o valor em Contas a receber.
- **Tipos de conta** (`id: categorias-financeiras`): categorias de receita e de despesa (fixa/variável), pré-carregadas; tipos de fábrica desativam em vez de excluir.
- **Fornecedores** (`id: fornecedores`): cadastro com consulta de CNPJ (mock no protótipo), telefone, categoria padrão de despesa; usado no select de Contas a pagar.
- **Convênios** (`id: convenios`): catálogo de operadoras — nome, registro ANS, ativo, com a contagem de pacientes de cada uma. O convênio nasce **ao digitar** no cadastro do paciente (a recepção não sai do atendimento); esta tela é onde se **arruma** o catálogo depois: corrigir grafia, desativar o que não se usa. Sem tabela de preço e sem mesclar — ver o spec. Aparece no nav do Admin (Cadastros) e no da Recepção.

### 19. Relatórios & Configurações `[V1]`
- **Relatórios** (admin): produção por médico, ocupação de salas, receita por especialidade, no-show. `id: relatorios`.
- **Configurações**: da clínica (`configuracoes-clinica` — workspace, integrações, consentimentos, audit log), do médico (`configuracoes-medico`), da recepção (`configuracoes-recepcao`). Perfil profissional (`perfil`).

### 20. Acompanhamento `[V1]`
O que o paciente compartilha pelo app entre as consultas, reunido para o médico: métricas de
wearable, atividade, composição corporal, avaliações físicas e exames — sempre com a **fonte** do
dado e a **variação desde a última consulta**. Lista também os escopos que o paciente **não**
liberou, para o médico distinguir "não compartilhado" de "sem dado". Nested em Pacientes, só existe
para paciente vinculado. É o elo entre o app e a clínica: sem ele o app vira diário pessoal.
`id: acompanhamento`.

### 21. Fluxo de caixa `[V1]`
A visão de **caixa** do Admin: quanto entrou, quanto saiu e **em que dia o saldo projetado fica
negativo**. Difere de Contas a receber/pagar pelo **regime** — lá vale o vencimento (competência),
aqui vale quando o dinheiro se move; o que venceu e não foi pago é **reprojetado para hoje**, porque
continua pendurado. Dois painéis com o mesmo eixo X (movimento do dia e saldo acumulado), tabela dia
a dia expansível e faixa de alerta no topo. Lê os mesmos lançamentos de `_contas` — não edita nem
confirma pagamento. `id: fluxo-caixa`.

### 22. Agendamento por WhatsApp `[V1]`
O canal de auto-agendamento no WhatsApp, visto pela **Recepção/Admin**: simulador do chat numa moldura
de celular, configuração do bot (saudação, serviços expostos, antecedência, janela) e a **fila** de
pré-agendamentos e leads que ele gerou. O bot é **determinístico** — botões e listas, sem texto gerado.
A ordem é **serviço → profissional → data → hora**, porque é o serviço que traz `duracaoMin` e o preço;
"Primeiro horário disponível" é sempre a primeira opção de profissional. Tudo nasce **pendente** e sem
cobrança: quem confirma é a recepção. WhatsApp é canal **admin** — o bot não responde nada clínico e
não escreve especialidade nem motivo. A camada de IA é V2 e aparece desligada. `id: agendamento-whatsapp`.

### 23. Avaliação física `[V1]`
Antropometria e composição corporal medidas **dentro** da clínica, compartilhadas entre a nutrição
e a educação física — é o mesmo corpo, então é a mesma tela e a mesma série. Oito protocolos de
dobras cutâneas com as equações do motor que a Nymos já roda em produção
(`backend/src/lib/body-composition/`), resultado recalculado a cada tecla (IMC, %G, massa gorda e
magra, RCQ, RCE, CMB, fracionamento, TMB, GET) e as metas diárias derivadas, que é onde a avaliação
deixa de ser laudo e vira insumo do plano alimentar. Não se confunde com `acompanhamento`: lá é o
que o **paciente** compartilha pelo app (auto-medição); aqui é ato profissional, com quem mediu e
quem assina. Nested em Pacientes. `id: avaliacao-fisica`.

## V2

- Faturamento de convênio (TUSS, SADT, glosa, recurso)
- Assinatura ICP-Brasil/A3 na evolução (substituir click-to-attest)
- Multi-unidade (rede de clínicas / filiais sob a mesma conta)
- Enfermagem/técnico como papel com acesso clínico parcial (triagem, sinais vitais)
- Triagem de mensagens por IA (classificar urgência, sugerir resposta)
- IA no atendimento do WhatsApp (entender a 1ª mensagem, responder FAQ, rascunhar resposta) — o fluxo
  determinístico da V1 continua sendo o fallback quando ela não tem certeza
- DICOM viewer embutido (Cornerstone.js)
- Compartilhamento entre verticais Nymos (Nutri/Personal/Psicólogo) com consentimento

## V3+ (ou parceria SaMD)

- Análise/laudo IA de imagem médica (exige registro ANVISA SaMD ou parceria aprovada)
- IA preditiva clínica (risco, sugestão de ajuste de dose) — exige validação clínica robusta
- Codificação automática CID-10/TUSS pra faturamento
