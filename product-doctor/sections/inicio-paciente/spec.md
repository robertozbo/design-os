# Início Paciente Specification

## Overview
Tela inicial do app mobile do paciente — primeira coisa que Maria vê ao abrir o Nymos. Concentra **próxima consulta**, **lembretes de medicação do dia**, **ações rápidas** (peso, glicemia, exame, receitas) e **profissionais Nymos vinculados** num feed scrollável vertical. Saudação contextual com dica do plano abre a tela. Mostra também placeholder pra outras verticais Nymos (V1 só endócrino vinculado), antecipando a experiência multi-profissional sem cruzar dados (silos rígidos).

## User Flows

### Abrir o app
- Paciente loga (já tem sessão) → Início é a tela default
- Saudação contextual: "Bom dia, Maria 👋" + dica do plano (ex: "Lembre de pesar antes do café")
- Topbar pequena com nome do app (Nymos), notificações, perfil

### Próxima consulta
- Card destaque com: data + hora + modalidade + médico + obs
- Se for ≤30min: botão grande "**Entrar na sala**" (tele) ou "**Confirmar presença**" (presencial)
- Se for hoje > 30min: badge "Hoje às 14:30" + botão "Detalhes"
- Se for futuro: data relativa "Em 3 dias" + opção de remarcar/cancelar
- Click abre detalhe da consulta (link pra section Agenda)

### Lembretes de medicação do dia
- Lista cronológica das doses do dia (não toda medicação, só as do dia)
- Cada lembrete: nome + dose + horário + status (cumprido / pendente / perdido)
- Toque longo ou check rápido marca como cumprido
- Skip: "Pular hoje" com motivo opcional
- Atrasado: highlight rose + botão "Marcar agora"

### Ações rápidas
- Grid 2×2 de botões grandes (touch-friendly, mín 64px de altura):
  - **Registrar peso** — abre input rápido (modal ou bottom sheet) com último valor pré-preenchido
  - **Registrar glicemia** — abre input numérico + tipo (jejum / 2h pós-refeição / aleatório)
  - **Enviar exame** — abre câmera/galeria pra upload (PDF ou foto)
  - **Ver receitas** — abre Memed embutido com prescrições ativas
- Toques disparam ação ou navegam pra fluxo correspondente

### Profissionais Nymos vinculados
- Card por profissional **vinculado**:
  - Avatar + nome + especialidade (Endocrinologia)
  - Resumo: "Próxima consulta: hoje" / "1 mensagem nova" / "Plano ativo"
  - Click abre track desse profissional
- **Placeholder** pra verticais não vinculadas:
  - "Você ainda não tem nutricionista vinculado"
  - Botão "Buscar nutri" (V2 — dispara fluxo de descoberta)
  - Mensagem clara que dados são silos: "Cada profissional vê só o que é dele"

### Status do dia (sutil)
- Mini-banner no topo do feed (não-destaque): "1 mensagem nova com Dr. Pedro" → click abre Mensagens

## UI Requirements

### Layout mobile-first
- Container `max-w-md mx-auto` simulando viewport mobile (375-430px)
- Padding generoso (`px-4 py-6`)
- Scroll vertical único, sem stickys complexos
- **Bottom-nav** (faz parte do shell paciente, não dessa section): Início · Agenda · Diário · Mensagens · Perfil

### Topbar
- Logo Nymos (pequeno, esquerda) + ícone sino com badge (1 não-lida) + avatar do paciente (link pra Perfil)
- Altura ~56px

### Saudação
- "Bom dia, Maria 👋" — text-2xl semibold
- Dica em text-sm text-slate-500 abaixo

### Próxima consulta — card
- Card destacado com gradient sutil teal→white (ou dark equivalent)
- Data/hora grande, modalidade com ícone, médico
- Botão CTA grande no rodapé do card (largura quase total)
- Se "agora": pulsing ring teal pra chamar atenção

### Lembretes de medicação
- Card section com título "Hoje (4)"
- Lista vertical com items
- Cada item: ícone tipo medicação + nome + dose | horário | check button (large touch target)
- Cumprido: opacidade reduzida + check teal
- Atrasado: borda rose + texto rose

### Ações rápidas
- Section com título "Ações rápidas"
- Grid 2×2, gap pequeno (~12px)
- Cada botão: ícone grande no topo + label abaixo, ~96px altura
- Toque ativo escala leve (`active:scale-95`) pra feedback tátil

### Profissionais
- Section "Seus profissionais"
- Lista vertical de cards
- Card vinculado: avatar gradient + info + status do dia + chevron
- Card placeholder: dashed border, ícone outline, texto + botão (V2)

### Cores e tons
- Mesma paleta Nymos (teal primário, slate neutro)
- Tom mais "amigável" que web médico — gradients sutis, ilustração ocasional
- Dark mode integrado

### Acessibilidade
- Touch targets mín 44×44px (botões 48-56px)
- Texto mín 14px (16px corpo)
- Contraste AA
- Cada lembrete tem aria-label descritivo

### Performance
- Skeleton loaders nos cards
- Animação de fade-in stagger no primeiro load (suave, ~150ms total)

## Configuration
- shell: true
