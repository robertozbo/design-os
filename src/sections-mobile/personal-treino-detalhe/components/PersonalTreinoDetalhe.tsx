import { useState } from 'react'
import { Check, GripVertical, Plus, Send } from 'lucide-react'
import type { PersonalTreinoDetalheProps } from '@/../product-mobile/sections/personal-treino-detalhe/types'
import { Avatar, Chip, PrimaryButton, Screen } from '../../_personal/components/kit'

export function PersonalTreinoDetalhe({ data, onAdicionarExercicio, onEditarExercicio, onAplicar }: PersonalTreinoDetalheProps) {
  const [diaId, setDiaId] = useState(data.dias[0]?.id)
  const [sheet, setSheet] = useState(false)
  const [selecionados, setSelecionados] = useState<string[]>([])
  const dia = data.dias.find((d) => d.id === diaId)
  const t = data.template

  const alternar = (id: string) =>
    setSelecionados((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  return (
    <Screen>
      <div className="px-4 pt-1">
        <div className="text-white text-[20px] font-semibold">{t.nome}</div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <Chip tone="primary">{t.objetivo}</Chip>
          <Chip>{t.divisao}</Chip>
          <Chip>{t.nivel}</Chip>
          <Chip>{t.semanas} semanas</Chip>
        </div>
      </div>

      <div className="mx-4 mt-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${data.dias.length}, minmax(0, 1fr))` }}>
        {data.dias.map((d) => (
          <button
            key={d.id}
            onClick={() => setDiaId(d.id)}
            className={`rounded-2xl border px-2.5 py-2 text-left ${
              diaId === d.id ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-[#2A3130] bg-[#0A0E0D]'
            }`}
          >
            <div className="text-slate-100 text-[14px] font-semibold">{d.nome}</div>
            <div className="text-slate-400 text-[11px] truncate">{d.exercicios.length} exercícios</div>
          </button>
        ))}
      </div>

      {dia && (
        <>
          <div className="px-5 mt-4 mb-2 text-slate-400 text-[12.5px]">{dia.foco}</div>
          <ul className="mx-4 space-y-2">
            {dia.exercicios.map((ex, i) => (
              <li key={ex.id}>
                <button
                  onClick={() => onEditarExercicio?.(ex.id)}
                  className="w-full rounded-2xl bg-[#0A0E0D] border border-[#2A3130] p-3 flex items-start gap-2.5 text-left"
                >
                  <GripVertical size={16} className="text-slate-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[12px] font-mono">{i + 1}</span>
                      <span className="text-slate-100 text-[14px] font-medium truncate">{ex.nome}</span>
                    </div>
                    <div className="mt-1.5 grid grid-cols-4 gap-1 text-center">
                      {[
                        ['Séries', String(ex.series)],
                        ['Reps', ex.reps],
                        ['Descanso', ex.descanso],
                        ['RPE', ex.rpe ?? '—'],
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-lg bg-[#111615] py-1">
                          <div className="text-slate-500 text-[9.5px] uppercase tracking-wide">{k}</div>
                          <div className="text-slate-100 text-[12.5px] font-mono">{v}</div>
                        </div>
                      ))}
                    </div>
                    {ex.obs && <div className="mt-1.5 text-amber-400 text-[12px]">{ex.obs}</div>}
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <div className="mx-4 mt-2">
            <button
              onClick={() => onAdicionarExercicio?.(dia.id)}
              className="w-full rounded-2xl border border-dashed border-[#2A3130] py-3 text-slate-300 text-[13.5px] inline-flex items-center justify-center gap-2"
            >
              <Plus size={15} /> Adicionar exercício
            </button>
          </div>
        </>
      )}

      <div className="mx-4 mt-5">
        <PrimaryButton onClick={() => setSheet(true)}>
          <Send size={16} /> Aplicar em aluno
        </PrimaryButton>
      </div>

      {sheet && (
        <div className="fixed inset-0 z-40 flex items-end bg-black/60" onClick={() => setSheet(false)}>
          <div className="w-full rounded-t-3xl bg-[#111615] border-t border-[#2A3130] px-4 pt-3 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto w-10 h-1 rounded-full bg-[#2A3130]" />
            <div className="mt-4 text-white font-semibold text-[17px]">Aplicar "{t.nome}"</div>
            <p className="text-slate-400 text-[12.5px] mt-0.5">
              Cada aluno recebe uma cópia. Mudanças no template depois não alteram o treino dele.
            </p>
            <ul className="mt-3 space-y-1.5">
              {data.alunosSugeridos.map((a) => {
                const on = selecionados.includes(a.id)
                return (
                  <li key={a.id}>
                    <button
                      onClick={() => alternar(a.id)}
                      className={`w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 ${on ? 'bg-emerald-500/10' : 'bg-[#0A0E0D]'} border ${on ? 'border-emerald-500/50' : 'border-[#2A3130]'}`}
                    >
                      <Avatar inicial={a.inicial} size="sm" />
                      <span className="flex-1 text-left text-slate-100 text-[14px]">{a.nome}</span>
                      <span className={`w-5 h-5 rounded-md border flex items-center justify-center ${on ? 'bg-emerald-500 border-emerald-500 text-[#0E1A17]' : 'border-slate-600'}`}>
                        {on && <Check size={13} strokeWidth={3} />}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <div className="mt-4">
              <PrimaryButton onClick={() => onAplicar?.(selecionados)}>
                {selecionados.length === 0
                  ? 'Selecione os alunos'
                  : `Aplicar em ${selecionados.length} ${selecionados.length === 1 ? 'aluno' : 'alunos'}`}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </Screen>
  )
}
