import { Wand2, Sparkles, Lock, PersonStanding, Pencil } from 'lucide-react'
import type { ProjecaoCorporal } from '@/../product-mobile/sections/minha-saude/types'

interface ProjecaoCardProps {
  projecao: ProjecaoCorporal
  onGerar?: () => void
  onEditarMeta?: () => void
}

export function ProjecaoCard({ projecao, onGerar, onEditarMeta }: ProjecaoCardProps) {
  if (projecao.status === 'sem_dados_suficientes') {
    return <SemDadosSuficientes projecao={projecao} />
  }
  if (projecao.status === 'gerando') {
    return <Gerando />
  }
  if (projecao.status === 'pronta') {
    return <Pronta projecao={projecao} onGerar={onGerar} onEditarMeta={onEditarMeta} />
  }
  return <NaoSolicitada projecao={projecao} onGerar={onGerar} onEditarMeta={onEditarMeta} />
}

function NaoSolicitada({
  projecao,
  onGerar,
  onEditarMeta,
}: {
  projecao: ProjecaoCorporal
  onGerar?: () => void
  onEditarMeta?: () => void
}) {
  return (
    <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-slate-900 to-sky-500/10 p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-300 shrink-0">
          <Wand2 size={18} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 font-semibold text-[14px]">Projeção Corporal IA</div>
          <div className="text-slate-400 text-[11px] mt-0.5 leading-snug">
            Gere uma imagem de como você ficaria atingindo sua meta, baseada nas fotos atuais.
          </div>
        </div>
      </div>

      {projecao.metaTexto && (
        <button
          onClick={onEditarMeta}
          className="w-full rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2.5 flex items-center gap-2 text-left mb-3"
        >
          <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center text-violet-300 shrink-0">
            <Sparkles size={13} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-slate-500 text-[9.5px] font-semibold uppercase tracking-wider">Meta</div>
            <div className="text-slate-100 text-[12px] mt-0.5 leading-snug">{projecao.metaTexto}</div>
          </div>
          <Pencil size={12} className="text-slate-500 shrink-0" />
        </button>
      )}

      <button
        onClick={onGerar}
        className="w-full h-12 rounded-2xl bg-gradient-to-r from-violet-500 to-sky-500 text-white font-semibold text-[13.5px] flex items-center justify-center gap-2"
      >
        <Wand2 size={15} strokeWidth={2.4} />
        Gerar projeção
      </button>
      <div className="text-slate-600 text-[10px] text-center mt-2">
        IA usa suas fotos + meta · ~30 segundos
      </div>
    </div>
  )
}

function Gerando() {
  return (
    <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-6 flex flex-col items-center">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center animate-pulse">
        <Wand2 size={24} className="text-white" strokeWidth={2.4} />
      </div>
      <div className="text-slate-100 font-semibold text-[14px] mt-3">Gerando projeção</div>
      <div className="text-slate-500 text-[11px] mt-1">Pode levar até 30 segundos...</div>
    </div>
  )
}

function Pronta({
  projecao,
  onGerar,
  onEditarMeta,
}: {
  projecao: ProjecaoCorporal
  onGerar?: () => void
  onEditarMeta?: () => void
}) {
  return (
    <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-slate-900 to-sky-500/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-violet-300 shrink-0">
          <Wand2 size={15} strokeWidth={2.4} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 font-semibold text-[12.5px]">Projeção pronta</div>
          {projecao.metaTexto && (
            <div className="text-violet-300/70 text-[10.5px] truncate">Meta: {projecao.metaTexto}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <div className="text-slate-500 text-[9.5px] font-semibold uppercase tracking-wider text-center mb-1.5">
            Atual
          </div>
          <div className="aspect-[3/4] rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
            <PersonStanding size={64} className="text-slate-600/60" strokeWidth={1.2} />
          </div>
        </div>
        <div>
          <div className="text-violet-300 text-[9.5px] font-semibold uppercase tracking-wider text-center mb-1.5">
            Meta IA
          </div>
          <div className="aspect-[3/4] rounded-xl bg-violet-500/5 border border-violet-500/30 flex items-center justify-center">
            <PersonStanding size={64} className="text-violet-300/60" strokeWidth={1.2} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onEditarMeta}
          className="h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-medium text-[12px] flex items-center justify-center gap-1.5"
        >
          <Pencil size={12} strokeWidth={2.2} />
          Editar meta
        </button>
        <button
          onClick={onGerar}
          className="h-10 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-100 font-medium text-[12px] flex items-center justify-center gap-1.5"
        >
          <Sparkles size={12} strokeWidth={2.4} />
          Regenerar
        </button>
      </div>
    </div>
  )
}

function SemDadosSuficientes({ projecao }: { projecao: ProjecaoCorporal }) {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 shrink-0">
          <Lock size={15} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-amber-200 text-[13px] font-semibold">Projeção indisponível</div>
          <div className="text-amber-200/70 text-[11px] mt-0.5 leading-snug">
            {projecao.mensagem ?? 'Adicione um set de fotos corporais e defina uma meta pra gerar a projeção.'}
          </div>
        </div>
      </div>
    </div>
  )
}
