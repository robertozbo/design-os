import { Fragment, useMemo, useState } from 'react'
import { CalendarX2, ChevronDown, Clock } from 'lucide-react'
import type { ChegadaData } from '@/../product-clinic/sections/chegada/types'
import type { StatusConsulta } from '@/../product-clinic/sections/_shared/status'
import { CapturaCodigo } from './CapturaCodigo'
import { LinhaPaciente } from './LinhaPaciente'
import { agrupar, dataExtenso, filtrarPorNome, minutos, type ErroCodigo } from './helpers'

interface Props {
  dia: ChegadaData
  codigo: string
  onCodigo: (v: string) => void
  erroCodigo: ErroCodigo | null
  busca: string
  onBusca: (v: string) => void
  /** Id da linha que acabou de receber chegada — fica destacada por um instante. */
  destacada: string | null
  onStatus: (id: string, status: StatusConsulta) => void
}

export function ChegadaView({
  dia,
  codigo,
  onCodigo,
  erroCodigo,
  busca,
  onBusca,
  destacada,
  onStatus,
}: Props) {
  const [verEncerradas, setVerEncerradas] = useState(false)

  const grupos = useMemo(() => agrupar(filtrarPorNome(dia.linhas, busca)), [dia.linhas, busca])
  const total = useMemo(() => agrupar(dia.linhas), [dia.linhas])
  const faltas = total.encerradas.filter((l) => l.status === 'faltou').length

  const vazio =
    grupos.naClinica.length === 0 && grupos.proximas.length === 0 && grupos.encerradas.length === 0

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-6 py-3 pl-16 lg:pl-6 dark:border-slate-800 dark:bg-slate-950">
        <div>
          <h1 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            {dataExtenso(dia.data)}
          </h1>
          <p className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] text-slate-400">
            <Clock className="h-3 w-3" /> {dia.agora} · balcão de {dia.recepcionista}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Contador label="Na clínica" valor={total.naClinica.length} tom="sky" />
          <Contador label="Por vir" valor={total.proximas.length} tom="slate" />
          <Contador label="Encerradas" valor={total.encerradas.length - faltas} tom="slate" />
          <Contador label="Faltas" valor={faltas} tom="rose" />
        </div>
      </div>

      <CapturaCodigo
        codigo={codigo}
        onCodigo={onCodigo}
        erro={erroCodigo}
        busca={busca}
        onBusca={onBusca}
      />

      {/* Lista */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {vazio ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
            <CalendarX2 className="h-8 w-8" />
            <p className="text-sm">
              {busca ? 'Nenhum paciente com esse nome hoje' : 'Nenhuma consulta neste dia'}
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl space-y-6">
            {grupos.naClinica.length > 0 && (
              <Grupo titulo="Na clínica" contagem={grupos.naClinica.length}>
                {grupos.naClinica.map((l) => (
                  <LinhaPaciente
                    key={l.id}
                    linha={l}
                    agora={dia.agora}
                    destacada={destacada === l.id}
                    onStatus={onStatus}
                  />
                ))}
              </Grupo>
            )}

            {grupos.proximas.length > 0 && (
              <Grupo titulo="Próximas" contagem={grupos.proximas.length}>
                {grupos.proximas.map((l, i) => (
                  <Fragment key={l.id}>
                    {/* A régua cai uma única vez, antes da primeira consulta que
                        ainda não chegou na hora — separa "devia estar aqui" de
                        "ainda vem". */}
                    {minutos(l.hora) > minutos(dia.agora) &&
                      (i === 0 || minutos(grupos.proximas[i - 1].hora) <= minutos(dia.agora)) && (
                        <li aria-hidden className="flex items-center gap-2 py-0.5">
                          <span className="h-px flex-1 bg-rose-300 dark:bg-rose-500/50" />
                          <span className="shrink-0 text-[10px] font-medium tabular-nums text-rose-500 dark:text-rose-400">
                            agora · {dia.agora}
                          </span>
                          <span className="h-px flex-1 bg-rose-300 dark:bg-rose-500/50" />
                        </li>
                      )}
                    <LinhaPaciente
                      linha={l}
                      agora={dia.agora}
                      destacada={destacada === l.id}
                      onStatus={onStatus}
                    />
                  </Fragment>
                ))}
              </Grupo>
            )}

            {grupos.encerradas.length > 0 && (
              <div>
                <button
                  onClick={() => setVerEncerradas((v) => !v)}
                  aria-expanded={verEncerradas}
                  className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${verEncerradas ? '' : '-rotate-90'}`}
                  />
                  Encerradas
                  <span className="font-normal">({grupos.encerradas.length})</span>
                </button>
                {verEncerradas && (
                  <ul className="space-y-2">
                    {grupos.encerradas.map((l) => (
                      <LinhaPaciente
                        key={l.id}
                        linha={l}
                        agora={dia.agora}
                        destacada={false}
                        onStatus={onStatus}
                      />
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Grupo({
  titulo,
  contagem,
  children,
}: {
  titulo: string
  contagem: number
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="mb-2 text-xs font-semibold text-slate-400">
        {titulo} <span className="font-normal">({contagem})</span>
      </h2>
      <ul className="space-y-2">{children}</ul>
    </div>
  )
}

const TOM: Record<'sky' | 'slate' | 'rose', string> = {
  sky: 'text-sky-700 dark:text-sky-300',
  slate: 'text-slate-700 dark:text-slate-300',
  rose: 'text-rose-700 dark:text-rose-400',
}

function Contador({ label, valor, tom }: { label: string; valor: number; tom: keyof typeof TOM }) {
  return (
    <div className="rounded-xl border border-slate-200 px-3 py-1.5 text-center dark:border-slate-800">
      <div className={`text-base font-semibold tabular-nums leading-none ${TOM[tom]}`}>{valor}</div>
      <div className="mt-0.5 text-[10px] text-slate-400">{label}</div>
    </div>
  )
}
