import { useState } from 'react'
import { AlertTriangle, UserPlus } from 'lucide-react'
import type { PersonalAlunosProps, StatusAluno } from '@/../product-mobile/sections/personal-alunos/types'
import { Avatar, Chip, Progress, Screen, SearchBar, Segmented } from '../../_personal/components/kit'

type Filtro = 'todos' | 'risco' | 'ativo' | 'pausado' | 'convidado'

const STATUS_CHIP: Record<StatusAluno, { label: string; tone: 'primary' | 'warning' | 'neutral' | 'info' }> = {
  ativo: { label: 'Ativo', tone: 'primary' },
  risco: { label: 'Atenção', tone: 'warning' },
  pausado: { label: 'Pausado', tone: 'neutral' },
  convidado: { label: 'Convite enviado', tone: 'info' },
}

export function PersonalAlunos({ data, onAbrirAluno, onConvidar }: PersonalAlunosProps) {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const conta = (s: StatusAluno) => data.alunos.filter((a) => a.status === s).length
  const lista = filtro === 'todos' ? data.alunos : data.alunos.filter((a) => a.status === filtro)

  return (
    <Screen>
      <SearchBar placeholder={`Buscar entre ${data.total} alunos`} />
      <Segmented<Filtro>
        ativo={filtro}
        onChange={setFiltro}
        opcoes={[
          { id: 'todos', label: 'Todos', count: data.alunos.length },
          { id: 'risco', label: 'Atenção', count: conta('risco') },
          { id: 'ativo', label: 'Ativos', count: conta('ativo') },
          { id: 'pausado', label: 'Pausados', count: conta('pausado') },
          { id: 'convidado', label: 'Convidados', count: conta('convidado') },
        ]}
      />

      <ul className="mx-4 mt-4 space-y-2">
        {lista.map((a) => {
          const tone = a.adesao >= 75 ? 'primary' : a.adesao >= 50 ? 'warning' : 'danger'
          return (
            <li key={a.id}>
              <button
                onClick={() => onAbrirAluno?.(a.id)}
                className="w-full rounded-2xl bg-[#0A0E0D] border border-[#2A3130] p-3.5 text-left active:bg-[#111615]"
              >
                <div className="flex items-center gap-3">
                  <Avatar inicial={a.inicial} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-100 text-[14.5px] font-medium truncate">{a.nome}</span>
                      <Chip tone={STATUS_CHIP[a.status].tone}>{STATUS_CHIP[a.status].label}</Chip>
                    </div>
                    <div className="text-slate-400 text-[12px] truncate">
                      {a.objetivo} · {a.treinoAtual ?? 'sem treino ativo'}
                    </div>
                  </div>
                </div>
                {a.status !== 'convidado' && a.status !== 'pausado' && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1">
                      <Progress value={a.adesao} tone={tone} />
                    </div>
                    <span className="text-[11.5px] font-mono tabular-nums text-slate-300 whitespace-nowrap text-right">
                      {a.adesao}% · {a.ultimoTreino}
                    </span>
                  </div>
                )}
                {a.alerta && (
                  <div className="mt-2 flex items-center gap-1.5 text-amber-400 text-[12px]">
                    <AlertTriangle size={13} /> {a.alerta}
                  </div>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="mx-4 mt-4">
        <button
          onClick={onConvidar}
          className="w-full rounded-2xl border border-dashed border-emerald-500/40 py-3 text-emerald-300 text-[14px] font-medium inline-flex items-center justify-center gap-2"
        >
          <UserPlus size={16} /> Convidar aluno
        </button>
      </div>
    </Screen>
  )
}
