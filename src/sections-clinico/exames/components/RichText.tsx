interface Props {
  texto: string
  className?: string
}

/**
 * Renders text with **bold** markdown segments highlighted.
 * Used for IA analysis content where some words are emphasized.
 */
export function RichText({ texto, className = '' }: Props) {
  const parts = texto.split(/(\*\*[^*]+\*\*)/g)
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-slate-900 dark:text-slate-50">
              {p.slice(2, -2)}
            </strong>
          )
        }
        return <span key={i}>{p}</span>
      })}
    </span>
  )
}
