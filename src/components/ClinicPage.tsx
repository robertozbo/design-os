import { useEffect, useState, type ComponentType } from 'react'
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  getAllClinicSectionIds,
  loadClinicSectionData,
  loadClinicScreenDesignComponent,
} from '@/lib/clinic-section-loader'
import { AppShell } from '@/shell-clinic/components'
import type { ScreenDesignInfo } from '@/types/section'
import {
  NAV_POR_PERSONA,
  PERSONA_DA_SECTION,
  NESTED_UNDER_PACIENTES,
  PERSONA_DO_DESIGN,
  USER_POR_PERSONA,
} from '@/shell-clinic/navs'

// Nav do browser de sections — usa a visão do MÉDICO como default.
function resolveActiveHref(sectionId: string | undefined): string {
  if (!sectionId) return '/clinic'
  if (NESTED_UNDER_PACIENTES.has(sectionId)) {
    return '/clinic/sections/pacientes'
  }
  return `/clinic/sections/${sectionId}`
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
    hint: 'Dia a dia do médico',
    sectionIds: ['inicio', 'agenda', 'pacientes', 'consulta', 'atendimento', 'atendimentos'],
  },
  {
    label: 'Clínico',
    emoji: '📋',
    hint: 'Prontuário compartilhado · exames · receita',
    sectionIds: [
      'prontuario',
      'acompanhamento',
      'exames',
      'prescricao',
      'relatorios-medicos',
      'encaminhamento',
    ],
  },
  {
    label: 'Gestão',
    emoji: '🏥',
    hint: 'Workspace da clínica',
    sectionIds: ['inicio-gestao', 'equipe', 'salas', 'faturamento', 'relatorios'],
  },
  {
    label: 'Financeiro',
    emoji: '💰',
    hint: 'Serviços · convênios · contas · fornecedores',
    sectionIds: [
      'servicos',
      'convenios',
      'fornecedores',
      'contas-receber',
      'contas-pagar',
      'categorias-financeiras',
    ],
  },
  {
    label: 'Operacional',
    emoji: '⚙',
    hint: 'Mensagens · cobrança · config',
    sectionIds: [
      'mensagens',
      'meus-recebimentos',
      'cobranca',
      'configuracoes-medico',
      'configuracoes-clinica',
      'configuracoes-recepcao',
      'perfil',
    ],
  },
  // Coluna própria, e não um card dentro de Operacional: o WhatsApp é o único
  // canal em que a clínica fala com quem AINDA NÃO é paciente. `mensagens` é
  // conversa com quem já tem vínculo (e por isso vive sob a exigência de dois
  // canais isolados do LGPD); aqui é aquisição, e o que sai da tela é fila de
  // pré-agendamento e lead para alguém validar. Misturar os dois faria a
  // Recepção procurar lead dentro da caixa de mensagens clínicas.
  //
  // Nasce com uma section porque é a única que existe hoje. O nome é
  // "Automação" e não "WhatsApp" de propósito — o que agrupa aqui é
  // "a clínica atende sem humano no meio", e é onde entram lembrete automático,
  // confirmação de consulta e a camada de IA que a spec já descreve como V2.
  {
    label: 'Automação',
    emoji: '🤖',
    hint: 'Canais que atendem sem humano no meio',
    sectionIds: ['agendamento-whatsapp'],
  },
]

export function ClinicSectionsPage() {
  const navigate = useNavigate()
  const allIds = getAllClinicSectionIds()
  const allIdsSet = new Set(allIds)
  const idsAgrupados = new Set(GRUPOS.flatMap((g) => g.sectionIds))
  const semGrupo = allIds.filter((id) => !idsAgrupados.has(id))

  return (
    <AppShell
      navigationGroups={NAV_POR_PERSONA.medico}
      activeHref="/clinic"
      user={USER_POR_PERSONA.medico}
      persona="medico"
      onNavigate={(href) => navigate(href)}
      onLogout={() => navigate('/')}
      onProfileClick={() => navigate('/clinic/sections/perfil')}
      onSettingsClick={() => navigate('/clinic/sections/configuracoes-clinica')}
    >
      <div className="p-6 pl-16 lg:pl-6">
        <div className="mb-6">
          <Link to="/" className="text-slate-500 dark:text-slate-400 text-sm hover:underline">
            ← Design OS
          </Link>
          <div className="mt-3 flex items-baseline gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              Clínica · Web
            </h1>
            <span className="text-slate-400 dark:text-slate-500 text-sm font-mono tabular-nums">
              · {allIds.length} section{allIds.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="mt-1 text-slate-500 dark:text-slate-400 text-xs">
            Clínica multi-especialidade · vários médicos, pool compartilhado de pacientes — Nymos
            suite
          </p>
        </div>

        {allIds.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Nenhuma section ainda. Rode <code>/shape-section</code> para começar, ou veja o{' '}
              <Link to="/clinic/shell" className="text-teal-600 hover:underline">
                shell (3 personas)
              </Link>
              .
            </p>
            <p className="mt-2 text-slate-400 dark:text-slate-500 text-xs">
              Specs vivem em <code>product-clinic/sections/</code>.
            </p>
          </div>
        ) : (
          // 6 colunas no xl, não 5: o board é uma leitura de UMA olhada — a coluna que quebra para
          // a segunda linha deixa de ser lida como par das outras e vira "o resto". Ao somar
          // Automação, o `xl:grid-cols-5` empurrava justamente a coluna nova para baixo.
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 items-start">
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
          const data = loadClinicSectionData(id)
          const title = data.specParsed?.title.replace(/ Specification$/, '') ?? id
          const designs = data.screenDesigns
          return (
            <Link
              key={id}
              to={`/clinic/sections/${id}`}
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

/** Design exibido: o do `?design=`, senão o "…Lista", senão o primeiro. */
function resolverDesign(designs: ScreenDesignInfo[], designParam: string | null) {
  return (
    designs.find((s) => s.componentName === designParam) ??
    designs.find((s) => s.componentName.endsWith('Lista')) ??
    designs[0]
  )
}

export function ClinicSectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const designParam = searchParams.get('design')

  const data = sectionId ? loadClinicSectionData(sectionId) : null
  const designs = data?.screenDesigns ?? []
  const activeDesign = resolverDesign(designs, designParam)?.componentName
  const chave = `${sectionId ?? ''}:${activeDesign ?? ''}`
  // Cada section é exibida sob a navegação de quem tem permissão de abri-la: mostrar Faturamento e
  // Contas a pagar na barra do médico ensinaria o RBAC errado a quem for implementar.
  const persona =
    PERSONA_DO_DESIGN[`${sectionId}:${activeDesign}`] ??
    (sectionId && PERSONA_DA_SECTION[sectionId]) ??
    'medico'

  // Guarda a chave junto do componente: enquanto ela não bater com a atual, é "carregando" —
  // assim nunca renderizamos o componente da section anterior sob o header da nova.
  const [carregado, setCarregado] = useState<{
    chave: string
    Component: ComponentType | null
  } | null>(null)

  useEffect(() => {
    let cancelado = false
    const loader =
      sectionId && activeDesign
        ? loadClinicScreenDesignComponent(sectionId, activeDesign)
        : null
    // `Promise.resolve` também no caminho vazio: mantém o setState fora do corpo do efeito.
    const pendente = loader
      ? loader().then((mod) => mod.default as ComponentType)
      : Promise.resolve(null)
    pendente
      .catch(() => null) // import quebrado não pode prender a página em "Carregando..."
      .then((C) => {
        if (!cancelado) setCarregado({ chave, Component: C })
      })
    return () => {
      cancelado = true
    }
  }, [chave, sectionId, activeDesign])

  if (!sectionId || !data) return <div className="p-8">Section não especificada</div>

  const title = data.specParsed?.title.replace(/ Specification$/, '') ?? sectionId
  const loading = carregado?.chave !== chave
  const Component = loading ? null : carregado?.Component ?? null

  return (
    <AppShell
      navigationGroups={NAV_POR_PERSONA[persona]}
      activeHref={resolveActiveHref(sectionId)}
      user={USER_POR_PERSONA[persona]}
      persona={persona}
      onNavigate={(href) => navigate(href)}
      onLogout={() => navigate('/clinic')}
      onProfileClick={() => navigate('/clinic/sections/perfil')}
      onSettingsClick={() => navigate('/clinic/sections/configuracoes-clinica')}
    >
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 pl-12 lg:pl-0">
          <Link to="/clinic" className="text-slate-500 dark:text-slate-400 text-sm hover:underline">
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
