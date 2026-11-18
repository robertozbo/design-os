import { useState } from 'react'
import { Camera, Dumbbell, HeartPulse, Move, Ruler, Scale, Hand, type LucideIcon } from 'lucide-react'
import type { PersonalAvaliacaoNovaProps, TipoAvaliacao } from '@/../product-mobile/sections/personal-avaliacao-nova/types'
import { Avatar, Card, CardHeader, PrimaryButton, Screen } from '../../_personal/components/kit'

const ICONES: Record<string, LucideIcon> = { Ruler, Pinch: Hand, Scale, Dumbbell, Move, HeartPulse }

export function PersonalAvaliacaoNova({ data, onTrocarAluno, onFoto, onSalvar }: PersonalAvaliacaoNovaProps) {
  const [tipo, setTipo] = useState<TipoAvaliacao>(data.tipoSelecionado)

  return (
    <Screen>
      <button onClick={onTrocarAluno} className="mx-4 mt-1 w-[calc(100%-2rem)] rounded-2xl bg-[#0A0E0D] border border-[#2A3130] p-3 flex items-center gap-3 text-left">
        <Avatar inicial={data.aluno.inicial} />
        <div className="flex-1">
          <div className="text-slate-100 text-[14.5px] font-medium">{data.aluno.nome}</div>
          <div className="text-slate-400 text-[12px]">Última avaliação {data.aluno.ultima}</div>
        </div>
        <span className="text-emerald-300 text-[12.5px] font-medium">Trocar</span>
      </button>

      <div className="mx-4 mt-3 grid grid-cols-3 gap-2">
        {data.tipos.map((t) => {
          const Icon = ICONES[t.icone] ?? Ruler
          const on = t.id === tipo
          return (
            <button
              key={t.id}
              onClick={() => setTipo(t.id)}
              className={`rounded-2xl border py-3 flex flex-col items-center gap-1.5 text-[12px] ${
                on ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200' : 'border-[#2A3130] bg-[#0A0E0D] text-slate-300'
              }`}
            >
              <Icon size={18} className={on ? 'text-emerald-400' : 'text-slate-400'} />
              {t.label}
            </button>
          )
        })}
      </div>

      <Card>
        <CardHeader titulo="Medidas" />
        <ul className="space-y-2.5">
          {data.campos.map((c) => (
            <li key={c.id} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-slate-200 text-[13.5px]">{c.label}</div>
                {c.anterior && (
                  <div className="text-slate-500 text-[11.5px] font-mono">
                    anterior {c.anterior} {c.unidade}
                  </div>
                )}
              </div>
              <div className="w-28 flex items-center rounded-xl bg-[#111615] border border-[#2A3130] px-3 py-2 focus-within:border-emerald-500">
                <input
                  defaultValue={c.valor}
                  inputMode="decimal"
                  placeholder="—"
                  className="w-full bg-transparent text-right text-slate-100 text-[15px] font-mono outline-none placeholder:text-slate-600"
                />
                <span className="ml-1.5 text-slate-500 text-[12px]">{c.unidade}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader titulo="Fotos (opcional)" />
        <div className="grid grid-cols-3 gap-2">
          {['Frente', 'Lado', 'Costas'].map((f) => (
            <button key={f} onClick={onFoto} className="aspect-[3/4] rounded-2xl border border-dashed border-[#2A3130] flex flex-col items-center justify-center gap-1 text-slate-500 text-[12px]">
              <Camera size={18} />
              {f}
            </button>
          ))}
        </div>
      </Card>

      <div className="mx-4 mt-5">
        <PrimaryButton onClick={onSalvar}>Salvar avaliação</PrimaryButton>
      </div>
    </Screen>
  )
}
