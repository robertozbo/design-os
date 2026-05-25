# Profissionais Specification

## Overview
Section dedicada à gestão de vínculos profissional-paciente. Lista profissionais ativos (nutri, personal, médico, psicólogo) e pendências de convite (recebidos pra aceitar/recusar e enviados aguardando resposta). Permite convidar novo profissional via busca por nome/email/código.

## User Flows

### Aba Vinculados
- Lista de profissionais ativos com avatar + nome + especialidade + última interação.
- Toque no card abre detalhe do profissional (com botão chat e desvincular).
- Indicador verde (ponto) pra ativos.

### Aba Convites
- **Recebidos** — convites de profissionais querendo te acompanhar:
  - Card destacado com mensagem opcional do profissional
  - Botões "Aceitar" (verde) e "Recusar" (cinza)
- **Enviados** — convites que você mandou aguardando resposta:
  - Card neutro com timestamp de envio
  - Botão "Cancelar convite"
- Counter de pendentes no chip da aba.

### Adicionar profissional (por código)
- Toque no `+` no header OU botão "Convidar profissional" → abre tela full-screen `AdicionarProfissional`
- Paciente digita o código pessoal fornecido pelo profissional (ex: `RAFA-7K2X`)
- Input com mono + uppercase auto + sanitização (só letras/números/hífen)
- Validação local mínima: 4 chars antes de habilitar "Buscar"
- Tap "Buscar" → estado loading (~600ms) → resolve do backend
- Sucesso: card de preview com avatar do profissional + nome + tipo + registro + mensagem opcional do profissional
- Erro: banner rose "Código não encontrado" + CTA "Tentar novamente" preserva tentativa
- Tap "Continuar" no card → abre `PermissoesCompartilhamento` em modo aceite
- Confirmar permissões dispara `onVincularPorCodigo(codigo, escopo)`

**Decisão de UX:** removida busca livre por nome/email — paciente só vincula via código pessoal compartilhado pelo profissional. Reduz risco de vincular com profissional errado e respeita controle do profissional sobre quem entra.

### Desvincular
- Toque em "Desvincular" abre confirmação dupla.
- Após confirmar, status muda pra inativo (mantém histórico mas para de compartilhar dados).

## UI Requirements
- Header sub-page "Profissionais"
- 2 tabs: Vinculados (counter total) · Convites (counter pendentes)
- Cards com badges por tipo profissional (nutri 🍎 emerald · personal 💪 teal · médico 🩺 sky · psicólogo 🧠 violet)
- Estado vazio com CTA pra convidar
- Sheet de busca/convite com resultados

## Permissões de Compartilhamento

### Trigger

Tap em "Aceitar" no card de convite recebido **não vincula imediatamente**. Abre tela full-screen `PermissoesCompartilhamento` onde o paciente revisa/ajusta quais dados o profissional vai ver. Confirmar nessa tela é o que efetivamente cria o vínculo.

### Categorias (10)

`Métricas básicas · Bioimpedância · Exames laboratoriais · Atividades físicas · Treinos · Fotos corporais · Nutrição · Objetivos · Medicação · Saúde mental`

Categorias **ocultas** por tipo (não aparecem no toggle list):
- **Personal**: exames laboratoriais, medicação, saúde mental
- **Nutricionista**: treinos, saúde mental
- **Médico**: (nenhuma — vê tudo se autorizado)
- **Psicólogo**: bioimpedância, exames, treinos, fotos corporais, nutrição

### Defaults por tipo

| Categoria | Personal | Nutri | Médico | Psicólogo |
|---|---|---|---|---|
| Métricas básicas | ON | ON | ON | off |
| Bioimpedância | ON | ON | ON | — |
| Exames laboratoriais | — | off | ON | — |
| Atividades | ON | off | ON | off |
| Treinos | ON | — | off | — |
| Fotos corporais | off | off | off | — |
| Nutrição | off | ON | ON | — |
| Objetivos | ON | ON | ON | off |
| Medicação | — | off | ON | off |
| Saúde mental | — | — | off | ON |

Legenda: **ON** = ligado por default · *off* = visível mas desligado · `—` = oculta

### UI da tela `PermissoesCompartilhamento`

- **Header** com avatar+inicial do profissional + nome + "Você está vinculando com..." (ou "Editar permissões de" no modo edição)
- **Lista de cards** com toggle visual (não input nativo) — ícone categoria + label + descrição curta de 1 linha
- **Card destacado** quando categoria sensível (fotos corporais, saúde mental) — borda mais visível pra chamar atenção
- **Counter** no topo "X categorias compartilhadas"
- **CTA fixo no rodapé**:
  - Modo aceite: "Confirmar vínculo" (teal)
  - Modo edição: "Salvar alterações" (teal)
- **Botão secundário** "Cancelar" volta sem mudar nada

### Granularidade

**Por profissional individual** — paciente pode ter 2 personals com escopos diferentes. Não é por tipo.

### Editável depois

Detalhe do profissional vinculado ganha link "Permissões de compartilhamento" → abre a mesma tela em modo edição com escopo atual carregado. Salvar aplica **prospectivamente** (dado histórico já visto continua, novo dado respeita escopo atual).

### Categorias automaticamente respeitadas em outras sections

Quando uma categoria está OFF pra um profissional, dados dessa categoria não aparecem em nenhuma tela do profissional (lente do nutri, lente do personal, etc). Backend filtra na query, frontend não precisa esconder.

## Configuration
- shell: true
