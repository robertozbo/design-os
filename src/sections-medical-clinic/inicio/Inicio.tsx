import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import data from '@/../product-medical-clinic/sections/inicio/data.json'
import type {
  ConsultaDia,
  EncaminhamentoRecebido,
  InicioData,
} from '@/../product-medical-clinic/sections/inicio/types'
import { InicioView } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

export default function InicioPreview() {
  const navigate = useNavigate()
  const base = data as unknown as InicioData

  const [aceitos, setAceitos] = useState<Set<string>>(new Set())
  const [agendaDia, setAgendaDia] = useState<ConsultaDia[]>(base.agendaDia)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  const encaminhamentos = base.encaminhamentos.filter((e) => !aceitos.has(e.id))

  const onAceitar = (e: EncaminhamentoRecebido) => {
    setAceitos((prev) => new Set(prev).add(e.id))
    pushToast(`Vínculo de cuidado com ${e.paciente.nome} assumido`)
  }

  const onIniciarConsulta = (c: ConsultaDia) => {
    if (c.status !== 'em-atendimento') {
      setAgendaDia((prev) =>
        prev.map((x) => (x.id === c.id ? { ...x, status: 'em-atendimento' } : x)),
      )
    }
    pushToast(
      c.status === 'em-atendimento'
        ? `Retomando consulta de ${c.paciente.nome}`
        : `Iniciando consulta de ${c.paciente.nome}`,
    )
    navigate('/medical-clinic/sections/consulta')
  }

  return (
    <>
      <InicioView
        dados={{ ...base, agendaDia, encaminhamentos }}
        onIniciarConsulta={onIniciarConsulta}
        onAlerta={(a) => {
          if (a.href === '/medical-clinic/sections/inicio') return
          navigate(a.href)
        }}
        onAceitarEncaminhamento={onAceitar}
        onAbrirEncaminhamento={(e) =>
          pushToast(`Protótipo: abriria o contexto clínico de ${e.paciente.nome}`)
        }
      />

      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[55] flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto w-full rounded-xl border border-emerald-200/80 bg-emerald-50/95 px-4 py-2.5 text-sm text-emerald-900 shadow-lg backdrop-blur-sm dark:border-emerald-900/50 dark:bg-emerald-950/90 dark:text-emerald-100"
          >
            {t.texto}
          </div>
        ))}
      </div>
    </>
  )
}
