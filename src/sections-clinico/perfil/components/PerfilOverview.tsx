import { useState } from 'react'
import type {
  PapelSst,
  PerfilProps,
} from '@/../product-clinico/sections/perfil/types'
import {
  Pencil,
  Mail,
  Phone,
  Languages,
  Globe2,
  ShieldCheck,
  PenTool,
  Hash,
  Sparkles,
  Briefcase,
  ListChecks,
  FileText,
  Award,
  CalendarRange,
} from 'lucide-react'
import { RegistroRow } from './RegistroRow'

const PAPEL_LABEL: Record<PapelSst, string> = {
  endocrinologista: 'Endocrinologista',
  clinico_geral: 'Clínico(a) Geral',
  cardiologista: 'Cardiologista',
  outro: 'Outra especialidade',
}

const IDIOMA_LABEL: Record<'pt' | 'en' | 'es', string> = {
  pt: 'Português · Brasil',
  en: 'English',
  es: 'Español',
}

const NUM = new Intl.NumberFormat('pt-BR')

export function PerfilOverview({ perfil, onEditPerfil }: PerfilProps) {
  const [activeTab] = useState<'identidade' | 'registros' | 'assinatura'>('identidade')
  void activeTab

  const { identidade, registrosProfissionais, assinaturaDigital, historicoAtuacao } = perfil
  const registroPrimario = registrosProfissionais.find((r) => r.primario)
  const hashShort = assinaturaDigital.hashSha256
    ? `${assinaturaDigital.hashSha256.slice(0, 10)}…${assinaturaDigital.hashSha256.slice(-8)}`
    : '—'

  return (
    <div
      className="
        relative min-h-full
        bg-gradient-to-b from-slate-50 via-white to-slate-50
        dark:from-slate-950 dark:via-slate-950 dark:to-slate-900
      "
    >
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <header className="nymos-reveal opacity-0">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Conta · Perfil profissional
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Perfil
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Suas credenciais aparecem em prontuários, evoluções SOAP e prescrições que você assina.
              </p>
            </div>
            <button
              type="button"
              onClick={onEditPerfil}
              className="
                inline-flex items-center justify-center gap-2
                px-4 py-2.5 rounded-xl
                bg-teal-600 hover:bg-teal-700 active:bg-teal-800
                dark:bg-teal-500 dark:hover:bg-teal-400
                text-white font-medium text-sm
                shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]
                dark:shadow-[0_4px_14px_-4px_rgba(20,184,166,0.55)]
                transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2
              "
            >
              <Pencil className="w-4 h-4" strokeWidth={2} />
              Editar perfil
            </button>
          </div>
        </header>

        <div className="mt-7 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div
            style={{ animationDelay: '120ms' }}
            className="nymos-reveal opacity-0 lg:col-span-2 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5"
          >
            <div className="flex items-center gap-1.5 mb-4">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Identidade
              </span>
            </div>

            <div className="flex items-start gap-4">
              <span
                className="
                  inline-flex items-center justify-center w-24 h-24 rounded-2xl shrink-0
                  bg-violet-100 dark:bg-violet-900/40
                  text-violet-700 dark:text-violet-300
                  text-[28px] font-mono font-semibold
                  ring-1 ring-violet-200/60 dark:ring-violet-900/60
                "
              >
                {identidade.iniciais}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  {identidade.tratamento} {identidade.nome}
                </h2>
                <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                  {identidade.cargo}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[10px] font-medium ring-1 ring-teal-200/60 dark:ring-teal-900/60">
                  {PAPEL_LABEL[identidade.papel]}
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ContactRow
                icon={<Mail className="w-3 h-3" strokeWidth={1.75} />}
                label="E-mail corporativo"
                mono
              >
                {identidade.emailCorporativo}
              </ContactRow>
              <ContactRow
                icon={<Phone className="w-3 h-3" strokeWidth={1.75} />}
                label="Telefone"
                mono
              >
                {identidade.telefone}
              </ContactRow>
              <ContactRow
                icon={<Languages className="w-3 h-3" strokeWidth={1.75} />}
                label="Idioma preferido"
              >
                {IDIOMA_LABEL[identidade.idiomaPreferido]}
              </ContactRow>
              <ContactRow
                icon={<Globe2 className="w-3 h-3" strokeWidth={1.75} />}
                label="Fuso horário"
                mono
              >
                {identidade.fusoHorario}
              </ContactRow>
            </div>
          </div>

          <div
            style={{ animationDelay: '180ms' }}
            className="nymos-reveal opacity-0 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5 flex flex-col"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                  Registros profissionais
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                {registrosProfissionais.length}
              </span>
            </div>

            <div className="space-y-2 flex-1">
              {registrosProfissionais.map((reg) => (
                <RegistroRow key={reg.id} registro={reg} />
              ))}
            </div>

            {registroPrimario && (
              <p className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                Registro primário <span className="font-mono">{registroPrimario.numero}</span> usa-se
                por padrão nos relatórios oficiais.
              </p>
            )}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div
            style={{ animationDelay: '240ms' }}
            className="nymos-reveal opacity-0 lg:col-span-2 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
                <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                  Assinatura digital
                </span>
              </div>
              {assinaturaDigital.icpBrasilHabilitado && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 text-[10px] font-medium ring-1 ring-violet-200/60 dark:ring-violet-900/50">
                  <Sparkles className="w-3 h-3" strokeWidth={2} />
                  ICP-Brasil
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 font-medium">
                  Aparência nos relatórios
                </span>
                <div className="mt-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 ring-1 ring-slate-200 dark:ring-slate-700 px-4 py-6 flex items-center justify-center min-h-[110px]">
                  {assinaturaDigital.imagemUrl ? (
                    <SignaturePlaceholder nome={`${identidade.tratamento} ${identidade.nome}`} />
                  ) : (
                    <span className="text-[12px] text-slate-400">Sem assinatura cadastrada</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 font-medium">
                  Identidade verificada
                </span>
                <div className="mt-1.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 ring-1 ring-emerald-200/60 dark:ring-emerald-900/40 px-4 py-3 space-y-2">
                  <div className="inline-flex items-center gap-1.5">
                    <ShieldCheck
                      className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300"
                      strokeWidth={2}
                    />
                    <span className="text-[12px] font-medium text-emerald-800 dark:text-emerald-200">
                      Hash SHA-256 ativo
                    </span>
                  </div>
                  <div
                    className="text-[11px] font-mono text-emerald-700/80 dark:text-emerald-300/80 break-all leading-relaxed"
                    title={assinaturaDigital.hashSha256 ?? ''}
                  >
                    <Hash className="w-3 h-3 inline-block mr-1 -mt-px" strokeWidth={2} />
                    {hashShort}
                  </div>
                  {assinaturaDigital.imagemUploadedEm && (
                    <p className="text-[10px] text-emerald-700/70 dark:text-emerald-300/70 font-mono">
                      Carregada em{' '}
                      {new Date(assinaturaDigital.imagemUploadedEm).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ animationDelay: '300ms' }}
            className="nymos-reveal opacity-0 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5"
          >
            <div className="flex items-center gap-1.5 mb-3">
              <Award className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Histórico de atuação
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <MiniStat
                icon={<Briefcase className="w-3 h-3" strokeWidth={1.75} />}
                label="Pacientes ativos"
                value={NUM.format(historicoAtuacao.empregadoresAtivos)}
              />
              <MiniStat
                icon={<ListChecks className="w-3 h-3" strokeWidth={1.75} />}
                label="Consultas"
                value={NUM.format(historicoAtuacao.avaliacoesPublicadas)}
              />
              <MiniStat
                icon={<FileText className="w-3 h-3" strokeWidth={1.75} />}
                label="Prescrições"
                value={NUM.format(historicoAtuacao.relatoriosGerados)}
              />
              <MiniStat
                icon={<CalendarRange className="w-3 h-3" strokeWidth={1.75} />}
                label="Anos de prática"
                value={NUM.format(historicoAtuacao.anosDePratica)}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 font-medium">
                Especializações
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {historicoAtuacao.especializacoes.map((esp) => (
                  <span
                    key={esp}
                    className="
                      inline-flex items-center px-1.5 py-0.5 rounded-md
                      bg-slate-100 dark:bg-slate-800/70
                      ring-1 ring-slate-200/70 dark:ring-slate-700
                      text-[10px] text-slate-600 dark:text-slate-400 font-medium
                    "
                  >
                    {esp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContactRow({
  icon,
  label,
  children,
  mono,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 mt-0.5">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 font-medium">
          {label}
        </p>
        <p
          className={`text-[13px] text-slate-800 dark:text-slate-200 ${mono ? 'font-mono' : ''} truncate`}
        >
          {children}
        </p>
      </div>
    </div>
  )
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl bg-slate-50/70 dark:bg-slate-800/40 ring-1 ring-slate-200/60 dark:ring-slate-800 px-3 py-2">
      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </span>
      <p className="mt-0.5 text-[16px] font-semibold tracking-tight tabular-nums text-slate-900 dark:text-slate-50">
        {value}
      </p>
    </div>
  )
}

function SignaturePlaceholder({ nome }: { nome: string }) {
  return (
    <svg
      viewBox="0 0 320 80"
      className="w-full max-w-[260px] h-auto"
      role="img"
      aria-label={`Assinatura de ${nome}`}
    >
      <path
        d="M 18 56 Q 38 22 56 48 T 100 50 Q 118 32 142 56 T 188 46 Q 210 28 232 52 T 280 48 Q 296 38 304 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-slate-700 dark:text-slate-200"
      />
      <path
        d="M 28 64 L 280 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="2 4"
        className="text-slate-300 dark:text-slate-600"
      />
    </svg>
  )
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
