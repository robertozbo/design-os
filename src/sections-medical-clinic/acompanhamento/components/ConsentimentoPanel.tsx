import { useState } from 'react'
import {
  CalendarDays,
  Check,
  FlaskConical,
  Info,
  Link2,
  Lock,
  RefreshCw,
  Scale,
  ShieldCheck,
  Smartphone,
  Watch,
} from 'lucide-react'
import type {
  Consentimento,
  ExameCompartilhado,
  VinculoApp,
} from '@/../product-medical-clinic/sections/acompanhamento/types'
import { desdeUltimaConsulta, diasEntre, NIVEL_META, dataExtensa } from './helpers'

interface Props {
  vinculo: VinculoApp
  consentimentos: Consentimento[]
  exames: ExameCompartilhado[]
}

/** Leitura clínica do exame — dita só a cor do badge, sem tom de alarme. */
/** Data + hora no formato da section — a data vem de `dataExtensa`, fonte única do módulo. */
function formatarDataHora(iso: string): string {
  const hora = iso.slice(11, 16)
  return hora ? `${dataExtensa(iso.slice(0, 10))} · ${hora}` : dataExtensa(iso.slice(0, 10))
}

function IconeDispositivo({ nome }: { nome: string }) {
  const n = nome.toLowerCase()
  const classe = 'h-3 w-3 shrink-0'
  if (n.includes('balança') || n.includes('balanca') || n.includes('scale')) {
    return <Scale className={classe} />
  }
  if (n.includes('watch') || n.includes('relógio') || n.includes('relogio') || n.includes('band')) {
    return <Watch className={classe} />
  }
  return <Smartphone className={classe} />
}

export function ConsentimentoPanel({ vinculo, consentimentos, exames }: Props) {
  const [notaAberta, setNotaAberta] = useState(false)

  // Referência de "hoje" vem do helper da seção (data fixa do mock) — usar `Date.now()` faria o
  // texto e a cor do ponto mudarem sozinhos a cada dia e quebraria o screenshot da tela.
  const diasSync = diasEntre(vinculo.ultimaSync.slice(0, 10))
  const syncValida = !Number.isNaN(diasSync)
  const relativo = syncValida ? desdeUltimaConsulta(vinculo.ultimaSync.slice(0, 10)) : null
  const syncAntiga = syncValida && diasSync > 2

  const liberados = consentimentos.filter((c) => c.compartilhado).length
  // Só afirmamos algo sobre autorização de exames se o escopo existir de fato na lista — caso
  // contrário a tela diria "o paciente não autorizou" sem base, que é justamente o erro que este
  // painel existe para evitar.
  const escopoExames = consentimentos.find((c) => /exame/i.test(c.escopo))

  return (
    <section className="space-y-4">
      {/* ── Vínculo com o app ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          <Link2 className="h-3.5 w-3.5" strokeWidth={2} />
          Vínculo com o app Nymos
        </h3>

        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <dt className="text-[11px] text-slate-500 dark:text-slate-400">Usa o app desde</dt>
              <dd className="text-sm font-medium tabular-nums text-slate-800 dark:text-slate-100">
                {dataExtensa(vinculo.desde)}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <dt className="text-[11px] text-slate-500 dark:text-slate-400">
                Última sincronização
              </dt>
              <dd className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    !syncValida
                      ? 'bg-slate-300 dark:bg-slate-600'
                      : syncAntiga
                        ? 'bg-amber-500 dark:bg-amber-400'
                        : 'bg-emerald-500 dark:bg-emerald-400'
                  }`}
                />
                <span className="text-sm font-medium tabular-nums text-slate-800 dark:text-slate-100">
                  {relativo ?? formatarDataHora(vinculo.ultimaSync)}
                </span>
                {relativo && (
                  <span className="text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                    {formatarDataHora(vinculo.ultimaSync)}
                  </span>
                )}
              </dd>
            </div>
          </div>
        </dl>

        <div className="mt-3.5 border-t border-slate-100 pt-3 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Dispositivos conectados
          </span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {vinculo.dispositivos.length === 0 ? (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Nenhum dispositivo conectado — os dados chegam digitados pelo paciente.
              </span>
            ) : (
              vinculo.dispositivos.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  <IconeDispositivo nome={d} />
                  {d}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Consentimentos ──────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
            O que o paciente autorizou
          </h3>
          <div className="flex items-center gap-1.5">
            {consentimentos.length > 0 && (
              <span className="text-[11px] font-medium tabular-nums text-slate-500 dark:text-slate-400">
                {liberados} de {consentimentos.length} escopos liberados
              </span>
            )}
            <button
              type="button"
              onClick={() => setNotaAberta((v) => !v)}
              aria-label="Sobre o compartilhamento de dados"
              title="Sobre o compartilhamento de dados"
              aria-expanded={notaAberta}
              aria-controls="consentimento-nota"
              className={`flex h-6 w-6 items-center justify-center rounded-lg transition-colors ${
                notaAberta
                  ? 'bg-teal-500/10 text-teal-700 dark:text-teal-300'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              <Info className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          </div>
        </div>

        <p
          id="consentimento-nota"
          hidden={!notaAberta}
          className="mt-2.5 rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500 dark:bg-slate-800/40 dark:text-slate-400"
        >
          O paciente controla cada escopo no app e pode revogar a qualquer momento. Escopos não
          liberados continuam listados aqui de propósito: ausência de autorização não é ausência de
          dado.
        </p>

        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {consentimentos.length === 0 ? (
            <li className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500 sm:col-span-2 dark:border-slate-700 dark:text-slate-400">
              Nenhum escopo de compartilhamento registrado.
            </li>
          ) : (
            consentimentos.map((c) => (
              <li
                key={c.escopo}
                className={`flex items-center gap-2.5 rounded-xl border p-2.5 ${
                  c.compartilhado
                    ? 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
                    : 'border-dashed border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    c.compartilhado
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                  }`}
                >
                  {c.compartilhado ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    <Lock className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                </span>
                <div className="min-w-0">
                  <div
                    className={`truncate text-sm font-medium ${
                      c.compartilhado
                        ? 'text-slate-800 dark:text-slate-100'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {c.escopo}
                  </div>
                  <div className="truncate text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                    {c.compartilhado
                      ? c.desde
                        ? `Compartilhado desde ${dataExtensa(c.desde)}`
                        : 'Compartilhado'
                      : 'Não compartilhado'}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* ── Exames compartilhados pelo app ──────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <FlaskConical className="h-3.5 w-3.5" strokeWidth={2} />
            Exames compartilhados pelo paciente
          </h3>
          {exames.length > 0 && (
            <span className="text-[11px] font-medium tabular-nums text-slate-500 dark:text-slate-400">
              {exames.length} {exames.length === 1 ? 'exame' : 'exames'}
            </span>
          )}
        </div>

        <ul className="mt-3 space-y-2">
          {exames.length === 0 ? (
            <li className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
              {escopoExames === undefined
                ? 'Nenhum exame compartilhado pelo app.'
                : escopoExames.compartilhado
                  ? 'O escopo está liberado, mas o paciente ainda não compartilhou exames pelo app.'
                  : 'O paciente não autorizou o compartilhamento de exames — pode haver exames no app que a clínica não vê.'}
            </li>
          ) : (
            exames.map((e) => (
              <li
                key={e.id}
                className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-800"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <FlaskConical className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {e.nome}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${NIVEL_META[e.nivel].badge}`}
                    >
                      {NIVEL_META[e.nivel].label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {e.resumo}
                  </p>
                </div>
                <span className="shrink-0 text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                  {dataExtensa(e.data)}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  )
}
