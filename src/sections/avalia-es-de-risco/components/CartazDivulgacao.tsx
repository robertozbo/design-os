import {
  AlertTriangle,
  Download,
  Printer,
  QrCode,
  ShieldCheck,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react'

interface Props {
  empregadorRazaoSocial: string
  empregadorLogoUrl?: string
  avaliacaoNome: string
  instrumentoNome: string
  duracaoEstimadaMin: number
  janelaInicio: string
  janelaFim: string
  responsavelTecnicoNome: string
  responsavelTecnicoRegistro: string
  /**
   * URL alvo do QR code. Em produção será o link público da pesquisa.
   * No Design OS é apenas um placeholder visual.
   */
  urlPesquisa?: string
  onBaixarPdf?: () => void
  onImprimir?: () => void
}

export function CartazDivulgacao({
  empregadorRazaoSocial,
  empregadorLogoUrl,
  avaliacaoNome,
  instrumentoNome,
  duracaoEstimadaMin,
  janelaInicio,
  janelaFim,
  responsavelTecnicoNome,
  responsavelTecnicoRegistro,
  urlPesquisa = 'nymos.app/p/x7k9z2',
  onBaixarPdf,
  onImprimir,
}: Props) {
  return (
    <div className="min-h-full bg-slate-100 dark:bg-slate-950 px-4 sm:px-6 py-8 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
              Cartaz de divulgação (fallback)
            </h2>
            <p className="text-[12px] text-slate-500 dark:text-slate-400">
              Use apenas se houver trabalhadores sem canal individual de contato.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onImprimir}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 ring-1 ring-slate-200 dark:ring-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-sm font-medium transition"
            >
              <Printer className="w-3.5 h-3.5" strokeWidth={2} />
              Imprimir
            </button>
            <button
              type="button"
              onClick={onBaixarPdf}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white text-sm font-medium shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" strokeWidth={2} />
              Baixar PDF/Word
            </button>
          </div>
        </header>

        <div className="rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 ring-1 ring-amber-200/70 dark:ring-amber-900/40 px-4 py-3 flex items-start gap-3 mb-5">
          <AlertTriangle
            className="w-4 h-4 text-amber-700 dark:text-amber-300 mt-0.5 shrink-0"
            strokeWidth={2}
          />
          <div className="text-[12px] text-amber-900 dark:text-amber-100 leading-relaxed">
            <strong className="font-semibold">Canal não-recomendado.</strong> O QR code exige que o
            colaborador informe CPF + matrícula para responder, o que reduz o anonimato percebido e
            pode fazer o trabalhador se sentir monitorado. Use apenas como{' '}
            <strong>fallback</strong> para quem não tem e-mail/WhatsApp pessoal — nunca como canal
            principal.
          </div>
        </div>

        <div
          className="
            mx-auto bg-white dark:bg-slate-50 text-slate-900
            ring-1 ring-slate-300 dark:ring-slate-700
            shadow-[0_8px_30px_-10px_rgba(15,23,42,0.25)]
            aspect-[210/297] w-full max-w-[640px]
            flex flex-col
            relative
          "
        >
          <header className="px-8 pt-8 pb-5 border-b-2 border-teal-600 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {empregadorLogoUrl ? (
                <img
                  src={empregadorLogoUrl}
                  alt={empregadorRazaoSocial}
                  className="w-14 h-14 rounded-xl object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
                  {empregadorRazaoSocial.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-teal-700">
                  Avaliação NR-1 · Saúde Ocupacional
                </p>
                <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                  {empregadorRazaoSocial}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md ring-1 ring-emerald-300 bg-emerald-50 text-[9px] font-semibold text-emerald-700 uppercase tracking-wider">
              <ShieldCheck className="w-2.5 h-2.5" strokeWidth={2.25} />
              Anônima
            </span>
          </header>

          <main className="flex-1 px-8 py-6 flex flex-col items-center text-center">
            <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 leading-tight tracking-tight mb-2">
              Sua opinião importa.
            </h1>
            <p className="text-[12px] text-slate-600 leading-relaxed max-w-md mb-6">
              Convidamos você a responder a avaliação de risco psicossocial do nosso ambiente de
              trabalho. Sua participação é <strong>voluntária</strong> e suas respostas são{' '}
              <strong>totalmente anônimas</strong>.
            </p>

            <div className="relative mb-5">
              <div className="w-36 h-36 sm:w-44 sm:h-44 bg-white ring-2 ring-slate-300 p-3 rounded-xl flex items-center justify-center">
                <QrCodePlaceholder />
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-600 text-white text-[9px] font-semibold tracking-wider uppercase">
                <QrCode className="w-2.5 h-2.5" strokeWidth={2.25} />
                Escaneie com a câmera
              </span>
            </div>

            <p className="text-[11px] font-mono text-slate-500 mt-3 mb-5">{urlPesquisa}</p>

            <dl className="grid grid-cols-3 gap-4 text-center text-[10px] w-full max-w-md mb-5">
              <div>
                <dt className="font-mono uppercase tracking-[0.12em] text-slate-400 mb-1">
                  Instrumento
                </dt>
                <dd className="font-semibold text-slate-700">{instrumentoNome}</dd>
              </div>
              <div>
                <dt className="font-mono uppercase tracking-[0.12em] text-slate-400 mb-1">
                  <Clock className="inline w-2.5 h-2.5 -mt-0.5 mr-0.5" strokeWidth={2.25} />
                  Duração
                </dt>
                <dd className="font-semibold text-slate-700">~{duracaoEstimadaMin} min</dd>
              </div>
              <div>
                <dt className="font-mono uppercase tracking-[0.12em] text-slate-400 mb-1">
                  Período
                </dt>
                <dd className="font-semibold text-slate-700 font-mono tabular-nums">
                  {janelaInicio} → {janelaFim}
                </dd>
              </div>
            </dl>

            <div className="rounded-xl bg-amber-50 ring-1 ring-amber-200 px-3 py-2 text-left text-[10px] text-amber-900 leading-snug max-w-md">
              <p className="font-semibold flex items-center gap-1 mb-1">
                <EyeOff className="w-3 h-3" strokeWidth={2.25} />
                Como funciona o anonimato neste canal
              </p>
              <p>
                Ao escanear o QR, será solicitado CPF + matrícula apenas para evitar duplicidade.
                Suas <strong>respostas individuais nunca são associadas</strong> ao seu nome.
                Resultados são exibidos apenas em agregados de 3+ pessoas.
              </p>
            </div>
          </main>

          <footer className="px-8 py-4 border-t border-slate-200 bg-slate-50 text-[9px] text-slate-600 flex items-center justify-between gap-3">
            <div className="leading-tight">
              <p className="font-semibold text-slate-700">{responsavelTecnicoNome}</p>
              <p className="font-mono text-slate-500">{responsavelTecnicoRegistro}</p>
            </div>
            <div className="text-right leading-tight">
              <p className="uppercase tracking-wider font-bold text-teal-700">NR-1 · {avaliacaoNome}</p>
              <p className="font-mono text-slate-500">Portaria MTE 1.419/2024</p>
            </div>
          </footer>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[56px] font-bold text-slate-200/40 -rotate-12 select-none tracking-wider">
              MODELO
            </span>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-slate-100 dark:bg-slate-900/60 ring-1 ring-slate-200/60 dark:ring-slate-800 px-4 py-3 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2.5">
          <Eye className="w-3.5 h-3.5 mt-0.5 shrink-0" strokeWidth={1.75} />
          <p>
            <strong className="text-slate-700 dark:text-slate-300">Recomendação Nymos:</strong>{' '}
            mantenha o canal padrão (e-mail individual cadastrado) sempre que possível. Use este
            cartaz somente para trabalhadores que não têm e-mail/WhatsApp pessoal — e nunca crie
            e-mails de fachada nem use canais de terceiros para "destravar" a participação.
          </p>
        </div>
      </div>
    </div>
  )
}

function QrCodePlaceholder() {
  /** Visual mock de um QR code — não é um QR funcional, é apenas grid 21x21 com padrão fixo. */
  return (
    <svg viewBox="0 0 21 21" className="w-full h-full" aria-label="QR code (modelo)">
      <rect width="21" height="21" fill="white" />
      {Array.from({ length: 21 * 21 }).map((_, idx) => {
        const x = idx % 21
        const y = Math.floor(idx / 21)
        const inFinderTopLeft = x < 7 && y < 7
        const inFinderTopRight = x >= 14 && y < 7
        const inFinderBottomLeft = x < 7 && y >= 14
        const finderOuter =
          (inFinderTopLeft && (x === 0 || x === 6 || y === 0 || y === 6)) ||
          (inFinderTopRight && (x === 14 || x === 20 || y === 0 || y === 6)) ||
          (inFinderBottomLeft && (x === 0 || x === 6 || y === 14 || y === 20))
        const finderInner =
          (inFinderTopLeft && x >= 2 && x <= 4 && y >= 2 && y <= 4) ||
          (inFinderTopRight && x >= 16 && x <= 18 && y >= 2 && y <= 4) ||
          (inFinderBottomLeft && x >= 2 && x <= 4 && y >= 16 && y <= 18)
        const filled =
          finderOuter ||
          finderInner ||
          (!inFinderTopLeft && !inFinderTopRight && !inFinderBottomLeft && (x * 7 + y * 11) % 3 === 0)
        return filled ? <rect key={idx} x={x} y={y} width="1" height="1" fill="#0f172a" /> : null
      })}
    </svg>
  )
}
