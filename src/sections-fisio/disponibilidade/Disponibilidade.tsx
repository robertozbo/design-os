import { useMemo, useState } from 'react'
import {
  Bell,
  ChevronDown,
  Clock,
  Copy,
  MoreHorizontal,
  Plus,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import initialData from '@/../product-fisio/sections/disponibilidade/data.json'
import type {
  AntecedenciaHoras,
  DayOfWeek,
  DiaDisponibilidade,
  DisponibilidadeData,
  Intervalo,
  SlotMinutes,
} from '@/../product-fisio/sections/disponibilidade/types'

const DIA_LABEL: Record<DayOfWeek, { curto: string; longo: string }> = {
  1: { curto: 'Seg', longo: 'Segunda-feira' },
  2: { curto: 'Ter', longo: 'Terça-feira' },
  3: { curto: 'Qua', longo: 'Quarta-feira' },
  4: { curto: 'Qui', longo: 'Quinta-feira' },
  5: { curto: 'Sex', longo: 'Sexta-feira' },
  6: { curto: 'Sáb', longo: 'Sábado' },
  0: { curto: 'Dom', longo: 'Domingo' },
}

const DIAS_ORDEM: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0]
const TIMELINE_INICIO = 6
const TIMELINE_FIM = 22

function timeToMin(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function intervaloDuracaoMin(i: Intervalo): number {
  return Math.max(0, timeToMin(i.fim) - timeToMin(i.inicio))
}

function computeStats(dias: DiaDisponibilidade[], slotPadrao: SlotMinutes) {
  const ativos = dias.filter((d) => d.ativo && d.intervalos.length > 0)
  const totalMin = ativos.reduce(
    (acc, d) => acc + d.intervalos.reduce((a, i) => a + intervaloDuracaoMin(i), 0),
    0,
  )
  const slotsTotais = ativos.reduce((acc, d) => {
    const slotDur = d.slotMinutesOverride ?? slotPadrao
    return (
      acc + d.intervalos.reduce((a, i) => a + Math.floor(intervaloDuracaoMin(i) / slotDur), 0)
    )
  }, 0)
  return {
    diasAtivos: ativos.length,
    horasPorSemana: Math.round(totalMin / 60),
    slotsTotais,
  }
}

export default function Disponibilidade() {
  const [state, setState] = useState<DisponibilidadeData>(
    initialData as unknown as DisponibilidadeData,
  )
  const [pristine, setPristine] = useState<DisponibilidadeData>(
    initialData as unknown as DisponibilidadeData,
  )
  const [diaExpandido, setDiaExpandido] = useState<DayOfWeek | null>(1)
  const [menuAbertoEm, setMenuAbertoEm] = useState<DayOfWeek | null>(null)
  const [modo, setModo] = useState<'timeline' | 'lista'>('timeline')

  const hasChanges = JSON.stringify(state) !== JSON.stringify(pristine)
  const stats = useMemo(
    () => computeStats(state.dias, state.slotMinutesPadrao),
    [state.dias, state.slotMinutesPadrao],
  )

  const updateDia = (
    d: DayOfWeek,
    update: (dia: DiaDisponibilidade) => DiaDisponibilidade,
  ) => {
    setState((s) => ({ ...s, dias: s.dias.map((x) => (x.dayOfWeek === d ? update(x) : x)) }))
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-32 text-slate-100">
      <div className="mx-auto max-w-5xl px-6 pt-10">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="size-11 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Clock className="size-5 text-teal-300" strokeWidth={1.7} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="size-1.5 rounded-full bg-teal-500" />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Disponibilidade
                </span>
              </div>
              <h1 className="text-[28px] leading-tight font-semibold text-slate-50">
                Quando você atende
              </h1>
              <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-slate-400">
                Configure os horários recorrentes da sua semana. Pacientes só veem slots dentro dessa grade.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() =>
                setState((s) => ({
                  ...s,
                  dias: s.dias.map((d) => ({
                    ...d,
                    ativo: d.dayOfWeek >= 1 && d.dayOfWeek <= 5,
                    intervalos:
                      d.dayOfWeek >= 1 && d.dayOfWeek <= 5
                        ? [
                            {
                              id: `${d.dayOfWeek}-tpl-${Date.now()}-1`,
                              inicio: '08:00',
                              fim: '12:00',
                            },
                            {
                              id: `${d.dayOfWeek}-tpl-${Date.now()}-2`,
                              inicio: '14:00',
                              fim: '18:00',
                            },
                          ]
                        : [],
                  })),
                }))
              }
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-teal-300 hover:text-teal-200 transition-colors"
            >
              <Sparkles size={13} />
              Carregar horário padrão
            </button>
            <button
              onClick={() =>
                setState((s) => ({
                  ...s,
                  dias: s.dias.map((d) => ({ ...d, ativo: false, intervalos: [] })),
                }))
              }
              className="text-[12.5px] font-medium text-rose-300/80 hover:text-rose-300 transition-colors"
            >
              ↻ Limpar todos
            </button>
          </div>
        </div>

        {/* Stats inline */}
        <div className="mb-8 flex items-baseline gap-2 text-[13px] flex-wrap">
          <Stat valor={`${stats.diasAtivos} dias`} label="dias com atendimento" />
          <Divisor />
          <Stat valor={`${stats.horasPorSemana}h`} label="capacidade da semana" />
          <Divisor />
          <Stat valor={`${stats.slotsTotais} slots`} label="disponíveis" />
          <Divisor />
          <Stat valor={`${state.slotMinutesPadrao}min`} label="tamanho do slot" />
        </div>

        {/* Timeline card */}
        <TimelineCard
          dias={state.dias}
          modo={modo}
          onChangeModo={setModo}
        />

        {/* Lista por dia */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 mb-6 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-800/60">
            <div className="text-[15px] font-semibold text-slate-100">
              Horários por dia da semana
            </div>
            <div className="text-[12px] text-slate-500 mt-0.5">
              Clique no dia para ativar/desativar e configure os horários
            </div>
          </div>
          {DIAS_ORDEM.map((d, idx) => {
            const dia = state.dias.find((x) => x.dayOfWeek === d)!
            const aberto = diaExpandido === d && dia.ativo
            return (
              <div
                key={d}
                className={`relative ${
                  idx < DIAS_ORDEM.length - 1 ? 'border-b border-slate-800/60' : ''
                }`}
              >
                <RowDia
                  dia={dia}
                  slotPadrao={state.slotMinutesPadrao}
                  aberto={aberto}
                  menuAberto={menuAbertoEm === d}
                  onClickRow={() => dia.ativo && setDiaExpandido(aberto ? null : d)}
                  onToggle={() =>
                    updateDia(d, (cur) => ({
                      ...cur,
                      ativo: !cur.ativo,
                      intervalos:
                        !cur.ativo && cur.intervalos.length === 0
                          ? [
                              {
                                id: `${d}-${Date.now()}`,
                                inicio: '08:00',
                                fim: '18:00',
                              },
                            ]
                          : cur.intervalos,
                    }))
                  }
                  onMenuToggle={() => setMenuAbertoEm(menuAbertoEm === d ? null : d)}
                  onMenuClose={() => setMenuAbertoEm(null)}
                  onCopiarDia={(toDays) => {
                    const fonte = state.dias.find((x) => x.dayOfWeek === d)
                    if (!fonte) return
                    setState((s) => ({
                      ...s,
                      dias: s.dias.map((day) =>
                        toDays.includes(day.dayOfWeek)
                          ? {
                              ...day,
                              ativo: fonte.ativo,
                              intervalos: fonte.intervalos.map((i) => ({
                                ...i,
                                id: `${day.dayOfWeek}-${i.id}-${Date.now()}`,
                              })),
                              slotMinutesOverride: fonte.slotMinutesOverride,
                            }
                          : day,
                      ),
                    }))
                  }}
                  onLimparDia={() =>
                    updateDia(d, (cur) => ({ ...cur, ativo: false, intervalos: [] }))
                  }
                />
                {aberto && (
                  <ExpandIntervalos
                    dia={dia}
                    slotPadrao={state.slotMinutesPadrao}
                    onAddIntervalo={() =>
                      updateDia(d, (cur) => ({
                        ...cur,
                        intervalos: [
                          ...cur.intervalos,
                          {
                            id: `${d}-${Date.now()}`,
                            inicio: '14:00',
                            fim: '18:00',
                          },
                        ],
                      }))
                    }
                    onUpdateIntervalo={(id, patch) =>
                      updateDia(d, (cur) => ({
                        ...cur,
                        intervalos: cur.intervalos.map((i) =>
                          i.id === id ? { ...i, ...patch } : i,
                        ),
                      }))
                    }
                    onRemoveIntervalo={(id) =>
                      updateDia(d, (cur) => ({
                        ...cur,
                        intervalos: cur.intervalos.filter((i) => i.id !== id),
                      }))
                    }
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Regras gerais */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
          <div className="text-[15px] font-semibold text-slate-100 mb-1">Regras gerais</div>
          <div className="text-[12px] text-slate-500 mb-5">
            Aplicam-se a toda a sua agenda
          </div>

          <div className="space-y-5">
            <ConfigRow
              titulo="Duração padrão da sessão"
              subtitulo="Tamanho de cada slot pra agendamento"
            >
              <SegmentedSmall
                opcoes={[
                  { value: '30', label: '30' },
                  { value: '45', label: '45' },
                  { value: '60', label: '60' },
                  { value: '90', label: '90' },
                  { value: '120', label: '120' },
                ]}
                ativo={String(state.slotMinutesPadrao)}
                onChange={(v) =>
                  setState((s) => ({ ...s, slotMinutesPadrao: Number(v) as SlotMinutes }))
                }
                unidade="min"
              />
            </ConfigRow>

            <ConfigRow
              titulo="Antecedência mínima"
              subtitulo="Quanto antes o paciente precisa marcar"
            >
              <SegmentedSmall
                opcoes={[
                  { value: '1', label: '1' },
                  { value: '4', label: '4' },
                  { value: '12', label: '12' },
                  { value: '24', label: '24' },
                  { value: '48', label: '48' },
                ]}
                ativo={String(state.antecedenciaMinima)}
                onChange={(v) =>
                  setState((s) => ({ ...s, antecedenciaMinima: Number(v) as AntecedenciaHoras }))
                }
                unidade="h"
              />
            </ConfigRow>

            <ConfigRow
              titulo="Pausa entre sessões"
              subtitulo="Bloqueia 10min entre uma sessão e outra (limpeza, anotações)"
            >
              <Toggle
                ativo={state.bloqueioEntreSessoes}
                onToggle={() =>
                  setState((s) => ({ ...s, bloqueioEntreSessoes: !s.bloqueioEntreSessoes }))
                }
              />
            </ConfigRow>
          </div>
        </div>
      </div>

      {hasChanges && (
        <FooterDock
          onSalvar={() => setPristine(state)}
          onDescartar={() => setState(pristine)}
        />
      )}
    </div>
  )
}

/* ────────────────── Stats ────────────────── */
function Stat({ valor, label }: { valor: string; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className="font-mono font-semibold text-slate-100 tabular-nums">{valor}</span>
      <span className="text-slate-500">{label}</span>
    </span>
  )
}
function Divisor() {
  return <span className="text-slate-700">·</span>
}

/* ────────────────── Timeline Card ────────────────── */
function TimelineCard({
  dias,
  modo,
  onChangeModo,
}: {
  dias: DiaDisponibilidade[]
  modo: 'timeline' | 'lista'
  onChangeModo: (m: 'timeline' | 'lista') => void
}) {
  const horas = Array.from(
    { length: Math.floor((TIMELINE_FIM - TIMELINE_INICIO) / 4) + 1 },
    (_, i) => TIMELINE_INICIO + i * 4,
  )

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 mb-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[15px] font-semibold text-slate-100">Timeline da semana</div>
          <div className="text-[12px] text-slate-500 mt-0.5">
            Visão de quando você está disponível
          </div>
        </div>
        <SegmentedSmall
          opcoes={[
            { value: 'timeline', label: 'Timeline' },
            { value: 'lista', label: 'Lista' },
          ]}
          ativo={modo}
          onChange={(v) => onChangeModo(v as 'timeline' | 'lista')}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col justify-between w-8 text-right">
          <div className="h-5" />
          {horas.map((h) => (
            <div key={h} className="font-mono text-[10px] text-slate-500 leading-none">
              {String(h).padStart(2, '0')}
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-7 gap-1.5">
          {DIAS_ORDEM.map((d) => (
            <ColunaDia key={d} dia={dias.find((x) => x.dayOfWeek === d)!} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ColunaDia({ dia }: { dia: DiaDisponibilidade }) {
  const totalMin = (TIMELINE_FIM - TIMELINE_INICIO) * 60
  return (
    <div className="flex flex-col">
      <div className="h-5 flex items-center justify-center text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {DIA_LABEL[dia.dayOfWeek].curto}
      </div>
      <div className="relative h-64 rounded-lg bg-slate-800/40 overflow-hidden">
        {dia.ativo && dia.intervalos.length > 0 ? (
          dia.intervalos.map((i) => {
            const topMin = timeToMin(i.inicio) - TIMELINE_INICIO * 60
            const heightMin = intervaloDuracaoMin(i)
            const top = (topMin / totalMin) * 100
            const height = (heightMin / totalMin) * 100
            return (
              <div
                key={i.id}
                className="absolute left-1 right-1 rounded-md bg-teal-500/25 border border-teal-500/40 hover:bg-teal-500/35 transition-colors group cursor-pointer"
                style={{ top: `${top}%`, height: `${height}%` }}
                title={`${i.inicio}–${i.fim}`}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-mono text-[10px] text-teal-100 tabular-nums">
                    {i.inicio}
                  </span>
                </div>
              </div>
            )
          })
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[14px] text-slate-700">
            —
          </div>
        )}
      </div>
    </div>
  )
}

/* ────────────────── Row Dia ────────────────── */
function RowDia({
  dia,
  slotPadrao,
  aberto,
  menuAberto,
  onClickRow,
  onToggle,
  onMenuToggle,
  onMenuClose,
  onCopiarDia,
  onLimparDia,
}: {
  dia: DiaDisponibilidade
  slotPadrao: SlotMinutes
  aberto: boolean
  menuAberto: boolean
  onClickRow: () => void
  onToggle: () => void
  onMenuToggle: () => void
  onMenuClose: () => void
  onCopiarDia: (toDays: DayOfWeek[]) => void
  onLimparDia: () => void
}) {
  const label = DIA_LABEL[dia.dayOfWeek]
  const slotDur = dia.slotMinutesOverride ?? slotPadrao
  return (
    <div
      className={`flex items-center gap-4 px-5 h-16 ${
        dia.ativo ? 'hover:bg-slate-800/40 cursor-pointer' : ''
      } transition-colors`}
      onClick={onClickRow}
    >
      <Toggle ativo={dia.ativo} onToggle={onToggle} />
      <div className="w-32 shrink-0">
        <div
          className={`text-[14px] font-semibold ${
            dia.ativo ? 'text-slate-100' : 'text-slate-500'
          }`}
        >
          {label.longo}
        </div>
      </div>
      <div className="flex-1 flex items-center gap-2 flex-wrap">
        {dia.ativo && dia.intervalos.length > 0 ? (
          <>
            {dia.intervalos.map((i) => (
              <div
                key={i.id}
                className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 font-mono text-[12px] tabular-nums"
              >
                {i.inicio}–{i.fim}
              </div>
            ))}
            {dia.slotMinutesOverride && (
              <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 text-[10.5px] font-medium uppercase tracking-wider">
                {slotDur}min
              </div>
            )}
          </>
        ) : (
          <span className="text-[12.5px] text-slate-500 italic">Sem atendimento</span>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {dia.ativo && (
          <ChevronDown
            size={16}
            className={`text-slate-500 transition-transform ${aberto ? 'rotate-180' : ''}`}
          />
        )}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMenuToggle()
            }}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>
          {menuAberto && (
            <DropdownMenu
              dia={dia.dayOfWeek}
              onCopiarDia={onCopiarDia}
              onLimparDia={onLimparDia}
              onClose={onMenuClose}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function DropdownMenu({
  dia,
  onCopiarDia,
  onLimparDia,
  onClose,
}: {
  dia: DayOfWeek
  onCopiarDia: (toDays: DayOfWeek[]) => void
  onLimparDia: () => void
  onClose: () => void
}) {
  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 top-9 z-40 min-w-[220px] rounded-xl bg-slate-900 border border-slate-700 shadow-2xl shadow-black/40 py-1.5">
        <MenuItem
          icon={<Copy size={14} />}
          label="Aplicar a Ter–Sex"
          onClick={() => {
            onCopiarDia(([1, 2, 3, 4, 5] as DayOfWeek[]).filter((d) => d !== dia))
            onClose()
          }}
        />
        <MenuItem
          icon={<Copy size={14} />}
          label="Aplicar a todos os dias"
          onClick={() => {
            onCopiarDia(DIAS_ORDEM.filter((d) => d !== dia))
            onClose()
          }}
        />
        <div className="h-px bg-slate-800 my-1" />
        <MenuItem
          icon={<Trash2 size={14} />}
          label="Limpar este dia"
          danger
          onClick={() => {
            onLimparDia()
            onClose()
          }}
        />
      </div>
    </>
  )
}

function MenuItem({
  icon,
  label,
  danger,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  danger?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-3 py-2 flex items-center gap-2.5 text-[13px] hover:bg-slate-800 transition-colors ${
        danger ? 'text-rose-300 hover:text-rose-200' : 'text-slate-200'
      }`}
    >
      <span className="text-slate-500">{icon}</span>
      {label}
    </button>
  )
}

/* ────────────────── Expand Intervals ────────────────── */
function ExpandIntervalos({
  dia,
  slotPadrao,
  onAddIntervalo,
  onUpdateIntervalo,
  onRemoveIntervalo,
}: {
  dia: DiaDisponibilidade
  slotPadrao: SlotMinutes
  onAddIntervalo: () => void
  onUpdateIntervalo: (id: string, patch: Partial<Intervalo>) => void
  onRemoveIntervalo: (id: string) => void
}) {
  return (
    <div className="bg-slate-950/40 border-t border-slate-800/60 px-5 py-4 pl-[88px]">
      <div className="space-y-2">
        {dia.intervalos.map((i) => (
          <IntervaloRow
            key={i.id}
            intervalo={i}
            onUpdate={(patch) => onUpdateIntervalo(i.id, patch)}
            onRemove={() => onRemoveIntervalo(i.id)}
          />
        ))}
        <button
          onClick={onAddIntervalo}
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-teal-300 hover:text-teal-200 transition-colors pt-1"
        >
          <Plus size={14} />
          Adicionar intervalo
        </button>
        <div className="pt-2 mt-2 border-t border-slate-800/60">
          <span className="text-[11px] text-slate-500">
            Duração do slot:{' '}
            <span className="font-mono text-slate-300">
              {dia.slotMinutesOverride ?? slotPadrao}min
            </span>{' '}
            {dia.slotMinutesOverride ? (
              <span className="text-teal-300/80">(override deste dia)</span>
            ) : (
              <span className="text-slate-600">(padrão global)</span>
            )}
          </span>
        </div>
      </div>
    </div>
  )
}

function IntervaloRow({
  intervalo,
  onUpdate,
  onRemove,
}: {
  intervalo: Intervalo
  onUpdate: (patch: Partial<Intervalo>) => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-3">
      <TimeInput value={intervalo.inicio} onChange={(inicio) => onUpdate({ inicio })} />
      <span className="text-slate-500 text-[12px]">até</span>
      <TimeInput value={intervalo.fim} onChange={(fim) => onUpdate({ fim })} />
      <span className="text-slate-600 text-[11px] font-mono tabular-nums">
        {Math.floor(intervaloDuracaoMin(intervalo) / 60)}h
        {String(intervaloDuracaoMin(intervalo) % 60).padStart(2, '0')}
      </span>
      <button
        onClick={onRemove}
        className="ml-auto w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
        title="Remover intervalo"
      >
        <X size={14} />
      </button>
    </div>
  )
}

function TimeInput({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-md px-2.5 py-1.5 font-mono text-[13px] text-slate-100 tabular-nums focus:outline-none focus:border-teal-500/60 transition-colors cursor-pointer"
    >
      {generateTimeOptions().map((t) => (
        <option key={t} value={t} className="bg-slate-900">
          {t}
        </option>
      ))}
    </select>
  )
}

function generateTimeOptions(): string[] {
  const out: string[] = []
  for (let h = 6; h <= 22; h++) {
    for (const m of [0, 15, 30, 45]) {
      out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return out
}

/* ────────────────── Configs ────────────────── */
function ConfigRow({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string
  subtitulo: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-6 flex-wrap">
      <div>
        <div className="text-[13.5px] font-medium text-slate-100">{titulo}</div>
        <div className="text-[12px] text-slate-500 mt-0.5">{subtitulo}</div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

/* ────────────────── Primitivos ────────────────── */
function Toggle({ ativo, onToggle }: { ativo: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className={`relative inline-flex h-6 w-10 rounded-full border transition-colors shrink-0 ${
        ativo ? 'bg-teal-500/80 border-teal-400/60' : 'bg-slate-800 border-slate-700'
      }`}
      role="switch"
      aria-checked={ativo}
    >
      <span
        className={`absolute top-0.5 ${
          ativo ? 'left-[18px]' : 'left-0.5'
        } w-5 h-5 rounded-full bg-white shadow-sm transition-all`}
      />
    </button>
  )
}

function SegmentedSmall({
  opcoes,
  ativo,
  onChange,
  unidade,
}: {
  opcoes: { value: string; label: string }[]
  ativo: string
  onChange: (v: string) => void
  unidade?: string
}) {
  return (
    <div className="inline-flex rounded-lg bg-slate-800/60 p-1 gap-0.5">
      {opcoes.map((o) => {
        const isAtivo = o.value === ativo
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`px-2.5 py-1 rounded-md font-mono text-[12px] tabular-nums transition-colors ${
              isAtivo
                ? 'bg-teal-500/20 text-teal-100 ring-1 ring-teal-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {o.label}
            {unidade && isAtivo && (
              <span className="ml-0.5 text-[10px] text-teal-300/80">{unidade}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ────────────────── Footer Dock ────────────────── */
function FooterDock({
  onSalvar,
  onDescartar,
}: {
  onSalvar: () => void
  onDescartar: () => void
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-6 py-4">
      <div className="mx-auto max-w-5xl flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5 text-slate-300">
          <Bell size={14} className="text-amber-300" />
          <span className="text-[13px]">Alterações não salvas</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onDescartar}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Descartar
          </button>
          <button
            onClick={onSalvar}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-white text-[13px] font-semibold transition-colors"
          >
            <Sparkles size={14} />
            Salvar disponibilidade
          </button>
        </div>
      </div>
    </div>
  )
}
