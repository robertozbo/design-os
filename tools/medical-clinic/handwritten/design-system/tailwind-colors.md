# Cores — Nymos Clínica

Os componentes usam **utilities nativas do Tailwind**. Não há cor customizada para registrar, e
não existe `tailwind.config.js` — o projeto de origem é **Tailwind CSS v4**, que dispensa o arquivo
de config.

| Papel | Paleta | Onde aparece |
|---|---|---|
| Primary | `teal` | Ações primárias, estado ativo da navegação, marca |
| Secondary | `emerald` | Confirmação, valores a receber, status saudável |
| Accent | `coral` | Destaque pontual |
| Neutral | `slate` | Fundos, texto, bordas |

## Cores semânticas em uso

Estas não são tokens de marca, são convenções que os componentes já seguem — mantenha ao estender:

| Significado | Paleta |
|---|---|
| Receita / entrada / sucesso | `emerald` |
| Despesa / saída / erro clínico | `rose` |
| Alerta, vencendo, atenção | `amber` |
| Teleconsulta, informação | `sky` |
| Cancelado, inativo | `slate` |

Cor de status **nunca aparece sozinha** nos designs: sempre acompanha rótulo ou ícone. Preserve isso
— é o que mantém o produto legível para daltônicos e é verificado nas `tests.md`.

## Cores dos médicos

Cada médico tem uma cor fixa, usada no avatar e nos badges de especialidade em várias telas:

| Médico | Especialidade | Cor |
|---|---|---|
| Dra. Helena Prado (logada) | Endocrinologia | `teal` |
| Dr. Otávio Serrano | Cardiologia | `rose` |
| Dra. Vera Nakamura | Nutrologia | `violet` |
| Dr. Rafael Aoki | Clínica Geral | `sky` |
| Dr. Paulo Sette | Clínica Geral | `sky` |
| Dra. Marina Alves | Ginecologia | `amber` |

A cor vem no dado (campo `cor`), não é derivada do nome — ao ligar dados reais, persista essa
escolha por profissional, senão o avatar troca de cor a cada render.

## Exemplos

```
Botão primário      bg-teal-500 hover:bg-teal-600 text-white
Badge secundário    bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300
Texto neutro        text-slate-600 dark:text-slate-300
Superfície          bg-white dark:bg-slate-900
Borda               border-slate-200 dark:border-slate-800
```

## Dark mode

Todo componente do pacote traz variantes `dark:`. O tema é aplicado pela classe `dark` no elemento
raiz (`<html>`), estratégia `class` — não `media`. Cada section tem screenshot nos dois temas.
