import { useEffect, useMemo, useState, type ComponentType } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Building2, Megaphone, Package } from 'lucide-react'
import {
  getAllAdminSectionIds,
  loadAdminSectionData,
  loadAdminScreenDesignComponent,
} from '@/lib/admin-section-loader'
import { AppShell, type NavGroup } from '@/shell-admin/components'

/**
 * O back-office da Nymos — a plataforma vista por dentro.
 *
 * Não é "mais uma vertical": é o tenant interno. Marketing aparece aqui pelo mesmo
 * motivo que aparece na clínica, e roda o mesmo componente — a Nymos divulga a Nymos
 * com a ferramenta que vende.
 */
const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Negócio',
    items: [
      { label: 'Clientes', href: '/admin/sections/clientes', icon: Building2 },
      { label: 'Módulos', href: '/admin/sections/modulos', icon: Package },
    ],
  },
  {
    label: 'Marketing',
    items: [{ label: 'Publicações', href: '/admin/sections/publicacoes', icon: Megaphone }],
  },
]

const USER = { name: 'Roberto Zboralski', role: 'Nymos · Plataforma' }

interface Grupo {
  label: string
  emoji: string
  hint: string
  sectionIds: string[]
}

const GRUPOS: Grupo[] = [
  {
    label: 'Negócio',
    emoji: '🏢',
    hint: 'Quem usa e o que contrata',
    sectionIds: ['clientes', 'modulos'],
  },
  {
    label: 'Marketing',
    emoji: '📣',
    hint: 'O mesmo módulo que vendemos',
    sectionIds: ['publicacoes'],
  },
]

export function AdminSectionsPage() {
  const navigate = useNavigate()
  const allIds = getAllAdminSectionIds()
  const allIdsSet = new Set(allIds)
  const agrupados = new Set(GRUPOS.flatMap((g) => g.sectionIds))
  const semGrupo = allIds.filter((id) => !agrupados.has(id))

  return (
    <AppShell
      navigationGroups={NAV_GROUPS}
      activeHref="/admin"
      user={USER}
      onNavigate={(href) => navigate(href)}
      onLogout={() => navigate('/')}
    >
      <div className="p-6 pl-16 lg:pl-6">
        <div className="mb-6">
          <Link to="/" className="text-sm text-slate-500 hover:underline dark:text-slate-400">
            ← Design OS
          </Link>
          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              Nymos · Back-office
            </h1>
            <span className="font-mono text-sm tabular-nums text-slate-400 dark:text-slate-500">
              · {allIds.length} sections
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            A plataforma por dentro — clientes, módulos contratados e o workspace interno
          </p>
        </div>

        {allIds.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 p-8 text-center dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              Nenhuma section encontrada. Crie em <code>product-admin/sections/</code>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-2 md:grid-cols-2 xl:grid-cols-3">
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
      <div className="mb-2.5 flex items-center gap-2 px-2">
        <span className="text-base">{grupo.emoji}</span>
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">{grupo.label}</h2>
        <span className="font-mono text-xs tabular-nums text-slate-400 dark:text-slate-500">
          {sectionIds.length}
        </span>
      </div>
      <div className="min-h-32 space-y-2 rounded-2xl bg-slate-100 p-2 dark:bg-slate-900/40">
        {sectionIds.map((id) => {
          const data = loadAdminSectionData(id)
          const title = data.specParsed?.title.replace(/ Specification$/, '') ?? id
          return (
            <Link
              key={id}
              to={`/admin/sections/${id}`}
              className="block rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-teal-500 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-500"
            >
              <div className="text-[13px] font-semibold leading-tight text-slate-900 dark:text-slate-50">
                {title}
              </div>
              <div className="mt-1 line-clamp-2 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                {data.specParsed?.overview ?? 'Sem spec'}
              </div>
              <div className="mt-2 font-mono text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
                {data.screenDesigns.length > 0
                  ? `${data.screenDesigns.length} design${data.screenDesigns.length === 1 ? '' : 's'}`
                  : 'sem designs'}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export function AdminSectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const navigate = useNavigate()

  if (!sectionId) return <div className="p-8">Section não especificada</div>

  const data = loadAdminSectionData(sectionId)
  const title = data.specParsed?.title.replace(/ Specification$/, '') ?? sectionId

  return (
    <AppShell
      navigationGroups={NAV_GROUPS}
      activeHref={`/admin/sections/${sectionId}`}
      user={USER}
      onNavigate={(href) => navigate(href)}
      onLogout={() => navigate('/admin')}
    >
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center gap-3 pl-12 lg:pl-0">
          <Link to="/admin" className="text-sm text-slate-500 hover:underline dark:text-slate-400">
            ← Sections
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="font-semibold text-slate-900 dark:text-slate-50">{title}</span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">Web · Desktop</span>
      </div>

      {/* `key` remonta ao trocar de section: o carregamento do design é do mount, e sem
          isso a tela anterior continuaria montada enquanto a nova carrega. */}
      <Design key={sectionId} sectionId={sectionId} />
    </AppShell>
  )
}

function Design({ sectionId }: { sectionId: string }) {
  // O loader é derivado do id, então sai do render — não de um efeito. Assim não há
  // estado de "loading" para ligar e desligar: ou existe componente a carregar, ou não.
  const loader = useMemo(() => {
    const data = loadAdminSectionData(sectionId)
    const first = data.screenDesigns[0]
    return first ? loadAdminScreenDesignComponent(sectionId, first.componentName) : null
  }, [sectionId])

  const [Component, setComponent] = useState<ComponentType | null>(null)

  useEffect(() => {
    if (!loader) return
    let vivo = true
    loader().then((mod) => {
      if (vivo) setComponent(() => mod.default)
    })
    return () => {
      vivo = false
    }
  }, [loader])

  if (!loader)
    return <div className="p-8 text-sm text-slate-400">Sem componente para esta section ainda.</div>
  if (!Component) return <div className="p-8 text-sm text-slate-400">Carregando...</div>
  return <Component />
}
