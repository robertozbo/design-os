import { useEffect, useState } from 'react'
import { AlertTriangle, ShieldAlert, Trash2, X } from 'lucide-react'
import type { PacienteListItem } from '@/../product-clinico/sections/pacientes/types'

export type MotivoExclusao =
  | 'duplicado'
  | 'erro_cadastro'
  | 'solicitacao_paciente'
  | 'inativo'
  | 'outro'

interface Props {
  paciente: PacienteListItem | null
  onClose?: () => void
  onConfirmar?: (motivo: MotivoExclusao, justificativa: string) => void
}

const MOTIVOS: { id: MotivoExclusao; label: string }[] = [
  { id: 'duplicado', label: 'Cadastro duplicado' },
  { id: 'erro_cadastro', label: 'Erro de cadastro' },
  { id: 'solicitacao_paciente', label: 'Solicitação do titular (LGPD)' },
  { id: 'inativo', label: 'Paciente inativo (>2 anos sem retorno)' },
  { id: 'outro', label: 'Outro' },
]

const MIN_JUSTIFICATIVA = 10

export function ExcluirPacienteDialog({ paciente, onClose, onConfirmar }: Props) {
  const [motivo, setMotivo] = useState<MotivoExclusao | null>(null)
  const [justificativa, setJustificativa] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (paciente) {
      setMotivo(null)
      setJustificativa('')
      setEnviando(false)
    }
  }, [paciente])

  useEffect(() => {
    if (!paciente) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !enviando) onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paciente, enviando, onClose])

  if (!paciente) return null

  const valido =
    motivo !== null && justificativa.trim().length >= MIN_JUSTIFICATIVA && !enviando

  const submeter = () => {
    if (!valido || !motivo) return
    setEnviando(true)
    setTimeout(() => onConfirmar?.(motivo, justificativa.trim()), 700)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={() => !enviando && onClose?.()}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] dark:bg-slate-950/70"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        {/* Header */}
        <header className="flex items-start gap-3 border-b border-slate-200/80 bg-rose-50/40 px-5 py-4 dark:border-slate-800/80 dark:bg-rose-950/20">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
            <Trash2 className="size-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Excluir paciente?
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {paciente.nome} · {paciente.idade} anos · {paciente.convenio}
            </p>
          </div>
          <button
            onClick={() => !enviando && onClose?.()}
            disabled={enviando}
            aria-label="Fechar"
            className="-mr-1 -mt-1 inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="space-y-4 px-5 py-4">
          {/* Aviso CFM */}
          <div className="flex gap-2.5 rounded-lg border border-amber-200/70 bg-amber-50/60 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400" />
            <div className="text-[11px] leading-relaxed text-amber-900 dark:text-amber-200">
              <p className="font-semibold">Atenção — exclusão é arquivamento</p>
              <p className="mt-0.5">
                CFM 1.821/2007 exige guarda do prontuário por <strong>20 anos</strong>. O
                vínculo paciente↔médico será encerrado e o paciente desaparece da lista, mas
                <strong> dados clínicos ficam retidos</strong> e acessíveis via audit log.
              </p>
            </div>
          </div>

          {/* Motivo */}
          <div>
            <p className="mb-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              Motivo da exclusão
            </p>
            <div className="space-y-1">
              {MOTIVOS.map((m) => {
                const ativo = motivo === m.id
                return (
                  <label
                    key={m.id}
                    className={`
                      flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-xs transition-all
                      ${
                        ativo
                          ? 'border-rose-300 bg-rose-50/60 text-rose-900 dark:border-rose-700 dark:bg-rose-950/30 dark:text-rose-200'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-600'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="motivo-exclusao"
                      checked={ativo}
                      onChange={() => setMotivo(m.id)}
                      disabled={enviando}
                      className="size-3.5 text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-medium">{m.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Justificativa */}
          <div>
            <label
              htmlFor="excluir-justif"
              className="mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100"
            >
              Justificativa <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="excluir-justif"
              rows={3}
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              disabled={enviando}
              placeholder="Descreva a justificativa do arquivamento (mín. 10 caracteres)…"
              className="
                w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm
                placeholder:text-slate-400
                focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30
                dark:border-slate-700 dark:bg-slate-900 dark:placeholder:text-slate-500
                disabled:opacity-50
              "
            />
            <div className="mt-1 flex justify-between text-[10px]">
              <span
                className={
                  justificativa.trim().length < MIN_JUSTIFICATIVA
                    ? 'text-slate-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }
              >
                mínimo {MIN_JUSTIFICATIVA} caracteres
              </span>
              <span className="font-mono tabular-nums text-slate-400">
                {justificativa.trim().length}
              </span>
            </div>
          </div>

          {/* LGPD note */}
          <p className="flex items-start gap-2 rounded-md bg-slate-100/60 px-3 py-2 text-[11px] leading-relaxed text-slate-600 dark:bg-slate-900/60 dark:text-slate-400">
            <ShieldAlert className="mt-0.5 size-3 shrink-0 text-slate-400" />
            Audit log registrará: ator, timestamp, motivo e justificativa. Operação não é
            reversível pela UI — só por solicitação ao DPO da clínica.
          </p>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-slate-200/80 bg-slate-50/40 px-5 py-3 dark:border-slate-800/80 dark:bg-slate-950/60">
          <button
            type="button"
            onClick={() => !enviando && onClose?.()}
            disabled={enviando}
            className="inline-flex items-center rounded-lg px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={submeter}
            disabled={!valido}
            className="
              inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors
              hover:bg-rose-500
              focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950
              disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-rose-600
            "
          >
            <Trash2 className="size-3.5" />
            {enviando ? 'Arquivando…' : 'Excluir paciente'}
          </button>
        </footer>
      </div>
    </div>
  )
}
