import { useMemo, useState } from 'react'
import {
  CalendarX2,
  Check,
  ChevronRight,
  Clock,
  Hourglass,
  MapPin,
  QrCode,
  Video,
} from 'lucide-react'
import type {
  Consulta,
  ConsultasAba,
  ConsultasProps,
} from '@/../product-mobile/sections/consultas/types'
import {
  STATUS_VISUAL,
  TIPO_VISUAL,
  chaveDoMes,
  diaCurto,
  horaDeIso,
  horaFim,
  iniciais,
  liberacaoTeleconsulta,
  separar,
} from './formato'
import { ConsultaDetalhe } from './ConsultaDetalhe'
import { CodigoDeChegada } from './CodigoDeChegada'

export function Consultas({
  data,
  abaInicial = 'proximas',
  onGerarCodigoDeChegada,
  onEntrarTeleconsulta,
  onAdicionarCalendario,
  onConversar,
  onVerProfissionais,
}: ConsultasProps) {
  const [aba, setAba] = useState<ConsultasAba>(abaInicial)
  const [detalhe, setDetalhe] = useState<Consulta | null>(null)
  const [chegada, setChegada] = useState<Consulta | null>(null)

  const { proximas, anteriores } = useMemo(() => separar(data.consultas, data.hoje), [data])
  const deHoje = proximas.filter((c) => c.data === data.hoje)
  const futuras = proximas.filter((c) => c.data !== data.hoje)

  const abrirChegada = (consulta: Consulta) => {
    onGerarCodigoDeChegada?.(consulta.id)
    setDetalhe(null)
    setChegada(consulta)
  }

  const acoes = {
    agora: data.agora,
    onCheckIn: abrirChegada,
    onEntrar: (c: Consulta) => c.meetLink && onEntrarTeleconsulta?.(c.id, c.meetLink),
  }

  if (data.consultas.length === 0) {
    return (
      <div className="min-h-full bg-slate-950 px-4 pt-10">
        <Vazio onVerProfissionais={onVerProfissionais} />
      </div>
    )
  }

  return (
    <div className="min-h-full bg-slate-950 pb-6">
      <div className="px-4 pt-3 pb-2 flex gap-1.5">
        <TabButton label="Próximas" counter={proximas.length} active={aba === 'proximas'} onClick={() => setAba('proximas')} />
        <TabButton label="Anteriores" counter={anteriores.length} active={aba === 'anteriores'} onClick={() => setAba('anteriores')} />
      </div>

      {aba === 'proximas' && (
        <div className="px-4 pt-2 space-y-5">
          {deHoje.length > 0 && (
            <section className="space-y-2.5">
              <Rotulo>Hoje</Rotulo>
              {deHoje.map((c) => (
                <CardDeHoje key={c.id} consulta={c} {...acoes} onAbrir={() => setDetalhe(c)} />
              ))}
            </section>
          )}

          {agruparPorMes(futuras).map(([mes, lista]) => (
            <section key={mes} className="space-y-2">
              <Rotulo>{mes}</Rotulo>
              {lista.map((c) => (
                <CardConsulta key={c.id} consulta={c} onClick={() => setDetalhe(c)} />
              ))}
            </section>
          ))}

          {proximas.length === 0 && (
            <p className="text-center text-slate-500 text-[12px] py-10">
              Nenhuma consulta marcada daqui para frente.
            </p>
          )}
        </div>
      )}

      {aba === 'anteriores' && (
        <div className="px-4 pt-2 space-y-2">
          {anteriores.map((c) => (
            <CardConsulta key={c.id} consulta={c} passada onClick={() => setDetalhe(c)} />
          ))}
        </div>
      )}

      {detalhe && (
        <ConsultaDetalhe
          consulta={detalhe}
          ehHoje={detalhe.data === data.hoje}
          agora={data.agora}
          onFechar={() => setDetalhe(null)}
          onCheckIn={() => abrirChegada(detalhe)}
          onEntrar={() => acoes.onEntrar(detalhe)}
          onAdicionarCalendario={() => onAdicionarCalendario?.(detalhe.id)}
          onConversar={() => onConversar?.(detalhe.profissional.id)}
        />
      )}

      {chegada && (
        <CodigoDeChegada
          consulta={chegada}
          codigo={data.codigoDeChegadaExemplo}
          onFechar={() => setChegada(null)}
        />
      )}
    </div>
  )
}

function agruparPorMes(consultas: Consulta[]): [string, Consulta[]][] {
  const grupos = new Map<string, Consulta[]>()
  for (const c of consultas) {
    const chave = chaveDoMes(c.data)
    grupos.set(chave, [...(grupos.get(chave) ?? []), c])
  }
  return [...grupos.entries()]
}

// ─────────────────────────────────────────────────────────────────────────────

function Rotulo({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-slate-500 text-[10.5px] font-semibold uppercase tracking-wider first-letter:uppercase">
      {children}
    </div>
  )
}

interface TabButtonProps {
  label: string
  counter: number
  active: boolean
  onClick: () => void
}

function TabButton({ label, counter, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 h-9 rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1.5 ${
        active ? 'bg-slate-800 text-slate-50' : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      {label}
      {counter > 0 && (
        <span
          className={`min-w-4 h-4 px-1 rounded-full text-[9.5px] font-bold flex items-center justify-center font-mono tabular-nums ${
            active ? 'bg-slate-950 text-slate-300' : 'bg-slate-800 text-slate-400'
          }`}
        >
          {counter}
        </span>
      )}
    </button>
  )
}

export function SeloTipo({ tipo }: { tipo: Consulta['profissional']['tipo'] }) {
  const visual = TIPO_VISUAL[tipo]
  const Icon = visual.icon
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${visual.bg} ${visual.text} font-semibold uppercase tracking-wider text-[9px]`}>
      <Icon size={9} strokeWidth={2.4} />
      {visual.label}
    </span>
  )
}

export function SeloStatus({ consulta }: { consulta: Consulta }) {
  if (consulta.cancelamentoPedido && consulta.status !== 'cancelled') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold text-[9.5px]">
        <Hourglass size={9} strokeWidth={2.4} />
        Cancelamento pedido
      </span>
    )
  }
  const visual = STATUS_VISUAL[consulta.status]
  return <span className={`px-1.5 py-0.5 rounded font-semibold text-[9.5px] ${visual.cls}`}>{visual.label}</span>
}

export function Modalidade({ consulta }: { consulta: Consulta }) {
  if (consulta.modalidade === 'teleconsulta') {
    return (
      <span className="inline-flex items-center gap-1 text-sky-300">
        <Video size={10} />
        Teleconsulta
      </span>
    )
  }
  const local = consulta.local
  return (
    <span className="inline-flex items-center gap-1 min-w-0">
      <MapPin size={10} className="shrink-0" />
      <span className="truncate">
        {consulta.modalidade === 'domicilio'
          ? 'Domicílio'
          : local
            ? [local.clinicaNome, local.sala].filter(Boolean).join(' · ')
            : 'Presencial'}
      </span>
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface CardDeHojeProps {
  consulta: Consulta
  agora: string
  onAbrir: () => void
  onCheckIn: (c: Consulta) => void
  onEntrar: (c: Consulta) => void
}

function CardDeHoje({ consulta, agora, onAbrir, onCheckIn, onEntrar }: CardDeHojeProps) {
  const prof = consulta.profissional
  return (
    <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-b from-teal-500/10 to-slate-900 overflow-hidden">
      <button onClick={onAbrir} className="w-full p-4 text-left">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-slate-50 font-mono tabular-nums text-[30px] font-semibold leading-none">
              {consulta.hora}
            </div>
            <div className="text-slate-500 font-mono tabular-nums text-[10.5px] mt-1">
              até {horaFim(consulta)} · {consulta.duracaoMin} min
            </div>
          </div>
          <SeloStatus consulta={consulta} />
        </div>

        <div className="mt-3.5 flex items-center gap-3">
          <Avatar nome={prof.nome} tipo={prof.tipo} />
          <div className="min-w-0 flex-1">
            <div className="text-slate-100 font-semibold text-[13px] truncate">{prof.nome}</div>
            <div className="text-slate-400 text-[11px] truncate">{consulta.servico ?? prof.especialidade}</div>
          </div>
          <ChevronRight size={13} className="text-slate-600 shrink-0" />
        </div>

        <div className="mt-3 text-slate-400 text-[11px]">
          <Modalidade consulta={consulta} />
        </div>
      </button>

      <div className="px-4 pb-4">
        <AcaoDoDia consulta={consulta} agora={agora} onCheckIn={onCheckIn} onEntrar={onEntrar} />
      </div>
    </div>
  )
}

interface AcaoDoDiaProps {
  consulta: Consulta
  agora: string
  onCheckIn: (c: Consulta) => void
  onEntrar: (c: Consulta) => void
}

/** A ação do dia: check-in na clínica, ou entrar na teleconsulta. */
export function AcaoDoDia({ consulta, agora, onCheckIn, onEntrar }: AcaoDoDiaProps) {
  if (consulta.modalidade === 'teleconsulta') {
    const { liberada, liberaAs } = liberacaoTeleconsulta(consulta, agora)
    if (!consulta.meetLink) {
      return <Aviso icon={Clock}>O profissional envia o link na hora da consulta.</Aviso>
    }
    if (!liberada) {
      return <Aviso icon={Clock}>A sala abre às <span className="font-mono tabular-nums">{liberaAs}</span>.</Aviso>
    }
    return (
      <button
        onClick={() => onEntrar(consulta)}
        className="w-full h-11 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-[13px] font-semibold flex items-center justify-center gap-2"
      >
        <Video size={15} strokeWidth={2.4} />
        Entrar na consulta
      </button>
    )
  }

  if (consulta.checkedInAt || consulta.status === 'checked_in') {
    return (
      <Aviso icon={Check} tom="ok">
        Chegada confirmada
        {consulta.checkedInAt && (
          <> às <span className="font-mono tabular-nums">{horaDeIso(consulta.checkedInAt)}</span></>
        )}
        .
      </Aviso>
    )
  }

  if (consulta.modalidade === 'domicilio') return null

  return (
    <button
      onClick={() => onCheckIn(consulta)}
      className="w-full h-11 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-[13px] font-semibold flex items-center justify-center gap-2"
    >
      <QrCode size={15} strokeWidth={2.4} />
      Fazer check-in na recepção
    </button>
  )
}

function Aviso({
  icon: Icon,
  tom = 'neutro',
  children,
}: {
  icon: typeof Clock
  tom?: 'neutro' | 'ok'
  children: React.ReactNode
}) {
  return (
    <div
      className={`h-11 rounded-xl px-3 flex items-center gap-2 text-[12px] ${
        tom === 'ok' ? 'bg-teal-500/10 text-teal-200' : 'bg-slate-800/70 text-slate-300'
      }`}
    >
      <Icon size={14} className="shrink-0" />
      <span>{children}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface CardConsultaProps {
  consulta: Consulta
  passada?: boolean
  onClick: () => void
}

function CardConsulta({ consulta, passada, onClick }: CardConsultaProps) {
  const { dia, mes, semana } = diaCurto(consulta.data)
  const prof = consulta.profissional
  return (
    <button
      onClick={onClick}
      className={`w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3 flex items-center gap-3 text-left ${
        passada ? 'opacity-80' : ''
      }`}
    >
      <div className="w-12 shrink-0 rounded-xl bg-slate-800/80 py-1.5 text-center">
        <div className="text-slate-500 text-[9px] font-semibold uppercase">{semana}</div>
        <div className="text-slate-100 font-mono tabular-nums text-[17px] font-semibold leading-tight">{dia}</div>
        <div className="text-slate-500 text-[9px] font-semibold uppercase">{mes}</div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-100 font-mono tabular-nums text-[12.5px] font-semibold">{consulta.hora}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-100 font-semibold text-[12.5px] truncate">{prof.nome}</span>
        </div>
        <div className="text-slate-500 text-[10.5px] truncate mt-0.5">{consulta.servico ?? prof.especialidade}</div>
        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 min-w-0">
          <SeloTipo tipo={prof.tipo} />
          <SeloStatus consulta={consulta} />
          <span className="min-w-0 truncate">
            <Modalidade consulta={consulta} />
          </span>
        </div>
      </div>
      <ChevronRight size={13} className="text-slate-600 shrink-0" />
    </button>
  )
}

export function Avatar({ nome, tipo }: { nome: string; tipo: Consulta['profissional']['tipo'] }) {
  const visual = TIPO_VISUAL[tipo]
  const Icon = visual.icon
  return (
    <div className="relative w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-200 font-bold text-[13px] shrink-0">
      {iniciais(nome)}
      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${visual.bg} ${visual.text} flex items-center justify-center border-2 border-slate-900`}>
        <Icon size={10} strokeWidth={2.4} />
      </div>
    </div>
  )
}

function Vazio({ onVerProfissionais }: { onVerProfissionais?: () => void }) {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
        <CalendarX2 size={22} />
      </div>
      <div className="text-slate-100 font-semibold text-[14px] mt-4">Nenhuma consulta marcada</div>
      <p className="text-slate-500 text-[12px] mt-1.5 leading-relaxed">
        Quando um profissional vinculado marcar uma consulta com você, ela aparece aqui.
      </p>
      <button
        onClick={onVerProfissionais}
        className="mt-5 h-10 px-4 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-200 text-[12.5px] font-medium"
      >
        Ver meus profissionais
      </button>
    </div>
  )
}
