import { useMemo, useState } from 'react'
import {
  X,
  ShieldCheck,
  Scale,
  Activity,
  Dumbbell,
  Camera,
  Apple,
  Target,
  Pill,
  Brain,
  FlaskConical,
  Heart,
  type LucideIcon,
} from 'lucide-react'
import {
  CATEGORIA_DESCRICAO,
  CATEGORIA_LABEL,
  categoriasVisiveis,
  escopoDefaultPara,
  type EscopoCompartilhamento,
  type ProfissionalBase,
} from '@/../product-mobile/sections/profissionais/types'

type CategoriaKey = keyof EscopoCompartilhamento

interface Props {
  prof: ProfissionalBase
  /** "aceite" mostra "Confirmar vínculo"; "edicao" carrega escopo atual + mostra "Salvar". */
  modo: 'aceite' | 'edicao'
  /** Quando edição, escopo atual do profissional. */
  escopoAtual?: EscopoCompartilhamento
  /** Categorias consideradas sensíveis — borda destacada. */
  categoriasSensiveis?: CategoriaKey[]
  open: boolean
  onCancelar: () => void
  onConfirmar: (escopo: EscopoCompartilhamento) => void
}

const CATEGORIA_ICON: Record<CategoriaKey, LucideIcon> = {
  metricasBasicas: Scale,
  bioimpedancia: Activity,
  examesLaboratoriais: FlaskConical,
  atividades: Heart,
  treinos: Dumbbell,
  fotosCorporais: Camera,
  nutricao: Apple,
  objetivos: Target,
  medicacao: Pill,
  saudeMental: Brain,
}

const DEFAULT_SENSIVEIS: CategoriaKey[] = [
  'fotosCorporais',
  'saudeMental',
  'examesLaboratoriais',
]

const TIPO_VISUAL = {
  nutricionista: { bg: 'bg-emerald-500/15', text: 'text-emerald-300' },
  personal: { bg: 'bg-teal-500/15', text: 'text-teal-300' },
  medico: { bg: 'bg-sky-500/15', text: 'text-sky-300' },
  psicologo: { bg: 'bg-violet-500/15', text: 'text-violet-300' },
} as const

export function PermissoesCompartilhamento({
  prof,
  modo,
  escopoAtual,
  categoriasSensiveis = DEFAULT_SENSIVEIS,
  open,
  onCancelar,
  onConfirmar,
}: Props) {
  const visiveis = useMemo(() => categoriasVisiveis(prof.tipo), [prof.tipo])

  const [escopo, setEscopo] = useState<EscopoCompartilhamento>(
    () => escopoAtual ?? escopoDefaultPara(prof.tipo),
  )

  if (!open) return null

  const ativasCount = visiveis.filter((k) => escopo[k]).length
  const sensiveisSet = new Set(categoriasSensiveis)
  const visual = TIPO_VISUAL[prof.tipo]

  const toggle = (key: CategoriaKey) =>
    setEscopo((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={onCancelar}
          className="w-9 h-9 -ml-2 rounded-lg flex items-center justify-center hover:bg-slate-800"
        >
          <X size={18} className="text-slate-300" />
        </button>
        <div className="text-center">
          <div className="text-slate-100 text-[14px] font-semibold">
            {modo === 'aceite' ? 'Permissões' : 'Editar permissões'}
          </div>
          <div className="text-slate-500 text-[11px]">
            {ativasCount} de {visiveis.length} compartilhadas
          </div>
        </div>
        <div className="w-9" />
      </div>

      {/* Identidade do profissional */}
      <div className="px-4 py-4 border-b border-slate-800 flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-2xl ${visual.bg} ${visual.text} flex items-center justify-center text-[18px] font-semibold shrink-0`}
        >
          {prof.inicial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-slate-500 text-[10.5px] uppercase tracking-wider">
            {modo === 'aceite' ? 'Vinculando com' : 'Editando para'}
          </div>
          <div className="text-slate-100 text-[14.5px] font-semibold truncate">
            {prof.fullName}
          </div>
          <div className="text-slate-400 text-[11.5px] truncate">
            {prof.especialidade} · {prof.registro}
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="px-4 pt-4 pb-2">
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 flex items-start gap-2">
          <ShieldCheck
            size={14}
            className="text-teal-300 mt-0.5 shrink-0"
          />
          <p className="text-slate-300 text-[11.5px] leading-snug">
            Escolha o que <span className="text-slate-100 font-medium">{firstName(prof.fullName)}</span> vai ver no seu acompanhamento. Você pode mudar a qualquer momento.
          </p>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {visiveis.map((key) => {
          const ativo = escopo[key]
          const sensivel = sensiveisSet.has(key)
          const Icon = CATEGORIA_ICON[key]
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`w-full text-left rounded-2xl border p-3 transition-all active:scale-[0.99] ${
                ativo
                  ? sensivel
                    ? 'bg-amber-500/[0.06] border-amber-500/30'
                    : 'bg-slate-900 border-slate-700'
                  : 'bg-slate-900/40 border-slate-800/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    ativo
                      ? sensivel
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-teal-500/15 text-teal-300'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  <Icon size={15} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[13px] font-medium ${ativo ? 'text-slate-100' : 'text-slate-400'}`}
                    >
                      {CATEGORIA_LABEL[key]}
                    </span>
                    {sensivel && (
                      <span className="text-[9px] font-mono uppercase tracking-wider text-amber-300/80">
                        sensível
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-0.5 text-[11px] leading-snug ${ativo ? 'text-slate-400' : 'text-slate-500'}`}
                  >
                    {CATEGORIA_DESCRICAO[key]}
                  </p>
                </div>
                <Switch ativo={ativo} sensivel={sensivel} />
              </div>
            </button>
          )
        })}

        <div className="pt-3 pb-1">
          <p className="text-center text-slate-500 text-[10.5px] leading-snug px-4">
            Mudanças aplicam a partir de agora. Dados que o profissional já viu continuam no histórico dele.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800 bg-slate-950 space-y-2">
        <button
          onClick={() => onConfirmar(escopo)}
          className="w-full rounded-xl py-3 text-[14px] font-semibold bg-teal-500 text-slate-950 active:scale-[0.99] transition-all"
        >
          {modo === 'aceite' ? 'Confirmar vínculo' : 'Salvar alterações'}
        </button>
        <button
          onClick={onCancelar}
          className="w-full rounded-xl py-2.5 text-[12.5px] text-slate-400 hover:text-slate-200 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

/** Pula títulos comuns (Dr., Dra., Prof., etc) e retorna o primeiro nome real. */
function firstName(fullName: string): string {
  const TITULOS = /^(dr|dra|prof|profa|sr|sra|srta)\.?$/i
  const partes = fullName.trim().split(/\s+/)
  for (const p of partes) {
    if (!TITULOS.test(p)) return p
  }
  return partes[0] ?? fullName
}

function Switch({ ativo, sensivel }: { ativo: boolean; sensivel: boolean }) {
  return (
    <span
      className={`shrink-0 w-9 h-5 rounded-full relative transition-colors ${
        ativo
          ? sensivel
            ? 'bg-amber-500'
            : 'bg-teal-500'
          : 'bg-slate-700'
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-slate-50 shadow transition-all ${
          ativo ? 'left-4' : 'left-0.5'
        }`}
      />
    </span>
  )
}
