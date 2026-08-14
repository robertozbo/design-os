import { useEffect, useRef, useState } from 'react'
import {
  BatteryFull,
  Camera,
  CheckCheck,
  ChevronLeft,
  List,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  RotateCcw,
  Signal,
  Smile,
  Video,
  Wifi,
} from 'lucide-react'
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

  // Passo final não tem menu: a conversa simplesmente termina, como no WhatsApp. Reiniciar é
  // controle do Design OS e vive fora do aparelho.
  const temMenu = !!passo && passo.tipo !== 'final' && passo.opcoes.length > 0

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [passo?.id, bolhas.length])

  return (
    <div className="lg:sticky lg:top-6">
      <div className="mb-3 flex items-start justify-between gap-2">
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

      {/* Aparelho: bezel escuro + tela arredondada por dentro */}
      <div className="mx-auto w-full max-w-[22rem] rounded-[2.75rem] bg-slate-900 p-2.5 shadow-2xl ring-1 ring-slate-950/40 dark:bg-slate-950 dark:ring-white/10">
        <div className="relative overflow-hidden rounded-[2.1rem] bg-[#ece5dd] dark:bg-[#0b141a]">
          {/* Ilha dinâmica */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-slate-950" />

          {/* Status bar do sistema */}
          <div className="flex items-center justify-between bg-[#075e54] px-5 pb-1 pt-2.5 text-[11px] font-medium text-white">
            <span className="tabular-nums">09:41</span>
            <span className="flex items-center gap-1">
              <Signal className="h-3 w-3" />
              <Wifi className="h-3 w-3" />
              <BatteryFull className="h-3.5 w-3.5" />
            </span>
          </div>

          {/* Header da conversa */}
          <div className="flex items-center gap-2.5 bg-[#075e54] px-3 pb-2.5 pt-1 text-white">
            <ChevronLeft className="h-5 w-5 shrink-0 opacity-80" />
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-[11px] font-semibold">
              {clinica.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium leading-tight">{clinica}</p>
              <p className="truncate text-[10px] leading-tight text-white/70">{telefone}</p>
            </div>
            <Video className="h-4 w-4 shrink-0 opacity-70" />
            <Phone className="h-4 w-4 shrink-0 opacity-70" />
            <MoreVertical className="h-4 w-4 shrink-0 opacity-70" />
          </div>

          {/* Conversa — o papel de parede pontilhado é o do WhatsApp, bem discreto */}
          <div className="bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] [background-size:14px_14px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)]">
            <div className="flex max-h-[26rem] min-h-[8rem] flex-col gap-1.5 overflow-y-auto px-3 py-3">
              {bolhas.map((b, i) => (
                <BolhaChat key={b.id} bolha={b} colada={ehUltimaDoBot(bolhas, i) && temMenu} />
              ))}

              {/* As opções são parte da última mensagem do bot — no WhatsApp elas vêm coladas
                  embaixo da bolha, com divisória fina, não soltas no rodapé da conversa. */}
              {temMenu && passo && (
                <div className="-mt-1.5 flex justify-start">
                  <div className="w-[85%] overflow-hidden rounded-b-lg bg-white shadow-sm dark:bg-[#202c33]">
                    {passo.tipo === 'botoes' ? (
                      passo.opcoes.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => onEscolher(o)}
                          className="block w-full border-t border-slate-200/70 px-4 py-2 text-center text-[13px] font-medium text-[#0b7a5a] transition-colors hover:bg-[#25d366]/10 dark:border-white/10 dark:text-[#7ee2b8] dark:hover:bg-white/5"
                        >
                          {o.rotulo}
                        </button>
                      ))
                    ) : (
                      <>
                        <button
                          onClick={() => setAbertaEm(listaAberta ? null : (passo.id ?? null))}
                          className="flex w-full items-center justify-center gap-2 border-t border-slate-200/70 px-4 py-2 text-[13px] font-medium text-[#0b7a5a] transition-colors hover:bg-[#25d366]/10 dark:border-white/10 dark:text-[#7ee2b8] dark:hover:bg-white/5"
                        >
                          <List className="h-4 w-4" /> {passo.titulo ?? 'Ver opções'}
                        </button>
                        {listaAberta && (
                          <ul className="max-h-56 overflow-y-auto border-t border-slate-200/70 dark:border-white/10">
                            {passo.opcoes.map((o) => (
                              <li key={o.id} className="border-b border-slate-100 last:border-0 dark:border-white/5">
                                <button
                                  onClick={() => onEscolher(o)}
                                  className="w-full px-3 py-2 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                                >
                                  <p className="text-[13px] text-slate-800 dark:text-slate-100">{o.rotulo}</p>
                                  {o.descricao && (
                                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                      {o.descricao}
                                    </p>
                                  )}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              <div ref={fimRef} />
            </div>
          </div>

          {/* Barra de digitar — inerte de propósito: quem responde aqui são os botões */}
          <div className="flex items-center gap-2 bg-[#f0f0f0] px-2.5 py-2 dark:bg-[#1f2c34]">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-3 py-1.5 dark:bg-[#2a3942]">
              <Smile className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="min-w-0 flex-1 truncate text-[13px] text-slate-400">Mensagem</span>
              <Paperclip className="h-4 w-4 shrink-0 text-slate-400" />
              <Camera className="h-4 w-4 shrink-0 text-slate-400" />
            </div>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25d366]">
              <Mic className="h-4 w-4 text-white" />
            </span>
          </div>

          {/* Home indicator */}
          <div className="flex justify-center bg-[#f0f0f0] pb-1.5 dark:bg-[#1f2c34]">
            <span className="h-1 w-28 rounded-full bg-slate-400/70 dark:bg-white/30" />
          </div>
        </div>
      </div>

      {/* Anotação do Design OS — fica FORA do aparelho, porque não é parte do produto */}
      {passo?.limite && (
        <p className="mt-2 text-center text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
          limite do WhatsApp · {passo.limite}
        </p>
      )}
    </div>
  )
}

/** A última bolha do bot é a que recebe o menu colado embaixo. */
function ehUltimaDoBot(bolhas: Bolha[], indice: number): boolean {
  return bolhas[indice].autor === 'bot' && indice === bolhas.length - 1
}

function BolhaChat({ bolha, colada = false }: { bolha: Bolha; colada?: boolean }) {
  const doBot = bolha.autor === 'bot'
  return (
    <div className={`flex ${doBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-2 py-1.5 text-[13px] leading-snug shadow-sm ${
          doBot
            ? 'rounded-tl-none bg-white text-slate-800 dark:bg-[#202c33] dark:text-slate-100'
            : 'rounded-tr-none bg-[#d9fdd3] text-slate-800 dark:bg-[#005c4b] dark:text-slate-50'
        } ${colada ? 'w-[85%] rounded-b-none' : ''}`}
      >
        <span className="px-0.5">
          {fragmentosNegrito(bolha.texto).map((frag, i) =>
            i % 2 === 1 ? (
              <strong key={i} className="font-semibold">
                {frag}
              </strong>
            ) : (
              <span key={i}>{frag}</span>
            ),
          )}
        </span>
        {/* O ✓✓ é só do que o paciente envia; o que chega do bot não tem marca de entrega. */}
        <span className="float-right ml-2 mt-1 flex items-center gap-0.5 text-[10px] leading-none text-slate-400 dark:text-slate-400">
          {bolha.hora}
          {!doBot && <CheckCheck className="h-3 w-3 text-sky-500 dark:text-sky-400" />}
        </span>
      </div>
    </div>
  )
}
