import { useState } from 'react'
import {
  X,
  KeyRound,
  Apple,
  Dumbbell,
  Stethoscope,
  Brain,
  CheckCircle2,
  AlertCircle,
  Loader2,
  type LucideIcon,
} from 'lucide-react'
import type {
  CodigoProfissional,
  TipoProfissional,
} from '@/../product-mobile/sections/profissionais/types'

interface Props {
  open: boolean
  /** Fixture de códigos válidos pra demo. Em produção, lookup vem do backend. */
  codigosDisponiveis: CodigoProfissional[]
  onClose: () => void
  /** Disparado quando paciente confirma o profissional encontrado — segue pra permissões. */
  onContinuar: (codigoMatch: CodigoProfissional) => void
}

const TIPO_VISUAL: Record<
  TipoProfissional,
  { icon: LucideIcon; bg: string; text: string; label: string }
> = {
  nutricionista: {
    icon: Apple,
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    label: 'Nutri',
  },
  personal: {
    icon: Dumbbell,
    bg: 'bg-teal-500/15',
    text: 'text-teal-300',
    label: 'Personal',
  },
  medico: {
    icon: Stethoscope,
    bg: 'bg-sky-500/15',
    text: 'text-sky-300',
    label: 'Médico',
  },
  psicologo: {
    icon: Brain,
    bg: 'bg-violet-500/15',
    text: 'text-violet-300',
    label: 'Psicólogo',
  },
}

type Estado =
  | { kind: 'input' }
  | { kind: 'loading' }
  | { kind: 'erro'; mensagem: string }
  | { kind: 'encontrado'; match: CodigoProfissional }

/**
 * Normaliza input: uppercase + permite só letras/números/dash.
 */
function normalizar(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9-]/g, '')
}

export function AdicionarProfissional({
  open,
  codigosDisponiveis,
  onClose,
  onContinuar,
}: Props) {
  const [valor, setValor] = useState('')
  const [estado, setEstado] = useState<Estado>({ kind: 'input' })

  if (!open) return null

  const handleChange = (raw: string) => {
    setValor(normalizar(raw))
    if (estado.kind !== 'input') setEstado({ kind: 'input' })
  }

  const handleBuscar = () => {
    const codigo = valor.trim()
    if (codigo.length < 4) {
      setEstado({ kind: 'erro', mensagem: 'Digite o código completo.' })
      return
    }
    setEstado({ kind: 'loading' })
    // Simula latência de rede
    setTimeout(() => {
      const match = codigosDisponiveis.find(
        (c) => c.codigo.toUpperCase() === codigo,
      )
      if (match) {
        setEstado({ kind: 'encontrado', match })
      } else {
        setEstado({
          kind: 'erro',
          mensagem:
            'Código não encontrado. Verifique se digitou corretamente.',
        })
      }
    }, 600)
  }

  const handleContinuar = () => {
    if (estado.kind === 'encontrado') {
      onContinuar(estado.match)
      // reset
      setValor('')
      setEstado({ kind: 'input' })
    }
  }

  const handleTentarNovamente = () => {
    setValor('')
    setEstado({ kind: 'input' })
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={onClose}
          className="w-9 h-9 -ml-2 rounded-lg flex items-center justify-center hover:bg-slate-800"
        >
          <X size={18} className="text-slate-300" />
        </button>
        <div className="text-center">
          <div className="text-slate-100 text-[14px] font-semibold">
            Adicionar profissional
          </div>
          <div className="text-slate-500 text-[11px]">por código</div>
        </div>
        <div className="w-9" />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Estado: input */}
        {(estado.kind === 'input' || estado.kind === 'erro') && (
          <>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/15 flex items-center justify-center mb-3">
                <KeyRound size={22} className="text-teal-300" />
              </div>
              <h2 className="text-slate-100 text-[16px] font-semibold mb-1.5">
                Insira o código do profissional
              </h2>
              <p className="text-slate-400 text-[12.5px] leading-snug max-w-[280px]">
                Peça o código pessoal ao seu nutri, personal, médico ou psicólogo.
                Ele aparece no app dele em "Meu código".
              </p>
            </div>

            <label className="block">
              <span className="text-slate-500 text-[10.5px] uppercase tracking-wider font-semibold mb-2 block">
                Código
              </span>
              <input
                type="text"
                value={valor}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="EX: RAFA-7K2X"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-[18px] font-mono tabular-nums tracking-wider text-slate-100 placeholder:text-slate-600 text-center focus:outline-none focus:border-teal-500 transition-colors"
                maxLength={20}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleBuscar()
                }}
              />
            </label>

            {estado.kind === 'erro' && (
              <div className="mt-3 rounded-xl bg-rose-500/10 border border-rose-500/30 px-3 py-2.5 flex items-start gap-2">
                <AlertCircle
                  size={13}
                  className="text-rose-300 mt-0.5 shrink-0"
                />
                <p className="text-rose-200 text-[12px] leading-snug">
                  {estado.mensagem}
                </p>
              </div>
            )}

            <div className="mt-4 rounded-xl bg-slate-900/60 border border-slate-800 p-3 flex items-start gap-2">
              <span className="text-slate-500 text-[10.5px] font-mono mt-0.5 shrink-0">
                ?
              </span>
              <p className="text-slate-400 text-[11.5px] leading-snug">
                O código tem entre 8 e 12 caracteres com hífen no meio (ex:{' '}
                <span className="text-slate-300 font-mono">RAFA-7K2X</span>). Você
                pode digitar em minúsculas — a gente formata.
              </p>
            </div>
          </>
        )}

        {/* Estado: loading */}
        {estado.kind === 'loading' && (
          <div className="flex flex-col items-center text-center py-12">
            <Loader2
              size={28}
              className="text-teal-300 animate-spin mb-4"
              strokeWidth={2}
            />
            <p className="text-slate-300 text-[13px]">Procurando profissional…</p>
            <p className="text-slate-500 text-[11px] font-mono tabular-nums mt-1">
              {valor}
            </p>
          </div>
        )}

        {/* Estado: encontrado */}
        {estado.kind === 'encontrado' && (
          <ProfEncontrado match={estado.match} />
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-800 bg-slate-950 space-y-2">
        {estado.kind === 'input' && (
          <button
            onClick={handleBuscar}
            disabled={valor.trim().length < 4}
            className={`w-full rounded-xl py-3 text-[14px] font-semibold transition-all ${
              valor.trim().length >= 4
                ? 'bg-teal-500 text-slate-950 active:scale-[0.99]'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            Buscar
          </button>
        )}
        {estado.kind === 'erro' && (
          <button
            onClick={handleTentarNovamente}
            className="w-full rounded-xl py-3 text-[14px] font-semibold bg-slate-900 border border-slate-800 text-slate-200 active:scale-[0.99] transition-all"
          >
            Tentar novamente
          </button>
        )}
        {estado.kind === 'encontrado' && (
          <>
            <button
              onClick={handleContinuar}
              className="w-full rounded-xl py-3 text-[14px] font-semibold bg-teal-500 text-slate-950 active:scale-[0.99] transition-all"
            >
              Continuar
            </button>
            <button
              onClick={handleTentarNovamente}
              className="w-full rounded-xl py-2.5 text-[12.5px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              Não é esse · usar outro código
            </button>
          </>
        )}
        {estado.kind === 'loading' && (
          <button
            disabled
            className="w-full rounded-xl py-3 text-[14px] font-semibold bg-slate-800 text-slate-500"
          >
            Buscando…
          </button>
        )}
      </div>
    </div>
  )
}

function ProfEncontrado({ match }: { match: CodigoProfissional }) {
  const { prof, mensagem } = match
  const visual = TIPO_VISUAL[prof.tipo]
  const Icon = visual.icon

  return (
    <div>
      <div className="flex flex-col items-center text-center mb-5">
        <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center mb-2">
          <CheckCircle2 size={20} className="text-emerald-300" />
        </div>
        <div className="text-slate-100 text-[14px] font-semibold">
          Profissional encontrado
        </div>
      </div>

      {/* Card do profissional */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-200 font-bold text-[18px] shrink-0">
            {prof.fotoUrl ? (
              <img
                src={prof.fotoUrl}
                alt={prof.fullName}
                className="w-full h-full rounded-2xl object-cover"
              />
            ) : (
              prof.inicial
            )}
            <div
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${visual.bg} ${visual.text} flex items-center justify-center border-2 border-slate-900`}
            >
              <Icon size={11} strokeWidth={2.4} />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-slate-100 text-[14.5px] font-semibold truncate">
              {prof.fullName}
            </div>
            <div className="text-slate-400 text-[12px] truncate">
              {prof.especialidade}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span
                className={`px-1.5 py-0.5 rounded ${visual.bg} ${visual.text} text-[9px] font-semibold uppercase tracking-wider`}
              >
                {visual.label}
              </span>
              <span className="text-slate-500 text-[10px] font-mono">
                {prof.registro}
              </span>
            </div>
          </div>
        </div>

        {mensagem && (
          <div className="mt-3 pt-3 border-t border-slate-800">
            <div className="text-slate-500 text-[9.5px] uppercase tracking-wider font-semibold mb-1">
              Mensagem
            </div>
            <p className="text-slate-200 text-[12.5px] leading-snug">
              {mensagem}
            </p>
          </div>
        )}
      </div>

      <p className="text-slate-500 text-[11px] text-center leading-snug px-4">
        Antes de vincular, você vai definir quais dados o profissional pode ver.
      </p>
    </div>
  )
}
