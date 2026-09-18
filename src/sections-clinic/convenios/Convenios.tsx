import { useMemo, useState } from 'react'
import data from '@/../product-clinic/sections/convenios/data.json'
import type {
  Convenio,
  ConvenioFormValues,
  ConveniosData,
  FiltroConvenio,
} from '@/../product-clinic/sections/convenios/types'
import { ConvenioModal, ConveniosView, normalizarNome } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0
let convenioSeq = 0

export default function ConveniosPreview() {
  const base = data as unknown as ConveniosData

  const [convenios, setConvenios] = useState<Convenio[]>(base.convenios)
  const [filtro, setFiltro] = useState<FiltroConvenio>('todos')
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState<Convenio | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  /**
   * O resumo é derivado, não fixo: desativar um convênio muda "ativos" na hora, e
   * criar um convênio novo não inventa paciente nenhum. `particulares` vem do dado
   * porque é contagem do pool, e o pool não muda por esta tela.
   */
  const resumo = useMemo(
    () => ({
      ativos: convenios.filter((c) => c.ativo).length,
      conveniados: convenios.reduce((s, c) => s + c.pacientes, 0),
      particulares: base.resumo.particulares,
    }),
    [convenios, base.resumo.particulares],
  )

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  const salvar = (values: ConvenioFormValues) => {
    if (values.id) {
      setConvenios((prev) =>
        prev.map((c) =>
          c.id === values.id
            ? { ...c, nome: values.nome, codigoAns: values.codigoAns, ativo: values.ativo }
            : c,
        ),
      )
      pushToast(`Convênio “${values.nome}” atualizado`)
    } else {
      // Idempotente por nome, como o servidor: criar um que já existe reaproveita
      // a linha em vez de duplicar. É o que impede a terceira "Unimed".
      const existente = convenios.find((c) => normalizarNome(c.nome) === normalizarNome(values.nome))
      if (existente) {
        pushToast(`“${existente.nome}” já estava no catálogo`)
      } else {
        setConvenios((prev) => [
          {
            id: `novo-${++convenioSeq}`,
            nome: values.nome,
            codigoAns: values.codigoAns,
            ativo: values.ativo,
            pacientes: 0,
          },
          ...prev,
        ])
        pushToast(`Convênio “${values.nome}” criado`)
      }
    }
    setModalAberto(false)
    setEditando(null)
  }

  const toggleAtivo = (c: Convenio) => {
    setConvenios((prev) => prev.map((x) => (x.id === c.id ? { ...x, ativo: !x.ativo } : x)))
    pushToast(
      c.ativo
        ? `“${c.nome}” desativado · ${c.pacientes} pacientes continuam nele`
        : `“${c.nome}” reativado`,
    )
  }

  return (
    <>
      <ConveniosView
        resumo={resumo}
        convenios={convenios}
        filtro={filtro}
        busca={busca}
        onFiltro={setFiltro}
        onBusca={setBusca}
        onNovo={() => {
          setEditando(null)
          setModalAberto(true)
        }}
        onEditar={(c) => {
          setEditando(c)
          setModalAberto(true)
        }}
        onToggleAtivo={toggleAtivo}
      />

      {modalAberto && (
        <ConvenioModal
          convenio={editando}
          convenios={convenios}
          onSalvar={salvar}
          onFechar={() => {
            setModalAberto(false)
            setEditando(null)
          }}
        />
      )}

      <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm text-white shadow-lg dark:bg-slate-100 dark:text-slate-900"
          >
            {t.texto}
          </div>
        ))}
      </div>
    </>
  )
}
