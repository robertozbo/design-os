# Configurações Specification

## Overview
Hub de configurações da conta do fisioterapeuta — não tem conteúdo próprio, apenas direciona para as seções específicas (Perfil, Disponibilidade, Serviços, Planos terapêuticos, Minha conta). Layout de cards/grid agrupados por categoria (Atendimento · Catálogo · Conta).

## User Flows
- Ver categorias de configuração agrupadas
- Click em qualquer card abre a seção correspondente em rota separada
- Ver indicadores rápidos em cada card (ex: "12 serviços cadastrados", "Plano Pro")

## UI Requirements
- Header: eyebrow "Conta · Configurações" + título "Configurações" + subtítulo
- 3 grupos de cards:
  - **Atendimento**: Perfil profissional · Disponibilidade · Avaliações padrão
  - **Catálogo**: Serviços e tabelas de preço · Planos terapêuticos
  - **Conta**: Minha conta e cobrança · Notificações · Integrações · Dados e privacidade
- Cada card: ícone teal + label + descrição curta + indicador (badge/status) + chevron
- Estilo: gradient bg, max-w-[1100px], teal accent

## Configuration
- shell: true
