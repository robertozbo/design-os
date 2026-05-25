import {
  Target,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
  Calendar,
  Clock,
  Edit3,
  GitBranch,
  Check,
  Pause,
  X as XIcon,
  ArrowRight,
  CalendarCheck,
  Activity,
  type LucideIcon,
} from 'lucide-react'
import type {
  AbordagemTerapeutica,
  IndicadorProgresso,
  ObjetivoSmart,
  PlanoData,
  PlanoProps,
  StatusObjetivo,
  StatusPlano,
  TecnicaPlanejada,
  VersaoPlano,
} from '@/../product-psicologo/sections/plano-terapeutico/types'

const COR_BG: Record<string, string> = {
  teal: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  sky: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
  orange: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
}

const ABORDAGEM_VISUAL: Record<AbordagemTerapeutica, { label: string; cor: string }> = {
  tcc: { label: 'TCC', cor: 'teal' },
  act: { label: 'ACT', cor: 'sky' },
  mindfulness: { label: 'Mindfulness', cor: 'emerald' },
  emdr: { label: 'EMDR', cor: 'rose' },
  humanista: { label: 'Humanista', cor: 'amber' },
  psicodinamica: { label: 'Psicodinâmica', cor: 'violet' },
  sistemica: { label: 'Sistêmica', cor: 'sky' },
}

const STATUS_PLANO_VISUAL: Record<StatusPlano, { label: string; cls: string; icon: LucideIcon }> = {
  em_curso: { label: 'Em curso', cls: 'bg-teal-500/15 text-teal-300', icon: Activity },
  pausado: { label: 'Pausado', cls: 'bg-amber-500/15 text-amber-300', icon: Pause },
  concluido: { label: 'Concluído', cls: 'bg-emerald-500/15 text-emerald-300', icon: Check },
}

const STATUS_OBJ_VISUAL: Record<StatusObjetivo, { label: string; cls: string }> = {
  em_andamento: { label: 'Em andamento', cls: 'bg-teal-500/15 text-teal-300' },
  concluido: { label: 'Concluído', cls: 'bg-emerald-500/15 text-emerald-300' },
  abandonado: { label: 'Abandonado', cls: 'bg-slate-800 text-slate-400' },
  pausado: { label: 'Pausado', cls: 'bg-amber-500/15 text-amber-300' },
}

function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function PlanoTerapeutico({
  data,
  onPacienteClick,
  onNovaVersao,
  onEditarPlano,
  onObjetivoClick,
  onTecnicaClick,
  onVersaoClick,
}: PlanoProps) {
  const status = STATUS_PLANO_VISUAL[data.plano.status]
  const StatusIcon = status.icon
  const abordagem = ABORDAGEM_VISUAL[data.plano.abordagem]
  const progressoSessoes = data.plano.sessaoAtual / data.plano.totalSessoes

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-6">
      <div className="max-w-[1400px] mx-auto space-y-4">
        {/* Header card */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 via-slate-900 to-sky-500/10 border border-slate-800 p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <button onClick={onPacienteClick} className="flex items-center gap-3 text-left min-w-0">
              {data.paciente.fotoUrl ? (
                <img src={data.paciente.fotoUrl} alt={data.paciente.nomeCompleto} className="w-12 h-12 rounded-2xl object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-200 flex items-center justify-center font-bold text-[18px]">
                  {data.paciente.inicial}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
                  Plano terapêutico de
                </div>
                <div className="text-slate-50 font-bold text-[18px] truncate">{data.paciente.nomeCompleto}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">{data.paciente.idade} anos</div>
              </div>
            </button>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onEditarPlano}
                className="px-3 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-[12px] font-medium flex items-center gap-1.5"
              >
                <Edit3 size={12} strokeWidth={2.4} />
                Editar
              </button>
              <button
                onClick={onNovaVersao}
                className="px-3 h-9 rounded-xl bg-violet-500/15 border border-violet-500/40 hover:bg-violet-500/25 text-violet-200 text-[12px] font-semibold flex items-center gap-1.5"
              >
                <GitBranch size={12} strokeWidth={2.4} />
                Nova versão
              </button>
            </div>
          </div>

          {/* Plano info row */}
          <div className="flex items-baseline gap-3 flex-wrap mb-3">
            <span className="text-slate-100 font-bold text-[20px]">{data.plano.nome}</span>
            <span className={`px-2 py-0.5 rounded ${COR_BG[abordagem.cor].split(' ').slice(0, 2).join(' ')} text-[10px] font-bold uppercase tracking-wider`}>
              {abordagem.label}
            </span>
            <span className={`px-2 py-0.5 rounded-full ${status.cls} text-[10px] font-bold uppercase tracking-wider flex items-center gap-1`}>
              <StatusIcon size={10} strokeWidth={2.4} />
              {status.label}
            </span>
            <span className="text-slate-500 text-[11px] font-mono tabular-nums">v{data.plano.versaoAtual}</span>
          </div>

          {/* Sessões progress */}
          <div className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CalendarCheck size={13} className="text-violet-300" strokeWidth={2.2} />
                <span className="text-slate-100 font-semibold text-[12.5px]">Progresso de sessões</span>
              </div>
              <span className="text-slate-100 font-mono tabular-nums text-[14px] font-bold">
                {data.plano.sessaoAtual}/{data.plano.totalSessoes}
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-sky-500 transition-all duration-500"
                style={{ width: `${progressoSessoes * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-[10.5px] text-slate-500">
              <span>Iniciado em {formatDateBR(data.plano.criadoEm)}</span>
              <span className="font-mono tabular-nums">
                Frequência {data.plano.frequencia} ·{' '}
                {data.plano.totalSessoes - data.plano.sessaoAtual} sessões restantes
              </span>
            </div>
          </div>
        </div>

        {/* Body grid 12-col (8 + 4) */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left col */}
          <div className="col-span-8 space-y-4">
            {/* Objetivo principal */}
            <ObjetivoPrincipalCard texto={data.objetivoPrincipal} />

            {/* Objetivos SMART */}
            <ObjetivosSmartList
              objetivos={data.objetivosSmart}
              onClick={onObjetivoClick}
            />
          </div>

          {/* Right col */}
          <div className="col-span-4 space-y-4">
            {/* Indicadores de progresso */}
            <IndicadoresPanel indicadores={data.indicadores} />

            {/* Técnicas planejadas */}
            <TecnicasPanel tecnicas={data.tecnicas} onClick={onTecnicaClick} />

            {/* Versões */}
            <VersoesPanel versoes={data.versoes} onClick={onVersaoClick} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function ObjetivoPrincipalCard({ texto }: { texto: string }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-violet-500/15 text-violet-300 flex items-center justify-center">
          <Target size={15} strokeWidth={2.4} />
        </div>
        <div>
          <div className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
            Objetivo principal
          </div>
          <div className="text-slate-500 text-[10px]">Direção geral do tratamento</div>
        </div>
      </div>
      <p className="text-slate-100 text-[14px] leading-relaxed">{texto}</p>
    </div>
  )
}

interface ObjetivosSmartListProps {
  objetivos: ObjetivoSmart[]
  onClick?: (id: string) => void
}

function ObjetivosSmartList({ objetivos, onClick }: ObjetivosSmartListProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-slate-400" strokeWidth={2.2} />
          <h2 className="text-slate-100 font-semibold text-[14px]">Objetivos SMART</h2>
          <span className="text-slate-600 text-[11px] font-mono tabular-nums">{objetivos.length}</span>
        </div>
      </div>
      <div className="space-y-2">
        {objetivos.map((obj, i) => (
          <ObjetivoCard key={obj.id} objetivo={obj} index={i} onClick={() => onClick?.(obj.id)} />
        ))}
      </div>
    </div>
  )
}

function ObjetivoCard({ objetivo, index, onClick }: { objetivo: ObjetivoSmart; index: number; onClick: () => void }) {
  const status = STATUS_OBJ_VISUAL[objetivo.status]
  const ind = objetivo.indicador
  const distancia = ind.direcao === 'reduzir' ? ind.valorAtual - ind.valorAlvo : ind.valorAlvo - ind.valorAtual
  const progressoCor =
    objetivo.progresso >= 0.7 ? 'from-emerald-500 to-teal-500' : objetivo.progresso >= 0.3 ? 'from-teal-500 to-sky-500' : 'from-amber-500 to-orange-500'

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 transition-colors"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-7 h-7 rounded-lg bg-violet-500/15 text-violet-300 flex items-center justify-center font-bold text-[12px] font-mono shrink-0">
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 font-semibold text-[13.5px] leading-snug">{objetivo.especifico}</div>
          <div className="text-slate-500 text-[11px] mt-1 leading-snug italic">{objetivo.relevancia}</div>
        </div>
        <span className={`px-2 py-0.5 rounded-full ${status.cls} text-[9.5px] font-bold uppercase tracking-wider shrink-0`}>
          {status.label}
        </span>
      </div>

      {/* Indicador SMART (Measurable) */}
      <div className="rounded-lg bg-slate-950/40 border border-slate-800/60 px-3 py-2 mb-2">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Activity size={11} className="text-slate-500" strokeWidth={2.2} />
            <span className="text-slate-400 text-[10.5px] font-semibold">{ind.instrumento}</span>
            <span className="text-slate-600 text-[10px]">·</span>
            <span className="text-slate-500 text-[10px]">{ind.direcao === 'reduzir' ? 'Reduzir' : ind.direcao === 'aumentar' ? 'Aumentar' : 'Manter'}</span>
          </div>
          <span className="text-slate-600 text-[10px] font-mono">
            faltam {Math.abs(distancia)}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-slate-100 text-[18px] font-bold font-mono tabular-nums leading-none">
            {ind.valorAtual}
          </span>
          <ArrowRight size={11} className="text-slate-600" />
          <span className="text-emerald-300 text-[14px] font-bold font-mono tabular-nums">
            {ind.valorAlvo}
          </span>
        </div>
      </div>

      {/* Progresso bar */}
      <div className="mb-1.5 flex items-center justify-between text-[10px] text-slate-500">
        <span>Progresso</span>
        <span className="font-mono tabular-nums">{Math.round(objetivo.progresso * 100)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden mb-2">
        <div
          className={`h-full bg-gradient-to-r ${progressoCor} transition-all duration-500`}
          style={{ width: `${objetivo.progresso * 100}%` }}
        />
      </div>

      <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 font-mono tabular-nums">
        <Calendar size={10} strokeWidth={2.2} />
        Prazo {formatDateBR(objetivo.prazo)}
      </div>
    </button>
  )
}

function IndicadoresPanel({ indicadores }: { indicadores: IndicadorProgresso[] }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-300 flex items-center justify-center">
          <Activity size={13} strokeWidth={2.4} />
        </div>
        <div>
          <div className="text-slate-100 font-semibold text-[12.5px]">Indicadores</div>
          <div className="text-slate-500 text-[10px]">Linha de base · atual · alvo</div>
        </div>
      </div>
      <div className="space-y-3">
        {indicadores.map((ind) => (
          <IndicadorChart key={ind.instrumento} indicador={ind} />
        ))}
      </div>
    </div>
  )
}

function IndicadorChart({ indicador }: { indicador: IndicadorProgresso }) {
  const valores = indicador.pontos.map((p) => p.valor)
  const min = Math.min(...valores, indicador.alvo)
  const max = Math.max(...valores, indicador.linhaBase)
  const range = max - min || 1
  const w = 280
  const h = 50
  const padX = 6
  const innerW = w - padX * 2
  const xStep = indicador.pontos.length > 1 ? innerW / (indicador.pontos.length - 1) : 0
  const yScale = (v: number) => 6 + (h - 12) * (1 - (v - min) / range)
  const linha = indicador.pontos.map((p, i) => `${i === 0 ? 'M' : 'L'} ${padX + i * xStep} ${yScale(p.valor)}`).join(' ')

  const direcaoMelhor = indicador.direcao === 'reduzir' ? indicador.atual < indicador.linhaBase : indicador.atual > indicador.linhaBase
  const corLinha = direcaoMelhor ? '#34d399' : '#fb7185'
  const dirIcon = direcaoMelhor ? TrendingDown : indicador.atual === indicador.linhaBase ? Minus : TrendingUp
  const DirIcon = dirIcon

  return (
    <div className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-slate-200 font-semibold text-[11.5px]">{indicador.instrumento}</span>
        <span className={`flex items-center gap-1 text-[10px] font-mono tabular-nums font-semibold ${direcaoMelhor ? 'text-emerald-300' : 'text-rose-300'}`}>
          <DirIcon size={10} strokeWidth={2.6} />
          {indicador.linhaBase} → {indicador.atual}
        </span>
      </div>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full">
        {/* Linha alvo */}
        <line x1={padX} x2={w - padX} y1={yScale(indicador.alvo)} y2={yScale(indicador.alvo)} stroke="#10b981" strokeDasharray="3 3" strokeWidth={1} opacity={0.5} />
        <text x={w - padX} y={yScale(indicador.alvo) - 3} textAnchor="end" fontSize={9} fill="#10b981" className="font-mono">
          alvo {indicador.alvo}
        </text>
        <path d={linha} fill="none" stroke={corLinha} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {indicador.pontos.map((p, i) => {
          const cx = padX + i * xStep
          const cy = yScale(p.valor)
          const isLast = i === indicador.pontos.length - 1
          return (
            <circle key={p.data} cx={cx} cy={cy} r={isLast ? 3 : 2} fill={corLinha} stroke="#020617" strokeWidth={isLast ? 1.5 : 0.5} />
          )
        })}
      </svg>
    </div>
  )
}

function TecnicasPanel({ tecnicas, onClick }: { tecnicas: TecnicaPlanejada[]; onClick?: (id: string) => void }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-teal-500/15 text-teal-300 flex items-center justify-center">
          <Sparkles size={13} strokeWidth={2.4} />
        </div>
        <div>
          <div className="text-slate-100 font-semibold text-[12.5px]">Técnicas planejadas</div>
          <div className="text-slate-500 text-[10px]">Aplicado / planejado</div>
        </div>
      </div>
      <div className="space-y-1.5">
        {tecnicas.map((t) => {
          const ab = ABORDAGEM_VISUAL[t.abordagem]
          const pct = t.vezesPlanejadas > 0 ? t.vezesAplicadas / t.vezesPlanejadas : 0
          return (
            <button
              key={t.id}
              onClick={() => onClick?.(t.id)}
              className="w-full rounded-lg bg-slate-950/40 border border-slate-800/60 hover:border-slate-700 px-2.5 py-2 text-left"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`px-1.5 py-0.5 rounded ${COR_BG[ab.cor].split(' ').slice(0, 2).join(' ')} text-[8.5px] font-bold uppercase shrink-0`}>
                    {ab.label}
                  </span>
                  <span className="text-slate-200 font-semibold text-[11.5px] truncate">{t.nome}</span>
                </div>
                <span className="text-slate-300 text-[11px] font-mono tabular-nums shrink-0">
                  {t.vezesAplicadas}/{t.vezesPlanejadas}
                </span>
              </div>
              <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-sky-500"
                  style={{ width: `${Math.min(100, pct * 100)}%` }}
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function VersoesPanel({ versoes, onClick }: { versoes: VersaoPlano[]; onClick?: (v: number) => void }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-300 flex items-center justify-center">
          <GitBranch size={13} strokeWidth={2.4} />
        </div>
        <div>
          <div className="text-slate-100 font-semibold text-[12.5px]">Histórico de versões</div>
          <div className="text-slate-500 text-[10px]">{versoes.length} versões</div>
        </div>
      </div>
      <div className="space-y-2">
        {versoes.map((v) => (
          <button
            key={v.versao}
            onClick={() => onClick?.(v.versao)}
            className={`w-full text-left rounded-lg p-2.5 ${
              v.ehAtual
                ? 'bg-sky-500/10 border border-sky-500/30'
                : 'bg-slate-950/40 border border-slate-800/60 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-200 font-bold text-[11px] font-mono">v{v.versao}</span>
                {v.ehAtual && (
                  <span className="px-1 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[8.5px] font-bold uppercase tracking-wider">
                    atual
                  </span>
                )}
              </div>
              <span className="text-slate-500 text-[10px] font-mono tabular-nums">{formatDateBR(v.criadaEm)}</span>
            </div>
            <div className="text-slate-400 text-[10.5px] leading-snug">{v.resumoMudancas}</div>
            <div className="text-slate-600 text-[10px] mt-1">por {v.criadaPor}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
