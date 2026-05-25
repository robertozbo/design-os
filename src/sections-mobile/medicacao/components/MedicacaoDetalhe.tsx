import { useMemo } from 'react'
import {
  X,
  Pill,
  Syringe,
  Activity,
  AlertCircle,
  MessageCircle,
  FileText,
  MapPin,
  ChevronRight,
} from 'lucide-react'
import {
  SITIO_LABELS,
  type CurvaPK,
  type MedicacaoAtiva,
  type MedicoVinculado,
  type RegistroInjecao,
  type RegistroReceita,
  type RegistroSintomas,
} from '@/../product-mobile/sections/medicacao/types'
import { CurvaPKCard } from './CurvaPKCard'

interface Props {
  medicacao: MedicacaoAtiva
  /** Médico prescritor — resolvido do medicoId. Pode ser null se prescritor desconhecido. */
  medicoPrescritor?: MedicoVinculado | null
  /** Curva PK (apenas pra GLP-1 injetável). */
  curva?: CurvaPK | null
  /** Histórico de injeções filtrado pra essa medicação (mais recentes primeiro). */
  injecoes?: RegistroInjecao[]
  /** Histórico de sintomas filtrado pra essa medicação (mais recentes primeiro). */
  sintomas?: RegistroSintomas[]
  /** Histórico de receitas filtrado pra essa medicação. */
  receitas?: RegistroReceita[]
  open: boolean
  onClose: () => void
  onAbrirReceitaMemed?: (medicacaoId: string) => void
  onFalarComMedico?: (medicacaoId: string, nome: string) => void
  onAplicarDose?: (medicacaoId: string) => void
  onMarcarComprimido?: (medicacaoId: string) => void
  onRegistrarSintomas?: (medicacaoId: string) => void
}

function isGlp1Injetavel(m: MedicacaoAtiva): boolean {
  return m.categoria === 'glp1_injetavel' || m.via === 'subcutanea'
}

function isGlp1Oral(m: MedicacaoAtiva): boolean {
  return m.categoria === 'glp1_oral'
}

function dorCor(d: number): string {
  if (d <= 2) return 'text-emerald-300'
  if (d <= 5) return 'text-amber-300'
  if (d <= 8) return 'text-orange-300'
  return 'text-rose-300'
}

function corAdesao(p: number): string {
  if (p >= 90) return 'text-emerald-300'
  if (p >= 70) return 'text-amber-300'
  return 'text-rose-300'
}

function corBarra(p: number): string {
  if (p >= 90) return 'bg-emerald-400'
  if (p >= 70) return 'bg-amber-400'
  return 'bg-rose-400'
}

export function MedicacaoDetalhe({
  medicacao,
  medicoPrescritor,
  curva,
  injecoes = [],
  sintomas = [],
  receitas = [],
  open,
  onClose,
  onAbrirReceitaMemed,
  onFalarComMedico,
  onAplicarDose,
  onMarcarComprimido,
  onRegistrarSintomas,
}: Props) {
  const glp1Inj = isGlp1Injetavel(medicacao)
  const glp1Oral = isGlp1Oral(medicacao)
  const glp1 = glp1Inj || glp1Oral

  const injecoesMed = useMemo(
    () => injecoes.filter((i) => i.medicacaoId === medicacao.id).slice(0, 5),
    [injecoes, medicacao.id],
  )

  const sintomasMed = useMemo(() => sintomas.slice(0, 3), [sintomas])

  const ultimoSintoma = sintomasMed[0] ?? null

  // Tendência food noise (atual vs anterior)
  const tendenciaFoodNoise = useMemo(() => {
    if (sintomasMed.length < 2) return null
    const atual = sintomasMed[0].pensamentosAlimentares
    const anterior = sintomasMed[1].pensamentosAlimentares
    if (atual < anterior) return { dir: 'down', delta: anterior - atual }
    if (atual > anterior) return { dir: 'up', delta: atual - anterior }
    return { dir: 'flat', delta: 0 }
  }, [sintomasMed])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <button
          onClick={onClose}
          className="w-9 h-9 -ml-2 rounded-lg flex items-center justify-center hover:bg-slate-800"
        >
          <X size={18} className="text-slate-300" />
        </button>
        <div className="text-center">
          <div className="text-slate-100 text-[14px] font-semibold">
            {medicacao.nome}{' '}
            <span className="font-mono text-slate-400 text-[12px]">{medicacao.dose}</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            {glp1Inj ? 'GLP-1 injetável' : glp1Oral ? 'GLP-1 oral' : 'Medicação ativa'}
          </div>
        </div>
        <div className="w-9" />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Curva PK (somente GLP-1 injetável) */}
        {glp1Inj && curva && (
          <div className="pt-4">
            <CurvaPKCard curva={curva} medicacao={medicacao} />
          </div>
        )}

        {/* Sobre */}
        <Section titulo="Sobre essa medicação">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800">
            {medicoPrescritor && (
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-slate-400 text-[12px]">Prescrito por</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-teal-500/15 text-teal-300 flex items-center justify-center text-[9px] font-semibold">
                    {medicoPrescritor.iniciais}
                  </div>
                  <span className="text-slate-100 text-[12.5px] font-medium">
                    {medicoPrescritor.nome}
                  </span>
                </div>
              </div>
            )}
            <Row label="Posologia" value={medicacao.posologia} />
            <Row label="Início" value={medicacao.iniciadaEm} mono />
            <Row label="Duração" value={medicacao.duracaoLabel} />
            {medicacao.proximaDoseLabel && (
              <Row
                label="Próxima dose"
                value={medicacao.proximaDoseLabel}
                mono
                accent="text-teal-300"
              />
            )}
            {medicacao.via && (
              <Row
                label="Via"
                value={
                  medicacao.via === 'subcutanea' ? 'Subcutânea' : 'Oral'
                }
              />
            )}
          </div>
          {medicacao.orientacao && (
            <div className="mt-3 rounded-xl bg-slate-900/60 border border-slate-800 p-3 flex items-start gap-2">
              <AlertCircle
                size={13}
                className="text-amber-300 mt-0.5 shrink-0"
              />
              <p className="text-slate-300 text-[12px] leading-snug italic">
                “{medicacao.orientacao}”
              </p>
            </div>
          )}
        </Section>

        {/* Adesão */}
        <Section titulo="Adesão">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <div className="text-slate-500 text-[10.5px] uppercase tracking-wider">
                  Últimos 30 dias
                </div>
                <div
                  className={`font-mono font-bold text-[28px] tabular-nums leading-none mt-1 ${corAdesao(medicacao.adesao30d)}`}
                >
                  {medicacao.adesao30d}%
                </div>
              </div>
              {glp1Inj && injecoesMed.length > 0 && (
                <div className="text-right">
                  <div className="text-slate-500 text-[10.5px] uppercase tracking-wider">
                    Aplicações
                  </div>
                  <div className="font-mono font-bold text-slate-100 text-[18px] tabular-nums mt-1 leading-none">
                    {injecoes.filter((i) => i.medicacaoId === medicacao.id).length}
                  </div>
                </div>
              )}
            </div>
            <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full ${corBarra(medicacao.adesao30d)}`}
                style={{ width: `${medicacao.adesao30d}%` }}
              />
            </div>
          </div>
        </Section>

        {/* Histórico de injeções (GLP-1 injetável) */}
        {glp1Inj && injecoesMed.length > 0 && (
          <Section titulo="Últimas aplicações">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800">
              {injecoesMed.map((inj) => (
                <div
                  key={inj.id}
                  className="px-4 py-3 flex items-center gap-3"
                >
                  <span className="w-8 h-8 rounded-lg bg-teal-500/15 flex items-center justify-center shrink-0">
                    <Syringe size={13} className="text-teal-300" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-100 text-[12.5px] font-medium truncate flex items-center gap-1.5">
                      <MapPin size={11} className="text-slate-500 shrink-0" />
                      {SITIO_LABELS[inj.sitio]}
                    </div>
                    <div className="text-slate-500 text-[10.5px] mt-0.5 font-mono tabular-nums">
                      {inj.aplicadoEmLabel} · {inj.doseLabel}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`font-mono text-[14px] font-bold tabular-nums ${dorCor(inj.dor)}`}
                    >
                      {inj.dor}/10
                    </div>
                    <div className="text-slate-500 text-[9.5px] uppercase tracking-wide">
                      dor
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Sintomas pós-dose (GLP-1) */}
        {glp1 && ultimoSintoma && (
          <Section titulo="Sintomas pós-dose">
            <div className="rounded-2xl bg-teal-500/[0.04] border border-teal-500/20 p-4">
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <div className="text-slate-500 text-[10.5px] uppercase tracking-wider">
                    Pensamentos alimentares
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="font-mono font-bold text-[24px] tabular-nums leading-none text-emerald-300">
                      {ultimoSintoma.pensamentosAlimentares}
                    </span>
                    <span className="text-slate-500 text-[11px]">/10</span>
                  </div>
                </div>
                {tendenciaFoodNoise && tendenciaFoodNoise.dir !== 'flat' && (
                  <div
                    className={`font-mono text-[11px] font-semibold tabular-nums ${
                      tendenciaFoodNoise.dir === 'down'
                        ? 'text-emerald-300'
                        : 'text-rose-300'
                    }`}
                  >
                    {tendenciaFoodNoise.dir === 'down' ? '↓' : '↑'}{' '}
                    {tendenciaFoodNoise.delta} vs anterior
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10.5px]">
                <Mini label="Náusea" value={ultimoSintoma.nausea} />
                <Mini label="Fadiga" value={ultimoSintoma.fadiga} />
                <Mini label="Refluxo" value={ultimoSintoma.refluxo} />
              </div>
              <div className="mt-3 text-slate-500 text-[10.5px] font-mono">
                Registrado {ultimoSintoma.haLabel}
              </div>
            </div>
          </Section>
        )}

        {/* Histórico de receitas dessa medicação */}
        {receitas.length > 0 && (
          <Section titulo="Receitas dessa medicação">
            <div className="space-y-1.5">
              {receitas.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl bg-slate-900 border border-slate-800 px-3 py-2.5 flex items-start gap-2.5"
                >
                  <span className="text-slate-500 font-mono text-[10.5px] tabular-nums shrink-0 mt-0.5 w-12">
                    {r.data}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-200 text-[12px] leading-snug">
                      {r.titulo}
                    </div>
                    <div className="text-slate-500 text-[10.5px] mt-0.5">
                      {r.medicoNome}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Footer CTAs */}
      <div className="px-4 py-3 border-t border-slate-800 bg-slate-950 space-y-2">
        {glp1Inj && onAplicarDose && (
          <button
            onClick={() => onAplicarDose(medicacao.id)}
            className="w-full rounded-xl py-3 text-[14px] font-semibold bg-teal-500 text-slate-950 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Syringe size={14} strokeWidth={2.2} />
            Aplicar dose
          </button>
        )}
        {glp1Oral && onMarcarComprimido && (
          <button
            onClick={() => onMarcarComprimido(medicacao.id)}
            className="w-full rounded-xl py-3 text-[14px] font-semibold bg-teal-500 text-slate-950 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <Pill size={14} strokeWidth={2.2} />
            Marcar comprimido
          </button>
        )}
        <div className="grid grid-cols-2 gap-2">
          {glp1 && onRegistrarSintomas && (
            <button
              onClick={() => onRegistrarSintomas(medicacao.id)}
              className="rounded-xl py-2.5 text-[12.5px] font-semibold bg-slate-900 border border-slate-800 text-slate-200 active:scale-[0.99] flex items-center justify-center gap-1.5"
            >
              <Activity size={12} strokeWidth={2.2} />
              Sintomas
            </button>
          )}
          {onFalarComMedico && (
            <button
              onClick={() => onFalarComMedico(medicacao.id, medicacao.nome)}
              className={`rounded-xl py-2.5 text-[12.5px] font-semibold bg-slate-900 border border-slate-800 text-slate-200 active:scale-[0.99] flex items-center justify-center gap-1.5 ${
                glp1 ? '' : 'col-span-1'
              }`}
            >
              <MessageCircle size={12} strokeWidth={2.2} />
              Médico
            </button>
          )}
          {onAbrirReceitaMemed && (
            <button
              onClick={() => onAbrirReceitaMemed(medicacao.id)}
              className={`rounded-xl py-2.5 text-[12.5px] font-semibold bg-slate-900 border border-slate-800 text-slate-200 active:scale-[0.99] flex items-center justify-center gap-1.5 ${
                glp1 ? 'col-span-2' : ''
              }`}
            >
              <FileText size={12} strokeWidth={2.2} />
              Ver receita Memed
              <ChevronRight size={11} strokeWidth={2.2} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({
  titulo,
  children,
}: {
  titulo: string
  children: React.ReactNode
}) {
  return (
    <div className="px-4 pt-5">
      <div className="text-slate-400 text-[10.5px] uppercase tracking-wider font-semibold mb-2">
        {titulo}
      </div>
      {children}
    </div>
  )
}

function Row({
  label,
  value,
  mono = false,
  accent,
}: {
  label: string
  value: string
  mono?: boolean
  accent?: string
}) {
  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <span className="text-slate-400 text-[12px]">{label}</span>
      <span
        className={`text-[12.5px] ${mono ? 'font-mono tabular-nums' : 'font-medium'} ${
          accent ?? 'text-slate-100'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function Mini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-slate-900/60 border border-slate-800 px-2 py-1.5">
      <div className="text-slate-500 text-[9.5px] uppercase tracking-wider">
        {label}
      </div>
      <div
        className={`font-mono text-[14px] tabular-nums font-bold mt-0.5 leading-none ${dorCor(value)}`}
      >
        {value}
      </div>
    </div>
  )
}
