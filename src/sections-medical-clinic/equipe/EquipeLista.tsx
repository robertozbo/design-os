import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import data from '@/../product-medical-clinic/sections/equipe/data.json'
import type {
  MedicalClinicResumo,
  ConviteEquipe,
  FiltroEquipe,
  MembroEquipe,
} from '@/../product-medical-clinic/sections/equipe/types'
import { EquipeLista as EquipeListaView } from './components/EquipeLista'
import { ConvidarMembroDrawer } from './components/ConvidarMembroDrawer'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0
let conviteSeq = 0

interface Confirmacao {
  titulo: string
  corpo: string
  confirmarLabel: string
  onConfirmar: () => void
}

export default function EquipeListaPreview() {
  const clinicaBase = data.clinica as MedicalClinicResumo

  const [membros, setMembros] = useState<MembroEquipe[]>(data.membros as MembroEquipe[])
  const [convites, setConvites] = useState<ConviteEquipe[]>(data.convites as ConviteEquipe[])
  const [filtro, setFiltro] = useState<FiltroEquipe>(data.filtroAtivo as FiltroEquipe)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [confirmacao, setConfirmacao] = useState<Confirmacao | null>(null)

  const medicosAtivos = membros.filter(
    (m) => m.papel === 'medico' && m.status === 'ativo',
  ).length
  const clinica: MedicalClinicResumo = {
    ...clinicaBase,
    plano: { ...clinicaBase.plano, medicosUsados: medicosAtivos },
  }
  const noLimite = medicosAtivos >= clinica.plano.medicosLimite

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }

  return (
    <>
      <EquipeListaView
        clinica={clinica}
        membros={membros}
        convites={convites}
        filtro={filtro}
        onFiltro={setFiltro}
        onConvidar={() => setDrawerOpen(true)}
        onReenviarConvite={(id) => {
          const c = convites.find((c) => c.id === id)
          pushToast(`Convite reenviado para ${c?.email ?? 'membro'}`)
        }}
        onRevogarConvite={(id) => {
          const c = convites.find((c) => c.id === id)
          setConfirmacao({
            titulo: 'Revogar convite',
            corpo: `O convite para ${c?.email ?? ''} será cancelado. A pessoa não poderá mais aceitá-lo.`,
            confirmarLabel: 'Revogar',
            onConfirmar: () => {
              setConvites((prev) => prev.filter((c) => c.id !== id))
              setMembros((prev) =>
                prev.filter((m) => !(m.status === 'convite-pendente' && m.email === c?.email)),
              )
              pushToast('Convite revogado · registrado no log')
              setConfirmacao(null)
            },
          })
        }}
        onEditarPapel={(id) => {
          const m = membros.find((m) => m.id === id)
          pushToast(`Editar papel de ${m?.nome ?? 'membro'} (mock)`)
        }}
        onRemoverMembro={(id) => {
          const m = membros.find((m) => m.id === id)
          if (!m) return
          const ultimoAdmin =
            m.papel === 'admin' &&
            membros.filter((x) => x.papel === 'admin' && x.status === 'ativo').length <= 1
          if (ultimoAdmin) {
            pushToast('Não é possível remover o último Admin da clínica')
            return
          }
          const temPacientes = (m.pacientesAtivos ?? 0) > 0
          setConfirmacao({
            titulo: `Remover ${m.nome}`,
            corpo: temPacientes
              ? `${m.nome} tem ${m.pacientesAtivos} pacientes ativos. Eles permanecem na clínica, mas os vínculos precisarão ser reatribuídos ou encaminhados a outro médico.`
              : `${m.nome} perderá o acesso à clínica imediatamente.`,
            confirmarLabel: 'Remover',
            onConfirmar: () => {
              setMembros((prev) => prev.filter((x) => x.id !== id))
              pushToast(`${m.nome} removido · registrado no log`)
              setConfirmacao(null)
            },
          })
        }}
      />

      {drawerOpen && (
        <ConvidarMembroDrawer
          key="convite-novo"
          limiteMedicosAtingido={noLimite}
          onClose={() => setDrawerOpen(false)}
          onEnviar={(form) => {
            const novoConvite: ConviteEquipe = {
              id: `inv-${++conviteSeq}`,
              email: form.email,
              papel: form.papel,
              especialidade: form.papel === 'medico' ? form.especialidade : undefined,
              enviadoEm: '2026-07-20',
              expiraEm: '2026-07-27',
              enviadoPor: 'Roberto Dias',
            }
            setConvites((prev) => [novoConvite, ...prev])
            setDrawerOpen(false)
            pushToast(`Convite enviado para ${form.email}`)
          }}
        />
      )}

      {/* Dialog de confirmação */}
      {confirmacao && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setConfirmacao(null)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                  {confirmacao.titulo}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {confirmacao.corpo}
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmacao(null)}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmacao.onConfirmar}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
              >
                {confirmacao.confirmarLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
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
