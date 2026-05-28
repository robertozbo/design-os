# Visibilidade do Perfil Specification

## Overview
Tela acessada via Privacidade e Segurança → Visibilidade do perfil. Controla quem pode encontrar e ver o perfil do usuário dentro da plataforma — público, profissionais conectados ou privado. Decisão direta com 3 opções e impacto descrito por opção.

## Princípios
- **Default seguro**: novos usuários começam em "Profissionais conectados" (compromisso entre utilidade e privacidade)
- **Granularidade clara**: o que cada nível expõe é descrito explicitamente, sem ambiguidade
- **Sem efeito retroativo destrutivo**: mudar para "Privado" não apaga dados já vistos por outros; apenas impede novos acessos

## User Flow

1. Usuário toca "Visibilidade do perfil" em Privacidade e Segurança → navega para `ProfileVisibility`
2. Tela mostra explicação curta no topo: "Quem pode encontrar e ver seu perfil"
3. 3 opções como cards grandes, uma por linha:
   - **Público** (Globe, icon emerald): "Qualquer pessoa pode encontrar e ver seu perfil. Ideal para profissionais que querem visibilidade."
   - **Profissionais conectados** (UserCheck, icon sky): "Apenas profissionais com vínculo ativo (nutri, personal, médico) podem ver suas informações compartilhadas."
   - **Privado** (Lock, icon slate): "Ninguém pode ver seu perfil além de você. Conexões existentes ficam inativas até reabertura manual."
4. Cada card mostra:
   - Ícone colorido em quadrado 40px
   - Título 14px semibold
   - Descrição 12px slate
   - Mini-lista de "o que outras pessoas veem" quando aplicável
   - Radio check à direita (verde quando selecionado)
5. Toque seleciona instantaneamente (sem botão "Salvar" — UX iOS-like)
6. Toast curto "Visibilidade alterada" desce do topo após mudança
7. Banner persistente no rodapé quando "Privado" está ativo: "Suas conexões existentes ficam pausadas. Reabra manualmente para retomar."

## Edge cases
- Mudando de Público → Privado: confirmação modal "Suas conexões serão pausadas. Profissionais não receberão atualizações até você reabrir." → botões Confirmar (rose) / Cancelar
- Mudando de Privado → Profissionais/Público: sem confirmação (volta ao estado de utilidade)
- Loading: card selecionado mostra spinner pequeno enquanto a request é enviada

## UI Requirements

### Layout
- Header sub-page "Visibilidade do perfil" com subtítulo "Quem pode ver suas informações"
- ScrollView com 3 cards de opção + banner condicional

### Card de opção
- Border 1px, padding 16
- Selecionado: ring 2px da cor do contexto + bg slightly mais claro
- Hover/active: bg muted
- Header: ícone + título + radio à direita
- Body: descrição
- Lista "Quem vê o quê" em 2-3 bullets pequenos

### Cores por nível
- Público: emerald (positivo, abertura)
- Profissionais conectados: sky (neutro, default)
- Privado: slate (recolhido)

### Banner Privado
- Border amber, bg amber-500/10
- Ícone Info amber + texto curto
- Botão secundário "Reabrir conexões" (navega para tela de conexões)

## Configuration
- shell: false
