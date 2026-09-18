# Publicações Specification

## Overview
O módulo **Marketing** montado sobre o workspace interno da Nymos. É a mesma tela que a clínica usa,
rodando o mesmo componente (`PublicacoesModulo`) — o que muda são os dados do tenant: outra conta do
Instagram, outra cota, outro autor.

Existe por dois motivos. O primeiro é prático: a Nymos publica o conteúdo dela por aqui. O segundo é
estrutural — enquanto esta section montar o mesmo componente da clínica, o multi-tenant do módulo é
verificável; no dia em que ela precisar de um componente próprio, virou conversa fiada.

## O que muda no tenant interno
- **Conta própria** (`@nymos.saude`): o limite de 50 publicações/dia da API é por conta, então o
  back-office nunca disputa cota de publicação com cliente nenhum.
- **Sem add-on.** O workspace interno não compra o módulo que a empresa vende; a cota é própria e
  mais folgada.
- **Autor sem conselho.** Post da Nymos não tem CRN nem CRM, então o validador não aplica código de
  ética profissional — aplica o que vale para publicidade de produto de saúde e as vedações da LGPD,
  que valem para todo mundo. É por isso que a regra sai de `autor.conselho` e não de uma constante:
  um `if tenant === 'nymos'` deixaria o back-office publicando sem validação nenhuma.
- **Registro no cartão desligado**, pela mesma razão: não há registro profissional a exibir.

## User Flows
Idênticos aos da section da clínica (ditar, gerar, revisar, refazer, agendar, publicar, reconectar
conta, pauta semanal) — ver `product-clinic/sections/publicacoes/spec.md`. Não restate aqui: o dia em
que os dois textos divergirem, um dos dois estará errado e ninguém vai saber qual.

## UI Requirements
- Sem tela própria: monta `PublicacoesModulo` com `product-admin/sections/publicacoes/data.json`.
- Nav do back-office, grupo **Marketing**.

## Configuration
- shell: true
