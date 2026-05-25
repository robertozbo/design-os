import { useState } from 'react'
import { ShieldCheck, X, Camera, Sparkles, Database, Share2 } from 'lucide-react'

export type EscopoConsentimento =
  | 'analise_visual'
  | 'projecao_ia'
  | 'armazenamento'
  | 'export_profissional'

interface ConsentimentoModalProps {
  open: boolean
  /** Versão atual do termo (vai pra `SnapshotConsentimento.versaoTermo`) */
  versaoTermo?: string
  onClose: () => void
  onAceitar: (escopo: EscopoConsentimento[]) => void
}

interface EscopoItem {
  id: EscopoConsentimento
  label: string
  descricao: string
  icon: typeof Camera
  obrigatorio: boolean
}

const ITENS: EscopoItem[] = [
  {
    id: 'analise_visual',
    label: 'Análise visual das fotos',
    descricao: 'IA avalia distribuição corporal, postura e coerência com a bioimpedância. Não diagnostica.',
    icon: Camera,
    obrigatorio: true,
  },
  {
    id: 'armazenamento',
    label: 'Armazenamento criptografado',
    descricao: 'Suas fotos e dados ficam privados, criptografados em repouso e em trânsito.',
    icon: Database,
    obrigatorio: true,
  },
  {
    id: 'projecao_ia',
    label: 'Projeção corporal (Nano Banana)',
    descricao: 'Permite gerar imagem estimada de "como ficaria" atingindo a meta. Sempre rotulado como estimativa.',
    icon: Sparkles,
    obrigatorio: false,
  },
  {
    id: 'export_profissional',
    label: 'Compartilhar com profissional vinculado',
    descricao: 'Liberar exportação do snapshot pra nutricionista/personal/médico que você já tem vinculado.',
    icon: Share2,
    obrigatorio: false,
  },
]

export function ConsentimentoModal({
  open,
  versaoTermo = 'v1.0',
  onClose,
  onAceitar,
}: ConsentimentoModalProps) {
  const [escopo, setEscopo] = useState<Set<EscopoConsentimento>>(
    new Set(ITENS.filter((i) => i.obrigatorio).map((i) => i.id)),
  )

  if (!open) return null

  const toggle = (id: EscopoConsentimento, obrigatorio: boolean) => {
    if (obrigatorio) return
    setEscopo((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-end">
      <div className="bg-slate-950 border-t border-slate-800 rounded-t-3xl max-h-[92%] flex flex-col">
        <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3 border-b border-slate-900">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-300 shrink-0">
              <ShieldCheck size={16} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <div className="text-slate-50 font-semibold text-[14px] leading-tight">
                Consentimento LGPD
              </div>
              <div className="text-slate-500 text-[10.5px] mt-0.5 font-mono">
                termo {versaoTermo} · dados sensíveis
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 flex items-center justify-center shrink-0"
            aria-label="Fechar"
          >
            <X size={16} strokeWidth={2.2} />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-3 space-y-2.5">
          <p className="text-slate-300 text-[12px] leading-relaxed">
            Pra gerar a análise, precisamos do seu aceite. Nada disso é diagnóstico médico — é uma
            ferramenta educativa de acompanhamento.
          </p>

          <ul className="space-y-2 mt-2">
            {ITENS.map((item) => {
              const Icon = item.icon
              const ativo = escopo.has(item.id)
              return (
                <li
                  key={item.id}
                  className={`rounded-xl border p-3 transition-colors ${
                    ativo
                      ? 'border-teal-500/40 bg-teal-500/5'
                      : 'border-slate-800 bg-slate-900/40'
                  }`}
                >
                  <button
                    onClick={() => toggle(item.id, item.obrigatorio)}
                    disabled={item.obrigatorio}
                    className="w-full flex items-start gap-3 text-left disabled:cursor-default"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                        ativo
                          ? 'bg-teal-500/20 text-teal-300'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Icon size={14} strokeWidth={2.2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-100 text-[12.5px] font-semibold">
                          {item.label}
                        </span>
                        {item.obrigatorio && (
                          <span className="text-[8.5px] font-mono uppercase tracking-wider text-slate-500">
                            obrigatório
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-[11px] leading-snug mt-1">
                        {item.descricao}
                      </p>
                    </div>
                    <div
                      className={`w-9 h-5 rounded-full shrink-0 mt-0.5 transition-colors ${
                        ativo ? 'bg-teal-500' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-slate-50 mt-0.5 transition-transform ${
                          ativo ? 'translate-x-[18px]' : 'translate-x-0.5'
                        }`}
                      />
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-2.5 mt-3">
            <p className="text-slate-500 text-[10.5px] leading-relaxed">
              Você pode revogar ou alterar esse consentimento a qualquer momento em
              <span className="text-slate-300"> Configurações · Privacidade</span>. Apagar uma análise
              remove fotos, métricas e prompt da nuvem.
            </p>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-slate-900 bg-slate-950 flex gap-2 pb-[max(env(safe-area-inset-bottom),12px)]">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-slate-800 text-slate-300 text-[13px] font-semibold hover:bg-slate-900"
          >
            Cancelar
          </button>
          <button
            onClick={() => onAceitar(Array.from(escopo))}
            className="flex-[2] h-11 rounded-xl bg-gradient-to-r from-teal-500 to-sky-500 text-slate-950 text-[13px] font-bold hover:opacity-95"
          >
            Aceitar e gerar análise
          </button>
        </div>
      </div>
    </div>
  )
}
