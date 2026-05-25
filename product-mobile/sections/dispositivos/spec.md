# Dispositivos Specification

## Overview

Tela de gerenciamento de dispositivos conectados (smartwatches, pulseiras, balanças de bioimpedância, apps de saúde). Acessada pelo ícone ⌚ do header ou pela aba "Mais". Mostra status de cada device, última sincronização, tipos de dado importados, e permite adicionar/remover/sincronizar manualmente. É a fonte de verdade do que alimenta as Métricas e Minha Saúde.

## User Flows

- Usuário acessa "Dispositivos" → vê lista de devices conectados, ou empty state se nenhum
- Usuário toca em um device → abre detalhes (modelo, tipos de dado, última sync, toggle por tipo de dado, botão sincronizar)
- Usuário toca em "+ Novo dispositivo" → abre modal/sheet com categorias (Smartwatches, Balanças, Pulseiras, Apps de Saúde) e marcas (Apple Watch, Garmin, Fitbit, Whoop, Oura, balanças, Apple Saúde, Google Fit, Health Connect)
- Usuário toca numa marca → flow de pareamento (Bluetooth pair OU autorização HealthKit/Health Connect)
- Usuário filtra por status: Todos / Conectados / Desconectados
- Usuário toca em "Sincronizar tudo" no header → triggera sync de todos os devices
- Usuário desconecta um device pelo menu de ações (...)
- Usuário recebe toast de sucesso/erro após sync ou pareamento

## UI Requirements

### Header (sub-page)

- Botão back `<` à esquerda
- Título: "Dispositivos" + subtítulo "Maio 2026" (ou contextual)
- Ação à direita: botão "+ Novo dispositivo" (estilo outline teal, pill rounded-full)
- Ícone settings `⚙` para configurações de sync (frequência, dados padrão)

### Stats row (3 cards)

Linha de 3 mini-cards `slate-900` border `slate-800`:

| Card | Ícone | Valor | Subtítulo |
|------|-------|-------|-----------|
| **Total** | `Smartphone` teal | número | dispositivos cadastrados |
| **Conectados** | `Wifi` emerald (se >0) | número | sincronizando |
| **Última Sync** | `RefreshCw` sky | tempo relativo ("há 5 min") | ou "—" se nunca |

### Filter pills

Pills horizontais (multi-select OFF, single-select):

- **Todos** (default ativo)
- **Conectados**
- **Desconectados**

Ativo: `teal-500` background, `white` texto.
Inativo: `slate-800` background, `slate-300` texto.

### Lista de dispositivos

Cada device é um card vertical `slate-900` border `slate-800` com:

- **Topo (linha 1):**
  - Ícone do dispositivo (28×28) em fundo colorido pelo tipo:
    - Apple Watch: bg `red-500/15` icon `red-400`
    - Garmin: bg `blue-500/15` icon `blue-400`
    - Fitbit: bg `cyan-500/15` icon `cyan-400`
    - Whoop: bg `slate-500/15` icon `slate-300`
    - Oura: bg `violet-500/15` icon `violet-400`
    - Balança: bg `amber-500/15` icon `amber-400`
    - HealthKit/Apple Saúde: bg `pink-500/15` icon `pink-400`
    - Google Fit / Health Connect: bg `green-500/15` icon `green-400`
  - Nome do dispositivo (ex: "Apple Watch Series 9") em DM Sans semibold
  - Subtítulo: marca · modelo / app
  - **Indicador de status** (canto direito): círculo 8px `emerald-400` (conectado), `slate-500` (desconectado), animação spin `teal-400` (sincronizando)
  - Menu `...` com ações: Sincronizar agora, Configurar, Desconectar

- **Linha 2 (chips de tipos de dado):**
  - Mini-chips `slate-800` `rounded-full` com ícone+label dos tipos de dado importados:
    - Passos · BPM · Sono · Calorias · Distância · Peso · Composição · etc.
  - Máximo 4 visíveis, com "+N" se mais

- **Linha 3 (footer):**
  - "Última sync: há 5 min" em `slate-500` mono pequeno
  - Botão sync inline (`RefreshCw` 14×14) com hover state — pulsando se sync em andamento

### Empty state

Quando nenhum device cadastrado (lista vazia):

- Ilustração leve (ícone `Watch` grande em `slate-700`, 64×64)
- Título: "Nenhum dispositivo conectado" em DM Sans semibold 18px `slate-100`
- Descrição: "Conecte seu primeiro dispositivo para sincronizar dados de saúde automaticamente" em `slate-400` 14px
- CTA primário grande: "Adicionar Dispositivo" `teal-500` rounded-full

### Filter empty state

Quando filtro retorna vazio (ex: "Conectados" mas todos estão desconectados):

- Mensagem `slate-400` "Nenhum dispositivo nesse status"
- Pequeno botão "Limpar filtros"

### Modal "Novo dispositivo"

Bottom sheet que sobe da parte inferior:

- Header sheet: "Adicionar dispositivo" + botão fechar X
- Categorias em cards/seções:
  - **Smartwatches**: Apple Watch · Garmin · Fitbit · Galaxy Watch · Polar
  - **Pulseiras**: Whoop · Oura · Mi Band
  - **Balanças**: Balanças Bluetooth (genérico) · Withings · Renpho · Tanita
  - **Apps de Saúde**: Apple Saúde (HealthKit) · Google Fit · Health Connect · Strava
- Cada item linha com ícone + nome + chevron `>`
- Tap → flow de pareamento (Bluetooth ou autorização)

### Cores e padrão

- Fundo: `slate-950` (dark) / `slate-50` (light)
- Cards: `slate-900` / `white` com border `slate-800`
- Primário: `teal-500/600` (CTAs, links)
- Status: `emerald-500` (conectado), `slate-500` (desconectado), `teal-400` (sincronizando — animado)
- Tabular-nums em todos os números (contagem, tempo)
- Tipografia: DM Sans + IBM Plex Mono

### Estados especiais

- **Loading inicial:** skeletons pros 3 stats + 2-3 device cards cinzas
- **Sync em andamento:** ícone do device com spinner pequeno + status "Sincronizando..." em `teal-400`
- **Erro de sync:** badge vermelho "Erro" no card + botão "Tentar novamente"
- **Bluetooth desligado:** banner topo `amber-500/20` "Ative o Bluetooth pra sincronizar"

## Configuration

- shell: true
