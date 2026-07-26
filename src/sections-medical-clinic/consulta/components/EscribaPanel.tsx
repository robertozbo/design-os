import { useState } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  FileText,
  Loader2,
  Mic,
  PenLine,
  ShieldCheck,
  Sparkles,
  Square,
  X,
} from 'lucide-react'
import type {
  AssinaturaInfo,
  EscribaEstado,
  Modalidade,
  SOAP,
} from '@/../product-medical-clinic/sections/consulta/types'
import { formatTimer, SOAP_LABEL } from './helpers'

interface Props {
  estado: EscribaEstado
  timer: number
  modalidade: Modalidade
  pacientePrimeiroNome: string
  transcricaoVisivel: string[]
  /** Transcrição completa — fica anexada ao SOAP/assinatura. Vazio se registro manual. */
  transcricaoCompleta: string[]
  soap: SOAP
  modeloIA: string
  assinatura: AssinaturaInfo | null
  onIniciar: () => void
  onConsentir: () => void
  onRecusar: () => void
  onParar: () => void
  onSoapChange: (campo: keyof SOAP, valor: string) => void
  onAssinar: () => void
  onAbrirProntuario: () => void
}

export function EscribaPanel(props: Props) {
  const { estado } = props
  const audioFonte =
    props.modalidade === 'tele'
      ? `chamada de vídeo (você + ${props.pacientePrimeiroNome})`
      : 'microfone da sala'
  return (
    <div className="space-y-4">
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* Header do escriba */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-300">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Escriba IA</div>
            <div className="text-[10px] text-slate-400">{props.modeloIA}</div>
          </div>
        </div>
        {(estado === 'gravando' || estado === 'transcrevendo') && (
          <span className="font-mono text-sm tabular-nums text-slate-600 dark:text-slate-300">
            {formatTimer(props.timer)}
          </span>
        )}
      </div>

      <div className="p-4">
        {estado === 'inativo' && <Inativo audioFonte={audioFonte} onIniciar={props.onIniciar} />}
        {estado === 'consentimento' && (
          <Consentimento onConsentir={props.onConsentir} onRecusar={props.onRecusar} />
        )}
        {estado === 'gravando' && (
          <Gravando
            timer={props.timer}
            audioFonte={audioFonte}
            transcricao={props.transcricaoVisivel}
            onParar={props.onParar}
          />
        )}
        {estado === 'transcrevendo' && <Transcrevendo />}
      </div>
    </div>

    {/*
      A evolução existe desde o primeiro segundo da consulta, com ou sem escriba.
      O médico anota enquanto atende; a IA preenche quando é usada. Deixar o SOAP
      só depois da transcrição transformava o escriba em porteiro do atendimento —
      quem não usa (ou cujo paciente não consentiu) ficava sem onde escrever.
    */}
    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            <FileText className="h-4 w-4" />
          </span>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">Evolução</div>
            <div className="text-[10px] text-slate-400">
              {estado === 'assinado'
                ? 'Assinada'
                : estado === 'rascunho'
                  ? 'Rascunho · revise antes de assinar'
                  : 'SOAP · anote a qualquer momento'}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <SoapEditor
          soap={props.soap}
          estado={estado}
          modeloIA={props.modeloIA}
          assinatura={props.assinatura}
          transcricao={props.transcricaoCompleta}
          onChange={props.onSoapChange}
          onAssinar={props.onAssinar}
          onAbrirProntuario={props.onAbrirProntuario}
        />
      </div>
    </div>
    </div>
  )
}

/**
 * Estado ocioso em **uma linha**. Antes ocupava meia tela e empurrava a evolução para baixo da
 * dobra — mas o escriba é opcional: quem manda na tela é o SOAP, não o convite pra gravar.
 */
function Inativo({ audioFonte, onIniciar }: { audioFonte: string; onIniciar: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="min-w-0 flex-1 text-xs text-slate-500 dark:text-slate-400">
        Grava, transcreve e resume em SOAP — com consentimento do paciente. Você revisa e assina.
        <span className="ml-1.5 inline-flex items-center gap-1 text-slate-400 dark:text-slate-500">
          <Mic className="h-3 w-3" aria-hidden />
          {audioFonte}
        </span>
      </p>
      <button
        onClick={onIniciar}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-teal-500 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-600"
      >
        <Mic className="h-4 w-4" /> Iniciar gravação
      </button>
    </div>
  )
}

function Consentimento({
  onConsentir,
  onRecusar,
}: {
  onConsentir: () => void
  onRecusar: () => void
}) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
        <ShieldCheck className="h-5 w-5" />
        <h3 className="text-sm font-semibold">Consentimento — IA escriba</h3>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
        O paciente autoriza a gravação do áudio desta consulta para transcrição e geração assistida
        do registro clínico por IA. O áudio é processado conforme a LGPD e a política de privacidade
        da clínica; o texto final é revisado e assinado pelo médico.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={onConsentir}
          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-600"
        >
          <Check className="h-3.5 w-3.5" /> Paciente autoriza
        </button>
        <button
          onClick={onRecusar}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <X className="h-3.5 w-3.5" /> Registrar manualmente
        </button>
      </div>
    </div>
  )
}

function Gravando({
  timer,
  audioFonte,
  transcricao,
  onParar,
}: {
  timer: number
  audioFonte: string
  transcricao: string[]
  onParar: () => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3 dark:bg-rose-950/20">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500" />
          </span>
          <span className="text-sm font-medium text-rose-700 dark:text-rose-300">Gravando…</span>
          <Waveform />
        </div>
        <span className="font-mono text-sm tabular-nums text-rose-700 dark:text-rose-300">
          {formatTimer(timer)}
        </span>
      </div>

      <div className="mt-2 flex justify-center">
        <AudioFonteChip fonte={audioFonte} />
      </div>

      <div className="mt-3 max-h-56 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-800/30">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Transcrição ao vivo
        </div>
        {transcricao.length === 0 ? (
          <p className="text-xs italic text-slate-400">Captando áudio…</p>
        ) : (
          <ul className="space-y-1.5">
            {transcricao.map((linha, i) => (
              <li key={i} className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {linha}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={onParar}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        <Square className="h-4 w-4" /> Parar e gerar SOAP
      </button>
    </div>
  )
}

function AudioFonteChip({ fonte }: { fonte: string }) {
  return (
    <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      <Mic className="h-3 w-3 text-slate-400" />
      Áudio: {fonte}
    </span>
  )
}

function Waveform() {
  const barras = [3, 6, 4, 8, 5, 9, 4, 6, 3]
  return (
    <div className="flex items-end gap-0.5" aria-hidden>
      {barras.map((h, i) => (
        <span
          key={i}
          className="w-0.5 animate-pulse rounded-full bg-rose-400"
          style={{ height: `${h * 2}px`, animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  )
}

function Transcrevendo() {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
        IA processando a consulta…
      </h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Transcrevendo o áudio e estruturando o SOAP.
      </p>
    </div>
  )
}

function SoapEditor({
  soap,
  estado,
  modeloIA,
  assinatura,
  transcricao,
  onChange,
  onAssinar,
  onAbrirProntuario,
}: {
  soap: SOAP
  estado: EscribaEstado
  modeloIA: string
  assinatura: AssinaturaInfo | null
  transcricao: string[]
  onChange: (campo: keyof SOAP, valor: string) => void
  onAssinar: () => void
  onAbrirProntuario: () => void
}) {
  const [transcricaoAberta, setTranscricaoAberta] = useState(false)
  const assinado = estado === 'assinado'
  const campos: (keyof SOAP)[] = ['S', 'O', 'A', 'P']
  const vazio = !soap.S && !soap.O && !soap.A && !soap.P

  return (
    <div>
      {/*
        Quem gerou o texto é a TRANSCRIÇÃO, não o fato de o campo estar preenchido: com o SOAP
        aberto desde o início, texto digitado à mão encheria os campos e seria creditado à IA.
      */}
      {!assinado && (
        <div
          className={`mb-3 flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] ${
            transcricao.length > 0
              ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/30 dark:text-teal-300'
              : 'bg-slate-50 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400'
          }`}
        >
          {transcricao.length > 0 ? (
            <>
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>
                Rascunho gerado por <strong>{modeloIA}</strong>. Revise cada campo antes de assinar —
                a IA é apoio, não substitui o julgamento clínico.
              </span>
            </>
          ) : (
            <>
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span>
                Registro manual. Anote durante o atendimento e assine ao final — ou use o escriba
                acima para gerar o rascunho.
              </span>
            </>
          )}
        </div>
      )}

      <div className="space-y-3">
        {campos.map((c) => (
          <div key={c}>
            <label className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-200 text-[9px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                {c}
              </span>
              {SOAP_LABEL[c]}
            </label>
            <textarea
              value={soap[c]}
              readOnly={assinado}
              onChange={(e) => onChange(c, e.target.value)}
              rows={c === 'S' || c === 'P' ? 3 : 2}
              placeholder={assinado ? '' : `${SOAP_LABEL[c]}…`}
              className={`w-full resize-none rounded-lg border px-3 py-2 text-xs leading-relaxed text-slate-700 outline-none transition-colors dark:text-slate-200 ${
                assinado
                  ? 'border-transparent bg-slate-50 dark:bg-slate-800/50'
                  : 'border-slate-200 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Transcrição anexada — fica no registro ao finalizar */}
      {transcricao.length > 0 && (
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setTranscricaoAberta((v) => !v)}
            className="flex w-full items-center gap-2 bg-slate-50 px-3 py-2 text-left dark:bg-slate-800/50"
          >
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Transcrição da consulta
            </span>
            <span className="text-[10px] text-slate-400">· {transcricao.length} trechos</span>
            <ChevronDown
              className={`ml-auto h-4 w-4 text-slate-400 transition-transform ${
                transcricaoAberta ? 'rotate-180' : ''
              }`}
            />
          </button>
          {transcricaoAberta && (
            <ul className="max-h-52 space-y-1.5 overflow-y-auto px-3 py-2.5">
              {transcricao.map((linha, i) => (
                <li key={i} className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {linha}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {assinado && assinatura ? (
        <>
          <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <BadgeCheck className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="text-xs">
              <div className="font-semibold text-emerald-800 dark:text-emerald-200">
                Assinado por {assinatura.medicoNome}
              </div>
              <div className="text-emerald-700/80 dark:text-emerald-300/80">
                {assinatura.crm} · {assinatura.em}
                {assinatura.assistidoPorIA && ` · assistido por IA (${assinatura.modeloIA})`}
              </div>
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <FileText className="h-3.5 w-3.5 shrink-0" />
            Evolução enviada ao prontuário compartilhado do paciente.
          </p>
          <button
            onClick={onAbrirProntuario}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-600"
          >
            <FileText className="h-4 w-4" /> Abrir prontuário do paciente
            <ArrowRight className="h-4 w-4" />
          </button>
        </>
      ) : (
        <button
          onClick={onAssinar}
          disabled={vazio}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <PenLine className="h-4 w-4" /> Assinar e finalizar
        </button>
      )}
    </div>
  )
}
