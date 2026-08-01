import { useState } from 'react'
import { CheckCircle2, ClipboardCheck, CloudUpload, FileImage } from 'lucide-react'
import type { ExameHistorico } from '@/../product-clinico/sections/pacientes/types'
import type { LaudoOriginal } from '@/../product-clinico/sections/exames/types'
import {
  AnalisarIADrawer,
  UploadImagemSection,
  type ExameUploadForm,
  type UploadFile,
} from '@/sections-clinico/exames/components/UploadImagemSection'
import { formatDataBR, ALERT_NIVEL_STYLE } from './helpers'
import { Sparkline } from './Sparkline'

interface Props {
  exames: ExameHistorico[]
  /** Nome do paciente em contexto — pré-preenche e trava o upload avulso. */
  pacienteNome: string
  onAbrirExame?: (id: string) => void
}

const NOVO_EXAME_ID = 'exm-imagem-novo'

export function ExamesTab({ exames, pacienteNome, onAbrirExame }: Props) {
  const [mode, setMode] = useState<'lista' | 'upload'>('lista')
  // Exame recém-cadastrado nesta sessão (protótipo — sem persistência real)
  const [novoExame, setNovoExame] = useState<{
    form: ExameUploadForm
    files: UploadFile[]
  } | null>(null)
  const [salvoAgora, setSalvoAgora] = useState(false)
  // Exame em análise — qualquer card pode abrir o drawer de IA
  const [exameAnalise, setExameAnalise] = useState<{
    id: string
    form: ExameUploadForm
    files: UploadFile[]
    laudo?: LaudoOriginal
  } | null>(null)

  const abrirAnaliseIA = (e: ExameHistorico & { novo?: boolean }) => {
    if (e.novo && novoExame) {
      setExameAnalise({ id: e.id, form: novoExame.form, files: novoExame.files })
      return
    }
    // Exame já recebido (laboratorial) — lateral mostra o laudo original
    setExameAnalise({
      id: e.id,
      form: {
        pacienteNome,
        tipo: e.tipo,
        modalidade: 'raio-x',
        dataColeta: e.dataColeta,
        laboratorio: e.laboratorio,
        observacao: '',
        queixas: [],
        queixaOutro: '',
      },
      files: [{ id: `laudo-${e.id}`, nome: 'laudo-original.pdf', tamanhoKb: 380, tipo: 'pdf' }],
      laudo: {
        paginas: 1,
        texto:
          `${e.tipo.toUpperCase()}\n\n` +
          `MÉTODO: Eletroquimioluminescência (Roche Cobas)\n\n` +
          `RESULTADOS:\n` +
          e.biomarkers
            .map((b) => `${b.nome}: ${b.valor} ${b.unidade} (Ref: ${b.faixaReferencia})`)
            .join('\n') +
          `\n\nMaterial: Soro · Coleta: ${formatDataBR(e.dataColeta)}`,
      },
    })
  }

  if (mode === 'upload') {
    return (
      <UploadImagemSection
        pacienteNome={pacienteNome}
        onVoltar={() => setMode('lista')}
        onSalvo={(form, files) => {
          // Cadastro termina aqui: fecha o form e mostra o exame na lista.
          setNovoExame({ form, files })
          setSalvoAgora(true)
          setMode('lista')
        }}
      />
    )
  }

  const todosExames: (ExameHistorico & { novo?: boolean })[] = novoExame
    ? [
        {
          id: NOVO_EXAME_ID,
          tipo: novoExame.form.tipo,
          laboratorio: novoExame.form.laboratorio,
          dataColeta: novoExame.form.dataColeta,
          biomarkers: [],
          novo: true,
        },
        ...exames,
      ]
    : exames

  // Agrupar por mês
  const grupos = new Map<string, (ExameHistorico & { novo?: boolean })[]>()
  for (const e of todosExames) {
    const d = new Date(e.dataColeta + 'T12:00:00')
    const chave = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    const arr = grupos.get(chave) || []
    arr.push(e)
    grupos.set(chave, arr)
  }

  const botaoCarregar = (
    <button
      onClick={() => {
        setSalvoAgora(false)
        setMode('upload')
      }}
      className="
        inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors
        hover:border-teal-500 hover:text-teal-700
        focus:outline-none focus:ring-2 focus:ring-teal-500/30
        dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-teal-500 dark:hover:text-teal-300
      "
    >
      <CloudUpload className="size-3.5" />
      Carregar exame
    </button>
  )

  if (todosExames.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm italic text-slate-500">Nenhum exame recebido ainda.</p>
        <div className="mt-4 flex justify-center">{botaoCarregar}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Confirmação pós-cadastro — o exame já está na lista abaixo */}
      {salvoAgora && novoExame && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200/70 bg-emerald-50/50 px-4 py-2.5 text-xs text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-100">
          <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>
            <strong>Exame salvo</strong> — já está na lista abaixo como "a revisar".
          </span>
        </div>
      )}

      <div className="flex justify-end">{botaoCarregar}</div>

      {Array.from(grupos.entries()).map(([mes, lista]) => (
        <section key={mes}>
          <h3 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {mes.replace(/^./, (c) => c.toUpperCase())}
          </h3>
          <div className="space-y-3">
            {lista.map((e) => (
              <article
                key={e.id}
                className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900 ${
                  e.novo
                    ? 'border-teal-300/80 dark:border-teal-800'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                        {e.tipo}
                      </h4>
                      {e.novo && (
                        <span className="rounded-full bg-rose-100 px-2 py-px text-[10px] font-bold uppercase tracking-wide text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                          Novo · a revisar
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {e.laboratorio} · {formatDataBR(e.dataColeta)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => abrirAnaliseIA(e)}
                      className={
                        e.novo
                          ? 'inline-flex items-center gap-1 rounded-md bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40'
                          : 'inline-flex items-center gap-1 rounded-md border border-teal-200 bg-teal-50/60 px-2.5 py-1 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100 dark:border-teal-900/60 dark:bg-teal-950/30 dark:text-teal-300 dark:hover:bg-teal-950/60'
                      }
                    >
                      <ClipboardCheck className="size-3" />
                      Analisar
                    </button>
                    <button
                      onClick={() => onAbrirExame?.(e.id)}
                      className="
                        rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600
                        transition-colors hover:bg-slate-50
                        dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800
                      "
                    >
                      Abrir laudo
                    </button>
                  </div>
                </div>

                {e.novo && novoExame ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {novoExame.files.map((f) => (
                      <li
                        key={f.id}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-200/60 bg-slate-50/40 px-2 py-1 text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300"
                      >
                        <FileImage className="size-3 text-slate-400" />
                        <span className="font-mono">{f.nome}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  e.biomarkers.length > 0 && (
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {e.biomarkers.map((b, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between gap-3 rounded-lg border border-slate-200/60 bg-slate-50/40 p-3 dark:border-slate-800 dark:bg-slate-950/40"
                        >
                          <div>
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                              {b.nome}
                            </p>
                            <p className="text-[10px] text-slate-400">Ref. {b.faixaReferencia}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sparkline values={b.historico} ariaLabel={`Tendência ${b.nome}`} />
                            <span
                              className={`font-mono text-sm font-medium tabular-nums ${
                                ALERT_NIVEL_STYLE[b.alertNivel]
                              }`}
                            >
                              {b.valor}
                              <span className="ml-0.5 text-[10px] text-slate-400">
                                {b.unidade}
                              </span>
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </article>
            ))}
          </div>
        </section>
      ))}

      {/* Análise IA — fluxo separado, parte de qualquer exame da lista */}
      {exameAnalise && (
        <AnalisarIADrawer
          form={exameAnalise.form}
          files={exameAnalise.files}
          laudo={exameAnalise.laudo}
          setForm={(form) => setExameAnalise({ ...exameAnalise, form })}
          onAnalisar={() => {
            const id = exameAnalise.id
            setExameAnalise(null)
            onAbrirExame?.(id)
          }}
          onClose={() => setExameAnalise(null)}
        />
      )}
    </div>
  )
}
