import { useEffect, useState } from 'react'
import {
  Loader2,
  Mic,
  MicOff,
  MonitorUp,
  PhoneOff,
  Video,
  VideoOff,
} from 'lucide-react'
import { formatTimer } from './helpers'

interface Props {
  pacienteNome: string
  pacienteIniciais: string
  medicoNome: string
}

type Conexao = 'aguardando' | 'conectado' | 'encerrada'

export function TeleconsultaPanel({ pacienteNome, pacienteIniciais, medicoNome }: Props) {
  const [conexao, setConexao] = useState<Conexao>('aguardando')
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [duracao, setDuracao] = useState(0)

  const primeiroNome = pacienteNome.split(' ')[0]

  // Simula o paciente entrando na sala após alguns segundos.
  useEffect(() => {
    if (conexao !== 'aguardando') return
    const id = setTimeout(() => setConexao('conectado'), 2800)
    return () => clearTimeout(id)
  }, [conexao])

  // Cronômetro da chamada enquanto conectado.
  useEffect(() => {
    if (conexao !== 'conectado') return
    const id = setInterval(() => setDuracao((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [conexao])

  if (conexao === 'encerrada') {
    return (
      <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 py-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <PhoneOff className="h-6 w-6 text-slate-400" />
        <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Chamada encerrada · {formatTimer(duracao)}
        </div>
        <button
          onClick={() => {
            setDuracao(0)
            setConexao('aguardando')
          }}
          className="mt-1 text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
        >
          Reiniciar chamada
        </button>
      </div>
    )
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      {/* Palco do vídeo */}
      <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
        {/* Vídeo do paciente (placeholder) */}
        {conexao === 'aguardando' ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 className="h-7 w-7 animate-spin text-sky-400" />
            <div className="text-sm font-medium text-slate-300">
              Aguardando {primeiroNome} entrar na sala…
            </div>
            <div className="text-[11px] text-slate-500">Sala segura · link enviado ao app do paciente</div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-700 text-2xl font-semibold text-slate-200">
              {pacienteIniciais}
            </span>
            <span className="text-sm font-medium text-slate-200">{pacienteNome}</span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-slate-950/70 px-2.5 py-1 backdrop-blur-sm">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              conexao === 'conectado' ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span className="text-[11px] font-medium text-slate-200">
            {conexao === 'conectado' ? 'Conectado' : 'Chamando…'}
          </span>
        </div>

        {/* Timer */}
        {conexao === 'conectado' && (
          <div className="absolute right-3 top-3 rounded-full bg-slate-950/70 px-2.5 py-1 font-mono text-[11px] tabular-nums text-slate-200 backdrop-blur-sm">
            {formatTimer(duracao)}
          </div>
        )}

        {/* Self-view (médico) */}
        <div className="absolute bottom-3 right-3 flex h-20 w-28 flex-col items-center justify-center rounded-xl border border-slate-700 bg-slate-800">
          {camOn ? (
            <>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white">
                {iniciais(medicoNome)}
              </span>
              <span className="mt-1 text-[9px] text-slate-400">Você</span>
            </>
          ) : (
            <>
              <VideoOff className="h-5 w-5 text-slate-500" />
              <span className="mt-1 text-[9px] text-slate-500">Câmera off</span>
            </>
          )}
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-center gap-2 border-t border-slate-800 bg-slate-900 py-2.5">
        <CtrlBtn
          ativo={micOn}
          onClick={() => setMicOn((v) => !v)}
          on={<Mic className="h-4 w-4" />}
          off={<MicOff className="h-4 w-4" />}
          label={micOn ? 'Mudo' : 'Ativar'}
        />
        <CtrlBtn
          ativo={camOn}
          onClick={() => setCamOn((v) => !v)}
          on={<Video className="h-4 w-4" />}
          off={<VideoOff className="h-4 w-4" />}
          label={camOn ? 'Parar vídeo' : 'Iniciar vídeo'}
        />
        <button
          className="flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-slate-300 transition-colors hover:bg-slate-800"
        >
          <MonitorUp className="h-4 w-4" />
          <span className="text-[9px]">Compartilhar</span>
        </button>
        <button
          onClick={() => setConexao('encerrada')}
          className="flex flex-col items-center gap-0.5 rounded-lg bg-rose-600 px-3 py-1 text-white transition-colors hover:bg-rose-700"
        >
          <PhoneOff className="h-4 w-4" />
          <span className="text-[9px]">Encerrar</span>
        </button>
      </div>
    </div>
  )
}

function CtrlBtn({
  ativo,
  onClick,
  on,
  off,
  label,
}: {
  ativo: boolean
  onClick: () => void
  on: React.ReactNode
  off: React.ReactNode
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 transition-colors ${
        ativo
          ? 'text-slate-300 hover:bg-slate-800'
          : 'bg-slate-700 text-white hover:bg-slate-600'
      }`}
    >
      {ativo ? on : off}
      <span className="text-[9px]">{label}</span>
    </button>
  )
}

function iniciais(nome: string): string {
  const p = nome.replace(/^(Dra?\.?\s)/i, '').trim().split(/\s+/)
  if (p.length === 1) return p[0].slice(0, 2).toUpperCase()
  return (p[0][0] + p[p.length - 1][0]).toUpperCase()
}
