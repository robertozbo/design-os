# Exames Specification

## Overview
Centro de gestão dos exames recebidos pelos pacientes do médico — laudos laboratoriais (perfil tireoidiano, hemoglobina glicada, vitamina D) e exames de imagem (raio-X, ECG, ressonância). **Duas views**: lista de todos os exames recebidos (com filtros por paciente, tipo, data, status de revisão) e detalhe de um exame em layout de 3 colunas (laudo PDF · biomarkers com sparkline · **IA de apoio à interpretação**). A IA NÃO faz laudo (não é SaMD); ela resume o laudo já produzido pelo radiologista/lab, compara historicamente, e cruza com queixa do paciente e medicação em uso.

## User Flows

### Lista de exames
- Médico abre Exames → vê todos os exames recebidos dos seus pacientes
- Filtros: paciente (autocomplete), tipo (laboratorial/imagem), status (a revisar / revisado), período (últimos 7d / 30d / customizado)
- Cada item da lista: paciente · tipo · laboratório · data · destaque do principal valor alterado · badge "Novo" se ainda não revisado · click abre detalhe
- Ordem default: a revisar primeiro, depois mais recentes

### Detalhe do exame — abertura
- Header sticky: paciente (avatar + nome + condições) · tipo + data + lab · ações (Voltar, Marcar como revisado, Compartilhar com paciente, Imprimir)
- Layout em 3 colunas no desktop (stacks no mobile)

### Coluna 1 — Laudo (PDF)
- Viewer do laudo original do laboratório
- V1: PDF embutido (`<iframe>` ou `<embed>`) com zoom controls básicos
- Texto do laudo selecionável pra copiar trechos
- Se for imagem (raio-X), mostra preview com botão "Abrir no viewer externo" (DICOM viewer V2)

### Coluna 2 — Valores estruturados
- Cards de biomarkers extraídos (HbA1c, TSH, T4, glicemia, etc.)
- Cada biomarker: valor + unidade + faixa de referência + nível de alerta (cor) + sparkline com últimos 5-7 valores históricos
- Click no biomarker abre overlay com gráfico longitudinal completo
- Indicação visual de "↑ subiu desde último", "↓ caiu", "↔ estável"

### Coluna 3 — IA de apoio à interpretação
- **Painel destacado** com badge "IA" emerald e disclaimer
- 4 cards empilhados:
  1. **Resumo do laudo** — 3 linhas com principal achado, contexto, sugestão de ação
  2. **Comparação histórica** — variação dos valores ao longo do tempo, % de mudança, tendência
  3. **Cruzamento com queixa atual** — relação entre os achados e os sintomas relatados pelo paciente na anamnese pré-consulta
  4. **Cruzamento com medicação em uso** — análise se a medicação atual pode explicar/influenciar resultado, sugestão de ajuste
- Cada card pode ser expandido pra ver detalhes
- Cada card mostra: modelo de IA usado, timestamp, fonte do contexto (anamnese de qual data, prescrição de qual data)
- **Disclaimer claro**: "Esta análise é uma sugestão de IA. Decisão clínica é sua." + link pra audit log

### Marcar como revisado
- Botão "Marcar como revisado" no header
- Após revisado: badge "Revisado por Dr. Pedro em [data]"
- Pode adicionar observação do médico (texto livre que vai pro prontuário)

### Compartilhar com paciente
- Opcional: enviar resumo simplificado pro paciente via canal clínico
- IA gera resumo em linguagem simples (sem jargão) — médico revisa antes de enviar

## UI Requirements

### Lista — layout
- Topbar com filtros (paciente, tipo, período, status) + busca + segmented "A revisar / Todos"
- Tabela responsiva ou cards em 2 colunas
- Cada item:
  - Avatar do paciente + nome + condições
  - Tipo do exame + lab
  - Data (relativa: "ontem", "há 3 dias")
  - Badge "Novo" se não revisado (rose)
  - Mini-preview de 1-2 biomarkers com alerta
  - Sparkline pequeno
  - Click → detalhe

### Lista — empty state
- "Nenhum exame recebido recentemente"
- Sugestão: "Solicite exame na consulta — paciente envia pelo app"

### Detalhe — layout
- **Header sticky** com paciente + tipo + data + ações (~80px)
- **Grid 3 colunas** (`md:grid-cols-[1fr_320px_360px]` ou flex):
  - Col 1 (flexível): Viewer PDF
  - Col 2 (~320px): Valores estruturados
  - Col 3 (~360px): IA de apoio
- Mobile: tudo empilha vertical (PDF primeiro, valores, IA)

### Coluna IA — visual destacado
- Background sutil emerald (`emerald-50/40` light, `emerald-950/20` dark)
- Border emerald distintiva
- Badge "✨ IA" no topo + modelo + timestamp
- Cada card de IA tem ícone tipo (resumo, comparação, queixa, medicação)
- Disclaimer no rodapé sempre visível

### Biomarkers — visual
- Card por biomarker
- Valor grande monospace
- Faixa de referência abaixo
- Sparkline dos últimos pontos
- Cor por nível de alerta (sky/slate/amber/rose)

### Acessibilidade
- IA sempre tem aria-label descrevendo que é gerado
- Sparklines têm aria-label com tendência
- Foco visível em todos os elementos clicáveis

## Configuration
- shell: true
