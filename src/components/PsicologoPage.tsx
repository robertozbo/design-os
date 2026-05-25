import { useEffect, useState, type ComponentType } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings as SettingsIcon,
  Target,
  Users,
  Video,
} from 'lucide-react'
import {
  getAllPsicologoSectionIds,
  loadPsicologoSectionData,
  loadPsicologoScreenDesignComponent,
} from '@/lib/psicologo-section-loader'
import { AppShell, type NavGroup } from '@/shell-psicologo/components'

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Atendimento',
    items: [
      { label: 'Dashboard', href: '/psicologo/sections/dashboard', icon: LayoutDashboard },
      { label: 'Pacientes', href: '/psicologo/sections/pacientes', icon: Users },
      { label: 'Sessões', href: '/psicologo/sections/sessoes-finalizadas', icon: FileText },
      { label: 'Nova sessão', href: '/psicologo/sections/sessao', icon: Video },
    ],
  },
  {
    label: 'Clínico',
    items: [
      { label: 'Instrumentos', href: '/psicologo/sections/instrumentos', icon: ClipboardList },
      { label: 'Plano terapêutico', href: '/psicologo/sections/plano-terapeutico', icon: Target },
      { label: 'Prontuário', href: '/psicologo/sections/prontuario', icon: FileText },
    ],
  },
  {
    label: 'Operacional',
    items: [
      { label: 'Perfil', href: '/psicologo/sections/perfil', icon: SettingsIcon },
      { label: 'Configurações', href: '/psicologo/sections/configuracoes', icon: SettingsIcon },
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
    hint: 'Dia a dia clínico',
    sectionIds: ['dashboard', 'pacientes', 'paciente-detail', 'sessoes-finalizadas', 'sessao'],
  },
  {
    label: 'Clínico',
    emoji: '📋',
    hint: 'Plano e instrumentos',
    sectionIds: ['instrumentos', 'plano-terapeutico', 'prontuario'],
  },
  {
    label: 'Operacional',
    emoji: '⚙',
    hint: 'Agenda · finanças · config',
    sectionIds: ['agenda', 'mensagens', 'configuracoes', 'perfil'],
  },
]

export function PsicologoSectionsPage() {
  const navigate = useNavigate()
  const allIds = getAllPsicologoSectionIds()
  const allIdsSet = new Set(allIds)
  const idsAgrupados = new Set(GRUPOS.flatMap((g) => g.sectionIds))
  const semGrupo = allIds.filter((id) => !idsAgrupados.has(id))

  return (
    <AppShell
      navigationGroups={NAV_GROUPS}
      activeHref="/psicologo"
      user={{ name: 'Dra. Marina Silva', role: 'Psicóloga · CRP 06/12345' }}
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
              Psicólogo · Web
            </h1>
            <span className="text-slate-400 dark:text-slate-500 text-sm font-mono tabular-nums">
              · {allIds.length} sections
            </span>
          </div>
          <p className="mt-1 text-slate-500 dark:text-slate-400 text-xs">
            Plataforma de atendimento psicológico — desktop primary
          </p>
        </div>

        {allIds.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400">
              Nenhuma section encontrada. Crie em <code>product-psicologo/sections/</code>.
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
              <Coluna grupo={{ label: 'Outras', emoji: '📦', hint: '', sectionIds: [] }} sectionIds={semGrupo} />
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
          const data = loadPsicologoSectionData(id)
          const title = data.specParsed?.title.replace(/ Specification$/, '') ?? id
          const designs = data.screenDesigns
          return (
            <Link
              key={id}
              to={`/psicologo/sections/${id}`}
              className="block rounded-xl border border-slate-200 dark:border-slate-800 p-3 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-sm transition-all bg-white dark:bg-slate-900"
            >
              <div className="text-slate-900 dark:text-slate-50 font-semibold text-[13px] leading-tight">
                {title}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 line-clamp-2 leading-snug">
                {data.specParsed?.overview ?? 'Sem spec'}
              </div>
              <div className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-mono tabular-nums">
                {designs.length > 0 ? `${designs.length} design${designs.length === 1 ? '' : 's'}` : 'sem designs'}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export function PsicologoSectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const navigate = useNavigate()
  const [Component, setComponent] = useState<ComponentType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sectionId) return
    setLoading(true)
    const data = loadPsicologoSectionData(sectionId)
    const first = data.screenDesigns[0]
    if (!first) {
      setLoading(false)
      return
    }
    const loader = loadPsicologoScreenDesignComponent(sectionId, first.componentName)
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

  const data = loadPsicologoSectionData(sectionId)
  const title = data.specParsed?.title.replace(/ Specification$/, '') ?? sectionId

  return (
    <AppShell
      navigationGroups={NAV_GROUPS}
      activeHref={`/psicologo/sections/${sectionId}`}
      user={{ name: 'Dra. Marina Silva', role: 'Psicóloga · CRP 06/12345' }}
      onNavigate={(href) => navigate(href)}
      onLogout={() => navigate('/psicologo')}
    >
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 pl-12 lg:pl-0">
          <Link
            to="/psicologo"
            className="text-slate-500 dark:text-slate-400 text-sm hover:underline"
          >
            ← Sections
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-900 dark:text-slate-50 font-semibold">{title}</span>
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
