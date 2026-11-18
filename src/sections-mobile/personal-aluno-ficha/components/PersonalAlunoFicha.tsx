import { useState } from 'react'
import { AlertTriangle, ClipboardList, Dumbbell, MessageSquare, Pencil, Plus } from 'lucide-react'
import type { PersonalAlunoFichaProps } from '@/../product-mobile/sections/personal-aluno-ficha/types'
import { Avatar, Card, CardHeader, Chip, Progress, Screen, Segmented, Stat } from '../../_personal/components/kit'

type Aba = 'resumo' | 'treino' | 'avaliacoes' | 'anamnese'

export function PersonalAlunoFicha({ data, onMensagem, onNovaAvaliacao, onEditarTreino, onAbrirAvaliacao }: PersonalAlunoFichaProps) {
  const [aba, setAba] = useState<Aba>('resumo')
  const [treinoAtivo, setTreinoAtivo] = useState(data.treinos[0]?.id)
  const a = data.aluno

  return (
    <Screen>
      <div className="px-4 pt-1 flex items-center gap-3">
        <Avatar inicial={a.inicial} size="xl" />
        <div className="min-w-0">
          <div className="text-white text-[19px] font-semibold leading-tight">{a.nome}</div>
          <div className="text-slate-400 text-[12.5px]">
            {a.idade} anos · aluna desde {a.desde}
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            <Chip tone="primary">{a.objetivo}</Chip>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-4 grid grid-cols-3 gap-2">
        {[
          { label: 'Mensagem', Icon: MessageSquare, on: onMensagem },
          { label: 'Avaliação', Icon: ClipboardList, on: onNovaAvaliacao },
          { label: 'Editar treino', Icon: Pencil, on: onEditarTreino },
        ].map(({ label, Icon, on }) => (
          <button key={label} onClick={on} className="rounded-2xl bg-[#111615] border border-[#2A3130] py-2.5 flex flex-col items-center gap-1 text-slate-200 text-[12px]">
            <Icon size={17} className="text-emerald-400" />
            {label}
          </button>
        ))}
      </div>

      {data.alerta && (
        <div className="mx-4 mt-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-3 flex items-start gap-2.5">
          <AlertTriangle size={16} className="text-rose-400 mt-0.5 shrink-0" />
          <span className="text-rose-200 text-[13px] leading-snug">{data.alerta}</span>
        </div>
      )}

      <Segmented<Aba>
        ativo={aba}
        onChange={setAba}
        opcoes={[
          { id: 'resumo', label: 'Resumo' },
          { id: 'treino', label: 'Treino' },
          { id: 'avaliacoes', label: 'Avaliações', count: data.avaliacoes.length },
          { id: 'anamnese', label: 'Anamnese' },
        ]}
      />

      {aba === 'resumo' && (
        <>
          <div className="mx-4 mt-4 grid grid-cols-3 gap-2">
            {data.metricas.map((m) => (
              <Stat key={m.label} {...m} />
            ))}
          </div>
          <Card>
            <CardHeader titulo="Programa atual" />
            <div className="text-slate-100 text-[15px] font-medium">{data.programa.nome}</div>
            <div className="text-slate-400 text-[12px] mb-2">
              {data.programa.semana} · revisão em {data.programa.proximaRevisao}
            </div>
            <Progress value={data.programa.progresso} />
          </Card>
          <Card>
            <CardHeader titulo="Últimos treinos" />
            <ul className="space-y-2.5">
              {data.execucoes.map((e) => (
                <li key={e.data} className="flex items-start gap-3">
                  <span className="w-[70px] text-slate-400 text-[12px] font-mono pt-0.5">{e.data}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[13.5px] ${e.pulou ? 'text-rose-400' : 'text-slate-100'}`}>
                      {e.treino} · {e.pulou ? 'não treinou' : `${e.concluido} exercícios`}
                    </div>
                    {e.nota && <div className="text-amber-400 text-[12px]">{e.nota}</div>}
                  </div>
                  {e.rpe !== null && <Chip>RPE {e.rpe}</Chip>}
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}

      {aba === 'treino' && (
        <>
          <div className="mx-4 mt-4 flex gap-2">
            {data.treinos.map((t) => (
              <button
                key={t.id}
                onClick={() => setTreinoAtivo(t.id)}
                className={`flex-1 rounded-2xl border px-3 py-2 text-left ${
                  treinoAtivo === t.id ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-[#2A3130] bg-[#0A0E0D]'
                }`}
              >
                <div className="text-slate-100 text-[14px] font-medium">{t.nome}</div>
                <div className="text-slate-400 text-[11.5px]">{t.foco}</div>
              </button>
            ))}
          </div>
          <Card>
            <ul className="divide-y divide-[#2A3130]">
              {data.treinos
                .find((t) => t.id === treinoAtivo)
                ?.exercicios.map((ex, i) => (
                  <li key={ex.nome} className="flex items-center gap-3 py-2.5">
                    <span className="w-6 h-6 rounded-lg bg-[#1B2120] text-slate-300 text-[11px] font-mono flex items-center justify-center">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-100 text-[14px] truncate">{ex.nome}</div>
                      <div className="text-slate-400 text-[12px] font-mono">
                        {ex.series} · {ex.carga}
                      </div>
                    </div>
                    <Dumbbell size={15} className="text-slate-600" />
                  </li>
                ))}
            </ul>
          </Card>
        </>
      )}

      {aba === 'avaliacoes' && (
        <>
          {data.avaliacoes.map((av) => (
            <Card key={av.id}>
              <button onClick={() => onAbrirAvaliacao?.(av.id)} className="w-full text-left">
                <div className="flex items-center justify-between">
                  <span className="text-slate-100 text-[14.5px] font-medium">{av.tipo}</span>
                  <span className="text-slate-500 text-[12px] font-mono">{av.data}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {av.destaques.map((d) => (
                    <Chip key={d}>{d}</Chip>
                  ))}
                </div>
              </button>
            </Card>
          ))}
          <div className="mx-4 mt-4">
            <button
              onClick={onNovaAvaliacao}
              className="w-full rounded-2xl border border-dashed border-emerald-500/40 py-3 text-emerald-300 text-[14px] font-medium inline-flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Nova avaliação
            </button>
          </div>
        </>
      )}

      {aba === 'anamnese' && (
        <Card>
          <ul className="divide-y divide-[#2A3130]">
            {data.anamnese.map((q) => (
              <li key={q.pergunta} className="py-2.5">
                <div className="text-slate-500 text-[11.5px] uppercase tracking-wide font-mono">{q.pergunta}</div>
                <div className={`text-[14px] mt-0.5 ${q.atencao ? 'text-amber-400' : 'text-slate-100'}`}>{q.resposta}</div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Screen>
  )
}
