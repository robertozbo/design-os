import {
  BadgeCheck,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import type {
  PerfilData,
  Preferencia,
} from '@/../product-clinic/sections/perfil/types'
import { CREDENCIAL_META } from './helpers'

interface Props {
  dados: PerfilData
  onEditar: () => void
  onSalvarBio: (bio: string) => void
  onBioChange: (bio: string) => void
  onGerenciarCredencial: (id: string) => void
  onToggle: (p: Preferencia) => void
}

export function PerfilView({
  dados,
  onEditar,
  onSalvarBio,
  onBioChange,
  onGerenciarCredencial,
  onToggle,
}: Props) {
  return (
    <div className="p-6 pl-16 lg:pl-6">
      {/* Hero */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-teal-500 text-xl font-semibold text-white">
              {dados.iniciais}
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {dados.nome}
              </h1>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                {dados.especialidadePrincipal} · CRM {dados.crm}-{dados.uf}
              </p>
            </div>
          </div>
          <button
            onClick={onEditar}
            className="inline-flex items-center gap-1.5 self-start rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:self-auto"
          >
            <Pencil className="h-4 w-4" /> Editar perfil
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Coluna principal */}
        <div className="space-y-4 lg:col-span-2">
          {/* Dados profissionais */}
          <Card titulo="Dados profissionais">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Campo label="CRM / UF" valor={`${dados.crm}-${dados.uf}`} />
              <Campo label="Especialidade principal" valor={dados.especialidadePrincipal} />
            </div>
            <div className="mt-4">
              <div className="mb-1.5 text-[11px] uppercase tracking-wide text-slate-400">
                Especialidades & RQE
              </div>
              <div className="flex flex-wrap gap-1.5">
                {dados.especialidades.map((e) => (
                  <span
                    key={e.nome}
                    className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                  >
                    {e.nome}
                    {e.rqe && (
                      <span className="font-mono text-[10px] text-teal-500/80 dark:text-teal-400/70">
                        {e.rqe}
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </Card>

          {/* Bio pública */}
          <Card titulo="Bio pública">
            <p className="mb-2 text-[11px] text-slate-400">
              Texto que o paciente vê no app Nymos ao buscar por você.
            </p>
            <textarea
              value={dados.bio}
              onChange={(e) => onBioChange(e.target.value.slice(0, dados.bioMax))}
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200"
            />
            <div className="mt-2 flex items-center justify-between">
              <span className="font-mono text-[11px] tabular-nums text-slate-400">
                {dados.bio.length}/{dados.bioMax}
              </span>
              <button
                onClick={() => onSalvarBio(dados.bio)}
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
              >
                Salvar bio
              </button>
            </div>
          </Card>

          {/* Formação */}
          <Card titulo="Formação & titulação">
            <ul className="space-y-3">
              {dados.formacao.map((f) => (
                <li key={f.id} className="flex gap-3">
                  <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {f.titulo}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {f.instituicao}
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-slate-400">
                    {f.ano}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Assinatura & credenciais */}
          <Card titulo="Assinatura & credenciais">
            <ul className="space-y-2.5">
              {dados.credenciais.map((c) => {
                const meta = CREDENCIAL_META[c.status]
                return (
                  <li
                    key={c.id}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800"
                  >
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {c.nome}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium ${meta.badge}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {c.descricao}
                      </p>
                      {c.detalhe && (
                        <p className="mt-1 font-mono text-[10px] text-slate-400">{c.detalhe}</p>
                      )}
                    </div>
                    <button
                      onClick={() => onGerenciarCredencial(c.id)}
                      className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Gerenciar
                    </button>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-4">
          {/* Contato */}
          <Card titulo="Contato">
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate">{dados.contato.email}</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                <span>{dados.contato.telefone}</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                <span>{dados.contato.cidade}</span>
              </li>
            </ul>
          </Card>

          {/* Horários */}
          <Card titulo="Horários de atendimento">
            <ul className="space-y-1.5">
              {dados.horarios.map((h) => (
                <li
                  key={h.dia}
                  className="flex items-start justify-between gap-3 border-b border-slate-50 pb-1.5 last:border-0 last:pb-0 dark:border-slate-800/60"
                >
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {h.dia}
                  </span>
                  <span className="text-right">
                    {h.faixas.length === 0 ? (
                      <span className="text-[11px] text-slate-400">Sem atendimento</span>
                    ) : (
                      h.faixas.map((f) => (
                        <span
                          key={f}
                          className="block font-mono text-[11px] tabular-nums text-slate-600 dark:text-slate-300"
                        >
                          {f}
                        </span>
                      ))
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Preferências rápidas */}
          <Card titulo="Preferências rápidas">
            <ul className="space-y-3">
              {dados.preferencias.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {p.label}
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {p.descricao}
                    </p>
                  </div>
                  <Toggle ativo={p.ativo} onClick={() => onToggle(p)} label={p.label} />
                </li>
              ))}
            </ul>
            <p className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-2 text-[10px] text-slate-400 dark:border-slate-800">
              <BadgeCheck className="h-3 w-3" />
              Preferências pessoais · não afetam os outros médicos da clínica.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Card({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {titulo}
      </h2>
      {children}
    </div>
  )
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 font-medium text-slate-800 dark:text-slate-200">{valor}</div>
    </div>
  )
}

function Toggle({
  ativo,
  onClick,
  label,
}: {
  ativo: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ativo}
      aria-label={label}
      onClick={onClick}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        ativo ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          ativo ? 'translate-x-[18px]' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
