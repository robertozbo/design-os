import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { PersonalConfiguracoesProps } from '@/../product-mobile/sections/personal-configuracoes/types'
import { ListGroup, Screen, SectionLabel, Toggle } from '../../_personal/components/kit'

export function PersonalConfiguracoes({ data, onItem }: PersonalConfiguracoesProps) {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(data.grupos.flatMap((g) => g.itens.filter((i) => i.tipo === 'toggle').map((i) => [i.id, !!i.ligado]))),
  )

  return (
    <Screen>
      {data.grupos.map((g) => (
        <div key={g.id}>
          <SectionLabel>{g.label}</SectionLabel>
          <ListGroup>
            {g.itens.map((i) => (
              <li key={i.id}>
                <button
                  onClick={() => (i.tipo === 'toggle' ? setToggles((t) => ({ ...t, [i.id]: !t[i.id] })) : onItem?.(i.id))}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-100 text-[14px]">{i.label}</div>
                    {i.descricao && <div className="text-slate-500 text-[12px]">{i.descricao}</div>}
                  </div>
                  {i.tipo === 'toggle' ? (
                    <Toggle on={toggles[i.id]} />
                  ) : (
                    <>
                      {i.valor && <span className="text-slate-400 text-[13px]">{i.valor}</span>}
                      <ChevronRight size={16} className="text-slate-600" />
                    </>
                  )}
                </button>
              </li>
            ))}
          </ListGroup>
        </div>
      ))}
      <div className="mt-6 text-center text-slate-600 text-[11.5px] font-mono">{data.versao}</div>
    </Screen>
  )
}
