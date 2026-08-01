# Consulta Specification

## Overview
Tela de atendimento do médico endocrinologista, suportando consultas presenciais e teleconsultas no mesmo fluxo. Tem como diferencial o **escriba IA**: durante a consulta, áudio é transcrito e estruturado em formato SOAP automaticamente; o médico revisa, edita e assina (click-to-attest no V1). Inclui contexto longitudinal do paciente (medicação ativa, últimos exames, evoluções anteriores), prescrição via Memed embutido, e fluxo pós-consulta integrado (agendar retorno, enviar resumo, cobrar).

## User Flows

### Pré-consulta (paciente pré-preenche no app)
- Paciente recebe notificação 24h antes pra responder anamnese estruturada (queixa principal, sintomas, medicação atual, dúvidas)
- Respostas chegam pré-preenchidas na aba "Anamnese" da tela do médico

### Iniciar consulta (médico)
- Médico abre paciente da agenda do dia
- Clica "Iniciar consulta"
- Se primeira consulta com escriba IA, paciente assina termo de consentimento de gravação (uma vez por paciente — depois fica aceito)
- Se teleconsulta, sala de vídeo abre lateralmente; se presencial, indicador "presencial" no header
- Botão "▶ Gravar" inicia captura de áudio

### Durante consulta
- Estado da gravação visível: `idle` | `preparando` | `gravando` | `pausado` | `encerrado`
- Transcrição aparece em tempo real (texto bruto da fala)
- IA estrutura em SOAP em background; bloco aparece quando pronto
- Médico pode pausar/retomar gravação a qualquer momento
- Painel direito de contexto sempre visível e acessível sem sair da tela

### Edição do SOAP (inline)
- SOAP gerado pela IA aparece já editável nos 4 blocos: **S**ubjective, **O**bjective, **A**ssessment, **P**lan
- Médico clica em qualquer trecho e edita inline
- Cada bloco mostra indicador visual de "alterado pela IA → editado por você"
- Diff é registrado no audit log (versão IA vs versão final)

### Prescrição (durante ou ao final)
- Aba "Prescrição" abre Memed embutido
- Receita é vinculada à consulta atual
- Após emitir, aparece em "Prescrição" + na tela do paciente

### Pós-consulta
- Botão **"Assinar e fechar"** registra: timestamp, médico assinante, flag "gerado/assistido por IA" + modelo + versão, audit log
- Modal de fechamento oferece **3 ações opcionais** marcáveis:
  - **Agendar retorno** — sugere data baseada no Plan da SOAP (ex: "retorno em 3 meses"); abre mini-form de agendamento
  - **Enviar resumo pro paciente** — gera resumo do plano + medicações ativas e envia no canal clínico
  - **Cobrar** — se a consulta não foi paga antes, dispara link de cobrança automático
- Após confirmar, retorna pra Agenda do médico

## UI Requirements

### Layout
- **2 colunas com tabs** no painel central
  - Tabs: **Anamnese** · **SOAP** · **Prescrição** · **Laboratório** · **Imagens**
  - **Laboratório** e **Imagens** são separados (decisão UX): atividades cognitivas distintas — olhar números (HbA1c, TSH, lipidograma) vs. olhar figuras (raio-X, USG, RM)
  - Tab ativa por padrão na entrada: **Anamnese** (pra revisar pré-preenchimento) ou **SOAP** (se já passou da fase inicial)
- **Painel direito fixo de contexto** (~320px) sempre visível
- **Header da tela** mostra: nome + idade + condições crônicas do paciente; modalidade (presencial/tele); status da gravação; tempo decorrido; botão "Pausar"; botão "Encerrar"

### Painel de contexto (direita, scroll independente)
1. **Identificação do paciente** — nome, idade, condições crônicas (DM2, Hipotireoidismo, etc.), data da última consulta
2. **Medicação ativa** — lista derivada de prescrições Memed; mostra nome + dose; ícone de status de adesão se houver dado do diário
3. **Últimos exames (laboratório)** — top 3 laboratoriais; cada um com valores-chave (HbA1c, TSH, glicemia) e mini-gráfico de tendência (sparkline); clique abre detalhe
4. **Imagens recentes** — top 2-3 exames de imagem (raio-X, USG, RM); cada um com thumbnail anatômico + destaque do achado + cor de significância (normal/atenção/crítico); clique abre viewer
5. **Evoluções anteriores** — 3 evoluções mais recentes em formato compacto: data + plano resumido (1-2 linhas)

### Estados da tela
- **Pré-consulta** — tab Anamnese ativa, painel de contexto preenchido, botão "Iniciar consulta" em destaque
- **Em consulta (gravando)** — header com tempo + indicador vermelho pulsante; tabs habilitadas; transcrição visível na tab SOAP
- **SOAP gerado** — tab SOAP em destaque com badge "Novo conteúdo IA"; blocos editáveis
- **Encerrada (não assinada)** — gravação desabilitada; SOAP totalmente editável; botão "Assinar e fechar" em destaque
- **Assinada** — read-only; tela vira modo de visualização da consulta; permite reabrir agendamento e ações pós-consulta

### Teleconsulta
- Quando modalidade = `tele`, sala de vídeo aparece em modal flutuante redimensionável (canto inferior direito por padrão)
- Botão de "Entrar na sala" no header se sala ainda não foi aberta
- Indicador de "Paciente conectado" / "Aguardando paciente"
- Vídeo segue o médico se ele rolar a tela; pode ser minimizado pra ícone

### Transparência IA (LGPD/CFM)
- Todo bloco gerado pela IA tem **badge "IA"** com tooltip explicando: modelo, versão, momento da geração
- No SOAP final, header diz: "Esta evolução foi gerada/assistida por IA e revisada por Dr. [Nome]"
- Audit log invisível mas acessível via Configurações → Histórico de IA (link no badge)

### Acessibilidade & atalhos
- Teclas de atalho: `Espaço` pausa/retoma gravação; `Ctrl+S` assina; `Tab` navega tabs
- Toda ação tem confirmação verbal (toast)
- Contraste AA mínimo

## Configuration
- shell: true
