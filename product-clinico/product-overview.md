# Nymos Clínico

## Description
Nymos Clínico é o módulo médico vertical da suíte Nymos — um SaaS para consultório de **endocrinologia** operado por 1 médico + 1 secretária, com app mobile do paciente integrado. Substitui caderneta + WhatsApp + planilha + sistema de prontuário fragmentado por uma plataforma única, com **IA como copiloto clínico** (escriba que estrutura SOAP a partir da consulta + apoio à interpretação de exames com comparação histórica), prescrição digital via Memed e teleconsulta nativa. Respeita rigorosamente LGPD (dados sensíveis Art. 11) e ética médica brasileira (CFM 2.299/2021, 2.314/2022, Parecer 02/2024). Compartilha o ecossistema Nymos com Nutri, Personal e Psicólogo (V3) — paciente pode ser atendido por múltiplos profissionais Nymos com vínculos paralelos, mas dados de cada vertical ficam em silos rígidos por padrão.

## Problems & Solutions

### Problem 1: Consulta vira datilografia em vez de escuta
Endocrinologista passa metade do tempo de consulta digitando anamnese e evolução em vez de olhar pro paciente. Em jornada de 8h, são 2h de digitação. Nymos Clínico embute **escriba IA**: o áudio da consulta (com consentimento do paciente) é transcrito e estruturado em formato SOAP automaticamente; o médico revisa e assina.

### Problem 2: Exames laboratoriais ficam parados em PDFs sem comparação
Paciente endócrino tem TSH, T4, HbA1c, glicemia, vit D recorrentes — mas cada laudo vira um PDF estático. Sem comparação ao longo do tempo, o médico perde tendência. Nymos centraliza exames recebidos pelo app, extrai valores numéricos e mostra **comparação histórica + IA de apoio à interpretação** (resumo do laudo, cruzamento com queixa atual e medicações em uso).

### Problem 3: Prescrição contínua é fricção mensal
Levotiroxina, Metformina, GLP-1, insulina — pacientes crônicos precisam renovar receita repetidamente. Receita em papel + WhatsApp + foto é caótico. Nymos integra **Memed** (prescrição com validade ICP-Brasil): médico prescreve em segundos, paciente recebe direto no app, farmácia aceita.

### Problem 4: Acompanhamento entre consultas é cego
Paciente diabético deveria registrar glicemia caseira diária, paciente em manejo de obesidade deveria pesar regularmente — mas esses dados ficam em apps avulsos ou não acontecem. **Diário do paciente** no app captura peso, glicemia, pressão; o médico vê tendência longitudinal antes da próxima consulta.

### Problem 5: Adesão a medicação é invisível
Médico prescreve, paciente esquece, ninguém sabe. Nymos gera **lembretes de medicação** a partir da prescrição Memed e registra status (cumprido/perdido) — fechando o loop **prescrição → execução → adesão**.

### Problem 6: Secretária + médico precisam dividir agenda sem misturar conteúdo clínico
Hoje a secretária ou tem acesso ao prontuário inteiro (ruim pra LGPD) ou usa um sistema separado da agenda (ruim de operação). Nymos resolve com permissões fixas: secretária faz tudo o que é operacional (agenda, cadastro, cobrança, mensagem administrativa) **sem ver nada clínico**.

### Problem 7: Telemedicina precisa ser nativa, não link externo
Pacientes endócrinos crônicos têm muitos retornos curtos (ajuste de dose, validação de exame) — perfeitos pra teleconsulta. CFM 2.314/2022 permite. Nymos embute **sala de vídeo + termo de consentimento + gravação opcional** integrados ao prontuário.

### Problem 8: Faturamento de convênio é um produto separado — não pode travar o V1
TUSS, SADT, glosa, recurso são um sistema gigante. Nymos V1 entrega cobrança particular completa (PIX/cartão) e **convênio como tracking textual** (Unimed/Bradesco/Amil); faturamento sério fica V2+.

### Problem 9: Paciente Nymos pode ter múltiplos profissionais — dados precisam respeitar consentimento
Maria é atendida por Dra. Ana (nutri) e Dr. Pedro (endócrino). Os dois deveriam ver dados relevantes do mesmo paciente — mas isso é dado sensível (LGPD Art. 11) e exige consentimento granular. Nymos V1 mantém **silos rígidos entre verticais**: cada profissional só vê dados do próprio vínculo. Compartilhamento entre verticais é V2+ com consentimento explícito.

## Key Features
- Agenda compartilhada médico/secretária com presencial + teleconsulta no mesmo calendário
- Cadastro de paciente, convite por código (vinculação ao app), histórico clínico
- Tela de Consulta com escriba IA — gravação, transcrição, SOAP estruturado, médico revisa e assina (click-to-attest no V1, ICP-Brasil V2)
- Prontuário com anamnese estruturada (template endócrino: queixa, HMA, antecedentes, medicações em uso, exame físico) + evolução SOAP + timeline + exportação PDF
- Recebimento de exames pelo paciente (PDF + imagem JPG/DICOM); valores numéricos estruturados (HbA1c, TSH, glicemia, T4) com comparação histórica
- IA de apoio à interpretação de exames (resumo do laudo, comparação histórica, cruzamento com queixa) — não faz laudo, não é SaMD
- Prescrição digital integrada ao Memed (validade ICP-Brasil, paciente recebe no app)
- Teleconsulta embutida (vídeo + termo de consentimento) ligada à agenda e ao prontuário
- Diário do paciente — peso, glicemia caseira, pressão (gráficos longitudinais)
- Lembretes de medicação derivados da prescrição com status cumprido/perdido
- Mensageria com **dois canais separados**: admin (paciente↔secretária) e clínico (paciente↔médico); secretária só vê admin
- Cobrança particular (link PIX/cartão antes ou depois da consulta) + tracking textual de convênio
- Central de consentimentos LGPD do paciente (tutela da saúde, IA escriba, IA apoio exame, teleconsulta)
- Audit log de toda leitura de prontuário e toda inferência de IA (transparência regulatória)
- Multi-vinculação Nymos: paciente vê os profissionais Nymos a que está vinculado em tracks separadas (verticais como silos por padrão)
- Flag de transparência no prontuário: cada nota assinada registra se foi gerada/assistida por IA, com modelo e versão
