# Perfil Specification

## Overview
Perfil do psicólogo(a) com 4 blocos visuais — Identidade, Registros profissionais (CRP), Assinatura digital (CFP 11/2018 telepsicologia) e Histórico de atuação (métricas agregadas). View única em leitura com botão "Editar" que abre drawer lateral em 3 tabs internas.

Mesmo padrão do `/perfil` do Clínico (médico endocrinologista), adaptado pra realidade do psicólogo: CRP em vez de CRM, abordagens terapêuticas como especializações, métricas psi (pacientes ativos, sessões realizadas, planos terapêuticos).

## User Flows
- Psi entra em Perfil e vê visualização completa em 4 cards: Identidade, Registros profissionais, Assinatura digital, Histórico de atuação
- Clica em "Editar perfil" no header e drawer lateral abre com 3 tabs internas (Identidade · Registros · Assinatura)
- **Identidade**: edita foto (upload com preview), nome completo, tratamento (Dr./Dra./outro), especialidade textual, papel (clínico/organizacional/jurídico/escolar/outro), e-mail profissional, telefone, idioma preferido (PT/EN/ES) e fuso horário
- **Registros profissionais**: lista de registros já cadastrados com botão "Adicionar registro"; cada registro tem tipo (CRP/Outro), número (formato 00/00000), conselho/UF, data de validade, toggle "Primário" (apenas um pode ser primário). Não pode remover o primário sem promover outro antes
- **Assinatura digital**: upload de imagem manuscrita (PNG/JPG, fundo transparente recomendado), preview, hash SHA-256 gerado automaticamente; opcionalmente toggle ICP-Brasil
- Salva → drawer fecha; perfil atualizado refletido imediatamente
- Histórico de atuação é read-only — pacientes ativos, sessões realizadas, planos terapêuticos, anos de prática, abordagens dominantes

## UI Requirements
- Cabeçalho da seção: título "Perfil", subtítulo "Suas credenciais aparecem em prontuários, evoluções SOAP e prescrições que você assina", botão primário "Editar perfil" (gradient violet → sky)
- **Card Identidade** (lg:col-span-2): foto grande (96px) ou avatar com iniciais; nome em h1, cargo/tratamento secundário, badge de papel (Clínico/Organizacional/Jurídico/Escolar); lista de contatos (e-mail, telefone, idioma, fuso) com font-mono
- **Card Registros profissionais** (col-span-1): lista compacta de registros, primário primeiro com badge "Primário" em violet; cada registro mostra tipo + número (mono) + conselho/UF + indicador de validade (emerald se >90d, amber se <90d, rose se vencido); contador "X registros · 1 primário"
- **Card Assinatura digital** (lg:col-span-2): preview da assinatura em fundo claro com label "Assinatura nos documentos"; bloco com hash SHA-256 truncado em mono + "Identidade verificada" em emerald; indicador de ICP-Brasil quando habilitado (violet badge)
- **Card Histórico de atuação** (col-span-1): 4 mini-stats em grid (Pacientes ativos · Sessões realizadas · Planos terapêuticos · Anos de prática); lista de abordagens dominantes em chips
- Drawer de edição (~560px) com 3 tabs internas (Identidade · Registros · Assinatura) e barra de salvar fixa no rodapé
- Indicador de validade dos registros com cores: emerald (válido >90d), amber (vence <90d), rose (vencido) — tooltip com data exata
- Modal de confirmação ao tentar remover registro primário (exige promover outro antes)
- Empty state da lista de registros (sem registros) com CTA "Adicionar primeiro registro"
- Paleta: violet primário (alinha com IA Insights/CTA psi), emerald para validações OK, amber para avisos, rose para vencidos; font-mono em números de registro, hash, e-mail, telefone

## Configuration
- shell: true
