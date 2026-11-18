import { useState } from 'react'
import { Dumbbell, Play, Plus } from 'lucide-react'
import type { PersonalExerciciosProps } from '@/../product-mobile/sections/personal-exercicios/types'
import { Chip, ListGroup, Row, Screen, SearchBar } from '../../_personal/components/kit'

export function PersonalExercicios({ data, onSelecionar, onNovo }: PersonalExerciciosProps) {
  const [grupo, setGrupo] = useState('Todos')
  const lista = grupo === 'Todos' ? data.exercicios : data.exercicios.filter((e) => e.grupo === grupo)

  return (
    <Screen>
      <SearchBar placeholder={`Buscar em ${data.total} exercícios`} />
      <div className="mx-4 mt-3 flex gap-1.5 overflow-x-auto no-scrollbar">
        {data.grupos.map((g) => (
          <button
            key={g}
            onClick={() => setGrupo(g)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-medium border ${
              grupo === g ? 'bg-emerald-500 text-[#0E1A17] border-emerald-500' : 'bg-[#0A0E0D] text-slate-300 border-[#2A3130]'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <ListGroup>
          {lista.map((e) => (
            <Row
              key={e.id}
              onClick={() => onSelecionar?.(e.id)}
              leading={
                <div className="w-12 h-12 rounded-xl bg-[#1B2120] flex items-center justify-center shrink-0">
                  {e.temVideo ? <Play size={16} className="text-emerald-400" /> : <Dumbbell size={16} className="text-slate-500" />}
                </div>
              }
              titulo={e.nome}
              subtitulo={`${e.grupo} · ${e.equipamento}`}
              trailing={e.personalizado ? <Chip tone="info">Meu</Chip> : undefined}
            />
          ))}
        </ListGroup>
      </div>

      <div className="mx-4 mt-4">
        <button
          onClick={onNovo}
          className="w-full rounded-2xl border border-dashed border-emerald-500/40 py-3 text-emerald-300 text-[14px] font-medium inline-flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Criar exercício
        </button>
      </div>
    </Screen>
  )
}
