# Assistente Nymos · Mobile Specification

## Overview
Versão mobile (PWA / app nativo) da experiência fullscreen de conversa com o Assistente Nymos. Mesma estética HUD bio-diagnóstica da versão web, mas otimizada pra tela pequena, gestures e safe areas. Avatar low-poly **domina a tela** como elemento-âncora; painéis HUD ficam num **pull-up sheet** acessível por gesto, evitando competição visual com o avatar.

## User Flows

### Invocação
- **FAB persistente** com mini-mesh + scanner ativo no canto inferior-direito do shell mobile do Nymos (ao lado do tab bar, levitando 12px acima).
- Toque no FAB → **transição alien reveal** (mesmo efeito da web: partículas convergindo, mesh se montando) e a tela do assistente cobre 100% do app.
- Wake-word **"Ei Nymos"** funciona com a tela bloqueada quando a PWA é instalada e o User concedeu microphone-always.
- Gestualidade adicional mobile: **shake-to-invoke** (opt-in nas configurações) — chacoalhar o aparelho 2x abre o assistente.

### Layout fullscreen (estado padrão: sheet colapsado)
Top → bottom:

1. **Safe area top** + status strip HUD compacta (badge ativo + ID mascarado + indicador de device).
2. **Avatar mesh** centralizado ocupando ~50% da altura útil. Estados visuais (`idle`/`listening`/`thinking`/`speaking`) idênticos à web.
3. Caption do estado abaixo do avatar (`SCANNING` · `LISTENING` · `PROCESSING` · `SPEAKING`).
4. **Transcrição compacta** mostrando os últimos 2 turnos com chip de drill-down quando aplicável.
5. **Controles centrais**: mic indicator grande (botão principal) + barra horizontal lateral com TTS mute, teclado, fechar.
6. **Bottom sheet com handle** mostrando "PUXE PARA VER MÉTRICAS" — peek de 24px do topo do sheet visível.

### Pull-up sheet expandido
- User arrasta o handle pra cima (ou toca nele).
- Avatar encolhe pra ~30% da altura (mantém visível no topo).
- Sheet sobe até 70% da viewport e mostra **grid 2 colunas** de HUD panels:
  - PROFILE + BIO DIAGNOSTIC (linha 1)
  - HEART RATE + BODY TEMP (linha 2)
  - OXYGENATION + WEIGHT (linha 3)
  - SLEEP + BIOMARKERS (linha 4)
- Drag-down ou tap no handle colapsa de volta.
- Painéis em estado `active`/`alert` continuam acendendo conforme contexto da conversa, mesmo com sheet colapsado (badge ponto no handle).

### Registro por voz
- Idêntico à web em fluxo.
- Confirmação visual: toast HUD breve no topo do avatar com check ciano + "Salvo: …" + chip "ver registro".

### Sugestão proativa
- Aparece como **card flutuante âmbar no topo** (logo abaixo da status bar) com auto-dismiss em 8s se não respondida, ao contrário da web onde aparece em destaque central. Tap no card abre detalhe; swipe-up dispensa.

### Encerramento
- Botão X no controle inferior.
- Swipe-down do topo da tela (gesto nativo iOS/Android-style).
- "Tchau Nymos" por voz.
- Transição de saída inversa (mesh se dispersa + fade).

### Histórico
- Acessível por toque no badge "HISTÓRICO" no canto superior-esquerdo da tela ativa.
- Abre como **modal sheet** mostrando lista cronológica das últimas sessões — não navega pra outra rota.

## UI Requirements

### Safe areas
- Top: `env(safe-area-inset-top)` respeitado pra notch/Dynamic Island.
- Bottom: `env(safe-area-inset-bottom)` no control bar e no handle do sheet.

### Touch targets
- Mic indicator: 64x64px (maior que web pra ser touch primário).
- Botões de controle: 48x48px mínimo.
- Handle do sheet: área de toque 44x44 mesmo que visual seja menor.

### Avatar mesh
- Sem rotação 3D em mobile (perf): só vertex displacement nos estados.
- Tamanho default: 70% da largura da viewport, max 360px.
- Sheet expandido reduz pra 35% da largura.
- WebGL com fallback SVG pra dispositivos antigos.

### Pull-up sheet
- Backdrop blur leve quando expandido (mantém avatar visível mas dessaturado).
- Animação spring 380ms (não linear).
- Handle: barra horizontal 36x4px slate-500, ciano quando ativo.
- Suporta gesto vertical com momentum + snap em 3 posições: colapsado (peek 24px) · meio (40% viewport) · cheio (70% viewport).

### Estados de movimento
- `prefers-reduced-motion`: desliga vertex displacement do mesh; sheet vira tap-toggle (sem drag); transcrição sem animação de fade.

### Modo dark-only
- Fundo preto puro `#000` em mobile (não `stone-950`) pra OLED — economiza bateria e dá glow mais nítido nas bordas teal/coral.

## Out of Scope (V1 mobile)
- Lock screen integration (controles na lock screen estilo Apple Music) — V2
- Widget na home screen mostrando última sessão — V2
- Apple Watch / Wear OS companion — futuro
- Background audio (Nymos continuar respondendo com tela travada) — V2

## Configuration
- shell: false
