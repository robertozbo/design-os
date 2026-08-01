# Perfil Specification

## Overview
Perfil do médico endocrinologista com 4 blocos visuais — Identidade, Registros profissionais (CRM + RQE, com marcação de primário), Assinatura digital (imagem manuscrita + hash automático + ICP-Brasil opcional conforme CFM 2.299/2021) e Histórico de atuação (métricas agregadas: pacientes ativos, consultas, prescrições, anos de prática). View única em leitura com botão "Editar" que abre drawer lateral organizado em tabs internas.

## User Flows
- Médico entra em Perfil e vê visualização completa em 4 cards: Identidade, Registros profissionais, Assinatura digital, Histórico de atuação
- Profissional clica em "Editar perfil" no header e drawer lateral abre com 3 tabs internas (Identidade · Registros · Assinatura)
- Em "Identidade", profissional edita: foto (upload com preview), nome completo, cargo, e-mail corporativo, telefone, idioma preferido (PT/EN/ES) e fuso horário
- Em "Registros profissionais", médico vê lista de registros já cadastrados com botão "Adicionar registro"; cada registro tem: tipo (CRM/RQE/Outro), número, conselho/UF, data de validade, e toggle "Definir como primário" (apenas um pode ser primário)
- Profissional adiciona novo registro via formulário inline na lista; pode editar/remover registros existentes (mas não o primário sem promover outro antes)
- Em "Assinatura digital", profissional faz upload de imagem manuscrita (PNG/JPG, fundo transparente recomendado), sistema mostra preview da assinatura como aparecerá no relatório, e exibe o hash de identificação gerado automaticamente; opcionalmente, profissional pode habilitar ICP-Brasil como adicional
- Profissional salva e o drawer fecha; perfil atualizado é refletido imediatamente
- Histórico de atuação é read-only — mostra métricas como pacientes ativos, consultas realizadas, prescrições emitidas, anos de prática, especializações declaradas

## UI Requirements
- Cabeçalho da seção com título "Perfil", subtítulo "Suas credenciais aparecem em prontuários, evoluções e prescrições que você assina" e botão primário "Editar perfil"
- Card de Identidade (lg:col-span-2) com:
  - Foto grande (96px) ou avatar com iniciais quando sem foto, posicionado à esquerda
  - Nome em h1, cargo em texto secundário, badge de papel (Engenheiro/Médico/Técnico/SESMT)
  - Lista de contatos: e-mail corporativo (font-mono), telefone (font-mono), idioma preferido (badge), fuso horário (badge)
- Card de Registros profissionais (col-span-1):
  - Lista compacta de registros, primeiro o primário com badge "Primário" em teal
  - Cada registro: tipo + número (mono) + conselho/UF + indicador de validade (verde se >90 dias, amber se <90, rose se vencido)
  - Contador "X registros · 1 primário"
- Card de Assinatura digital (lg:col-span-2):
  - Preview da assinatura manuscrita em fundo claro com label "Assinatura nos relatórios"
  - Bloco com hash SHA-256 truncado em mono e "Identidade verificada" em emerald
  - Indicador de ICP-Brasil quando habilitado (violet badge)
- Card de Histórico de atuação (col-span-1):
  - 4 mini stats: Pacientes ativos, Consultas realizadas, Prescrições emitidas, Anos de prática
  - Lista de especializações em chips
- Drawer de edição (~560px) com 3 tabs internas (Identidade · Registros · Assinatura) e barra de salvar fixa no rodapé
- Tab Identidade: foto upload com preview circular, campos de nome/cargo/e-mail/telefone, selects de idioma (3 opções) e fuso horário
- Tab Registros profissionais: lista de cards de registro com edição inline; cada card tem campos (tipo · número · conselho/UF · validade) e toggle de primário; botão "Adicionar registro" no final; botão de remover por registro (desabilitado para o primário)
- Tab Assinatura digital: zona de upload de imagem com drag-and-drop, preview da assinatura, exibição do hash gerado em mono com botão "Recopilar hash" (regenera se imagem mudar), toggle "Habilitar ICP-Brasil" com explicação curta
- Indicador de validade dos registros com cores: emerald (válido > 90 dias), amber (vence em <90 dias), rose (vencido) — tooltip com data exata
- Modal de confirmação ao remover registro primário, exigindo selecionar novo primário antes
- Empty state da lista de registros (sem registros) com CTA "Adicionar primeiro registro"
- Paleta consistente com módulo Clínico (teal primário, emerald para validações OK, amber para avisos, rose para vencidos, violet opcional para ICP-Brasil). Font-mono em números de registro, hash, e-mail, telefone
- Suporte total a light e dark mode
- Layout responsivo: cards viram 1 coluna em mobile, drawer vira bottom sheet em telas pequenas, tabs do drawer ficam scrolláveis horizontalmente

## Configuration
- shell: true
