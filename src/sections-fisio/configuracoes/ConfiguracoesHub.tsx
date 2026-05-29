import { Link } from 'react-router-dom'
import {
  Bell,
  Briefcase,
  CalendarDays,
  ChevronRight,
  Clock,
  CreditCard,
  Database,
  Layers,
  Plug,
  ShieldCheck,
  Stethoscope,
  User,
} from 'lucide-react'

interface ConfigCard {
  id: string
  label: string
  descricao: string
  href: string
  icon: typeof User
  status?: { label: string; tone: 'teal' | 'amber' | 'emerald' | 'slate' }
}

interface ConfigGroup {
  label: string
  cards: ConfigCard[]
}

const GRUPOS: ConfigGroup[] = [
  {
    label: 'Atendimento',
    cards: [
      {
        id: 'perfil',
        label: 'Perfil profissional',
        descricao: 'Identidade, CREFITO, assinatura, métodos',
        href: '/fisio/sections/perfil',
        icon: User,
        status: { label: 'Completo', tone: 'emerald' },
      },
      {
        id: 'disponibilidade',
        label: 'Disponibilidade',
        descricao: 'Horários da semana, slot padrão, antecedência',
        href: '/fisio/sections/disponibilidade',
        icon: Clock,
        status: { label: '5 dias · 50h', tone: 'teal' },
      },
      {
        id: 'avaliacao-padrao',
        label: 'Avaliação padrão',
        descricao: 'Template do formulário cinético-funcional',
        href: '#',
        icon: Stethoscope,
        status: { label: 'COFFITO padrão', tone: 'slate' },
      },
    ],
  },
  {
    label: 'Catálogo',
    cards: [
      {
        id: 'servicos',
        label: 'Serviços e tabela de preços',
        descricao: 'Tipos de atendimento que você oferece',
        href: '/fisio/sections/servicos',
        icon: Briefcase,
        status: { label: '7 ativos', tone: 'teal' },
      },
      {
        id: 'planos',
        label: 'Planos terapêuticos',
        descricao: 'Pacotes de tratamento com múltiplas sessões',
        href: '/fisio/sections/planos',
        icon: Layers,
        status: { label: '5 ativos', tone: 'teal' },
      },
    ],
  },
  {
    label: 'Conta',
    cards: [
      {
        id: 'conta',
        label: 'Minha conta e cobrança',
        descricao: 'Plano Plus · próxima cobrança em 15/jun',
        href: '/fisio/sections/conta',
        icon: CreditCard,
        status: { label: 'Plano Plus', tone: 'teal' },
      },
      {
        id: 'notificacoes',
        label: 'Notificações',
        descricao: 'WhatsApp, e-mail, push do app',
        href: '/fisio/sections/notificacoes',
        icon: Bell,
        status: { label: '2 não lidas', tone: 'amber' },
      },
      {
        id: 'integracoes',
        label: 'Integrações',
        descricao: 'Stripe, Google Calendar, WhatsApp Business',
        href: '#',
        icon: Plug,
        status: { label: '1 desconectada', tone: 'amber' },
      },
      {
        id: 'privacidade',
        label: 'Dados e privacidade',
        descricao: 'Idioma, tema, exportar dados, LGPD',
        href: '#',
        icon: Database,
      },
    ],
  },
]

const TONE: Record<NonNullable<ConfigCard['status']>['tone'], string> = {
  teal: 'bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-900/50',
  emerald:
    'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900/50',
  amber:
    'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900/50',
  slate: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700',
}

export default function ConfiguracoesHub() {
  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        <header className="mb-7">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="size-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              Conta · Configurações
            </span>
          </div>
          <div className="flex items-start gap-3">
            <div className="size-11 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5 text-teal-600 dark:text-teal-400" strokeWidth={1.7} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                Configurações
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-xl">
                Tudo que define como o paciente te encontra, te paga e como você atende.
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-7">
          {GRUPOS.map((g) => (
            <section key={g.label}>
              <div className="flex items-center gap-1.5 mb-3 px-1">
                <span className="size-1 rounded-full bg-slate-400 dark:bg-slate-600" />
                <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-slate-500 dark:text-slate-400">
                  {g.label}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {g.cards.map((c) => {
                  const Icon = c.icon
                  return (
                    <Link
                      key={c.id}
                      to={c.href}
                      className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/70 px-4 py-3.5 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-sm transition-all"
                    >
                      <span className="inline-flex items-center justify-center size-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-300 ring-1 ring-teal-200/60 dark:ring-teal-900/60 shrink-0">
                        <Icon className="size-4" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13.5px] font-semibold text-slate-900 dark:text-slate-50 truncate">
                            {c.label}
                          </span>
                          {c.status && (
                            <span
                              className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium ring-1 ${TONE[c.status.tone]}`}
                            >
                              {c.status.label}
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11.5px] text-slate-500 dark:text-slate-400 truncate">
                          {c.descricao}
                        </p>
                      </div>
                      <ChevronRight
                        className="size-4 shrink-0 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors"
                        strokeWidth={2}
                      />
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

// Suppress unused warning
void CalendarDays
