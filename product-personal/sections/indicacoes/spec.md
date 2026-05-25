# Indicações Specification

## Overview
Gestão de convites para o aluno baixar o app Nymos e vincular conta com o personal — feature gated em **Plus**. Personal cadastra o aluno (em Alunos), depois envia convite por um dos 4 canais (link compartilhável, QR code, email automático ou SMS/WhatsApp via integração). A seção rastreia o ciclo: **Enviado → Aceito** (aluno baixou e vinculou) ou **Expirado** (30 dias sem ação) ou **Cancelado** (personal abortou). Não é programa de afiliados B2B — é só convite paciente↔personal.

## User Flows
- Listar convites com tabs por status: Pendentes · Aceitos · Expirados · Cancelados (cada uma com contador)
- Buscar por nome do aluno
- Filtrar adicional por canal (Link · QR · Email · SMS/WhatsApp)
- Ordenar por: mais recente, próximo a expirar, status
- Ver KPIs no topo: Total enviados, Aceitos no mês (com delta), Taxa de conversão %, Tempo médio até aceitar (dias)
- Criar novo convite: drawer com seleção de aluno (search da lista cadastrada que ainda NÃO tem app vinculado) + canal preferido + mensagem opcional + ação principal por canal
- Para canal "Link": gerar link único, mostrar com botão "Copiar" e "Compartilhar"
- Para canal "QR": gerar QR code grande na tela com label "Mostre pro aluno escanear"
- Para canal "Email": personal preenche email do aluno, sistema dispara email com botão de instalar
- Para canal "SMS/WhatsApp": personal preenche celular, sistema dispara mensagem (custo por envio mostrado)
- Reenviar convite (pendente ou expirado): regenera link + reenvia
- Copiar link novamente
- Cancelar convite pendente (com confirmação)
- Restaurar convite cancelado (gera novo)
- Abrir detalhe de convite aceito mostra tempo até aceitar + canal usado + atalho pra ficha do aluno
- Banner explicativo do gating Plus (se personal estiver no Free) com CTA upgrade

## UI Requirements
- Cabeçalho com título "Indicações", subtítulo "Convide alunos pra baixar o app Nymos e vincular ao seu acompanhamento", botão "+ Novo convite" (slate-900) à direita
- KPI strip (4 cards horizontais):
  - Total enviados (mono grande + label)
  - Aceitos no mês (mono grande + delta vs mês anterior com seta verde/vermelho)
  - Taxa de conversão (% mono grande + barra visual + label "aceitos / enviados")
  - Tempo médio até aceitar (dias mono grande + ícone clock)
- Tabs no topo (Pendentes · Aceitos · Expirados · Cancelados) com contador mono
- Search full-width abaixo das tabs (placeholder "Buscar por nome…")
- Linha de filtros: chips de canal (Todos · Link · QR · Email · SMS/WhatsApp) + sort dropdown
- Lista em cards (1 ou 2 colunas):
  - Card de convite **Pendente**:
    - Avatar + nome + contato (email ou tel)
    - Badge canal (com ícone do tipo)
    - Status timeline visual: enviado → pendente (com tempo "há X dias") → expira em Y dias (barra de progresso amber se < 7 dias)
    - Mensagem personalizada (se houver, italic)
    - Ações: Reenviar · Copiar link · Cancelar
  - Card de convite **Aceito**:
    - Avatar + nome + label "Vinculado ao app"
    - Badge canal
    - Stats: "aceitou em N dias" (mono) + data de vínculo
    - Ações: Ver ficha do aluno (link teal) · Mais (menu)
    - Visual mais "celebratório" (subtle emerald accent)
  - Card de convite **Expirado**:
    - Visual muted/opacity
    - Mensagem "Expirou em DD/MM sem ação"
    - Ações: Reenviar (gera novo) · Excluir
  - Card de convite **Cancelado**:
    - Visual mais discreto
    - Motivo (se preenchido)
    - Ação: Restaurar · Excluir
- Drawer "Novo convite" (right-side, ~520px):
  - Step 1: Selecionar aluno — search com avatar; mostra apenas alunos sem app vinculado; com badge "Sem app" cinza
  - Step 2: Escolher canal — 4 tiles grandes com ícone + label + descrição:
    - Link (Recomendado): "Copia e cola onde quiser — WhatsApp, email, etc."
    - QR code: "Pra usar em sessão presencial"
    - Email automático: "Sistema dispara o email pelo Nymos"
    - SMS/WhatsApp: "Envia direto · custa R$0,15 por envio"
  - Step 3: Mensagem opcional (textarea curta com placeholder "Adicione uma mensagem pessoal (opcional)…")
  - Footer: Cancelar · Gerar convite (label muda conforme canal: "Copiar link", "Mostrar QR", "Enviar email", "Enviar SMS/WhatsApp")
- Modal de QR code: QR grande (240px) + nome do aluno + label "Mostre pro aluno escanear" + botão "Copiar link como alternativa" + "Concluir"
- Toast/banner de sucesso após enviar convite com link copiado
- Empty state por tab com CTA contextual:
  - Pendentes vazia: "Nenhum convite pendente · Convide um novo aluno pra começar"
  - Aceitos vazia: "Ainda nenhum convite aceito"
  - Expirados/Cancelados vazias: "Nada por aqui 👌"
- Banner de upgrade Plus no topo (se aplicável) com cor amber suave + CTA "Upgrade pra Plus"
- Estilo visual igual outras seções (gradient bg, reveal animations, max-w-[1400px], teal primary, lucide icons)
- Light & dark mode + responsive

## Configuration
- shell: true
