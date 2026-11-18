# Início do Personal Specification

## Overview
Primeira tela do app quando o perfil ativo é **Personal**. Versão de bolso do dashboard web (`/professional/personal/dashboard`): responde "quem eu atendo agora e quem precisa de mim hoje?". Cabe em ~1,5 rolagem; KPIs de negócio ficam compactos no fim (detalhe é no web).

## Qual perfil abre (sem tela de escolha)
- `role = USER` → app do Aluno.
- `role = PROFESSIONAL` + `professionalType = personal_trainer` → **entra direto no app do Personal**.
- Conta com os dois perfis (personal que também é aluna): abre no **último perfil usado**; no primeiro login, Personal. Último perfil salvo no aparelho (SecureStore).
- Troca estilo Nubank (pessoa/empresa): avatar do header mostra o perfil ativo + mini-ícone do outro perfil no canto. Toque → sheet "Escolha o perfil" com os dois perfis e check no ativo. Troca o navigator raiz sem novo login.
- Profissional de outro tipo → app do Aluno por ora.

## Fonte dos dados (tRPC existente)
- Agenda do dia → `professional.agenda` / `professional.appointments`
- Alunos e adesão → `professional.patients` + `professional.activities`
- Reavaliações → `professional.anthropometricAssessment` (última avaliação > 60 dias)
- Mensagens não lidas → `professional.messages`
- Indicações → `professional.referrals`
- Lacuna: não há procedure agregadora do dashboard personal (só `dashboardNutri`). Criar `professional.dashboardPersonal.summary` para o mobile fazer 1 chamada.

## User Flows
- Abre o app → vê próxima sessão em destaque com contagem regressiva e ações "Check-in" / "Abrir ficha"
- Rola a agenda do dia (linha do tempo horizontal compacta) → toca → ficha do aluno
- Vê "Precisam de você" (adesão baixa, 7+ dias sem treinar, relato de dor, reavaliação atrasada) → toca → ficha do aluno
- Vê treinos executados hoje pelos alunos (carga/RPE registrados no app do aluno)
- Atalhos: Nova avaliação · Aplicar treino · Convidar aluno · Mensagem
- KPIs do mês: alunos ativos, sessões, adesão média

## Navegação do app Personal (bottom tabs)
1. **Início** — este dashboard
2. **Alunos** — lista, busca, ficha (treino atual, avaliações, evolução, anamnese)
3. **Agenda** — dia/semana, check-in, remarcar
4. **Treinos** — templates, biblioteca de exercícios, aplicar em aluno
5. **Mais** — Avaliações, Mensagens, Indicações, Plano, Configurações, Trocar perfil, Sair

## UI Requirements
- Shell padrão com header "Olá, Elizabete" e tab bar do Personal
- Header: avatar com mini-ícone do outro perfil (abre o sheet de troca) + subtítulo "Perfil Personal"
- Card "Próxima sessão" em destaque (gradiente teal) com hora, aluno, tipo, local/online
- Agenda do dia em lista compacta com status por dot (realizada, confirmada, agendada, faltou)
- "Precisam de você" com ícone por motivo: TrendingDown (adesão), Clock (sem treino), AlertTriangle (dor), CalendarClock (reavaliação)
- "Treinaram hoje" com carga/RPE resumidos
- Grid 2x2 de atalhos
- Strip de 3 KPIs no rodapé
- Sem emoji; ícones Lucide de traço

## Configuration
- shell: true
