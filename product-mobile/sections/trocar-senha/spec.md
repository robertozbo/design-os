# Trocar Senha Specification

## Overview
Tela acessada via Privacidade e Segurança → Trocar senha. Formulário simples e rigoroso com 3 campos (senha atual, nova, confirmar) e feedback em tempo real sobre força e regras de senha. Backend já entrega validação rigorosa — UI replica regras para evitar round-trip e dar feedback imediato.

## Regras
- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 número
- Nova senha ≠ senha atual (verificado server-side via bcrypt)
- Nova senha == confirmação (verificado client-side)
- Sem requisito de caractere especial (não pedimos para reduzir fricção em mobile)

## User Flow

1. Toque em "Trocar senha" em Privacidade e Segurança → navega para `ChangePassword`
2. Header sub-page "Trocar senha" + subtítulo "Mínimo 8 caracteres, 1 número e 1 maiúscula"
3. 3 campos de senha empilhados:
   - **Senha atual** — input password com toggle Eye, autoComplete=current-password
   - **Nova senha** — input password com toggle Eye + medidor de força + checklist de regras embaixo
   - **Confirmar nova senha** — input password com toggle Eye + check inline quando match
4. Cada regra na checklist tem ícone Circle (vazio) ou CheckCircle (verde) atualizando ao digitar:
   - ≥ 8 caracteres
   - 1 letra maiúscula
   - 1 número
   - Diferente da atual (verifica client-side comparando strings; backend rejeita igual definitiva)
5. Medidor de força com 4 níveis (Fraca, Média, Forte, Excelente) usando barra com gradiente
6. Botão "Atualizar senha" disabled até todas as regras OK + senha atual preenchida + nova == confirmação
7. Submit:
   - Loading no botão
   - Backend valida senha atual via bcrypt
   - Sucesso: modal "Senha atualizada" com ícone Check (verde) + texto "Sua senha foi alterada com sucesso. Use a nova senha no próximo login." + botão "Voltar"
   - Erro "Current password is incorrect" → banner inline rose abaixo do campo atual, focus volta pro campo
   - Erro "New password must be different from current password" → banner inline rose abaixo da nova
   - Erro "Esta conta usa login social" → modal alert "Sua conta usa login social. Use o provedor (Google/Apple) para gerenciar credenciais."
8. Após sucesso, voltar para Privacidade e Segurança (modal fecha + goBack)

## UI Requirements

### Layout
- Header sub-page "Trocar senha" com subtítulo curto
- ScrollView (form pode crescer com keyboard)
- KeyboardAvoidingView para iOS
- Padding generoso entre campos

### Campos de input
- Border 1px slate, rounded-xl, paddingHorizontal 14, paddingVertical 12
- Foco: border teal, ring 2px teal-100
- Erro: border rose, ring 2px rose-100
- Ícone Eye/EyeOff à direita do input, padding 4 hit slop
- Label small acima
- Mensagem de erro small abaixo (rose) quando aplicável

### Medidor de força
- Barra horizontal 3px com 4 segmentos
- Cor por nível: slate (none/weak), amber (medium), emerald (strong), violet (excellent)
- Label "Força: X" pequena à direita
- Cálculo baseado em: comprimento, variedade de caracteres, uppercase, números

### Checklist de regras
- Card slate compacto sob nova senha
- 4 itens com ícone (Circle vazio = pending, CheckCircle verde = OK)
- Texto 12px

### Botão primário
- Bg teal-500, hover teal-600, text white
- Disabled: bg slate-700, cursor not-allowed, opacity 50

### Modal de sucesso
- Card centralizado 320px width
- Ícone CheckCircle 32px emerald em quadrado 56px com bg emerald-500/20
- Título "Senha atualizada"
- Body "Sua senha foi alterada com sucesso. Use a nova senha no próximo login."
- Botão único "Voltar" full-width

### Banner de social login
- Modal alert (Alert.alert no RN) com OK que volta

## Configuration
- shell: false
