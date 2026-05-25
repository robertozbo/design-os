import {
  Pill,
  FlaskConical,
  NotebookText,
  AlertCircle,
  ChevronRight,
  ScanSearch,
  Bone,
  Brain,
  Waves,
} from 'lucide-react'
import type {
  Paciente,
  MedicacaoAtiva,
  ExameRecente,
  ImagemRecente,
  EvolucaoAnterior,
  ModalidadeImagem,
  SignificanciaImagem,
} from '@/../product-clinico/sections/consulta/types'
import { ImagemMedicaMock } from '@/sections-clinico/exames/components/ImagemMedicaMock'
import { ALERT_NIVEL_STYLE, formatDataBR, formatPercentAdesao, formatRelativo } from './helpers'
import { Sparkline } from './Sparkline'

interface Props {
  paciente: Paciente
  medicacaoAtiva: MedicacaoAtiva[]
  examesRecentes: ExameRecente[]
  imagensRecentes: ImagemRecente[]
  evolucoesAnteriores: EvolucaoAnterior[]
  onAbrirExame?: (id: string) => void
  onAbrirImagem?: (id: string) => void
  onAbrirEvolucao?: (id: string) => void
}

const MODALIDADE_ICONE: Record<ModalidadeImagem, React.ComponentType<{ className?: string }>> = {
  'raio-x': Bone,
  usg: Waves,
  rm: Brain,
  tc: Brain,
  cintilografia: ScanSearch,
}

const MODALIDADE_LABEL: Record<ModalidadeImagem, string> = {
  'raio-x': 'Raio-X',
  usg: 'USG',
  rm: 'RM',
  tc: 'TC',
  cintilografia: 'Cintilo',
}

const SIG_DOT: Record<SignificanciaImagem, string> = {
  normal: 'bg-emerald-500',
  atencao: 'bg-amber-500',
  critico: 'bg-rose-500',
}

export function ContextPanel({
  paciente,
  medicacaoAtiva,
  examesRecentes,
  imagensRecentes,
  evolucoesAnteriores,
  onAbrirExame,
  onAbrirImagem,
  onAbrirEvolucao,
}: Props) {
  return (
    <aside
      className="
        space-y-4
        text-sm
      "
      aria-label="Contexto do paciente"
    >
      {/* Patient summary */}
      <section className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Paciente
        </h2>
        <div className="mt-2 space-y-1.5">
          <p className="font-medium text-slate-900 dark:text-slate-50">{paciente.nome}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {paciente.idade} anos · {paciente.genero} · {paciente.convenio}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {paciente.condicoesCronicas.map((c, i) => (
              <span
                key={i}
                className="
                  inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px]
                  text-slate-700
                  dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200
                "
              >
                {c}
              </span>
            ))}
          </div>
          <p className="pt-1 text-xs text-slate-500 dark:text-slate-400">
            Última consulta: {formatRelativo(paciente.ultimaConsultaEm)}
          </p>
        </div>
      </section>

      {/* Medicação ativa */}
      <Section icon={<Pill className="size-3.5" />} title={`Medicação ativa (${medicacaoAtiva.length})`}>
        <ul className="space-y-2">
          {medicacaoAtiva.map((m) => (
            <li
              key={m.id}
              className="rounded-md border border-slate-200/80 bg-slate-50/50 p-2.5 dark:border-slate-800 dark:bg-slate-900/40"
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate font-medium text-slate-900 dark:text-slate-100">
                  {m.nome} <span className="text-xs font-normal text-slate-500">{m.dose}</span>
                </p>
                <span
                  className={`
                    shrink-0 font-mono text-[10px] tabular-nums
                    ${
                      m.adesaoUltimos7Dias === null
                        ? 'text-slate-400'
                        : m.adesaoUltimos7Dias >= 0.9
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : m.adesaoUltimos7Dias >= 0.7
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }
                  `}
                  title="Adesão últimos 7 dias"
                >
                  {formatPercentAdesao(m.adesaoUltimos7Dias)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{m.posologia}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Últimos exames (laboratório) */}
      <Section icon={<FlaskConical className="size-3.5" />} title="Últimos exames (lab)">
        <ul className="space-y-2.5">
          {examesRecentes.map((e) => (
            <li key={e.id}>
              <button
                onClick={() => onAbrirExame?.(e.id)}
                className="
                  group/item w-full rounded-md border border-slate-200/80 bg-slate-50/50 p-2.5 text-left
                  transition-colors hover:border-teal-300 hover:bg-white
                  focus:outline-none focus:ring-2 focus:ring-teal-500/40
                  dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-teal-700 dark:hover:bg-slate-900
                "
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate font-medium text-slate-900 dark:text-slate-100">{e.tipo}</p>
                  <span className="shrink-0 text-[10px] text-slate-500 dark:text-slate-400">
                    {formatDataBR(e.dataColeta)}
                  </span>
                </div>
                <ul className="mt-1.5 space-y-1">
                  {e.biomarkers.map((b, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-slate-600 dark:text-slate-300">{b.nome}</span>
                      <span className="flex items-center gap-2">
                        <Sparkline
                          values={b.historico}
                          ariaLabel={`Tendência de ${b.nome}`}
                        />
                        <span className={`font-mono tabular-nums ${ALERT_NIVEL_STYLE[b.alertNivel]}`}>
                          {b.valor}
                          <span className="ml-0.5 text-[9px] text-slate-400">{b.unidade}</span>
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      {/* Imagens recentes */}
      <Section icon={<ScanSearch className="size-3.5" />} title="Imagens recentes">
        <ul className="space-y-2">
          {imagensRecentes.map((img) => {
            const Icon = MODALIDADE_ICONE[img.modalidade]
            return (
              <li key={img.id}>
                <button
                  onClick={() => onAbrirImagem?.(img.id)}
                  className="
                    group/img w-full overflow-hidden rounded-md border border-slate-200/80 text-left transition-all
                    hover:border-teal-300 hover:shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-teal-500/40
                    dark:border-slate-800 dark:hover:border-teal-700
                  "
                >
                  <div className="relative h-20 w-full">
                    <ImagemMedicaMock
                      imagem={{
                        id: img.id,
                        rotulo: MODALIDADE_LABEL[img.modalidade],
                        descricao: img.tipo,
                        mockVisual: img.mockVisual,
                      }}
                    />
                  </div>
                  <div className="flex items-start gap-2 bg-white p-2 dark:bg-slate-900">
                    <span className={`mt-1 size-1.5 shrink-0 rounded-full ${SIG_DOT[img.significancia]}`} />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1 text-xs font-medium text-slate-900 dark:text-slate-100">
                        <Icon className="size-3 text-slate-400" />
                        {img.tipo}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-slate-500 dark:text-slate-400">
                        {img.destaqueAchado}
                      </p>
                      <p className="mt-1 text-[9px] text-slate-400">
                        {formatDataBR(img.dataColeta)}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </Section>

      {/* Evoluções anteriores */}
      <Section icon={<NotebookText className="size-3.5" />} title="Evoluções anteriores">
        <ul className="space-y-1.5">
          {evolucoesAnteriores.map((ev) => (
            <li key={ev.id}>
              <button
                onClick={() => onAbrirEvolucao?.(ev.id)}
                className="
                  group/ev flex w-full items-start justify-between gap-2 rounded-md
                  px-2 py-2 text-left transition-colors hover:bg-slate-100/80
                  focus:outline-none focus:ring-2 focus:ring-teal-500/40
                  dark:hover:bg-slate-800/60
                "
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                    {formatDataBR(ev.data)}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                    {ev.planoResumo}
                  </p>
                </div>
                <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-slate-300 transition-colors group-hover/ev:text-slate-500 dark:text-slate-600 dark:group-hover/ev:text-slate-400" />
              </button>
            </li>
          ))}
        </ul>
      </Section>

      {/* LGPD reminder */}
      <div className="flex items-start gap-2 rounded-lg border border-slate-200/60 bg-slate-50/60 p-3 text-[11px] leading-relaxed text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
        <AlertCircle className="mt-0.5 size-3 shrink-0" />
        <span>
          Acesso ao prontuário registrado em audit log (LGPD). Paciente pode consultar histórico no app.
        </span>
      </div>
    </aside>
  )
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <span className="text-slate-400 dark:text-slate-500">{icon}</span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}
