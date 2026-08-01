# Nymos Clínica — Product Overview

## Resumo

Nymos Clínica é o módulo vertical para **clínicas médicas multi-especialidade** da suíte Nymos —
vários médicos de especialidades diferentes operando sob um mesmo CNPJ, com **pool compartilhado de
pacientes**, gestão de equipe/salas, faturamento agregado e app mobile do paciente integrado.

Diferente do **Nymos Clínico** (consultório de 1 médico + secretária), aqui o paciente pertence à
**clínica**: qualquer médico autorizado atende e vê o prontuário sob **controle de acesso granular +
audit log** (LGPD Art. 11). IA entra como copiloto clínico, prescrição via Memed e teleconsulta,
coordenados entre múltiplos profissionais.

**Escopo do V1:** clínica multi-especialidade sob 1 CNPJ, pool compartilhado de pacientes com
controle de acesso. Faturamento de convênio (TUSS/SADT/glosa), assinatura ICP-Brasil na evolução e
multi-unidade ficaram para V2.

## Personas

| Persona | Plataforma | O que vê |
|---|---|---|
| **Médico** | Web | Fluxo clínico centrado no paciente; a própria agenda; prontuário compartilhado sob escopo |
| **Admin/Gestor** | Web | Gestão e dinheiro. **Nunca** vê conteúdo clínico |
| **Recepção** | Web | Operacional puro: agenda, cadastro, cobrança, canal admin. **Sem** prontuário/exame/prescrição |
| **Paciente** | Mobile | Agenda, medicação, diário, mensagens, perfil |

O RBAC é fixo no V1 e **não é cosmético**: a separação entre canal clínico e canal administrativo, e
o bloqueio de conteúdo clínico para admin/recepção, são requisito de LGPD, não preferência de UI.

## Problemas que o produto resolve

1. **Paciente é da clínica, mas o sistema trata como "de um médico só"** — prontuários fragmentados
   forçam o paciente a recontar o histórico a cada especialidade. Aqui o vínculo é com a clínica.
2. **Compartilhar prontuário sensível sem virar terra-de-ninguém** — escopo por papel + por vínculo
   ativo, com toda leitura e toda inferência de IA auditadas.
3. **Agenda de vários médicos com salas limitadas** — calendário único por médico/sala/especialidade.
4. **Gestor sem visão do negócio** — papel de Admin com faturamento agregado e relatórios, sem tocar
   em dado clínico.
5. **Encaminhamento entre especialidades por WhatsApp** — encaminhamento interno rastreado, com
   contexto clínico sob consentimento.
6. **Recepção precisa operar sem enxergar o clínico** — RBAC operacional e canais separados.
7. **Consulta vira datilografia, multiplicada por N médicos** — escriba IA (áudio com consentimento
   → SOAP), o médico revisa e assina.
8. **Exames e prescrição presos a um profissional** — centralizados no prontuário compartilhado.
9. **Faturamento de convênio travaria o V1** — V1 entrega cobrança particular com repasse por
   médico; convênio é tracking textual.

## Entidades

Definidas em `data-shapes/`. As centrais:

- **Clinic** — o workspace multi-especialidade sob um CNPJ (plano, limites, configurações)
- **Professional** — médico da clínica (especialidade, CRM, status)
- **Membership / Role** — vínculo de uma pessoa à clínica e seu papel (Admin, Médico, Recepção)
- **Patient** — pertence à Clinic, não a um médico; pode ter conta no app ou ser só cadastro
- **CareLink** — vínculo ativo Patient↔Professional; governa, junto com Role, o acesso ao prontuário
- **Appointment** — Patient + Professional + Room + horário + tipo + status

## Design System

**Cores** (Tailwind): primary `teal` · secondary `emerald` · accent `coral` · neutral `slate`

**Tipografia**: headings e corpo em **DM Sans**; monoespaçada **IBM Plex Mono**

Detalhes e como configurar em `design-system/`.

## O cenário dos dados de exemplo

Todas as sections rodam na mesma clínica fictícia — **Clínica Nymos · Vila Mariana** — com um único
corpo clínico e um pool de 22 pacientes compartilhado. A médica logada é a **Dra. Helena Prado**
(Endocrinologia).

Isso importa na leitura das telas: quando você vê Marcos Vinícius Lima na Agenda, em Exames e em
Contas a receber, é o mesmo paciente. Os dados foram unificados justamente para que as telas possam
ser lidas como um sistema, e não como maquetes independentes.

## Sequência de implementação

Cada milestone tem um documento em `instructions/incremental/`.

1. **Shell** — tokens de design e os shells por persona
2. **Início (médico)** · 3. **Visão geral (gestão)** · 4. **Equipe** · 5. **Salas & recursos**
6. **Agenda** · 7. **Pacientes** · 8. **Consulta** · 9. **Prontuário compartilhado**
10. **Acompanhamento** · 11. **Atendimentos** · 12. **Exames** · 13. **Prescrição**
14. **Encaminhamento interno** · 15. **Mensagens** · 16. **Cobrança** · 17. **Faturamento**
18. **Contas a receber** · 19. **Contas a pagar** · 20. **Serviços** · 21. **Tipos de conta**
22. **Fornecedores** · 23. **Relatórios** · 24–26. **Configurações** · 27. **Perfil**

A ordem importa até o milestone 9: Agenda depende de Salas e Serviços para duração e valor, e
Consulta depende de Pacientes. Do 16 em diante o grupo Financeiro pode ir em qualquer ordem, com uma
ressalva: **Serviços** e **Tipos de conta** são cadastros-mãe — Contas a receber puxa valor de
Serviços, Contas a pagar puxa categoria de Fornecedores.
