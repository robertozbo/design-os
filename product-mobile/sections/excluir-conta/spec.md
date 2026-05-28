# Excluir Conta Specification

## Overview
Fluxo acessado via Privacidade e Segurança → Excluir conta. Implementa o direito de eliminação previsto na LGPD art. 18 com **janela de arrependimento de 30 dias** e dupla confirmação (compreensão + re-autenticação) para evitar exclusão acidental.

Uma única tela com expansão progressiva: o usuário precisa reconhecer o impacto (checkbox) antes do campo de senha aparecer, e digitar a senha (ou usar biometria) antes do botão de confirmação ficar habilitado. Após confirmar, a conta entra em estado `pendente_exclusao`, logout automático e modal explicando a janela de reversão.

## Princípios LGPD
- **Não destrutivo imediato**: backend não apaga dados até completar 30 dias — usuário pode reverter fazendo login no app durante esse período
- **Comunicação obrigatória**: email enviado imediatamente com link "Cancelar exclusão" (1 clique)
- **Transparência sobre o que será apagado**: lista explícita pra dispensar surpresa
- **Re-autenticação**: confirma identidade do solicitante (anti-hijack se sessão foi comprometida)
- **Sem retenção de dados pessoais**: após 30 dias, hard delete + log de auditoria anonimizado
- **Dados agregados de pesquisa**: se o usuário deu opt-in pra "Compartilhar dados anônimos", os agregados (já anônimos por desenho) permanecem — aviso explícito na tela

## User Flow

1. SST/Usuário toca "Excluir conta" em Privacidade e Segurança → navega para `DeleteAccount`
2. Hero rose com ícone AlertTriangle + título "Excluir minha conta"
3. Card "O que será apagado" lista: perfil, métricas de saúde, fotos corporais, exames, mensagens, conexões com profissionais, planos ativos, histórico de chat IA
4. Card amber "Sobre dados de pesquisa" (mostrado só se `compartilharDadosAnonimos = true`): "Métricas agregadas anônimas que você compartilhou para pesquisa permanecem na plataforma — não há vínculo com sua identidade."
5. Card slate "Como funciona": ícone Clock + texto "Sua conta entra em janela de 30 dias. Faça login novamente nesse período para cancelar. Após 30 dias, dados são removidos permanentemente."
6. Checkbox grande "Entendo que esta ação é irreversível após 30 dias"
7. **Quando marcado**: campo de senha aparece com transição suave + label "Confirme sua senha" (toggle mostrar/ocultar) + opção "Usar Face ID" se biometria ativa
8. Botão primário rose "Excluir conta agora" (disabled até checkbox + senha)
9. Botão ghost "Cancelar" (volta)
10. Ao confirmar: spinner inline 1s simulado → modal full-screen "Conta marcada para exclusão" com ícone Mail (azul) + texto "Enviamos email com link para cancelar. Você tem 30 dias para reverter." + único botão "Entendi" → logout automático

## Edge cases visuais
- Senha errada (3 tentativas): banner inline rose "Senha incorreta — verifique e tente novamente"
- Sem conexão: banner amber "Sem conexão. Tente novamente quando estiver online"
- Conta já marcada para exclusão (entrada secundária): tela vira read-only com card emerald "Sua conta está em janela de exclusão até [data]" + botão primário "Cancelar exclusão" (verde) que reverte

## UI Requirements

### Layout
- Header sub-page "Excluir conta" com botão back
- ScrollView, padding lateral 16, gap 16
- Tema dark default (slate-900 cards), suporte light (white cards)

### Hero card (topo)
- Background: gradient subtle rose-500/15 → transparente
- Ícone AlertTriangle 28px rose em quadrado arredondado 48px
- Título h1 22px "Excluir minha conta"
- Subtítulo 13px slate-400 "Ação reversível por 30 dias após confirmação"

### Lista "O que será apagado"
- Card slate com header pequeno "O QUE SERÁ APAGADO" uppercase tracking
- 8 linhas: ícone 14px violet à esquerda, texto 13px, sem chevron
- Itens: Perfil e identidade · Métricas de saúde · Fotos corporais · Exames e laudos · Mensagens com profissionais · Conexões ativas · Plano e benefícios · Histórico de chat IA

### Card "Dados de pesquisa" (condicional)
- Border + background amber-500/15
- Ícone UserCheck 14px amber
- Texto 12px explicando que agregados anônimos permanecem

### Card "Como funciona"
- Border + background slate
- Ícone Clock 14px sky
- Texto 13px sobre janela de 30 dias + email de cancelamento

### Checkbox de confirmação
- Border slate-800, padding generoso, full width
- Checkbox 20px rose (não teal — sinaliza ação destrutiva)
- Texto 13px "Entendo que esta ação é irreversível após 30 dias"
- Quando marcado: ring rose-500/40 ao redor

### Campo de senha (revelado)
- Animação fade-in + slide-down 200ms quando checkbox ativa
- Label "Confirme sua senha"
- Input password com ícone Eye/EyeOff toggle direito
- (Opcional) botão secundário "Usar Face ID" abaixo

### Botão primário "Excluir conta agora"
- Background rose-600, hover rose-700, text white
- Disabled: opacity 50, cursor not-allowed
- Loading: spinner inline + texto "Excluindo…"

### Modal final
- Fullscreen overlay slate-950/80
- Card central 320px width
- Ícone Mail 32px sky em quadrado 56px
- Título "Conta marcada para exclusão"
- Texto "Enviamos email com link para cancelar. Você tem 30 dias para reverter."
- Botão único "Entendi" full-width slate-700

## Configuration
- shell: false
