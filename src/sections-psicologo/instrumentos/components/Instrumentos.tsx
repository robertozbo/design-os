import { useMemo, useState } from 'react'
import {
  Search,
  Brain,
  HeartPulse,
  Wind,
  Eye,
  Lightbulb,
  Zap,
  Activity,
  Star,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Play,
  type LucideIcon,
} from 'lucide-react'
import type {
  AplicacaoRecente,
  DominioClinico,
  Instrumento,
  InstrumentosProps,
  SeveridadeScore,
} from '@/../product-psicologo/sections/instrumentos/types'

const DOMINIO_VISUAL: Record<DominioClinico, { label: string; icon: LucideIcon; cor: string }> = {
  depressao: { label: 'Depressão', icon: HeartPulse, cor: 'rose' },
  ansiedade: { label: 'Ansiedade', icon: Wind, cor: 'amber' },
  stress: { label: 'Stress', icon: Zap, cor: 'orange' },
  cognicao: { label: 'Cognição', icon: Brain, cor: 'violet' },
  tdah: { label: 'TDAH', icon: Activity, cor: 'sky' },
  trauma: { label: 'Trauma', icon: Eye, cor: 'rose' },
  sono: { label: 'Sono', icon: Wind, cor: 'sky' },
  qualidade_vida: { label: 'Qualidade de vida', icon: Lightbulb, cor: 'emerald' },
}

const SEVERIDADE_VISUAL: Record<SeveridadeScore, { label: string; cls: string }> = {
  minima: { label: 'Mínima', cls: 'bg-emerald-500/15 text-emerald-300' },
  leve: { label: 'Leve', cls: 'bg-teal-500/15 text-teal-300' },
  moderada: { label: 'Moderada', cls: 'bg-amber-500/15 text-amber-300' },
  moderada_severa: { label: 'Mod. severa', cls: 'bg-orange-500/15 text-orange-300' },
  severa: { label: 'Severa', cls: 'bg-rose-500/15 text-rose-300' },
}

const COR_BG: Record<string, string> = {
  rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  orange: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  sky: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  teal: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
}

export function Instrumentos({
  data,
  onInstrumentoClick,
  onAplicar,
  onAplicacaoClick,
  onFavoritoToggle,
  onPacienteClick,
}: InstrumentosProps) {
  const [busca, setBusca] = useState('')
  const [filtroDominio, setFiltroDominio] = useState<DominioClinico | null>(null)
  const [somenteFavoritos, setSomenteFavoritos] = useState(false)

  const dominiosDisponiveis = useMemo(() => {
    const set = new Set(data.instrumentos.map((i) => i.dominio))
    return Array.from(set)
  }, [data.instrumentos])

  const filtrados = useMemo(() => {
    return data.instrumentos.filter((i) => {
      if (filtroDominio && i.dominio !== filtroDominio) return false
      if (somenteFavoritos && !i.favorito) return false
      if (
        busca &&
        !i.nome.toLowerCase().includes(busca.toLowerCase()) &&
        !i.nomeCompleto.toLowerCase().includes(busca.toLowerCase())
      )
        return false
      return true
    })
  }, [data.instrumentos, busca, filtroDominio, somenteFavoritos])

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-slate-50 font-bold text-[24px]">Instrumentos</h1>
              <span className="text-slate-500 text-[13px] font-mono tabular-nums">
                · {data.instrumentos.length} escalas validadas
              </span>
            </div>
            <p className="text-slate-400 text-[12.5px] mt-1">
              Biblioteca de escalas psicométricas pra rastreio, diagnóstico e acompanhamento
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Coluna principal: instrumentos */}
          <div className="col-span-8 space-y-4">
            {/* Filtros */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 h-10 rounded-xl bg-slate-900 border border-slate-800 focus-within:border-slate-600 flex-1">
                  <Search size={14} className="text-slate-500" strokeWidth={2.2} />
                  <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar instrumento (PHQ-9, ansiedade, depressão...)"
                    className="flex-1 bg-transparent text-slate-100 text-[13px] outline-none placeholder:text-slate-700"
                  />
                </div>
                <button
                  onClick={() => setSomenteFavoritos((v) => !v)}
                  className={`px-3 h-10 rounded-xl text-[12px] font-semibold border flex items-center gap-1.5 ${
                    somenteFavoritos
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Star size={13} strokeWidth={2.2} fill={somenteFavoritos ? 'currentColor' : 'none'} />
                  Favoritos
                </button>
              </div>

              {/* Filtros de domínio */}
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => setFiltroDominio(null)}
                  className={`px-3 h-8 rounded-full text-[11.5px] font-semibold ${
                    filtroDominio === null ? 'bg-slate-100 text-slate-900' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  Todos
                </button>
                {dominiosDisponiveis.map((d) => {
                  const v = DOMINIO_VISUAL[d]
                  const Icon = v.icon
                  const active = filtroDominio === d
                  return (
                    <button
                      key={d}
                      onClick={() => setFiltroDominio(active ? null : d)}
                      className={`px-3 h-8 rounded-full text-[11.5px] font-semibold border flex items-center gap-1.5 ${
                        active ? COR_BG[v.cor] : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <Icon size={11} strokeWidth={2.2} />
                      {v.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="text-slate-500 text-[11px] px-1">
              {filtrados.length} de {data.instrumentos.length}{' '}
              {filtrados.length === 1 ? 'instrumento' : 'instrumentos'}
            </div>

            {/* Grid de instrumentos */}
            {filtrados.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-12 text-center">
                <div className="text-slate-300 text-[14px] font-semibold">Nenhum resultado</div>
                <div className="text-slate-500 text-[12px] mt-1">Ajuste os filtros pra ver mais.</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filtrados.map((i) => (
                  <InstrumentoCard
                    key={i.id}
                    instrumento={i}
                    onClick={() => onInstrumentoClick?.(i.id)}
                    onAplicar={() => onAplicar?.(i.id)}
                    onFavoritoToggle={() => onFavoritoToggle?.(i.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Coluna direita: aplicações recentes */}
          <div className="col-span-4">
            <AplicacoesRecentesPanel
              aplicacoes={data.aplicacoesRecentes}
              onAplicacaoClick={onAplicacaoClick}
              onPacienteClick={onPacienteClick}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface InstrumentoCardProps {
  instrumento: Instrumento
  onClick: () => void
  onAplicar: () => void
  onFavoritoToggle: () => void
}

function InstrumentoCard({ instrumento: i, onClick, onAplicar, onFavoritoToggle }: InstrumentoCardProps) {
  const dom = DOMINIO_VISUAL[i.dominio]
  const Icon = dom.icon
  return (
    <div
      className={`relative rounded-2xl bg-slate-900 border ${COR_BG[dom.cor].split(' ')[2]} p-4 flex flex-col gap-3 hover:border-slate-700 transition-colors`}
    >
      <button
        onClick={onFavoritoToggle}
        className={`absolute top-3 right-3 ${i.favorito ? 'text-amber-300' : 'text-slate-600 hover:text-slate-400'}`}
        title={i.favorito ? 'Remover dos favoritos' : 'Marcar favorito'}
      >
        <Star size={15} strokeWidth={2.2} fill={i.favorito ? 'currentColor' : 'none'} />
      </button>

      <button onClick={onClick} className="flex items-start gap-3 text-left">
        <div className={`w-11 h-11 rounded-xl ${COR_BG[dom.cor].split(' ').slice(0, 2).join(' ')} flex items-center justify-center shrink-0`}>
          <Icon size={18} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1 pr-6">
          <div className="text-slate-100 font-bold text-[15px] leading-tight">{i.nome}</div>
          <div className="text-slate-500 text-[10.5px] mt-0.5">{i.autor}</div>
        </div>
      </button>

      <div className="text-slate-300 text-[11.5px] leading-snug">{i.descricao}</div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`px-1.5 py-0.5 rounded ${COR_BG[dom.cor].split(' ').slice(0, 2).join(' ')} text-[9.5px] font-bold uppercase tracking-wider`}>
          {dom.label}
        </span>
        {i.validacaoBR && (
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[9.5px] font-bold">
            BR
          </span>
        )}
        <span className="text-slate-600 text-[10px] font-mono tabular-nums">{i.faixaEtaria}</span>
      </div>

      <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-950/40 border border-slate-800/60 px-2 py-1.5">
        <div className="text-center">
          <div className="text-slate-500 text-[9px] uppercase tracking-wider">Itens</div>
          <div className="text-slate-100 text-[12px] font-bold font-mono tabular-nums">{i.numItens}</div>
        </div>
        <div className="text-center border-x border-slate-800/60">
          <div className="text-slate-500 text-[9px] uppercase tracking-wider">Tempo</div>
          <div className="text-slate-100 text-[12px] font-bold font-mono tabular-nums">~{i.tempoMin}min</div>
        </div>
        <div className="text-center">
          <div className="text-slate-500 text-[9px] uppercase tracking-wider">Score</div>
          <div className="text-slate-100 text-[12px] font-bold font-mono tabular-nums">
            0–{i.rangeTotal.max}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-auto">
        <span className="flex items-center gap-1 font-mono tabular-nums">
          <Users size={10} />
          {i.totalAplicacoes} aplicações
        </span>
        {i.ultimaAplicacao && (
          <span className="flex items-center gap-1 font-mono tabular-nums">
            <Clock size={10} />
            última: {i.ultimaAplicacao}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onAplicar}
          className="flex-1 h-9 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 text-white font-semibold text-[12px] flex items-center justify-center gap-1.5"
        >
          <Play size={11} strokeWidth={2.6} fill="currentColor" />
          Aplicar
        </button>
        <button
          onClick={onClick}
          className="px-3 h-9 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 text-[12px] font-medium"
        >
          Detalhes
        </button>
      </div>
    </div>
  )
}

interface AplicacoesRecentesPanelProps {
  aplicacoes: AplicacaoRecente[]
  onAplicacaoClick?: (id: string) => void
  onPacienteClick?: (id: string) => void
}

function AplicacoesRecentesPanel({ aplicacoes, onAplicacaoClick, onPacienteClick }: AplicacoesRecentesPanelProps) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 sticky top-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-slate-100 font-semibold text-[13px]">Aplicações recentes</div>
          <div className="text-slate-500 text-[10.5px]">Últimas {aplicacoes.length} da carteira</div>
        </div>
      </div>

      <div className="space-y-1.5">
        {aplicacoes.map((a) => (
          <AplicacaoRow
            key={a.id}
            aplicacao={a}
            onClick={() => onAplicacaoClick?.(a.id)}
            onPacienteClick={() => onPacienteClick?.(a.paciente.id)}
          />
        ))}
        {aplicacoes.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-800 p-3 text-center text-slate-500 text-[10.5px]">
            Nenhuma aplicação recente
          </div>
        )}
      </div>
    </div>
  )
}

interface AplicacaoRowProps {
  aplicacao: AplicacaoRecente
  onClick: () => void
  onPacienteClick: () => void
}

function AplicacaoRow({ aplicacao, onClick, onPacienteClick }: AplicacaoRowProps) {
  const sev = SEVERIDADE_VISUAL[aplicacao.severidade]
  return (
    <div className="rounded-lg bg-slate-950/40 border border-slate-800/60 p-2.5 flex items-center gap-2.5">
      <button onClick={onPacienteClick} className="shrink-0">
        {aplicacao.paciente.fotoUrl ? (
          <img
            src={aplicacao.paciente.fotoUrl}
            alt={aplicacao.paciente.nomeCompleto}
            className="w-9 h-9 rounded-xl object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-200 flex items-center justify-center font-bold text-[13px]">
            {aplicacao.paciente.inicial}
          </div>
        )}
      </button>
      <button onClick={onClick} className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-slate-100 font-semibold text-[11.5px] truncate">{aplicacao.paciente.nomeCompleto}</span>
          <span className="text-slate-700">·</span>
          <span className="text-slate-500 text-[10px] font-mono tabular-nums">{aplicacao.aplicadoRelativo}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[10px] font-semibold">{aplicacao.instrumento.nome}</span>
          <span className="text-slate-100 text-[12px] font-bold font-mono tabular-nums">{aplicacao.valor}</span>
          <span className={`px-1.5 py-0.5 rounded ${sev.cls} text-[9px] font-bold`}>{sev.label}</span>
          {aplicacao.delta !== null && <DeltaIndicator delta={aplicacao.delta} />}
        </div>
      </button>
      <ChevronRight size={12} className="text-slate-600 shrink-0" />
    </div>
  )
}

function DeltaIndicator({ delta }: { delta: number }) {
  if (delta === 0) return null
  const Icon = delta > 0 ? TrendingUp : TrendingDown
  // Pra escalas onde aumentar = piorar (depressão, ansiedade)
  const cls = delta > 0 ? 'text-rose-300' : 'text-emerald-300'
  return (
    <span className={`inline-flex items-center gap-0.5 ${cls} text-[9.5px] font-mono tabular-nums font-bold`}>
      <Icon size={9} strokeWidth={2.6} />
      {delta > 0 ? '+' : ''}
      {delta}
    </span>
  )
}
