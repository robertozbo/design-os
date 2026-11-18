import { useState } from 'react'
import { ChevronRight, Dumbbell, Paperclip, Send } from 'lucide-react'
import type { PersonalConversaProps } from '@/../product-mobile/sections/personal-conversa/types'
import { Avatar } from '../../_personal/components/kit'

export function PersonalConversa({ data, onAbrirFicha, onEnviar, onAnexar }: PersonalConversaProps) {
  const [texto, setTexto] = useState('')

  return (
    <div className="min-h-full bg-[#0A0E0D] flex flex-col">
      <button onClick={onAbrirFicha} className="mx-4 mt-1 rounded-2xl bg-[#111615] border border-[#2A3130] px-3 py-2.5 flex items-center gap-3 text-left">
        <Avatar inicial={data.aluno.inicial} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="text-slate-100 text-[14px] font-medium">{data.aluno.nome}</div>
          <div className="text-slate-400 text-[11.5px] truncate">{data.aluno.status}</div>
        </div>
        <span className="text-emerald-300 text-[12px]">Ver ficha</span>
        <ChevronRight size={14} className="text-emerald-300/70" />
      </button>

      <div className="px-4 mt-3 flex-1 space-y-2">
        <div className="text-center text-slate-500 text-[11px] font-mono uppercase tracking-wide">{data.dia}</div>
        {data.mensagens.map((m) => {
          const meu = m.autor === 'personal'
          return (
            <div key={m.id} className={`flex ${meu ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-3 py-2 ${
                  meu ? 'bg-emerald-500 text-[#0E1A17] rounded-br-md' : 'bg-[#1B2120] text-slate-100 rounded-bl-md'
                }`}
              >
                {m.texto && <div className="text-[13.5px] leading-snug">{m.texto}</div>}
                {m.anexo && (
                  <div className={`mt-2 rounded-xl px-2.5 py-2 flex items-center gap-2 ${meu ? 'bg-[#0E1A17]/15' : 'bg-[#0A0E0D]'}`}>
                    <Dumbbell size={15} />
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-semibold">{m.anexo.titulo}</div>
                      <div className="text-[11px] opacity-80 truncate">{m.anexo.detalhe}</div>
                    </div>
                  </div>
                )}
                <div className={`text-[10px] font-mono mt-1 text-right ${meu ? 'text-[#0E1A17]/70' : 'text-slate-500'}`}>{m.hora}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="sticky bottom-0 bg-[#0A0E0D] pt-2 pb-3">
        <div className="px-4 flex gap-1.5 overflow-x-auto no-scrollbar">
          {data.respostasRapidas.map((r) => (
            <button key={r} onClick={() => setTexto(r)} className="shrink-0 rounded-full border border-[#2A3130] px-3 py-1 text-slate-300 text-[12px]">
              {r}
            </button>
          ))}
        </div>
        <div className="mx-4 mt-2 flex items-center gap-2">
          <button onClick={onAnexar} aria-label="Anexar" className="w-10 h-10 rounded-full bg-[#1B2120] text-slate-300 flex items-center justify-center">
            <Paperclip size={17} />
          </button>
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Mensagem"
            className="flex-1 rounded-full bg-[#111615] border border-[#2A3130] px-4 py-2.5 text-slate-100 text-[14px] outline-none focus:border-emerald-500 placeholder:text-slate-500"
          />
          <button
            onClick={() => {
              onEnviar?.(texto)
              setTexto('')
            }}
            aria-label="Enviar"
            className="w-10 h-10 rounded-full bg-emerald-500 text-[#0E1A17] flex items-center justify-center"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
