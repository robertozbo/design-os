# Onboarding Specification

## Overview
Onboarding em **formato de chat conversacional** — não wizard com botões "próximo/voltar". O assistente Nymos guia o usuário através de uma sequência de perguntas, uma por vez, capturando dados essenciais pra personalização (perfil, antropometria, hábitos, exames). Cada resposta vira uma bolha no histórico e a próxima pergunta aparece com efeito de "digitando…".

A escolha pelo chat reduz a sensação de formulário e dá ritmo conversacional — o usuário sente que está respondendo a alguém, não preenchendo cadastro.

## Conceito de UX

### Por que chat e não wizard
- **Foco numa pergunta por vez** — zero cognitive overhead, sem ver 8 campos vazios assustando
- **Histórico acumulativo** — usuário vê o que já respondeu, sente progresso real
- **Asymmetric pacing** — bot "pensa" antes de cada pergunta (typing indicator), usuário responde no próprio ritmo
- **Mesma fundação para questionários futuros** — anamneses, follow-ups, retomadas

### Mental model
A tela é uma conversa contínua. O assistente:
- Cumprimenta no início (2 bolhas de boas-vindas)
- Faz uma pergunta de cada vez
- Reage a cada resposta avançando pra próxima
- Anuncia o fim ("Tudo pronto! ✨") antes de transferir pra próxima tela

## User Flows

### Entrada
1. Usuário cai na tela vinda do splash/welcome
2. Aparecem 2 bolhas do assistente em sequência: saudação + apresentação do formato
3. Após ~800ms aparece a primeira pergunta (com typing indicator antes)

### Loop principal (por pergunta)
1. Bot mostra typing indicator (~700ms)
2. Bolha do bot aparece com a pergunta + ícone colorido contextual
3. Input apropriado aparece no rodapé (varia por tipo da pergunta)
4. Usuário responde
5. Resposta vira bolha do usuário no histórico
6. Pequeno delay (~350ms) e o loop reinicia com a próxima pergunta
7. Progresso atualiza no topo ("X de N respondidas")

### Saída
1. Após a última pergunta, bot envia bolha de despedida ("Tudo pronto! Vou organizar suas informações... ✨")
2. Após ~1.4s, navega pra `/mobile/sections/onboarding-completo`

## Estrutura de Tela

### Header (fixo no topo)
- Avatar do assistente à esquerda (gradient teal→sky com ícone Bot)
- Nome "Assistente Nymos" + status verde "X de N respondidas" (ou "Concluído") no meio
- **Botão menu (kebab vertical) à direita** — abre painel "Seu Progresso" (ver seção abaixo)
- Barra de progresso linear logo abaixo (gradient teal→sky, transição smooth 500ms)

### Histórico (scroll)
- Bolhas alinhadas à esquerda (assistente) ou direita (usuário)
- Bolhas do bot têm ícone colorido por categoria (teal, sky, emerald, amber, rose, violet, orange)
- Auto-scroll pra última bolha sempre que algo novo entra
- Scroll bar oculto pra ficar mais clean
- Typing indicator: 3 dots animados em sequência (160ms entre cada)

### Input (fixo no rodapé)
- Muda conforme o tipo da pergunta atual (ver seção abaixo)
- Borda superior separando do histórico

## Tipos de Input por Pergunta

### `text` — texto livre
- Input pill (h-11, rounded-full)
- Botão send circular ao lado (gradient teal→sky)
- Validação: mínimo 2 caracteres pra habilitar send
- Enter submete

### `number` — numérico com unidade
- Input pill com unidade fixa à direita (ex: "cm", "kg", "anos")
- Inputmode numeric
- Validação: dentro de `min`/`max` definidos pra habilitar send
- Botão send circular ao lado

### `select` — escolha única
- Chips horizontais (rounded-full, h-9) que envolvem o texto
- Emoji opcional antes do label
- Hover/active: borda teal + scale 0.97
- Tap responde imediatamente — sem botão de confirmar
- Quando >8 opções, scrolla horizontalmente dentro de max-h-32

### `image` — upload de foto/PDF
- Grid 2 colunas: botão "Câmera" + botão "Galeria"
- Se `opcional: true`, botão "Pular essa pergunta" abaixo

### `device` — conectar wearable
- Grid 2 colunas: botão "Apple Health" + botão "Health Connect"
- Botão "Conectar depois" abaixo (sempre opcional)

## Validação por Step

A validação acontece **no input**, não em popup ou após enviar:

| Tipo | Regra | Feedback |
|---|---|---|
| `text` | min 2 caracteres | Botão send desabilita (cinza) até atingir |
| `number` | dentro de `min..max` | Botão send desabilita até valor válido |
| `select` | clicar = enviar | Sem validação visível, tap commit |
| `image` | opcional ou enviado | Skip disponível só se `opcional: true` |
| `device` | opcional sempre | "Conectar depois" sempre visível |

**Não há mensagem de erro flutuante** — o estado desabilitado do botão é o feedback. Mantém a fluência da conversa.

## Pergunta Ativa

Apenas **uma pergunta está ativa por vez**. Ela é representada por:
- Última bolha do assistente no histórico
- O input do rodapé renderizado com base no `tipo` dela
- O contador "X de N respondidas" reflete quantas vieram antes

Quando a pergunta é respondida, ela some do input (rodapé) e vira parte do histórico. A próxima pergunta vira a ativa.

Enquanto o typing indicator está ativo, **nenhum input aparece** — o rodapé fica vazio (altura preservada pra não saltar layout). Isso reforça que o bot está "pensando".

## Catálogo de Perguntas

A sequência atual tem **14 perguntas** divididas em 4 grupos lógicos (não exibidos como seções — são todos no mesmo chat):

### 1. Perfil básico (4 perguntas, obrigatórias)
- `nome` (text) — "Qual é o seu nome completo?"
- `idade` (number, 12-100 anos) — "Quantos anos você tem?"
- `peso` (number, 30-250 kg) — "Qual o seu peso atual?"
- `altura` (number, 100-230 cm) — "Qual a sua altura?"

### 2. Contexto biológico e objetivos (2 perguntas, obrigatórias)
- `sexo` (select: Masculino / Feminino / Intersexo / Prefiro não informar) — usado pra benchmarks OMS/ACSM
- `objetivo` (select: Emagrecer / Ganhar massa / Manter peso / Performance / Saúde geral)

### 3. Hábitos (4 perguntas, obrigatórias)
- `atividade` (select: Sedentário / 1-2x / 3-4x / 5+x por semana)
- `pressao` (select: Baixa / Normal / Alta / Não sei)
- `agua` (select: <1L / 1-2L / 2-3L / >3L)
- `sono` (select: <5h / 5-6h / 6-7h / 7-8h / >8h)

### 4. Dados clínicos e devices (4 perguntas, todas opcionais)
- `bioimpedancia` (image) — extração IA do laudo
- `exame` (image) — hemograma/lipidograma/glicemia
- `fotos_corporais` (image, até 4) — frontal, posterior, laterais
- `wearable` (device) — Apple Health / Health Connect

Mensagem da pergunta sempre tem **um ícone colorido contextual** (User, Cake, Scale, Ruler, Target, Activity, Droplet, HeartPulse, Moon, Camera, FileText, Watch) — não decorativo, é parte da identidade da pergunta.

## Skip / Opcionais

Apenas perguntas **clínicas e device** podem ser puladas. Skip:
- Mostra bolha do usuário com texto "Pular" em itálico opacity 70
- Avança normalmente pra próxima pergunta
- Não bloqueia a finalização do onboarding

Perguntas de perfil/hábitos são todas obrigatórias — não há botão skip nelas.

## Progresso

Três indicadores complementares:

1. **Texto no header** — "X de N respondidas" em verde com bullet point (visual mais conversacional, conta respondidas não atual)
2. **Barra linear no header** — Progresso = `respondidas / total`, gradient teal→sky, animação 500ms na mudança
3. **Painel "Seu Progresso"** — bottom sheet com lista detalhada (ver seção abaixo)

Quando todas respondidas: texto vira "Concluído" e barra fica 100%.

## Menu "Seu Progresso" (bottom sheet)

Aberto ao tocar no botão kebab (⋮) no canto superior direito do header. Funciona como um **bottom sheet** que sobe da base, com backdrop escurecido e blur sutil.

### Conteúdo
1. **Header do sheet** — grabber decorativo (barra horizontal) + título "Seu Progresso" + botão `X` pra fechar
2. **Contador** — "X de N respondidas" em verde (mesmo padrão do header principal)
3. **Lista de respondidas** — cada item mostra:
   - Ícone colorido da pergunta (mesma cor do chat)
   - Texto da pergunta em cinza claro pequeno (line-clamp 1)
   - Resposta do usuário em branco médio abaixo
   - Check verde à direita confirmando que foi respondida
4. **Estado vazio** — quando nada foi respondido: "Nada respondido ainda — comece pela primeira pergunta."
5. **Ações** (rodapé do sheet, separadas por borda):
   - **Recomeçar do zero** (botão pill com ícone RotateCcw) — hover âmbar
   - **Sair do onboarding** (link de texto com ícone LogOut) — hover rosa

### Comportamento
- Tap no backdrop fecha o sheet
- Tap no `X` fecha o sheet
- Tap em "Recomeçar" ou "Sair" abre **diálogo de confirmação** (não age direto)
- Scroll independente dentro da lista quando muitas respondidas (max-h 78% da tela)
- Animações: backdrop fade-in 200ms, sheet slide-in-from-bottom 300ms

### Apenas perguntas respondidas aparecem
Perguntas puladas ou ainda não vistas **não aparecem na lista**. Skip não é considerada resposta válida pro painel — fica fora.

## Diálogos de Confirmação

Tanto **Recomeçar** quanto **Sair** abrem um diálogo modal pequeno na base da tela com backdrop escuro.

### Recomeçar do zero (âmbar — ação destrutiva mas recuperável)
- Ícone: `RotateCcw` em âmbar
- Título: "Recomeçar do zero?"
- Descrição: "Todas as suas respostas serão apagadas e você voltará à primeira pergunta."
- Botões: `Cancelar` (slate) · `Recomeçar` (âmbar sólido)
- Confirmar: limpa todas respostas, volta `perguntaIdx` para 0, mostra duas bolhas de retomada ("Sem problema, vamos do início. 👋" + "Suas respostas anteriores foram limpas."), reinicia o chat após 800ms

### Sair do onboarding (rosa — ação reversível)
- Ícone: `LogOut` em rosa
- Título: "Sair do onboarding?"
- Descrição: "Seu progresso fica salvo. Você pode continuar mais tarde de onde parou."
- Botões: `Cancelar` (slate) · `Sair` (rosa sólido)
- Confirmar: navega pra `/mobile/sections/login` (em produção dispara logout)

### Padrão visual dos diálogos
- Backdrop preto 70% opacity + blur sutil
- Card slate-900 com borda slate-800, rounded-2xl
- Ícone colorido em quadrado arredondado (15% bg da cor da ação)
- Grid 2 colunas para botões (Cancelar | Confirmar)
- Sempre na parte inferior da tela (não centro) — mais alcançável com polegar

## Paleta de Cores das Perguntas

Cada pergunta tem uma `cor` que tinge seu ícone:
- `teal` — perguntas de identidade/objetivo
- `sky` — perguntas de medida física
- `emerald` — perguntas de body composition
- `amber` — perguntas de atividade/wearable
- `rose` — perguntas vitais (idade, pressão, fotos)
- `violet` — perguntas demográficas/sono
- `orange` — reservada futura

Cor é aplicada como `bg-{cor}-500/15 text-{cor}-300` (leve, no dark theme).

## Estados Especiais

### Primeira abertura
- Histórico vazio
- Renderiza saudação após mount: 2 bolhas em sequência
- 800ms após, primeira pergunta entra com typing indicator

### Após responder a última pergunta
- Bolha final do bot ("Tudo pronto!") com cor emerald e ícone Sparkles
- 1.4s pra dar tempo de ler
- Auto-redirect pra `/mobile/sections/onboarding-completo`

### Durante typing
- Bot avatar fica fixo
- Rodapé renderiza espaço vazio (h-12) — input não aparece
- Quando typing termina, input renderiza no mesmo lugar (zero layout shift)

## UI Requirements
- Fullscreen, sem tab bar, sem shell
- Background `slate-950` (dark fixo, splash mood)
- Fonte DM Sans pra texto, IBM Plex Mono pra números tabulares
- Touch targets mínimo 44px (chips h-9 ainda OK pois padding aumenta área)
- Auto-scroll respeitando reduced motion (smooth → instant se preferência)
- Status do device (notch/dynamic island) respeitado via safe area

## Configuration
- shell: false
