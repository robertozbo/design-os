import { useEffect, useMemo, useState } from 'react'
import { RefreshCw, X } from 'lucide-react'
import type {
  CodigoDeChegada as Codigo,
  Consulta,
} from '@/../product-mobile/sections/consultas/types'

interface Props {
  consulta: Consulta
  codigo: Codigo
  onFechar: () => void
}

const VIDA_SEGUNDOS = 5 * 60

/**
 * O código de chegada (#808): seis dígitos que vivem cinco minutos. Não é
 * credencial: é um ponteiro curto para a consulta, que a recepção digita ou lê
 * com o leitor do balcão. Por isso o QR carrega só os dígitos.
 */
export function CodigoDeChegada({ consulta, codigo, onFechar }: Props) {
  // No protótipo a contagem parte da vida inteira; no app ela sai de `expiraEm`.
  const [restante, setRestante] = useState(VIDA_SEGUNDOS)

  useEffect(() => {
    const t = setInterval(() => setRestante((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const expirou = restante === 0
  const local = consulta.local

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button aria-label="Fechar" onClick={onFechar} className="absolute inset-0 bg-black/60" />

      <div className="relative bg-slate-950 border-t border-slate-800 rounded-t-3xl px-5 pt-2 pb-7">
        <div className="w-10 h-1 rounded-full bg-slate-700 mx-auto" />

        <div className="flex items-center justify-between mt-3">
          <div>
            <div className="text-slate-100 font-semibold text-[15px]">Código de chegada</div>
            <div className="text-slate-500 text-[11px]">
              {local ? [local.clinicaNome, local.sala].filter(Boolean).join(' · ') : 'Recepção'} ·{' '}
              <span className="font-mono tabular-nums">{consulta.hora}</span>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="w-9 h-9 rounded-full bg-slate-800/70 flex items-center justify-center text-slate-300"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        <div className={`mt-5 rounded-3xl bg-white p-5 flex flex-col items-center ${expirou ? 'opacity-30' : ''}`}>
          <QrFalso conteudo={codigo.codigo} />
          <div className="mt-4 text-slate-900 font-mono tabular-nums text-[34px] font-semibold tracking-[0.25em] pl-[0.25em]">
            {codigo.codigo}
          </div>
        </div>

        <p className="text-center text-slate-400 text-[12px] mt-4 leading-relaxed">
          Mostre na recepção. A atendente lê o QR ou digita os seis números.
        </p>

        {expirou ? (
          <button
            onClick={() => setRestante(VIDA_SEGUNDOS)}
            className="mt-4 w-full h-11 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-[13px] font-semibold flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} strokeWidth={2.4} />
            Gerar novo código
          </button>
        ) : (
          <div className="mt-4 text-center text-slate-500 text-[11.5px]">
            Vale por mais <span className="text-slate-200 font-mono tabular-nums">{mmss(restante)}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function mmss(segundos: number): string {
  return `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`
}

/** Só ilustração: um padrão estável a partir dos dígitos, com os três marcadores de canto. */
function QrFalso({ conteudo }: { conteudo: string }) {
  const N = 21
  const celulas = useMemo(() => {
    let semente = [...conteudo].reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 7)
    const proximo = () => {
      semente = (semente * 1103515245 + 12345) % 2147483648
      return semente / 2147483648
    }
    return Array.from({ length: N * N }, () => proximo() > 0.52)
  }, [conteudo])

  const noMarcador = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7)

  const marcador = (x: number, y: number) => {
    const lx = x >= N - 7 ? x - (N - 7) : x
    const ly = y >= N - 7 ? y - (N - 7) : y
    const borda = lx === 0 || lx === 6 || ly === 0 || ly === 6
    const miolo = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4
    return borda || miolo
  }

  return (
    <div className="grid w-44 h-44" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
      {celulas.map((preenchida, i) => {
        const x = i % N
        const y = Math.floor(i / N)
        const on = noMarcador(x, y) ? marcador(x, y) : preenchida
        return <div key={i} className={on ? 'bg-slate-900' : 'bg-white'} />
      })}
    </div>
  )
}
