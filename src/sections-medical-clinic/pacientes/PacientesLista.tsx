import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import data from '@/../product-medical-clinic/sections/pacientes/data.json'
import type {
  ClinicaCtx,
  FiltroPacientes,
  PacienteClinica,
} from '@/../product-medical-clinic/sections/pacientes/types'
import {
  PacientesLista as PacientesListaView,
  PacienteDrawer,
  PacienteForm,
  type PacienteFormValues,
  type EscopoPacientes,
} from './components'
import { iniciaisDe } from './components/helpers'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0
let novoPacienteSeq = 0

export default function PacientesListaPreview({
  escopo = 'clinico',
}: { escopo?: EscopoPacientes } = {}) {
  const navigate = useNavigate()
  const ctx = data.ctx as ClinicaCtx

  const [pacientes, setPacientes] = useState<PacienteClinica[]>(
    data.pacientes as PacienteClinica[],
  )
  const [filtro, setFiltro] = useState<FiltroPacientes>(data.filtroAtivo as FiltroPacientes)
  const [arquivados, setArquivados] = useState<Set<string>>(() => new Set())
  const [verArquivados, setVerArquivados] = useState(false)
  const [abertoId, setAbertoId] = useState<string | null>(null)
  const [formAberto, setFormAberto] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const aberto = abertoId ? pacientes.find((p) => p.id === abertoId) ?? null : null
  const emEdicao = editId ? pacientes.find((p) => p.id === editId) ?? null : null

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200)
  }

  const abrirCriar = () => {
    setEditId(null)
    setFormAberto(true)
  }

  const abrirEditar = (id: string) => {
    setAbertoId(null)
    setEditId(id)
    setFormAberto(true)
  }

  const fecharForm = () => {
    setFormAberto(false)
    setEditId(null)
  }

  const arquivar = (id: string) => {
    const p = pacientes.find((x) => x.id === id)
    setArquivados((prev) => new Set(prev).add(id))
    if (abertoId === id) setAbertoId(null)
    pushToast(`${p?.nome ?? 'Paciente'} arquivado · sai do pool ativo`)
  }

  const desarquivar = (id: string) => {
    const p = pacientes.find((x) => x.id === id)
    setArquivados((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    pushToast(`${p?.nome ?? 'Paciente'} reativado no pool`)
  }

  const salvar = (values: PacienteFormValues, id: string | null) => {
    if (id) {
      setPacientes((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                nome: values.nome,
                iniciais: iniciaisDe(values.nome),
                idade: values.idade,
                genero: values.genero,
                convenio: values.convenio,
                email: values.email.trim() || undefined,
                condicoesCronicas: values.condicoesCronicas,
              }
            : p,
        ),
      )
      pushToast(`Cadastro de ${values.nome} atualizado`)
    } else {
      const novo: PacienteClinica = {
        id: `p-novo-${++novoPacienteSeq}`,
        nome: values.nome,
        iniciais: iniciaisDe(values.nome),
        idade: values.idade,
        genero: values.genero,
        convenio: values.convenio,
        email: values.email.trim() || undefined,
        condicoesCronicas: values.condicoesCronicas,
        equipe: [],
        ultimaConsultaEm: null,
        ultimaEspecialidade: null,
        proximaConsultaEm: null,
        proximaEspecialidade: null,
        // O convite sai junto do cadastro quando o toggle está ligado (padrão da vertical Personal).
        statusApp: values.enviarConvite && values.email ? 'convite-pendente' : 'nao-convidado',
      }
      setPacientes((prev) => [novo, ...prev])
      pushToast(
        values.enviarConvite && values.email
          ? `${values.nome} adicionado · convite enviado para ${values.email}`
          : `${values.nome} adicionado ao pool da clínica`,
      )
    }
    fecharForm()
  }

  return (
    <>
      <PacientesListaView
          escopo={escopo}
        ctx={ctx}
        pacientes={pacientes}
        filtro={filtro}
        onFiltro={setFiltro}
        onAbrir={(id) => setAbertoId(id)}
        onEditar={abrirEditar}
        onArquivar={arquivar}
        onDesarquivar={desarquivar}
        arquivados={arquivados}
        verArquivados={verArquivados}
        onVerArquivados={setVerArquivados}
        onNovo={abrirCriar}
      />

      <PacienteDrawer
          escopo={escopo}
        paciente={aberto}
        onClose={() => setAbertoId(null)}
        onEditar={abrirEditar}
        onAbrirProntuario={() => navigate('/medical-clinic/sections/prontuario')}
        onAbrirAcompanhamento={() => navigate('/medical-clinic/sections/acompanhamento')}
        onConvidar={(id) => {
          const p = pacientes.find((x) => x.id === id)
          if (!p?.email) return
          const reenvio = p.statusApp === 'convite-pendente'
          // O convite deixa o paciente pendente até ele aceitar e confirmar permissões no app.
          setPacientes((prev) =>
            prev.map((x) => (x.id === id ? { ...x, statusApp: 'convite-pendente' } : x)),
          )
          pushToast(
            `Convite ${reenvio ? 'reenviado' : 'enviado'} para ${p.email} · aguardando o aceite no app`,
          )
        }}
        onNovaConsulta={() => {
          setAbertoId(null)
          navigate('/medical-clinic/sections/agenda')
        }}
      />

      {formAberto && (
        <PacienteForm
          escopo={escopo}
          key={editId ?? 'novo'}
          paciente={emEdicao}
          onClose={fecharForm}
          onSalvar={salvar}
        />
      )}

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
