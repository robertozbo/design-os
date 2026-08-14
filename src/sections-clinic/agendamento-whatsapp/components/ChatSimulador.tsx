import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, List, MoreVertical, Phone, RotateCcw, Video } from 'lucide-react'
import type { OpcaoPasso, Passo } from '@/../product-clinic/sections/agendamento-whatsapp/types'
import { type Bolha, fragmentosNegrito } from './helpers'

interface Props {
  clinica: string
  telefone: string
  bolhas: Bolha[]
  /** Passo corrente; `undefined` enquanto o fluxo não tem próxima parada. */
  passo?: Passo
  onEscolher: (opcao: OpcaoPasso) => void
  onReiniciar: () => void
}

export function ChatSimulador({ clinica, telefone, bolhas, passo, onEscolher, onReiniciar }: Props) {
  // Guarda em QUAL passo o painel foi aberto: assim ele se fecha sozinho quando o passo muda,
  // sem precisar de um effect que chama setState.
  const [abertaEm, setAbertaEm] = useState<string | null>(null)
  const listaAberta = abertaEm !== null && abertaEm === passo?.id
  const fimRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [passo?.id, bolhas.length])

  return (
    <div className="lg:sticky lg:top-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Simulador da conversa</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            O que o paciente vê. Clique nas opções para percorrer o fluxo.
          </p>
        </div>
        <button
          onClick={onReiniciar}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reiniciar
        </button>
      </div>

      {/* Moldura do celular */}
      <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border-[6px] border-slate-800 bg-[#ece5dd] shadow-xl dark:border-slate-700 dark:bg-[#0b141a]">
        {/* Header do WhatsApp — único lugar em que o verde aparece */}
        <div className="flex items-center gap-2.5 bg-[#075e54] px-3 py-2.5 text-white">
          <ChevronLeft className="h-5 w-5 shrink-0 opacity-80" />
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
            {clinica.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-tight">{clinica}</p>
            <p className="truncate text-[11px] leading-tight text-white/70">{telefone}</p>
          </div>
          <Video className="h-4 w-4 shrink-0 opacity-70" />
          <Phone className="h-4 w-4 shrink-0 opacity-70" />
          <MoreVertical className="h-4 w-4 shrink-0 opacity-70" />
        </div>

        {/* Corpo da conversa */}
        <div className="flex max-h-[26rem] min-h-[12rem] flex-col gap-1.5 overflow-y-auto px-3 py-3">
          {bolhas.map((b) => (
            <BolhaChat key={b.id} bolha={b} />
          ))}
          <div ref={fimRef} />
        </div>

        {/* Menu do passo */}
        <div className="border-t border-black/5 bg-[#f0f0f0] px-3 py-2.5 dark:border-white/5 dark:bg-[#1f2c34]">
          {!passo || passo.tipo === 'final' ? (
            <button
              onClick={onReiniciar}
              className="w-full rounded-lg border border-slate-300 bg-white py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Conversa encerrada · reiniciar
            </button>
          ) : passo.tipo === 'botoes' ? (
            <div className="flex flex-col gap-1.5">
              {passo.opcoes.map((o) => (
                <button
                  key={o.id}
                  onClick={() => onEscolher(o)}
                  className="w-full rounded-lg border border-[#25d366]/40 bg-white py-2 text-sm font-medium text-[#0b7a5a] transition-colors hover:bg-[#25d366]/10 dark:border-[#25d366]/30 dark:bg-[#2a3942] dark:text-[#7ee2b8] dark:hover:bg-[#25d366]/15"
                >
                  {o.rotulo}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <button
                onClick={() => setAbertaEm(listaAberta ? null : (passo.id ?? null))}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#25d366]/40 bg-white py-2 text-sm font-medium text-[#0b7a5a] transition-colors hover:bg-[#25d366]/10 dark:border-[#25d366]/30 dark:bg-[#2a3942] dark:text-[#7ee2b8] dark:hover:bg-[#25d366]/15"
              >
                <List className="h-4 w-4" /> {passo.titulo ?? 'Ver opções'}
              </button>
              {listaAberta && (
                <ul className="mt-1.5 max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-[#2a3942]">
                  {passo.opcoes.map((o) => (
                    <li key={o.id} className="border-b border-slate-100 last:border-0 dark:border-white/5">
                      <button
                        onClick={() => onEscolher(o)}
                        className="w-full px-3 py-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                      >
                        <p className="text-sm text-slate-800 dark:text-slate-100">{o.rotulo}</p>
                        {o.descricao && (
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{o.descricao}</p>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {passo?.limite && (
            <p className="mt-2 text-center text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
              limite do WhatsApp · {passo.limite}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function BolhaChat({ bolha }: { bolha: Bolha }) {
  const doBot = bolha.autor === 'bot'
  return (
    <div className={`flex ${doBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-[13px] leading-snug shadow-sm ${
          doBot
            ? 'rounded-tl-none bg-white text-slate-800 dark:bg-[#202c33] dark:text-slate-100'
            : 'rounded-tr-none bg-[#d9fdd3] text-slate-800 dark:bg-[#005c4b] dark:text-slate-50'
        }`}
      >
        {fragmentosNegrito(bolha.texto).map((frag, i) =>
          i % 2 === 1 ? (
            <strong key={i} className="font-semibold">
              {frag}
            </strong>
          ) : (
            <span key={i}>{frag}</span>
          ),
        )}
      </div>
    </div>
  )
}
