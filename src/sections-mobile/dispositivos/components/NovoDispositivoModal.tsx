import { useEffect, useState } from 'react'
import type { CategoriaPicker, OrigemPickerItem } from '@/../product-mobile/sections/dispositivos/types'
import type { DeviceType } from '@/../product-mobile/api-types'
import { X, ChevronRight, ChevronDown, Sparkles } from 'lucide-react'
import { getIcon, bgFromCor, textFromCor } from './_shared'

interface NovoDispositivoModalProps {
  open: boolean
  onClose: () => void
  categorias: CategoriaPicker[]
  onIntegracaoSelecionada?: (deviceType: DeviceType) => void
}

export function NovoDispositivoModal({
  open,
  onClose,
  categorias,
  onIntegracaoSelecionada,
}: NovoDispositivoModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Backdrop */}
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Fechar"
      />

      {/* Sheet */}
      <div className="relative mt-auto bg-slate-900 border-t border-slate-800 rounded-t-3xl max-h-[88%] flex flex-col animate-slide-up shadow-2xl">
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-700" />
        </div>

        <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-slate-800/60">
          <div>
            <h2 className="text-slate-100 font-semibold text-[18px]">Adicionar dispositivo</h2>
            <p className="text-slate-400 text-[12px] mt-0.5">
              Escolha um agregador — ele consolida seus wearables
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800/70 flex items-center justify-center text-slate-300 hover:text-white"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto px-4 pt-3 pb-6 flex-1">
          {categorias.map((cat) => (
            <IntegracaoCard
              key={cat.id}
              categoria={cat}
              onSelect={() => {
                if (cat.disponivel) onIntegracaoSelecionada?.(cat.id)
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 280ms cubic-bezier(0.32, 0.72, 0, 1);
        }
      `}</style>
    </div>
  )
}

interface IntegracaoCardProps {
  categoria: CategoriaPicker
  onSelect: () => void
}

function IntegracaoCard({ categoria, onSelect }: IntegracaoCardProps) {
  const [expanded, setExpanded] = useState(categoria.disponivel)
  const Icon = getIcon(categoria.iconeNome)
  const iconBg = bgFromCor(categoria.iconeCor)
  const iconText = textFromCor(categoria.iconeCor)
  const disabled = !categoria.disponivel

  return (
    <div
      className={`mb-3 rounded-2xl overflow-hidden border ${
        disabled ? 'border-slate-800/60 opacity-65' : 'border-slate-800'
      } bg-slate-950`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-slate-800/30"
      >
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center ${iconText} shrink-0`}>
          <Icon size={20} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-100 font-semibold text-[14.5px]">{categoria.label}</span>
            {categoria.disponivel ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-[9.5px] font-semibold uppercase tracking-wide">
                <Sparkles size={9} strokeWidth={2.4} />
                Disponível
              </span>
            ) : (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[9.5px] font-semibold uppercase tracking-wide">
                Em breve
              </span>
            )}
          </div>
          <span className="block text-slate-400 text-[12px] truncate mt-0.5">
            {categoria.descricao}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-slate-500 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="border-t border-slate-800/60">
          {categoria.origens.map((o) => (
            <OrigemRow key={o.id} origem={o} />
          ))}
          {!disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSelect()
              }}
              className="w-full px-4 py-3 border-t border-slate-800/60 inline-flex items-center justify-center gap-1.5 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 font-semibold text-[13px]"
            >
              Conectar {categoria.label}
              <ChevronRight size={14} strokeWidth={2.4} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

interface OrigemRowProps {
  origem: OrigemPickerItem
}

function OrigemRow({ origem }: OrigemRowProps) {
  const Icon = getIcon(origem.iconeNome)
  const iconText = textFromCor(origem.iconeCor)
  const iconBg = bgFromCor(origem.iconeCor)
  return (
    <div className="px-3.5 py-2.5 flex items-center gap-3 border-b border-slate-800/40 last:border-b-0">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center ${iconText} shrink-0`}>
        <Icon size={14} strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-100 font-medium text-[12.5px]">{origem.label}</span>
          {origem.automatico && (
            <span className="text-emerald-400 text-[9px] font-semibold uppercase tracking-wider">
              auto
            </span>
          )}
        </div>
        <span className="block text-slate-500 text-[11px] truncate">{origem.descricao}</span>
      </div>
    </div>
  )
}
