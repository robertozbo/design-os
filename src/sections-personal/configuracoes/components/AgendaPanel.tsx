import { useState } from 'react'
import { MapPin, Save, Video } from 'lucide-react'
import type {
  AgendaConfig,
  DiaSemanaId,
  ModalidadeId,
  ValorSessao,
} from '@/../product-personal/sections/configuracoes/types'
import { Panel, Field, Input } from './PerfilPanel'

interface AgendaPanelProps {
  agenda: AgendaConfig
  onSave?: (agenda: AgendaConfig) => void
}

const DIAS_LABELS: Record<DiaSemanaId, string> = {
  seg: 'Segunda',
  ter: 'Terça',
  qua: 'Quarta',
  qui: 'Quinta',
  sex: 'Sexta',
  sab: 'Sábado',
  dom: 'Domingo',
}

const MODALIDADES: { id: ModalidadeId; label: string; icon: React.ElementType }[] = [
  { id: 'presencial', label: 'Presencial', icon: MapPin },
  { id: 'online', label: 'Online', icon: Video },
  { id: 'hibrido', label: 'Híbrido', icon: MapPin },
]

export function AgendaPanel({ agenda: initial, onSave }: AgendaPanelProps) {
  const [agenda, setAgenda] = useState<AgendaConfig>(initial)
  const [dirty, setDirty] = useState(false)

  const update = (patch: Partial<AgendaConfig>) => {
    setAgenda((prev) => ({ ...prev, ...patch }))
    setDirty(true)
  }

  const toggleModalidade = (id: ModalidadeId) => {
    update({
      modalidades: agenda.modalidades.includes(id)
        ? agenda.modalidades.filter((m) => m !== id)
        : [...agenda.modalidades, id],
    })
  }

  const updateDia = (
    dia: DiaSemanaId,
    patch: Partial<AgendaConfig['disponibilidade'][number]>,
  ) => {
    update({
      disponibilidade: agenda.disponibilidade.map((d) =>
        d.dia === dia ? { ...d, ...patch } : d,
      ),
    })
  }

  const updateLocal = (id: string, patch: Partial<AgendaConfig['locais'][number]>) => {
    update({
      locais: agenda.locais.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    })
  }

  const updateValor = (id: string, patch: Partial<ValorSessao>) => {
    update({
      valores: agenda.valores.map((v) => (v.id === id ? { ...v, ...patch } : v)),
    })
  }

  return (
    <div className="space-y-5">
      <Panel
        title="Disponibilidade semanal"
        description="Configure os dias e horários que você atende"
      >
        <div className="space-y-2">
          {agenda.disponibilidade.map((d) => (
            <div
              key={d.dia}
              className={`flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center ${
                d.ativo
                  ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                  : 'border-slate-100 bg-slate-50/40 opacity-60 dark:border-slate-800 dark:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center gap-3 sm:w-40">
                <Toggle
                  checked={d.ativo}
                  onChange={(v) => updateDia(d.dia, { ativo: v })}
                />
                <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                  {DIAS_LABELS[d.dia]}
                </span>
              </div>
              <div className="flex flex-1 items-center gap-2">
                <input
                  type="time"
                  value={d.inicioHora}
                  disabled={!d.ativo}
                  onChange={(e) => updateDia(d.dia, { inicioHora: e.target.value })}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-[13px] tabular-nums text-slate-900 focus:border-teal-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
                />
                <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  até
                </span>
                <input
                  type="time"
                  value={d.fimHora}
                  disabled={!d.ativo}
                  onChange={(e) => updateDia(d.dia, { fimHora: e.target.value })}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-[13px] tabular-nums text-slate-900 focus:border-teal-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="Modalidades de atendimento"
        description="Como você atende seus alunos"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {MODALIDADES.map((m) => {
            const Icon = m.icon
            const active = agenda.modalidades.includes(m.id)
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleModalidade(m.id)}
                className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                  active
                    ? 'border-teal-300 bg-teal-50/30 ring-2 ring-teal-200 dark:border-teal-700 dark:bg-teal-900/20 dark:ring-teal-900'
                    : 'border-slate-200 bg-white hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700'
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active
                      ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <Icon size={16} />
                </span>
                <span className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                  {m.label}
                </span>
              </button>
            )
          })}
        </div>
      </Panel>

      <Panel
        title="Locais de atendimento"
        description="Studios, academias, ou domicílio"
      >
        <div className="space-y-2">
          {agenda.locais.map((l) => (
            <div
              key={l.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <Toggle
                checked={l.ativo}
                onChange={(v) => updateLocal(l.id, { ativo: v })}
              />
              <div className="min-w-0 flex-1">
                <Input
                  value={l.nome}
                  onChange={(v) => updateLocal(l.id, { nome: v })}
                  placeholder="Nome do local"
                />
                <Input
                  value={l.endereco}
                  onChange={(v) => updateLocal(l.id, { endereco: v })}
                  placeholder="Endereço"
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="Valores por tipo de sessão"
        description="Define o preço cobrado em cada modalidade"
        footer={
          <button
            type="button"
            onClick={() => {
              onSave?.(agenda)
              setDirty(false)
            }}
            disabled={!dirty}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              dirty
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600'
            }`}
          >
            <Save size={14} />
            Salvar todas as configurações
          </button>
        }
      >
        <div className="space-y-2">
          {agenda.valores.map((v) => (
            <div
              key={v.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                  {v.label}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {v.unidade}
                </p>
              </div>
              <Field label="">
                <div className="flex items-center rounded-lg border border-slate-200 bg-white pl-3 dark:border-slate-800 dark:bg-slate-900 focus-within:border-teal-400">
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    R$
                  </span>
                  <input
                    type="number"
                    step={5}
                    value={(v.centavos / 100).toFixed(2)}
                    onChange={(e) =>
                      updateValor(v.id, {
                        centavos: Math.round(Number(e.target.value) * 100) || 0,
                      })
                    }
                    className="w-28 border-none bg-transparent px-2 py-2 font-mono text-sm tabular-nums text-slate-900 focus:outline-none dark:text-slate-50"
                  />
                </div>
              </Field>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        checked
          ? 'bg-teal-600 dark:bg-teal-500'
          : 'bg-slate-200 dark:bg-slate-700'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
