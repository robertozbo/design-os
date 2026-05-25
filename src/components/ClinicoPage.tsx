import { useEffect, useState, type ComponentType } from 'react'
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Calendar,
  ClipboardList,
  FlaskConical,
  Home,
  MessageSquare,
  Pill,
  Settings as SettingsIcon,
  Users,
} from 'lucide-react'
import {
  getAllClinicoSectionIds,
  loadClinicoSectionData,
  loadClinicoScreenDesignComponent,
} from '@/lib/clinico-section-loader'
import { AppShell, type NavGroup } from '@/shell-clinico/components'

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Atendimento',
    items: [
      { label: 'Início', href: '/clinico/sections/inicio', icon: Home },
      { label: 'Agenda', href: '/clinico/sections/agenda', icon: Calendar },
      { label: 'Pacientes', href: '/clinico/sections/pacientes', icon: Users },
    ],
  },
  {
    label: 'Clínico',
    items: [
      { label: 'Atendimentos', href: '/clinico/sections/consultas', icon: ClipboardList },
      { label: 'Exames', href: '/clinico/sections/exames', icon: FlaskConical },
      { label: 'Prescrições', href: '/clinico/sections/prescricao', icon: Pill },
    ],
  },
  {
    label: 'Operacional',
    items: [
      { label: 'Mensagens', href: '/clinico/sections/mensagens', icon: MessageSquare },
      { label: 'Configurações', href: '/clinico/sections/configuracoes-medico', icon: SettingsIcon },
    ],
  },
]

// Sections clínicas que ficam nested dentro de Pacientes — highlight "Pacientes" no nav.
const NESTED_UNDER_PACIENTES = new Set([
  'consulta',
  'prontuario',
])

function resolveActiveHref(sectionId: string | undefined): string {
  if (!sectionId) return '/clinico'
  if (NESTED_UNDER_PACIENTES.has(sectionId)) {
    return '/clinico/sections/pacientes'
  }
  return `/clinico/sections/${sectionId}`
}

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
    hint: 'Dia a dia do consultório',
    sectionIds: ['inicio', 'agenda', 'pacientes', 'consulta'],
  },
  {
    label: 'Clínico',
    emoji: '📋',
    hint: 'Prontuário, exames, receita',
    sectionIds: ['prontuario', 'exames', 'prescricao'],
  },
  {
    label: 'Operacional',
    emoji: '⚙',
    hint: 'Mensagens · cobrança · config',
    sectionIds: ['mensagens', 'cobranca', 'notificacoes', 'perfil', 'configuracoes-medico'],
  },
]

export function ClinicoSectionsPage() {
  const navigate = useNavigate()
  const allIds = getAllClinicoSectionIds()
  const allIdsSet = new Set(allIds)
  const idsAgrupados = new Set(GRUPOS.flatMap((g) => g.sectionIds))
  const semGrupo = allIds.filter((id) => !idsAgrupados.has(id))

  return (
    <AppShell
      navigationGroups={NAV_GROUPS}
      activeHref="/clinico"
      user={{ name: 'Dr. Pedro Lima', role: 'Endocrinologista · CRM 123456-SP' }}
      persona="medico"
      onNavigate={(href) => navigate(href)}
      onLogout={() => navigate('/')}
      onProfileClick={() => navigate('/clinico/sections/perfil')}
      onSettingsClick={() => navigate('/clinico/sections/configuracoes-medico')}
    >
      <div className="p-6 pl-16 lg:pl-6">
        <div className="mb-6">
          <Link to="/" className="text-slate-500 dark:text-slate-400 text-sm hover:underline">
            ← Design OS
          </Link>
          <div className="mt-3 flex items-baseline gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              Clínico · Web
            </h1>
            <span className="text-slate-400 dark:text-slate-500 text-sm font-mono tabular-nums">
              · {allIds.length} section{allIds.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="mt-1 text-slate-500 dark:text-slate-400 text-xs">
            Consultório de endocrinologia (single-doctor + secretária) — Nymos suite
          </p>
        </div>

        {allIds.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              Nenhuma section encontrada. Crie em <code>product-clinico/sections/</code>.
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
          const data = loadClinicoSectionData(id)
          const title = data.specParsed?.title.replace(/ Specification$/, '') ?? id
          const designs = data.screenDesigns
          return (
            <Link
              key={id}
              to={`/clinico/sections/${id}`}
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

export function ClinicoSectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [Component, setComponent] = useState<ComponentType | null>(null)
  const [loading, setLoading] = useState(true)

  const designParam = searchParams.get('design')

  useEffect(() => {
    if (!sectionId) return
    setLoading(true)
    const data = loadClinicoSectionData(sectionId)
    // Default natural: prefere "Lista" (entry point) sobre "Detalhe" quando não há ?design=
    const target =
      data.screenDesigns.find((s) => s.componentName === designParam) ??
      data.screenDesigns.find((s) => s.componentName.endsWith('Lista')) ??
      data.screenDesigns[0]
    if (!target) {
      setLoading(false)
      return
    }
    const loader = loadClinicoScreenDesignComponent(sectionId, target.componentName)
    if (!loader) {
      setLoading(false)
      return
    }
    loader().then((mod) => {
      setComponent(() => mod.default)
      setLoading(false)
    })
  }, [sectionId, designParam])

  if (!sectionId) return <div className="p-8">Section não especificada</div>

  const data = loadClinicoSectionData(sectionId)
  const title = data.specParsed?.title.replace(/ Specification$/, '') ?? sectionId
  const designs = data.screenDesigns
  const activeDesign =
    designs.find((s) => s.componentName === designParam)?.componentName ??
    designs.find((s) => s.componentName.endsWith('Lista'))?.componentName ??
    designs[0]?.componentName

  return (
    <AppShell
      navigationGroups={NAV_GROUPS}
      activeHref={resolveActiveHref(sectionId)}
      user={{ name: 'Dr. Pedro Lima', role: 'Endocrinologista · CRM 123456-SP' }}
      persona="medico"
      onNavigate={(href) => navigate(href)}
      onLogout={() => navigate('/clinico')}
      onProfileClick={() => navigate('/clinico/sections/perfil')}
      onSettingsClick={() => navigate('/clinico/sections/configuracoes-medico')}
    >
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 pl-12 lg:pl-0">
          <Link
            to="/clinico"
            className="text-slate-500 dark:text-slate-400 text-sm hover:underline"
          >
            ← Sections
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-900 dark:text-slate-50 font-semibold">{title}</span>
          {designs.length > 1 && (
            <div className="ml-3 hidden items-center gap-1 sm:flex">
              {designs.map((d) => {
                const ativo = d.componentName === activeDesign
                return (
                  <button
                    key={d.componentName}
                    onClick={() => {
                      const next = new URLSearchParams(searchParams)
                      next.set('design', d.componentName)
                      setSearchParams(next, { replace: true })
                    }}
                    className={`rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors ${
                      ativo
                        ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'
                    }`}
                  >
                    {d.name}
                  </button>
                )
              })}
            </div>
          )}
        </div>
        <span className="text-[11px] font-mono text-slate-400">Web · Desktop</span>
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
