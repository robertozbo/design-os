import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  MoreVertical,
  Pencil,
  RefreshCw,
  Search,
  Stethoscope,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react'
import type {
  MedicalClinicResumo,
  ConviteEquipe,
  FiltroEquipe,
  FiltroPapel,
  MembroEquipe,
  PapelMedicalClinic,
} from '@/../product-medical-clinic/sections/equipe/types'

const PAPEL_LABEL: Record<PapelMedicalClinic, string> = {
  admin: 'Admin',
  medico: 'Médico',
  recepcao: 'Recepção',
}

const PAPEL_BADGE: Record<PapelMedicalClinic, string> = {
  admin: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300',
  medico: 'bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300',
  recepcao: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
}

const AVATAR_COR: Record<string, string> = {
  amber: 'bg-amber-500',
  teal: 'bg-teal-500',
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
  slate: 'bg-slate-500',
}

const FILTRO_PAPEL: { value: FiltroPapel; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'admin', label: 'Admin' },
  { value: 'medico', label: 'Médicos' },
  { value: 'recepcao', label: 'Recepção' },
]

function diasAte(dataISO: string): number {
  const alvo = new Date(dataISO + 'T00:00:00')
  const hoje = new Date('2026-07-20T00:00:00')
  return Math.round((alvo.getTime() - hoje.getTime()) / 86_400_000)
}

interface Props {
  clinica: MedicalClinicResumo
  membros: MembroEquipe[]
  convites: ConviteEquipe[]
  filtro: FiltroEquipe
  onFiltro: (f: FiltroEquipe) => void
  onConvidar: () => void
  onReenviarConvite: (id: string) => void
  onRevogarConvite: (id: string) => void
  onEditarPapel: (id: string) => void
  onRemoverMembro: (id: string) => void
}

export function EquipeLista({
  clinica,
  membros,
  convites,
  filtro,
  onFiltro,
  onConvidar,
  onReenviarConvite,
  onRevogarConvite,
  onEditarPapel,
  onRemoverMembro,
}: Props) {
  const { medicosUsados, medicosLimite, nome: planoNome } = clinica.plano
  const pct = Math.min(100, Math.round((medicosUsados / medicosLimite) * 100))
  const noLimite = medicosUsados >= medicosLimite
  const barCor = noLimite
    ? 'bg-red-500'
    : pct >= 80
      ? 'bg-amber-500'
      : 'bg-teal-500'

  const ativos = useMemo(
    () => membros.filter((m) => m.status !== 'convite-pendente'),
    [membros],
  )

  const filtrados = useMemo(() => {
    const q = filtro.busca.trim().toLowerCase()
    return ativos.filter((m) => {
      if (filtro.papel !== 'todos' && m.papel !== filtro.papel) return false
      if (filtro.status !== 'todos' && m.status !== filtro.status) return false
      if (!q) return true
      return (
        m.nome.toLowerCase().includes(q) ||
        (m.especialidade?.toLowerCase().includes(q) ?? false) ||
        m.email.toLowerCase().includes(q)
      )
    })
  }, [ativos, filtro])

  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">Equipe</h1>
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
            {clinica.nome} · <span className="font-mono text-xs">{clinica.cnpj}</span>
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <button
            type="button"
            onClick={onConvidar}
            disabled={noLimite}
            title={noLimite ? 'Limite do plano atingido' : undefined}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" strokeWidth={2} />
            Convidar médico
          </button>
          <div className="w-full sm:w-56">
            <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>
                Plano {planoNome}
              </span>
              <span className="font-mono tabular-nums">
                {medicosUsados}/{medicosLimite} médicos
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className={`h-full rounded-full ${barCor}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Convites pendentes */}
      {convites.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <h2 className="mb-3 text-sm font-semibold text-amber-900 dark:text-amber-200">
            Convites pendentes · {convites.length}
          </h2>
          <div className="space-y-2">
            {convites.map((c) => {
              const dias = diasAte(c.expiraEm)
              return (
                <div
                  key={c.id}
                  className="flex flex-col gap-2 rounded-xl border border-amber-200/70 bg-white p-3 dark:border-amber-900/40 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                      {c.email}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span
                        className={`rounded px-1.5 py-0.5 font-medium ${PAPEL_BADGE[c.papel]}`}
                      >
                        {PAPEL_LABEL[c.papel]}
                      </span>
                      {c.especialidade && <span>{c.especialidade}</span>}
                      <span>·</span>
                      <span className={dias <= 2 ? 'text-red-600 dark:text-red-400' : ''}>
                        {dias > 0 ? `expira em ${dias}d` : 'expirado'}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onReenviarConvite(c.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Reenviar
                    </button>
                    <button
                      type="button"
                      onClick={() => onRevogarConvite(c.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <X className="h-3.5 w-3.5" /> Revogar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={filtro.busca}
            onChange={(e) => onFiltro({ ...filtro, busca: e.target.value })}
            placeholder="Buscar por nome, especialidade…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <div className="flex items-center gap-1">
          {FILTRO_PAPEL.map((f) => {
            const ativo = filtro.papel === f.value
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => onFiltro({ ...filtro, papel: f.value })}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  ativo
                    ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Lista */}
      <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        {filtrados.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400">
            Nenhum membro encontrado.
          </div>
        ) : (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {filtrados.map((m) => (
              <MembroRow
                key={m.id}
                membro={m}
                onEditarPapel={() => onEditarPapel(m.id)}
                onRemover={() => onRemoverMembro(m.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function MembroRow({
  membro,
  onEditarPapel,
  onRemover,
}: {
  membro: MembroEquipe
  onEditarPapel: () => void
  onRemover: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const cor = AVATAR_COR[membro.avatarCor ?? 'slate'] ?? AVATAR_COR.slate
  const inativo = membro.status === 'inativo'

  return (
    <li className="flex items-center gap-3 bg-white px-4 py-3 dark:bg-slate-900">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${cor} ${
          inativo ? 'opacity-50' : ''
        }`}
      >
        {membro.iniciais}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {membro.nome}
          </span>
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${PAPEL_BADGE[membro.papel]}`}>
            {PAPEL_LABEL[membro.papel]}
          </span>
          {inativo && (
            <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              inativo
            </span>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
          {membro.papel === 'medico' && membro.especialidade ? (
            <span className="inline-flex items-center gap-1">
              <Stethoscope className="h-3 w-3" />
              {membro.especialidade} · {membro.crm}
            </span>
          ) : (
            <span className="truncate">{membro.email}</span>
          )}
        </div>
      </div>

      {membro.papel === 'medico' && membro.status === 'ativo' && (
        <div className="hidden shrink-0 gap-6 pr-2 text-right sm:flex">
          <Stat valor={membro.pacientesAtivos ?? 0} label="pacientes" />
          <Stat valor={membro.atendimentosMes ?? 0} label="atend./mês" />
        </div>
      )}

      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          aria-label="Ações"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onEditarPapel()
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Pencil className="h-3.5 w-3.5" /> Editar papel
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  onRemover()
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-3.5 w-3.5" /> Remover da clínica
              </button>
            </div>
          </>
        )}
      </div>
    </li>
  )
}

function Stat({ valor, label }: { valor: number; label: string }) {
  return (
    <div className="leading-tight">
      <div className="text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">
        {valor}
      </div>
      <div className="text-[10px] text-slate-400">{label}</div>
    </div>
  )
}

export function LimiteAviso({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>Limite de médicos do plano atingido.</span>
      <button onClick={onUpgrade} className="ml-auto font-semibold underline">
        Fazer upgrade
      </button>
    </div>
  )
}
