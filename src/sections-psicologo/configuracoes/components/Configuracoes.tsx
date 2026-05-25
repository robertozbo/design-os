import { useState } from 'react'
import {
  User,
  Calendar,
  MapPin,
  DollarSign,
  Shield,
  Bell,
  Camera,
  Pencil,
  Check,
  Plus,
  Video,
  Users,
  Building2,
  Save,
  type LucideIcon,
} from 'lucide-react'
import type {
  ConfiguracoesProps,
  DiaSemana,
  Modalidade,
  NotificacoesPrefs,
  PacoteSessao,
  SlotDisponibilidade,
} from '@/../product-psicologo/sections/configuracoes/types'

type AbaConfig = 'perfil' | 'disponibilidade' | 'modalidades' | 'valores' | 'convenios' | 'notificacoes'

const ABAS: { id: AbaConfig; label: string; icon: LucideIcon }[] = [
  { id: 'perfil', label: 'Perfil profissional', icon: User },
  { id: 'disponibilidade', label: 'Disponibilidade', icon: Calendar },
  { id: 'modalidades', label: 'Modalidades', icon: MapPin },
  { id: 'valores', label: 'Valores e pacotes', icon: DollarSign },
  { id: 'convenios', label: 'Convênios', icon: Shield },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
]

const DIAS: { id: DiaSemana; label: string; abrev: string }[] = [
  { id: 'seg', label: 'Segunda', abrev: 'Seg' },
  { id: 'ter', label: 'Terça', abrev: 'Ter' },
  { id: 'qua', label: 'Quarta', abrev: 'Qua' },
  { id: 'qui', label: 'Quinta', abrev: 'Qui' },
  { id: 'sex', label: 'Sexta', abrev: 'Sex' },
  { id: 'sab', label: 'Sábado', abrev: 'Sáb' },
  { id: 'dom', label: 'Domingo', abrev: 'Dom' },
]

const HORAS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']

const MODALIDADE_VISUAL: Record<Modalidade, { label: string; icon: LucideIcon; cor: string }> = {
  presencial: { label: 'Presencial', icon: MapPin, cor: 'bg-teal-500/15 text-teal-300' },
  online: { label: 'Online', icon: Video, cor: 'bg-sky-500/15 text-sky-300' },
  hibrida: { label: 'Híbrida', icon: Users, cor: 'bg-violet-500/15 text-violet-300' },
}

function brl(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function Configuracoes({
  data,
  onSlotToggle,
  onModalidadeToggle,
  onConvenioToggle,
  onNotificacaoToggle,
  onSalvar,
}: ConfiguracoesProps) {
  const [aba, setAba] = useState<AbaConfig>('perfil')

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-slate-50 font-bold text-[24px]">Configurações</h1>
            <p className="text-slate-400 text-[12.5px] mt-1">
              Gerencie seu perfil profissional, agenda e preferências
            </p>
          </div>
          <button
            onClick={onSalvar}
            className="px-4 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 text-white font-semibold text-[12.5px] flex items-center gap-2"
          >
            <Save size={13} strokeWidth={2.4} />
            Salvar alterações
          </button>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Sidebar */}
          <aside className="col-span-3">
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-2 sticky top-6">
              <nav className="space-y-0.5">
                {ABAS.map((a) => {
                  const Icon = a.icon
                  const active = aba === a.id
                  return (
                    <button
                      key={a.id}
                      onClick={() => setAba(a.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[12.5px] font-medium transition-colors ${
                        active
                          ? 'bg-violet-500/15 text-violet-300'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon size={14} strokeWidth={2.2} />
                      <span className="flex-1 text-left">{a.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="col-span-9">
            {aba === 'perfil' && <PerfilSection data={data.perfil} />}
            {aba === 'disponibilidade' && <DisponibilidadeSection slots={data.disponibilidade} onToggle={onSlotToggle} />}
            {aba === 'modalidades' && <ModalidadesSection mods={data.modalidades} onToggle={onModalidadeToggle} />}
            {aba === 'valores' && <ValoresSection valores={data.valores} />}
            {aba === 'convenios' && <ConveniosSection convenios={data.convenios} onToggle={onConvenioToggle} />}
            {aba === 'notificacoes' && (
              <NotificacoesSection prefs={data.notificacoes} onToggle={onNotificacaoToggle} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

interface SectionWrapProps {
  titulo: string
  descricao: string
  icon: LucideIcon
  cor: string
  children: React.ReactNode
}

function SectionWrap({ titulo, descricao, icon: Icon, cor, children }: SectionWrapProps) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800/60">
        <div className={`w-9 h-9 rounded-xl ${cor} flex items-center justify-center`}>
          <Icon size={16} strokeWidth={2.4} />
        </div>
        <div>
          <h2 className="text-slate-100 font-bold text-[16px]">{titulo}</h2>
          <p className="text-slate-500 text-[11px]">{descricao}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function PerfilSection({ data }: { data: ConfiguracoesProps['data']['perfil'] }) {
  return (
    <SectionWrap titulo="Perfil profissional" descricao="Dados que aparecem para os pacientes e no prontuário" icon={User} cor="bg-violet-500/15 text-violet-300">
      {/* Avatar + dados básicos */}
      <div className="flex items-start gap-5 mb-5">
        <button className="relative w-24 h-24 rounded-3xl bg-violet-500/20 hover:bg-violet-500/30 flex items-center justify-center text-violet-200 font-bold text-[32px] overflow-hidden shrink-0">
          {data.fotoUrl ? (
            <img src={data.fotoUrl} alt={data.nomeCompleto} className="w-full h-full object-cover" />
          ) : (
            data.inicial
          )}
          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-slate-900 border-2 border-slate-950 flex items-center justify-center text-slate-300">
            <Camera size={11} strokeWidth={2.4} />
          </div>
        </button>
        <div className="flex-1 grid grid-cols-2 gap-3">
          <FieldEditable label="Nome completo" valor={data.nomeCompleto} />
          <FieldEditable label="CRP" valor={data.crp} mono />
          <FieldEditable label="Email" valor={data.email} mono />
          <FieldEditable label="Telefone" valor={data.telefone} mono />
        </div>
      </div>

      <div className="space-y-4">
        <FieldEditable label="Especialidade" valor={data.especialidade} fullWidth />

        <div>
          <FieldLabel label="Abordagens principais" />
          <div className="flex gap-1.5 flex-wrap mt-1.5">
            {data.abordagensPrincipais.map((a) => (
              <span key={a} className="px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 text-[11.5px] font-medium border border-violet-500/30">
                {a}
              </span>
            ))}
            <button className="px-3 py-1 rounded-full bg-slate-950 border border-dashed border-slate-700 text-slate-500 text-[11.5px] font-medium hover:text-slate-300 flex items-center gap-1">
              <Plus size={11} strokeWidth={2.4} />
              Adicionar
            </button>
          </div>
        </div>

        <div>
          <FieldLabel label="Bio" />
          <textarea
            defaultValue={data.bio}
            rows={4}
            className="w-full mt-1.5 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-slate-600 text-slate-100 text-[12.5px] outline-none resize-none leading-relaxed"
          />
          <div className="text-slate-600 text-[10px] mt-1">{data.bio.length} caracteres</div>
        </div>

        <div>
          <FieldLabel label="Formação" />
          <div className="space-y-1.5 mt-1.5">
            {data.formacao.map((f, i) => (
              <div key={i} className="rounded-xl bg-slate-950/40 border border-slate-800/60 px-3 py-2 flex items-center gap-3">
                <Building2 size={13} className="text-slate-500 shrink-0" strokeWidth={2.2} />
                <div className="min-w-0 flex-1">
                  <div className="text-slate-100 text-[12.5px] font-medium">{f.titulo}</div>
                  <div className="text-slate-500 text-[10.5px]">{f.instituicao} · {f.ano}</div>
                </div>
                <button className="text-slate-500 hover:text-slate-200">
                  <Pencil size={11} strokeWidth={2.2} />
                </button>
              </div>
            ))}
            <button className="w-full px-3 py-2 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-[11.5px] font-medium flex items-center justify-center gap-1.5">
              <Plus size={11} strokeWidth={2.4} />
              Adicionar formação
            </button>
          </div>
        </div>
      </div>
    </SectionWrap>
  )
}

function DisponibilidadeSection({
  slots,
  onToggle,
}: {
  slots: SlotDisponibilidade[]
  onToggle?: (dia: DiaSemana, hora: string) => void
}) {
  const slotMap = new Map<string, SlotDisponibilidade>()
  slots.forEach((s) => slotMap.set(`${s.dia}-${s.inicio}`, s))

  return (
    <SectionWrap titulo="Disponibilidade" descricao="Horários liberados para agendamento online de pacientes" icon={Calendar} cor="bg-teal-500/15 text-teal-300">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="w-16"></th>
              {DIAS.map((d) => (
                <th key={d.id} className="px-2 py-1.5 text-slate-500 text-[10.5px] font-semibold uppercase tracking-wider">
                  {d.abrev}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HORAS.map((h) => (
              <tr key={h}>
                <td className="text-slate-500 text-[10.5px] font-mono tabular-nums pr-2 py-1">{h}</td>
                {DIAS.map((d) => {
                  const slot = slotMap.get(`${d.id}-${h}`)
                  const ativo = !!slot
                  const mod = slot?.modalidade
                  return (
                    <td key={d.id} className="p-0.5">
                      <button
                        onClick={() => onToggle?.(d.id, h)}
                        className={`w-full h-9 rounded-lg text-[10px] font-semibold transition-colors ${
                          ativo
                            ? mod === 'online'
                              ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/25'
                              : 'bg-teal-500/15 text-teal-300 border border-teal-500/30 hover:bg-teal-500/25'
                            : 'bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-700'
                        }`}
                      >
                        {ativo ? (
                          <span className="flex items-center justify-center gap-0.5">
                            {mod === 'online' ? <Video size={10} strokeWidth={2.4} /> : <MapPin size={10} strokeWidth={2.4} />}
                          </span>
                        ) : (
                          '·'
                        )}
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center gap-4 text-[10.5px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-teal-500/15 border border-teal-500/30" />
          Presencial
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-sky-500/15 border border-sky-500/30" />
          Online
        </span>
        <span className="text-slate-500 ml-auto font-mono tabular-nums">
          {slots.length} slots disponíveis · {slots.filter((s) => s.modalidade === 'online').length} online · {slots.filter((s) => s.modalidade === 'presencial').length} presencial
        </span>
      </div>
    </SectionWrap>
  )
}

function ModalidadesSection({
  mods,
  onToggle,
}: {
  mods: ConfiguracoesProps['data']['modalidades']
  onToggle?: (m: Modalidade) => void
}) {
  return (
    <SectionWrap titulo="Modalidades de atendimento" descricao="Como você atende os pacientes" icon={MapPin} cor="bg-sky-500/15 text-sky-300">
      <div className="space-y-3">
        <ModalidadeCard
          modalidade="presencial"
          ativa={mods.presencial.ativa}
          info={mods.presencial.endereco ?? ''}
          infoLabel="Endereço"
          onToggle={() => onToggle?.('presencial')}
        />
        <ModalidadeCard
          modalidade="online"
          ativa={mods.online.ativa}
          info={mods.online.plataforma ?? ''}
          infoLabel="Plataforma"
          onToggle={() => onToggle?.('online')}
        />
        <ModalidadeCard
          modalidade="hibrida"
          ativa={mods.hibrida.ativa}
          info="Mistura de presencial e online conforme demanda"
          infoLabel="Sobre"
          onToggle={() => onToggle?.('hibrida')}
        />
      </div>
    </SectionWrap>
  )
}

function ModalidadeCard({
  modalidade,
  ativa,
  info,
  infoLabel,
  onToggle,
}: {
  modalidade: Modalidade
  ativa: boolean
  info: string
  infoLabel: string
  onToggle: () => void
}) {
  const v = MODALIDADE_VISUAL[modalidade]
  const Icon = v.icon
  return (
    <div className={`rounded-xl border p-4 transition-colors ${ativa ? 'bg-slate-900 border-slate-700' : 'bg-slate-950/60 border-slate-800 opacity-60'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${v.cor} flex items-center justify-center shrink-0`}>
          <Icon size={16} strokeWidth={2.2} />
        </div>
        <div className="flex-1">
          <div className="text-slate-100 font-semibold text-[13.5px]">{v.label}</div>
          {info && <div className="text-slate-400 text-[11px] mt-0.5 leading-snug">{info}</div>}
        </div>
        <Toggle value={ativa} onChange={onToggle} />
      </div>
      {ativa && info && (
        <div className="mt-3 pt-3 border-t border-slate-800/60">
          <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-1">{infoLabel}</div>
          <div className="text-slate-200 text-[12px]">{info}</div>
        </div>
      )}
    </div>
  )
}

function ValoresSection({ valores }: { valores: ConfiguracoesProps['data']['valores'] }) {
  return (
    <SectionWrap titulo="Valores e pacotes" descricao="Preços por modalidade e pacotes oferecidos" icon={DollarSign} cor="bg-emerald-500/15 text-emerald-300">
      {/* Valores básicos */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <ValorCard label="Sessão presencial" valor={valores.sessaoPadraoBrl} />
        <ValorCard label="Sessão online" valor={valores.sessaoOnlineBrl} />
        <ValorCard label="Primeira consulta" valor={valores.primeiraConsultaBrl} highlight />
      </div>

      {/* Pacotes */}
      <div className="mb-5">
        <FieldLabel label="Pacotes" />
        <div className="space-y-2 mt-1.5">
          {valores.pacotes.map((p) => (
            <PacoteCard key={p.id} pacote={p} valorIndividual={valores.sessaoPadraoBrl} />
          ))}
          <button className="w-full px-3 py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-[11.5px] font-medium flex items-center justify-center gap-1.5">
            <Plus size={11} strokeWidth={2.4} />
            Novo pacote
          </button>
        </div>
      </div>

      {/* Forma de pagamento */}
      <div>
        <FieldLabel label="Formas de pagamento aceitas" />
        <div className="flex gap-1.5 flex-wrap mt-1.5">
          {valores.formaPagamento.map((f) => (
            <span key={f} className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[11.5px] font-medium border border-emerald-500/30 flex items-center gap-1">
              <Check size={11} strokeWidth={2.6} />
              {f}
            </span>
          ))}
        </div>
      </div>
    </SectionWrap>
  )
}

function ValorCard({ label, valor, highlight }: { label: string; valor: number; highlight?: boolean }) {
  return (
    <div className={`rounded-xl ${highlight ? 'bg-emerald-500/5 border border-emerald-500/30' : 'bg-slate-950/40 border border-slate-800/60'} p-3.5`}>
      <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider mb-1">{label}</div>
      <div className={`font-bold text-[20px] font-mono tabular-nums ${highlight ? 'text-emerald-300' : 'text-slate-100'}`}>
        {brl(valor)}
      </div>
    </div>
  )
}

function PacoteCard({ pacote, valorIndividual }: { pacote: PacoteSessao; valorIndividual: number }) {
  const valorIndPacote = pacote.precoTotal / pacote.numSessoes
  const desconto = ((valorIndividual - valorIndPacote) / valorIndividual) * 100
  return (
    <div className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3.5 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-violet-500/15 text-violet-300 flex items-center justify-center font-bold text-[14px] font-mono tabular-nums shrink-0">
        {pacote.numSessoes}×
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-slate-100 font-semibold text-[12.5px]">{pacote.nome}</div>
        <div className="text-slate-500 text-[10.5px] mt-0.5">
          {brl(valorIndPacote)}/sessão · validade {pacote.validadeMeses} {pacote.validadeMeses === 1 ? 'mês' : 'meses'}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-slate-100 font-bold text-[14px] font-mono tabular-nums">{brl(pacote.precoTotal)}</div>
        {desconto > 0 && (
          <div className="text-emerald-300 text-[10px] font-semibold mt-0.5">−{desconto.toFixed(0)}% off</div>
        )}
      </div>
      <button className="w-7 h-7 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center shrink-0">
        <Pencil size={11} strokeWidth={2.2} />
      </button>
    </div>
  )
}

function ConveniosSection({
  convenios,
  onToggle,
}: {
  convenios: ConfiguracoesProps['data']['convenios']
  onToggle?: (id: string) => void
}) {
  return (
    <SectionWrap titulo="Convênios aceitos" descricao="Operadoras de saúde com as quais você atende" icon={Shield} cor="bg-amber-500/15 text-amber-300">
      <div className="space-y-2">
        {convenios.map((c) => (
          <div key={c.id} className={`rounded-xl p-3.5 flex items-center gap-3 ${c.ativo ? 'bg-slate-950/60 border border-slate-800' : 'bg-slate-950/30 border border-slate-800/60 opacity-60'}`}>
            <div className={`w-10 h-10 rounded-xl ${c.ativo ? 'bg-amber-500/15 text-amber-300' : 'bg-slate-800 text-slate-500'} flex items-center justify-center shrink-0`}>
              <Shield size={15} strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-slate-100 font-semibold text-[12.5px]">{c.nome}</div>
              {c.valorRepasseBrl && (
                <div className="text-slate-500 text-[10.5px] mt-0.5">
                  Repasse: <span className="text-slate-300 font-mono">{brl(c.valorRepasseBrl)}</span> por sessão
                </div>
              )}
            </div>
            <Toggle value={c.ativo} onChange={() => onToggle?.(c.id)} />
          </div>
        ))}
        <button className="w-full px-3 py-2.5 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-[11.5px] font-medium flex items-center justify-center gap-1.5">
          <Plus size={11} strokeWidth={2.4} />
          Adicionar convênio
        </button>
      </div>
    </SectionWrap>
  )
}

const NOTIF_LABELS: Record<keyof NotificacoesPrefs, { label: string; descricao: string }> = {
  pushSessaoIniciar: { label: 'Lembrete de sessão', descricao: 'Push 10min antes de cada sessão começar' },
  pushPacienteAlerta: { label: 'Alertas de paciente', descricao: 'Agravamento PHQ-9/GAD-7, faltas, mensagens urgentes' },
  pushMensagemPaciente: { label: 'Mensagens de paciente', descricao: 'Toda vez que um paciente envia mensagem' },
  emailResumoDiario: { label: 'Resumo diário por email', descricao: 'Email às 7h com sessões e alertas do dia' },
  emailNovoAgendamento: { label: 'Novo agendamento', descricao: 'Email quando paciente agenda nova sessão' },
  smsLembreteSessao: { label: 'SMS pra paciente', descricao: 'Lembrete via SMS 24h antes (custo adicional)' },
}

function NotificacoesSection({
  prefs,
  onToggle,
}: {
  prefs: NotificacoesPrefs
  onToggle?: (key: keyof NotificacoesPrefs, valor: boolean) => void
}) {
  return (
    <SectionWrap titulo="Notificações" descricao="O que você recebe e como" icon={Bell} cor="bg-rose-500/15 text-rose-300">
      <div className="space-y-2">
        {(Object.entries(NOTIF_LABELS) as [keyof NotificacoesPrefs, typeof NOTIF_LABELS[keyof NotificacoesPrefs]][]).map(
          ([key, info]) => (
            <div key={key} className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/15 text-rose-300 flex items-center justify-center shrink-0">
                <Bell size={14} strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-slate-100 font-semibold text-[12.5px]">{info.label}</div>
                <div className="text-slate-500 text-[10.5px] mt-0.5 leading-snug">{info.descricao}</div>
              </div>
              <Toggle value={prefs[key]} onChange={(v) => onToggle?.(key, v)} />
            </div>
          ),
        )}
      </div>
    </SectionWrap>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function FieldLabel({ label }: { label: string }) {
  return <div className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">{label}</div>
}

function FieldEditable({ label, valor, mono, fullWidth }: { label: string; valor: string; mono?: boolean; fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <FieldLabel label={label} />
      <div className="mt-1 flex items-center gap-2 px-3 h-10 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700">
        <input
          defaultValue={valor}
          className={`flex-1 bg-transparent text-slate-100 text-[12.5px] outline-none ${mono ? 'font-mono tabular-nums' : ''}`}
        />
        <Pencil size={11} className="text-slate-500" strokeWidth={2.2} />
      </div>
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${value ? 'bg-violet-500' : 'bg-slate-700'}`}
      role="switch"
      aria-checked={value}
    >
      <div
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
          value ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
