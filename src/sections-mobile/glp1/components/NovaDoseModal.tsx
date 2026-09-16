import { useMemo, useState } from 'react'
import { X, Syringe, Lightbulb, ChevronDown, Check } from 'lucide-react'
import {
  PRINCIPIO_LABEL,
  type Glp1Configuracao,
  type MedicamentoCatalogo,
  type NovaAplicacaoPayload,
  type SitioAplicacao,
} from '@/../product-mobile/sections/glp1/types'
import { MapaSitios } from './MapaSitios'

interface Props {
  open: boolean
  catalogo: MedicamentoCatalogo[]
  configuracao: Glp1Configuracao
  sitiosRecentes: SitioAplicacao[]
  sitioSaturado: SitioAplicacao | null
  onClose: () => void
  onSalvar: (payload: NovaAplicacaoPayload) => void
}

const DOR_LABEL = (n: number): string => {
  if (n === 0) return 'Nenhuma dor'
  if (n <= 2) return 'Leve'
  if (n <= 5) return 'Moderada'
  if (n <= 8) return 'Forte'
  return 'Insuportável'
}

const DOR_COLOR = (n: number): string => {
  if (n <= 2) return 'text-emerald-300'
  if (n <= 5) return 'text-amber-300'
  if (n <= 8) return 'text-orange-300'
  return 'text-rose-300'
}

const AGORA_ISO = '2026-09-16T20:00'

export function NovaDoseModal({
  open,
  catalogo,
  configuracao,
  sitiosRecentes,
  sitioSaturado,
  onClose,
  onSalvar,
}: Props) {
  const [medicamentoId, setMedicamentoId] = useState(configuracao.medicamentoId)
  const [trocandoMed, setTrocandoMed] = useState(false)
  const [dose, setDose] = useState<string | null>(configuracao.dose)
  const [doseCustom, setDoseCustom] = useState('')
  const [sitio, setSitio] = useState<SitioAplicacao | null>(null)
  const [dor, setDor] = useState(2)
  const [observacao, setObservacao] = useState('')
  const [quando, setQuando] = useState(AGORA_ISO)
  const [peso, setPeso] = useState('')

  const medicamento = useMemo(
    () => catalogo.find((m) => m.id === medicamentoId) ?? catalogo[0],
    [catalogo, medicamentoId],
  )

  const doseFinal = dose === '__custom__' ? `${doseCustom.trim()} mg` : dose
  const podeSalvar = !!sitio && !!doseFinal && doseFinal.trim() !== 'mg'

  if (!open) return null

  const salvar = () => {
    if (!sitio || !doseFinal) return
    onSalvar({
      medicamentoId,
      dose: doseFinal,
      sitio,
      dor,
      observacao: observacao.trim() || null,
      aplicadaEm: `${quando}:00-03:00`,
      pesoKg: peso ? Number(peso.replace(',', '.')) : null,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <button
        onClick={onClose}
        aria-label="Fechar"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      {/* Sheet */}
      <div className="relative flex flex-col max-h-[94%] rounded-t-3xl bg-slate-950 border-t border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3.5 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 flex items-center justify-center">
              <Syringe size={15} strokeWidth={2.2} className="text-teal-300" />
            </div>
            <div>
              <div className="text-slate-50 text-[15px] font-semibold leading-tight">
                Nova dose
              </div>
              <div className="text-slate-500 text-[11px]">
                Registre a aplicação de hoje
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 -mr-1 rounded-lg flex items-center justify-center hover:bg-slate-800"
          >
            <X size={17} className="text-slate-400" />
          </button>
        </div>

        {/* Corpo — tudo numa tela só */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 no-scrollbar">
          {/* 1. Medicamento */}
          <Bloco numero={1} titulo="Medicamento">
            <button
              onClick={() => setTrocandoMed(!trocandoMed)}
              className="w-full flex items-center gap-3 rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 text-left"
            >
              <div className="flex-1 min-w-0">
                <div className="text-slate-100 text-[14px] font-medium truncate">
                  {medicamento.nome}
                </div>
                <div className="text-slate-500 text-[11px]">
                  {PRINCIPIO_LABEL[medicamento.principio]} ·{' '}
                  {medicamento.via === 'oral' ? 'oral' : 'subcutâneo'}
                </div>
              </div>
              <span className="shrink-0 text-teal-300 text-[12px] font-medium flex items-center gap-1">
                Trocar
                <ChevronDown
                  size={13}
                  className={`transition-transform ${trocandoMed ? 'rotate-180' : ''}`}
                />
              </span>
            </button>

            {trocandoMed && (
              <div className="mt-2 max-h-52 overflow-y-auto rounded-xl border border-slate-800 divide-y divide-slate-800 no-scrollbar">
                {catalogo.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMedicamentoId(m.id)
                      setDose(m.id === configuracao.medicamentoId ? configuracao.dose : null)
                      setTrocandoMed(false)
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left ${
                      m.id === medicamentoId ? 'bg-teal-500/10' : 'bg-slate-900'
                    }`}
                  >
                    <span
                      className={`text-[13px] ${
                        m.id === medicamentoId
                          ? 'text-teal-200 font-medium'
                          : 'text-slate-200'
                      }`}
                    >
                      {m.nome}
                    </span>
                    {m.id === medicamentoId && (
                      <Check size={13} strokeWidth={3} className="text-teal-300 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </Bloco>

          {/* 2. Dose */}
          <Bloco numero={2} titulo="Dose aplicada">
            <div className="flex flex-wrap gap-2">
              {medicamento.doses.map((d) => (
                <button
                  key={d}
                  onClick={() => setDose(d)}
                  className={`rounded-full border px-3.5 py-1.5 font-mono tabular-nums text-[13px] transition-all active:scale-[0.97] ${
                    dose === d
                      ? 'bg-teal-500/15 border-teal-400 text-teal-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => setDose('__custom__')}
                className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-all ${
                  dose === '__custom__'
                    ? 'bg-teal-500/15 border-teal-400 text-teal-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                Outra
              </button>
            </div>
            {dose === '__custom__' && (
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/5 px-3 py-2">
                <input
                  autoFocus
                  inputMode="decimal"
                  value={doseCustom}
                  onChange={(e) => setDoseCustom(e.target.value)}
                  placeholder="0,0"
                  className="flex-1 bg-transparent outline-none font-mono tabular-nums text-[16px] text-slate-50 placeholder:text-slate-600"
                />
                <span className="font-mono text-[12px] text-slate-400">mg</span>
              </div>
            )}
            {configuracao.dose && dose === configuracao.dose && (
              <p className="mt-1.5 text-[10.5px] text-slate-500">
                Mesma dose do seu protocolo atual.
              </p>
            )}
          </Bloco>

          {/* 3. Local */}
          <Bloco numero={3} titulo="Local da aplicação">
            <MapaSitios
              selecionado={sitio}
              sitiosRecentes={sitiosRecentes}
              sitioSaturado={sitioSaturado}
              onChange={setSitio}
            />
          </Bloco>

          {/* 4. Dor */}
          <Bloco numero={4} titulo="Nível de dor">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 px-4 py-3">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <span
                    className={`font-mono tabular-nums text-[34px] font-bold leading-none ${DOR_COLOR(dor)}`}
                  >
                    {dor}
                  </span>
                  <span className="text-slate-600 font-mono text-[13px]">/10</span>
                </div>
                <span className={`text-[13px] font-medium ${DOR_COLOR(dor)}`}>
                  {DOR_LABEL(dor)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={dor}
                onChange={(e) => setDor(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
              <div className="flex justify-between mt-0.5 text-[10px] text-slate-500 font-mono">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
            {dor >= 7 && (
              <div className="mt-2 rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 flex items-start gap-2">
                <Lightbulb size={13} className="text-amber-300 mt-0.5 shrink-0" />
                <ul className="text-amber-100/80 text-[11.5px] space-y-0.5 list-disc pl-3.5">
                  <li>Gire o sítio a cada aplicação</li>
                  <li>Injete devagar (5–10s)</li>
                  <li>Deixe a caneta chegar à temperatura ambiente</li>
                  <li>Se persistir, fale com seu médico</li>
                </ul>
              </div>
            )}
          </Bloco>

          {/* 5. Observação */}
          <Bloco numero={5} titulo="Observação" opcional>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
              maxLength={280}
              placeholder="Náusea, apetite, energia, qualquer coisa que queira lembrar depois…"
              className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-3 text-[13px] text-slate-100 placeholder:text-slate-600 outline-none focus:border-slate-700 resize-none leading-snug"
            />
            <div className="mt-1 text-right font-mono text-[10px] text-slate-600 tabular-nums">
              {observacao.length}/280
            </div>
          </Bloco>

          {/* 6. Quando + peso do dia */}
          <Bloco numero={6} titulo="Quando" opcional>
            <div className="rounded-xl bg-slate-900 border border-slate-800 px-4 py-3 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400 text-[12.5px] shrink-0">
                  Data e hora
                </span>
                <input
                  type="datetime-local"
                  value={quando}
                  onChange={(e) => setQuando(e.target.value)}
                  className="bg-transparent outline-none font-mono tabular-nums text-[13px] text-slate-100 text-right"
                />
              </div>
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <span className="text-slate-400 text-[12.5px] shrink-0">
                  Peso de hoje
                </span>
                <div className="flex items-baseline gap-1.5">
                  <input
                    inputMode="decimal"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    placeholder="—"
                    className="w-16 bg-transparent outline-none font-mono tabular-nums text-[15px] font-semibold text-slate-50 placeholder:text-slate-600 text-right"
                  />
                  <span className="font-mono text-[12px] text-slate-500">kg</span>
                </div>
              </div>
            </div>
          </Bloco>
        </div>

        {/* Footer */}
        <div className="px-4 pt-3 pb-5 border-t border-slate-800 bg-slate-950">
          <button
            onClick={salvar}
            disabled={!podeSalvar}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-[14px] font-semibold transition-all ${
              podeSalvar
                ? 'bg-teal-500 text-slate-950 active:scale-[0.99]'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <Syringe size={15} strokeWidth={2.3} />
            Salvar aplicação
          </button>
          {!podeSalvar && (
            <p className="mt-2 text-center text-[11px] text-slate-500">
              {!doseFinal || doseFinal.trim() === 'mg'
                ? 'Escolha a dose aplicada'
                : 'Escolha o local da aplicação'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Bloco({
  numero,
  titulo,
  opcional = false,
  children,
}: {
  numero: number
  titulo: string
  opcional?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 font-mono text-[9.5px] flex items-center justify-center tabular-nums">
          {numero}
        </span>
        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
          {titulo}
        </span>
        {opcional && (
          <span className="text-[10px] text-slate-600 lowercase tracking-normal">
            opcional
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
