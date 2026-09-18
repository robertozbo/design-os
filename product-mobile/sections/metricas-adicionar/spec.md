# Adicionar Registro de Métrica Specification

## Overview

Formulário de cadastro manual de uma leitura de métrica (ex: peso, copos d'água, pressão arterial). Aberto pelo "+" no header de Métricas ou pelo botão "Adicionar registro" na tela de detalhe. Permite escolher a métrica, digitar o valor (com unidade), confirmar data/hora e adicionar uma nota. Renderiza full-screen com header próprio.

## User Flows

- Usuário toca em "+" em Métricas → abre o formulário com o picker de métrica aberto
- Usuário toca em "Adicionar registro" no detalhe → abre o formulário com a métrica já pré-selecionada
- Usuário escolhe a métrica (chips agrupados por categoria) → some o picker e aparece o campo de valor
- Usuário digita o valor → botão "Salvar registro" habilita
- Métrica composta (pressão arterial) → dois campos (sistólica / diastólica)
- Usuário ajusta data/hora (default Hoje / Agora) e nota opcional
- Usuário salva → volta pro detalhe da métrica com o novo registro

## UI Requirements

Fundo `slate-950`, header próprio (← + "Adicionar registro"). Estrutura:

1. **Seletor de métrica:**
   - Sem seleção: chips selecionáveis agrupados por categoria (Composição, Cardio, Atividade, Sono, Hidratação, Outros). Chip ativo `teal-500` com check.
   - Com seleção: card compacto (ícone + nome + unidade) + link "Trocar".
2. **Valor — 3 modos conforme a métrica:**
   - **Escalar** (ex: Peso, Passos): um input numérico grande + unidade.
   - **Composto** (ex: Pressão arterial): dois inputs independentes lado a lado (Sistólica / Diastólica), cada um com unidade.
   - **Derivado/calculado** (ex: IMC): dois inputs de entrada (Peso + Altura) e um **card de resultado calculado em tempo real** (`IMC = peso / altura²`). Salva o valor calculado + as entradas brutas.
3. **Data / Hora:** dois campos (default "Hoje" / "Agora").
4. **Nota:** textarea opcional.
5. **Fonte:** indicador "Manual".
6. **Botão "Salvar registro":** `teal-500`, full width, desabilitado até ter valor.

**Navegação:** recebe métrica pré-selecionada via query param `?m=[id]` (opcional).

**Dados:** as opções de métrica vêm do catálogo da seção `metricas`. No app real o submit chama `POST /metrics`.

Fora do escopo: validação de faixas, upload de foto do aparelho, criação de tipo de métrica customizado.

## Configuration

- shell: false
