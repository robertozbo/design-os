# Diff Summary · Antes vs Depois

> Comparação lado-a-lado do estado atual (app em produção) com o estado-alvo (protótipo Design OS).

## Geral

| Aspecto | Antes (prod atual) | Depois (target) |
|---|---|---|
| Origem dos dados | Mock "Hipertrofia ABC" (5+ ex/sessão) com nomes inventados | **Plano real prescrito pelo Personal** vinculado |
| Vocabulário | Misto ("Sessão" / "Treino" / "Workout" intercambiáveis) | **Canônico**: Plano · Treino · Sessão · Série · Carga · Descanso |
| Tabs | Não tem | **2 tabs**: "Meu Personal" / "Meus treinos" |
| Referência ao Personal | Sem identificação de quem prescreveu | **"por Rafa Costa · seu Personal"** no hero |
| Agenda semanal | Apenas implícita | **Agenda dia-a-dia explícita** (Seg=A, Ter=B…) com "HOJE" destacado |
| Histórico | Sem stack de execuções estruturado | **Histórico recente** com letra colorida + estrelas + delta de tempo |

## Tela principal

### Header
| Antes | Depois |
|---|---|
| `Treinos` + `Hoje · Quinta` | `Treinos` + `Hoje · Quarta` (mantém formato) |
| Botão history + Botão `+` no top-right | Mantém |

### Tabs (NOVO)
| Antes | Depois |
|---|---|
| — | `[Meu Personal · 3]` (active) · `[Meus treinos · 1]` |

### Hero
| Antes | Depois |
|---|---|
| `PRÓXIMO TREINO · A · Peito · [chip Peito]` | `por Rafa Costa · seu Personal` + `TREINO DE HOJE · Seg, Qua` + `A` + `Peito` + chip Peito |
| Stats: `1 exercícios · 8min` | Stats: `1 exercício · 8min` (gramática + sem kcal) |
| CTA: `Ver treino` | CTA: `Iniciar treino` (gradient teal→sky, com play icon) |

### Plano semanal (NOVO)
| Antes | Depois |
|---|---|
| — | Bloco com 7 linhas: Seg=A · Ter=B · Qua=A `HOJE` · Qui=B · Sex=C · Sáb/Dom=descanso |

### Sessões
| Antes | Depois |
|---|---|
| `A Peito · 1ex · 8min` (mesmo card pra cada sessão) | Lista compacta `A Peito · 1 ex · 8min · Seg, Qua` (com cor por sessão) |

### Histórico (NOVO)
| Antes | Depois |
|---|---|
| Não estruturado | `B Costas · ontem · 8min · 60 kcal · ★★★★☆` |

## Tab "Meus treinos" (NOVO)

| Antes | Depois |
|---|---|
| Inexistente | Lista de treinos próprios do aluno + botão "+ Novo treino" dashed |

## Modo execução (já existe — sem alteração necessária)

| Aspecto | Estado atual | Comentário |
|---|---|---|
| Fase `doing` | ✅ existe | Card exercício + reps + carga + Concluir/Pular |
| Fase `resting` | ✅ existe | Cronômetro circular + Próximo + Pular descanso |
| Fase `finishing` | ✅ existe | Stats + Rating + Notas + Salvar |
| Captura de `repsReal` | Defaulta pro prescrito | OK pra MVP, V2 vira input editável |
| Captura de `loadRealKg` | Defaulta pro prescrito | OK pra MVP, V2 vira input editável |

## Bugs visuais corrigidos

| Bug | Onde aparecia | Fix |
|---|---|---|
| Header "TREINO 02" confuso | Detalhe do treino | Renomear ou remover esse label |
| Ícone engrenagem flutuante sobreposto | Detalhe do treino + modo execução | Reposicionar ou remover (verificar propósito) |
| Stats com `kcal` sem valor (`8min · kcal`) | Histórico | Já corrigido (`estimatedCalories` → `caloriesBurned`) — replicar no app real |

## Removido (não migrar)

| Item | Motivo |
|---|---|
| Plano "Hipertrofia ABC" e outros mocks | Não vinha de backend real |
| Stats `kcal` no hero principal | Não vem da prescrição do Personal |
| Toggle Reps/Tempo no form de cadastro | Foi removido a pedido do profissional |
| Campo RPE | Idem (decisão do profissional) |

## Adicionado (migrar)

| Item | Origem |
|---|---|
| `TreinosData.abaAtiva` | Novo campo no contrato |
| `TreinosData.agendaSemanal` (`AgendaDia[]`) | Novo campo |
| `TreinosData.treinosProprios` (`TreinoProprio[]`) | Novo campo |
| Strip "por [Personal] · seu Personal" no Hero | Nova UI element |
| Bloco `AgendaSemanal` componente | Novo componente |
| Tabs `TabButton` componente | Novo componente |
| Tab `MeusTreinosTab` componente | Novo componente |
