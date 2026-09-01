import { AlertTriangle, DoorOpen, LogIn, Play, Video } from 'lucide-react'
import type { LinhaChegada } from '@/../product-clinic/sections/chegada/types'
import type { StatusConsulta } from '@/../product-clinic/sections/_shared/status'
import { TRANSICOES } from '@/../product-clinic/sections/_shared/status'
import { STATUS_META } from '@/sections-clinic/_shared/status-meta'
import { AVATAR_COR, atraso, duracaoCurta, espera } from './helpers'

interface Props {
  linha: LinhaChegada
  agora: string
  destacada: boolean
  onStatus: (id: string, status: StatusConsulta) => void
}

const METODO_LABEL: Record<'codigo' | 'manual', string> = {
  codigo: 'código',
  manual: 'manual',
}

export function LinhaPaciente({ linha, agora, destacada, onStatus }: Props) {
  const meta = STATUS_META[linha.status]
  const emEspera = espera(linha, agora)
  const atrasoMin = atraso(linha, agora)
  // Teleconsulta não passa pelo balcão: não há chegada para registrar e chamar
  // para a sala é ato do médico, na tela dele. Aqui ela aparece só para a
  // recepção saber que existe.
  const noBalcao = linha.modalidade !== 'tele'
  const podeChegar = noBalcao && TRANSICOES[linha.status].includes('chegou')
  const podeIniciar = noBalcao && TRANSICOES[linha.status].includes('em-atendimento')

  return (
    <li
      className={`flex items-stretch gap-3 rounded-2xl border bg-white p-3 transition-all dark:bg-slate-900 ${
        destacada
          ? 'border-sky-500 ring-2 ring-sky-500/30'
          : linha.status === 'em-atendimento'
            ? 'border-teal-500 ring-1 ring-teal-500/30'
            : 'border-slate-200 dark:border-slate-800'
      } ${meta.esmaecido ? 'opacity-60' : ''}`}
    >
      {/* Horário */}
      <div className="flex w-14 shrink-0 flex-col items-center justify-center border-r border-slate-100 pr-3 dark:border-slate-800">
        <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
          {linha.hora}
        </span>
        <span className="text-[10px] tabular-nums text-slate-400">
          {duracaoCurta(linha.duracaoMin)}
        </span>
      </div>

      {/* Paciente */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${AVATAR_COR[linha.cor]}`}
          aria-hidden
        >
          {linha.pacienteIniciais}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {linha.pacienteNome}
            </span>
            <span
              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${meta.chip}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden />
              {meta.label}
            </span>
            {atrasoMin !== null && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                <AlertTriangle className="h-2.5 w-2.5" /> {atrasoMin} min de atraso
              </span>
            )}
          </div>

          <div className="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
            {linha.profissionalNome} · {linha.especialidade} ·{' '}
            {linha.modalidade === 'tele' ? (
              <span className="inline-flex items-center gap-1">
                <Video className="h-3 w-3" /> Teleconsulta
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <DoorOpen className="h-3 w-3" /> {linha.sala}
              </span>
            )}{' '}
            · {linha.convenio}
          </div>

          {linha.observacao && (
            <div className="mt-1 truncate text-[11px] text-amber-700 dark:text-amber-400">
              {linha.observacao}
            </div>
          )}

          {linha.chegada && (
            <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
              Chegou {linha.chegada.hora} · {linha.chegada.por} ·{' '}
              {METODO_LABEL[linha.chegada.metodo]}
              {emEspera && (
                <>
                  {' · '}
                  <span className={`font-medium ${emEspera.tom}`}>
                    esperando há {emEspera.min} min
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ação — derivada de TRANSICOES, nunca fixa */}
      <div className="flex shrink-0 items-center">
        {podeChegar ? (
          <button
            onClick={() => onStatus(linha.id, 'chegou')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-sky-700"
          >
            <LogIn className="h-3.5 w-3.5" /> Registrar chegada
          </button>
        ) : podeIniciar ? (
          <button
            onClick={() => onStatus(linha.id, 'em-atendimento')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Play className="h-3.5 w-3.5" /> Chamar
          </button>
        ) : (
          <span className="px-1 text-[11px] text-slate-300 dark:text-slate-600">
            {linha.modalidade === 'tele' ? 'sem chegada' : '—'}
          </span>
        )}
      </div>
    </li>
  )
}
