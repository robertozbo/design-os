# Perfil Specification

## Overview
Página de perfil profissional do fisioterapeuta dentro do Atender Fisioterapeuta. Concentra as credenciais oficiais que aparecem em avaliações cinético-funcionais, evoluções por sessão (SOAP) e relatórios de alta — incluindo registro COFFITO/CREFITO, especialidades reconhecidas, assinatura digital e histórico de atuação. Não é página de edição direta — o botão "Editar perfil" abre fluxo dedicado.

## User Flows
- Ver identidade profissional (nome, tratamento, cargo, especialidade, foto/iniciais, contato, idioma, fuso)
- Ver lista de registros profissionais (CREFITO primário + adicionais, com status de validade)
- Detectar registros vencidos ou próximos do vencimento (badge âmbar/rose)
- Ver assinatura digital cadastrada + indicação de ICP-Brasil + hash SHA-256
- Ver métricas históricas de atuação (pacientes ativos, sessões realizadas, avaliações, anos de prática)
- Ver métodos/técnicas dominantes (Pilates clínico, RPG, McKenzie, etc.)
- Botão "Editar perfil" abre fluxo de edição (fora do escopo desta tela)

## UI Requirements
- Header: eyebrow `● CONTA · PERFIL PROFISSIONAL` + título "Perfil" + subtítulo sobre uso em prontuários/evoluções + CTA "Editar perfil" (gradiente teal→cyan)
- Grid 3 colunas (responsivo) com 4 cards:
  - **Identidade** (col-span-2): avatar/iniciais grande + nome com tratamento + cargo + badge de especialidade + 4 contatos (email, telefone, idioma, fuso)
  - **Registros profissionais** (col-span-1): lista de CREFITOs com primário em destaque (teal) + validade colorida (verde/âmbar/rose)
  - **Assinatura digital** (col-span-2): preview da assinatura + bloco de "Identidade verificada" com hash SHA-256 + badge ICP-Brasil + nota da COFFITO 516/2020
  - **Histórico de atuação** (col-span-1): 4 mini-stats (pacientes ativos, sessões, avaliações, anos) + chips de métodos dominantes
- Estilo: gradient bg, max-w-[1100px], teal como cor primária (não violet), animação reveal-up sequencial nos cards
- Light & dark mode + responsive (single column em mobile)

## Configuration
- shell: true
