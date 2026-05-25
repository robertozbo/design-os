import { useState } from 'react'
import {
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Sparkles,
  Video,
  MapPin,
  ExternalLink,
  ShieldCheck,
  X,
} from 'lucide-react'
import type {
  PacienteProntuario,
  Anamnese,
  ExameFisico,
  HipoteseDiagnostica,
  EvolucaoProntuario,
  ExameAnexado,
  PrescricaoAtiva,
  Habito,
  Alergia,
} from '@/../product-clinico/sections/prontuario/types'
import { EditableField } from './EditableField'
import { EditableList } from './EditableList'
import { Sparkline } from './Sparkline'
import {
  formatDataBR,
  formatRelativo,
  HIPOTESE_STYLE,
  ALERGIA_STYLE,
  HABITO_LABEL,
  HABITO_ICON,
  ALERT_TEXT,
} from './helpers'

/* -------------------- Identificação -------------------- */

export function SecaoIdentificacao({ paciente }: { paciente: PacienteProntuario }) {
  const dados = [
    { label: 'CPF', value: paciente.cpf },
    { label: 'Nascimento', value: `${formatDataBR(paciente.dataNascimento)} (${paciente.idade} anos)` },
    { label: 'Gênero', value: paciente.genero },
    { label: 'Telefone', value: paciente.telefone },
    { label: 'Email', value: paciente.email },
    { label: 'Endereço', value: paciente.endereco },
    { label: 'Convênio', value: paciente.convenio },
    {
      label: 'Status app',
      value:
        paciente.statusApp === 'vinculado'
          ? `Vinculado desde ${formatDataBR(paciente.vinculadoEm)}`
          : 'Não vinculado',
    },
  ]
  return (
    <Secao id="identificacao" title="Identificação" subtitle="Dados pessoais e contato">
      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {dados.map((d, i) => (
          <DataRow key={i} label={d.label} value={d.value} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {paciente.condicoesCronicas.map((c, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {c}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-200/60 pt-3 text-[11px] text-slate-500 dark:border-slate-800">
        <span>1ª consulta: {formatDataBR(paciente.primeiroAtendimentoEm)}</span>
        <span aria-hidden="true">·</span>
        <span>Última: {formatRelativo(paciente.ultimaConsultaEm)}</span>
        <span aria-hidden="true">·</span>
        <span>{paciente.totalConsultas} atendimentos no total</span>
      </div>
    </Secao>
  )
}

/* -------------------- Anamnese -------------------- */

export function SecaoAnamnese({
  anamnese,
  onSalvarCampo,
  onAdicionarItem,
  onRemoverItem,
}: {
  anamnese: Anamnese
  onSalvarCampo?: (campo: string, valor: string) => void
  onAdicionarItem?: (lista: string, valor: string) => void
  onRemoverItem?: (lista: string, index: number) => void
}) {
  return (
    <Secao
      id="anamnese"
      title="Anamnese"
      subtitle="História clínica longitudinal — cresce ao longo do acompanhamento"
    >
      <div className="space-y-5">
        <EditableField
          label="Queixa principal"
          value={anamnese.queixaPrincipal}
          onSave={(v) => onSalvarCampo?.('queixaPrincipal', v)}
        />
        <EditableField
          label="HMA — História da moléstia atual"
          value={anamnese.hma}
          multiline
          onSave={(v) => onSalvarCampo?.('hma', v)}
        />

        <div className="grid gap-5 md:grid-cols-2">
          <EditableList
            label="Antecedentes pessoais"
            items={anamnese.antecedentesPessoais}
            placeholder="Adicionar antecedente"
            onAdd={(v) => onAdicionarItem?.('antecedentesPessoais', v)}
            onRemove={(i) => onRemoverItem?.('antecedentesPessoais', i)}
          />
          <EditableList
            label="Antecedentes familiares"
            items={anamnese.antecedentesFamiliares}
            placeholder="Adicionar antecedente familiar"
            onAdd={(v) => onAdicionarItem?.('antecedentesFamiliares', v)}
            onRemove={(i) => onRemoverItem?.('antecedentesFamiliares', i)}
          />
        </div>

        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Medicações em uso
          </p>
          <ul className="space-y-1.5">
            {anamnese.medicacoesEmUso.map((m, i) => (
              <li
                key={i}
                className="rounded-md border border-slate-200/60 bg-teal-50/30 px-3 py-2 text-sm text-slate-800 dark:border-slate-800 dark:bg-teal-950/20 dark:text-slate-200"
              >
                {m}
              </li>
            ))}
          </ul>
          <p className="mt-1 text-[10px] italic text-slate-500">
            Derivado das prescrições ativas. Edite via Memed.
          </p>
        </div>

        <SubsecaoAlergias
          alergias={anamnese.alergias}
          onAdd={(v) => onAdicionarItem?.('alergias', v)}
          onRemove={(i) => onRemoverItem?.('alergias', i)}
        />

        <SubsecaoHabitos habitos={anamnese.habitos} />
      </div>
    </Secao>
  )
}

function SubsecaoAlergias({
  alergias,
  onAdd,
  onRemove,
}: {
  alergias: Alergia[]
  onAdd?: (v: string) => void
  onRemove?: (i: number) => void
}) {
  const grave = alergias.find((a) => a.severidade === 'grave')
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Alergias
        </p>
        {grave && (
          <span className="inline-flex items-center gap-0.5 rounded-full border border-rose-300/70 bg-rose-50 px-1.5 py-0 text-[9px] font-bold uppercase text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-300">
            <AlertTriangle className="size-2.5" />
            crítica
          </span>
        )}
      </div>
      <ul className="space-y-1.5">
        {alergias.length === 0 ? (
          <li className="rounded-md border border-dashed border-slate-200 px-3 py-2 text-xs italic text-slate-400 dark:border-slate-700">
            Nenhuma alergia registrada
          </li>
        ) : (
          alergias.map((a, i) => (
            <li
              key={i}
              className={`group/al flex items-start justify-between gap-3 rounded-md border px-3 py-2 ${ALERGIA_STYLE[a.severidade]}`}
            >
              <div>
                <p className="text-sm font-medium">{a.substancia}</p>
                <p className="text-[11px] opacity-80">
                  {a.reacao} · severidade {a.severidade}
                </p>
              </div>
              <button
                onClick={() => onRemove?.(i)}
                className="rounded p-0.5 opacity-0 transition-all hover:bg-white/30 group-hover/al:opacity-100"
                aria-label="Remover alergia"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))
        )}
      </ul>
      <button
        onClick={() => {
          const v = prompt('Substância da alergia:')
          if (v) onAdd?.(v)
        }}
        className="mt-2 text-xs font-medium text-teal-600 hover:underline dark:text-teal-400"
      >
        + Adicionar alergia
      </button>
    </div>
  )
}

function SubsecaoHabitos({ habitos }: { habitos: Habito[] }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Hábitos
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {habitos.map((h) => (
          <div
            key={h.tipo}
            className="flex items-start gap-2 rounded-md border border-slate-200/60 bg-slate-50/40 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/40"
          >
            <span className="text-base" aria-hidden="true">
              {HABITO_ICON[h.tipo]}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                {HABITO_LABEL[h.tipo]} · <span className="font-normal text-slate-600 dark:text-slate-400">{h.status}</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{h.detalhe}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* -------------------- Exame físico -------------------- */

export function SecaoExameFisico({
  exame,
  onSalvarCampo,
}: {
  exame: ExameFisico
  onSalvarCampo?: (campo: string, valor: string) => void
}) {
  const sinais = [
    { label: 'PA', value: exame.sinaisVitais.pa },
    { label: 'FC', value: exame.sinaisVitais.fc },
    { label: 'FR', value: exame.sinaisVitais.fr },
    { label: 'Temp', value: exame.sinaisVitais.temperatura },
  ]
  const antro = [
    { label: 'Peso', value: `${exame.antropometriaAtual.peso} kg` },
    { label: 'Altura', value: `${exame.antropometriaAtual.altura} m` },
    { label: 'IMC', value: exame.antropometriaAtual.imc.toString(), alert: exame.antropometriaAtual.imc >= 30 ? 'critico' : exame.antropometriaAtual.imc >= 25 ? 'alto' : 'normal' as const },
    { label: 'CA', value: `${exame.antropometriaAtual.circunferenciaAbdominal} cm` },
  ]

  const pesoHistorico = exame.antropometriaHistorico.map((h) => h.peso)

  return (
    <Secao
      id="exame-fisico"
      title="Exame físico"
      subtitle="Sinais vitais, antropometria, exame específico do sistema endócrino"
    >
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Sinais vitais
            <span className="ml-2 font-mono text-[9px] normal-case text-slate-400">
              registrado em {formatDataBR(exame.sinaisVitais.registradoEm)}
            </span>
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {sinais.map((s) => (
              <SinalCard key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Antropometria
              <span className="ml-2 font-mono text-[9px] normal-case text-slate-400">
                {formatDataBR(exame.antropometriaAtual.registradoEm)}
              </span>
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span>Peso</span>
              <Sparkline values={pesoHistorico} width={70} height={20} color="#0d9488" />
              <span className="font-mono tabular-nums">
                {pesoHistorico[0]} → {pesoHistorico[pesoHistorico.length - 1]} kg
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {antro.map((a) => (
              <SinalCard
                key={a.label}
                label={a.label}
                value={a.value}
                alertNivel={a.alert as 'normal' | 'alto' | 'critico' | undefined}
              />
            ))}
          </div>
        </div>

        <EditableField
          label="Exame específico"
          value={exame.exameEspecifico}
          multiline
          onSave={(v) => onSalvarCampo?.('exameEspecifico', v)}
        />
      </div>
    </Secao>
  )
}

function SinalCard({
  label,
  value,
  alertNivel,
}: {
  label: string
  value: string
  alertNivel?: 'normal' | 'alto' | 'critico'
}) {
  const tone = alertNivel === 'critico'
    ? 'text-rose-700 dark:text-rose-400'
    : alertNivel === 'alto'
    ? 'text-amber-700 dark:text-amber-400'
    : 'text-slate-900 dark:text-slate-100'
  return (
    <div className="rounded-md border border-slate-200/60 bg-slate-50/40 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/40">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className={`mt-0.5 font-mono text-base font-semibold tabular-nums ${tone}`}>{value}</p>
    </div>
  )
}

/* -------------------- Hipóteses & Plano -------------------- */

export function SecaoHipotesesPlano({
  hipoteses,
  plano,
  onSalvarCampo,
}: {
  hipoteses: HipoteseDiagnostica[]
  plano: string
  onSalvarCampo?: (campo: string, valor: string) => void
}) {
  return (
    <Secao
      id="hipoteses-plano"
      title="Hipóteses & Plano"
      subtitle="Diagnósticos com CID e plano clínico atual"
    >
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Hipóteses diagnósticas
          </p>
          <ul className="space-y-2">
            {hipoteses.map((h, i) => (
              <li
                key={i}
                className="flex items-start justify-between gap-3 rounded-md border border-slate-200/60 bg-slate-50/40 p-3 dark:border-slate-800 dark:bg-slate-900/40"
              >
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                    <span className="font-mono text-xs text-slate-500">{h.cid}</span>
                    {h.label}
                  </p>
                  {h.nota && (
                    <p className="mt-0.5 text-[11px] italic text-slate-500 dark:text-slate-400">
                      {h.nota}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${HIPOTESE_STYLE[h.status].chip}`}
                >
                  {HIPOTESE_STYLE[h.status].label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <EditableField
          label="Plano atual"
          value={plano}
          multiline
          onSave={(v) => onSalvarCampo?.('planoAtual', v)}
        />
      </div>
    </Secao>
  )
}

/* -------------------- Evoluções -------------------- */

export function SecaoEvolucoes({
  evolucoes,
  onAbrirEvolucao,
}: {
  evolucoes: EvolucaoProntuario[]
  onAbrirEvolucao?: (id: string) => void
}) {
  return (
    <Secao
      id="evolucoes"
      title="Evoluções"
      subtitle={`${evolucoes.length} ${evolucoes.length === 1 ? 'evolução registrada' : 'evoluções registradas'} (mais recente primeiro)`}
    >
      <ol className="space-y-0">
        {evolucoes.map((e, i) => (
          <li key={e.id} className="relative">
            {i < evolucoes.length - 1 && (
              <span
                className="absolute left-3 top-7 -ml-px h-full w-px bg-slate-200 dark:bg-slate-800"
                aria-hidden="true"
              />
            )}
            <div className="relative flex gap-3 pb-5">
              <span
                className={`
                  relative z-[1] mt-1.5 flex size-6 shrink-0 items-center justify-center rounded-full
                  ${
                    i === 0
                      ? 'bg-teal-100 ring-2 ring-teal-500 ring-offset-2 ring-offset-white dark:bg-teal-950 dark:ring-offset-slate-900'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }
                `}
              >
                <span
                  className={`size-2 rounded-full ${
                    i === 0 ? 'bg-teal-600' : 'bg-slate-400 dark:bg-slate-500'
                  }`}
                />
              </span>
              <EvolucaoCard ev={e} onAbrir={() => onAbrirEvolucao?.(e.id)} />
            </div>
          </li>
        ))}
      </ol>
    </Secao>
  )
}

function EvolucaoCard({
  ev,
  onAbrir,
}: {
  ev: EvolucaoProntuario
  onAbrir?: () => void
}) {
  const [expandido, setExpandido] = useState(false)
  const Modal = ev.modalidade === 'tele' ? Video : MapPin
  return (
    <div className="flex-1 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="flex items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {formatDataBR(ev.data)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0 text-[10px] text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Modal className="size-2.5" />
            {ev.modalidade === 'tele' ? 'Tele' : 'Presencial'}
          </span>
          {ev.geradoPorIA && (
            <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-200/70 bg-emerald-50 px-1.5 py-0 text-[10px] font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
              <Sparkles className="size-2.5" />
              IA
            </span>
          )}
        </div>
        <button
          onClick={onAbrir}
          className="text-[11px] font-medium text-teal-600 hover:underline dark:text-teal-400"
        >
          Abrir consulta original →
        </button>
      </header>

      <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {ev.planoResumo}
      </p>

      {ev.soap && (
        <button
          onClick={() => setExpandido((v) => !v)}
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          {expandido ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
          {expandido ? 'Recolher SOAP' : 'Ver SOAP completo'}
        </button>
      )}

      {expandido && ev.soap && (
        <dl className="mt-3 space-y-2 rounded-md border border-slate-200/60 bg-slate-50/40 p-3 dark:border-slate-800 dark:bg-slate-950/40">
          {(['S', 'O', 'A', 'P'] as const).map((letra) => (
            <div key={letra} className="flex gap-2">
              <dt className="size-5 shrink-0 rounded bg-slate-300 text-center text-[10px] font-bold text-white dark:bg-slate-700">
                {letra}
              </dt>
              <dd className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                {ev.soap![letra]}
              </dd>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-2 text-[10px] text-slate-400">Atendido por {ev.medico}</p>
    </div>
  )
}

/* -------------------- Exames anexados -------------------- */

export function SecaoExames({
  exames,
  onAbrirExame,
}: {
  exames: ExameAnexado[]
  onAbrirExame?: (id: string) => void
}) {
  return (
    <Secao
      id="exames"
      title="Exames"
      subtitle={`${exames.length} ${exames.length === 1 ? 'exame referenciado' : 'exames referenciados'}`}
    >
      <ul className="grid gap-2 sm:grid-cols-2">
        {exames.map((e) => (
          <li key={e.id}>
            <button
              onClick={() => onAbrirExame?.(e.id)}
              className="
                group/exam flex w-full items-start justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3 text-left
                transition-all hover:border-teal-300 hover:shadow-sm
                dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700
              "
            >
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{e.tipo}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{formatDataBR(e.data)}</p>
                <p className={`mt-1 text-xs ${ALERT_TEXT[e.alertNivel]}`}>{e.destaqueLabel}</p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-slate-300 group-hover/exam:text-teal-500 dark:text-slate-600" />
            </button>
          </li>
        ))}
      </ul>
    </Secao>
  )
}

/* -------------------- Prescrições -------------------- */

export function SecaoPrescricoes({
  prescricoes,
  onAbrirPrescricao,
}: {
  prescricoes: PrescricaoAtiva[]
  onAbrirPrescricao?: (memedId: string) => void
}) {
  return (
    <Secao
      id="prescricoes"
      title="Prescrições"
      subtitle="Prescrições ativas com validade ICP-Brasil (Memed)"
    >
      <ul className="space-y-2">
        {prescricoes.map((p) => (
          <li
            key={p.id}
            className="rounded-xl border border-teal-200/70 bg-gradient-to-br from-teal-50/40 to-white p-4 dark:border-teal-900/40 dark:from-teal-950/30 dark:to-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatDataBR(p.data)}
                </p>
                <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">{p.medicacoes}</p>
                <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="size-3" />
                  Validade até {formatDataBR(p.validade)} · Memed {p.memedId}
                </p>
              </div>
              <button
                onClick={() => onAbrirPrescricao?.(p.memedId)}
                className="shrink-0 inline-flex items-center gap-1 rounded-md border border-teal-200 bg-white px-2.5 py-1 text-[11px] font-medium text-teal-800 transition-colors hover:bg-teal-50 dark:border-teal-900/60 dark:bg-slate-900 dark:text-teal-300 dark:hover:bg-teal-950/40"
              >
                <ExternalLink className="size-3" />
                Memed
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Secao>
  )
}

/* -------------------- Helpers locais -------------------- */

function Secao({
  id,
  title,
  subtitle,
  children,
}: {
  id: string
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-28 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <header className="mb-5 border-b border-slate-200/60 pb-3 dark:border-slate-800">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </header>
      {children}
    </section>
  )
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-slate-800 dark:text-slate-200">{value}</p>
    </div>
  )
}
