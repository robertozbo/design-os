# Tipografia — Nymos Clínica

| Uso | Fonte |
|---|---|
| Títulos | DM Sans |
| Corpo | DM Sans |
| Mono | IBM Plex Mono |

## Import (Google Fonts)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
  href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=IBM+Plex+Mono:wght@400;500&display=swap"
  rel="stylesheet"
>
```

Se o seu framework tiver carregador próprio de fontes (`next/font`, por exemplo), prefira ele — o
link acima é o fallback genérico.

## Onde a mono é usada

Não é decorativa. Aparece onde o alinhamento de dígitos importa para a leitura clínica: valores de
exame, doses, horários da agenda e identificadores. Trocar por proporcional desalinha colunas de
resultado — mantenha `IBM Plex Mono` (ou outra mono com altura de x parecida) nesses lugares.
