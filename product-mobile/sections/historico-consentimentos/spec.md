# Histórico de Consentimentos Specification

## Overview
Tela acessada via Privacidade e Segurança → Histórico de consentimentos. Lista cronológica auditável dos consentimentos LGPD do usuário — termos aceitos/revogados, versões e datas. Fecha o pilar LGPD junto com Excluir Conta: o usuário tem evidência verificável do que consentiu, quando e em qual versão.

Princípio: **auditabilidade do consentimento** (LGPD art. 9). O usuário pode, a qualquer momento, ver e revogar consentimentos opt-in (marketing, compartilhamento anônimo). Consentimentos obrigatórios (Termos de Uso, Política de Privacidade) podem ser visualizados mas não revogados isoladamente — revogação implica encerramento da conta (linkar para Excluir Conta).

## User Flow

1. Usuário toca "Histórico de consentimentos" em Privacidade e Segurança → navega para `ConsentsHistory`
2. Header lista contadores: "X ativos · Y revogados" no header
3. Toolbar com chips de filtro: Todos · Ativos · Revogados
4. Lista densa, ordenada por data desc, cada linha mostrando:
   - Ícone tipado à esquerda (FileText, Shield, Database, Mail, etc) em quadrado arredondado da cor do contexto
   - Label do tipo + versão chip (mono, `v3.2`)
   - Status pill (Ativo emerald / Revogado rose)
   - Linha 2: data formatada `15 abr 2026 · 14:02` e indicador de tipo (Obrigatório/Opt-in)
   - Chevron à direita para detalhe (modal)
5. Toque em um item abre **modal de detalhe** com:
   - Tipo + versão + status grande
   - Data de aceite e (se aplicável) data de revogação
   - IP de registro (mono, anonimizável em telas de auditoria)
   - Trecho do termo (preview) com link "Ler termo completo" que navega para `TermsContent`
   - Botão "Revogar" rose (somente para opt-in não-críticos: marketing, corporate_followup) — desabilitado para terms_of_use/privacy_policy/data_processing com tooltip "Revogar este consentimento implica excluir a conta"
   - Link "Excluir conta" para os obrigatórios
6. Toque em "Revogar" abre confirmação:
   - Modal: "Revogar consentimento de [tipo]?"
   - Aviso curto sobre impacto: marketing → "Você não receberá mais comunicações de marketing"
   - Botões: Confirmar (rose) / Cancelar
7. Após revogar: status muda inline + toast "Consentimento revogado"
8. Empty states:
   - Lista vazia (nunca aceitou nada — improvável): ilustração leve + texto neutro
   - Filtro "Revogados" vazio: "Você nunca revogou um consentimento"

## UI Requirements

### Layout
- Header sub-page "Histórico de consentimentos" com subtítulo "Termos aceitos, versões e datas"
- Counter strip abaixo do header (3 mini-cards): Total · Ativos · Revogados
- Chips de filtro (segmented control) acima da lista
- ScrollView com lista de cards

### Item de lista
- Card slate com border, padding 12, gap 10
- Ícone colorido em quadrado 36px à esquerda
- Centro: título 13px semibold + linha 2 com versão mono + data + tipo
- Direita: status pill + chevron
- Hover/active: bg ligeiramente mais claro

### Modal de detalhe
- Slide-up sheet ou modal centralizado (~340px)
- Header com ícone grande + tipo + versão
- Stats em grid 2 col: Aceito em · Revogado em (ou —) · IP · Tipo
- Preview do termo em card slate-950 com scroll interno (max ~120px)
- Botões inferiores

### Cores por tipo
- terms_of_use: violet
- privacy_policy: sky (alinhado com Shield em outras telas)
- data_processing: emerald
- marketing: amber
- corporate_followup: violet
- Status Ativo: emerald
- Status Revogado: rose

## Configuration
- shell: false
