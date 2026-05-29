# Sessões Ativas Specification

## Overview
Tela acessada via Privacidade e Segurança → Sessões ativas. Lista todos os dispositivos com sessão autenticada na conta, identifica a sessão atual e permite revogar individualmente ou todas as outras de uma vez. Princípio: visibilidade e controle total sobre quem está logado.

## Princípios de segurança
- **Sessão atual nunca pode ser revogada por aqui** — usuário precisa fazer logout explícito
- **Revogação imediata** — token invalidado server-side, próxima request do device caído retorna 401 → logout forçado naquele device
- **Re-autenticação não exigida** para revogar (sessão atual já provou identidade); mas exigida para "Encerrar todas as outras" como camada extra
- **Audit log** — toda revogação fica registrada em log auditável (não exposto nesta tela; visível em export LGPD)

## User Flow

1. Usuário toca "Sessões ativas" em Privacidade e Segurança → navega para `ActiveSessions`
2. Header: "Sessões ativas" + subtítulo "Dispositivos conectados à sua conta"
3. Counter card no topo: "{N} dispositivos · {M} ativos nos últimos 7 dias"
4. Lista cronológica desc por última atividade
5. Card da sessão atual destacado primeiro com:
   - Badge sky "Este dispositivo"
   - Ícone do tipo de device (Smartphone, Laptop, Tablet, Monitor)
   - Nome + OS + cidade
   - "Ativo agora" (verde dot pulsing)
   - Sem botão de revogar
6. Cards das outras sessões:
   - Mesmo layout sem badge "Este dispositivo"
   - Tempo desde última atividade ("há 14 min", "ontem", "há 3 dias", "há 2 semanas")
   - Botão "Encerrar sessão" rose à direita (icone X + label em desktop, só icone em mobile)
7. Footer flutuante (só visível se há ≥ 2 outras sessões): botão "Encerrar todas as outras sessões"
8. Toque em "Encerrar sessão" individual abre confirmação:
   - Modal: "Encerrar sessão de [Device Name]?"
   - "O dispositivo será desconectado imediatamente."
   - Botões Cancelar / Encerrar (rose)
9. Toque em "Encerrar todas as outras":
   - Modal extra forte: "Encerrar {N} sessões?"
   - "Você precisará fazer login novamente em outros dispositivos."
   - Botões Cancelar / Encerrar todas (rose)
10. Após revogação: card desaparece da lista com fade out + toast "Sessão encerrada"
11. Empty state quando só há sessão atual: card emerald "Apenas este dispositivo conectado"

## UI Requirements

### Layout
- Header sub-page "Sessões ativas" com subtítulo
- ScrollView com counter card + lista
- Footer fixo (não-scroll) com botão de mass revoke quando aplicável

### Counter card (topo)
- Card slate-900 com border, padding 14
- Esquerda: grande número total (24px font-mono semibold) + label pequena "DISPOSITIVOS"
- Direita: "{M} ativos · últimos 7d" em texto menor

### Card de sessão
- Border 1px, rounded-2xl, padding 14
- Layout: ícone 40px à esquerda, info no meio, ações à direita
- Ícone color-coded por tipo: violet (mobile), sky (desktop), emerald (tablet)
- Header da info: nome do device em semibold + badge sky "Este dispositivo" se atual
- Linha 2: OS + cidade em texto cinza pequeno
- Linha 3 (last activity):
  - Atual: dot verde + "Ativo agora" verde
  - Outras: ícone Clock + "{tempo} atrás" em cinza
- Botão "Encerrar sessão" rose-ghost (icone + label), só renderiza se não-atual

### Modal de confirmação individual
- Padrão Alert nativo iOS/Android (usar Alert.alert no RN)
- Título: "Encerrar sessão de [Device]?"
- Body: "O dispositivo será desconectado imediatamente."

### Modal de confirmação mass
- Padrão Alert mas com texto enfatizando o N
- "Encerrar X sessões?" + body explicativo

### Footer flutuante
- Container fixo no rodapé com padding + safe area inset
- Border-top sutil
- Botão full-width rose-soft "Encerrar todas as outras sessões"
- Aparece com fade quando ≥ 2 outras sessões

### Toast
- "Sessão encerrada" / "X sessões encerradas"
- 2.2s fade

## Configuration
- shell: false
