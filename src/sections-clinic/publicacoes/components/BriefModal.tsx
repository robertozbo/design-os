import { useEffect, useRef, useState } from 'react'
import { Mic, Sparkles, Square, Wand2, X } from 'lucide-react'
import type {
  BriefValues,
  FormatoPublicacao,
} from '@/../product-clinic/sections/publicacoes/types'
import { FORMATO_LABEL } from './helpers'

type Etapa = 'gravando' | 'transcrevendo' | 'brief'

interface Props {
  /** `voz` abre no microfone; `manual` abre direto no formulário. */
  modo: 'voz' | 'manual'
  onGerar: (brief: BriefValues) => void
  onFechar: () => void
}

/** O que a transcrição devolveria — é a demonstração do caminho por voz. */
const TRANSCRICAO =
  'Cria um post pra mim sobre como a nutrição favorece a saúde em todas as idades e uma melhor qualidade de vida. Tom acolhedor, em carrossel, pra publicar na próxima terça de manhã.'

const EXTRAIDO: BriefValues = {
  tema: 'Nutrição favorece a saúde em todas as idades',
  formato: 'carrossel',
  tom: 'acolhedor',
  agendadoPara: '2026-09-22T09:00',
  origem: 'voz',
  briefOriginal: TRANSCRICAO,
}

const VAZIO: BriefValues = {
  tema: '',
  formato: 'feed',
  tom: 'informativo',
  agendadoPara: null,
  origem: 'manual',
  briefOriginal: null,
}

/**
 * Ditar → transcrever → **brief estruturado editável** → gerar.
 *
 * As três etapas são separadas de propósito: o passo que a IA erra é a extração
 * ("na próxima terça" virou qual dia?), e é justamente o que aparece em campo
 * editável antes de gastar uma geração.
 */
export function BriefModal({ modo, onGerar, onFechar }: Props) {
  const [etapa, setEtapa] = useState<Etapa>(modo === 'voz' ? 'gravando' : 'brief')
  const [segundos, setSegundos] = useState(0)
  const [brief, setBrief] = useState<BriefValues>(modo === 'voz' ? VAZIO : VAZIO)
  const [extraido, setExtraido] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (etapa !== 'gravando') return
    timer.current = window.setInterval(() => setSegundos((s) => s + 1), 1000)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [etapa])

  const pararGravacao = () => {
    setEtapa('transcrevendo')
    window.setTimeout(() => {
      setBrief(EXTRAIDO)
      setExtraido(true)
      setEtapa('brief')
    }, 900)
  }

  const podeGerar = brief.tema.trim().length > 2

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-t-2xl bg-white shadow-xl dark:bg-slate-900 sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-50">
            {modo === 'voz' ? <Mic className="h-4 w-4" /> : <Wand2 className="h-4 w-4" />}
            {modo === 'voz' ? 'Ditar publicação' : 'Nova publicação'}
          </h2>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {etapa === 'gravando' && (
          <div className="flex flex-col items-center gap-4 px-6 py-10">
            <div className="flex h-16 items-end gap-1">
              {[0.3, 0.7, 1, 0.5, 0.9, 0.4, 0.8, 0.6, 1, 0.35].map((h, i) => (
                <span
                  key={i}
                  className="w-1.5 animate-pulse rounded-full bg-teal-500"
                  style={{ height: `${h * 100}%`, animationDelay: `${i * 90}ms` }}
                />
              ))}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Fale o que você quer publicar.
            </p>
            <p className="font-mono text-xs tabular-nums text-slate-400">
              0:{String(segundos).padStart(2, '0')}
            </p>
            <button
              onClick={pararGravacao}
              className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
            >
              <Square className="h-3.5 w-3.5" /> Parar e transcrever
            </button>
            <p className="max-w-xs text-center text-[11px] text-slate-400 dark:text-slate-500">
              O áudio é transcrito e descartado. Só o texto fica guardado com o post.
            </p>
          </div>
        )}

        {etapa === 'transcrevendo' && (
          <div className="flex flex-col items-center gap-3 px-6 py-14">
            <Sparkles className="h-6 w-6 animate-pulse text-violet-500" />
            <p className="text-sm text-slate-600 dark:text-slate-300">Transcrevendo…</p>
          </div>
        )}

        {etapa === 'brief' && (
          <div className="max-h-[70vh] overflow-y-auto px-4 py-4">
            {brief.briefOriginal && (
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  transcrição
                </p>
                <p className="mt-1 text-xs italic leading-relaxed text-slate-600 dark:text-slate-300">
                  “{brief.briefOriginal}”
                </p>
              </div>
            )}

            <div className="mt-4 space-y-3.5">
              <Campo rotulo="Tema" extraido={extraido}>
                <input
                  value={brief.tema}
                  onChange={(e) => setBrief({ ...brief, tema: e.target.value })}
                  placeholder="Sobre o que é o post?"
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </Campo>

              <Campo rotulo="Formato" extraido={extraido}>
                <div className="flex flex-wrap gap-1.5">
                  {(['feed', 'carrossel', 'story'] as FormatoPublicacao[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setBrief({ ...brief, formato: f })}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                        brief.formato === f
                          ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                          : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      {FORMATO_LABEL[f]}
                    </button>
                  ))}
                </div>
              </Campo>

              <Campo rotulo="Tom" extraido={extraido}>
                <div className="flex flex-wrap gap-1.5">
                  {['acolhedor', 'informativo', 'direto', 'técnico'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setBrief({ ...brief, tom: t })}
                      className={`rounded-full border px-2.5 py-1 text-[11px] ${
                        brief.tom === t
                          ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Campo>

              <Campo rotulo="Quando publicar (opcional)" extraido={extraido}>
                <input
                  type="datetime-local"
                  value={brief.agendadoPara ?? ''}
                  onChange={(e) =>
                    setBrief({ ...brief, agendadoPara: e.target.value || null })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                  A data entra no rascunho. O post só vai para a fila depois de alguém revisar.
                </p>
              </Campo>
            </div>
          </div>
        )}

        {etapa === 'brief' && (
          <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Gerar gasta 1 da cota.</p>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={onFechar}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => onGerar({ ...brief, origem: extraido ? 'voz' : 'manual' })}
                disabled={!podeGerar}
                title={podeGerar ? undefined : 'Escreva o tema do post'}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
              >
                <Sparkles className="h-4 w-4" /> Gerar post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Campo({
  rotulo,
  extraido,
  children,
}: {
  rotulo: string
  extraido: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5">
        <label className="text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {rotulo}
        </label>
        {extraido && (
          <span className="rounded bg-violet-50 px-1 py-0.5 text-[10px] text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
            do áudio
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
