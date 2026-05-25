import { ArrowDown, Camera, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { MinhaSaudeData, MinhaSaudeProps } from '@/../product-mobile/sections/minha-saude/types'
import { SnapshotPicker } from './SnapshotPicker'
import { DiffRow } from './DiffRow'
import { FotosCompare } from './FotosCompare'
import { ProjecaoCard } from './ProjecaoCard'

interface CompararTabProps {
  data: MinhaSaudeData
  onTrocarSnapshotInicial?: MinhaSaudeProps['onTrocarSnapshotInicial']
  onTrocarSnapshotFinal?: MinhaSaudeProps['onTrocarSnapshotFinal']
  onGerarProjecao?: MinhaSaudeProps['onGerarProjecao']
  onEditarMeta?: MinhaSaudeProps['onEditarMeta']
}

export function CompararTab({
  data,
  onTrocarSnapshotInicial,
  onTrocarSnapshotFinal,
  onGerarProjecao,
  onEditarMeta,
}: CompararTabProps) {
  const comp = data.comparacaoDefault
  const projecao = data.projecao

  if (!comp) {
    return (
      <div className="px-4 pt-12 pb-6 text-center">
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-4 py-8">
          <div className="text-slate-300 text-[12.5px] font-medium">Sem comparações disponíveis</div>
          <div className="text-slate-500 text-[11px] mt-1">
            Você precisa de pelo menos 2 análises pra comparar evolução.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pt-4 pb-6 space-y-4">
      <div className="space-y-2">
        <SnapshotPicker
          label="Inicial"
          snapshot={comp.snapshotInicial}
          onClick={onTrocarSnapshotInicial}
        />
        <div className="flex justify-center">
          <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
            <ArrowDown size={14} strokeWidth={2.2} />
          </div>
        </div>
        <SnapshotPicker
          label="Final"
          snapshot={comp.snapshotFinal}
          onClick={onTrocarSnapshotFinal}
        />
      </div>

      <ScoreDeltaCard delta={comp.scoreDelta} />

      <div>
        <div className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider mb-2 px-1">
          Diff por dimensão
        </div>
        <div className="space-y-2">
          {comp.dimensoes.map((d) => (
            <DiffRow key={d.dimensaoId} diff={d} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <Camera size={11} className="text-slate-400" strokeWidth={2.4} />
          <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
            Fotos corporais
          </span>
        </div>
        <FotosCompare
          inicial={comp.snapshotInicial.fotos}
          final={comp.snapshotFinal.fotos}
          dataInicial={comp.snapshotInicial.geradoEm}
          dataFinal={comp.snapshotFinal.geradoEm}
        />
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <Sparkles size={11} className="text-violet-300" strokeWidth={2.4} />
          <span className="text-slate-400 text-[10.5px] font-semibold uppercase tracking-wider">
            Projeção IA
          </span>
        </div>
        <ProjecaoCard
          projecao={projecao}
          onGerar={onGerarProjecao}
          onEditarMeta={onEditarMeta}
        />
      </div>
    </div>
  )
}

function ScoreDeltaCard({ delta }: { delta: number }) {
  const isPositive = delta > 0
  const isZero = delta === 0
  const Icon = isZero ? Minus : isPositive ? TrendingUp : TrendingDown
  const cls = isZero
    ? 'bg-slate-900 border-slate-800 text-slate-300'
    : isPositive
      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
      : 'bg-rose-500/10 border-rose-500/30 text-rose-200'

  return (
    <div className={`rounded-2xl border ${cls} p-3.5 flex items-center gap-3`}>
      <div className={`w-11 h-11 rounded-xl ${isPositive ? 'bg-emerald-500/20 text-emerald-300' : isZero ? 'bg-slate-800 text-slate-400' : 'bg-rose-500/20 text-rose-300'} flex items-center justify-center shrink-0`}>
        <Icon size={20} strokeWidth={2.4} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider opacity-70">Score geral</div>
        <div className="text-[18px] font-bold font-mono tabular-nums mt-0.5">
          {isPositive && '+'}
          {delta} pontos
        </div>
      </div>
    </div>
  )
}
