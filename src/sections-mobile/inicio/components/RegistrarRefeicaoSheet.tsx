import { Camera, ChevronRight, ClipboardList, Search, X } from 'lucide-react'
import type { RegistroRefeicaoModo } from '@/../product-mobile/sections/inicio/types'

interface Props {
  open: boolean
  /** Sem plano alimentar ativo, a opção "do meu plano alimentar" não faz sentido. */
  temPlanoAlimentar: boolean
  onClose: () => void
  onEscolher: (modo: RegistroRefeicaoModo) => void
}

/**
 * Bottom sheet do "+" do card de Nutrição. A foto do prato vem primeiro e com
 * destaque: é o caminho que o paciente usa no dia a dia — a IA estima porção e
 * macros, os outros dois são o fallback manual.
 */
export function RegistrarRefeicaoSheet({ open, temPlanoAlimentar, onClose, onEscolher }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70"
      />

      <div className="relative w-full rounded-t-3xl bg-slate-900 border-t border-slate-800 pb-8">
        <div className="flex items-center px-4 pt-3.5 pb-3">
          <div className="flex-1">
            <div className="text-slate-50 text-[16px] font-semibold">Registrar refeição</div>
            <div className="text-slate-400 text-[11.5px] mt-0.5">
              Como você quer registrar o que comeu?
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center active:scale-[0.94] transition-transform"
          >
            <X size={15} className="text-slate-400" />
          </button>
        </div>

        {/* Foto do prato — caminho principal */}
        <button
          onClick={() => onEscolher('foto')}
          className="mx-4 mb-2.5 w-[calc(100%-2rem)] flex items-center gap-3 rounded-2xl bg-teal-500 px-4 py-3.5 text-left active:scale-[0.99] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-950/15 flex items-center justify-center shrink-0">
            <Camera size={19} strokeWidth={2.2} className="text-slate-950" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-slate-950 text-[14px] font-semibold">Foto do prato</div>
            <div className="text-slate-950/70 text-[11.5px] mt-0.5 leading-snug">
              A IA identifica os alimentos e estima calorias e macros
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-950/60 shrink-0" />
        </button>

        <Opcao
          icone={<Search size={17} strokeWidth={2.2} className="text-sky-300" />}
          titulo="Buscar alimento"
          texto="Tabela TACO e marcas do mercado brasileiro"
          onClick={() => onEscolher('busca')}
        />

        {temPlanoAlimentar && (
          <Opcao
            icone={<ClipboardList size={17} strokeWidth={2.2} className="text-amber-300" />}
            titulo="Do meu plano alimentar"
            texto="Marque a refeição planejada como consumida"
            onClick={() => onEscolher('plano')}
          />
        )}
      </div>
    </div>
  )
}

function Opcao({
  icone,
  titulo,
  texto,
  onClick,
}: {
  icone: React.ReactNode
  titulo: string
  texto: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="mx-4 mb-2.5 w-[calc(100%-2rem)] flex items-center gap-3 rounded-2xl bg-slate-800/60 border border-slate-800 px-4 py-3 text-left active:scale-[0.99] transition-transform"
    >
      <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
        {icone}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-slate-100 text-[13.5px] font-semibold">{titulo}</div>
        <div className="text-slate-400 text-[11.5px] mt-0.5 leading-snug">{texto}</div>
      </div>
      <ChevronRight size={15} className="text-slate-600 shrink-0" />
    </button>
  )
}
