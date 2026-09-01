import { useEffect, useState } from 'react'
import data from '@/../product-clinic/sections/chegada/data.json'
import type { ChegadaData, LinhaChegada } from '@/../product-clinic/sections/chegada/types'
import type { StatusConsulta } from '@/../product-clinic/sections/_shared/status'
import { podeTransicionar } from '@/../product-clinic/sections/_shared/status'
import { ChegadaView, acharPorCodigo, type ErroCodigo } from './components'

const DIA = data as ChegadaData

interface Toast {
  id: number
  texto: string
  tom: 'ok' | 'erro'
}
let toastSeq = 0

export default function Chegada() {
  const [linhas, setLinhas] = useState<LinhaChegada[]>(DIA.linhas)
  const [codigo, setCodigo] = useState('')
  const [erroCodigo, setErroCodigo] = useState<ErroCodigo | null>(null)
  const [busca, setBusca] = useState('')
  const [destacada, setDestacada] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string, tom: Toast['tom'] = 'ok') => {
    const id = ++toastSeq
    setToasts((t) => [...t, { id, texto, tom }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000)
  }

  // O destaque da linha recém-registrada é confirmação visual, não estado de
  // negócio — apaga sozinho e some do caminho.
  useEffect(() => {
    if (!destacada) return
    const t = setTimeout(() => setDestacada(null), 2500)
    return () => clearTimeout(t)
  }, [destacada])

  /** Grava a chegada com hora, autor e método — os três campos da #808. */
  const registrarChegada = (id: string, metodo: 'codigo' | 'manual') => {
    setLinhas((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: 'chegou' as StatusConsulta,
              chegada: { hora: DIA.agora, por: DIA.recepcionista, metodo },
              // O código morre no uso: um segundo registro com o mesmo número
              // não pode passar.
              codigo: undefined,
            }
          : l,
      ),
    )
    setDestacada(id)
  }

  const setStatus = (id: string, status: StatusConsulta) => {
    const linha = linhas.find((l) => l.id === id)
    if (!linha) return

    // A tela só oferece transições válidas, mas quem grava confere de novo:
    // guarda na origem vale mais que botão escondido.
    if (!podeTransicionar(linha.status, status)) {
      pushToast(`${linha.pacienteNome}: transição não permitida`, 'erro')
      return
    }

    if (status === 'chegou') {
      registrarChegada(id, 'manual')
      pushToast(`${linha.pacienteNome} · chegada registrada ${DIA.agora}`)
      return
    }

    setLinhas((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
    if (status === 'em-atendimento') pushToast(`${linha.pacienteNome} chamada para atendimento`)
  }

  /** Valida ao sexto dígito — sem botão de confirmar. */
  const onCodigo = (v: string) => {
    setCodigo(v)
    setErroCodigo(null)
    if (v.length < 6) return

    const r = acharPorCodigo(linhas, v)
    if ('erro' in r) {
      setErroCodigo(r.erro)
      return
    }
    registrarChegada(r.linha.id, 'codigo')
    pushToast(`${r.linha.pacienteNome} · chegada registrada ${DIA.agora}`)
    setCodigo('')
  }

  return (
    <div className="relative h-full">
      <ChegadaView
        dia={{ ...DIA, linhas }}
        codigo={codigo}
        onCodigo={onCodigo}
        erroCodigo={erroCodigo}
        busca={busca}
        onBusca={setBusca}
        destacada={destacada}
        onStatus={setStatus}
      />

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`rounded-xl px-4 py-2 text-xs font-medium text-white shadow-lg ${
              t.tom === 'erro' ? 'bg-rose-600' : 'bg-slate-900 dark:bg-slate-700'
            }`}
          >
            {t.texto}
          </div>
        ))}
      </div>
    </div>
  )
}
