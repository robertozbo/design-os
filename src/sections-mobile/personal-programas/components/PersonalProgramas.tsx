import { Plus } from 'lucide-react'
import type { Fase, PersonalProgramasProps } from '@/../product-mobile/sections/personal-programas/types'
import { Avatar, Card, Progress, Screen } from '../../_personal/components/kit'

const FASE: Record<Fase['status'], { dot: string; texto: string }> = {
  concluida: { dot: 'bg-emerald-500', texto: 'text-slate-500' },
  atual: { dot: 'bg-emerald-400 ring-4 ring-emerald-500/20', texto: 'text-slate-100' },
  proxima: { dot: 'bg-[#2A3130]', texto: 'text-slate-400' },
}

export function PersonalProgramas({ data, onAbrir, onNovo }: PersonalProgramasProps) {
  return (
    <Screen>
      {data.programas.map((p) => (
        <Card key={p.id}>
          <button onClick={() => onAbrir?.(p.id)} className="w-full text-left">
            <div className="flex items-center gap-3">
              <Avatar inicial={p.inicial} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="text-slate-100 text-[15px] font-medium truncate">{p.nome}</div>
                <div className="text-slate-400 text-[12px]">
                  {p.aluno} · <span className="font-mono">{p.inicio} → {p.fim}</span>
                </div>
              </div>
              <span className="text-slate-300 text-[12px] font-mono">{p.progresso}%</span>
            </div>
            <div className="mt-3">
              <Progress value={p.progresso} />
            </div>
            <ol className="mt-4 space-y-3">
              {p.fases.map((f) => (
                <li key={f.nome} className="flex items-start gap-3">
                  <span className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${FASE[f.status].dot}`} />
                  <div className={`flex-1 ${FASE[f.status].texto}`}>
                    <div className="text-[13.5px] font-medium">
                      {f.nome} <span className="text-[11.5px] font-mono opacity-70">sem {f.semanas}</span>
                    </div>
                    <div className="text-[12px] opacity-80">{f.foco}</div>
                  </div>
                </li>
              ))}
            </ol>
          </button>
        </Card>
      ))}
      <div className="mx-4 mt-4">
        <button
          onClick={onNovo}
          className="w-full rounded-2xl border border-dashed border-emerald-500/40 py-3 text-emerald-300 text-[14px] font-medium inline-flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Novo programa
        </button>
      </div>
    </Screen>
  )
}
