# Configurações Specification

## Overview
Hub de preferências do usuário acessado por Mais → Configurações. Inclui aparência (tema), idioma/região, notificações, privacidade, acessibilidade e informações sobre o app.

## User Flows

### Aparência
- Toque em "Aparência" expande inline picker de tema:
  - **Sistema** (default — segue o iOS/Android automaticamente)
  - **Claro** (force light theme)
  - **Escuro** (force dark theme — atual default Nymos)
- Mudança é persistida em userSettings (localStorage local + backend) e aplicada imediatamente.

### Idioma e Região
- Idioma: Português (Brasil) · Inglês · Espanhol
- Unidades: Métrico (kg, cm) · Imperial (lb, ft/in)
- Formato data: DD/MM/YYYY · MM/DD/YYYY · YYYY-MM-DD

### Notificações
- Toggles: Push · Email · Lembretes diários · Análises da IA · Profissional respondeu
- Cada toggle controla uma categoria backend.

### Privacidade
- Compartilhar dados anonimizados pra pesquisa: toggle
- Permitir IA usar meus dados: toggle (sempre on no Pro)
- Exportar meus dados (LGPD)
- Excluir conta

### Acessibilidade
- Reduzir movimento (animações)
- Alto contraste
- Texto maior

### Sobre
- Versão + build + ambiente
- Termos de Uso · Política de Privacidade · Licenças open source · Status do sistema

## UI Requirements
- Header sub-page "Configurações"
- Lista agrupada estilo iOS Settings (bg-slate-900 com bordas)
- Aparência expansível inline com 3 opções como chips
- Toggles iOS-style com cor teal
- Item "Excluir conta" em rose

## Configuration
- shell: true
