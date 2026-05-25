import { useEffect, useState, type ComponentType, type ReactNode } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { MobileFrame } from './MobileFrame'
import {
  getAllMobileSectionIds,
  loadMobileSectionData,
  loadMobileScreenDesignComponent,
} from '@/lib/mobile-section-loader'

interface SubPageConfig {
  title: string
  subtitle?: string
  rightAction?: 'novo-dispositivo' | 'search-and-add' | null
  /** Tab pages don't show back button (they're top-level navigation) */
  isTabPage?: boolean
}

const SUB_PAGE_CONFIG: Record<string, SubPageConfig> = {
  // Sub-pages (back arrow visible)
  dispositivos: {
    title: 'Dispositivos',
    subtitle: 'Maio 2026',
    rightAction: 'search-and-add',
  },
  atividades: {
    title: 'Atividades',
    subtitle: 'Maio 2026',
    rightAction: 'search-and-add',
  },
  nutricao: {
    title: 'Nutrição',
    subtitle: 'Diário do dia',
    rightAction: 'search-and-add',
  },
  ia: {
    title: 'IA',
    subtitle: 'Análise inteligente',
  },
  'chat-ia': {
    title: 'Conversar com Nymos',
    subtitle: 'Chat IA',
  },
  'minha-saude': {
    title: 'Minha Saúde',
    subtitle: 'Score, análises e evolução',
  },
  treinos: {
    title: 'Treinos',
    subtitle: 'Hoje · Quarta',
    rightAction: 'search-and-add',
  },
  mais: {
    title: 'Mais',
    isTabPage: true,
  },
  perfil: {
    title: 'Perfil',
    subtitle: 'Dados pessoais',
  },
  profissionais: {
    title: 'Profissionais',
    subtitle: 'Vinculados e convites',
  },
  'saude-mental': {
    title: 'Saúde Mental',
    subtitle: 'Chat e diário emocional',
  },
  medicacao: {
    title: 'Medicação',
    subtitle: 'Prescrição, doses do dia e adesão',
  },
  exames: {
    title: 'Exames',
    subtitle: 'Laudos, extração IA e histórico',
    rightAction: 'search-and-add',
  },
  plano: {
    title: 'Plano',
    subtitle: 'Assinatura e pagamentos',
  },
  upgrade: {
    title: 'Upgrade',
    subtitle: 'Checkout Stripe',
  },
  'plano-expirado': {
    title: 'Plano Expirado',
    subtitle: 'Tela pós-login',
  },
  configuracoes: {
    title: 'Configurações',
    subtitle: 'Preferências e tema',
  },
  login: {
    title: 'Login',
    subtitle: 'Entrar na conta',
  },
  signup: {
    title: 'Cadastro',
    subtitle: 'Nova conta',
  },
  'recuperar-senha': {
    title: 'Recuperar Senha',
    subtitle: 'Esqueci minha senha',
  },
  welcome: {
    title: 'Welcome',
    subtitle: 'Pós-login splash',
  },
  onboarding: {
    title: 'Onboarding',
    subtitle: 'Chat questionnaire',
  },
  'onboarding-completo': {
    title: 'Onboarding Completo',
    subtitle: 'Migração e redirect',
  },
  // Tab pages (no back arrow — top-level navigation)
  metricas: {
    title: 'Métricas',
    subtitle: 'Suas medidas no detalhe',
    rightAction: 'search-and-add',
  },
  objetivos: {
    title: 'Objetivos',
    subtitle: 'Onde você quer chegar',
    rightAction: 'search-and-add',
  },
}

interface Grupo {
  label: string
  emoji: string
  hint: string
  sectionIds: string[]
}

const GRUPOS: Grupo[] = [
  {
    label: 'Auth',
    emoji: '🔐',
    hint: 'Login Google',
    sectionIds: ['login', 'signup', 'recuperar-senha'],
  },
  {
    label: 'Onboarding',
    emoji: '👋',
    hint: 'Welcome → Chat → Migração',
    sectionIds: ['welcome', 'onboarding', 'onboarding-completo'],
  },
  {
    label: 'Início',
    emoji: '🏠',
    hint: 'Dashboard e fluxos diários',
    sectionIds: ['inicio', 'treinos', 'atividades', 'nutricao', 'minha-saude'],
  },
  {
    label: 'Métricas',
    emoji: '📊',
    hint: 'Tab Métricas',
    sectionIds: ['metricas'],
  },
  {
    label: 'Objetivos',
    emoji: '🎯',
    hint: 'Tab Objetivos',
    sectionIds: ['objetivos'],
  },
  {
    label: 'IA',
    emoji: '✨',
    hint: 'Hub de IA + chat',
    sectionIds: ['ia', 'chat-ia'],
  },
  {
    label: 'Mais',
    emoji: '⚙',
    hint: 'Conta, perfil, configurações',
    sectionIds: ['mais', 'perfil', 'profissionais', 'saude-mental', 'medicacao', 'configuracoes', 'dispositivos'],
  },
  {
    label: 'Plano',
    emoji: '💳',
    hint: 'Assinatura, upgrade e bloqueios',
    sectionIds: ['plano', 'upgrade', 'plano-expirado'],
  },
]

export function MobileSectionsPage() {
  const allIds = getAllMobileSectionIds()
  const allIdsSet = new Set(allIds)
  const idsAgrupados = new Set(GRUPOS.flatMap((g) => g.sectionIds))
  const semGrupo = allIds.filter((id) => !idsAgrupados.has(id))

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 p-4">
      <div className="mb-6 px-2">
        <Link to="/" className="text-stone-500 dark:text-stone-400 text-sm hover:underline">
          ← Voltar
        </Link>
        <div className="mt-3 flex items-baseline gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-50">
            Mobile · App Paciente
          </h1>
          <span className="text-stone-400 dark:text-stone-500 text-sm font-mono tabular-nums">
            · {allIds.length} sections
          </span>
        </div>
        <p className="mt-1 text-stone-500 dark:text-stone-400 text-xs">
          Agrupadas pela tab onde vivem no app · iPhone 390×844
        </p>
      </div>

      {allIds.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 dark:border-stone-800 p-8 text-center">
          <p className="text-stone-500 dark:text-stone-400">
            Nenhuma section mobile encontrada. Crie em <code>product-mobile/sections/</code>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-8 gap-2 items-start">
          {GRUPOS.map((grupo) => {
            const ids = grupo.sectionIds.filter((id) => allIdsSet.has(id))
            if (ids.length === 0) return null
            return <Coluna key={grupo.label} grupo={grupo} sectionIds={ids} />
          })}
          {semGrupo.length > 0 && (
            <Coluna
              grupo={{ label: 'Outras', emoji: '📦', hint: 'Sem grupo', sectionIds: [] }}
              sectionIds={semGrupo}
            />
          )}
        </div>
      )}
    </div>
  )
}

function Coluna({ grupo, sectionIds }: { grupo: Grupo; sectionIds: string[] }) {
  return (
    <section className="min-w-0">
      <div className="mb-2.5 px-2 flex items-center gap-2">
        <span className="text-base">{grupo.emoji}</span>
        <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-50">{grupo.label}</h2>
        <span className="text-stone-400 dark:text-stone-500 text-xs font-mono tabular-nums">
          {sectionIds.length}
        </span>
      </div>
      <div className="rounded-2xl bg-stone-100 dark:bg-stone-900/40 p-2 space-y-2 min-h-32">
        {sectionIds.map((id) => {
          const data = loadMobileSectionData(id)
          const title = data.specParsed?.title.replace(/ Specification$/, '') ?? id
          const designs = data.screenDesigns
          return (
            <Link
              key={id}
              to={`/mobile/sections/${id}`}
              className="block rounded-xl border border-stone-200 dark:border-stone-800 p-3 hover:border-teal-500 dark:hover:border-teal-500 hover:shadow-sm transition-all bg-white dark:bg-stone-900"
            >
              <div className="text-stone-900 dark:text-stone-50 font-semibold text-[13px] leading-tight">
                {title}
              </div>
              <div className="text-stone-500 dark:text-stone-400 text-[11px] mt-1 line-clamp-2 leading-snug">
                {data.specParsed?.overview ?? 'Sem spec'}
              </div>
              <div className="mt-2 text-[10px] text-stone-400 dark:text-stone-500 font-mono tabular-nums">
                {designs.length > 0 ? `${designs.length} design${designs.length === 1 ? '' : 's'}` : 'sem designs'}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export function MobileSectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const [Component, setComponent] = useState<ComponentType | null>(null)
  const [loading, setLoading] = useState(true)
  const [overlay, setOverlay] = useState<ReactNode | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setOverlay(detail?.node ?? null)
    }
    window.addEventListener('nymos:set-overlay', handler)
    return () => window.removeEventListener('nymos:set-overlay', handler)
  }, [])

  useEffect(() => {
    if (!sectionId) return
    setLoading(true)
    const data = loadMobileSectionData(sectionId)
    const first = data.screenDesigns[0]
    if (!first) {
      setLoading(false)
      return
    }
    const loader = loadMobileScreenDesignComponent(sectionId, first.componentName)
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

  const data = loadMobileSectionData(sectionId)
  const title = data.specParsed?.title.replace(/ Specification$/, '') ?? sectionId

  // Map sectionId to active tab
  const tabMap: Record<string, 'metricas' | 'objetivos' | 'inicio' | 'ia' | 'mais'> = {
    inicio: 'inicio',
    metricas: 'metricas',
    objetivos: 'objetivos',
    ia: 'ia',
    'chat-ia': 'ia',
    mais: 'mais',
    dispositivos: 'mais',
    atividades: 'inicio',
    nutricao: 'inicio',
    'minha-saude': 'mais',
    treinos: 'inicio',
    medicacao: 'inicio',
    perfil: 'mais',
    profissionais: 'mais',
    plano: 'mais',
    upgrade: 'mais',
    'plano-expirado': 'mais',
    configuracoes: 'mais',
    welcome: 'inicio',
    onboarding: 'inicio',
    'onboarding-completo': 'inicio',
    login: 'inicio',
    signup: 'inicio',
    'recuperar-senha': 'inicio',
  }
  const activeTab = tabMap[sectionId] ?? 'inicio'

  const subPageConfig = SUB_PAGE_CONFIG[sectionId]
  let subPageRightAction: ReactNode = null
  if (subPageConfig?.rightAction === 'novo-dispositivo') {
    subPageRightAction = (
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('nymos:open-novo-dispositivo'))}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-teal-500/60 text-teal-300 hover:bg-teal-500/10 text-[12.5px] font-medium"
      >
        <Plus size={13} strokeWidth={2.4} />
        Novo
      </button>
    )
  } else if (subPageConfig?.rightAction === 'search-and-add') {
    subPageRightAction = (
      <>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('nymos:open-search'))}
          className="w-9 h-9 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:text-white"
          aria-label="Buscar"
        >
          <Search size={15} />
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('nymos:open-add'))}
          className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white hover:bg-teal-400"
          aria-label="Adicionar"
        >
          <Plus size={16} strokeWidth={2.4} />
        </button>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900">
      <div className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/mobile" className="text-stone-500 dark:text-stone-400 text-sm hover:underline">
            ← Mobile
          </Link>
          <span className="text-stone-300 dark:text-stone-700">/</span>
          <span className="text-stone-900 dark:text-stone-50 font-semibold">{title}</span>
        </div>
        <span className="text-[11px] font-mono text-stone-400">390 × 844</span>
      </div>

      <MobileFrame
        activeTab={activeTab}
        primeiroNome={(data.data?.usuario as { primeiroNome?: string } | undefined)?.primeiroNome ?? 'Roberto'}
        avatarInicial={(data.data?.usuario as { avatarInicial?: string } | undefined)?.avatarInicial ?? 'R'}
        fotoUrl={(data.data?.usuario as { fotoUrl?: string | null } | undefined)?.fotoUrl ?? null}
        notificacoesNaoLidas={
          (data.data?.usuario as { notificacoesNaoLidas?: number } | undefined)?.notificacoesNaoLidas ?? 0
        }
        wearableConectado={
          (data.data?.usuario as { wearableConectado?: boolean } | undefined)?.wearableConectado ?? true
        }
        subPageTitle={subPageConfig?.title}
        subPageSubtitle={subPageConfig?.subtitle}
        subPageRightAction={subPageRightAction}
        hideBackButton={subPageConfig?.isTabPage}
        overlay={overlay}
      >
        {loading ? (
          <div className="p-6 text-slate-400 text-sm">Carregando...</div>
        ) : Component ? (
          <Component />
        ) : (
          <div className="p-6 text-slate-400 text-sm">Sem componente para esta section ainda.</div>
        )}
      </MobileFrame>
    </div>
  )
}
