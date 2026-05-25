# Exercícios Specification

## Overview
Biblioteca de exercícios do Personal — exercícios disponíveis para montar treinos. No MVP a fonte primária é a **Base curada Nymos** (~200 exercícios essenciais com vídeo demonstrativo, grupos musculares, equipamento, variações e contraindicações) acrescida de **customizados** criados pelo próprio personal (variações específicas, exercícios de academias particulares, equipamentos não-padrão). Cada item expõe mídia (vídeo + GIF preview), grupos musculares primário/secundário, equipamento, padrão de movimento, dificuldade e instruções passo-a-passo. Mesma pattern de "Alimentos" no nutri.

## User Flows
- Buscar exercício por nome (busca instantânea, com destaque do trecho que bate)
- Filtrar por grupo muscular (Peito, Costas, Pernas, Ombros, Braços, Core, Cardio)
- Filtrar por padrão de movimento (Push, Pull, Squat, Hinge, Carry, Lunge, Rotation)
- Filtrar por equipamento (Livre, Halteres, Barra, Máquina, Cabos, Peso corporal, Kettlebell, Elástico, Outros)
- Filtrar por fonte (Todos / Curados / Customizados / Favoritos)
- Marcar/desmarcar favoritos com clique na estrela do card
- Ordenar por nome A-Z, mais usado, ou recentes
- Clicar em card abre drawer lateral com detalhe completo (mídia + metadados + instruções + variações + ações)
- Para exercício Curado: drawer mostra dados read-only e botão "Duplicar como customizado"
- Para exercício Customizado: drawer permite Editar e Excluir
- Botão "+ Novo customizado" no header abre drawer em modo criar
- Criar/editar customizado: nome, grupos musculares (primário + secundários), equipamento, padrão de movimento, dificuldade, tempo médio (s), URL de vídeo + GIF preview, instruções passo-a-passo, dicas, variações sugeridas, contraindicações
- Excluir customizado com confirmação (alerta se vinculado a treinos ativos)
- Player de vídeo no drawer com controles (play/pause, fullscreen, mudo) — GIF é o preview enquanto vídeo não carrega

## UI Requirements
- Cabeçalho com título "Exercícios", contador total + por fonte, botão "+ Novo customizado" (slate-900) à direita
- Search full-width abaixo do header com placeholder "Buscar exercício por nome…" (mesma pattern de Alimentos/Pacientes)
- Linha de filtros: pills de Fonte (Todos N · Curados N · Customizados N · Favoritos N) à esquerda, sort dropdown à direita
- Filtros adicionais como segunda linha (chips horizontalmente roláveis em mobile):
  - Grupo muscular: Peito, Costas, Pernas, Ombros, Braços, Core, Cardio
  - Equipamento: Livre, Halteres, Barra, Máquina, Cabos, Peso corporal, Kettlebell, Elástico
  - Padrão de movimento: Push, Pull, Squat, Hinge, Carry, Lunge, Rotation
- Counter "Mostrando X de Y" em uppercase mono
- Lista em grid responsivo (1/2/3 colunas) — cards com thumbnail de GIF preview no topo
- Cada card:
  - Thumbnail GIF (16:9, autoplay loop muted) ocupando topo do card
  - Nome do exercício
  - Badges: grupo muscular primário (ex: Peito teal), padrão movimento (ex: Push slate), fonte (Curado azul / Custom teal)
  - Linha discreta com ícone de equipamento + dificuldade (3 dots) + tempo médio
  - Estrela de favorito (canto sup. dir. sobre o GIF)
- Drawer lateral 560px à direita (mais largo que Alimentos pra acomodar vídeo) com:
  - Cabeçalho com nome + badges de fonte/grupo + estrela
  - Bloco de mídia: player de vídeo (16:9) com poster do GIF; controles play/pause + fullscreen + mute
  - Bloco "Grupos musculares": primário em destaque + secundários como chips menores
  - Bloco "Metadados": Equipamento (ícone + texto), Dificuldade (1-5 dots), Tempo médio (s), Padrão de movimento
  - Bloco "Instruções": lista numerada passo-a-passo
  - Bloco "Dicas de execução": bullet list (collapsable em mobile)
  - Bloco "Variações sugeridas": chips clicáveis que abrem o exercício relacionado (regressão/progressão)
  - Bloco "Contraindicações": badge amarelo de aviso + lista (ex: "Hérnia lombar", "Lesão de ombro")
  - Botões no rodapé: Curado → "Duplicar como customizado" + "Fechar"; Custom → "Editar" + "Excluir" + "Fechar"
- Drawer em modo criar/editar: formulário com seções colapsáveis
  - Identificação: Nome (obrigatório), Grupo primário (select), Grupos secundários (multi-select)
  - Mídia: URL de vídeo, URL de GIF preview, upload de imagem fallback
  - Detalhes técnicos: Equipamento (select), Padrão de movimento (select), Dificuldade (slider 1-5), Tempo médio em segundos
  - Conteúdo: Instruções passo-a-passo (textarea com numeração automática), Dicas (textarea bullet), Variações (chip selector linkando outros exercícios), Contraindicações (chip selector pré-definido)
- Modal de confirmação para excluir customizado (mostra quantos treinos estão usando)
- Empty state "Nenhum exercício encontrado" com CTA "Criar customizado" se busca não acha
- Estilo visual igual Alimentos/Pacientes (gradient bg, reveal animations, max-w-[1400px], teal primary, lucide icons)
- Light & dark mode + responsive

## Configuration
- shell: true
