# Validação MVP NR-1 — Plano Tático

> Decisão D4 aprovada: pausar SST e validar adoção do MVP antes de Sprint 4.
> Data: 2026-05-25 · Escopo: módulo SST/NR-1 do Nymos (Design OS)
> Referência: `docs/sst-nr1-paridade-mercado-plan.md` (sprints 1-3)

---

## Objetivo

Provar que o MVP cobre os requisitos NR-1 + LGPD antes de gastar capacidade em Sprint 4 (AET ou outro). 4 frentes de validação rodando em paralelo, em 3 dias úteis.

---

## 1. Validação Visual Local (você sozinho — 1-2h)

**Como:** `pnpm dev` → percorrer as 9 telas e tirar screenshot em light + dark.

| Tela | Rota | O que conferir |
|---|---|---|
| AvaliacoesList | `/sections/avalia-es-de-risco/screen-designs/AvaliacoesList` | Lock simultâneo aparece quando há `em_aplicacao`; mensagem amber legível |
| NovaAvaliacao | `.../NovaAvaliacao` | Passo 1 callout clima vs psico; passo 3 disparo + canais; passo 5 resumo correto; cobertura 60% |
| AvaliacaoDetalhe | `.../AvaliacaoDetalhe` | Tooltip do botão "Publicar" cita 60% |
| MatrizPsicossocial | `.../MatrizPsicossocial` | Clicar célula abre drill-down; testar setor com <3 respondentes mostra bloqueio anti re-ID |
| **ColaboradorEntry** | `.../ColaboradorEntry` | Mobile-first OK; "Não quero responder" → modal → tela final "Decisão registrada" |
| **CartazDivulgacao** | `.../CartazDivulgacao` | Aviso amber visível antes do cartaz; modelo A4 imprime bem (testar `window.print()`) |
| DashboardSst | `/sections/dashboard-sst` | 6 KPIs em desktop; calendário desktop+mobile; Δ Cobertura visível |
| PlanoAcaoBoard | `/sections/plano-de-a-o-and-pgr` | Toggle Kanban/Cronograma funciona; cronograma agrupa por mês |
| TrabalhadorDrawer | (via lista trabalhadores → Novo trabalhador) | Tentar e-mail `rh@empresa.com` → erro inline LGPD |

**Critério de saída:** screenshots de todas em light + dark, salvas na raiz do repo como `<nome>-final.png` para handoff posterior.

---

## 2. Checklist Compliance LGPD (você + revisor legal/DPO — 1 dia)

Lista pra revisor legal/DPO conferir cada invariante:

- [ ] Tela do colaborador deixa claro **voluntariedade ANTES** de qualquer pergunta
- [ ] Modal de recusa promete não-identificação e cumpre (verificar no código)
- [ ] Validação de e-mail bloqueia os **12 padrões genéricos** (`rh@`, `supervisor@`, `contato@`, `gerente@`, `gestor@`, `setor@`, `equipe@`, `time@`, `recursos.humanos@`, `recursoshumanos@`, `noreply@`, `no-reply@`)
- [ ] Trabalhador sem canal vai pra `sem_canal_contato` (não pra "elegível")
- [ ] Status `opt_out_ciclo` é resetado em novo ciclo NR-1
- [ ] Cobertura macro mínima 60% **bloqueia geração de matriz** (não só aviso)
- [ ] **Regra dos 3**: drill-down esconde setor com <3 respondentes com mensagem clara
- [ ] Histórico de campanhas no perfil do trabalhador **NÃO mostra se respondeu** (apenas elegível / opt-out / sem canal)
- [ ] Relatório PDF inclui "Apresentação legal NR-1 · Portaria MTE 1.419/2024"
- [ ] Hash SHA-256 + timestamp aparecem no card de histórico de relatórios

**Evidência:** screenshot anotada de cada check + nota do DPO em e-mail/Linear/Notion.

---

## 3. Validação com Médico/Engenheiro do Trabalho (stakeholder externo — 2 sessões 30min)

Pessoa-alvo: profissional SST que **já trabalha com NR-1** (ideal: cliente potencial Nymos, médico do trabalho ou engenheiro de segurança com carteira de empregadores).

### Sessão 1 — Setup + Avaliação (15min)
- Mostrar `dashboard-sst` → "Você usaria essa visão na rotina?"
- Mostrar `NovaAvaliacaoWizard` 5 passos → "Faltou algum dado pra criar uma avaliação real?"
- Verificar resposta sobre **versão do instrumento** (COPSOQ-3 curta tem 28q ou 41q? Indexmed cita 41q — divergência pendente)

### Sessão 2 — Análise + Handoff (15min)
- Mostrar matriz publicada → clique em célula crítica → drill-down → "Essa transparência ajuda no plano de ação?"
- Mostrar `relat-rios-de-conformidade` PDF preview → "Você assinaria esse relatório? Falta algo pra fiscalização MTE?"
- Mostrar `plano-de-a-o-and-pgr` toggle Kanban/Cronograma → "Qual usaria mais?"

**Roteiro de perguntas abertas:**
1. "Comparado com a ferramenta que você usa hoje, o que sente falta?"
2. "Algum termo/copy está estranho ou ambíguo?"
3. "Tela do colaborador (`ColaboradorEntry`) — o trabalhador entenderia que é anônimo só de ler?"
4. "Cartaz QR — você usaria isso ou consideraria sempre coerção?"

**Critério de saída:** 3-5 ajustes pequenos validados; nenhum gap conceitual gritante. Se aparecer gap conceitual → não avançar sem nova sessão.

---

## 4. Smoke Test Técnico (você — 30min)

Antes de mostrar pra outros:

```bash
# 1. Build limpo
pnpm install && npx tsc --noEmit && npx vite build

# 2. Dev server roda
pnpm dev
# abrir http://localhost:5173 e checar console — zero erros

# 3. Cada section renderiza
# percorrer as 9 telas listadas em §1 sem warning no console
```

**Critério de saída:** build verde, zero erros console, todas as 9 rotas funcionam.

---

## Cronograma sugerido (3 dias úteis)

| Dia | Manhã | Tarde |
|---|---|---|
| **D1** (2026-05-26) | §4 Smoke test + §1 visual local | Capturar todos screenshots (`*-final.png`) |
| **D2** (2026-05-27) | §2 checklist LGPD (sozinho ou com DPO) | Marcar sessão com profissional SST |
| **D3** (2026-05-28) | §3 sessões com profissional | Consolidar feedback + decidir próximo Sprint |

---

## Decisões que saem da validação

Depois dos 3 dias, decidir:

1. **MVP aprovado?** Se sim → freeze 2 semanas em produção pra coletar uso real (telemetria de adoção)
2. **MVP precisa de ajustes?** Lista priorizada de fixes (1-3 dias)
3. **Próximo Sprint?** Com base no feedback do profissional:
   - Se pediu funcionalidades específicas → Sprint 4 com essas demandas
   - Se aprovou tudo → Sprint 4 = AET (próximo módulo SST natural)
   - Se levantou problemas conceituais → re-arquitetura antes de novo módulo

---

## Métricas de adoção (pós-launch — 2 semanas)

Coletar via telemetria depois de aprovar MVP:

| Métrica | Meta | Como medir |
|---|---|---|
| Cobertura macro média das avaliações | ≥60% | Backend Nymos (já existe) |
| % de avaliações com matriz publicada | ≥80% | Backend Nymos |
| % de trabalhadores cadastrados com e-mail individual | ≥85% | Trabalhadores section |
| Taxa de opt-out por ciclo | <15% (alto = perda confiança) | Trabalhadores section |
| Tempo médio do wizard de criação | ≤8min | UX telemetry |
| % de SSTs que abrem drill-down ao menos 1x | ≥50% | UX telemetry |
| NPS pós-uso (semana 2) | ≥40 | In-app survey |

---

## Riscos identificados

| Risco | Mitigação |
|---|---|
| Profissional SST não enxergar diferença vs concorrente | Sessão 3 mostrar diferenciais (líder semanal, mental health contínuo) |
| DPO pedir auditoria externa antes de approve | Documentar o modelo de anonimato técnico no `docs/sst-nr1-paridade-mercado-plan.md` |
| Trabalhador real ignorar e-mail/WhatsApp | Considerar fallback de cartaz QR mesmo sendo "não recomendado" |
| COPSOQ-3 curta tem 41q (não 28) — divergência com mercado | Validar com profissional na Sessão 1 + ajustar `instrumentos[].questoes` |
| Cobertura 60% mostrar-se insuficiente na prática | Manter campo `coberturaMinima` por avaliação editável (já está) |

---

## Próximos Passos

1. Rodar §4 Smoke Test hoje (D1)
2. Tirar screenshots §1 (D1 tarde)
3. Marcar sessão com profissional SST (D2)
4. Após validação → atualizar `docs/sst-nr1-paridade-mercado-plan.md` com resultado de D4
