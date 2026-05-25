import {
  AlertCircle,
  Loader2,
  Sparkles,
  Wand2,
} from 'lucide-react'
import type {
  ProjecaoCorporal,
  ProjecaoMeta,
  RegiaoCorporal,
} from '@/../product/sections/minha-sa-de-paciente/types'

interface ProjecaoCardProps {
  projecao: ProjecaoCorporal
  onStartProjecao?: () => void
  onRetry?: () => void
}

const REGIAO_LABEL: Record<RegiaoCorporal, string> = {
  abdomen: 'Abdômen',
  flancos: 'Flancos',
  peitoral: 'Peitoral',
  costas: 'Costas',
  bracos: 'Braços',
  pernas: 'Pernas',
  cintura: 'Cintura',
  ombros: 'Ombros',
  postura: 'Postura',
}

function formatRangeKg(meta: ProjecaoMeta['peso']): string {
  if (meta.alvoMin === meta.alvoMax) return `${meta.alvoMin} kg`
  return `${meta.alvoMin}–${meta.alvoMax} kg`
}

function formatRangePct(meta: ProjecaoMeta['gorduraPercent']): string {
  if (meta.alvoMin === meta.alvoMax) return `${meta.alvoMin}%`
  return `${meta.alvoMin}–${meta.alvoMax}%`
}

export function ProjecaoCard({
  projecao,
  onStartProjecao,
  onRetry,
}: ProjecaoCardProps) {
  const { status, meta, basePhotos, resultado, mensagem } = projecao

  return (
    <section className="overflow-hidden rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 p-5 dark:border-teal-400/30">
      <header className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Projeção corporal
            </h3>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
              Imagem estimativa do corpo ao atingir a meta — preserva
              identidade, proporções e ambiente
            </p>
          </div>
        </div>
        <span className="rounded-full bg-teal-500/15 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide text-teal-700 ring-1 ring-teal-500/30 dark:text-teal-300">
          Nano Banana
        </span>
      </header>

      {/* States */}
      {status === 'nao_solicitada' && (
        <div className="mt-5 space-y-4">
          <div className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/40 dark:border-slate-700 dark:bg-slate-900/40">
            <div className="text-center">
              <Wand2
                className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600"
                aria-hidden
              />
              <p className="mt-2 max-w-xs text-xs text-slate-500 dark:text-slate-400">
                Defina uma meta e gere a projeção visual
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onStartProjecao}
            className="w-full rounded-full bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-600"
          >
            Gerar projeção corporal
          </button>
        </div>
      )}

      {status === 'sem_dados_suficientes' && (
        <div className="mt-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden
            />
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Dados insuficientes
              </p>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                {mensagem ??
                  'Adicione bioimpedância + fotos corporais pra liberar a projeção'}
              </p>
            </div>
          </div>
        </div>
      )}

      {status === 'gerando' && (
        <div className="mt-5 flex aspect-[16/10] w-full items-center justify-center rounded-2xl bg-white/40 dark:bg-slate-900/40">
          <div className="text-center">
            <Loader2
              className="mx-auto h-8 w-8 animate-spin text-teal-500 dark:text-teal-400"
              aria-hidden
            />
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Gerando imagem… (~30s)
            </p>
          </div>
        </div>
      )}

      {status === 'pronta' && resultado && (
        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <figure>
              <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                {basePhotos?.frontal ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={basePhotos.frontal}
                    alt="Atual"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>
              <figcaption className="mt-1 text-center text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Atual
              </figcaption>
            </figure>
            <figure>
              <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-100 ring-2 ring-teal-500 dark:bg-slate-800 dark:ring-teal-400">
                {resultado.frontal && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resultado.frontal}
                    alt="Projetado"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <figcaption className="mt-1 text-center text-[10px] font-medium uppercase tracking-wide text-teal-600 dark:text-teal-400">
                Projetado
              </figcaption>
            </figure>
          </div>

          {meta && (
            <div className="space-y-1.5 rounded-2xl bg-white/60 p-3 dark:bg-slate-900/60">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Meta
              </p>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <dt className="text-slate-500 dark:text-slate-400">Peso</dt>
                <dd className="text-right font-mono text-slate-900 dark:text-slate-100">
                  {formatRangeKg(meta.peso)}
                </dd>
                <dt className="text-slate-500 dark:text-slate-400">Gordura</dt>
                <dd className="text-right font-mono text-slate-900 dark:text-slate-100">
                  {formatRangePct(meta.gorduraPercent)}
                </dd>
                {meta.prazoMeses != null && (
                  <>
                    <dt className="text-slate-500 dark:text-slate-400">
                      Horizonte
                    </dt>
                    <dd className="text-right font-mono text-slate-900 dark:text-slate-100">
                      {meta.prazoMeses} {meta.prazoMeses === 1 ? 'mês' : 'meses'}
                    </dd>
                  </>
                )}
              </dl>
              {meta.regioesPrioritarias.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {meta.regioesPrioritarias.map((r) => (
                    <span
                      key={r}
                      className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-medium text-teal-700 ring-1 ring-teal-500/20 dark:text-teal-300"
                    >
                      {REGIAO_LABEL[r]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <p className="text-[10px] italic text-slate-500 dark:text-slate-400">
            Imagem é estimativa visual educativa, não promessa de resultado.
            Procure um profissional pra plano real.
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="w-full rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Gerar nova projeção
            </button>
          )}
        </div>
      )}
    </section>
  )
}
