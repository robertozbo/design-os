import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  isoFoco: string
  diasComConsulta: Set<string>
  onSelecionarDia?: (iso: string) => void
}

const DIAS_HEAD = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function toLocalIso(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function MiniCalendar({ isoFoco, diasComConsulta, onSelecionarDia }: Props) {
  const [anoFoco, mesFoco] = isoFoco.split('-').map(Number)
  const ano = anoFoco
  const mes = mesFoco - 1 // 0-indexed

  const primeiroDia = new Date(ano, mes, 1)
  const ultimoDia = new Date(ano, mes + 1, 0)
  const diasMes = ultimoDia.getDate()
  const offsetInicial = primeiroDia.getDay() // 0 = domingo
  const totalCelulas = Math.ceil((offsetInicial + diasMes) / 7) * 7

  const cells: { iso: string; numero: number; ehMesAtual: boolean }[] = []
  for (let i = 0; i < totalCelulas; i++) {
    const dataReal = new Date(ano, mes, i + 1 - offsetInicial)
    const ehMesAtual = dataReal.getMonth() === mes
    const iso = toLocalIso(dataReal)
    cells.push({ iso, numero: dataReal.getDate(), ehMesAtual })
  }

  const isoHoje = toLocalIso(new Date())
  const labelMes = new Date(ano, mes, 1)
    .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    .replace(/^./, (c) => c.toUpperCase())

  return (
    <div className="mx-auto w-full max-w-[280px] rounded-xl border border-slate-200/80 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-tight text-slate-700 dark:text-slate-200">
          {labelMes}
        </h3>
        <div className="flex items-center gap-0.5">
          <button
            className="
              rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700
              dark:hover:bg-slate-800 dark:hover:text-slate-200
            "
            aria-label="Mês anterior"
          >
            <ChevronLeft className="size-3" />
          </button>
          <button
            className="
              rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700
              dark:hover:bg-slate-800 dark:hover:text-slate-200
            "
            aria-label="Próximo mês"
          >
            <ChevronRight className="size-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center">
        {DIAS_HEAD.map((d, i) => (
          <div key={i} className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
            {d}
          </div>
        ))}
        {cells.map((c) => {
          const ehHoje = c.iso === isoHoje
          const ehFoco = c.iso === isoFoco
          const temConsulta = diasComConsulta.has(c.iso)
          return (
            <button
              key={c.iso}
              onClick={() => onSelecionarDia?.(c.iso)}
              className={`
                relative aspect-square text-[11px] tabular-nums transition-all
                rounded-md
                ${
                  !c.ehMesAtual
                    ? 'text-slate-300 dark:text-slate-700'
                    : ehFoco
                    ? 'bg-teal-600 font-semibold text-white shadow-sm'
                    : ehHoje
                    ? 'bg-teal-50 font-semibold text-teal-700 ring-1 ring-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-900'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }
              `}
            >
              {c.numero}
              {temConsulta && c.ehMesAtual && !ehFoco && (
                <span className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-teal-500/80" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
