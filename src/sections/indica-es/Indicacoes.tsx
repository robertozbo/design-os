import { useState } from 'react'
import data from '@/../product/sections/indica-es/data.json'
import type {
  CanalEnvio,
  Convite,
  CanalEnvioOpcao,
  Estatistica,
  EmptyStates,
  FiltroEstado,
  FiltroEstadoId,
  IndicacoesProps,
  PerfilContexto,
  SortId,
} from '@/../product/sections/indica-es/types'
import { Indicacoes } from './components/Indicacoes'
import { NewInviteModal } from './components/NewInviteModal'
import { QrModal } from './components/QrModal'

type DataShape = {
  perfilContexto: PerfilContexto
  estatistica: Estatistica
  filtrosEstado: FiltroEstado[]
  canaisEnvio: CanalEnvioOpcao[]
  convites: Convite[]
  emptyStates: EmptyStates
}

export default function IndicacoesPreview() {
  const baseProps = data as unknown as DataShape

  const [convites, setConvites] = useState<Convite[]>(baseProps.convites)
  const [selectedEstado, setSelectedEstado] = useState<FiltroEstadoId>('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSort, setSelectedSort] = useState<SortId>('recent')
  const [newInviteOpen, setNewInviteOpen] = useState(false)
  const [qrOpenForId, setQrOpenForId] = useState<string | null>(null)

  const qrConvite = qrOpenForId ? convites.find((c) => c.id === qrOpenForId) ?? null : null

  function patchConvite(id: string, patch: Partial<Convite>) {
    setConvites((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }

  function handleResend(id: string) {
    const now = new Date().toISOString()
    patchConvite(id, {
      enviadoIso: now,
      ultimaInteracaoIso: now,
      // Extend by 30 days
      expiraIso: new Date(Date.now() + 30 * 86_400_000).toISOString(),
      estado: 'pendente',
    })
    console.log('Resend', id)
  }

  function handleCancel(id: string) {
    const now = new Date().toISOString()
    patchConvite(id, {
      estado: 'cancelado',
      canceladoIso: now,
      ultimaInteracaoIso: now,
    })
    console.log('Cancel', id)
  }

  function handleSubmitNewInvite(payload: {
    nome: string
    email: string
    telefone: string
    canais: CanalEnvio[]
  }) {
    const now = new Date().toISOString()
    const id = `conv-new-${Date.now()}`
    const code = `${baseProps.perfilContexto.codigoBase}-${String(convites.length + 1).padStart(3, '0')}`
    const initials = payload.nome
      .split(' ')
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase()
    const colors = ['amber', 'rose', 'violet', 'emerald', 'sky', 'teal', 'indigo'] as const
    const corAvatar = colors[Math.floor(Math.random() * colors.length)]

    const novo: Convite = {
      id,
      codigo: code,
      paciente: {
        nome: payload.nome,
        iniciais: initials || '??',
        corAvatar,
        email: payload.email,
        telefone: payload.telefone,
      },
      estado: 'pendente',
      canaisUsados: payload.canais,
      enviadoIso: now,
      expiraIso: new Date(Date.now() + 30 * 86_400_000).toISOString(),
      vinculadoIso: null,
      canceladoIso: null,
      ultimaInteracaoIso: now,
    }
    setConvites((list) => [novo, ...list])
    setNewInviteOpen(false)
    console.log('Create invite', novo)
  }

  const props: IndicacoesProps = {
    perfilContexto: baseProps.perfilContexto,
    estatistica: baseProps.estatistica,
    filtrosEstado: baseProps.filtrosEstado,
    canaisEnvio: baseProps.canaisEnvio,
    convites,
    emptyStates: baseProps.emptyStates,
    selectedEstado,
    onEstadoChange: setSelectedEstado,
    searchQuery,
    onSearchChange: setSearchQuery,
    selectedSort,
    onSortChange: setSelectedSort,
    onOpenNewInvite: () => setNewInviteOpen(true),
    onResend: handleResend,
    onCopyLink: (id) => {
      const c = convites.find((x) => x.id === id)
      const url = c ? `${baseProps.perfilContexto.linkBase}/${c.codigo}` : ''
      navigator.clipboard?.writeText(url).catch(() => {})
      console.log('Copy link', url)
    },
    onShowQr: (id) => setQrOpenForId(id),
    onCancel: handleCancel,
    onOpenPaciente: (id) => console.log('Open paciente from invite', id),
    onResendAllStuck: () => {
      const sevenDaysAgo = Date.now() - 7 * 86_400_000
      const targets = convites
        .filter((c) => c.estado === 'pendente' && new Date(c.enviadoIso).getTime() < sevenDaysAgo)
        .map((c) => c.id)
      const now = new Date().toISOString()
      setConvites((list) =>
        list.map((c) =>
          targets.includes(c.id)
            ? {
                ...c,
                enviadoIso: now,
                ultimaInteracaoIso: now,
                expiraIso: new Date(Date.now() + 30 * 86_400_000).toISOString(),
              }
            : c,
        ),
      )
      console.log('Resend all stuck', targets)
    },
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-indicacoes],
        [data-nymos-indicacoes] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-indicacoes] .font-mono,
        [data-nymos-indicacoes] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>

      <Indicacoes {...props} />

      <NewInviteModal
        open={newInviteOpen}
        perfilContexto={baseProps.perfilContexto}
        canaisEnvio={baseProps.canaisEnvio}
        onClose={() => setNewInviteOpen(false)}
        onSubmit={handleSubmitNewInvite}
      />

      <QrModal
        open={!!qrConvite}
        url={qrConvite ? `${baseProps.perfilContexto.linkBase}/${qrConvite.codigo}` : ''}
        codigo={qrConvite?.codigo ?? ''}
        pacienteNome={qrConvite?.paciente.nome ?? ''}
        onClose={() => setQrOpenForId(null)}
      />
    </>
  )
}
