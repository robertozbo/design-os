# Prontuário Specification

## Overview
Visão longitudinal e oficial do prontuário do paciente — agrega tudo que foi registrado em consultas, exames e prescrições. Funciona como **documento clínico vivo**: leitura consolidada + edição inline de campos persistentes (antecedentes, alergias, medicação contínua) que crescem ao longo do tempo. Evoluções de consulta vêm read-only (a edição mora na section Consulta). Sidebar lateral com seções âncora pra navegação rápida; conteúdo scrollável no centro; exportação em PDF.

## User Flows

### Abrir o prontuário
- Médico abre paciente → tab "Prontuário" (ou direto pela section Prontuário) → carrega documento completo
- Default: scroll no topo (Identificação)
- Sidebar lateral mostra seções e atalhos

### Navegar
- Click na seção da sidebar → scroll suave (smooth) até a seção correspondente
- Indicador de seção ativa muda conforme scroll (intersection observer)
- Tecla `1-7` pula entre seções (atalho)

### Editar campos inline
- Médico clica num campo editável (antecedente, alergia, medicação contínua, hábito)
- Campo vira input/textarea inline com botões "Salvar" / "Cancelar"
- Salvar grava no prontuário e registra audit log
- Campos não-editáveis (evoluções históricas) ficam read-only com indicador

### Adicionar antecedente / alergia
- Cada lista (antecedentes pessoais, familiares, alergias, hábitos) tem botão "+ Adicionar"
- Abre input inline pra texto livre
- Enter ou click "Salvar" adiciona o item

### Exportar PDF
- Botão "Exportar PDF" no topo direito
- Modal pergunta seções a incluir (default: todas) + decide se inclui evoluções completas ou só resumos
- Gera PDF formatado (timbrado do consultório, dados do médico, assinatura digital)

### Ver evolução completa
- Cada evolução histórica na seção "Evoluções" mostra resumo
- Click expande pra mostrar SOAP completo (read-only)
- Link "Abrir consulta original" volta pra section Consulta

### Compartilhar trecho
- Médico pode selecionar texto e compartilhar via canal clínico do paciente (resumo simplificado)
- Útil pra dúvidas pós-consulta

## UI Requirements

### Layout geral
- **Topbar** sticky com paciente (avatar + nome + idade + condições) + ações (Exportar PDF · Compartilhar · Imprimir · Mais)
- **Grid 2 colunas no desktop**:
  - Sidebar esquerda fixa (~240px): nav âncora + indicador ativo
  - Conteúdo central (max-w-3xl): documento scrollável vertical com espaçamento generoso
- Mobile: sidebar colapsa em menu dropdown no topo

### Sidebar de seções
- Lista vertical com 7 itens:
  1. Identificação
  2. Anamnese
  3. Exame físico
  4. Hipóteses & Plano
  5. Evoluções
  6. Exames
  7. Prescrições
- Cada item: ícone + label + count (quando aplicável: "5 evoluções", "3 prescrições")
- Item ativo destacado em teal
- Topo da sidebar: mini-card do paciente + botão "Exportar PDF" sticky

### Cada seção (cards no centro)
- Título da seção em h2 (DM Sans semibold 18px)
- Subtítulo curto (descreve o que é)
- Conteúdo: cards de campos ou listas
- Espaçamento de ~48px entre seções

### Identificação (read-only)
- Grid 2 colunas: nome, CPF, nascimento, gênero, telefone, email, endereço, convênio, status app

### Anamnese (estruturada + editável)
- **Queixa principal** (campo grande editável)
- **HMA** (textarea grande editável)
- **Antecedentes pessoais** (lista editável, + adicionar)
- **Antecedentes familiares** (lista editável)
- **Medicações em uso** (lista derivada de prescrições + ajustes manuais)
- **Alergias** (lista editável, badge rose se tiver crítica)
- **Hábitos** (tabaco, álcool, atividade física — cada um com chip de status)

### Exame físico (estruturado + editável)
- **Sinais vitais** (PA, FC, FR, Temp) em grid de 4 cards
- **Antropometria** (peso, altura, IMC, circunferência abdominal) em grid de 4 cards
- **Exame específico** (textarea editável: tireoide palpável, pele, etc.)
- Histórico de antropometria com sparkline pequeno (peso ao longo do tempo)

### Hipóteses & Plano
- **Hipóteses diagnósticas** (lista de CIDs ou texto livre, com badge de confirmação)
- **Plano atual** (textarea editável, derivado da última consulta mas editável)

### Evoluções (read-only + expansível)
- Lista cronológica (mais recente primeiro)
- Cada item: data + modalidade + plano resumido + badge IA se aplicável
- Click expande SOAP completo (S/O/A/P em accordion)
- Botão "Abrir consulta original" → link
- Footer: "5 evoluções neste prontuário" + link "Ver tudo"

### Exames (consolidado read-only)
- Grid de cards de exames (mesmo estilo do PacienteDetalhe Exames tab)
- Click → abre detalhe (link pra section Exames)

### Prescrições (consolidado read-only)
- Lista de prescrições ativas no topo (destaque)
- Histórico abaixo
- Click → link Memed

### Edição inline (visual)
- Hover num campo editável: ícone de pencil aparece à direita
- Click: campo vira input/textarea
- Botões "Salvar" (teal) e "Cancelar"
- Após salvar: micro-animação de check verde + timestamp "atualizado por Dr. Pedro · agora"

### Exportação PDF (modal)
- Modal com checkboxes por seção
- Toggle "Incluir evoluções completas (SOAP)" ou "Apenas resumos"
- Botão "Gerar PDF" — abre PDF em nova tab ou faz download
- Disclaimer: "PDF assinado digitalmente apenas em V2 (ICP-Brasil)"

### Acessibilidade
- Skip links para cada seção
- Atalhos teclado (1-7 pra navegar)
- Cada campo editável tem aria-label descritivo
- Badge de IA com aria-label "Este conteúdo foi assistido por IA"

## Configuration
- shell: true
