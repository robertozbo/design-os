# Relatórios Médicos Specification

## Overview
Os **documentos clínicos que o médico emite para o paciente** — relatório médico, atestado, laudo, declaração de comparecimento e relatório de evolução. O médico clica em "Novo relatório", escolhe **paciente → tipo → consulta**, e o texto sai preenchido a partir do que já está registrado naquela consulta (motivo, avaliação, conduta, CID). O documento é renderizado na tela em folha timbrada com assinatura e, dali, vira **PDF** ou é **enviado por e-mail** ao paciente. Não confundir com a section `relatorios`, que é o painel gerencial do Admin: aqui é conteúdo clínico, e só o médico acessa.

## User Flows

### Ver os documentos emitidos
- Médico abre Relatórios → resumo (total, enviados, rascunhos) + lista dos documentos, do mais recente para o mais antigo
- Cada linha: paciente, tipo, número (`REL-2026-0148`), data da consulta, motivo e status
- Busca por paciente, número ou motivo · filtro por tipo
- Clicar na linha abre o documento; PDF e E-mail estão direto na linha, sem abrir

### Novo relatório (3 passos)
1. **Paciente** — lista dos pacientes do médico (idade, convênio, nº de consultas)
2. **Tipo** — os cinco modelos, cada um com a descrição do que ele serve
3. **Consulta** — as consultas daquele paciente com data, horário, motivo e CID; mais o campo que o tipo exige:
   - Atestado → **dias de afastamento** (atalhos 1/2/3/5/7/15 ou digitado), com prévia de "02 (dois) dias a contar de … · retorno em …"
   - Declaração → horário vem da consulta (só informa)
   - Evolução → período vem da primeira consulta até a escolhida (só informa)
- "Gerar relatório" monta o texto e abre a **prévia do documento**

### Prever, editar e emitir
- Documento em folha timbrada: cabeçalho da clínica (CNPJ, endereço, contato), número e data de emissão, bloco de identificação (paciente, CPF, idade, convênio, data da consulta, CID, especialidade, profissional), corpo em parágrafos e assinatura (nome, CRM, RQE) + nota de assinatura digital ICP-Brasil
- "Editar texto" transforma o corpo em textarea (parágrafos separados por linha em branco); "Salvar texto" grava nova versão
- "Baixar PDF" gera o arquivo (mock, com toast)

### Enviar por e-mail
- "Enviar por e-mail" abre o compositor com **para** (e-mail do paciente), **assunto** e **mensagem** pré-preenchidos, e o PDF anexado
- Exige marcar a **autorização do paciente** (LGPD) — sem isso, "Enviar" fica desabilitado
- E-mail inválido → erro inline e envio bloqueado
- Enviado → status vira "Enviado", e a prévia passa a mostrar "Enviado para … em …"

## UI Requirements

### Lista (`RelatoriosMedicosView`)
- **Header**: "Relatórios" + médico, CRM e clínica + botão "+ Novo relatório"
- **Resumo**: 3 números — Documentos, Enviados (emerald), Rascunhos (slate)
- **Busca** (paciente / número / motivo) + **filtros de tipo** (Todos · Relatório médico · Atestado · Laudo · Declaração · Evolução)
- **Linha**: ícone + paciente + chip do tipo + `número · consulta em dd mmm aaaa · motivo` + chip de status + ações PDF e E-mail
- Vazio → "Nenhum documento com esse filtro."

### Novo relatório (`NovoRelatorioModal`)
- Modal com stepper de 3 passos; "Avançar" só habilita com a escolha do passo feita
- Trocar de paciente **limpa a consulta** já escolhida
- Consulta sem CID → aviso âmbar de que as linhas de CID saem do documento
- "Gerar relatório" exige paciente + tipo + consulta (e dias ≥ 1 no atestado)

### Prévia (`RelatorioPreview`)
- Barra fixa: Voltar · número + chips (tipo, status) · Editar texto / Salvar texto · Baixar PDF · Enviar por e-mail
- Folha centralizada (máx. 3xl), fundo cinza atrás, sombra e ring — leitura de documento, não de tela de app
- Corpo justificado, `leading-7`

### E-mail (`EnviarEmailModal`)
- Para / Assunto / Mensagem pré-preenchidos · anexo `rel-2026-0149-atestado.pdf` · toggle de autorização do paciente
- "Enviar" habilita só com e-mail válido + assunto + autorização

### Estados & regras
- Status: rascunho (slate) · emitido (âmbar) · enviado (emerald)
- Numeração sequencial `REL-2026-NNNN` a partir do maior número existente
- **Parágrafo com placeholder vazio é descartado** — sem CID, a linha do CID não é impressa. Documento médico com lacuna volta do convênio
- Atestado escreve os dias por extenso: `02 (dois) dias`
- Datas montadas sem `new Date()` no parse (fuso viraria o dia)

## Design Notes
- Nymos (teal, DM Sans), light/dark, props-based, sem fetch interno
- Modelos vivem em `data.json` como texto com `{{placeholders}}` — trocar o texto do atestado é editar dado, não componente
- A folha usa `bg-white`/`dark:bg-slate-900` com ring: no dark ela continua legível como documento, sem virar papel branco no escuro
