# Configurações da Clínica Specification

## Overview
O painel de administração do workspace da clínica para o **Admin/Gestor**. Concentra o que não é clínico nem financeiro do dia a dia: **dados cadastrais** da clínica (razão social, CNPJ, endereço, contato, logo), **plano & limites** (plano atual, quantos profissionais de quantos permitidos, gerenciar plano), **integrações** (Memed, Escriba IA, PIX/pagamentos, WhatsApp), **consentimentos LGPD** (templates ativos com versão/data) e o **audit log** recente (quem acessou/fez o quê, quando). Só Admin acessa. Página única em blocos (sem tab-rail) para leitura contínua. Todos os controles são mock (protótipo) e disparam toast.

## User Flows

### Revisar e editar dados da clínica
- Admin abre Configurações → vê nome, CNPJ, endereço, telefone e logo
- Campos parecem editáveis (inputs); "Salvar" dispara toast (mock)

### Conferir plano e limites
- Vê plano atual + uso de profissionais (X de maxProfessionals) com barra
- "Gerenciar plano" abre fluxo de billing (mock toast)

### Ligar/desligar integrações
- Cada integração é um card com toggle; alternar dispara toast
- Escriba IA mostra modelo + versão do transcritor/SOAP
- WhatsApp fica **ligado** e leva à section `agendamento-whatsapp`; a **IA no atendimento** é a linha V2 (desabilitada)

### Gerir consentimentos (LGPD)
- Lista de templates de consentimento (gravação de consulta, compartilhamento de prontuário entre médicos, uso de IA) com status ativo, versão e data
- "Ver termo" dispara toast (mock)

### Auditoria
- Bloco de audit log recente (autor + ação + alvo + quando) no estilo do Log de acesso do prontuário
- "Ver tudo" dispara toast (mock)

## UI Requirements

### Layout
- **Header**: "Configurações da clínica" + nome da clínica
- **Dados da clínica**: logo placeholder + inputs (nome, CNPJ, endereço, telefone) + "Salvar"
- **Plano & limites**: card com plano, uso de profissionais (barra X/max), "Gerenciar plano"
- **Integrações**: grid de cards, cada um com ícone, nome, descrição, toggle (Memed, Escriba IA c/ modelo+versão, PIX, WhatsApp c/ atalho pro bot; IA no WhatsApp V2 desabilitada)
- **Consentimentos (LGPD)**: lista com status (ativo), versão, data, "Ver termo"
- **Audit log**: linhas com avatar + autor + papel + ação + alvo + tempo relativo, "Ver tudo"

### Estados & regras
- Toggle: teal quando ligado, slate quando desligado; desabilitado fica esmaecido
- Status de consentimento: ativo = emerald; rascunho = amber
- Plano no limite (profissionais == max) destaca a barra em amber
- Datas/versões em pt-BR

## Design Notes
- Nymos (teal, DM Sans), light/dark em todas as cores, props-based, sem fetch interno
- Independente de `sections-doctor`
- Audit log reaproveita o visual do `AuditLogDrawer` do prontuário (autor + ação + timestamp)
- Toggle é componente controlado em Tailwind puro (sem lib externa)
