import { useMemo, useState } from 'react'
import type { Empregador, Treinamento, Turma } from '@/../product/sections/treinamentos/types'
import { STATUS_TURMA_CLASSES, STATUS_TURMA_LABEL } from './helpers'
import { DiaModal } from './DiaModal'

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** Datas ISO (YYYY-MM-DD) comparam lexicograficamente — nada de Date aqui. */
const cobre = (periodo: { dataInicio: string; dataFim: string }, dia: string) =>
  periodo.dataInicio <= dia && dia <= periodo.dataFim

/**
 * Mês que abre a agenda: o da próxima turma a partir de hoje; sem turma futura,
 * o da última realizada. Evita abrir num mês vazio quando os dados são de demo.
 */
function mesInicial(turmas: Turma[]): Date {
  const hoje = iso(new Date())
  const ordenadas = [...turmas].sort((a, b) => a.dataInicio.localeCompare(b.dataInicio))
  const alvo = ordenadas.find((t) => t.dataFim >= hoje) ?? ordenadas[ordenadas.length - 1]
  if (!alvo) return new Date()
  const [ano, mes] = alvo.dataInicio.split('-').map(Number)
  return new Date(ano, mes - 1, 1)
}

export interface AgendaCalendarioProps {
  turmas: Turma[]
  treinamentos: Treinamento[]
  empregadores: Empregador[]
  onOpenTurma: (id: string) => void
  onNovaTurma: () => void
}

/** Visão calendário da Agenda: as turmas de cada empresa, dia a dia. */
export function AgendaCalendario({
  turmas,
  treinamentos,
  empregadores,
  onOpenTurma,
  onNovaTurma,
}: AgendaCalendarioProps) {
  const [mesRef, setMesRef] = useState(() => mesInicial(turmas))
  const [diaAberto, setDiaAberto] = useState<string | null>(null)
  const hoje = iso(new Date())

  const semanas = useMemo(() => {
    const primeiro = new Date(mesRef.getFullYear(), mesRef.getMonth(), 1)
    const inicio = new Date(primeiro)
    inicio.setDate(1 - primeiro.getDay())
    const linhas: Date[][] = []
    for (let semana = 0; semana < 6; semana++) {
      const dias: Date[] = []
      for (let i = 0; i < 7; i++) {
        const d = new Date(inicio)
        d.setDate(inicio.getDate() + semana * 7 + i)
        dias.push(d)
      }
      // A 6ª linha só entra quando o mês de fato alcança ela
      if (dias.some((d) => d.getMonth() === mesRef.getMonth())) linhas.push(dias)
    }
    return linhas
  }, [mesRef])

  const mesPrefixo = `${mesRef.getFullYear()}-${String(mesRef.getMonth() + 1).padStart(2, '0')}`
  const turmasDoMes = turmas.filter(
    (t) => t.dataInicio.slice(0, 7) <= mesPrefixo && mesPrefixo <= t.dataFim.slice(0, 7),
  )
  const alunosDoMes = new Set(turmasDoMes.flatMap((t) => t.alunos.map((a) => a.trabalhadorId))).size

  const irPara = (delta: number) => setMesRef(new Date(mesRef.getFullYear(), mesRef.getMonth() + delta, 1))

  const navCls =
    'rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => irPara(-1)} className={navCls} aria-label="Mês anterior">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="min-w-[10.5rem] text-center text-sm font-semibold text-slate-900 dark:text-slate-100">
            {MESES[mesRef.getMonth()]} <span className="tabular-nums">{mesRef.getFullYear()}</span>
          </h2>
          <button onClick={() => irPara(1)} className={navCls} aria-label="Próximo mês">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => setMesRef(new Date(new Date().getFullYear(), new Date().getMonth(), 1))}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Hoje
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          <span className="tabular-nums">{turmasDoMes.length}</span> turma{turmasDoMes.length === 1 ? '' : 's'} ·{' '}
          <span className="tabular-nums">{alunosDoMes}</span> alunos
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40">
          {DIAS_SEMANA.map((d) => (
            <div
              key={d}
              className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              <span className="hidden sm:inline">{d}</span>
              <span className="sm:hidden">{d[0]}</span>
            </div>
          ))}
        </div>

        {semanas.map((semana, i) => (
          <div key={i} className="grid grid-cols-7 border-b border-slate-100 last:border-b-0 dark:border-slate-800">
            {semana.map((dia) => {
              const diaIso = iso(dia)
              const doMes = dia.getMonth() === mesRef.getMonth()
              const turmasDoDia = turmas.filter((t) => cobre(t, diaIso))
              return (
                <div
                  key={diaIso}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver o dia ${dia.getDate()}`}
                  onClick={() => setDiaAberto(diaIso)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setDiaAberto(diaIso)
                    }
                  }}
                  className={`min-h-[6.5rem] cursor-pointer border-r border-slate-100 p-1.5 last:border-r-0 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 dark:border-slate-800 dark:hover:bg-slate-800/40 ${
                    doMes ? '' : 'bg-slate-50/60 dark:bg-slate-950/40'
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-xs tabular-nums ${
                        diaIso === hoje
                          ? 'bg-teal-600 font-semibold text-white'
                          : doMes
                            ? 'text-slate-600 dark:text-slate-300'
                            : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {dia.getDate()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {turmasDoDia.map((t) => {
                      const curso = treinamentos.find((c) => c.id === t.treinamentoId)
                      const emp = empregadores.find((e) => e.id === t.empregadorId)
                      return (
                        <button
                          key={t.id}
                          onClick={(e) => {
                            // O chip vai direto para a turma; a célula é que abre o dia.
                            e.stopPropagation()
                            onOpenTurma(t.id)
                          }}
                          title={`${curso?.norma ?? ''} ${curso?.nome ?? ''} · ${emp?.razaoSocial ?? ''} · ${STATUS_TURMA_LABEL[t.status]}`}
                          className={`block w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium hover:brightness-95 ${STATUS_TURMA_CLASSES[t.status]}`}
                        >
                          <span className="font-mono">{curso?.norma}</span>{' '}
                          <span className="font-normal opacity-80">{emp?.razaoSocial ?? curso?.nome}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
        {Object.entries(STATUS_TURMA_LABEL).map(([k, label]) => (
          <span key={k} className="inline-flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-sm ${STATUS_TURMA_CLASSES[k as keyof typeof STATUS_TURMA_LABEL]}`} />
            {label}
          </span>
        ))}
        <button
          onClick={onNovaTurma}
          className="ml-auto font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
        >
          + Agendar turma
        </button>
      </div>

      {diaAberto && (
        <DiaModal
          diaIso={diaAberto}
          turmas={turmas.filter((t) => cobre(t, diaAberto))}
          treinamentos={treinamentos}
          empregadores={empregadores}
          onOpenTurma={onOpenTurma}
          onNovaTurma={onNovaTurma}
          onClose={() => setDiaAberto(null)}
        />
      )}
    </div>
  )
}
