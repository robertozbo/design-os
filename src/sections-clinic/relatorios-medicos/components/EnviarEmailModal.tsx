import { useState } from 'react'
import { Check, Paperclip, Send, ShieldCheck, X } from 'lucide-react'
import type { Relatorio } from '@/../product-clinic/sections/relatorios-medicos/types'
import { TIPO_LABEL, dataCurta } from './helpers'

export interface EnvioEmail {
  para: string
  assunto: string
  mensagem: string
}

interface Props {
  relatorio: Relatorio
  clinica: string
  onEnviar: (envio: EnvioEmail) => void
  onFechar: () => void
}

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function EnviarEmailModal({ relatorio: r, clinica, onEnviar, onFechar }: Props) {
  const [para, setPara] = useState(r.paciente.email)
  const [assunto, setAssunto] = useState(`${r.titulo} — ${dataCurta(r.consultaData)} · ${clinica}`)
  const [mensagem, setMensagem] = useState(
    `Olá, ${r.paciente.nome.split(' ')[0]}.\n\nSegue em anexo o documento "${r.titulo}", referente à consulta de ${dataCurta(r.consultaData)}.\n\nQualquer dúvida, estamos à disposição.\n\n${clinica}`,
  )
  const [consentimento, setConsentimento] = useState(false)

  const emailOk = EMAIL_VALIDO.test(para.trim())
  const podeEnviar = emailOk && assunto.trim().length > 0 && consentimento
  const arquivo = `${r.numero.toLowerCase()}-${TIPO_LABEL[r.tipo].toLowerCase().replace(/\s+/g, '-')}.pdf`

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl dark:bg-slate-900 sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Enviar por e-mail
          </h2>
          <button
            aria-label="Fechar"
            onClick={onFechar}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Para
            </label>
            <input
              value={para}
              onChange={(e) => setPara(e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:ring-1 dark:bg-slate-900 dark:text-slate-200 ${
                emailOk || para.trim().length === 0
                  ? 'border-slate-200 focus:border-teal-500 focus:ring-teal-500 dark:border-slate-700'
                  : 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
              }`}
            />
            {!emailOk && para.trim().length > 0 && (
              <p className="mt-1 text-[11px] text-rose-500">E-mail inválido.</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Assunto
            </label>
            <input
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">
              Mensagem
            </label>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              rows={6}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-xs leading-relaxed text-slate-700 outline-none transition-colors focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-800">
            <Paperclip className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="min-w-0 flex-1 truncate text-xs text-slate-600 dark:text-slate-300">
              {arquivo}
            </span>
            <span className="shrink-0 text-[10px] text-slate-400">PDF · 128 KB</span>
          </div>

          <button
            onClick={() => setConsentimento((v) => !v)}
            className={`flex w-full items-start gap-2.5 rounded-xl border p-3 text-left transition-colors ${
              consentimento
                ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
            }`}
          >
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                consentimento
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
            >
              {consentimento && <Check className="h-3 w-3" />}
            </span>
            <span className="text-[11px] leading-snug text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200">
                <ShieldCheck className="h-3 w-3" /> Autorização do paciente
              </span>
              <br />O paciente autoriza o envio deste documento clínico para o e-mail informado. O
              envio fica registrado no audit log (LGPD).
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-3.5 dark:border-slate-800">
          <button
            onClick={onFechar}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            disabled={!podeEnviar}
            onClick={() =>
              onEnviar({ para: para.trim(), assunto: assunto.trim(), mensagem: mensagem.trim() })
            }
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" /> Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
