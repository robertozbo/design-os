import {
  Camera,
  Pencil,
  ChevronRight,
  Cake,
  Ruler,
  Scale,
  Phone,
  Lock,
  AlertTriangle,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { PerfilProps } from '@/../product-mobile/sections/perfil/types'

function formatDataBR(iso: string | null): string {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function formatRelativeDays(iso: string | null): string {
  if (!iso) return ''
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 30) return `há ${days}d`
  return `há ${Math.floor(days / 30)} mês`
}

export function Perfil({
  data,
  onEditarFoto,
  onEditarNome,
  onEditarNascimento,
  onEditarSexo,
  onEditarAltura,
  onAtualizarPeso,
  onProfissionaisClick,
  onEditarEmergencia,
  onAlterarSenha,
  onExcluirConta,
}: PerfilProps) {
  return (
    <div className="min-h-full bg-slate-950 pb-6">
      <div className="px-4 pt-3 pb-5 flex flex-col items-center text-center">
        <button
          onClick={onEditarFoto}
          className="relative w-24 h-24 rounded-3xl bg-teal-500/20 hover:bg-teal-500/30 flex items-center justify-center text-teal-200 font-bold text-[36px] shrink-0 overflow-hidden"
        >
          {data.fotoUrl ? (
            <img src={data.fotoUrl} alt={data.nomeCompleto} className="w-full h-full object-cover" />
          ) : (
            data.avatarInicial
          )}
          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-slate-900 border-2 border-slate-950 flex items-center justify-center text-slate-300">
            <Camera size={11} strokeWidth={2.4} />
          </div>
        </button>
        <button onClick={onEditarNome} className="mt-3 inline-flex items-center gap-1.5 hover:bg-slate-900/60 px-2 py-0.5 rounded-lg">
          <span className="text-slate-100 font-bold text-[18px]">{data.nomeCompleto}</span>
          <Pencil size={11} className="text-slate-500" strokeWidth={2.4} />
        </button>
        <div className="text-slate-500 text-[11.5px] mt-0.5 font-mono">{data.user.email}</div>
      </div>

      <SectionLabel label="Dados Antropométricos" hint="Usados nos benchmarks da Minha Saúde" />
      <div className="bg-slate-900 border-y border-slate-800">
        <FieldRow
          icon={Cake}
          cor="rose"
          label="Data de nascimento"
          value={data.dataNascimento ? `${formatDataBR(data.dataNascimento)} · ${data.idade} anos` : '—'}
          onClick={onEditarNascimento}
        />
        <SexoRow sexo={data.sexo} onChange={onEditarSexo} />
        <FieldRow
          icon={Ruler}
          cor="sky"
          label="Altura"
          value={data.alturaCm ? `${data.alturaCm} cm` : '—'}
          onClick={onEditarAltura}
        />
        <FieldRow
          icon={Scale}
          cor="emerald"
          label="Peso atual"
          value={data.pesoAtualKg ? `${data.pesoAtualKg} kg` : '—'}
          subtitle={
            data.pesoMedidoEm
              ? `medido ${formatRelativeDays(data.pesoMedidoEm)}`
              : 'sem medição'
          }
          onClick={onAtualizarPeso}
          actionLabel="Atualizar"
          isLast
        />
      </div>

      <SectionLabel label="Profissionais" />
      <div className="bg-slate-900 border-y border-slate-800">
        <button
          onClick={onProfissionaisClick}
          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800/40 text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-500/15 flex items-center justify-center text-teal-300 shrink-0">
            <Users size={14} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-slate-100 font-medium text-[13px] leading-tight">
              {data.profissionaisVinculados} vinculado{data.profissionaisVinculados === 1 ? '' : 's'}
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              {data.convitesPendentes > 0
                ? `${data.convitesPendentes} convite${data.convitesPendentes === 1 ? '' : 's'} pendente${data.convitesPendentes === 1 ? '' : 's'}`
                : 'Nutri, personal, médico, psicólogo'}
            </div>
          </div>
          {data.convitesPendentes > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold font-mono tabular-nums shrink-0">
              {data.convitesPendentes}
            </span>
          )}
          <ChevronRight size={13} className="text-slate-600 shrink-0" />
        </button>
      </div>

      <SectionLabel label="Contato de Emergência" />
      <div className="bg-slate-900 border-y border-slate-800">
        <button
          onClick={onEditarEmergencia}
          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800/40 text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 flex items-center justify-center text-rose-300 shrink-0">
            <Phone size={14} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            {data.contatoEmergencia ? (
              <>
                <div className="text-slate-100 font-medium text-[13px]">
                  {data.contatoEmergencia.nome}
                </div>
                <div className="text-slate-500 text-[11px]">
                  {data.contatoEmergencia.relacao} · {data.contatoEmergencia.telefone}
                </div>
              </>
            ) : (
              <div className="text-slate-400 text-[12.5px]">Adicionar contato</div>
            )}
          </div>
          <Pencil size={12} className="text-slate-500 shrink-0" />
        </button>
      </div>

      <SectionLabel label="Conta" />
      <div className="bg-slate-900 border-y border-slate-800">
        <FieldRow icon={Lock} cor="sky" label="Alterar senha" value="" onClick={onAlterarSenha} />
        <button
          onClick={onExcluirConta}
          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-rose-500/5 text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-300 shrink-0">
            <AlertTriangle size={14} strokeWidth={2.2} />
          </div>
          <span className="text-rose-300 font-medium text-[13px] flex-1">Excluir conta</span>
          <ChevronRight size={13} className="text-rose-300/60 shrink-0" />
        </button>
      </div>
    </div>
  )
}

function SectionLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="px-5 mt-5 mb-1.5">
      <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">{label}</div>
      {hint && <div className="text-slate-600 text-[10px] mt-0.5">{hint}</div>}
    </div>
  )
}

interface FieldRowProps {
  icon: LucideIcon
  cor: 'teal' | 'sky' | 'emerald' | 'amber' | 'rose' | 'violet'
  label: string
  value: string
  subtitle?: string
  onClick?: () => void
  actionLabel?: string
  isLast?: boolean
}

const COR_BG: Record<FieldRowProps['cor'], string> = {
  teal: 'bg-teal-500/15 text-teal-300',
  sky: 'bg-sky-500/15 text-sky-300',
  emerald: 'bg-emerald-500/15 text-emerald-300',
  amber: 'bg-amber-500/15 text-amber-300',
  rose: 'bg-rose-500/15 text-rose-300',
  violet: 'bg-violet-500/15 text-violet-300',
}

function FieldRow({ icon: Icon, cor, label, value, subtitle, onClick, actionLabel, isLast }: FieldRowProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800/40 text-left ${
        isLast ? '' : 'border-b border-slate-800/60'
      }`}
    >
      <div className={`w-9 h-9 rounded-xl ${COR_BG[cor]} flex items-center justify-center shrink-0`}>
        <Icon size={14} strokeWidth={2.2} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-slate-400 text-[10.5px] font-medium uppercase tracking-wider">{label}</div>
        {value && <div className="text-slate-100 font-medium text-[13px] mt-0.5 leading-tight">{value}</div>}
        {subtitle && <div className="text-slate-500 text-[10.5px] mt-0.5">{subtitle}</div>}
      </div>
      {actionLabel ? (
        <span className="text-teal-300 text-[11px] font-semibold shrink-0">{actionLabel}</span>
      ) : (
        <ChevronRight size={13} className="text-slate-600 shrink-0" />
      )}
    </button>
  )
}

interface SexoRowProps {
  sexo: 'masculino' | 'feminino' | 'intersexo' | 'nao_informar' | null
  onChange?: (s: 'masculino' | 'feminino' | 'intersexo' | 'nao_informar') => void
}

const SEXO_OPCOES: { id: NonNullable<SexoRowProps['sexo']>; label: string }[] = [
  { id: 'masculino', label: 'Masculino' },
  { id: 'feminino', label: 'Feminino' },
  { id: 'intersexo', label: 'Intersexo' },
  { id: 'nao_informar', label: 'Prefiro não informar' },
]

function SexoRow({ sexo, onChange }: SexoRowProps) {
  return (
    <div className="px-4 py-3 flex items-start gap-3 border-b border-slate-800/60">
      <div className="w-9 h-9 rounded-xl bg-violet-500/15 text-violet-300 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[15px] font-bold">⚥</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-slate-400 text-[10.5px] font-medium uppercase tracking-wider">Sexo biológico</div>
        <div className="text-slate-600 text-[10px] mt-0.5 leading-snug">
          Usado pra benchmarks por idade+sexo. Pode alterar a qualquer momento.
        </div>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {SEXO_OPCOES.map((opt) => {
            const active = sexo === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => onChange?.(opt.id)}
                className={`px-3 h-7 rounded-full text-[11px] font-semibold border whitespace-nowrap ${
                  active
                    ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
        {sexo === 'nao_informar' && (
          <div className="mt-2 flex items-start gap-1.5 text-amber-300/80 text-[10px] leading-snug">
            <span>⚠</span>
            <span>
              Sem essa info, benchmarks usam média geral. Algumas métricas mostrarão asterisco indicando faixa
              não específica.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

