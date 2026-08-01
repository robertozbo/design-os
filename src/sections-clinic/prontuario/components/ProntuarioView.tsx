import { useMemo, useState } from 'react'
import {
  ChevronDown,
  Download,
  Lock,
  Pill,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from 'lucide-react'
import type {
  AcessoAtual,
  AnamneseCompartilhada,
  Evolucao,
  MedicoVinculo,
  PacienteRef,
} from '@/../product-clinic/sections/prontuario/types'
import { ACCENT_BORDER, AVATAR_COR, BADGE_COR, dataCurta } from './cores'

interface Props {
  paciente: PacienteRef
  acessoAtual: AcessoAtual
  equipeCuidado: MedicoVinculo[]
  anamnese: AnamneseCompartilhada
  evolucoes: Evolucao[]
  onAbrirAudit: () => void
  onExportar: () => void
}

export function ProntuarioView({
  paciente,
  acessoAtual,
  equipeCuidado,
  anamnese,
  evolucoes,
  onAbrirAudit,
  onExportar,
}: Props) {
  const [filtroMedico, setFiltroMedico] = useState<string | 'todos'>('todos')

  const especialidades = useMemo(() => {
    const map = new Map<string, { especialidade: string; cor: Evolucao['cor']; nome: string; id: string }>()
    equipeCuidado.forEach((m) =>
      map.set(m.id, { especialidade: m.especialidade, cor: m.cor, nome: m.nome, id: m.id }),
    )
    return Array.from(map.values())
  }, [equipeCuidado])

  const evolucoesFiltradas = useMemo(() => {
    if (filtroMedico === 'todos') return evolucoes
    const alvo = especialidades.find((e) => e.id === filtroMedico)
    return evolucoes.filter((e) => e.especialidade === alvo?.especialidade)
  }, [evolucoes, filtroMedico, especialidades])

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur pl-16 lg:pl-6 dark:border-slate-800 dark:bg-slate-950/95">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500 text-base font-semibold text-white">
              {paciente.iniciais}
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                {paciente.nome}
              </h1>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span>{paciente.idade} anos</span>
                <span>·</span>
                <span>{paciente.convenio}</span>
                {paciente.condicoesCronicas.slice(0, 2).map((c) => (
                  <span
                    key={c}
                    className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onAbrirAudit}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ShieldCheck className="h-4 w-4" /> Quem acessou
            </button>
            <button
              type="button"
              onClick={onExportar}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white hover:bg-teal-700"
            >
              <Download className="h-4 w-4" /> Exportar PDF
            </button>
          </div>
        </div>

        {/* Banner de acesso */}
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-xs text-teal-800 dark:bg-teal-950/30 dark:text-teal-200">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span className="font-medium">Prontuário compartilhado da clínica.</span>
          <span>
            Você acessa como {acessoAtual.medicoNome} · {acessoAtual.especialidade}, via vínculo
            ativo. {acessoAtual.consentimento}.
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Equipe de cuidado */}
        <section className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Equipe de cuidado
            </h2>
            <span className="text-xs text-slate-400">· {equipeCuidado.length} médicos</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {equipeCuidado.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
              >
                <div
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white ${AVATAR_COR[m.cor]} ${
                    m.principal ? 'ring-2 ring-teal-400 ring-offset-1 dark:ring-offset-slate-900' : ''
                  }`}
                >
                  {m.iniciais}
                </div>
                <div className="leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {m.nome}
                    </span>
                    {m.principal && (
                      <span className="rounded bg-teal-100 px-1 py-0.5 text-[9px] font-medium text-teal-700 dark:bg-teal-950/50 dark:text-teal-300">
                        principal
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {m.especialidade} · últ. {dataCurta(m.ultimoAtendimentoEm)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Grid: timeline + anamnese */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Timeline */}
          <section className="lg:col-span-2">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Evoluções · timeline cross-especialidade
              </h2>
              <div className="flex items-center gap-1">
                <FiltroChip
                  ativo={filtroMedico === 'todos'}
                  onClick={() => setFiltroMedico('todos')}
                >
                  Todas
                </FiltroChip>
                {especialidades.map((e) => (
                  <FiltroChip
                    key={e.id}
                    ativo={filtroMedico === e.id}
                    onClick={() => setFiltroMedico(e.id)}
                  >
                    {e.especialidade}
                  </FiltroChip>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {evolucoesFiltradas.map((e) => (
                <EvolucaoCard key={e.id} evolucao={e} />
              ))}
              {evolucoesFiltradas.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400 dark:border-slate-700">
                  Nenhuma evolução dessa especialidade.
                </div>
              )}
            </div>
          </section>

          {/* Anamnese compartilhada */}
          <aside className="space-y-4">
            <Card titulo="Condições crônicas">
              <div className="flex flex-wrap gap-1.5">
                {anamnese.condicoesCronicas.map((c) => (
                  <span
                    key={c}
                    className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </Card>

            <Card titulo="Medicações em uso" hint="agregado dos vínculos">
              <ul className="space-y-2">
                {anamnese.medicacoesEmUso.map((m) => (
                  <li key={m.nome} className="flex items-start gap-2">
                    <Pill className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <div className="text-sm text-slate-800 dark:text-slate-200">{m.nome}</div>
                      <div className="mt-0.5 flex items-center gap-1">
                        <span className={`rounded px-1 py-0.5 text-[9px] font-medium ${BADGE_COR[m.cor]}`}>
                          {m.especialidade}
                        </span>
                        <span className="text-[10px] text-slate-400">{m.prescritoPor}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-400 dark:border-slate-800">
                {anamnese.observacao}
              </p>
            </Card>

            <Card titulo="Alergias">
              <ul className="space-y-1">
                {anamnese.alergias.map((a) => (
                  <li key={a} className="flex items-center gap-1.5 text-sm text-rose-700 dark:text-rose-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    {a}
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

function FiltroChip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
        ativo
          ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
      }`}
    >
      {children}
    </button>
  )
}

function Card({
  titulo,
  hint,
  children,
}: {
  titulo: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {titulo}
        </h3>
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

function EvolucaoCard({ evolucao }: { evolucao: Evolucao }) {
  const [aberto, setAberto] = useState(false)
  const e = evolucao

  return (
    <div
      className={`overflow-hidden rounded-xl border border-l-4 border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ${ACCENT_BORDER[e.cor]}`}
    >
      <button
        type="button"
        onClick={() => e.soap && setAberto((v) => !v)}
        className="flex w-full items-start gap-3 p-3.5 text-left"
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${AVATAR_COR[e.cor]}`}
        >
          {e.medicoIniciais}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {e.medicoNome}
            </span>
            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${BADGE_COR[e.cor]}`}>
              {e.especialidade}
            </span>
            {e.doMedicoLogado ? (
              <span className="rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-medium text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                sua evolução
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <Lock className="h-2.5 w-2.5" /> somente leitura
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
            <span>{dataCurta(e.data)}</span>
            <span className="inline-flex items-center gap-1">
              {e.modalidade === 'tele' ? <Video className="h-3 w-3" /> : null}
              {e.modalidade === 'tele' ? 'Teleconsulta' : 'Presencial'}
            </span>
            {e.geradoPorIA && (
              <span className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400">
                <Sparkles className="h-3 w-3" /> IA · {e.modeloIA}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{e.resumo}</p>
        </div>
        {e.soap && (
          <ChevronDown
            className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform ${aberto ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {aberto && e.soap && (
        <div className="border-t border-slate-100 px-3.5 py-3 dark:border-slate-800">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <SoapItem letra="S" titulo="Subjetivo" texto={e.soap.S} />
            <SoapItem letra="O" titulo="Objetivo" texto={e.soap.O} />
            <SoapItem letra="A" titulo="Avaliação" texto={e.soap.A} />
            <SoapItem letra="P" titulo="Plano" texto={e.soap.P} />
          </div>
        </div>
      )}
    </div>
  )
}

function SoapItem({ letra, titulo, texto }: { letra: string; titulo: string; texto: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/40">
      <div className="mb-1 flex items-center gap-1.5">
        <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-200 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {letra}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {titulo}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">{texto}</p>
    </div>
  )
}
