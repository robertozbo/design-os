import { useState } from 'react'
import {
  ShieldCheck,
  Users,
  EyeOff,
  Heart,
  Clock,
  Microscope,
  Languages,
  Check,
  ArrowRight,
  X,
} from 'lucide-react'
import type { ColaboradorEntryProps, Idioma } from '@/../product/sections/avalia-es-de-risco/types'

const IDIOMA_LABELS: Record<Idioma, { label: string; flag: string }> = {
  pt: { label: 'Português', flag: 'PT' },
  en: { label: 'English', flag: 'EN' },
  es: { label: 'Español', flag: 'ES' },
}

export function ColaboradorEntry({
  empregadorRazaoSocial,
  empregadorLogoUrl,
  funcaoColaborador,
  instrumentoNome,
  instrumentoVersao,
  duracaoEstimadaMin,
  responsavelTecnicoNome,
  responsavelTecnicoRegistro,
  idiomaSelecionado,
  idiomasDisponiveis,
  onSelecionarIdioma,
  onResponder,
  onRecusar,
}: ColaboradorEntryProps) {
  const [recusaModalOpen, setRecusaModalOpen] = useState(false)
  const [recusaConfirmada, setRecusaConfirmada] = useState(false)

  const confirmarRecusa = () => {
    setRecusaModalOpen(false)
    setRecusaConfirmada(true)
    onRecusar?.()
  }

  if (recusaConfirmada) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 mb-5">
            <Check className="w-6 h-6 text-slate-500 dark:text-slate-400" strokeWidth={2} />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3 tracking-tight">
            Decisão registrada
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
            Você não receberá mais lembretes desta pesquisa.
          </p>
          <p className="text-[12px] text-slate-500 dark:text-slate-500 leading-relaxed">
            Sua decisão não é registrada de forma identificável. Obrigado.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <header className="px-4 sm:px-6 py-4 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          {empregadorLogoUrl ? (
            <img
              src={empregadorLogoUrl}
              alt={empregadorRazaoSocial}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-800"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/60 ring-1 ring-teal-200/60 dark:ring-teal-900/40 flex items-center justify-center">
              <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300">
                {empregadorRazaoSocial.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-[12px] text-slate-600 dark:text-slate-400 font-medium leading-tight">
            {empregadorRazaoSocial}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Languages
            className="w-3.5 h-3.5 text-slate-500 dark:text-slate-500 mr-1"
            strokeWidth={1.75}
          />
          {idiomasDisponiveis.map((i) => {
            const ativo = i === idiomaSelecionado
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelecionarIdioma?.(i)}
                className={`
                  px-2 py-1 rounded-md text-[10px] font-mono font-semibold tracking-wider
                  transition ring-1
                  ${
                    ativo
                      ? 'bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-900 ring-slate-900 dark:ring-slate-100'
                      : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 ring-slate-200 dark:ring-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
              >
                {IDIOMA_LABELS[i].flag}
              </button>
            )
          })}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-xl">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 ring-1 ring-teal-200/60 dark:ring-teal-900/40 mb-4">
              <ShieldCheck
                className="w-3 h-3 text-teal-600 dark:text-teal-400"
                strokeWidth={2}
              />
              <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-teal-700 dark:text-teal-300">
                Avaliação NR-1 · Pesquisa anônima
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-50 mb-3 tracking-tight leading-tight">
              Sua participação é<br className="hidden sm:block" /> voluntária e anônima
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Esta pesquisa avalia condições do ambiente de trabalho. Você decide se quer responder.
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900/60 ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm p-5 sm:p-6 mb-5">
            <h2 className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-4">
              Sobre esta pesquisa
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-[13px]">
              <DataRow
                icon={<Microscope className="w-3.5 h-3.5" strokeWidth={1.75} />}
                label="Instrumento"
                value={`${instrumentoNome} · ${instrumentoVersao}`}
                mono
              />
              <DataRow
                icon={<Clock className="w-3.5 h-3.5" strokeWidth={1.75} />}
                label="Duração estimada"
                value={`~${duracaoEstimadaMin} min`}
              />
              <DataRow
                icon={<Users className="w-3.5 h-3.5" strokeWidth={1.75} />}
                label="Sua função"
                value={funcaoColaborador}
              />
              <DataRow
                icon={<ShieldCheck className="w-3.5 h-3.5" strokeWidth={1.75} />}
                label="Responsável técnico"
                value={
                  <span>
                    {responsavelTecnicoNome}
                    <span className="block text-[11px] text-slate-500 dark:text-slate-500 font-mono">
                      {responsavelTecnicoRegistro}
                    </span>
                  </span>
                }
              />
            </dl>
          </div>

          <div className="rounded-2xl bg-slate-100/60 dark:bg-slate-900/40 ring-1 ring-slate-200/80 dark:ring-slate-800/60 p-5 sm:p-6 mb-6">
            <h2 className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-4">
              Termo de participação
            </h2>
            <ul className="space-y-3 text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
              <TermoBullet
                icon={<Heart className="w-3.5 h-3.5 text-rose-500" strokeWidth={2} />}
                title="Voluntariedade"
              >
                Você não é obrigado(a) a responder. Pode recusar agora ou abandonar a qualquer momento.
              </TermoBullet>
              <TermoBullet
                icon={<EyeOff className="w-3.5 h-3.5 text-slate-500" strokeWidth={2} />}
                title="Anonimato"
              >
                Suas respostas individuais nunca são vistas pelo responsável técnico nem pelo empregador.
                Apenas agregados por setor são exibidos, e somente quando há 3 ou mais respondentes.
              </TermoBullet>
              <TermoBullet
                icon={<Users className="w-3.5 h-3.5 text-teal-600" strokeWidth={2} />}
                title="Caráter coletivo"
              >
                A pesquisa avalia o ambiente de trabalho como um todo — não é uma análise individual de
                desempenho ou saúde mental sua.
              </TermoBullet>
              <TermoBullet
                icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />}
                title="Direito de não responder"
              >
                Sua decisão de não participar é respeitada e não é registrada de forma identificável.
              </TermoBullet>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onResponder}
              className="
                group inline-flex items-center justify-center gap-2 px-5 py-3.5
                rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800
                dark:bg-teal-500 dark:hover:bg-teal-400
                text-white font-medium text-sm
                shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]
                dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]
                transition
              "
            >
              Responder pesquisa
              <ArrowRight
                className="w-4 h-4 transition group-hover:translate-x-0.5"
                strokeWidth={2.25}
              />
            </button>
            <button
              type="button"
              onClick={() => setRecusaModalOpen(true)}
              className="
                inline-flex items-center justify-center gap-2 px-5 py-3.5
                rounded-xl bg-white dark:bg-slate-900/40
                ring-1 ring-slate-200 dark:ring-slate-800
                hover:bg-slate-50 dark:hover:bg-slate-800/60
                text-slate-700 dark:text-slate-300 font-medium text-sm
                transition
              "
            >
              Não quero responder
            </button>
          </div>

          <p className="mt-5 text-[11px] text-slate-500 dark:text-slate-500 leading-relaxed text-center px-2">
            Ao continuar, você concorda com nossa{' '}
            <a className="underline decoration-slate-400 underline-offset-2 hover:text-slate-700 dark:hover:text-slate-300">
              Política de Privacidade
            </a>{' '}
            (LGPD). Suas respostas são armazenadas de forma agregada e não identificável.
          </p>
        </div>
      </main>

      {recusaModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar recusa"
        >
          <button
            type="button"
            onClick={() => setRecusaModalOpen(false)}
            aria-label="Fechar"
            className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 shadow-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <X className="w-4 h-4 text-slate-500 dark:text-slate-400" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1 tracking-tight">
                  Confirmar recusa
                </h3>
                <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Você não receberá mais lembretes desta pesquisa.
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 ring-1 ring-slate-200/60 dark:ring-slate-800/60 p-3 mb-5">
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Sua decisão não é registrada de forma identificável ao responsável técnico ou empregador.
                Apenas o canal de envio é encerrado para este ciclo.
              </p>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setRecusaModalOpen(false)}
                className="
                  px-3.5 py-2 rounded-xl text-sm font-medium
                  text-slate-600 dark:text-slate-300
                  hover:bg-slate-100 dark:hover:bg-slate-800
                  transition
                "
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={confirmarRecusa}
                className="
                  px-4 py-2 rounded-xl text-sm font-medium
                  bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-900
                  hover:bg-slate-800 dark:hover:bg-slate-200
                  transition
                "
              >
                Confirmar recusa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface DataRowProps {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  mono?: boolean
}

function DataRow({ icon, label, value, mono }: DataRowProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-500">
        {icon}
        {label}
      </dt>
      <dd
        className={`text-slate-800 dark:text-slate-200 ${
          mono ? 'font-mono text-[12px]' : 'text-[13px] font-medium'
        }`}
      >
        {value}
      </dd>
    </div>
  )
}

interface TermoBulletProps {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}

function TermoBullet({ icon, title, children }: TermoBulletProps) {
  return (
    <li className="flex items-start gap-2.5">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <strong className="font-semibold text-slate-900 dark:text-slate-100">{title}.</strong>{' '}
        <span className="text-slate-600 dark:text-slate-400">{children}</span>
      </div>
    </li>
  )
}
