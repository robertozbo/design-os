import { useEffect, useState, type ComponentType } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Activity,
  Bell,
  Briefcase,
  CalendarDays,
  ClipboardList,
  Clock,
  CreditCard,
  Heart,
  Home,
  Inbox,
  Layers,
  MessageSquare,
  Settings as SettingsIcon,
  Sparkles,
  Stethoscope,
  User,
  Users,
} from 'lucide-react'
import {
  getAllFisioSectionIds,
  loadFisioSectionData,
  loadFisioScreenDesignComponent,
} from '@/lib/fisio-section-loader'
// Fisio reuses the shared shell from shell-psicologo/ — same teal brand,
// distinguished by subBrand="Fisio" label.
import { AppShell, type NavGroup } from '@/shell-psicologo/components'

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Atendimento',
    items: [
      { label: 'Início', href: '/fisio/sections/inicio', icon: Home },
      { label: 'Pacientes', href: '/fisio/sections/pacientes', icon: Users },
      { label: 'Agenda', href: '/fisio/sections/agenda', icon: CalendarDays },
      { label: 'Disponibilidade', href: '/fisio/sections/disponibilidade', icon: Clock },
      { label: 'Convites', href: '/fisio/sections/convites', icon: Inbox },
    ],
  },
  {
    label: 'Clínico',
    items: [
      { label: 'Avaliação', href: '/fisio/sections/avaliacao', icon: ClipboardList },
      { label: 'Evolução', href: '/fisio/sections/evolucao', icon: Activity },
      { label: 'Métricas', href: '/fisio/sections/metricas', icon: Heart },
    ],
  },
  {
    label: 'Catálogo',
    items: [
      { label: 'Serviços', href: '/fisio/sections/servicos', icon: Briefcase },
      { label: 'Planos', href: '/fisio/sections/planos', icon: Layers },
    ],
  },
  {
    label: 'Conta',
    items: [
      { label: 'Perfil', href: '/fisio/sections/perfil', icon: User },
      { label: 'Minha conta', href: '/fisio/sections/conta', icon: CreditCard },
      { label: 'Configurações', href: '/fisio/sections/configuracoes', icon: SettingsIcon },
    ],
  },
  {
    label: 'Operacional',
    items: [
      { label: 'Mensagens', href: '/fisio/sections/mensagens', icon: MessageSquare },
      { label: 'Notificações', href: '/fisio/sections/notificacoes', icon: Bell },
      { label: 'IA', href: '/fisio/sections/ia', icon: Sparkles },
    ],
  },
]

interface Grupo {
  label: string
  emoji: string
  hint: string
  sectionIds: string[]
}

const GRUPOS: Grupo[] = [
  {
    label: 'Atendimento',
    emoji: '🩺',
    hint: 'Dia a dia com pacientes',
    sectionIds: ['inicio', 'pacientes', 'agenda', 'disponibilidade', 'convites'],
  },
  {
    label: 'Clínico',
    emoji: '📋',
    hint: 'Avaliação, evolução, métricas',
    sectionIds: ['avaliacao', 'evolucao', 'metricas'],
  },
  {
    label: 'Catálogo',
    emoji: '📦',
    hint: 'Serviços e planos',
    sectionIds: ['servicos', 'planos'],
  },
  {
    label: 'Conta',
    emoji: '💳',
    hint: 'Perfil, cobrança, configurações',
    sectionIds: ['perfil', 'conta', 'configuracoes'],
  },
  {
    label: 'Operacional',
    emoji: '⚙',
    hint: 'Mensagens · IA',
    sectionIds: ['mensagens', 'notificacoes', 'ia'],
  },
]

export function FisioSectionsPage() {
  const navigate = useNavigate()
  const allIds = getAllFisioSectionIds()
  const allIdsSet = new Set(allIds)
  const idsAgrupados = new Set(GRUPOS.flatMap((g) => g.sectionIds))
  const semGrupo = allIds.filter((id) => !idsAgrupados.has(id))

  return (
    <AppShell
      navigationGroups={NAV_GROUPS}
      activeHref="/fisio"
      user={{ name: 'Roberto Z.', role: 'Fisioterapeuta · CREFITO 3/99999-F' }}
      subBrand="Fisio"
      onNavigate={(href) => navigate(href)}
      onLogout={() => navigate('/')}
    >
      <div className="p-6 pl-16 lg:pl-6">
        <div className="mb-6">
          <Link to="/" className="text-slate-500 dark:text-slate-400 text-sm hover:underline">
            ← Design OS
          </Link>
          <div className="mt-3 flex items-baseline gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              Atender Fisioterapeuta · Web
            </h1>
            <span className="text-slate-400 dark:text-slate-500 text-sm font-mono tabular-nums">
              · {allIds.length} sections
            </span>
          </div>
          <p className="mt-1 text-slate-500 dark:text-slate-400 text-xs">
            Plataforma B2B para fisioterapeuta autônomo (CREFITO) — Nymos suite
          </p>
        </div>

        {allIds.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              Nenhuma section encontrada. Crie em <code>product-fisio/sections/</code>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 items-start">
            {GRUPOS.map((g) => {
              const ids = g.sectionIds.filter((id) => allIdsSet.has(id))
              if (ids.length === 0) return null
              return <Coluna key={g.label} grupo={g} sectionIds={ids} />
            })}
            {semGrupo.length > 0 && (
              <Coluna
                grupo={{ label: 'Outras', emoji: '📦', hint: '', sectionIds: [] }}
                sectionIds={semGrupo}
              />
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}

function Coluna({ grupo, sectionIds }: { grupo: Grupo; sectionIds: string[] }) {
  return (
    <section className="min-w-0">
      <div className="mb-2.5 px-2 flex items-center gap-2">
        <span className="text-base">{grupo.emoji}</span>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{grupo.label}</h2>
        <span className="text-slate-400 dark:text-slate-500 text-xs font-mono tabular-nums">
          {sectionIds.length}
        </span>
      </div>
      <div className="rounded-2xl bg-slate-100 dark:bg-slate-900/40 p-2 space-y-2 min-h-32">
        {sectionIds.map((id) => {
          const data = loadFisioSectionData(id)
          const title = data.specParsed?.title.replace(/ Specification$/, '') ?? id
          const designs = data.screenDesigns
          return (
            <Link
              key={id}
              to={`/fisio/sections/${id}`}
              className="block rounded-xl border border-slate-200 dark:border-slate-800 p-3 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-sm transition-all bg-white dark:bg-slate-900"
            >
              <div className="text-slate-900 dark:text-slate-50 font-semibold text-[13px] leading-tight">
                {title}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 line-clamp-2 leading-snug">
                {data.specParsed?.overview ?? 'Sem spec'}
              </div>
              <div className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-mono tabular-nums">
                {designs.length > 0
                  ? `${designs.length} design${designs.length === 1 ? '' : 's'}`
                  : 'sem designs'}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export function FisioSectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const navigate = useNavigate()
  const [Component, setComponent] = useState<ComponentType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sectionId) return
    setLoading(true)
    const data = loadFisioSectionData(sectionId)
    const first = data.screenDesigns[0]
    if (!first) {
      setLoading(false)
      return
    }
    const loader = loadFisioScreenDesignComponent(sectionId, first.componentName)
    if (!loader) {
      setLoading(false)
      return
    }
    loader().then((mod) => {
      setComponent(() => mod.default)
      setLoading(false)
    })
  }, [sectionId])

  if (!sectionId) return <div className="p-8">Section não especificada</div>

  const data = loadFisioSectionData(sectionId)
  const title = data.specParsed?.title.replace(/ Specification$/, '') ?? sectionId

  return (
    <AppShell
      navigationGroups={NAV_GROUPS}
      activeHref={`/fisio/sections/${sectionId}`}
      user={{ name: 'Roberto Z.', role: 'Fisioterapeuta · CREFITO 3/99999-F' }}
      subBrand="Fisio"
      onNavigate={(href) => navigate(href)}
      onLogout={() => navigate('/fisio')}
    >
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 pl-12 lg:pl-0">
          <Link
            to="/fisio"
            className="text-slate-500 dark:text-slate-400 text-sm hover:underline"
          >
            ← Sections
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-900 dark:text-slate-50 font-semibold">{title}</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          <Stethoscope className="inline w-3 h-3 mr-1" strokeWidth={1.7} />
          Fisio · Web · Desktop
        </span>
      </div>

      <div>
        {loading ? (
          <div className="p-8 text-slate-400 text-sm">Carregando...</div>
        ) : Component ? (
          <Component />
        ) : (
          <div className="p-8 text-slate-400 text-sm">Sem componente para esta section ainda.</div>
        )}
      </div>
    </AppShell>
  )
}
