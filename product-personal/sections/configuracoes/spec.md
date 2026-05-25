# Configurações Specification

## Overview
Página de configurações do personal autônomo. Layout split: sidebar interna (lista de seções) + conteúdo à direita. Cobre **perfil profissional** (foto, CREF, bio, especialidades), **agenda e disponibilidade** (dias, horários, modalidades, valores por sessão), **plano e cobrança** (Free / Plus R$49,90 / Pro R$99,90 + métodos de pagamento + histórico), **notificações**, **integrações** (Apple Health, Garmin, Stripe), e **dados e privacidade** (LGPD: exportar, excluir conta).

## User Flows
- Editar perfil profissional: foto, nome, CREF, especialidades, abordagens, formação, bio
- Configurar disponibilidade semanal: pra cada dia, ativar + horário início/fim
- Definir modalidades: presencial, online, híbrido + locais (studio/academia)
- Configurar valores por tipo de sessão (avulsa, mensal, trimestral)
- Ver plano atual + features + próxima cobrança
- Upgrade ou downgrade de plano (Free → Plus → Pro ou vice-versa)
- Adicionar/remover método de pagamento (cartão, Pix)
- Ver histórico de cobranças
- Configurar preferências de notificação (email, push, SMS) por categoria
- Conectar integrações (Apple Health, Garmin, Stripe, Z-API/WhatsApp)
- Exportar todos os dados (LGPD)
- Excluir conta (com confirmação dupla)
- Trocar idioma (pt-BR / en-US)
- Trocar tema (light/dark/system)

## UI Requirements
- Cabeçalho com título "Configurações"
- **Layout split**:
  - **Sidebar interna** (240px) com lista de seções: Perfil · Agenda · Plano · Notificações · Integrações · Dados
  - **Conteúdo** (rest) com a seção ativa
- Click numa seção da sidebar interna → muda o conteúdo
- Cada seção tem header próprio + corpo

### Perfil
- Avatar grande (96px) com botão "Trocar foto"
- Nome completo (input)
- CREF (input com validação 6 dígitos + UF)
- Email + telefone (com máscara BR)
- Especialidades (multi-select chips: Hipertrofia, Emagrecimento, Performance, Reabilitação, Idosos, Crianças, Funcional, Crossfit, Pilates, Yoga)
- Abordagens (multi-select: Treinamento Funcional, Cross Training, HIIT, Calistenia, Musculação, Personal Online)
- Bio (textarea)
- Formação (lista editável: instituição + ano + curso)
- Botão "Salvar alterações" no rodapé

### Agenda e disponibilidade
- Cabeçalho "Disponibilidade semanal"
- Grid 7 dias: para cada dia, toggle ativo + 2 inputs (início, fim)
- Modalidades de atendimento (toggles): Presencial · Online · Híbrido
- Lista de locais (presencial): Studio Vila Olímpia · Cia Athletica Faria Lima · domicílio
- Valores por tipo de sessão:
  - Avulsa (R$/sessão)
  - Mensal (4x/semana, valor mensal)
  - Mensal Plus (5x/semana)
  - Pacote trimestral (desconto)
- Botão "Salvar"

### Plano e cobrança
- Card grande do plano atual com badge (Free / Plus / Pro)
- Lista de features incluídas (com checks)
- Próxima cobrança (R$ + data)
- Botão "Upgrade pra Pro" (se Plus) ou "Mudar plano"
- Comparativo dos 3 tiers (cards lado a lado)
- Métodos de pagamento (lista de cartões + Pix)
- "+ Adicionar método de pagamento"
- Histórico de cobranças (tabela: data, valor, status, recibo)

### Notificações
- Lista por categoria, cada uma com 3 toggles (Email · Push · SMS):
  - Aluno completou treino
  - Aluno comentou desconforto/dor
  - Aluno aceitou convite
  - Aluno cancelou sessão
  - Lembrete de sessão (1h antes)
  - Adesão baixa (alerta)
  - Reavaliação atrasada
  - Cobrança gerada
  - Cobrança paga / falhou
  - Resumo semanal (relatório)

### Integrações
- Cards de cada integração com status (Conectado / Disponível / Em breve):
  - Apple Health (sync de peso/FC/HRV/sono/passos dos alunos)
  - Garmin Connect
  - Health Connect (Android)
  - Stripe (cobrança recorrente Plus/Pro)
  - Z-API / WhatsApp Business (envio de mensagens)
  - Google Calendar (sync de agenda)
  - Memed (prescrição — V2)

### Dados e privacidade
- Card "Exportar meus dados" com botão (LGPD)
- Card "Idioma" com select (pt-BR / en-US / es)
- Card "Tema" com toggle/select (Light / Dark / Sistema)
- Card destrutivo "Excluir conta" com texto explicativo + botão vermelho

- Estilo visual igual outras seções (gradient bg, max-w-[1400px], teal primary, lucide icons)
- Light & dark mode + responsive (sidebar interna vira tabs horizontais em mobile)

## Configuration
- shell: true
