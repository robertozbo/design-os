import { Plus } from 'lucide-react'
import type { PersonalAvaliacoesProps } from '@/../product-mobile/sections/personal-avaliacoes/types'
import { Avatar, Card, CardHeader, Chip, PrimaryButton, Screen } from '../../_personal/components/kit'

export function PersonalAvaliacoes({ data, onNova, onAbrir }: PersonalAvaliacoesProps) {
  return (
    <Screen>
      <div className="mx-4 mt-1">
        <PrimaryButton onClick={() => onNova?.()}>
          <Plus size={16} /> Nova avaliação
        </PrimaryButton>
      </div>

      <Card>
        <CardHeader titulo={`Reavaliar · ${data.reavaliacoes.length}`} />
        <ul className="divide-y divide-[#2A3130]">
          {data.reavaliacoes.map((r) => (
            <li key={r.alunoId} className="flex items-center gap-3 py-2.5">
              <Avatar inicial={r.inicial} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-slate-100 text-[14px] truncate">{r.aluno}</div>
                <div className={`text-[12px] ${r.atrasada ? 'text-rose-400' : 'text-amber-400'}`}>
                  {r.prazo} · última {r.ultima}
                </div>
              </div>
              <button
                onClick={() => onNova?.(r.alunoId)}
                className="rounded-xl border border-emerald-500/40 text-emerald-300 text-[12.5px] font-medium px-3 py-1.5"
              >
                Avaliar
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader titulo="Recentes" />
        <ul className="space-y-3">
          {data.recentes.map((a) => (
            <li key={a.id}>
              <button onClick={() => onAbrir?.(a.id)} className="w-full flex items-start gap-3 text-left">
                <Avatar inicial={a.inicial} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-100 text-[14px] truncate">{a.aluno}</span>
                    <span className="text-slate-500 text-[11.5px] font-mono">{a.data}</span>
                  </div>
                  <div className="text-slate-400 text-[12px]">{a.tipo}</div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {a.destaques.map((d) => (
                      <Chip key={d}>{d}</Chip>
                    ))}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </Screen>
  )
}
