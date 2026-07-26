import { useState } from 'react'
import data from '@/../product-medical-clinic/sections/encaminhamento/data.json'
import type {
  Direcao,
  Encaminhamento,
  EncaminhamentoData,
} from '@/../product-medical-clinic/sections/encaminhamento/types'
import { EncaminhamentosView, NovoEncaminhamentoModal } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0

export default function EncaminhamentosPreview() {
  const base = data as unknown as EncaminhamentoData

  const [recebidos, setRecebidos] = useState<Encaminhamento[]>(base.recebidos)
  const [enviados, setEnviados] = useState<Encaminhamento[]>(base.enviados)
  const [aba, setAba] = useState<Direcao>('recebido')
  const [novoAberto, setNovoAberto] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  const atualizarStatus = (id: string, status: Encaminhamento['status']) =>
    setRecebidos((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)))

  return (
    <>
      <EncaminhamentosView
        clinica={base.clinica}
        aba={aba}
        recebidos={recebidos}
        enviados={enviados}
        onAba={setAba}
        onNovo={() => setNovoAberto(true)}
        onAceitar={(e) => {
          atualizarStatus(e.id, 'aceito')
          pushToast(`Vínculo com ${e.paciente.nome} assumido · registrado no audit log`)
        }}
        onRecusar={(e) => {
          atualizarStatus(e.id, 'recusado')
          pushToast(`Encaminhamento de ${e.paciente.nome} recusado`)
        }}
        onAbrir={(e) => pushToast(`Protótipo: abriria o contexto clínico de ${e.paciente.nome}`)}
      />

      {novoAberto && (
        <NovoEncaminhamentoModal
          pacientes={base.pacientes}
          colegas={base.colegas}
          onFechar={() => setNovoAberto(false)}
          onEnviar={(dados) => {
            setNovoAberto(false)
            setAba('enviado')
            // Grava o que o médico preencheu — motivo, contexto, itens e consentimento vinham
            // fixos daqui, então o registro afirmava um escopo de compartilhamento que podia não
            // ser o escolhido.
            const novo: Encaminhamento = {
              id: `enc-novo-${++toastSeq}`,
              direcao: 'enviado',
              contraparte: base.colegas.find((c) => c.nome === dados.colegaNome)!,
              paciente: base.pacientes.find((p) => p.nome === dados.pacienteNome)!,
              motivo: dados.motivo,
              contexto: dados.contexto,
              compartilhado: dados.compartilhado,
              consentimentoPaciente: dados.consentimentoPaciente,
              status: 'pendente',
              em: 'agora',
            }
            setEnviados((prev) => [novo, ...prev])
            pushToast(
              `Encaminhamento enviado a ${dados.colegaNome} · ${dados.compartilhado.length} item(ns) compartilhado(s)`,
            )
          }}
        />
      )}

      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-4">
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
