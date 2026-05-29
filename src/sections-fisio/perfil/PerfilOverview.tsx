import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Award,
  Bell,
  Briefcase,
  CalendarRange,
  Check,
  ClipboardList,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Globe2,
  Hash,
  Inbox,
  Languages,
  ListChecks,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  PenTool,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Trash2,
  User,
  X,
} from 'lucide-react'
import initialData from '@/../product-fisio/sections/perfil/data.json'
import type {
  AssinaturaDigital,
  CanalConvite,
  ConfiguracaoPerfilPublico,
  EspecialidadeFisio,
  Identidade,
  IdiomaPreferido,
  Perfil,
  RegistroProfissional,
} from '@/../product-fisio/sections/perfil/types'

const ESPECIALIDADE_LABEL: Record<EspecialidadeFisio, string> = {
  'traumato-ortopedica': 'Traumato-Ortopédica',
  neurologica: 'Neurofuncional',
  respiratoria: 'Respiratória',
  esportiva: 'Esportiva',
  pediatrica: 'Pediátrica',
  geriatrica: 'Geriátrica',
  'dermato-funcional': 'Dermato-Funcional',
  pelvica: 'Saúde da Mulher / Pélvica',
  reumatologica: 'Reumatológica',
  aquatica: 'Aquática',
  outra: 'Outra especialidade',
}

const IDIOMA_LABEL: Record<IdiomaPreferido, string> = {
  pt: 'Português · Brasil',
  en: 'English',
  es: 'Español',
}

const FUSO_OPTIONS = [
  'America/Sao_Paulo',
  'America/Manaus',
  'America/Belem',
  'America/Recife',
  'America/Fortaleza',
  'America/Rio_Branco',
]

const UF_OPTIONS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO',
]

const METODOS_DISPONIVEIS = [
  'Pilates clínico',
  'RPG',
  'McKenzie',
  'Mulligan',
  'Maitland',
  'Dry needling',
  'Manipulação articular',
  'Terapia manual ortopédica',
  'Liberação miofascial',
  'Bobath',
  'Pompage',
  'Crochetagem',
  'Acupuntura',
  'Eletroterapia',
  'Termoterapia',
]

const NUM = new Intl.NumberFormat('pt-BR')
const HOJE = new Date('2026-05-29T12:00:00')

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function diasAteValidade(dataValidade: string): number {
  const validade = new Date(dataValidade + 'T12:00:00')
  return Math.ceil((validade.getTime() - HOJE.getTime()) / (1000 * 60 * 60 * 24))
}

function formatDate(iso: string): string {
  return DATE_FORMATTER.format(new Date(iso + 'T12:00:00'))
}

export default function PerfilOverview() {
  const [perfil, setPerfil] = useState<Perfil>(initialData as unknown as Perfil)
  const [drawerOpen, setDrawerOpen] = useState<false | DrawerTab>(false)

  const { identidade, registrosProfissionais, assinaturaDigital, historicoAtuacao, perfilPublico } = perfil
  const registroPrimario = registrosProfissionais.find((r) => r.primario)
  const hashShort = assinaturaDigital.hashSha256
    ? `${assinaturaDigital.hashSha256.slice(0, 10)}…${assinaturaDigital.hashSha256.slice(-8)}`
    : '—'

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Header */}
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
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                Suas credenciais aparecem em avaliações cinético-funcionais, evoluções SOAP e relatórios de alta que você assina.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen('identidade')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium text-sm shadow-[0_4px_14px_-4px_rgba(20,184,166,0.45)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              <Pencil className="w-4 h-4" strokeWidth={2} />
              Editar perfil
            </button>
          </div>
        </header>

        {/* IDENTIDADE + REGISTROS */}
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
              <span className="inline-flex items-center justify-center w-24 h-24 rounded-2xl shrink-0 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-[28px] font-mono font-semibold ring-1 ring-teal-200/60 dark:ring-teal-900/60">
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
                  <Stethoscope className="w-2.5 h-2.5" strokeWidth={2} />
                  {ESPECIALIDADE_LABEL[identidade.especialidade]}
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ContactRow icon={<Mail className="w-3 h-3" strokeWidth={1.75} />} label="E-mail profissional" mono>
                {identidade.emailCorporativo}
              </ContactRow>
              <ContactRow icon={<Phone className="w-3 h-3" strokeWidth={1.75} />} label="Telefone" mono>
                {identidade.telefone}
              </ContactRow>
              <ContactRow icon={<Languages className="w-3 h-3" strokeWidth={1.75} />} label="Idioma preferido">
                {IDIOMA_LABEL[identidade.idiomaPreferido]}
              </ContactRow>
              <ContactRow icon={<Globe2 className="w-3 h-3" strokeWidth={1.75} />} label="Fuso horário" mono>
                {identidade.fusoHorario}
              </ContactRow>
            </div>
          </div>

          {/* REGISTROS PROFISSIONAIS */}
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
                Registro primário <span className="font-mono">{registroPrimario.numero}</span> é usado por padrão em laudos e relatórios oficiais.
              </p>
            )}
          </div>
        </div>

        {/* ASSINATURA + HISTÓRICO */}
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
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[10px] font-medium ring-1 ring-teal-200/60 dark:ring-teal-900/50">
                  <Sparkles className="w-3 h-3" strokeWidth={2} />
                  ICP-Brasil
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 font-medium">
                  Aparência nos documentos
                </span>
                <div className="mt-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 ring-1 ring-slate-200 dark:ring-slate-700 px-4 py-6 flex items-center justify-center min-h-[110px]">
                  {assinaturaDigital.imagemUrl || assinaturaDigital.hashSha256 ? (
                    <SignaturePlaceholder nome={`${identidade.tratamento} ${identidade.nome}`} />
                  ) : (
                    <span className="text-[12px] text-slate-400">Sem assinatura cadastrada</span>
                  )}
                </div>
                <p className="mt-2 text-[10.5px] text-slate-500 dark:text-slate-400">
                  Resolução COFFITO 516/2020 reconhece assinatura eletrônica em telessaúde fisioterapêutica.
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 font-medium">
                  Identidade verificada
                </span>
                <div className="mt-1.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 ring-1 ring-emerald-200/60 dark:ring-emerald-900/40 px-4 py-3 space-y-2">
                  <div className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-300" strokeWidth={2} />
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
                  {assinaturaDigital.icpCertificadoNome && (
                    <p className="text-[10px] text-emerald-700/70 dark:text-emerald-300/70">
                      Certificado: {assinaturaDigital.icpCertificadoNome}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* HISTÓRICO DE ATUAÇÃO */}
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
                value={NUM.format(historicoAtuacao.pacientesAtivos)}
              />
              <MiniStat
                icon={<ListChecks className="w-3 h-3" strokeWidth={1.75} />}
                label="Sessões"
                value={NUM.format(historicoAtuacao.sessoesRealizadas)}
              />
              <MiniStat
                icon={<ClipboardList className="w-3 h-3" strokeWidth={1.75} />}
                label="Avaliações"
                value={NUM.format(historicoAtuacao.avaliacoesCineticoFuncionais)}
              />
              <MiniStat
                icon={<CalendarRange className="w-3 h-3" strokeWidth={1.75} />}
                label="Anos de prática"
                value={NUM.format(historicoAtuacao.anosDePratica)}
              />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 font-medium">
                Métodos e técnicas
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {historicoAtuacao.metodosDominantes.map((m) => (
                  <span
                    key={m}
                    className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/70 ring-1 ring-slate-200/70 dark:ring-slate-700 text-[10px] text-slate-600 dark:text-slate-400 font-medium"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PERFIL PÚBLICO */}
        <div
          style={{ animationDelay: '360ms' }}
          className="nymos-reveal opacity-0 mt-3 rounded-2xl bg-white/95 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 px-5 py-5"
        >
          <PerfilPublicoSection
            perfilPublico={perfilPublico}
            identidade={identidade}
            anosDePratica={historicoAtuacao.anosDePratica}
            metodos={historicoAtuacao.metodosDominantes}
            onEditar={() => setDrawerOpen('visibilidade')}
          />
        </div>
      </div>

      {drawerOpen && (
        <EditarPerfilDrawer
          perfil={perfil}
          initialTab={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSave={(novo) => {
            setPerfil(novo)
            setDrawerOpen(false)
          }}
        />
      )}
    </div>
  )
}

/* ─────────────────────────────── DRAWER ─────────────────────────────── */

type DrawerTab = 'identidade' | 'registros' | 'assinatura' | 'metodos' | 'visibilidade'

const DRAWER_TABS: { id: DrawerTab; label: string; icon: typeof Briefcase }[] = [
  { id: 'identidade', label: 'Identidade', icon: Briefcase },
  { id: 'registros', label: 'Registros', icon: ShieldCheck },
  { id: 'assinatura', label: 'Assinatura', icon: PenTool },
  { id: 'metodos', label: 'Métodos', icon: Award },
  { id: 'visibilidade', label: 'Visibilidade', icon: Globe },
]

function EditarPerfilDrawer({
  perfil,
  initialTab = 'identidade',
  onClose,
  onSave,
}: {
  perfil: Perfil
  initialTab?: DrawerTab
  onClose: () => void
  onSave: (p: Perfil) => void
}) {
  const [tab, setTab] = useState<DrawerTab>(initialTab)
  const [draft, setDraft] = useState<Perfil>(() => JSON.parse(JSON.stringify(perfil)))

  const isDirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(perfil),
    [draft, perfil],
  )

  const updateIdentidade = (patch: Partial<Identidade>) => {
    setDraft((d) => ({ ...d, identidade: { ...d.identidade, ...patch } }))
  }

  const updateAssinatura = (patch: Partial<AssinaturaDigital>) => {
    setDraft((d) => ({ ...d, assinaturaDigital: { ...d.assinaturaDigital, ...patch } }))
  }

  const updateRegistro = (id: string, patch: Partial<RegistroProfissional>) => {
    setDraft((d) => ({
      ...d,
      registrosProfissionais: d.registrosProfissionais.map((r) =>
        r.id === id ? { ...r, ...patch } : r,
      ),
    }))
  }

  const tornarPrimario = (id: string) => {
    setDraft((d) => ({
      ...d,
      registrosProfissionais: d.registrosProfissionais.map((r) => ({
        ...r,
        primario: r.id === id,
      })),
    }))
  }

  const removerRegistro = (id: string) => {
    setDraft((d) => {
      const restantes = d.registrosProfissionais.filter((r) => r.id !== id)
      const removidoEraPrimario = d.registrosProfissionais.find((r) => r.id === id)?.primario
      if (removidoEraPrimario && restantes.length > 0) {
        restantes[0] = { ...restantes[0], primario: true }
      }
      return { ...d, registrosProfissionais: restantes }
    })
  }

  const adicionarRegistro = () => {
    const novo: RegistroProfissional = {
      id: `reg-${Date.now()}`,
      tipo: 'CREFITO',
      numero: '',
      conselho: 'CREFITO',
      uf: 'SP',
      dataEmissao: new Date().toISOString().slice(0, 10),
      dataValidade: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      primario: draft.registrosProfissionais.length === 0,
    }
    setDraft((d) => ({ ...d, registrosProfissionais: [...d.registrosProfissionais, novo] }))
  }

  const updatePerfilPublico = (patch: Partial<ConfiguracaoPerfilPublico>) => {
    setDraft((d) => ({ ...d, perfilPublico: { ...d.perfilPublico, ...patch } }))
  }

  const toggleCanalConvite = (canal: CanalConvite) => {
    setDraft((d) => {
      const tem = d.perfilPublico.canaisConvite.includes(canal)
      return {
        ...d,
        perfilPublico: {
          ...d.perfilPublico,
          canaisConvite: tem
            ? d.perfilPublico.canaisConvite.filter((c) => c !== canal)
            : [...d.perfilPublico.canaisConvite, canal],
        },
      }
    })
  }

  const toggleMetodo = (m: string) => {
    setDraft((d) => {
      const tem = d.historicoAtuacao.metodosDominantes.includes(m)
      return {
        ...d,
        historicoAtuacao: {
          ...d.historicoAtuacao,
          metodosDominantes: tem
            ? d.historicoAtuacao.metodosDominantes.filter((x) => x !== m)
            : [...d.historicoAtuacao.metodosDominantes, m],
        },
      }
    })
  }

  return (
    <>
      {/* Overlay só cobre a área da main — sidebar (w-60, z-40 no desktop) fica visível e clicável.
          z-30 fica abaixo da sidebar; drawer (z-50) acima de tudo. */}
      <div
        className="fixed inset-y-0 right-0 left-0 z-30 bg-slate-900/50 backdrop-blur-sm dark:bg-slate-950/70 lg:left-60"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-[640px] flex-col bg-white shadow-2xl dark:bg-slate-950">
        {/* Header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="size-1.5 rounded-full bg-teal-500" aria-hidden="true" />
                <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
                  Editar perfil
                </span>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                {draft.identidade.tratamento} {draft.identidade.nome}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Alterações refletem em laudos, evoluções e relatórios.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-1 overflow-x-auto -mx-1 px-1 pb-1">
            {DRAWER_TABS.map((t) => {
              const Icon = t.icon
              const active = t.id === tab
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    active
                      ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:ring-teal-900'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === 'identidade' && (
            <IdentidadeForm
              identidade={draft.identidade}
              onChange={updateIdentidade}
            />
          )}
          {tab === 'registros' && (
            <RegistrosForm
              registros={draft.registrosProfissionais}
              onUpdate={updateRegistro}
              onTornarPrimario={tornarPrimario}
              onRemover={removerRegistro}
              onAdicionar={adicionarRegistro}
            />
          )}
          {tab === 'assinatura' && (
            <AssinaturaForm
              assinatura={draft.assinaturaDigital}
              onChange={updateAssinatura}
            />
          )}
          {tab === 'metodos' && (
            <MetodosForm
              metodos={draft.historicoAtuacao.metodosDominantes}
              onToggle={toggleMetodo}
            />
          )}
          {tab === 'visibilidade' && (
            <VisibilidadeForm
              perfilPublico={draft.perfilPublico}
              onChange={updatePerfilPublico}
              onToggleCanal={toggleCanalConvite}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {isDirty ? (
              <span className="text-amber-700 dark:text-amber-300 font-medium">Alterações não salvas</span>
            ) : (
              'Sem alterações'
            )}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              onClick={() => onSave(draft)}
              disabled={!isDirty}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_14px_-4px_rgba(20,184,166,0.45)] disabled:shadow-none"
            >
              <Sparkles className="w-3.5 h-3.5" strokeWidth={2} />
              Salvar alterações
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─────────── Drawer: Identidade tab ─────────── */
function IdentidadeForm({
  identidade,
  onChange,
}: {
  identidade: Identidade
  onChange: (patch: Partial<Identidade>) => void
}) {
  return (
    <div className="space-y-5">
      <SectionTitle>Apresentação</SectionTitle>
      <div className="grid grid-cols-[80px_1fr] gap-3">
        <Field label="Tratamento">
          <select
            value={identidade.tratamento}
            onChange={(e) => onChange({ tratamento: e.target.value })}
            className={selectClass()}
          >
            <option value="">—</option>
            <option value="Dr.">Dr.</option>
            <option value="Dra.">Dra.</option>
          </select>
        </Field>
        <Field label="Nome completo">
          <input
            type="text"
            value={identidade.nome}
            onChange={(e) => onChange({ nome: e.target.value, iniciais: gerarIniciais(e.target.value) })}
            className={inputClass()}
          />
        </Field>
      </div>
      <Field label="Cargo">
        <input
          type="text"
          value={identidade.cargo}
          onChange={(e) => onChange({ cargo: e.target.value })}
          placeholder="Ex: Fisioterapeuta Traumato-Ortopédico"
          className={inputClass()}
        />
      </Field>
      <Field label="Especialidade">
        <select
          value={identidade.especialidade}
          onChange={(e) => onChange({ especialidade: e.target.value as EspecialidadeFisio })}
          className={selectClass()}
        >
          {(Object.keys(ESPECIALIDADE_LABEL) as EspecialidadeFisio[]).map((k) => (
            <option key={k} value={k}>{ESPECIALIDADE_LABEL[k]}</option>
          ))}
        </select>
      </Field>

      <SectionTitle>Contato</SectionTitle>
      <Field label="E-mail profissional">
        <input
          type="email"
          value={identidade.emailCorporativo}
          onChange={(e) => onChange({ emailCorporativo: e.target.value })}
          className={inputClass({ mono: true })}
        />
      </Field>
      <Field label="Telefone">
        <input
          type="tel"
          value={identidade.telefone}
          onChange={(e) => onChange({ telefone: e.target.value })}
          placeholder="+55 (11) 98765-4321"
          className={inputClass({ mono: true })}
        />
      </Field>

      <SectionTitle>Localização</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Idioma">
          <select
            value={identidade.idiomaPreferido}
            onChange={(e) => onChange({ idiomaPreferido: e.target.value as IdiomaPreferido })}
            className={selectClass()}
          >
            {(Object.keys(IDIOMA_LABEL) as IdiomaPreferido[]).map((k) => (
              <option key={k} value={k}>{IDIOMA_LABEL[k]}</option>
            ))}
          </select>
        </Field>
        <Field label="Fuso horário">
          <select
            value={identidade.fusoHorario}
            onChange={(e) => onChange({ fusoHorario: e.target.value })}
            className={selectClass({ mono: true })}
          >
            {FUSO_OPTIONS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  )
}

/* ─────────── Drawer: Registros tab ─────────── */
function RegistrosForm({
  registros,
  onUpdate,
  onTornarPrimario,
  onRemover,
  onAdicionar,
}: {
  registros: RegistroProfissional[]
  onUpdate: (id: string, patch: Partial<RegistroProfissional>) => void
  onTornarPrimario: (id: string) => void
  onRemover: (id: string) => void
  onAdicionar: () => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <SectionTitle noMargin>Lista de registros</SectionTitle>
        <button
          onClick={onAdicionar}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium"
        >
          <Plus className="w-3 h-3" strokeWidth={2.5} />
          Adicionar
        </button>
      </div>

      {registros.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Nenhum registro cadastrado. Clique em <strong>Adicionar</strong> para começar.
        </div>
      ) : (
        registros.map((reg) => (
          <div
            key={reg.id}
            className={`rounded-xl ring-1 p-3 ${
              reg.primario
                ? 'bg-teal-50/50 dark:bg-teal-950/20 ring-teal-200 dark:ring-teal-900/60'
                : 'bg-slate-50/50 dark:bg-slate-900/40 ring-slate-200 dark:ring-slate-800'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold tracking-wider px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  CREFITO
                </span>
                {reg.primario ? (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-[9px] font-medium uppercase tracking-wider">
                    <Star className="w-2.5 h-2.5 fill-current" strokeWidth={2} />
                    Primário
                  </span>
                ) : (
                  <button
                    onClick={() => onTornarPrimario(reg.id)}
                    className="text-[10px] text-teal-700 dark:text-teal-300 hover:underline font-medium"
                  >
                    Tornar primário
                  </button>
                )}
              </div>
              <button
                onClick={() => onRemover(reg.id)}
                className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                aria-label="Remover"
              >
                <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            </div>
            <div className="grid grid-cols-[1fr_70px] gap-2 mb-2">
              <Field label="Número">
                <input
                  type="text"
                  value={reg.numero}
                  onChange={(e) => onUpdate(reg.id, { numero: e.target.value })}
                  placeholder="3/99999-F"
                  className={inputClass({ mono: true })}
                />
              </Field>
              <Field label="UF">
                <select
                  value={reg.uf}
                  onChange={(e) => onUpdate(reg.id, { uf: e.target.value })}
                  className={selectClass({ mono: true })}
                >
                  {UF_OPTIONS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Emissão">
                <input
                  type="date"
                  value={reg.dataEmissao}
                  onChange={(e) => onUpdate(reg.id, { dataEmissao: e.target.value })}
                  className={inputClass({ mono: true })}
                />
              </Field>
              <Field label="Validade">
                <input
                  type="date"
                  value={reg.dataValidade}
                  onChange={(e) => onUpdate(reg.id, { dataValidade: e.target.value })}
                  className={inputClass({ mono: true })}
                />
              </Field>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

/* ─────────── Drawer: Assinatura tab ─────────── */
function AssinaturaForm({
  assinatura,
  onChange,
}: {
  assinatura: AssinaturaDigital
  onChange: (patch: Partial<AssinaturaDigital>) => void
}) {
  const temAssinatura = !!assinatura.hashSha256

  return (
    <div className="space-y-5">
      <SectionTitle>Assinatura visual</SectionTitle>
      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 ring-1 ring-slate-200 dark:ring-slate-700 px-4 py-6 flex flex-col items-center justify-center min-h-[140px] gap-3">
        {temAssinatura ? (
          <>
            <svg viewBox="0 0 320 80" className="w-full max-w-[260px] h-auto">
              <path
                d="M 18 56 Q 38 22 56 48 T 100 50 Q 118 32 142 56 T 188 46 Q 210 28 232 52 T 280 48 Q 296 38 304 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-700 dark:text-slate-200"
              />
            </svg>
            <div className="flex items-center gap-2">
              <button className="text-[11px] font-medium text-teal-600 dark:text-teal-400 hover:underline">
                Carregar nova
              </button>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <button
                onClick={() =>
                  onChange({ imagemUrl: null, imagemUploadedEm: null, hashSha256: null })
                }
                className="text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:underline"
              >
                Remover
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="text-[12px] text-slate-400">Sem assinatura cadastrada</span>
            <button
              onClick={() =>
                onChange({
                  hashSha256: Array.from({ length: 64 }, () =>
                    '0123456789abcdef'[Math.floor(Math.random() * 16)],
                  ).join(''),
                  imagemUploadedEm: new Date().toISOString(),
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium"
            >
              <Plus className="w-3 h-3" strokeWidth={2.5} />
              Carregar imagem
            </button>
          </>
        )}
      </div>

      <SectionTitle>Certificado ICP-Brasil</SectionTitle>
      <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
        <input
          type="checkbox"
          checked={assinatura.icpBrasilHabilitado}
          onChange={() => onChange({ icpBrasilHabilitado: !assinatura.icpBrasilHabilitado })}
          className="mt-0.5"
        />
        <div className="flex-1">
          <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
            Habilitar assinatura ICP-Brasil
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Necessária para laudos com validade jurídica em telessaúde (COFFITO 516/2020).
          </div>
        </div>
      </label>
      {assinatura.icpBrasilHabilitado && (
        <Field label="Certificado">
          <input
            type="text"
            value={assinatura.icpCertificadoNome ?? ''}
            onChange={(e) => onChange({ icpCertificadoNome: e.target.value || null })}
            placeholder="Ex: Certisign A3 — Token físico"
            className={inputClass()}
          />
        </Field>
      )}
    </div>
  )
}

/* ─────────── Drawer: Métodos tab ─────────── */
function MetodosForm({
  metodos,
  onToggle,
}: {
  metodos: string[]
  onToggle: (m: string) => void
}) {
  return (
    <div className="space-y-3">
      <SectionTitle noMargin>Métodos e técnicas que você domina</SectionTitle>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Aparecem como chips no card "Histórico de atuação" do seu perfil.
      </p>
      <div className="flex flex-wrap gap-1.5 pt-2">
        {METODOS_DISPONIVEIS.map((m) => {
          const ativo = metodos.includes(m)
          return (
            <button
              key={m}
              onClick={() => onToggle(m)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                ativo
                  ? 'bg-teal-600 border-teal-600 text-white'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-300 dark:hover:border-teal-700'
              }`}
            >
              {m}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────── Drawer: Visibilidade tab ─────────── */
function VisibilidadeForm({
  perfilPublico,
  onChange,
  onToggleCanal,
}: {
  perfilPublico: ConfiguracaoPerfilPublico
  onChange: (patch: Partial<ConfiguracaoPerfilPublico>) => void
  onToggleCanal: (c: CanalConvite) => void
}) {
  const ativo = perfilPublico.ativo

  return (
    <div className="space-y-5">
      {/* Master switch */}
      <div
        className={`rounded-xl ring-1 p-4 transition-colors ${
          ativo
            ? 'bg-teal-50/60 ring-teal-200 dark:bg-teal-950/30 dark:ring-teal-900/60'
            : 'bg-slate-50 ring-slate-200 dark:bg-slate-900/40 dark:ring-slate-800'
        }`}
      >
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={ativo}
            onChange={() => onChange({ ativo: !ativo })}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" strokeWidth={2} />
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Aparecer no diretório público
              </span>
              {ativo && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-medium">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Ativo
                </span>
              )}
            </div>
            <p className="text-[12px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Seu perfil aparece em busca de fisioterapeutas no site nymos.app. Pacientes podem ver suas informações e entrar em contato pelos canais que você habilitar abaixo.
            </p>
            {ativo && (
              <div className="mt-2 flex items-center gap-1 text-[11px] font-mono text-teal-700 dark:text-teal-300">
                <ExternalLink className="w-3 h-3" strokeWidth={2} />
                nymos.app/fisio/{perfilPublico.slug || '—'}
              </div>
            )}
          </div>
        </label>
      </div>

      {/* Conteúdo só editável se master switch ativo */}
      <div className={ativo ? '' : 'opacity-50 pointer-events-none select-none'}>
        <SectionTitle>Endereço público</SectionTitle>
        <Field label="Slug (URL pública)">
          <div className="flex items-center gap-1">
            <span className="font-mono text-[12px] text-slate-500 dark:text-slate-400">nymos.app/fisio/</span>
            <input
              type="text"
              value={perfilPublico.slug}
              onChange={(e) =>
                onChange({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })
              }
              placeholder="seu-nome"
              className={inputClass({ mono: true })}
            />
          </div>
        </Field>

        <div className="mt-4">
          <SectionTitle>Bio pública</SectionTitle>
          <Field label="Descrição curta">
            <textarea
              value={perfilPublico.bioPublica}
              onChange={(e) => onChange({ bioPublica: e.target.value.slice(0, 240) })}
              rows={4}
              className={`${inputClass()} resize-none`}
              placeholder="Como você gostaria de se apresentar aos pacientes? (até 240 caracteres)"
            />
            <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-600 font-mono tabular-nums">
              {perfilPublico.bioPublica.length}/240
            </p>
          </Field>
        </div>

        <div className="mt-4">
          <SectionTitle>Localização</SectionTitle>
          <div className="grid grid-cols-[1fr_70px] gap-2">
            <Field label="Cidade">
              <input
                type="text"
                value={perfilPublico.cidade}
                onChange={(e) => onChange({ cidade: e.target.value })}
                className={inputClass()}
              />
            </Field>
            <Field label="UF">
              <select
                value={perfilPublico.uf}
                onChange={(e) => onChange({ uf: e.target.value })}
                className={selectClass({ mono: true })}
              >
                {UF_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="mt-5">
          <SectionTitle>Dados visíveis no card público</SectionTitle>
          <div className="space-y-2 mt-2">
            <VisibilityRow
              icon={<User className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Foto / iniciais"
              ativo={perfilPublico.mostrarFoto}
              onToggle={() => onChange({ mostrarFoto: !perfilPublico.mostrarFoto })}
            />
            <VisibilityRow
              icon={<Stethoscope className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Especialidade"
              ativo={perfilPublico.mostrarEspecialidade}
              onToggle={() =>
                onChange({ mostrarEspecialidade: !perfilPublico.mostrarEspecialidade })
              }
            />
            <VisibilityRow
              icon={<MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Cidade e UF"
              ativo={perfilPublico.mostrarLocalizacao}
              onToggle={() =>
                onChange({ mostrarLocalizacao: !perfilPublico.mostrarLocalizacao })
              }
            />
            <VisibilityRow
              icon={<Award className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Métodos e técnicas"
              ativo={perfilPublico.mostrarMetodos}
              onToggle={() => onChange({ mostrarMetodos: !perfilPublico.mostrarMetodos })}
            />
            <VisibilityRow
              icon={<CalendarRange className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Anos de experiência"
              ativo={perfilPublico.mostrarAnosExperiencia}
              onToggle={() =>
                onChange({ mostrarAnosExperiencia: !perfilPublico.mostrarAnosExperiencia })
              }
            />
          </div>
        </div>

        <div className="mt-5">
          <SectionTitle>Canais de contato visíveis</SectionTitle>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 mb-2">
            Pacientes verão apenas o que você habilitar aqui.
          </p>
          <div className="space-y-2">
            <VisibilityRow
              icon={<Mail className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="E-mail profissional"
              hint="roberto@nymos.app"
              ativo={perfilPublico.mostrarEmail}
              onToggle={() => onChange({ mostrarEmail: !perfilPublico.mostrarEmail })}
            />
            <VisibilityRow
              icon={<Phone className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Telefone"
              hint="+55 (11) 98765-4321"
              ativo={perfilPublico.mostrarTelefone}
              onToggle={() => onChange({ mostrarTelefone: !perfilPublico.mostrarTelefone })}
            />
            <VisibilityRow
              icon={<MessageCircle className="w-3.5 h-3.5" strokeWidth={1.75} />}
              label="Botão WhatsApp"
              hint="Gera link wa.me a partir do telefone"
              ativo={perfilPublico.mostrarWhatsapp}
              onToggle={() => onChange({ mostrarWhatsapp: !perfilPublico.mostrarWhatsapp })}
            />
          </div>
        </div>

        <div className="mt-5">
          <SectionTitle>Receber convites de agendamento</SectionTitle>
          <div className="space-y-3 mt-2">
            <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
              <input
                type="checkbox"
                checked={perfilPublico.receberConvites}
                onChange={() =>
                  onChange({ receberConvites: !perfilPublico.receberConvites })
                }
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-50">
                  <Inbox className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" strokeWidth={2} />
                  Permitir solicitações de agendamento
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Paciente envia uma solicitação com horário desejado, você aprova e a sessão entra na agenda.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
              <input
                type="checkbox"
                checked={perfilPublico.permitirAgendamentoDireto}
                onChange={() =>
                  onChange({
                    permitirAgendamentoDireto: !perfilPublico.permitirAgendamentoDireto,
                  })
                }
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900 dark:text-slate-50">
                  <Sparkles
                    className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400"
                    strokeWidth={2}
                  />
                  Agendamento direto (sem aprovação)
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Paciente reserva direto em horários livres da sua disponibilidade. Mais conveniente, menos controle.
                </p>
              </div>
            </label>

            {perfilPublico.receberConvites && (
              <div>
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                  Receber notificação por
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(
                    [
                      { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                      { id: 'email', label: 'E-mail', icon: Mail },
                      { id: 'app', label: 'No app', icon: Bell },
                    ] as { id: CanalConvite; label: string; icon: typeof Mail }[]
                  ).map((c) => {
                    const ativoC = perfilPublico.canaisConvite.includes(c.id)
                    const Icon = c.icon
                    return (
                      <button
                        key={c.id}
                        onClick={() => onToggleCanal(c.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          ativoC
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-300 dark:hover:border-teal-700'
                        }`}
                      >
                        <Icon className="w-3 h-3" strokeWidth={2} />
                        {c.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function VisibilityRow({
  icon,
  label,
  hint,
  ativo,
  onToggle,
}: {
  icon: React.ReactNode
  label: string
  hint?: string
  ativo: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors text-left ${
        ativo
          ? 'bg-teal-50/50 border-teal-200 dark:bg-teal-950/30 dark:border-teal-900/50'
          : 'bg-slate-50/50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800'
      }`}
    >
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded-md shrink-0 ${
          ativo
            ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
            : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500'
        }`}
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm font-medium ${
            ativo ? 'text-slate-900 dark:text-slate-50' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {label}
        </div>
        {hint && (
          <div className="text-[11px] text-slate-500 dark:text-slate-500 font-mono mt-0.5 truncate">
            {hint}
          </div>
        )}
      </div>
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider shrink-0 ${
          ativo
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
            : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500'
        }`}
      >
        {ativo ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
        {ativo ? 'Visível' : 'Oculto'}
      </span>
    </button>
  )
}

/* ─────────── Overview: Perfil público section ─────────── */
function PerfilPublicoSection({
  perfilPublico,
  identidade,
  anosDePratica,
  metodos,
  onEditar,
}: {
  perfilPublico: ConfiguracaoPerfilPublico
  identidade: Identidade
  anosDePratica: number
  metodos: string[]
  onEditar: () => void
}) {
  const ativo = perfilPublico.ativo

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Esquerda: status + lista de visibilidade */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
              <span className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
                Perfil público
              </span>
              {ativo ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-medium">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Ativo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-medium">
                  Oculto
                </span>
              )}
            </div>
            <h3 className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-50">
              {ativo
                ? 'Pacientes podem te encontrar no nymos.app'
                : 'Seu perfil está oculto do diretório'}
            </h3>
            {ativo && perfilPublico.slug && (
              <a
                href={`https://nymos.app/fisio/${perfilPublico.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-mono text-teal-600 dark:text-teal-400 hover:underline"
              >
                <ExternalLink className="w-3 h-3" strokeWidth={2} />
                nymos.app/fisio/{perfilPublico.slug}
              </a>
            )}
          </div>
          <button
            onClick={onEditar}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 dark:bg-slate-50 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-medium"
          >
            <Pencil className="w-3 h-3" strokeWidth={2.5} />
            Editar
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <VisibilityChip
            icon={<Mail className="w-3 h-3" strokeWidth={2} />}
            label="E-mail"
            visivel={ativo && perfilPublico.mostrarEmail}
          />
          <VisibilityChip
            icon={<Phone className="w-3 h-3" strokeWidth={2} />}
            label="Telefone"
            visivel={ativo && perfilPublico.mostrarTelefone}
          />
          <VisibilityChip
            icon={<MessageCircle className="w-3 h-3" strokeWidth={2} />}
            label="WhatsApp"
            visivel={ativo && perfilPublico.mostrarWhatsapp}
          />
          <VisibilityChip
            icon={<MapPin className="w-3 h-3" strokeWidth={2} />}
            label="Localização"
            visivel={ativo && perfilPublico.mostrarLocalizacao}
          />
          <VisibilityChip
            icon={<Stethoscope className="w-3 h-3" strokeWidth={2} />}
            label="Especialidade"
            visivel={ativo && perfilPublico.mostrarEspecialidade}
          />
          <VisibilityChip
            icon={<Award className="w-3 h-3" strokeWidth={2} />}
            label="Métodos"
            visivel={ativo && perfilPublico.mostrarMetodos}
          />
        </div>

        {ativo && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-[12px]">
              <Inbox
                className={`w-3.5 h-3.5 ${
                  perfilPublico.receberConvites
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-300 dark:text-slate-700'
                }`}
                strokeWidth={2}
              />
              <span className="text-slate-700 dark:text-slate-300">
                {perfilPublico.receberConvites
                  ? 'Recebe convites de agendamento'
                  : 'Não aceita convites'}
              </span>
              {perfilPublico.receberConvites && perfilPublico.canaisConvite.length > 0 && (
                <span className="text-slate-400 dark:text-slate-500">
                  via {perfilPublico.canaisConvite.map((c) => CANAL_LABEL[c]).join(', ')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[12px]">
              <Sparkles
                className={`w-3.5 h-3.5 ${
                  perfilPublico.permitirAgendamentoDireto
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-300 dark:text-slate-700'
                }`}
                strokeWidth={2}
              />
              <span className="text-slate-700 dark:text-slate-300">
                {perfilPublico.permitirAgendamentoDireto
                  ? 'Agendamento direto habilitado'
                  : 'Sem agendamento direto'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Direita: preview do card como aparece no site */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 font-medium mb-2">
          Pré-visualização
        </div>
        <PublicProfilePreview
          identidade={identidade}
          perfilPublico={perfilPublico}
          anosDePratica={anosDePratica}
          metodos={metodos}
        />
      </div>
    </div>
  )
}

const CANAL_LABEL: Record<CanalConvite, string> = {
  whatsapp: 'WhatsApp',
  email: 'e-mail',
  app: 'app',
}

function VisibilityChip({
  icon,
  label,
  visivel,
}: {
  icon: React.ReactNode
  label: string
  visivel: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium ${
        visivel
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900/60'
          : 'bg-slate-100 text-slate-400 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:text-slate-500 dark:ring-slate-700/60'
      }`}
    >
      {icon}
      {label}
      <Check
        className={`w-2.5 h-2.5 ml-auto ${visivel ? 'opacity-100' : 'opacity-30 line-through'}`}
        strokeWidth={3}
      />
    </span>
  )
}

function PublicProfilePreview({
  identidade,
  perfilPublico,
  anosDePratica,
  metodos,
}: {
  identidade: Identidade
  perfilPublico: ConfiguracaoPerfilPublico
  anosDePratica: number
  metodos: string[]
}) {
  const ativo = perfilPublico.ativo

  if (!ativo) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 px-4 py-8 text-center">
        <EyeOff className="w-5 h-5 mx-auto text-slate-400 dark:text-slate-500" strokeWidth={1.75} />
        <p className="mt-2 text-[12px] text-slate-500 dark:text-slate-400">
          Perfil oculto. Ative para aparecer no diretório.
        </p>
      </div>
    )
  }

  const telefoneNumerico = identidade.telefone.replace(/\D/g, '')

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {perfilPublico.mostrarFoto ? (
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-base font-mono font-semibold ring-1 ring-teal-200/60 dark:ring-teal-900/60">
            {identidade.iniciais}
          </span>
        ) : (
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-400">
            <User className="w-5 h-5" strokeWidth={1.75} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-50 leading-tight">
            {identidade.tratamento} {identidade.nome}
          </h4>
          {perfilPublico.mostrarEspecialidade && (
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
              {ESPECIALIDADE_LABEL[identidade.especialidade]}
            </p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-500 dark:text-slate-500">
            {perfilPublico.mostrarLocalizacao && (
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="w-2.5 h-2.5" strokeWidth={2} />
                {perfilPublico.cidade}, {perfilPublico.uf}
              </span>
            )}
            {perfilPublico.mostrarAnosExperiencia && (
              <span className="inline-flex items-center gap-0.5">
                <CalendarRange className="w-2.5 h-2.5" strokeWidth={2} />
                {anosDePratica} anos
              </span>
            )}
          </div>
        </div>
      </div>

      {perfilPublico.bioPublica && (
        <p className="mt-3 text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
          {perfilPublico.bioPublica}
        </p>
      )}

      {perfilPublico.mostrarMetodos && metodos.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {metodos.slice(0, 4).map((m) => (
            <span
              key={m}
              className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400"
            >
              {m}
            </span>
          ))}
          {metodos.length > 4 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 dark:text-slate-500">
              +{metodos.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-1.5">
        {perfilPublico.mostrarWhatsapp && telefoneNumerico && (
          <a
            href={`https://wa.me/${telefoneNumerico}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500 text-white text-[11px] font-medium hover:bg-emerald-600"
          >
            <MessageCircle className="w-3 h-3" strokeWidth={2.5} />
            WhatsApp
          </a>
        )}
        {perfilPublico.mostrarEmail && (
          <a
            href={`mailto:${identidade.emailCorporativo}`}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <Mail className="w-3 h-3" strokeWidth={2.5} />
            E-mail
          </a>
        )}
        {perfilPublico.mostrarTelefone && (
          <a
            href={`tel:${telefoneNumerico}`}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-medium hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <Phone className="w-3 h-3" strokeWidth={2.5} />
            Ligar
          </a>
        )}
        {perfilPublico.permitirAgendamentoDireto ? (
          <button className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-md bg-teal-600 text-white text-[11px] font-medium hover:bg-teal-500">
            <Sparkles className="w-3 h-3" strokeWidth={2.5} />
            Agendar agora
          </button>
        ) : perfilPublico.receberConvites ? (
          <button className="ml-auto inline-flex items-center gap-1 px-2 py-1 rounded-md bg-teal-600 text-white text-[11px] font-medium hover:bg-teal-500">
            <Inbox className="w-3 h-3" strokeWidth={2.5} />
            Solicitar agendamento
          </button>
        ) : null}
      </div>
    </div>
  )
}

/* ─────────── Helpers do drawer ─────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.12em] font-semibold text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}

function SectionTitle({
  children,
  noMargin,
}: {
  children: React.ReactNode
  noMargin?: boolean
}) {
  return (
    <h3
      className={`text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-700 dark:text-slate-300 ${
        noMargin ? '' : 'mt-2'
      }`}
    >
      {children}
    </h3>
  )
}

function inputClass(opts: { mono?: boolean } = {}) {
  return `w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-600 ${
    opts.mono ? 'font-mono tabular-nums' : ''
  }`
}

function selectClass(opts: { mono?: boolean } = {}) {
  return `w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${
    opts.mono ? 'font-mono tabular-nums' : ''
  }`
}

function gerarIniciais(nome: string): string {
  return nome
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

/* ─────────────────────────────── OVERVIEW SUB-COMPONENTES ─────────────────────────────── */

function RegistroRow({ registro }: { registro: RegistroProfissional }) {
  const dias = diasAteValidade(registro.dataValidade)
  const isVencido = dias < 0
  const isProximo = dias >= 0 && dias <= 90

  const validadeTone = isVencido
    ? 'text-rose-700 dark:text-rose-300'
    : isProximo
      ? 'text-amber-700 dark:text-amber-300'
      : 'text-emerald-700 dark:text-emerald-300'

  const validadeIcon = isVencido ? (
    <AlertTriangle className="w-3 h-3" strokeWidth={2} />
  ) : isProximo ? (
    <Clock className="w-3 h-3" strokeWidth={2} />
  ) : (
    <ShieldCheck className="w-3 h-3" strokeWidth={2} />
  )

  return (
    <div
      className={`rounded-xl ring-1 px-3 py-2.5 ${
        registro.primario
          ? 'bg-teal-50/70 dark:bg-teal-950/30 ring-teal-200/60 dark:ring-teal-900/50'
          : 'bg-slate-50/70 dark:bg-slate-800/40 ring-slate-200/60 dark:ring-slate-800'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`inline-flex items-center px-1.5 py-px rounded-md text-[10px] font-mono font-semibold tracking-wider ${
              registro.primario
                ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {registro.tipo}
          </span>
          <span className="text-[13px] font-mono font-semibold text-slate-900 dark:text-slate-50 truncate">
            {registro.numero}
          </span>
          {registro.primario && (
            <span
              title="Registro primário usado por padrão em laudos e relatórios"
              className="inline-flex items-center gap-0.5 px-1 py-px rounded-md bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-[9px] font-medium uppercase tracking-wider"
            >
              <Star className="w-2.5 h-2.5 fill-current" strokeWidth={2} />
              Primário
            </span>
          )}
        </div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono shrink-0">
          {registro.conselho}/{registro.uf}
        </span>
      </div>
      <div className={`inline-flex items-center gap-1 text-[11px] font-medium ${validadeTone}`}>
        {validadeIcon}
        <span>
          {isVencido
            ? `Vencido há ${Math.abs(dias)} dias`
            : isProximo
              ? `Vence em ${dias} dias`
              : `Válido até ${formatDate(registro.dataValidade)}`}
        </span>
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
        <p className={`text-[13px] text-slate-800 dark:text-slate-200 ${mono ? 'font-mono' : ''} truncate`}>
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
