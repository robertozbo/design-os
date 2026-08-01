# Agenda Specification

## Overview
Agenda **multi-profissional** da clínica — o calendário compartilhado onde recepção e médicos veem, num só lugar, as consultas de **todos os médicos** e a ocupação das **salas**. É o 3º pilar do produto Clínica: diferente do consultório individual, aqui há disputa por horários, salas e recursos entre várias especialidades. Visão em colunas por **médico** ou por **sala**, com blocos de consulta posicionados por horário, presencial + teleconsulta no mesmo grid.

**Ela é ferramenta de coordenação, não a lista de trabalho do médico.** Mostra a clínica inteira para qualquer persona, de propósito: é assim que se enxerga disputa de horário, de sala e de recurso entre especialidades. O recorte "as minhas consultas de hoje" vive no **Início**, que é o dashboard de trabalho do médico — por isso a Agenda não tem toggle "Meus/Todos" como Pacientes tem. Recepção agenda para qualquer médico; o médico agenda para si e consulta o dia da clínica.

## User Flows

### Ver o dia
- Recepção/médico abre Agenda → **visão diária** com uma coluna por médico (default) ou por sala (toggle)
- Navega entre dias (‹ ›, "Hoje"); o grid mostra horários (07h–19h) e blocos de consulta coloridos por **especialidade**
- Cada bloco: horário, paciente, especialidade, modalidade (presencial/tele) e **status** (pendente, confirmado, realizado, cancelado, faltou)
- Legenda de status + especialidades no topo

### Alternar médico ↔ sala
- Toggle "Médicos | Salas": na visão Salas cada coluna é um consultório/recurso, revelando conflito/ocupação
- Cada consulta ocupa **médico + sala** — a mesma consulta aparece na coluna do médico e na coluna da sala

### Detalhe / ação numa consulta
- Clicar num bloco abre drawer com: paciente, especialidade, status, horário, médico, sala/modalidade,
  observação, marca de **série recorrente** e de **retorno de cortesia**
- Quando há cobrança, o drawer mostra o bloco **Cobrança**: total, modelo, nº de parcelas, forma de
  pagamento e cada conta com vencimento, valor e marca de "pago"
- Ações: confirmar, marcar realizado/faltou, cancelar; **editar** (lápis no topo) reabre o wizard
- Teleconsulta mostra botão "Entrar na sala de vídeo"

### Novo agendamento — wizard de 4 etapas
Botão "+ Novo agendamento" (recepção agenda para qualquer médico; médico para si). Drawer com
stepper; só é possível voltar a etapas já visitadas.

1. **Identificação** — seleção no **pool de pacientes** da clínica (não há nome livre: paciente novo
   se cadastra antes, e é dele que vem o convênio), **serviço** (do cadastro; define
   preço de tabela e duração), profissional e modalidade (presencial/teleconsulta; tele dispensa sala)
2. **Data do agendamento** — data, duração, recorrência, sala e grade de horários do dia escolhido
3. **Financeiro** — gerar cobrança (on/off), modelo, **convênio**, forma de pagamento, parcelas, dia
   de vencimento e o resumo editável das parcelas. O valor **não se digita**: é calculado.
4. **Confirmação** — revisão de tudo, incluindo a lista das contas a receber que serão criadas

### Serviço, preço e convênio
- O **cadastro de Serviços é a fonte única**: a agenda não tem lista própria de procedimentos.
  Cada serviço traz `preco` (tabela) e `duracaoMin`.
- Escolher o serviço preenche a duração e reposiciona o fim da consulta; a duração continua editável.
- **O preço é calculado, nunca digitado**: `valor = preço de tabela × (1 − desconto do convênio)`.
  A etapa Financeiro mostra a conta aberta — tabela, desconto e valor final.
- O convênio vem do paciente selecionado e pode ser trocado. `Particular` = desconto 0 (tabela cheia).
- Sem serviço (encaixe/bloqueio) não há preço de tabela e **não se gera cobrança**.
- A `descricao` da conta a receber é o **nome do serviço** (com sufixo só quando há mais de uma conta:
  `· parcela i/N` ou `· sessão i/N`), o que a mantém alinhada ao catálogo usado em Contas a Receber.

### Retorno de cortesia
- Checkbox "Agendar retorno" com prazo (15/30/60/90 dias), disponível só ao criar
- O retorno é criado a partir da **última** sessão da série, no mesmo horário, usando o serviço
  "Retorno" do cadastro, e **nasce sem cobrança** (`retornoDe` aponta a consulta de origem)
- O retorno usa a **duração do serviço "Retorno"**, não a da consulta de origem
- Se o horário do retorno estiver ocupado, a etapa Data e a Confirmação já avisam, e o toast informa
  que ele não foi criado — ele nunca é contado junto das consultas puladas da série
- Ele não entra na contagem de "consultas agendadas" nem recebe `serieId`

### Recorrência
- `Não repetir` (default), `Semanal`, `Quinzenal` ou `Mensal` + campo **"Repetir (vezes)"** (2–52)
- A etapa Data mostra os chips com as datas da série; ocorrências que colidem aparecem **riscadas
  em vermelho** e são **puladas** ao salvar (nunca sobrescrevem consulta existente)
- Salvar cria uma consulta por data válida; todas compartilham `serieId` (= id da 1ª ocorrência)
- Se **todas** as datas colidirem, nada é criado e o toast explica

### Cobrança gerada pelo agendamento
Quando "gerar financeiro" está ligado, o agendamento carrega `financeiro` com o valor, a forma de
pagamento, o modelo, o nº de parcelas e as **contas** já com vencimento e valor. O modelo de cobrança
define **o que `valor` significa** — é o que separa os três:

| Modelo | `valor` é | Contas geradas | Vencimento |
|---|---|---|---|
| **Por sessão** | preço de **uma** consulta | uma por sessão da série (ou as parcelas, se for consulta única) | dia da própria sessão |
| **Mensal** | a **mensalidade** | uma por mês, independente do nº de sessões | dia de vencimento escolhido |
| **Pacote** | o **total fechado** | as parcelas do total | dia de vencimento escolhido |

> Como o preço vem sempre do cadastro, **Mensal e Pacote exigem um serviço cujo preço já seja a
> mensalidade ou o total fechado** (ex.: "Pacote mensal (4 sessões) · R$ 720"). Não existe campo para
> digitar um total avulso — quem define pacote é o cadastro de Serviços. A etapa Financeiro avisa isso
> quando o modelo não é "Por sessão".

- **Por sessão é o caso comum** (pay-per-visit): uma série de 4 sessões a R$ 300 gera 4 contas de
  R$ 300 vencendo nas datas das sessões, não uma de R$ 300. Assim faltar ou cancelar uma sessão mexe
  só na conta dela, o repasse por médico fecha por atendimento realizado e a inadimplência aponta a
  consulta específica. Nesse modelo o campo **Parcelamento fica indisponível** — cada consulta já é
  uma cobrança.
- **Sessões que serão puladas por conflito não geram conta** — o total prometido na Confirmação é o
  que será cobrado de fato.
- Distribuição na série: **por sessão**, cada ocorrência leva a conta correspondente **pela posição**;
  **mensal** e **pacote** cobram a série toda e ficam só na 1ª ocorrência criada. Sessões puladas por
  conflito não geram conta.
- As parcelas são regeradas a cada avanço de etapa sempre que algum campo que define a cobrança
  mudou (serviço, convênio, modelo, parcelas, dia de vencimento, data, recorrência). Enquanto esses
  campos não mudam, edições manuais de vencimento e "pago" são **preservadas**.
- Sem valor não há cobrança: encaixe sem serviço **não** cria conta de R$ 0,00 (nem promete uma na
  confirmação). O serviço é **opcional** — encaixe/bloqueio passa pelo wizard sem escolher serviço.
- Numa série, cada ocorrência recebe a conta **pela sua posição** na série, não pela data — assim
  editar um vencimento à mão não faz a conta se perder.
- Ao regenerar as parcelas, o que já estava marcado como **pago é preservado**: remarcar uma consulta
  quitada não reabre a conta.
- Em Mensal/Pacote o vencimento nunca cai **antes** da consulta — se o dia escolhido já passou no mês
  do atendimento, rola para o mês seguinte.
- **A implementação deve criar uma linha em Contas a Receber para cada `ContaAgendamento`**, com
  `tipo: 'receber'`, `contraparte` = paciente e `metodo` = forma de pagamento. Agenda e Contas a
  Receber são sections independentes: o protótipo entrega o contrato, não o efeito cross-section.

**Duas políticas que a implementação precisa definir** (fora do escopo do protótipo):
no-show cobra ou isenta a conta da sessão faltada; e, em convênio, a contraparte da conta é a
operadora e não o paciente — no V1 convênio é só tracking textual.

### Validação de conflito
- Conflito = mesmo **dia** + horário sobreposto + mesmo médico (ou mesma sala, quando presencial)
- Consultas canceladas não ocupam horário; o agendamento em edição não conflita consigo mesmo
- Horários ocupados aparecem desabilitados na grade; se a seleção passar a conflitar (ao trocar
  data, médico ou duração), um **banner nomeia o conflito** e bloqueia o avanço

## UI Requirements

### Layout
- **Header**: data (dia da semana + data) com ‹ ›/"Hoje" à esquerda; toggle Médicos/Salas + "+ Novo agendamento" (teal) à direita
- **Legenda**: chips de status (cores) e de especialidade
- **Grid**: coluna de horários sticky à esquerda; colunas de recursos (médicos ou salas) com cabeçalho (avatar + nome + especialidade / nome da sala); linhas por hora; **blocos posicionados por início/fim**
- Bloco: borda/accent por especialidade, opacidade reduzida para cancelado/faltou, ícone de tele; hover destaca
- **Drawer** de detalhe à direita

### Estados & regras
- Cancelado/faltou: visual esmaecido + badge
- Conflito (mesmo médico ou sala sobrepostos): destaque de alerta
- Vazio: coluna sem consultas mostra o grid limpo
- O grid é de **um dia só**: agendamentos criados para outra data continuam no estado e são
  filtrados fora da grade, com o toast informando em que dia caíram

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Independente de `sections-clinico`
- Cores de especialidade consistentes com o Prontuário (endo=teal, cardio=rose, nutro=violet, geral=sky)
