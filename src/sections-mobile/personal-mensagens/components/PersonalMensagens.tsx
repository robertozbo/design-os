import { Dumbbell, PenSquare, Video } from 'lucide-react'
import type { PersonalMensagensProps } from '@/../product-mobile/sections/personal-mensagens/types'
import { Avatar, ListGroup, Screen, SearchBar } from '../../_personal/components/kit'

export function PersonalMensagens({ data, onAbrir, onNova }: PersonalMensagensProps) {
  const conversas = [...data.conversas].sort((a, b) => Number(b.naoLidas > 0) - Number(a.naoLidas > 0))

  return (
    <Screen>
      <div className="flex items-center gap-2 pr-4">
        <div className="flex-1">
          <SearchBar placeholder="Buscar conversa" />
        </div>
        <button onClick={onNova} aria-label="Nova mensagem" className="mt-1 w-10 h-10 rounded-full bg-emerald-500 text-[#0E1A17] flex items-center justify-center">
          <PenSquare size={17} />
        </button>
      </div>
      <div className="mt-4">
        <ListGroup>
          {conversas.map((c) => (
            <li key={c.id}>
              <button onClick={() => onAbrir?.(c.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-[#111615]">
                <Avatar inicial={c.inicial} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[14.5px] truncate ${c.naoLidas ? 'text-white font-semibold' : 'text-slate-100'}`}>{c.aluno}</span>
                    <span className={`text-[11.5px] font-mono shrink-0 ${c.naoLidas ? 'text-emerald-400' : 'text-slate-500'}`}>{c.hora}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`flex-1 text-[12.5px] truncate flex items-center gap-1 ${c.naoLidas ? 'text-slate-200' : 'text-slate-400'}`}>
                      {c.anexo === 'video' && <Video size={13} className="shrink-0" />}
                      {c.anexo === 'treino' && <Dumbbell size={13} className="shrink-0" />}
                      {c.ultima}
                    </span>
                    {c.naoLidas > 0 && (
                      <span className="min-w-5 h-5 px-1.5 rounded-full bg-emerald-500 text-[#0E1A17] text-[11px] font-semibold flex items-center justify-center">
                        {c.naoLidas}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ListGroup>
      </div>
    </Screen>
  )
}
