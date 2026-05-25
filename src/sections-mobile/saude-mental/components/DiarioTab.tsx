import { useState } from 'react'
import {
  ChevronDown,
  Pencil,
  TrendingUp,
  TrendingDown,
  Minus,
  Moon,
  Check,
  Share2,
  Zap,
} from 'lucide-react'
import type {
  DiarioHoje,
  DiarioSubmission,
  EmocaoOption,
  EmocaoTom,
  HistoricoItem,
  HumorPonto,
  HumorSemana,
  TendenciaMensal,
} from '@/../product-mobile/sections/saude-mental/types'

interface DiarioTabProps {
  diarioHoje: DiarioHoje
  emocoesCatalogo: EmocaoOption[]
  humorSemana: HumorSemana
  tendenciaMensal: TendenciaMensal
  historico: HistoricoItem[]
  psicologoNome: string | null
  onSubmitDiario?: (payload: DiarioSubmission) => void
  onEditDiario?: () => void
  onOpenHistoricoItem?: (id: string) => void
}

export function DiarioTab({
  diarioHoje,
  emocoesCatalogo,
  humorSemana,
  tendenciaMensal,
  historico,
  psicologoNome,
  onSubmitDiario,
  onEditDiario,
  onOpenHistoricoItem,
}: DiarioTabProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3 no-scrollbar">
      {diarioHoje.preenchido ? (
        <DiarioResumoCard
          diario={diarioHoje}
          emocoesCatalogo={emocoesCatalogo}
          onEdit={onEditDiario}
        />
      ) : (
        <DiarioFormCard
          diario={diarioHoje}
          emocoesCatalogo={emocoesCatalogo}
          psicologoNome={psicologoNome}
          onSubmit={onSubmitDiario}
        />
      )}

      <HumorSemanaCard data={humorSemana} />
      <TendenciaMensalCard data={tendenciaMensal} />
      <HistoricoCard historico={historico} onOpen={onOpenHistoricoItem} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Form
// ─────────────────────────────────────────────────────────────────────────────

const HUMOR_EMOJI: Record<number, string> = {
  1: '😞',
  2: '😞',
  3: '😟',
  4: '😟',
  5: '😐',
  6: '🙂',
  7: '🙂',
  8: '😊',
  9: '😄',
  10: '🤩',
}

const TOM_STYLE: Record<EmocaoTom, { active: string; idle: string; label: string }> = {
  positivo: {
    active: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
    idle: 'bg-slate-900 text-slate-400 border-slate-800 hover:border-emerald-500/30',
    label: 'Positivas',
  },
  neutro: {
    active: 'bg-slate-700 text-slate-100 border-slate-600',
    idle: 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600',
    label: 'Neutras',
  },
  negativo: {
    active: 'bg-rose-500/20 text-rose-200 border-rose-500/40',
    idle: 'bg-slate-900 text-slate-400 border-slate-800 hover:border-rose-500/30',
    label: 'Difíceis',
  },
}

interface DiarioFormCardProps {
  diario: DiarioHoje
  emocoesCatalogo: EmocaoOption[]
  psicologoNome: string | null
  onSubmit?: (payload: DiarioSubmission) => void
}

function DiarioFormCard({ diario, emocoesCatalogo, psicologoNome, onSubmit }: DiarioFormCardProps) {
  const [humor, setHumor] = useState<number>(diario.humor ?? 6)
  const [emocaoIds, setEmocaoIds] = useState<string[]>(diario.emocaoIds)
  const [energia, setEnergia] = useState<number>(diario.energia ?? 3)
  const [sono, setSono] = useState<number>(diario.sono ?? 3)
  const [nota, setNota] = useState<string>(diario.nota)
  const [compartilhar, setCompartilhar] = useState<boolean>(
    diario.compartilharComPsicologo && psicologoNome !== null,
  )

  const canSubmit = emocaoIds.length > 0
  const emocoesPorTom: Record<EmocaoTom, EmocaoOption[]> = {
    positivo: emocoesCatalogo.filter((e) => e.tom === 'positivo'),
    neutro: emocoesCatalogo.filter((e) => e.tom === 'neutro'),
    negativo: emocoesCatalogo.filter((e) => e.tom === 'negativo'),
  }

  function toggleEmocao(id: string) {
    setEmocaoIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-5),
    )
  }

  function handleSubmit() {
    if (!canSubmit) return
    onSubmit?.({
      humor,
      emocaoIds,
      energia,
      sono,
      nota,
      compartilharComPsicologo: compartilhar,
    })
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
      <div>
        <div className="flex items-baseline justify-between">
          <h2 className="text-slate-100 font-semibold text-[14px]">Como você está hoje?</h2>
          <span className="text-[10px] text-slate-500 font-mono tabular-nums">{`${diario.dataISO.slice(8, 10)}/${diario.dataISO.slice(5, 7)}`}</span>
        </div>
        <p className="text-[10.5px] text-slate-500 leading-snug mt-0.5">{diario.hint}</p>
      </div>

      <HumorPicker value={humor} onChange={setHumor} />

      <EmocaoPicker
        emocoesPorTom={emocoesPorTom}
        selecionadas={emocaoIds}
        onToggle={toggleEmocao}
      />

      <div className="grid grid-cols-2 gap-3">
        <SliderField label="Energia" value={energia} onChange={setEnergia} unit="energia" />
        <SliderField label="Qualidade do sono" value={sono} onChange={setSono} unit="sono" />
      </div>

      <div>
        <label className="text-[11.5px] text-slate-300 font-semibold">
          O que aconteceu hoje?{' '}
          <span className="text-slate-500 font-normal">· opcional</span>
        </label>
        <textarea
          value={nota}
          onChange={(e) => setNota(e.target.value.slice(0, 600))}
          rows={3}
          placeholder="Conte como foi o dia, o que sentiu, o que disparou…"
          className="mt-1.5 w-full bg-slate-950 border border-slate-800 focus:border-teal-500/50 rounded-xl px-3 py-2 text-slate-100 text-[12.5px] placeholder-slate-600 resize-none outline-none leading-relaxed"
        />
        <div className="text-right text-[10px] text-slate-600 font-mono tabular-nums mt-0.5">
          {nota.length}/600
        </div>
      </div>

      {psicologoNome && (
        <button
          onClick={() => setCompartilhar((v) => !v)}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl"
        >
          <div
            className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${
              compartilhar ? 'bg-teal-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                compartilhar ? 'left-4' : 'left-0.5'
              }`}
            />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-slate-200 text-[12px] font-medium leading-tight flex items-center gap-1.5">
              <Share2 size={11} strokeWidth={2.2} className="text-violet-300 shrink-0" />
              Compartilhar com {psicologoNome.split(' ')[0]}
            </div>
            <div className="text-slate-500 text-[10px] mt-0.5">
              Aparece como mensagem no chat
            </div>
          </div>
        </button>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full h-11 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors ${
          canSubmit
            ? 'bg-teal-500 text-slate-950 hover:bg-teal-400'
            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
        }`}
      >
        <Check size={14} strokeWidth={2.4} />
        Salvar entrada
      </button>
      {!canSubmit && (
        <p className="text-[10px] text-slate-500 text-center -mt-2">
          Selecione ao menos uma emoção pra continuar.
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface HumorPickerProps {
  value: number
  onChange: (v: number) => void
}

function HumorPicker({ value, onChange }: HumorPickerProps) {
  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <span className="text-[11.5px] text-slate-300 font-semibold">Humor</span>
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{HUMOR_EMOJI[value]}</span>
          <span className="text-slate-100 font-mono tabular-nums text-[15px] font-semibold w-7 text-right">
            {value}
          </span>
          <span className="text-slate-500 text-[10px]">/10</span>
        </div>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-[9.5px] text-slate-600 font-mono tabular-nums mt-1">
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface EmocaoPickerProps {
  emocoesPorTom: Record<EmocaoTom, EmocaoOption[]>
  selecionadas: string[]
  onToggle: (id: string) => void
}

function EmocaoPicker({ emocoesPorTom, selecionadas, onToggle }: EmocaoPickerProps) {
  const TOMS: EmocaoTom[] = ['positivo', 'neutro', 'negativo']

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11.5px] text-slate-300 font-semibold">Emoções</span>
        <span className="text-[9.5px] text-slate-500 font-mono tabular-nums">
          {selecionadas.length}/5
        </span>
      </div>
      {TOMS.map((tom) => {
        const opts = emocoesPorTom[tom]
        if (opts.length === 0) return null
        const style = TOM_STYLE[tom]
        return (
          <div key={tom}>
            <div className="text-[9.5px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">
              {style.label}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {opts.map((o) => {
                const active = selecionadas.includes(o.id)
                return (
                  <button
                    key={o.id}
                    onClick={() => onToggle(o.id)}
                    className={`px-2.5 h-7 rounded-full border text-[11px] font-medium transition-colors ${
                      active ? style.active : style.idle
                    }`}
                  >
                    {o.label}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface SliderFieldProps {
  label: string
  value: number
  onChange: (v: number) => void
  unit: 'energia' | 'sono'
}

function SliderField({ label, value, onChange, unit }: SliderFieldProps) {
  const labels: Record<typeof unit, Record<number, string>> = {
    energia: { 1: 'baixa', 2: 'baixa', 3: 'média', 4: 'alta', 5: 'alta' },
    sono: { 1: 'ruim', 2: 'ruim', 3: 'ok', 4: 'bom', 5: 'ótimo' },
  }
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[11px] text-slate-300 font-semibold">{label}</span>
        <span className="text-[10px] text-slate-500">{labels[unit][value]}</span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-teal-500 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer"
      />
      <div className="flex justify-between mt-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`text-[9px] font-mono tabular-nums ${
              n === value ? 'text-teal-300 font-bold' : 'text-slate-600'
            }`}
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Resumo (já preenchido)
// ─────────────────────────────────────────────────────────────────────────────

interface DiarioResumoCardProps {
  diario: DiarioHoje
  emocoesCatalogo: EmocaoOption[]
  onEdit?: () => void
}

function DiarioResumoCard({ diario, emocoesCatalogo, onEdit }: DiarioResumoCardProps) {
  const emocoes = diario.emocaoIds
    .map((id) => emocoesCatalogo.find((e) => e.id === id))
    .filter(Boolean) as EmocaoOption[]

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-3xl leading-none">{HUMOR_EMOJI[diario.humor ?? 5]}</span>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-slate-100 font-mono tabular-nums text-[20px] font-semibold leading-none">
                  {diario.humor}
                </span>
                <span className="text-slate-500 text-[11px]">/10</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Humor de hoje</div>
            </div>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="shrink-0 inline-flex items-center gap-1 text-teal-300 hover:text-teal-200 text-[11px] font-medium"
        >
          <Pencil size={11} strokeWidth={2.2} />
          Editar
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {emocoes.map((e) => (
          <span
            key={e.id}
            className={`px-2 h-6 rounded-full text-[10.5px] font-medium inline-flex items-center border ${
              TOM_STYLE[e.tom].active
            }`}
          >
            {e.label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2">
          <div className="text-[9.5px] text-slate-500 uppercase tracking-wider font-semibold">
            Energia
          </div>
          <div className="text-slate-200 font-mono tabular-nums text-[14px] font-semibold mt-0.5">
            {diario.energia}/5
          </div>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2">
          <div className="text-[9.5px] text-slate-500 uppercase tracking-wider font-semibold">
            Sono
          </div>
          <div className="text-slate-200 font-mono tabular-nums text-[14px] font-semibold mt-0.5">
            {diario.sono}/5
          </div>
        </div>
      </div>

      {diario.nota && (
        <div className="mt-3 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 text-[11.5px] leading-relaxed">
          {diario.nota}
        </div>
      )}

      {diario.compartilharComPsicologo && (
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-violet-300">
          <Share2 size={10} strokeWidth={2.2} />
          Compartilhado com seu psicólogo
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tendência: últimos 7 dias
// ─────────────────────────────────────────────────────────────────────────────

interface HumorSemanaCardProps {
  data: HumorSemana
}

function HumorSemanaCard({ data }: HumorSemanaCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-slate-100 font-semibold text-[12.5px]">{data.rangeLabel}</h3>
        <span className="text-[10px] text-slate-500 font-mono tabular-nums">
          média {data.mediaSemanaAtual.toFixed(1)} · {data.deltaLabel}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between h-24 gap-1.5">
        {data.dias.map((d) => (
          <HumorBar key={d.dateISO} ponto={d} />
        ))}
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <TrendIcon direcao={tendenciaDirecao(data.tendenciaLabel)} />
        <span className="text-[10.5px] text-slate-400">{data.tendenciaLabel}</span>
      </div>
    </div>
  )
}

function HumorBar({ ponto }: { ponto: HumorPonto }) {
  if (!ponto.temRegistro || ponto.score === null) {
    return (
      <div className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
        <div className="w-full bg-slate-800/40 border border-dashed border-slate-700/60 rounded-md h-6" />
        <span className="text-[9.5px] text-slate-600 font-mono">{ponto.label}</span>
      </div>
    )
  }
  const pct = (ponto.score / 10) * 100
  const colorClass =
    ponto.score >= 7
      ? 'bg-gradient-to-t from-emerald-500/80 to-emerald-400/90'
      : ponto.score >= 4
        ? 'bg-gradient-to-t from-teal-500/80 to-teal-400/90'
        : 'bg-gradient-to-t from-rose-500/80 to-rose-400/90'
  return (
    <div className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
      <span className="text-[9px] text-slate-500 font-mono tabular-nums">{ponto.score}</span>
      <div className="w-full relative" style={{ height: `${pct}%`, minHeight: '6px' }}>
        <div className={`absolute inset-0 rounded-md ${colorClass}`} />
      </div>
      <span className="text-[9.5px] text-slate-400 font-mono">{ponto.label}</span>
    </div>
  )
}

function tendenciaDirecao(label: string): 'subida' | 'queda' | 'estavel' {
  if (label.toLowerCase().includes('sub')) return 'subida'
  if (label.toLowerCase().includes('ca')) return 'queda'
  return 'estavel'
}

function TrendIcon({ direcao }: { direcao: 'subida' | 'queda' | 'estavel' }) {
  if (direcao === 'subida') return <TrendingUp size={11} className="text-emerald-400" strokeWidth={2.2} />
  if (direcao === 'queda') return <TrendingDown size={11} className="text-rose-400" strokeWidth={2.2} />
  return <Minus size={11} className="text-slate-500" strokeWidth={2.2} />
}

// ─────────────────────────────────────────────────────────────────────────────
// Tendência mensal
// ─────────────────────────────────────────────────────────────────────────────

interface TendenciaMensalCardProps {
  data: TendenciaMensal
}

function TendenciaMensalCard({ data }: TendenciaMensalCardProps) {
  const direcaoColor =
    data.direcao === 'subida'
      ? 'text-emerald-300 bg-emerald-500/15'
      : data.direcao === 'queda'
        ? 'text-rose-300 bg-rose-500/15'
        : 'text-slate-300 bg-slate-700/40'

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-slate-100 font-semibold text-[12.5px]">Tendência mensal</h3>
        <span className="text-[10px] text-slate-500 font-mono tabular-nums">{data.mesLabel}</span>
      </div>
      <div className="mt-3 flex items-baseline gap-3">
        <div className="text-slate-100 font-mono tabular-nums text-[28px] font-semibold leading-none">
          {data.humorMedio.toFixed(1)}
        </div>
        <span className="text-slate-500 text-[11px]">/10</span>
        <span
          className={`inline-flex items-center gap-1 px-2 h-5 rounded-full text-[10px] font-semibold ${direcaoColor} font-mono tabular-nums`}
        >
          <TrendIcon direcao={data.direcao} />
          {data.deltaLabel}
        </span>
      </div>
      <p className="mt-2 text-slate-400 text-[11.5px] leading-relaxed">{data.frase}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Histórico
// ─────────────────────────────────────────────────────────────────────────────

interface HistoricoCardProps {
  historico: HistoricoItem[]
  onOpen?: (id: string) => void
}

function HistoricoCard({ historico, onOpen }: HistoricoCardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
    onOpen?.(id)
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-4 pt-3.5 pb-2">
        <h3 className="text-slate-100 font-semibold text-[12.5px]">Histórico recente</h3>
      </div>
      <div className="divide-y divide-slate-800">
        {historico.map((h) => (
          <HistoricoRow
            key={h.id}
            item={h}
            expanded={expandedId === h.id}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  )
}

const ENERGIA_LABEL: Record<number, string> = {
  1: 'baixa',
  2: 'baixa',
  3: 'média',
  4: 'alta',
  5: 'alta',
}
const SONO_LABEL: Record<number, string> = {
  1: 'ruim',
  2: 'ruim',
  3: 'ok',
  4: 'bom',
  5: 'ótimo',
}

function HistoricoRow({
  item,
  expanded,
  onToggle,
}: {
  item: HistoricoItem
  expanded: boolean
  onToggle: (id: string) => void
}) {
  const humorColor =
    item.humor >= 7
      ? 'text-emerald-300'
      : item.humor >= 4
        ? 'text-teal-300'
        : 'text-rose-300'
  const notaCompleta = item.notaCompleta?.trim() || item.notaTruncada
  const emocoesExpandidas =
    item.todasEmocoesLabels && item.todasEmocoesLabels.length > 0
      ? item.todasEmocoesLabels
      : item.emocaoLabelsTop

  return (
    <div>
      <button
        onClick={() => onToggle(item.id)}
        aria-expanded={expanded}
        aria-controls={`hist-${item.id}-detail`}
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-800/30 transition-colors"
      >
        <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center">
          <span className="text-base leading-none">{HUMOR_EMOJI[item.humor]}</span>
          <span className={`text-[9px] font-mono tabular-nums font-bold mt-0.5 ${humorColor}`}>
            {item.humor}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-200 text-[11.5px] font-semibold">{item.dataLabel}</span>
            {item.compartilhadoComPsicologo && (
              <Share2 size={9} className="text-violet-300 shrink-0" strokeWidth={2.4} />
            )}
          </div>
          {!expanded && (
            <>
              <div className="flex items-center gap-1 mt-0.5">
                {item.emocaoLabelsTop.map((label) => (
                  <span
                    key={label}
                    className="text-[9.5px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-800/60"
                  >
                    {label}
                  </span>
                ))}
              </div>
              {item.notaTruncada && (
                <p className="text-slate-500 text-[10.5px] mt-1 leading-snug line-clamp-1">
                  {item.notaTruncada}
                </p>
              )}
            </>
          )}
        </div>
        <ChevronDown
          size={13}
          strokeWidth={2.2}
          className={`text-slate-600 shrink-0 transition-transform duration-200 ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        id={`hist-${item.id}-detail`}
        role="region"
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex gap-3 px-4 pb-3 pt-0.5">
            <div className="w-10 shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0 space-y-2.5">
              {emocoesExpandidas.length > 0 && (
                <div>
                  <div className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                    Como se sentiu
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {emocoesExpandidas.map((label) => (
                      <span
                        key={label}
                        className="text-[10px] text-slate-300 px-1.5 py-0.5 rounded bg-slate-800/70"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(item.energia !== undefined || item.sono !== undefined) && (
                <div className="grid grid-cols-2 gap-2">
                  {item.energia !== undefined && (
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
                      <Zap size={11} className="text-teal-400 shrink-0" strokeWidth={2.2} />
                      <div className="min-w-0 leading-tight">
                        <div className="text-[8.5px] uppercase tracking-wider font-semibold text-slate-500">
                          Energia
                        </div>
                        <div className="text-[10.5px] text-slate-200">
                          <span className="font-mono tabular-nums font-semibold">
                            {item.energia}/5
                          </span>{' '}
                          <span className="text-slate-500">
                            · {ENERGIA_LABEL[item.energia] ?? ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {item.sono !== undefined && (
                    <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
                      <Moon size={11} className="text-teal-400 shrink-0" strokeWidth={2.2} />
                      <div className="min-w-0 leading-tight">
                        <div className="text-[8.5px] uppercase tracking-wider font-semibold text-slate-500">
                          Sono
                        </div>
                        <div className="text-[10.5px] text-slate-200">
                          <span className="font-mono tabular-nums font-semibold">
                            {item.sono}/5
                          </span>{' '}
                          <span className="text-slate-500">
                            · {SONO_LABEL[item.sono] ?? ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {notaCompleta.length > 0 ? (
                <div>
                  <div className="text-[9px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                    Nota do dia
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {notaCompleta}
                  </p>
                </div>
              ) : (
                <p className="text-[10px] italic text-slate-600">
                  Sem nota nesse dia.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
