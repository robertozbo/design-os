import { useMemo, useState } from 'react'
import { ChevronLeft, X, Check, Sparkles, AlertTriangle, Info } from 'lucide-react'
import {
  DIA_SEMANA_LABEL,
  FREQUENCIA_LABEL,
  PRINCIPIO_LABEL,
  TIPO_LABEL,
  type ConfiguracaoPayload,
  type DiaSemana,
  type Frequencia,
  type Glp1Perfil,
  type MedicamentoCatalogo,
} from '@/../product-mobile/sections/glp1/types'

interface Props {
  open: boolean
  catalogo: MedicamentoCatalogo[]
  /** O que o app já sabe — pré-preenche os campos de corpo. */
  prefill: Glp1Perfil
  /** Valores atuais quando o paciente está reconfigurando. */
  inicial?: Partial<ConfiguracaoPayload>
  onClose: () => void
  onConcluir: (payload: ConfiguracaoPayload) => void
}

type Step = 'medicamento' | 'dose' | 'frequencia' | 'agenda' | 'perfil' | 'meta' | 'resumo'

const FREQUENCIAS: Frequencia[] = [
  'diaria',
  'semanal',
  'quinzenal',
  'mensal',
  'outro',
  'nao_sei',
]

const DIAS: DiaSemana[] = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']

const HORARIOS = ['08:00', '12:00', '18:00', '20:00', '22:00']

const HOJE = '2026-09-16'

function addDays(iso: string, dias: number): string {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + dias)
  return d.toISOString().slice(0, 10)
}

function diffDias(deIso: string, ateIso: string): number {
  const a = new Date(`${deIso}T12:00:00`).getTime()
  const b = new Date(`${ateIso}T12:00:00`).getTime()
  return Math.round((b - a) / 86_400_000)
}

function formatData(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function SetupWizard({
  open,
  catalogo,
  prefill,
  inicial,
  onClose,
  onConcluir,
}: Props) {
  const [step, setStep] = useState<Step>('medicamento')

  const [medicamentoId, setMedicamentoId] = useState<string | null>(
    inicial?.medicamentoId ?? null,
  )
  const [dose, setDose] = useState<string | null>(inicial?.dose ?? null)
  const [doseCustom, setDoseCustom] = useState('')
  const [doseModo, setDoseModo] = useState<'lista' | 'custom' | 'nao_sei' | null>(
    inicial?.dose ? 'lista' : null,
  )
  const [frequencia, setFrequencia] = useState<Frequencia | null>(
    inicial?.frequencia ?? null,
  )
  const [diaSemana, setDiaSemana] = useState<DiaSemana | null>(
    inicial?.diaSemana ?? null,
  )
  const [horario, setHorario] = useState(inicial?.horario ?? '20:00')

  const [nascimento, setNascimento] = useState(
    inicial?.nascimento ?? prefill.nascimento ?? '',
  )
  const [alturaCm, setAlturaCm] = useState(
    String(inicial?.alturaCm ?? prefill.alturaCm ?? ''),
  )
  const [pesoAtual, setPesoAtual] = useState(
    String(inicial?.pesoAtualKg ?? prefill.pesoAtualKg ?? '').replace('.', ','),
  )

  const [pesoAlvo, setPesoAlvo] = useState(
    String(inicial?.pesoAlvoKg ?? '').replace('.', ','),
  )
  const [dataAlvo, setDataAlvo] = useState(inicial?.dataAlvo ?? addDays(HOJE, 90))
  const [lembrete, setLembrete] = useState(inicial?.lembreteAtivo ?? true)

  const medicamento = useMemo(
    () => catalogo.find((m) => m.id === medicamentoId) ?? null,
    [catalogo, medicamentoId],
  )

  /** Passos visíveis — "agenda" só faz sentido com frequência definida. */
  const steps = useMemo<Step[]>(() => {
    const base: Step[] = ['medicamento', 'dose', 'frequencia']
    if (frequencia && frequencia !== 'nao_sei' && frequencia !== 'outro') {
      base.push('agenda')
    }
    return [...base, 'perfil', 'meta', 'resumo']
  }, [frequencia])

  const stepIndex = Math.max(0, steps.indexOf(step))
  const progresso = ((stepIndex + 1) / steps.length) * 100

  const pesoAtualNum = Number(pesoAtual.replace(',', '.')) || 0
  const pesoAlvoNum = Number(pesoAlvo.replace(',', '.')) || 0
  const alturaNum = Number(alturaCm) || 0

  const perderKg = pesoAtualNum && pesoAlvoNum ? pesoAtualNum - pesoAlvoNum : 0
  const semanasMeta = Math.max(1, diffDias(HOJE, dataAlvo) / 7)
  const ritmoNecessario = perderKg > 0 ? perderKg / semanasMeta : 0
  /** > 1% do peso por semana já é ritmo agressivo. */
  const ritmoAgressivo = pesoAtualNum > 0 && ritmoNecessario > pesoAtualNum * 0.01
  const imcAlvo =
    alturaNum && pesoAlvoNum ? pesoAlvoNum / (alturaNum / 100) ** 2 : null

  const podeAvancar = (() => {
    switch (step) {
      case 'medicamento':
        return !!medicamentoId
      case 'dose':
        return doseModo === 'nao_sei' || doseModo === 'lista'
          ? !!dose
          : doseModo === 'custom'
            ? doseCustom.trim().length > 0
            : false
      case 'frequencia':
        return !!frequencia
      case 'agenda':
        return frequencia === 'diaria' ? !!horario : !!diaSemana && !!horario
      case 'perfil':
        return pesoAtualNum > 0 && alturaNum > 0
      case 'meta':
        return pesoAlvoNum > 0 && perderKg > 0 && diffDias(HOJE, dataAlvo) > 6
      case 'resumo':
        return true
    }
  })()

  if (!open) return null

  const avancar = () => {
    if (step === 'resumo') {
      onConcluir({
        medicamentoId: medicamentoId!,
        dose:
          doseModo === 'nao_sei'
            ? null
            : doseModo === 'custom'
              ? `${doseCustom.trim()} mg`
              : dose,
        frequencia: frequencia!,
        diaSemana: frequencia === 'semanal' || frequencia === 'quinzenal' ? diaSemana : null,
        horario,
        nascimento: nascimento || null,
        alturaCm: alturaNum || null,
        pesoAtualKg: pesoAtualNum || null,
        pesoAlvoKg: pesoAlvoNum,
        dataAlvo,
        lembreteAtivo: lembrete,
      })
      return
    }
    setStep(steps[Math.min(steps.length - 1, stepIndex + 1)])
  }

  const voltar = () => {
    if (stepIndex === 0) {
      onClose()
      return
    }
    setStep(steps[stepIndex - 1])
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
      {/* Header: voltar + progresso (igual ao fluxo de onboarding) */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button
          onClick={voltar}
          className="w-8 h-8 -ml-2 rounded-lg flex items-center justify-center hover:bg-slate-800 shrink-0"
        >
          {stepIndex === 0 ? (
            <X size={18} className="text-slate-300" />
          ) : (
            <ChevronLeft size={20} className="text-slate-300" />
          )}
        </button>
        <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-teal-500 transition-all duration-300"
            style={{ width: `${progresso}%` }}
          />
        </div>
        <span className="shrink-0 font-mono tabular-nums text-[11px] text-slate-500">
          {stepIndex + 1}/{steps.length}
        </span>
      </div>

      {/* Corpo */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 no-scrollbar">
        {step === 'medicamento' && (
          <>
            <Titulo>Qual medicação você quer usar?</Titulo>
            <div className="space-y-2">
              {catalogo.map((m) => (
                <Radio
                  key={m.id}
                  label={m.nome}
                  hint={
                    m.id === 'outro'
                      ? 'Informe depois com seu médico'
                      : `${PRINCIPIO_LABEL[m.principio]}${TIPO_LABEL[m.tipo] ? ` · ${TIPO_LABEL[m.tipo]}` : ''} · ${m.via === 'oral' ? 'Oral' : 'Injetável'}`
                  }
                  selected={medicamentoId === m.id}
                  onClick={() => {
                    setMedicamentoId(m.id)
                    setDose(null)
                    setDoseModo(null)
                  }}
                />
              ))}
            </div>
          </>
        )}

        {step === 'dose' && medicamento && (
          <>
            <Titulo>Qual é a sua dose atual?</Titulo>
            <Sub>
              {medicamento.nome} · a gente usa isso pra montar sua curva de titulação
            </Sub>
            <div className="space-y-2">
              {medicamento.doses.map((d) => (
                <Radio
                  key={d}
                  label={d}
                  mono
                  selected={doseModo === 'lista' && dose === d}
                  onClick={() => {
                    setDoseModo('lista')
                    setDose(d)
                  }}
                />
              ))}
              <Radio
                label="Dose personalizada"
                selected={doseModo === 'custom'}
                onClick={() => {
                  setDoseModo('custom')
                  setDose(null)
                }}
              />
              {doseModo === 'custom' && (
                <div className="flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/5 px-3 py-2.5">
                  <input
                    autoFocus
                    inputMode="decimal"
                    value={doseCustom}
                    onChange={(e) => setDoseCustom(e.target.value)}
                    placeholder="0,0"
                    className="flex-1 bg-transparent outline-none font-mono tabular-nums text-[18px] text-slate-50 placeholder:text-slate-600"
                  />
                  <span className="font-mono text-[13px] text-slate-400">mg</span>
                </div>
              )}
              <Radio
                label="Ainda não sei"
                hint="Você pode definir depois da primeira consulta"
                selected={doseModo === 'nao_sei'}
                onClick={() => {
                  setDoseModo('nao_sei')
                  setDose('Ainda não sei')
                }}
              />
            </div>
          </>
        )}

        {step === 'frequencia' && (
          <>
            <Titulo>Com que frequência você aplica?</Titulo>
            <Sub>Para enviarmos lembretes no dia certo</Sub>
            <div className="space-y-2">
              {FREQUENCIAS.map((f) => (
                <Radio
                  key={f}
                  label={FREQUENCIA_LABEL[f]}
                  selected={frequencia === f}
                  onClick={() => setFrequencia(f)}
                />
              ))}
            </div>
          </>
        )}

        {step === 'agenda' && (
          <>
            <Titulo>
              {frequencia === 'diaria' ? 'Que horário você aplica?' : 'Em que dia você aplica?'}
            </Titulo>
            <Sub>O lembrete chega 1 hora antes</Sub>

            {frequencia !== 'diaria' && (
              <div className="grid grid-cols-2 gap-2 mb-5">
                {DIAS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDiaSemana(d)}
                    className={`rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-all active:scale-[0.98] ${
                      diaSemana === d
                        ? 'bg-teal-500/15 border-teal-400 text-teal-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    {DIA_SEMANA_LABEL[d]}
                  </button>
                ))}
              </div>
            )}

            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">
              Horário
            </div>
            <div className="flex flex-wrap gap-2">
              {HORARIOS.map((h) => (
                <button
                  key={h}
                  onClick={() => setHorario(h)}
                  className={`rounded-full border px-3.5 py-1.5 font-mono tabular-nums text-[13px] transition-all ${
                    horario === h
                      ? 'bg-teal-500/15 border-teal-400 text-teal-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>

            <button
              onClick={() => setLembrete(!lembrete)}
              className="mt-5 w-full flex items-center justify-between rounded-xl bg-slate-900 border border-slate-800 px-4 py-3"
            >
              <span className="text-slate-200 text-[13px]">Receber lembrete</span>
              <span
                className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                  lembrete ? 'bg-teal-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                    lembrete ? 'translate-x-4' : ''
                  }`}
                />
              </span>
            </button>
          </>
        )}

        {step === 'perfil' && (
          <>
            <Titulo>Confirme seus dados</Titulo>
            <Sub>Precisamos deles pra calcular IMC, ritmo e projeção</Sub>

            {(prefill.origem.peso === 'perfil' ||
              prefill.origem.altura === 'perfil' ||
              prefill.origem.nascimento === 'perfil') && (
              <div className="mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 px-3 py-2.5 flex items-start gap-2">
                <Sparkles size={13} className="text-emerald-300 mt-0.5 shrink-0" />
                <p className="text-emerald-100/90 text-[12px] leading-snug">
                  Achamos parte dos seus dados no perfil e nas métricas. Confira e
                  ajuste se precisar.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Campo
                label="Data de nascimento"
                origem={prefill.origem.nascimento}
                hint={prefill.idade ? `${prefill.idade} anos` : undefined}
              >
                <input
                  type="date"
                  value={nascimento}
                  onChange={(e) => setNascimento(e.target.value)}
                  className="w-full bg-transparent outline-none font-mono tabular-nums text-[16px] text-slate-50"
                />
              </Campo>

              <Campo label="Altura" origem={prefill.origem.altura}>
                <div className="flex items-baseline gap-2">
                  <input
                    inputMode="numeric"
                    value={alturaCm}
                    onChange={(e) => setAlturaCm(e.target.value)}
                    placeholder="000"
                    className="flex-1 bg-transparent outline-none font-mono tabular-nums text-[20px] font-semibold text-slate-50 placeholder:text-slate-600"
                  />
                  <span className="font-mono text-[13px] text-slate-400">cm</span>
                </div>
              </Campo>

              <Campo
                label="Peso atual"
                origem={prefill.origem.peso}
                hint={
                  prefill.pesoAtualizadoEm
                    ? `medido em ${formatData(prefill.pesoAtualizadoEm)}`
                    : undefined
                }
              >
                <div className="flex items-baseline gap-2">
                  <input
                    inputMode="decimal"
                    value={pesoAtual}
                    onChange={(e) => setPesoAtual(e.target.value)}
                    placeholder="00,0"
                    className="flex-1 bg-transparent outline-none font-mono tabular-nums text-[20px] font-semibold text-slate-50 placeholder:text-slate-600"
                  />
                  <span className="font-mono text-[13px] text-slate-400">kg</span>
                </div>
              </Campo>
            </div>

            {alturaNum > 0 && pesoAtualNum > 0 && (
              <div className="mt-4 rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 flex items-center justify-between">
                <span className="text-slate-400 text-[12.5px]">IMC atual</span>
                <span className="font-mono tabular-nums text-slate-50 text-[15px] font-bold">
                  {(pesoAtualNum / (alturaNum / 100) ** 2).toFixed(1).replace('.', ',')}
                </span>
              </div>
            )}
          </>
        )}

        {step === 'meta' && (
          <>
            <Titulo>Quanto você quer pesar?</Titulo>
            <Sub>E até quando — a gente monta a projeção a partir disso</Sub>

            <div className="space-y-3">
              <Campo label="Peso alvo">
                <div className="flex items-baseline gap-2">
                  <input
                    inputMode="decimal"
                    autoFocus
                    value={pesoAlvo}
                    onChange={(e) => setPesoAlvo(e.target.value)}
                    placeholder="00,0"
                    className="flex-1 bg-transparent outline-none font-mono tabular-nums text-[28px] font-bold text-slate-50 placeholder:text-slate-700"
                  />
                  <span className="font-mono text-[14px] text-slate-400">kg</span>
                </div>
              </Campo>

              <Campo label="Até quando">
                <input
                  type="date"
                  value={dataAlvo}
                  onChange={(e) => setDataAlvo(e.target.value)}
                  className="w-full bg-transparent outline-none font-mono tabular-nums text-[16px] text-slate-50"
                />
              </Campo>
            </div>

            {perderKg > 0 && (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 ${
                  ritmoAgressivo
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-teal-500/10 border-teal-500/25'
                }`}
              >
                <div className="flex items-start gap-2">
                  {ritmoAgressivo ? (
                    <AlertTriangle size={13} className="text-amber-300 mt-0.5 shrink-0" />
                  ) : (
                    <Info size={13} className="text-teal-300 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`text-[12.5px] font-medium ${
                        ritmoAgressivo ? 'text-amber-200' : 'text-teal-200'
                      }`}
                    >
                      Perder{' '}
                      <span className="font-mono tabular-nums">
                        {perderKg.toFixed(1).replace('.', ',')} kg
                      </span>{' '}
                      em{' '}
                      <span className="font-mono tabular-nums">
                        {Math.round(semanasMeta)}
                      </span>{' '}
                      semanas
                    </p>
                    <p
                      className={`mt-0.5 text-[11.5px] leading-snug ${
                        ritmoAgressivo ? 'text-amber-100/80' : 'text-teal-100/80'
                      }`}
                    >
                      {ritmoAgressivo
                        ? `São ${ritmoNecessario.toFixed(2).replace('.', ',')} kg/semana — acima de 1% do seu peso. Considere esticar o prazo ou falar com seu médico.`
                        : `Ritmo de ${ritmoNecessario.toFixed(2).replace('.', ',')} kg/semana. Dentro do esperado pra GLP-1.`}
                    </p>
                    {imcAlvo && (
                      <p className="mt-1.5 text-[11px] text-slate-400">
                        IMC na meta:{' '}
                        <span className="font-mono tabular-nums text-slate-300">
                          {imcAlvo.toFixed(1).replace('.', ',')}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {step === 'resumo' && medicamento && (
          <>
            <Titulo>Tudo certo?</Titulo>
            <Sub>Você pode mudar qualquer coisa depois</Sub>
            <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800">
              <Row label="Medicação" value={medicamento.nome} />
              <Row
                label="Dose"
                value={
                  doseModo === 'custom'
                    ? `${doseCustom} mg`
                    : (dose ?? 'a definir')
                }
                mono
              />
              <Row label="Frequência" value={FREQUENCIA_LABEL[frequencia!]} />
              {diaSemana && frequencia !== 'diaria' && (
                <Row
                  label="Dia"
                  value={`${DIA_SEMANA_LABEL[diaSemana]} · ${horario}`}
                />
              )}
              {frequencia === 'diaria' && <Row label="Horário" value={horario} mono />}
              <Row label="Peso atual" value={`${pesoAtual} kg`} mono />
              <Row label="Peso alvo" value={`${pesoAlvo} kg`} mono />
              <Row label="Até" value={formatData(dataAlvo)} mono />
              <Row
                label="Ritmo necessário"
                value={`${ritmoNecessario.toFixed(2).replace('.', ',')} kg/sem`}
                mono
              />
            </div>
            <p className="mt-3 text-slate-500 text-[11px] leading-snug text-center">
              O Nymos não prescreve nem ajusta dose. O acompanhamento é seu, as
              decisões clínicas são do seu médico.
            </p>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pt-3 pb-5 border-t border-slate-800 bg-slate-950">
        <button
          onClick={avancar}
          disabled={!podeAvancar}
          className={`w-full rounded-xl py-3.5 text-[14px] font-semibold transition-all ${
            podeAvancar
              ? 'bg-teal-500 text-slate-950 active:scale-[0.99]'
              : 'bg-slate-800 text-slate-500'
          }`}
        >
          {step === 'resumo' ? 'Começar acompanhamento' : 'Continuar'}
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// Peças internas
// ============================================================================

function Titulo({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-slate-50 text-[21px] font-bold leading-tight mt-1 mb-1.5">
      {children}
    </h2>
  )
}

function Sub({ children }: { children: React.ReactNode }) {
  return <p className="text-slate-400 text-[12.5px] mb-4 leading-snug">{children}</p>
}

function Radio({
  label,
  hint,
  selected,
  mono = false,
  onClick,
}: {
  label: string
  hint?: string
  selected: boolean
  mono?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all active:scale-[0.99] ${
        selected
          ? 'bg-teal-500/10 border-teal-400'
          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div
          className={`text-[14px] font-medium ${selected ? 'text-teal-100' : 'text-slate-100'} ${
            mono ? 'font-mono tabular-nums' : ''
          }`}
        >
          {label}
        </div>
        {hint && (
          <div className="mt-0.5 text-[11.5px] text-slate-500 truncate">{hint}</div>
        )}
      </div>
      <span
        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          selected ? 'border-teal-400 bg-teal-400' : 'border-slate-600'
        }`}
      >
        {selected && <Check size={12} strokeWidth={3} className="text-slate-950" />}
      </span>
    </button>
  )
}

function Campo({
  label,
  origem,
  hint,
  children,
}: {
  label: string
  origem?: 'perfil' | 'manual' | 'ausente'
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
          {label}
        </span>
        {origem === 'perfil' && (
          <span className="flex items-center gap-1 text-[10px] text-emerald-300">
            <Check size={10} strokeWidth={3} />
            do seu perfil
          </span>
        )}
        {origem === 'ausente' && (
          <span className="text-[10px] text-amber-300">falta preencher</span>
        )}
      </div>
      {children}
      {hint && <div className="mt-1 text-[10.5px] text-slate-500">{hint}</div>}
    </div>
  )
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="px-4 py-3 flex items-center justify-between gap-3">
      <span className="text-slate-400 text-[12.5px] shrink-0">{label}</span>
      <span
        className={`text-slate-100 text-[13px] text-right ${
          mono ? 'font-mono tabular-nums' : 'font-medium'
        }`}
      >
        {value}
      </span>
    </div>
  )
}
