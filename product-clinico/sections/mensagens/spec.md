# Mensagens Specification

## Overview
Inbox do médico/secretária pra comunicação assíncrona com pacientes. **Dois canais rigorosamente separados (LGPD):** Admin (paciente↔secretária — operacional) e Clínico (paciente↔médico — sem SLA). Secretária NÃO acessa o canal clínico. Layout inbox 2-painéis (lista de threads à esquerda, conversa ativa à direita) com filtro de canal no topo.

## User Flows

### Abrir inbox
- Médico clica em "Mensagens" no nav → abre na tab "Clínico" por padrão (tem ambas: Clínico + Admin)
- Secretária clica em "Mensagens" no nav → abre direto na tab "Admin" (não vê Clínico)
- Lista de threads à esquerda, ordenada por última atividade (mais recente no topo); thread com não-lidas tem badge teal

### Filtrar canal
- Tabs no topo: Clínico (default pro médico) · Admin (default pra secretária)
- Médico pode alternar entre os 2; secretária só vê Admin
- Contador de não-lidas em cada tab

### Abrir thread
- Click na thread → painel direito mostra conversa completa (scroll automático pro final)
- Header da conversa: avatar + nome + condições crônicas (só no Clínico) + status do paciente
- Marca thread como lida automaticamente após 2 segundos de visualização

### Enviar mensagem
- Composer fixo no rodapé do painel direito: textarea + botão de anexo + botão "Enviar"
- No canal Clínico: anexar foto/PDF permitido (até 10MB cada, até 3 por mensagem)
- No canal Admin: só texto (anexos viram V2)
- Enter envia · Shift+Enter quebra linha · Esc limpa
- Mensagem aparece imediatamente na thread (otimista)

### Arquivar thread
- Botão no header da thread aberta: "Arquivar" — move thread pra aba "Arquivadas"
- Arquivar não notifica o paciente; só remove do inbox ativo
- Médico pode reabrir thread arquivada via aba "Arquivadas"

### Mensagens automáticas do sistema
- Aparecem como bubble central (não atribuída a paciente/médico) na thread relevante
- Exemplos: "Exame chegou · TSH 5.2 mUI/L · revisar", "Consulta confirmada pra amanhã 14h", "Receita renovada (Memed)"
- Não notificam push (são contexto, não ação)

### Indicador de status (LGPD-friendly)
- ✓ Enviada (chegou no servidor)
- ✓✓ Entregue (push push recebido pelo paciente)
- **SEM "lida"** — médico não rastreia ack de leitura do paciente (privacy)
- **SEM "digitando"** — não exposto

## UI Requirements

### Layout principal
- Container `max-w-[1400px]` centralizado
- Header com título "Mensagens" + tabs de canal (Clínico · Admin · Arquivadas) com contador de não-lidas
- Body em grid 2 colunas: lista (380px fixa) | conversa (flex)
- Em telas <768px: mostra lista OU conversa (mobile-first), botão "voltar" pra navegar

### Lista de threads (painel esquerdo)
- Cada item: avatar (40px) + nome + última msg (truncate 2 linhas) + timestamp relativo + badge não-lidas (teal)
- Hover sutil (bg-slate-50/dark:bg-slate-800/40)
- Thread ativa: bg-teal-50/dark:bg-teal-950/30 + indicador lateral teal
- Empty state: ilustração leve + "Nenhuma conversa neste canal"

### Conversa ativa (painel direito)
- Header sticky: avatar + nome + condições crônicas (só Clínico) + ações (Ver paciente · Arquivar · Mais)
- Lista de mensagens com agrupamento por dia (label centralizado: "Hoje", "Ontem", "12 de fevereiro")
- Bubbles:
  - Paciente: alinhado à esquerda, bg-slate-100/dark:bg-slate-800
  - Médico/Secretária: alinhado à direita, bg-teal-600 text-white
  - Sistema: bubble central, bg-slate-50 border-dashed
- Timestamp em cada bubble (pequeno, abaixo)
- Composer sticky no rodapé: textarea autossize + ícone de anexo (só Clínico) + botão Enviar (teal)

### Visual
- Paleta: teal pra ações primárias e canal Clínico; slate pra neutros e canal Admin; emerald pra confirmações; rose pra alertas
- Font: DM Sans body, IBM Plex Mono em timestamps e badges
- Suporte completo a light/dark mode
- Indicador visual diferenciado entre canais Clínico (teal accent) e Admin (slate accent) pra reforçar separação

### Acessibilidade
- Foco visível em tabs e itens da lista
- Atalhos: ↑/↓ navegam lista, Enter abre, Esc fecha thread
- `aria-label` em ícones, `role="tab"` nas tabs

## Configuration
- shell: true
