# Seletor de Perfil Specification

## Overview
Tela pós-login que decide **qual app** a pessoa vê: o do Personal (profissional) ou o do Aluno (paciente). A decisão é automática pelo `user.role` + `professionalType` devolvidos no login; a tela só aparece quando a conta tem **os dois perfis** (ex.: Elizabete é personal e também treina como aluna de outro profissional).

## Regra de roteamento
- `role = USER` → app do Aluno (MainTabs atual). Tela não aparece.
- `role = PROFESSIONAL` + `professionalType = personal_trainer`, sem vínculo como aluno → app do Personal. Tela não aparece.
- `role = PROFESSIONAL` + também tem vínculo como aluno (`professional_links` onde ela é o paciente) → mostra esta tela.
- Profissional de outro tipo (nutri, médico, psi…) → por ora cai no app do Aluno com aviso "Gestão de pacientes no app chega em breve — use o painel web".
- Última escolha fica salva no aparelho (SecureStore) e vira o default no próximo login; troca a qualquer momento em **Mais → Trocar para perfil Aluno/Personal**.

## User Flows
- Login → backend devolve role + professionalType + `hasPatientProfile`
- Conta com dois perfis → vê esta tela com dois cards grandes
- Toca "Personal" → cai no Início do Personal
- Toca "Aluno" → cai no Início do Aluno
- Toggle "Lembrar minha escolha" (ligado por padrão) → próximo login pula a tela

## UI Requirements
- Sem shell (tela cheia, antes do app)
- Logo + saudação "Oi, Elizabete" + subtítulo "Como você quer entrar agora?"
- Dois cards grandes empilhados, cada um com ícone, título, descrição curta e 2–3 números de contexto (ex.: "18 alunos ativos · 6 sessões hoje")
- Card escolhido por último ganha borda teal e etiqueta "Último acesso"
- Toggle "Lembrar minha escolha"
- Rodapé: "Você pode trocar a qualquer momento em Mais"

## Configuration
- shell: false
