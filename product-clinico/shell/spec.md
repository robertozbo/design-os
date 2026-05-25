# Application Shell Specification — Nymos Clínico

## Overview

Nymos Clínico tem **3 shells distintos por persona**, refletindo plataforma e nível de acesso:

1. **Médico (web)** — side-nav vertical, foco em fluxo clínico do dia
2. **Secretária (web)** — side-nav vertical, escopo operacional reduzido (sem acesso clínico)
3. **Paciente (mobile)** — bottom-nav, otimizado pra uso casual no celular

Os três shells compartilham a identidade visual Nymos (logo, paleta teal, DM Sans), mas a estrutura de navegação é específica por persona pra refletir as permissões fixas do V1.

## Personas e Navegação

### Médico (web — side-nav)

Side-nav vertical à esquerda (240px expandida), rodapé com user menu (avatar + dropdown).

Nav items (5):
- **Início** → `/clinico/sections/inicio` — agenda do dia + alertas (mensagens não lidas, exames novos pra revisar, pacientes do dia)
- **Agenda** → `/clinico/sections/agenda` — calendário compartilhado
- **Pacientes** → `/clinico/sections/pacientes` — lista; abrir paciente revela **tabs internas** (Resumo, Prontuário, Exames, Prescrição, Consulta, Financeiro)
- **Mensagens** → `/clinico/sections/mensagens` — canal clínico (com paciente) — separado do canal admin da secretária
- **Configurações** → `/clinico/sections/configuracoes-medico` — perfil, integrações (Memed, vídeo, IA), consentimentos LGPD, audit log, convite secretária

> **Por que Prontuário/Exames/Prescrição/Consulta NÃO são top-level:** fluxo do médico é centrado no paciente. Ele abre o paciente e navega entre as facetas dele. Top-level seria duplicar entrada e perder contexto do paciente ativo.

> **Por que Cobrança NÃO está no nav do médico:** operação financeira é da secretária. Médico vê resumo financeiro do paciente dentro de Pacientes (aba "Financeiro") e widget de receita do dia na Home — não opera cobrança.

### Secretária (web — side-nav)

Mesmo padrão visual do médico, mas com escopo reduzido e **abre direto em Agenda** (sem Início).

Nav items (5):
- **Agenda** → `/clinico/sections/agenda` — calendário (mesma visão do médico, mas sem campo clínico)
- **Pacientes** → `/clinico/sections/pacientes` — só dados admin (nome, contato, convênio, financeiro). **Sem prontuário, exames, prescrição, consulta**.
- **Mensagens** → `/clinico/sections/mensagens` — canal admin (com paciente). Não vê canal clínico.
- **Cobrança** → `/clinico/sections/cobranca` — links PIX/cartão, recibos, histórico, tracking textual de convênio, export CSV
- **Configurações** → `/clinico/sections/configuracoes-secretaria` — perfil próprio (sem acesso a config do consultório)

Visual differentiator: badge "Secretaria" no logo (vs "Clínico" no médico) e ícones com cor levemente diferente (slate em vez de teal nos ativos) — não confundir personas.

### Paciente (mobile — bottom-nav)

Bottom-nav fixa no rodapé do mobile (5 itens), com header simples no topo (logo + ícone de notificações). Sem side-nav.

Bottom-nav items (5):
- **Início** → `/clinico/paciente/inicio` — próxima consulta, ações rápidas (registrar peso/glicemia, conversar com médico), lembretes de medicação do dia
- **Agenda** → `/clinico/paciente/agenda` — próximas consultas (presencial + tele), histórico, agendar/cancelar
- **Diário** → `/clinico/paciente/diario` — peso, glicemia, pressão (registro + gráficos)
- **Mensagens** → `/clinico/paciente/mensagens` — 2 threads visíveis: **Clínico** (com Dr. Pedro) e **Admin** (com secretária)
- **Perfil** → `/clinico/paciente/perfil` — dados pessoais, profissionais Nymos vinculados (multi-vinculação), consentimentos LGPD, medicações ativas, exames enviados, configurações de notificação, logout

> **Por que "Perfil" absorve user menu:** mobile não tem espaço pra avatar+dropdown no header. Tudo de "minha conta" entra na aba Perfil.

> **Por que NÃO tem "Prescrição" ou "Exames" como tab:** paciente vê receita ativa em "Início" (cards) e detalhe dentro de Perfil > Medicações. Exames são enviados via ação rápida em Início ou via Mensagens. Não precisam de tab top-level.

## Layout Pattern

### Web (Médico + Secretária)
- Sidebar fixa à esquerda, 240px de largura
- Rodapé da sidebar: user menu (avatar + nome + role; dropdown com "Configurações" e "Sair")
- Topo da sidebar: logo Nymos + badge da vertical ("Clínico" pra médico, "Secretaria" pra secretária)
- Conteúdo à direita, scroll próprio
- Em telas < 1024px: sidebar vira drawer (hamburger no topo esquerdo)

### Mobile (Paciente)
- Header fixo no topo (56px): logo + ícone de notificações com badge
- Bottom-nav fixa no rodapé (64px): 5 ícones + label
- Conteúdo entre os dois, scroll interno
- Safe area respeitada (iOS notch + Android nav bar)
- Tema escuro/claro segue preferência do sistema

## Responsive Behavior

- **Desktop (≥1024px):** Web personas com sidebar expandida; mobile preview com viewport simulado
- **Tablet (768–1023px):** Web personas com sidebar colapsável (drawer); mobile fica em coluna estreita centralizada
- **Mobile (<768px):** Web personas vão pra hamburger drawer (lateral); paciente mobile usa toda a largura

## Design Tokens Aplicados

- **Cor primária:** teal-500 (ativo no nav, badge, logo)
- **Cor secundária:** emerald (success, status confirmado)
- **Cor accent:** coral (alertas leves)
- **Neutros:** slate (50–950 — backgrounds, textos, bordas)
- **Tipografia:** DM Sans em todo o shell (peso 400/500/600/700)
- **Mono:** IBM Plex Mono pra dados numéricos densos (timestamps, IDs)

## Design Notes

- **Nada de autenticação no shell** — login está fora de escopo (assume usuário já autenticado)
- **Audit log de leitura** acontece nas sections clínicas, não no shell
- **Multi-vinculação Nymos** (paciente vê outros profissionais Nymos) entra na aba Perfil do paciente, não no shell global
- **Notificações:**
  - Médico/Secretária: ícone de sino no topo da sidebar (acima do user menu) — V2; no V1 alertas viram no Início
  - Paciente: ícone no header mobile
- **Three shells, one component package:** os shells web compartilham o mesmo `AppShell`; só `NAV_GROUPS` e `user` mudam. Mobile do paciente tem componentes próprios (`MobileShell`, `MobileBottomNav`) por padrão de UI radicalmente diferente.
- **Logo Nymos com badge da vertical:** no clínico = "Clínico". Em outros módulos Nymos = "Psi", "Nutri", "Personal". Pacote `shell-clinico` define só "Clínico".
