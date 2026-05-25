import { useState } from 'react'
import {
  Apple,
  Dumbbell,
  Stethoscope,
  Brain,
  ChevronRight,
  Check,
  X,
  Plus,
  Calendar,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import {
  escopoDefaultPara,
  type CodigoProfissional,
  type ConviteRecebido,
  type ConviteEnviado,
  type EscopoCompartilhamento,
  type ProfissionaisAba,
  type ProfissionaisProps,
  type ProfissionalBase,
  type ProfissionalVinculado,
  type TipoProfissional,
} from '@/../product-mobile/sections/profissionais/types'
import { AdicionarProfissional } from './AdicionarProfissional'
import { PermissoesCompartilhamento } from './PermissoesCompartilhamento'

const TIPO_VISUAL: Record<TipoProfissional, { icon: LucideIcon; bg: string; text: string; label: string }> = {
  nutricionista: { icon: Apple, bg: 'bg-emerald-500/15', text: 'text-emerald-300', label: 'Nutri' },
  personal: { icon: Dumbbell, bg: 'bg-teal-500/15', text: 'text-teal-300', label: 'Personal' },
  medico: { icon: Stethoscope, bg: 'bg-sky-500/15', text: 'text-sky-300', label: 'Médico' },
  psicologo: { icon: Brain, bg: 'bg-violet-500/15', text: 'text-violet-300', label: 'Psicólogo' },
}

function formatDataBR(iso: string): string {
  const [date] = iso.split('T')
  const [y, m, d] = date.split('-')
  return `${d}/${m}/${y}`
}

function formatHora(iso: string): string {
  if (!iso.includes('T')) return ''
  const time = iso.split('T')[1].slice(0, 5)
  return time
}

export function Profissionais({
  data,
  abaInicial = 'vinculados',
  onProfClick,
  onChat,
  onDesvincular,
  onAceitarConvite,
  onRecusarConvite,
  onCancelarConviteEnviado,
  onConvidarNovo,
  onAtualizarEscopo,
  onVincularPorCodigo,
}: ProfissionaisProps) {
  const [aba, setAba] = useState<ProfissionaisAba>(abaInicial)
  const totalConvites = data.convitesRecebidos.length + data.convitesEnviados.length

  // Estado do modal de permissões — 3 origens possíveis (aceite, edição, código)
  const [permissoes, setPermissoes] = useState<
    | { modo: 'aceite'; convite: ConviteRecebido }
    | { modo: 'edicao'; vinculado: ProfissionalVinculado }
    | { modo: 'codigo'; match: CodigoProfissional }
    | null
  >(null)

  const [adicionarAberto, setAdicionarAberto] = useState(false)

  const handleAceitarConvite = (conviteId: string) => {
    const convite = data.convitesRecebidos.find((c) => c.id === conviteId)
    if (convite) setPermissoes({ modo: 'aceite', convite })
  }

  const handleEditarPermissoes = (profId: string) => {
    const vinc = data.vinculados.find((v) => v.prof.id === profId)
    if (vinc) setPermissoes({ modo: 'edicao', vinculado: vinc })
  }

  const handleAbrirAdicionar = () => {
    setAdicionarAberto(true)
    onConvidarNovo?.()
  }

  const handleContinuarCodigo = (match: CodigoProfissional) => {
    setAdicionarAberto(false)
    setPermissoes({ modo: 'codigo', match })
  }

  const handleConfirmarPermissoes = (escopo: EscopoCompartilhamento) => {
    if (!permissoes) return
    if (permissoes.modo === 'aceite') {
      onAceitarConvite?.(permissoes.convite.id, escopo)
    } else if (permissoes.modo === 'edicao') {
      onAtualizarEscopo?.(permissoes.vinculado.prof.id, escopo)
    } else if (permissoes.modo === 'codigo') {
      onVincularPorCodigo?.(permissoes.match.codigo, escopo)
    }
    setPermissoes(null)
  }

  return (
    <div className="min-h-full bg-slate-950 pb-6">
      <div className="px-4 pt-3 pb-2 flex gap-1.5">
        <TabButton
          label="Vinculados"
          counter={data.vinculados.length}
          active={aba === 'vinculados'}
          onClick={() => setAba('vinculados')}
        />
        <TabButton
          label="Convites"
          counter={totalConvites}
          highlight={data.convitesRecebidos.length > 0}
          active={aba === 'convites'}
          onClick={() => setAba('convites')}
        />
      </div>

      {aba === 'vinculados' && (
        <VinculadosTab
          vinculados={data.vinculados}
          onProfClick={onProfClick}
          onChat={onChat}
          onDesvincular={onDesvincular}
          onConvidarNovo={handleAbrirAdicionar}
          onEditarPermissoes={handleEditarPermissoes}
        />
      )}

      {aba === 'convites' && (
        <ConvitesTab
          recebidos={data.convitesRecebidos}
          enviados={data.convitesEnviados}
          onAceitar={handleAceitarConvite}
          onRecusar={onRecusarConvite}
          onCancelar={onCancelarConviteEnviado}
          onConvidarNovo={handleAbrirAdicionar}
        />
      )}

      {/* Modal de adicionar profissional por código */}
      <AdicionarProfissional
        open={adicionarAberto}
        codigosDisponiveis={data.codigosDisponiveis ?? []}
        onClose={() => setAdicionarAberto(false)}
        onContinuar={handleContinuarCodigo}
      />

      {/* Modal de permissões */}
      {permissoes && (
        <PermissoesCompartilhamento
          prof={
            permissoes.modo === 'aceite'
              ? permissoes.convite.prof
              : permissoes.modo === 'edicao'
                ? permissoes.vinculado.prof
                : permissoes.match.prof
          }
          modo={permissoes.modo === 'edicao' ? 'edicao' : 'aceite'}
          escopoAtual={
            permissoes.modo === 'edicao'
              ? (permissoes.vinculado.escopo ??
                escopoDefaultPara(permissoes.vinculado.prof.tipo))
              : undefined
          }
          open={!!permissoes}
          onCancelar={() => setPermissoes(null)}
          onConfirmar={handleConfirmarPermissoes}
        />
      )}
    </div>
  )
}

interface TabButtonProps {
  label: string
  counter: number
  active: boolean
  highlight?: boolean
  onClick: () => void
}

function TabButton({ label, counter, active, highlight, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 h-9 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1.5 ${
        active ? 'bg-slate-800 text-slate-50' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {label}
      {counter > 0 && (
        <span
          className={`min-w-4 h-4 px-1 rounded-full text-[9.5px] font-bold flex items-center justify-center font-mono tabular-nums ${
            highlight ? 'bg-rose-500 text-white' : active ? 'bg-slate-950 text-slate-300' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {counter}
        </span>
      )}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface VinculadosTabProps {
  vinculados: ProfissionalVinculado[]
  onProfClick?: (id: string) => void
  onChat?: (id: string) => void
  onDesvincular?: (id: string) => void
  onConvidarNovo?: () => void
  onEditarPermissoes?: (profId: string) => void
}

function VinculadosTab({
  vinculados,
  onProfClick,
  onConvidarNovo,
  onEditarPermissoes,
}: VinculadosTabProps) {
  return (
    <div className="px-4 pt-2 pb-6 space-y-2.5">
      {vinculados.length === 0 ? (
        <EmptyState
          titulo="Nenhum profissional vinculado"
          descricao="Convide um nutri, personal, médico ou psicólogo pra te acompanhar."
          onConvidar={onConvidarNovo}
        />
      ) : (
        <>
          {vinculados.map((v) => (
            <VinculadoCard
              key={v.prof.id}
              vinculado={v}
              onClick={onProfClick}
              onEditarPermissoes={onEditarPermissoes}
            />
          ))}
          <button
            onClick={onConvidarNovo}
            className="w-full h-12 rounded-2xl border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-[12.5px] font-medium flex items-center justify-center gap-1.5"
          >
            <Plus size={13} strokeWidth={2.4} />
            Convidar profissional
          </button>
        </>
      )}
    </div>
  )
}

interface VinculadoCardProps {
  vinculado: ProfissionalVinculado
  onClick?: (id: string) => void
  onEditarPermissoes?: (profId: string) => void
}

function VinculadoCard({ vinculado, onClick, onEditarPermissoes }: VinculadoCardProps) {
  const { prof } = vinculado
  const visual = TIPO_VISUAL[prof.tipo]
  const Icon = visual.icon
  const escopo = vinculado.escopo
  const compartilhadasCount = escopo
    ? Object.values(escopo).filter(Boolean).length
    : null

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden">
      <button
        onClick={() => onClick?.(prof.id)}
        className="w-full p-3.5 flex items-center gap-3 text-left"
      >
        <ProfAvatar prof={prof} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-100 font-semibold text-[13px] truncate">{prof.fullName}</span>
            {vinculado.status === 'ativo' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" aria-label="ativo" />
            )}
          </div>
          <div className="text-slate-500 text-[10.5px] truncate mt-0.5">{prof.especialidade}</div>
          <div className="flex items-center gap-2.5 mt-1.5 text-[10px] text-slate-500">
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${visual.bg} ${visual.text} font-semibold uppercase tracking-wider text-[9px]`}>
              <Icon size={9} strokeWidth={2.4} />
              {visual.label}
            </span>
            {vinculado.ultimaInteracao && (
              <span className="font-mono tabular-nums">· {vinculado.ultimaInteracao}</span>
            )}
            {vinculado.proximoAgendamento && (
              <span className="flex items-center gap-0.5 text-teal-300 font-mono tabular-nums">
                <Calendar size={9} />
                {formatDataBR(vinculado.proximoAgendamento)} {formatHora(vinculado.proximoAgendamento)}
              </span>
            )}
          </div>
        </div>
        <ChevronRight size={13} className="text-slate-600 shrink-0" />
      </button>

      {onEditarPermissoes && (
        <button
          onClick={() => onEditarPermissoes(prof.id)}
          className="w-full px-3.5 py-2 border-t border-slate-800/80 flex items-center justify-between text-[11.5px] text-slate-400 hover:bg-slate-800/40 active:scale-[0.99]"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={11} className="text-teal-300" />
            Permissões de compartilhamento
          </span>
          <span className="font-mono tabular-nums text-[10.5px] text-slate-500">
            {compartilhadasCount !== null ? `${compartilhadasCount} ativas` : 'configurar'}
          </span>
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface ConvitesTabProps {
  recebidos: ConviteRecebido[]
  enviados: ConviteEnviado[]
  onAceitar?: (id: string) => void
  onRecusar?: (id: string) => void
  onCancelar?: (id: string) => void
  onConvidarNovo?: () => void
}

function ConvitesTab({ recebidos, enviados, onAceitar, onRecusar, onCancelar, onConvidarNovo }: ConvitesTabProps) {
  if (recebidos.length === 0 && enviados.length === 0) {
    return (
      <div className="px-4 pt-2 pb-6">
        <EmptyState
          titulo="Sem convites pendentes"
          descricao="Quando você convidar um profissional ou alguém te convidar, aparece aqui."
          onConvidar={onConvidarNovo}
        />
      </div>
    )
  }

  return (
    <div className="px-4 pt-2 pb-6 space-y-5">
      {recebidos.length > 0 && (
        <div>
          <div className="text-rose-300 text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            Recebidos · {recebidos.length}
          </div>
          <div className="space-y-2.5">
            {recebidos.map((c) => (
              <ConviteRecebidoCard key={c.id} convite={c} onAceitar={onAceitar} onRecusar={onRecusar} />
            ))}
          </div>
        </div>
      )}

      {enviados.length > 0 && (
        <div>
          <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-2">
            Enviados · {enviados.length}
          </div>
          <div className="space-y-2.5">
            {enviados.map((c) => (
              <ConviteEnviadoCard key={c.id} convite={c} onCancelar={onCancelar} />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onConvidarNovo}
        className="w-full h-12 rounded-2xl border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-[12.5px] font-medium flex items-center justify-center gap-1.5"
      >
        <Plus size={13} strokeWidth={2.4} />
        Convidar profissional
      </button>
    </div>
  )
}

interface ConviteRecebidoCardProps {
  convite: ConviteRecebido
  onAceitar?: (id: string) => void
  onRecusar?: (id: string) => void
}

function ConviteRecebidoCard({ convite, onAceitar, onRecusar }: ConviteRecebidoCardProps) {
  const { prof } = convite
  const visual = TIPO_VISUAL[prof.tipo]
  return (
    <div className="rounded-2xl bg-rose-500/5 border border-rose-500/25 p-3.5">
      <div className="flex items-center gap-3 mb-2.5">
        <ProfAvatar prof={prof} />
        <div className="min-w-0 flex-1">
          <div className="text-slate-100 font-semibold text-[13px] truncate">{prof.fullName}</div>
          <div className="text-slate-500 text-[10.5px] truncate">{prof.especialidade}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`px-1.5 py-0.5 rounded ${visual.bg} ${visual.text} text-[9px] font-semibold uppercase tracking-wider`}>
              {visual.label}
            </span>
            <span className="text-slate-600 text-[10px] font-mono tabular-nums">· {convite.tempoRelativo}</span>
          </div>
        </div>
      </div>

      {convite.mensagem && (
        <div className="rounded-xl bg-slate-950/40 px-3 py-2 mb-3">
          <div className="text-slate-400 text-[9.5px] font-semibold uppercase tracking-wider mb-1">Mensagem</div>
          <div className="text-slate-200 text-[12px] leading-snug">{convite.mensagem}</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onRecusar?.(convite.id)}
          className="h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 text-[12.5px] font-semibold flex items-center justify-center gap-1.5"
        >
          <X size={13} strokeWidth={2.4} />
          Recusar
        </button>
        <button
          onClick={() => onAceitar?.(convite.id)}
          className="h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/25 text-[12.5px] font-semibold flex items-center justify-center gap-1.5"
        >
          <Check size={13} strokeWidth={2.4} />
          Aceitar
        </button>
      </div>
    </div>
  )
}

interface ConviteEnviadoCardProps {
  convite: ConviteEnviado
  onCancelar?: (id: string) => void
}

function ConviteEnviadoCard({ convite, onCancelar }: ConviteEnviadoCardProps) {
  const { prof } = convite
  const visual = TIPO_VISUAL[prof.tipo]
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3 flex items-center gap-3">
      <ProfAvatar prof={prof} />
      <div className="min-w-0 flex-1">
        <div className="text-slate-100 font-semibold text-[12.5px] truncate">{prof.fullName}</div>
        <div className="text-slate-500 text-[10.5px] truncate">{prof.especialidade}</div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className={`px-1.5 py-0.5 rounded ${visual.bg} ${visual.text} text-[9px] font-semibold uppercase tracking-wider`}>
            {visual.label}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px] font-semibold uppercase tracking-wider">
            aguardando
          </span>
          <span className="text-slate-600 text-[10px] font-mono tabular-nums">· {convite.tempoRelativo}</span>
        </div>
      </div>
      <button
        onClick={() => onCancelar?.(convite.id)}
        className="px-2.5 h-8 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 hover:text-rose-300 text-[11px] font-medium shrink-0"
      >
        Cancelar
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function ProfAvatar({ prof }: { prof: ProfissionalBase }) {
  const visual = TIPO_VISUAL[prof.tipo]
  const Icon = visual.icon
  return (
    <div className="relative w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200 font-bold text-[15px] shrink-0">
      {prof.fotoUrl ? (
        <img src={prof.fotoUrl} alt={prof.fullName} className="w-full h-full rounded-xl object-cover" />
      ) : (
        prof.inicial
      )}
      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${visual.bg} ${visual.text} flex items-center justify-center border-2 border-slate-900`}>
        <Icon size={10} strokeWidth={2.4} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  titulo: string
  descricao: string
  onConvidar?: () => void
}

function EmptyState({ titulo, descricao, onConvidar }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-5 py-8 text-center">
      <div className="text-slate-300 text-[13px] font-semibold">{titulo}</div>
      <div className="text-slate-500 text-[11.5px] mt-1.5 leading-snug">{descricao}</div>
      {onConvidar && (
        <button
          onClick={onConvidar}
          className="mt-4 px-4 h-10 rounded-2xl bg-gradient-to-r from-teal-500 to-sky-500 text-white font-semibold text-[12.5px] flex items-center justify-center gap-1.5 mx-auto"
        >
          <Plus size={13} strokeWidth={2.6} />
          Convidar profissional
        </button>
      )}
    </div>
  )
}
