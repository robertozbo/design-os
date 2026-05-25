import {
  FileText,
  Download,
  Printer,
  Search,
  User,
  Stethoscope,
  History,
  Activity,
  Sparkles,
  Send,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Video,
  MapPin,
  type LucideIcon,
} from 'lucide-react'
import type {
  AplicacaoInstrumento,
  EntradaEvolucao,
  Encaminhamento,
  IntervencaoResumo,
  ProntuarioProps,
  RiscoSessao,
  SeveridadeScore,
  TipoEncaminhamento,
} from '@/../product-psicologo/sections/prontuario/types'

const SEVERIDADE_VISUAL: Record<SeveridadeScore, { label: string; cls: string }> = {
  minima: { label: 'Mínima', cls: 'bg-emerald-500/15 text-emerald-300' },
  leve: { label: 'Leve', cls: 'bg-teal-500/15 text-teal-300' },
  moderada: { label: 'Moderada', cls: 'bg-amber-500/15 text-amber-300' },
  moderada_severa: { label: 'Mod. severa', cls: 'bg-orange-500/15 text-orange-300' },
  severa: { label: 'Severa', cls: 'bg-rose-500/15 text-rose-300' },
}

const RISCO_VISUAL: Record<RiscoSessao, { label: string; cls: string }> = {
  sem_risco: { label: 'Sem risco', cls: 'bg-emerald-500/15 text-emerald-300' },
  baixo: { label: 'Risco baixo', cls: 'bg-teal-500/15 text-teal-300' },
  moderado: { label: 'Moderado', cls: 'bg-amber-500/15 text-amber-300' },
  critico: { label: 'Crítico', cls: 'bg-rose-500/15 text-rose-300' },
}

const ENCAMINHAMENTO_VISUAL: Record<TipoEncaminhamento, { label: string; icon: LucideIcon }> = {
  psiquiatra: { label: 'Psiquiatra', icon: Stethoscope },
  medico_geral: { label: 'Médico geral', icon: Stethoscope },
  neurologista: { label: 'Neurologista', icon: Stethoscope },
  nutricionista: { label: 'Nutricionista', icon: Activity },
  fisioterapeuta: { label: 'Fisioterapeuta', icon: Activity },
  outro: { label: 'Outro', icon: Send },
}

const SECTIONS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'identificacao', label: 'Identificação', icon: User },
  { id: 'anamnese', label: 'Anamnese', icon: FileText },
  { id: 'evolucao', label: 'Evolução', icon: History },
  { id: 'instrumentos', label: 'Instrumentos', icon: Activity },
  { id: 'intervencoes', label: 'Intervenções', icon: Sparkles },
  { id: 'encaminhamentos', label: 'Encaminhamentos', icon: Send },
  { id: 'alta', label: 'Alta', icon: CheckCircle2 },
]

function formatDateBR(iso: string): string {
  const [date] = iso.split('T')
  const [y, m, d] = date.split('-')
  return `${d}/${m}/${y}`
}

function formatHora(iso: string): string {
  if (!iso.includes('T')) return ''
  return iso.split('T')[1].slice(0, 5)
}

export function Prontuario({ data, onExportarPdf, onImprimir }: ProntuarioProps) {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-violet-500/5 border border-slate-800 p-5 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center text-violet-300">
                  <FileText size={17} strokeWidth={2.4} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-slate-50 font-bold text-[20px]">Prontuário Psicológico</h1>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck size={10} strokeWidth={2.4} />
                      CFP 001/2022
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[9.5px] font-bold uppercase tracking-wider">
                      v{data.versao}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[12px] mt-0.5">
                    {data.identificacao.nomeCompleto} · atualizado em{' '}
                    <span className="font-mono">{formatDateBR(data.atualizadoEm)}</span>
                  </div>
                </div>
              </div>

              {/* Compliance banner */}
              <div className="mt-3 rounded-lg bg-rose-500/5 border border-rose-500/20 px-3 py-2 flex items-center gap-2">
                <Lock size={12} className="text-rose-300 shrink-0" strokeWidth={2.4} />
                <span className="text-rose-200/90 text-[10.5px] leading-snug">
                  <strong>Documento sigiloso</strong> · Resolução CFP 001/2022 · acesso restrito ao psicólogo
                  responsável e ao paciente · destruição autorizada após 5 anos do último atendimento
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <input
                type="search"
                placeholder="Buscar..."
                className="h-9 px-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-slate-600 text-slate-100 text-[12px] outline-none placeholder:text-slate-700 w-44"
              />
              <button
                onClick={onImprimir}
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-center text-slate-300"
                title="Imprimir"
              >
                <Printer size={14} strokeWidth={2.2} />
              </button>
              <button
                onClick={onExportarPdf}
                className="px-3 h-9 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 text-white font-semibold text-[12px] flex items-center gap-1.5"
              >
                <Download size={13} strokeWidth={2.4} />
                Exportar PDF
              </button>
            </div>
          </div>
        </div>

        {/* Body grid 12-col (3 sidebar + 9 content) */}
        <div className="grid grid-cols-12 gap-4">
          {/* Sidebar nav */}
          <div className="col-span-3">
            <SidebarNav data={data} />
          </div>

          {/* Content */}
          <div className="col-span-9 space-y-4">
            <SectionIdentificacao data={data.identificacao} />
            <SectionAnamnese data={data.anamnese} />
            <SectionEvolucao entradas={data.evolucao} />
            <SectionInstrumentos aplicacoes={data.instrumentos} />
            <SectionIntervencoes intervencoes={data.intervencoes} />
            <SectionEncaminhamentos encaminhamentos={data.encaminhamentos} />
            <SectionAlta alta={data.alta} />

            {/* Footer compliance */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 mt-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck size={15} strokeWidth={2.4} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-slate-100 font-semibold text-[12.5px]">Profissional responsável</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {data.profissional.nome} · {data.profissional.crp}
                  </div>
                  <div className="text-slate-500 text-[10.5px] mt-0.5">{data.profissional.especialidade}</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/60">
                <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  Hash de auditoria (SHA-256)
                </div>
                <div className="text-slate-300 text-[10px] font-mono break-all leading-snug">
                  {data.hashAuditoria}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function SidebarNav({ data }: { data: ProntuarioProps['data'] }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-3 sticky top-6">
      <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-2 px-2">
        Seções
      </div>
      <nav className="space-y-0.5">
        {SECTIONS.map((s) => {
          const Icon = s.icon
          const completo = secaoCompleta(s.id, data)
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-800/60 text-slate-300 text-[12px]"
            >
              <Icon size={13} className="text-slate-500 shrink-0" strokeWidth={2.2} />
              <span className="flex-1 font-medium">{s.label}</span>
              {completo ? (
                <CheckCircle2 size={12} className="text-emerald-400 shrink-0" strokeWidth={2.4} />
              ) : (
                <span className="w-3 h-3 rounded-full border-2 border-slate-700 shrink-0" />
              )}
            </a>
          )
        })}
      </nav>
    </div>
  )
}

function secaoCompleta(secao: string, data: ProntuarioProps['data']): boolean {
  switch (secao) {
    case 'identificacao':
      return !!data.identificacao.nomeCompleto && !!data.identificacao.cpf
    case 'anamnese':
      return data.anamnese.queixaPrincipal.length > 0
    case 'evolucao':
      return data.evolucao.length > 0
    case 'instrumentos':
      return data.instrumentos.length > 0
    case 'intervencoes':
      return data.intervencoes.length > 0
    case 'encaminhamentos':
      return data.encaminhamentos.length > 0
    case 'alta':
      return data.alta !== null
    default:
      return false
  }
}

interface SecaoCardProps {
  id: string
  titulo: string
  icon: LucideIcon
  cor: string
  children: React.ReactNode
}

function SecaoCard({ id, titulo, icon: Icon, cor, children }: SecaoCardProps) {
  return (
    <section id={id} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 scroll-mt-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800/60">
        <div className={`w-8 h-8 rounded-lg ${cor} flex items-center justify-center`}>
          <Icon size={15} strokeWidth={2.4} />
        </div>
        <h2 className="text-slate-100 font-bold text-[15px]">{titulo}</h2>
      </div>
      {children}
    </section>
  )
}

function SectionIdentificacao({ data }: { data: ProntuarioProps['data']['identificacao'] }) {
  return (
    <SecaoCard id="identificacao" titulo="1. Identificação" icon={User} cor="bg-teal-500/15 text-teal-300">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Nome completo" value={data.nomeCompleto} />
        <Field label="CPF" value={data.cpf} mono />
        <Field label="Data de nascimento" value={`${formatDateBR(data.dataNascimento)} · ${data.idade} anos`} mono />
        <Field label="Gênero" value={data.genero} />
        <Field label="Estado civil" value={data.estadoCivil} />
        <Field label="Profissão" value={data.profissao} />
      </div>
      <div className="mt-3 pt-3 border-t border-slate-800/60">
        <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
          Contato de emergência
        </div>
        <div className="text-slate-100 text-[13px]">
          {data.contatoEmergencia.nome} <span className="text-slate-500">·</span> {data.contatoEmergencia.relacao}{' '}
          <span className="text-slate-500">·</span>{' '}
          <span className="font-mono tabular-nums">{data.contatoEmergencia.telefone}</span>
        </div>
      </div>
    </SecaoCard>
  )
}

function SectionAnamnese({ data }: { data: ProntuarioProps['data']['anamnese'] }) {
  return (
    <SecaoCard id="anamnese" titulo="2. Anamnese" icon={FileText} cor="bg-sky-500/15 text-sky-300">
      <div className="text-slate-500 text-[11px] mb-3">
        Realizada em <span className="font-mono">{formatDateBR(data.realizadaEm)}</span>
      </div>
      <div className="space-y-3">
        <AnamneseField label="Queixa principal" texto={data.queixaPrincipal} />
        <AnamneseField label="História atual" texto={data.historiaAtual} />
        <AnamneseField label="História pregressa" texto={data.historiaPregressa} />
        <AnamneseField label="Antecedentes familiares" texto={data.antecedentesFamiliares} />
        <AnamneseField label="Hábitos e contexto" texto={data.habitosContexto} />
        <AnamneseField label="Hipótese diagnóstica inicial" texto={data.hipoteseDiagnosticaInicial} highlight />
      </div>
    </SecaoCard>
  )
}

function SectionEvolucao({ entradas }: { entradas: EntradaEvolucao[] }) {
  return (
    <SecaoCard id="evolucao" titulo="3. Evolução cronológica" icon={History} cor="bg-violet-500/15 text-violet-300">
      <div className="text-slate-500 text-[11px] mb-3">
        {entradas.length} {entradas.length === 1 ? 'sessão registrada' : 'sessões registradas'}
      </div>
      <div className="space-y-3">
        {entradas.map((e) => (
          <EntradaCard key={e.numero} entrada={e} />
        ))}
      </div>
    </SecaoCard>
  )
}

function EntradaCard({ entrada }: { entrada: EntradaEvolucao }) {
  const risco = RISCO_VISUAL[entrada.risco]
  const ModIcon = entrada.modalidade === 'online' ? Video : MapPin
  return (
    <div className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3.5">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-500/15 text-violet-300 flex items-center justify-center font-bold text-[13px] font-mono">
            S{entrada.numero}
          </div>
          <div>
            <div className="text-slate-100 font-semibold text-[13px] flex items-center gap-2">
              <Calendar size={11} className="text-slate-500" strokeWidth={2.2} />
              <span className="font-mono tabular-nums">
                {formatDateBR(entrada.dataHora)} · {formatHora(entrada.dataHora)}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <ModIcon size={10} strokeWidth={2.2} />
                {entrada.modalidade === 'online' ? 'Online' : entrada.modalidade === 'presencial' ? 'Presencial' : 'Híbrida'}
              </span>
              <span className="text-slate-700">·</span>
              <span className="flex items-center gap-1">
                <Clock size={10} strokeWidth={2.2} />
                {entrada.duracaoMin}min
              </span>
            </div>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full ${risco.cls} text-[9.5px] font-bold uppercase tracking-wider`}>
          {risco.label}
        </span>
      </div>

      <div className="text-slate-200 text-[12px] leading-relaxed mb-2.5">{entrada.resumo}</div>

      {entrada.tecnicasUsadas.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-2">
          <span className="text-slate-500 text-[10px] uppercase tracking-wider">Técnicas:</span>
          {entrada.tecnicasUsadas.map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-300 text-[10px] font-medium">
              {t}
            </span>
          ))}
        </div>
      )}

      {entrada.homeworkPrescrito && (
        <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-2.5 py-1.5 flex items-start gap-1.5">
          <Send size={10} className="text-emerald-300 mt-0.5 shrink-0" strokeWidth={2.4} />
          <span className="text-emerald-200/90 text-[11px] leading-snug">
            <strong className="text-emerald-200">Homework:</strong> {entrada.homeworkPrescrito}
          </span>
        </div>
      )}
    </div>
  )
}

function SectionInstrumentos({ aplicacoes }: { aplicacoes: AplicacaoInstrumento[] }) {
  return (
    <SecaoCard id="instrumentos" titulo="4. Instrumentos aplicados" icon={Activity} cor="bg-amber-500/15 text-amber-300">
      <div className="text-slate-500 text-[11px] mb-3">{aplicacoes.length} aplicações</div>
      <div className="rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-[11.5px]">
          <thead className="bg-slate-950/60 border-b border-slate-800">
            <tr className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">
              <th className="px-3 py-2 text-left">Data</th>
              <th className="px-3 py-2 text-left">Instrumento</th>
              <th className="px-3 py-2 text-right">Score</th>
              <th className="px-3 py-2 text-left">Severidade</th>
              <th className="px-3 py-2 text-right">Δ vs anterior</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {aplicacoes.map((a, i) => {
              const sev = SEVERIDADE_VISUAL[a.severidade]
              return (
                <tr key={i} className="hover:bg-slate-800/30">
                  <td className="px-3 py-2 text-slate-300 font-mono tabular-nums">{formatDateBR(a.data)}</td>
                  <td className="px-3 py-2 text-slate-100 font-semibold">{a.instrumento}</td>
                  <td className="px-3 py-2 text-right text-slate-100 font-bold font-mono tabular-nums">{a.valor}</td>
                  <td className="px-3 py-2">
                    <span className={`px-1.5 py-0.5 rounded ${sev.cls} text-[9.5px] font-bold`}>{sev.label}</span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {a.delta === null ? (
                      <span className="text-slate-600 text-[10px]">linha base</span>
                    ) : a.delta === 0 ? (
                      <span className="text-slate-500 font-mono">0</span>
                    ) : (
                      <DeltaBadge delta={a.delta} />
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </SecaoCard>
  )
}

function DeltaBadge({ delta }: { delta: number }) {
  // Aumento em PHQ/GAD = piora; redução = melhora
  const subiu = delta > 0
  const cls = subiu ? 'text-rose-300' : 'text-emerald-300'
  const Icon = subiu ? TrendingUp : TrendingDown
  return (
    <span className={`inline-flex items-center gap-0.5 ${cls} font-mono tabular-nums font-bold text-[11px]`}>
      <Icon size={10} strokeWidth={2.6} />
      {subiu ? '+' : ''}
      {delta}
    </span>
  )
}

function SectionIntervencoes({ intervencoes }: { intervencoes: IntervencaoResumo[] }) {
  return (
    <SecaoCard id="intervencoes" titulo="5. Intervenções e técnicas" icon={Sparkles} cor="bg-emerald-500/15 text-emerald-300">
      <div className="text-slate-500 text-[11px] mb-3">{intervencoes.length} técnicas aplicadas</div>
      <div className="space-y-2">
        {intervencoes.map((iv, i) => (
          <div key={i} className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-slate-100 font-semibold text-[12.5px]">{iv.tecnica}</span>
                <span className="px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-300 text-[9.5px] font-bold uppercase">
                  {iv.abordagem}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-[10.5px] font-mono tabular-nums">
                  {iv.vezesAplicadas}× aplicadas
                </span>
                <Eficacia n={iv.eficaciaPercebida} />
              </div>
            </div>
            <div className="text-slate-400 text-[11px] italic leading-snug">{iv.notas}</div>
          </div>
        ))}
      </div>
    </SecaoCard>
  )
}

function Eficacia({ n }: { n: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i <= n ? 'bg-emerald-400' : 'bg-slate-700'}`}
          title={`Eficácia ${n}/5`}
        />
      ))}
    </div>
  )
}

function SectionEncaminhamentos({ encaminhamentos }: { encaminhamentos: Encaminhamento[] }) {
  return (
    <SecaoCard id="encaminhamentos" titulo="6. Encaminhamentos" icon={Send} cor="bg-rose-500/15 text-rose-300">
      {encaminhamentos.length === 0 ? (
        <div className="text-slate-500 text-[12px] italic">Nenhum encaminhamento realizado.</div>
      ) : (
        <div className="space-y-2">
          {encaminhamentos.map((e, i) => {
            const v = ENCAMINHAMENTO_VISUAL[e.para]
            const Icon = v.icon
            return (
              <div key={i} className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-300 flex items-center justify-center">
                    <Icon size={14} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="text-slate-100 font-semibold text-[12.5px]">{v.label}</div>
                    <div className="text-slate-500 text-[10.5px] font-mono">{formatDateBR(e.data)}</div>
                  </div>
                </div>
                {e.profissional && (
                  <div className="text-slate-300 text-[11.5px] mb-1.5">
                    Profissional: <span className="font-medium">{e.profissional}</span>
                  </div>
                )}
                <div className="text-slate-400 text-[11.5px] leading-snug mb-2">
                  <strong className="text-slate-300">Motivo:</strong> {e.motivo}
                </div>
                {e.retorno && (
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-2.5 py-1.5">
                    <span className="text-emerald-200/90 text-[11px] leading-snug">
                      <strong className="text-emerald-200">Retorno:</strong> {e.retorno}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </SecaoCard>
  )
}

function SectionAlta({ alta }: { alta: ProntuarioProps['data']['alta'] }) {
  if (!alta) {
    return (
      <SecaoCard id="alta" titulo="7. Alta" icon={CheckCircle2} cor="bg-slate-800 text-slate-400">
        <div className="text-slate-500 text-[12px] italic">Tratamento em curso · sem alta registrada.</div>
      </SecaoCard>
    )
  }
  const motivoLabel = {
    objetivo_alcancado: 'Objetivo terapêutico alcançado',
    transferencia: 'Transferência pra outro profissional',
    abandono: 'Abandono do tratamento',
    mutuo_acordo: 'Mútuo acordo',
  }[alta.motivo]
  return (
    <SecaoCard id="alta" titulo="7. Alta" icon={CheckCircle2} cor="bg-emerald-500/15 text-emerald-300">
      <div className="space-y-2.5">
        <Field label="Data da alta" value={formatDateBR(alta.data)} mono />
        <Field label="Motivo" value={motivoLabel} />
        <AnamneseField label="Evolução final" texto={alta.evolucaoFinal} />
        <AnamneseField label="Recomendações" texto={alta.recomendacoes} />
      </div>
    </SecaoCard>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">{label}</div>
      <div className={`text-slate-100 text-[13px] mt-0.5 ${mono ? 'font-mono tabular-nums' : ''}`}>{value}</div>
    </div>
  )
}

function AnamneseField({ label, texto, highlight }: { label: string; texto: string; highlight?: boolean }) {
  return (
    <div className={highlight ? 'rounded-lg bg-violet-500/5 border border-violet-500/20 p-2.5' : ''}>
      <div className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${highlight ? 'text-violet-300' : 'text-slate-500'}`}>
        {label}
      </div>
      <div className="text-slate-200 text-[12.5px] leading-relaxed">{texto}</div>
    </div>
  )
}
