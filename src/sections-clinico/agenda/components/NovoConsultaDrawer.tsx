import { useState, useEffect, useMemo } from 'react'
import { X, MapPin, Video, Zap } from 'lucide-react'
import type {
  Agendamento,
  Modalidade,
  NovoAgendamentoInput,
  PacienteAutocomplete,
} from '@/../product-clinico/sections/agenda/types'
import { formatBRL } from './helpers'

interface Props {
  aberto: boolean
  modo: 'novo' | 'edicao'
  agendamentoEdit: Agendamento | null
  slotInicial: { iso: string; hora: string } | null
  pacientes: PacienteAutocomplete[]
  onFechar?: () => void
  onSalvarNovo?: (input: NovoAgendamentoInput) => void
  onSalvarEdicao?: (id: string, input: NovoAgendamentoInput) => void
  onCancelarAgendamento?: (id: string) => void
}

const DURACOES = [30, 45, 60]

export function NovoConsultaDrawer({
  aberto,
  modo,
  agendamentoEdit,
  slotInicial,
  pacientes,
  onFechar,
  onSalvarNovo,
  onSalvarEdicao,
  onCancelarAgendamento,
}: Props) {
  const [pacienteId, setPacienteId] = useState('')
  const [pacienteQuery, setPacienteQuery] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [duracaoMin, setDuracaoMin] = useState(45)
  const [modalidade, setModalidade] = useState<Modalidade>('presencial')
  const [valor, setValor] = useState(380)
  const [observacao, setObservacao] = useState('')
  const [isEncaixe, setIsEncaixe] = useState(false)

  useEffect(() => {
    if (modo === 'edicao' && agendamentoEdit) {
      const d = new Date(agendamentoEdit.iniciaEm)
      setPacienteId(agendamentoEdit.pacienteId)
      setPacienteQuery(agendamentoEdit.pacienteNome)
      setData(d.toISOString().split('T')[0])
      setHora(d.toTimeString().slice(0, 5))
      setDuracaoMin(agendamentoEdit.duracaoMin)
      setModalidade(agendamentoEdit.modalidade)
      setValor(agendamentoEdit.valor)
      setObservacao(agendamentoEdit.observacao)
      setIsEncaixe(agendamentoEdit.isEncaixe)
    } else if (modo === 'novo') {
      setPacienteId('')
      setPacienteQuery('')
      setData(slotInicial?.iso || new Date().toISOString().split('T')[0])
      setHora(slotInicial?.hora || '09:00')
      setDuracaoMin(45)
      setModalidade('presencial')
      setValor(380)
      setObservacao('')
      setIsEncaixe(false)
    }
  }, [modo, agendamentoEdit, slotInicial, aberto])

  const matchesPaciente = useMemo(() => {
    if (!pacienteQuery) return pacientes.slice(0, 5)
    const q = pacienteQuery.toLowerCase()
    return pacientes.filter((p) => p.nome.toLowerCase().includes(q)).slice(0, 5)
  }, [pacienteQuery, pacientes])

  if (!aberto) return null

  const submit = () => {
    if (!pacienteId || !data || !hora) return
    const iniciaEm = `${data}T${hora}:00-03:00`
    const input: NovoAgendamentoInput = {
      pacienteId,
      iniciaEm,
      duracaoMin,
      modalidade,
      valor,
      observacao,
      isEncaixe,
    }
    if (modo === 'novo') onSalvarNovo?.(input)
    else if (agendamentoEdit) onSalvarEdicao?.(agendamentoEdit.id, input)
  }

  return (
    <div className="fixed inset-0 z-40 flex" role="dialog" aria-modal="true">
      <button
        onClick={onFechar}
        className="flex-1 bg-slate-900/40 backdrop-blur-[2px]"
        aria-label="Fechar"
      />
      <div
        className="
          relative w-full max-w-md flex-shrink-0 overflow-y-auto
          border-l border-slate-200 bg-white shadow-2xl
          dark:border-slate-800 dark:bg-slate-950
        "
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {modo === 'novo' ? 'Nova consulta' : 'Editar consulta'}
            </h2>
            {modo === 'edicao' && agendamentoEdit && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {agendamentoEdit.pacienteNome}
              </p>
            )}
          </div>
          <button
            onClick={onFechar}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Fechar"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="space-y-5 p-5">
          {/* Paciente */}
          <FormField label="Paciente">
            <input
              type="text"
              value={pacienteQuery}
              onChange={(e) => {
                setPacienteQuery(e.target.value)
                setPacienteId('')
              }}
              placeholder="Buscar pelo nome…"
              className="
                w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm
                focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                dark:border-slate-700 dark:bg-slate-900
              "
            />
            {pacienteQuery && !pacienteId && (
              <ul className="mt-1 max-h-44 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {matchesPaciente.length === 0 ? (
                  <li className="px-3 py-2 text-xs italic text-slate-400">
                    Nenhum paciente encontrado.
                  </li>
                ) : (
                  matchesPaciente.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => {
                          setPacienteId(p.id)
                          setPacienteQuery(p.nome)
                        }}
                        className="
                          w-full px-3 py-2 text-left text-sm transition-colors hover:bg-teal-50
                          dark:hover:bg-teal-950/30
                        "
                      >
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {p.nome}
                        </span>
                        {p.ultimaConsulta && (
                          <span className="ml-2 text-[10px] text-slate-400">
                            última: {p.ultimaConsulta}
                          </span>
                        )}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </FormField>

          {/* Data e hora */}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Data">
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="
                  w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm
                  focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                  dark:border-slate-700 dark:bg-slate-900
                "
              />
            </FormField>
            <FormField label="Hora">
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="
                  w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm
                  focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                  dark:border-slate-700 dark:bg-slate-900
                "
              />
            </FormField>
          </div>

          {/* Duração */}
          <FormField label="Duração">
            <div className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-100/60 p-0.5 dark:border-slate-800 dark:bg-slate-900/60">
              {DURACOES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuracaoMin(d)}
                  className={`
                    rounded-md px-3 py-1 text-xs font-medium transition-colors
                    ${
                      duracaoMin === d
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-50'
                        : 'text-slate-600 dark:text-slate-400'
                    }
                  `}
                >
                  {d} min
                </button>
              ))}
            </div>
          </FormField>

          {/* Modalidade */}
          <FormField label="Modalidade">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setModalidade('presencial')}
                className={`
                  inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all
                  ${
                    modalidade === 'presencial'
                      ? 'border-teal-500 bg-teal-50 text-teal-800 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600'
                  }
                `}
              >
                <MapPin className="size-4" />
                Presencial
              </button>
              <button
                onClick={() => setModalidade('tele')}
                className={`
                  inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all
                  ${
                    modalidade === 'tele'
                      ? 'border-teal-500 bg-teal-50 text-teal-800 dark:border-teal-700 dark:bg-teal-950/40 dark:text-teal-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600'
                  }
                `}
              >
                <Video className="size-4" />
                Tele
              </button>
            </div>
          </FormField>

          {/* Valor */}
          <FormField label="Valor">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                R$
              </span>
              <input
                type="number"
                value={valor}
                onChange={(e) => setValor(Number(e.target.value))}
                className="
                  w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm
                  tabular-nums
                  focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                  dark:border-slate-700 dark:bg-slate-900
                "
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Sugestão: {modalidade === 'presencial' ? formatBRL(380) : formatBRL(280)}
            </p>
          </FormField>

          {/* Observação */}
          <FormField label="Observação (opcional)">
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={2}
              placeholder="Ex: retorno pra ajuste de Levotiroxina"
              className="
                w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm
                focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30
                dark:border-slate-700 dark:bg-slate-900
              "
            />
          </FormField>

          {/* Encaixe */}
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={isEncaixe}
              onChange={(e) => setIsEncaixe(e.target.checked)}
              className="size-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-600 dark:bg-slate-800"
            />
            <span className="inline-flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-200">
              <Zap className="size-3.5 text-amber-500" />
              Marcar como encaixe
            </span>
          </label>
        </div>

        <footer className="sticky bottom-0 border-t border-slate-200/80 bg-white/85 p-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
          <div className="flex items-center justify-between gap-2">
            {modo === 'edicao' && agendamentoEdit ? (
              <button
                onClick={() => onCancelarAgendamento?.(agendamentoEdit.id)}
                className="text-xs font-medium text-rose-600 hover:underline dark:text-rose-400"
              >
                Cancelar consulta
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                onClick={onFechar}
                className="
                  rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700
                  transition-colors hover:bg-slate-50
                  dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800
                "
              >
                Fechar
              </button>
              <button
                onClick={submit}
                disabled={!pacienteId || !data || !hora}
                className="
                  rounded-md bg-teal-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm
                  transition-colors hover:bg-teal-500
                  disabled:cursor-not-allowed disabled:bg-slate-300
                  dark:disabled:bg-slate-700
                "
              >
                Salvar
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </label>
      {children}
    </div>
  )
}
