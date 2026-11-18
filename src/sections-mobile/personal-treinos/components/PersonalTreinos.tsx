import { useState } from 'react'
import { BookOpen, Layers, Plus, Users } from 'lucide-react'
import type { PersonalTreinosProps } from '@/../product-mobile/sections/personal-treinos/types'
import { Avatar, Chip, IconTile, ListGroup, Row, Screen, Segmented } from '../../_personal/components/kit'

type Aba = 'templates' | 'alunos'

export function PersonalTreinos({ data, onAbrirTemplate, onAbrirTreinoAluno, onNovoTemplate, onBiblioteca, onProgramas }: PersonalTreinosProps) {
  const [aba, setAba] = useState<Aba>('templates')
  const porAluno = [...data.porAluno].sort((a, b) => Number(!!b.vencido) - Number(!!a.vencido))

  return (
    <Screen>
      <div className="mx-4 mt-1 grid grid-cols-2 gap-2">
        <button onClick={onBiblioteca} className="rounded-2xl bg-[#0A0E0D] border border-[#2A3130] p-3 flex items-center gap-2.5 text-left">
          <IconTile Icon={BookOpen} />
          <div>
            <div className="text-slate-100 text-[13.5px] font-medium">Exercícios</div>
            <div className="text-slate-500 text-[11.5px] font-mono">{data.bibliotecaTotal} na biblioteca</div>
          </div>
        </button>
        <button onClick={onProgramas} className="rounded-2xl bg-[#0A0E0D] border border-[#2A3130] p-3 flex items-center gap-2.5 text-left">
          <IconTile Icon={Layers} tone="info" />
          <div>
            <div className="text-slate-100 text-[13.5px] font-medium">Programas</div>
            <div className="text-slate-500 text-[11.5px]">Periodização</div>
          </div>
        </button>
      </div>

      <div className="flex items-center pr-4">
        <div className="flex-1">
          <Segmented<Aba>
            ativo={aba}
            onChange={setAba}
            opcoes={[
              { id: 'templates', label: 'Templates', count: data.templates.length },
              { id: 'alunos', label: 'Por aluno', count: data.porAluno.length },
            ]}
          />
        </div>
        <button
          onClick={onNovoTemplate}
          aria-label="Novo template"
          className="mt-3 w-9 h-9 rounded-full bg-emerald-500 text-[#0E1A17] flex items-center justify-center"
        >
          <Plus size={18} strokeWidth={2.4} />
        </button>
      </div>

      {aba === 'templates' ? (
        <ul className="mx-4 mt-4 space-y-2">
          {data.templates.map((t) => (
            <li key={t.id}>
              <button onClick={() => onAbrirTemplate?.(t.id)} className="w-full rounded-2xl bg-[#0A0E0D] border border-[#2A3130] p-3.5 text-left active:bg-[#111615]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-100 text-[15px] font-medium">{t.nome}</span>
                  <span className="text-slate-500 text-[11.5px]">{t.atualizado}</span>
                </div>
                <div className="text-slate-400 text-[12.5px]">{t.objetivo}</div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <Chip>{t.divisao}</Chip>
                  <Chip>{t.nivel}</Chip>
                  <Chip>{t.semanas} semanas</Chip>
                  <Chip tone="primary">
                    <Users size={11} /> {t.alunosUsando}
                  </Chip>
                </div>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4">
          <ListGroup>
            {porAluno.map((p) => (
              <Row
                key={p.id}
                onClick={() => onAbrirTreinoAluno?.(p.id)}
                leading={<Avatar inicial={p.inicial} size="sm" />}
                titulo={p.aluno}
                subtitulo={`${p.treino} · semana ${p.semana}`}
                trailing={<Chip tone={p.vencido ? 'danger' : 'neutral'}>{p.revisao}</Chip>}
              />
            ))}
          </ListGroup>
        </div>
      )}
    </Screen>
  )
}
