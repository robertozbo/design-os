# Application Shell Specification — Psicólogo

## Overview
Sidebar persistente vertical à esquerda, agrupando as 7 sections do módulo psicólogo em três categorias funcionais: **Atendimento** (dia a dia clínico), **Clínico** (instrumentos e plano), **Operacional** (configurações). Plataforma desktop-primary com brand "Nymos · Psi" no topo da sidebar e user menu com avatar/dropdown no rodapé.

## Navigation Structure

**Atendimento**
- **Dashboard** → /psicologo/sections/dashboard
- **Pacientes** → /psicologo/sections/pacientes
- **Sessão** → /psicologo/sections/sessao

**Clínico**
- **Instrumentos** → /psicologo/sections/instrumentos
- **Plano terapêutico** → /psicologo/sections/plano-terapeutico
- **Prontuário** → /psicologo/sections/prontuario

**Operacional**
- **Configurações** → /psicologo/sections/configuracoes

> Items "Agenda" e "Mensagens" estão no roadmap mas ainda sem section própria — entram quando criadas.

## User Menu
- **Localização**: rodapé fixo da sidebar
- **Conteúdo**: avatar (foto ou inicial), nome, papel (ex: "Psicóloga · CRP 06/…"), chevron pra abrir dropdown
- **Dropdown** (abre acima): Configurações · Sair (destacado em rose)

## Layout Pattern
- **Sidebar fixa** 240px à esquerda · `bg-white dark:bg-slate-900` · borda direita `slate-200 / slate-800`
- **Brand** (topo): logo lockup teal "N" + "Nymos / Psi"
- **Nav** (meio, scroll interno): grupos com header em `text-[10px] uppercase tracking-wider` slate-400/500 · items com ícone lucide à esquerda
- **Item ativo**: fundo `bg-teal-500/10` + texto `text-teal-700 dark:text-teal-300` + font-medium
- **User menu** (rodapé fixo): separado por borda
- **Content**: ocupa o restante (`flex-1`), mantém estilo dark slate dos screen designs existentes

## Responsive Behavior
- **Desktop (`lg:` ≥ 1024px)**: sidebar persistente, sempre visível
- **Tablet / Mobile (< 1024px)**: sidebar vira drawer com overlay backdrop · botão hamburger fixo top-left abre · close button "×" dentro da sidebar · clique no backdrop fecha · navegação fecha o drawer automaticamente

## Design Notes
- Tokens aplicados: `teal` (primary, item ativo + brand), `slate` (neutral, fundos e texto), `coral` (accent, reservado pra calls de risco — não usado no shell)
- Light + dark mode via `dark:` variants em todos os elementos
- Componentes recebem dados/handlers só por props (portáveis): `navigationGroups`, `activeHref`, `user`, `onNavigate`, `onLogout`, `onProfileClick`
- Section screens não devem incluir nav própria — o shell cuida disso
