import { useState } from 'react'
import type {
  AdicionarMetricaProps,
  MetricaOpcao,
  NovoRegistro,
} from '@/../product-mobile/sections/metricas/types'
import { ChevronLeft, Check, ChevronRight, Calendar, Clock, Calculator } from 'lucide-react'
import { getIcon, hexFromCor } from './_shared'

function findOpcao(
  categorias: AdicionarMetricaProps['categorias'],
  id: string | null | undefined,
): MetricaOpcao | null {
  if (!id) return null
  for (const cat of categorias) {
    const found = cat.opcoes.find((o) => o.id === id)
    if (found) return found
  }
  return null
}

const num = (s: string | undefined) => Number((s ?? '').replace(',', '.'))
const formatResultado = (v: number) => {
  const dec = Number.isInteger(v) ? 0 : 1
  return v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec })
}

export function AdicionarMetrica({
  categorias,
  selecionadaId,
  derivacoes = {},
  safeTop = false,
  onVoltar,
  onSalvar,
}: AdicionarMetricaProps) {
  const [selId, setSelId] = useState<string | null>(selecionadaId ?? null)
  const selecionada = findOpcao(categorias, selId)
  const [pickerOpen, setPickerOpen] = useState<boolean>(!selecionada)

  const derivacao = selId ? derivacoes[selId] : undefined
  const composite = !derivacao && selecionada?.dataType === 'composite' && selecionada.compositeFields
  const camposComp = composite ? Object.entries(selecionada!.compositeFields!) : []

  // Modo: 'derivado' (calculado) | 'composto' | 'escalar'
  const modo = derivacao ? 'derivado' : composite ? 'composto' : 'escalar'

  const [valor, setValor] = useState('')
  const [campos, setCampos] = useState<Record<string, string>>({})
  const [nota, setNota] = useState('')

  const resultadoCalc =
    derivacao && derivacao.campos.every((c) => campos[c.key]?.trim())
      ? derivacao.calcular(Object.fromEntries(derivacao.campos.map((c) => [c.key, num(campos[c.key])])))
      : null

  const podeSalvar =
    modo === 'derivado'
      ? resultadoCalc != null && !Number.isNaN(resultadoCalc)
      : modo === 'composto'
        ? camposComp.every(([k]) => campos[k]?.trim())
        : valor.trim() !== '' && !Number.isNaN(num(valor))

  function selecionar(id: string) {
    setSelId(id)
    setPickerOpen(false)
    setValor('')
    setCampos({})
  }

  function salvar() {
    if (!selecionada || !podeSalvar) return
    let registro: NovoRegistro
    if (derivacao) {
      registro = {
        metricaId: selecionada.id,
        valor: resultadoCalc as number,
        entradas: Object.fromEntries(derivacao.campos.map((c) => [c.key, num(campos[c.key])])),
        data: 'Hoje',
        hora: 'Agora',
        nota: nota.trim() || undefined,
      }
    } else if (modo === 'composto') {
      registro = {
        metricaId: selecionada.id,
        valor: Object.fromEntries(camposComp.map(([k]) => [k, num(campos[k])])),
        data: 'Hoje',
        hora: 'Agora',
        nota: nota.trim() || undefined,
      }
    } else {
      registro = {
        metricaId: selecionada.id,
        valor: num(valor),
        data: 'Hoje',
        hora: 'Agora',
        nota: nota.trim() || undefined,
      }
    }
    onSalvar?.(registro)
  }

  return (
    <div className="min-h-full bg-slate-950 pb-8 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-sm border-b border-slate-900">
        {safeTop && <div className="h-11" />}
        <div className="flex items-center gap-2 px-3 py-3">
          <button
            onClick={onVoltar}
            className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-slate-300 hover:bg-slate-800 active:scale-95 transition"
            aria-label="Voltar"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="text-slate-100 font-semibold text-[15px]">Adicionar registro</div>
        </div>
      </div>

      <div className="flex-1 px-4 pt-4 space-y-5">
        {/* Seletor de métrica */}
        <div>
          <label className="text-slate-400 text-[12px] font-semibold uppercase tracking-wide">
            Métrica
          </label>
          {selecionada && !pickerOpen ? (
            <button
              onClick={() => setPickerOpen(true)}
              className="mt-2 w-full flex items-center gap-3 rounded-2xl bg-slate-900 border border-slate-800 px-3 py-3 text-left"
            >
              <SelChipIcon opcao={selecionada} />
              <div className="min-w-0 flex-1">
                <div className="text-slate-100 font-semibold text-[14px]">{selecionada.label}</div>
                <div className="text-slate-500 font-mono text-[11px]">
                  {derivacao
                    ? `calculado · ${derivacao.campos.map((c) => c.label.toLowerCase()).join(' + ')}`
                    : composite
                      ? camposComp.map(([, d]) => d.label.toLowerCase()).join(' + ')
                      : selecionada.unit
                        ? `em ${selecionada.unit}`
                        : 'valor único'}
                </div>
              </div>
              <span className="text-teal-400 text-[12px] font-medium">Trocar</span>
            </button>
          ) : (
            <div className="mt-2 space-y-3">
              {categorias.map((cat) => (
                <div key={cat.id}>
                  <div className="text-slate-500 text-[10.5px] font-semibold uppercase tracking-wider mb-1.5">
                    {cat.label}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.opcoes.map((o) => {
                      const ativo = o.id === selId
                      return (
                        <button
                          key={o.id}
                          onClick={() => selecionar(o.id)}
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                            ativo
                              ? 'bg-teal-500 border-teal-500 text-white'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {ativo && <Check size={13} />}
                          {o.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Entrada de valor */}
        {selecionada && !pickerOpen && (
          <>
            {/* ESCALAR — um campo */}
            {modo === 'escalar' && (
              <div>
                <label className="text-slate-400 text-[12px] font-semibold uppercase tracking-wide">
                  Valor
                </label>
                <div className="mt-2 rounded-2xl bg-slate-900 border border-slate-800 px-4 py-4 flex items-baseline gap-2">
                  <input
                    inputMode="decimal"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="0"
                    autoFocus
                    className="flex-1 min-w-0 bg-transparent text-slate-50 font-mono font-bold text-[40px] leading-none tabular-nums outline-none placeholder:text-slate-700"
                  />
                  {selecionada.unit && (
                    <span className="text-slate-400 text-[16px] font-medium shrink-0">
                      {selecionada.unit}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* COMPOSTO — múltiplos campos independentes (ex: pressão) */}
            {modo === 'composto' && (
              <div>
                <label className="text-slate-400 text-[12px] font-semibold uppercase tracking-wide">
                  Valor
                </label>
                <div className="mt-2 flex gap-3">
                  {camposComp.map(([k, def]) => (
                    <FieldBox
                      key={k}
                      label={def.label}
                      unit={def.unit ?? ''}
                      value={campos[k] ?? ''}
                      onChange={(v) => setCampos((p) => ({ ...p, [k]: v }))}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* DERIVADO — entradas + resultado calculado (ex: IMC = peso + altura) */}
            {derivacao && (
              <div>
                <label className="text-slate-400 text-[12px] font-semibold uppercase tracking-wide">
                  Entradas
                </label>
                <div className="mt-2 flex gap-3">
                  {derivacao.campos.map((c) => (
                    <FieldBox
                      key={c.key}
                      label={c.label}
                      unit={c.unit}
                      placeholder={c.placeholder ?? '0'}
                      value={campos[c.key] ?? ''}
                      onChange={(v) => setCampos((p) => ({ ...p, [c.key]: v }))}
                    />
                  ))}
                </div>

                {/* Resultado calculado */}
                <div className="mt-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 px-4 py-3 flex items-center gap-3">
                  <Calculator size={18} className="text-teal-300 shrink-0" />
                  <div className="flex-1">
                    <div className="text-teal-300/80 text-[11px] font-medium uppercase tracking-wide">
                      {selecionada.label} calculado
                    </div>
                    <div className="font-mono font-bold text-slate-50 text-[24px] tabular-nums leading-none mt-0.5">
                      {resultadoCalc != null ? formatResultado(resultadoCalc) : '—'}
                      {derivacao.unidade && resultadoCalc != null && (
                        <span className="text-slate-400 text-[12px] font-medium ml-1">
                          {derivacao.unidade}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Data e hora */}
            <div className="flex gap-3">
              <FakeField icon={Calendar} label="Data" value="Hoje" />
              <FakeField icon={Clock} label="Hora" value="Agora" />
            </div>

            {/* Nota */}
            <div>
              <label className="text-slate-400 text-[12px] font-semibold uppercase tracking-wide">
                Nota <span className="text-slate-600 normal-case font-normal">(opcional)</span>
              </label>
              <textarea
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows={2}
                placeholder="Ex: medido em jejum, após treino…"
                className="mt-2 w-full rounded-2xl bg-slate-900 border border-slate-800 px-3 py-2.5 text-slate-100 text-[13.5px] outline-none focus:border-slate-700 resize-none placeholder:text-slate-600"
              />
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
              Fonte: Manual
            </div>
          </>
        )}
      </div>

      {/* Salvar */}
      {selecionada && !pickerOpen && (
        <div className="px-4 mt-6">
          <button
            onClick={salvar}
            disabled={!podeSalvar}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl font-semibold text-[14px] py-3 transition active:scale-[0.99] ${
              podeSalvar
                ? 'bg-teal-500 hover:bg-teal-400 text-white'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Check size={17} />
            Salvar registro
          </button>
        </div>
      )}
    </div>
  )
}

function FieldBox({
  label,
  unit,
  value,
  placeholder = '0',
  onChange,
}: {
  label: string
  unit: string
  value: string
  placeholder?: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 px-3 py-3">
      <div className="text-slate-500 text-[10.5px] font-medium mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-slate-50 font-mono font-bold text-[26px] tabular-nums outline-none placeholder:text-slate-700"
        />
        {unit && <span className="text-slate-400 text-[12px] font-medium shrink-0">{unit}</span>}
      </div>
    </div>
  )
}

function SelChipIcon({ opcao }: { opcao: MetricaOpcao }) {
  const Icon = getIcon(opcao.iconeNome)
  const color = hexFromCor(opcao.iconeCor)
  return (
    <div className={`w-9 h-9 rounded-xl ${opcao.iconeBg} flex items-center justify-center shrink-0`}>
      <Icon size={16} strokeWidth={2.2} style={{ color }} />
    </div>
  )
}

function FakeField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar
  label: string
  value: string
}) {
  return (
    <button className="flex-1 rounded-2xl bg-slate-900 border border-slate-800 px-3 py-2.5 text-left flex items-center gap-2">
      <Icon size={15} className="text-slate-500 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-slate-500 text-[10px] font-medium uppercase tracking-wide">{label}</div>
        <div className="text-slate-100 text-[13.5px] font-medium">{value}</div>
      </div>
      <ChevronRight size={15} className="text-slate-600 shrink-0" />
    </button>
  )
}
