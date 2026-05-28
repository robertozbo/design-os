# Privacidade e Segurança Specification

## Overview
Tela dedicada acessada por Configurações → Privacidade e Segurança. Consolida três contextos historicamente espalhados: controles de **segurança da conta** (biometria, PIN, sessões, senha, 2FA), **preferências de privacidade de dados** (compartilhamento anônimo, IA, visibilidade) e **direitos LGPD** (exportar, histórico de consentimentos, excluir conta).

Substitui o link mudo atual ("Privacidade e Segurança" sem destino) por uma central de controle pessoal sobre privacidade e segurança da conta — exigência crescente em apps de saúde pelo nível de sensibilidade dos dados.

## User Flows

### Segurança
- Toque em **"Biometria"** ativa/desativa Face ID / Touch ID. Estado persistido em preferências locais (Keychain iOS, Keystore Android). Quando ativo, biometria é exigida ao abrir o app após inatividade > 5min.
- Toque em **"PIN de bloqueio"** abre fluxo dedicado para definir/trocar PIN (4 dígitos). Quando ativo, complementa biometria como fallback.
- Toque em **"Sessões ativas"** abre lista de dispositivos conectados com nome, última atividade, localização aproximada, ação "Encerrar sessão" por item (exceto a atual). Botão "Encerrar todas as outras" no rodapé.
- Toque em **"Trocar senha"** abre form com senha atual + nova + confirmação. Backend valida força mínima (8 chars, 1 número, 1 maiúsculo).
- Toque em **"Verificação em duas etapas"** abre fluxo de setup (TOTP / SMS). Quando ativo, mostra app autenticador atual + códigos de recuperação.

### Privacidade
- Toggle **"Compartilhar dados anônimos para pesquisa"**: ao ativar, mostra modal explicando exatamente o que é compartilhado (métricas agregadas, sem identificação). Persiste em `userConsents`.
- Toggle **"IA pode usar meus dados"**: locked em planos Pro (sempre on por contrato), togglável em planos Free. Quando ativo, hábitos viram contexto pra Nymos AI.
- Toque em **"Visibilidade do perfil"** abre escolha entre Público / Profissionais conectados / Privado. Default = Profissionais conectados.

### Direitos LGPD
- Toque em **"Exportar meus dados"** dispara backend job que gera JSON com tudo (perfil, métricas, consentimentos, mensagens, exames). Modal informa "Você receberá email com link em até 48h". Conforme LGPD art. 18.
- Toque em **"Histórico de consentimentos"** abre lista cronológica de todos consentimentos aceitos/revogados (ToS, política de privacidade, IA, compartilhamento) com data, IP, versão do termo.
- Toque em **"Excluir conta"** dispara modal de confirmação dupla:
  - Step 1: aviso sobre permanência + checkbox "Entendo que isto é irreversível"
  - Step 2: re-autenticação (senha ou biometria)
  - Backend agenda hard delete em 30 dias (LGPD art. 18 + janela de arrependimento). Notificação de cancelamento no email com 1 clique.

## UI Requirements

### Layout
- Header sub-page "Privacidade e Segurança" com botão back, subtítulo curto "Dados e permissões"
- ScrollView com 3 grupos visuais (cards arredondados estilo iOS Settings)
- Tema dark default (slate-900 cards sobre slate-950 fundo), suporte light (white cards sobre stone-50)
- Cada grupo tem header pequeno em uppercase tracking
- Cada item: ícone colorido em quadrado arredondado (40px) à esquerda, label + descrição opcional, controle à direita (toggle ou chevron)

### Cores por contexto
- **Segurança**: violet (Shield, Fingerprint, Lock, Smartphone, Key, ShieldCheck)
- **Privacidade**: sky (UserCheck, Sparkles, Eye)
- **LGPD**: amber para informativos (Download, History), rose para "Excluir conta"

### Estados especiais
- **Toggle locked** (IA pode usar meus dados em Pro): ícone com cadeado amber sobreposto, toggle desabilitado, descrição "(Pro)"
- **Status pill** ao lado da biometria: "Face ID ativo" ou "Não configurado"
- **Sessão atual** marcada com chip "Atual" sky
- **Card de excluir conta**: ícone rose, texto rose, descrição cinza "Permanente · solicitação processada em 30 dias"

### Footer
- Texto pequeno em font-mono cinza: "Dados protegidos por criptografia AES-256 · LGPD compliance · Auditoria contínua"

## Configuration
- shell: true
