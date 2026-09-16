import { useRef, useState } from 'react'
import { Syringe, Sparkles, Stethoscope, ShieldCheck, TrendingDown } from 'lucide-react'
import {
  FREQUENCIA_DIAS,
  type ConfiguracaoPayload,
  type Glp1Aplicacao,
  type Glp1Configuracao,
  type Glp1Props,
  type Glp1Stats,
  type PontoPeso,
} from '@/../product-mobile/sections/glp1/types'
import { EvolucaoPesoChart } from './EvolucaoPesoChart'
import { HistoricoAplicacoes } from './HistoricoAplicacoes'
import { NovaDoseModal } from './NovaDoseModal'
import { ProtocoloCard } from './ProtocoloCard'
import { SetupWizard } from './SetupWizard'
import { StatsGrid } from './StatsGrid'

const HOJE = '2026-09-16'

function diffDias(deIso: string, ateIso: string): number {
  const a = new Date(`${deIso}T12:00:00`).getTime()
  const b = new Date(`${ateIso}T12:00:00`).getTime()
  return Math.round((b - a) / 86_400_000)
}

function classificarImc(imc: number): string {
  if (imc < 18.5) return 'Abaixo do peso'
  if (imc < 25) return 'Peso normal'
  if (imc < 30) return 'Sobrepeso'
  if (imc < 35) return 'Obesidade I'
  if (imc < 40) return 'Obesidade II'
  return 'Obesidade III'
}

function formatarProxima(iso: string): string {
  const dias = diffDias(HOJE, iso)
  const [, m, d] = iso.split('-')
  const label = new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long',
  })
  const semana = label.charAt(0).toUpperCase() + label.slice(1).replace('-feira', '')
  if (dias === 0) return `Hoje, ${d}/${m}`
  if (dias === 1) return `Amanhã, ${d}/${m}`
  return `${semana}, ${d}/${m}`
}

/**
 * Monta a configuração a partir do payload do wizard. No app real isso volta
 * do backend (POST /glp1/protocol); aqui o protótipo resolve local pra tela
 * seguinte já refletir a escolha.
 */
function configFromPayload(
  payload: ConfiguracaoPayload,
  catalogo: Glp1Props['data']['catalogo'],
  base: Glp1Configuracao | null,
): Glp1Configuracao {
  const med = catalogo.find((m) => m.id === payload.medicamentoId) ?? catalogo[0]
  const idade = payload.nascimento
    ? Math.floor(diffDias(payload.nascimento, HOJE) / 365.25)
    : null
  return {
    medicamentoId: med.id,
    medicamentoNome: med.nome,
    principio: med.principio,
    via: med.via,
    dose: payload.dose,
    frequencia: payload.frequencia,
    diaSemana: payload.diaSemana,
    horario: payload.horario,
    lembreteAtivo: payload.lembreteAtivo,
    iniciadoEm: base?.iniciadoEm ?? HOJE,
    meta: { pesoAlvoKg: payload.pesoAlvoKg, dataAlvo: payload.dataAlvo },
    perfil: {
      nascimento: payload.nascimento,
      idade,
      sexo: base?.perfil.sexo ?? null,
      alturaCm: payload.alturaCm,
      pesoInicialKg: base?.perfil.pesoInicialKg ?? payload.pesoAtualKg,
      pesoAtualKg: payload.pesoAtualKg,
      pesoAtualizadoEm: HOJE,
      origem: base?.perfil.origem ?? {
        nascimento: payload.nascimento ? 'manual' : 'ausente',
        altura: payload.alturaCm ? 'manual' : 'ausente',
        peso: payload.pesoAtualKg ? 'manual' : 'ausente',
      },
    },
  }
}

/**
 * Recalcula os números do painel a partir da configuração + registros locais.
 *
 * `aplicacoesNovas` é o que foi registrado nesta sessão: o histórico em
 * `data.json` mostra só as últimas aplicações, então a contagem de doses parte
 * do total que o backend já mandou (`base.dosesAplicadas`) em vez do tamanho
 * da lista — senão a adesão cai ao salvar uma dose nova.
 */
function calcularStats(
  config: Glp1Configuracao,
  pontos: PontoPeso[],
  aplicacoes: Glp1Aplicacao[],
  base: Glp1Stats | null,
  aplicacoesNovas = 0,
): Glp1Stats {
  const reais = pontos.filter((p) => !p.projetado)
  const pesoAtual = reais.at(-1)?.pesoKg ?? config.perfil.pesoAtualKg ?? 0
  const pesoInicial = config.perfil.pesoInicialKg ?? reais[0]?.pesoKg ?? pesoAtual
  const perdido = pesoInicial - pesoAtual
  const altura = config.perfil.alturaCm
  const imc = altura ? pesoAtual / (altura / 100) ** 2 : null

  const semanasTratamento = Math.max(1, Math.round(diffDias(config.iniciadoEm, HOJE) / 7))
  const diasRestantes = Math.max(0, diffDias(HOJE, config.meta.dataAlvo))
  const semanasRestantes = Math.max(1, diasRestantes / 7)
  const falta = Math.max(0, pesoAtual - config.meta.pesoAlvoKg)
  const ritmoRealizado = perdido / semanasTratamento
  const ritmoNecessario = falta / semanasRestantes

  const intervalo = FREQUENCIA_DIAS[config.frequencia]
  const dosesEsperadas = intervalo
    ? Math.max(1, Math.round(diffDias(config.iniciadoEm, HOJE) / intervalo))
    : base?.dosesEsperadas ?? aplicacoes.length
  const dosesAplicadas = (base?.dosesAplicadas ?? aplicacoes.length) + aplicacoesNovas
  const adesao = Math.min(100, Math.round((dosesAplicadas / Math.max(dosesEsperadas, dosesAplicadas)) * 100))

  const ultimaAplicacao = aplicacoes[0]?.aplicadaEm?.slice(0, 10) ?? config.iniciadoEm
  const proximaData = intervalo
    ? new Date(
        new Date(`${ultimaAplicacao}T12:00:00`).getTime() + intervalo * 86_400_000,
      )
        .toISOString()
        .slice(0, 10)
    : null

  return {
    pesoAtualKg: pesoAtual,
    pesoInicialKg: pesoInicial,
    perdidoKg: Math.max(0, perdido),
    perdidoPct: pesoInicial ? (perdido / pesoInicial) * 100 : 0,
    imc: imc ? Math.round(imc * 10) / 10 : null,
    imcClassificacao: imc ? classificarImc(imc) : null,
    faltaKg: falta,
    diasRestantes,
    ritmoSemanalKg: Math.max(0, ritmoRealizado),
    ritmoNecessarioKg: ritmoNecessario,
    projecao:
      ritmoRealizado >= ritmoNecessario * 1.1
        ? 'adiantado'
        : ritmoRealizado >= ritmoNecessario * 0.9
          ? 'no_prazo'
          : 'atrasado',
    dosesAplicadas,
    dosesEsperadas,
    adesaoPct: adesao,
    semanasTratamento,
    proximaDose: proximaData
      ? {
          data: proximaData,
          label: `${formatarProxima(proximaData)} · ${config.horario}`,
          emDias: diffDias(HOJE, proximaData),
          atrasada: diffDias(HOJE, proximaData) < 0,
        }
      : (base?.proximaDose ?? null),
  }
}

export function Glp1({
  data,
  onSalvarConfiguracao,
  onSalvarAplicacao,
  onVerHistoricoCompleto,
  onFalarComMedico,
}: Glp1Props) {
  const [config, setConfig] = useState<Glp1Configuracao | null>(data.configuracao)
  const [aplicacoes, setAplicacoes] = useState<Glp1Aplicacao[]>(data.aplicacoes)
  const [pontos, setPontos] = useState<PontoPeso[]>(data.evolucaoPeso)
  const [stats, setStats] = useState<Glp1Stats | null>(data.stats)

  const [wizardOpen, setWizardOpen] = useState(false)
  const [doseOpen, setDoseOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [destaqueGrafico, setDestaqueGrafico] = useState(false)
  /** Doses registradas nesta sessão — soma ao total que veio do backend. */
  const [dosesRegistradas, setDosesRegistradas] = useState(0)

  const graficoRef = useRef<HTMLDivElement>(null)

  const mostrarToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  const concluirWizard = (payload: ConfiguracaoPayload) => {
    const novo = configFromPayload(payload, data.catalogo, config)
    let novosPontos = pontos
    if (payload.pesoAtualKg) {
      const reais = pontos.filter((p) => !p.projetado)
      const ultimo = reais.at(-1)
      novosPontos =
        ultimo && ultimo.data === HOJE
          ? pontos.map((p) =>
              p.data === HOJE && !p.projetado ? { ...p, pesoKg: payload.pesoAtualKg! } : p,
            )
          : [
              ...reais,
              { data: HOJE, pesoKg: payload.pesoAtualKg, projetado: false, aplicacao: false },
              ...pontos.filter((p) => p.projetado),
            ]
    }
    setConfig(novo)
    setPontos(novosPontos)
    setStats(calcularStats(novo, novosPontos, aplicacoes, stats, dosesRegistradas))
    setWizardOpen(false)
    onSalvarConfiguracao?.(payload)
    mostrarToast('Acompanhamento configurado')
  }

  const salvarAplicacao = (payload: Parameters<NonNullable<Glp1Props['onSalvarAplicacao']>>[0]) => {
    if (!config) return
    const med = data.catalogo.find((m) => m.id === payload.medicamentoId)
    const nova: Glp1Aplicacao = {
      id: `ap-local-${Date.now()}`,
      aplicadaEm: payload.aplicadaEm,
      haLabel: 'agora',
      medicamentoNome: med?.nome ?? config.medicamentoNome,
      dose: payload.dose,
      sitio: payload.sitio,
      dor: payload.dor,
      observacao: payload.observacao,
      pesoNoDiaKg: payload.pesoKg,
    }
    const novasAplicacoes = [nova, ...aplicacoes]

    let novosPontos = pontos
    if (payload.pesoKg) {
      novosPontos = pontos.map((p) =>
        p.data === HOJE && !p.projetado ? { ...p, pesoKg: payload.pesoKg!, aplicacao: true } : p,
      )
    }
    novosPontos = novosPontos.map((p) =>
      p.data === payload.aplicadaEm.slice(0, 10) && !p.projetado
        ? { ...p, aplicacao: true }
        : p,
    )

    setAplicacoes(novasAplicacoes)
    setDosesRegistradas(dosesRegistradas + 1)
    setPontos(novosPontos)
    setStats(calcularStats(config, novosPontos, novasAplicacoes, stats, dosesRegistradas + 1))
    setDoseOpen(false)
    onSalvarAplicacao?.(payload)

    // Fecha o modal e leva o olho pro gráfico de evolução.
    mostrarToast('Aplicação registrada')
    setDestaqueGrafico(true)
    window.setTimeout(() => {
      graficoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 120)
    window.setTimeout(() => setDestaqueGrafico(false), 2800)
  }

  // ==========================================================================
  // Estado inicial — ainda não configurou
  // ==========================================================================
  if (!config || !stats) {
    return (
      <div className="min-h-full bg-slate-950 pb-8">
        <div className="px-4 pt-5">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/15 flex items-center justify-center mb-3">
            <Syringe size={22} strokeWidth={2.2} className="text-teal-300" />
          </div>
          <h1 className="text-slate-50 text-[22px] font-bold leading-tight">
            Acompanhe seu GLP-1 e seu peso no mesmo lugar
          </h1>
          <p className="mt-2 text-slate-400 text-[13px] leading-relaxed">
            Registre cada aplicação, veja o local que usou, quanto doeu e como o peso
            responde semana a semana — com projeção até a sua meta.
          </p>

          <div className="mt-5 space-y-2.5">
            <Beneficio
              icone={<Syringe size={14} className="text-teal-300" />}
              titulo="Aplicações em 15 segundos"
              texto="Local, dose, dor e observação numa tela só."
            />
            <Beneficio
              icone={<TrendingDown size={14} className="text-emerald-300" />}
              titulo="Curva de peso com projeção"
              texto="Ritmo real vs. ritmo necessário pra bater a meta."
            />
            <Beneficio
              icone={<Sparkles size={14} className="text-sky-300" />}
              titulo="Lembrete no dia certo"
              texto="A gente avisa antes da próxima dose."
            />
            <Beneficio
              icone={<ShieldCheck size={14} className="text-violet-300" />}
              titulo="Seus dados, seu controle"
              texto="Compartilhe com seu médico quando quiser."
            />
          </div>

          <button
            onClick={() => setWizardOpen(true)}
            className="mt-6 w-full rounded-xl bg-teal-500 py-3.5 text-[14px] font-semibold text-slate-950 active:scale-[0.99] transition-transform"
          >
            Configurar acompanhamento
          </button>
          <p className="mt-2.5 text-center text-slate-500 text-[11px] leading-snug">
            Leva 1 minuto. A gente já traz seu peso, altura e data de nascimento do
            perfil.
          </p>
        </div>

        <SetupWizard
          open={wizardOpen}
          catalogo={data.catalogo}
          prefill={data.perfilPrefill}
          onClose={() => setWizardOpen(false)}
          onConcluir={concluirWizard}
        />
        <ToastInline mensagem={toast} />
      </div>
    )
  }

  // ==========================================================================
  // Painel configurado
  // ==========================================================================
  return (
    <div className="min-h-full bg-slate-950 pb-8">
      <ProtocoloCard
        configuracao={config}
        proximaDose={stats.proximaDose}
        semanas={stats.semanasTratamento}
        onNovaDose={() => setDoseOpen(true)}
        onAjustar={() => setWizardOpen(true)}
      />

      <StatsGrid stats={stats} />

      <div ref={graficoRef}>
        <EvolucaoPesoChart
          pontos={pontos}
          meta={config.meta}
          projecao={stats.projecao}
          destaque={destaqueGrafico}
        />
      </div>

      <HistoricoAplicacoes aplicacoes={aplicacoes} onVerTodas={onVerHistoricoCompleto} />

      <button
        onClick={onFalarComMedico}
        className="mx-4 mb-2 w-[calc(100%-2rem)] flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 py-3 text-[13px] font-medium text-slate-300 active:scale-[0.99] transition-transform"
      >
        <Stethoscope size={14} className="text-slate-400" />
        Compartilhar com meu médico
      </button>

      <p className="px-6 text-center text-slate-600 text-[10.5px] leading-snug">
        O Nymos acompanha e organiza. Prescrição e ajuste de dose são do seu médico.
      </p>

      <NovaDoseModal
        open={doseOpen}
        catalogo={data.catalogo}
        configuracao={config}
        sitiosRecentes={aplicacoes.slice(0, 2).map((a) => a.sitio)}
        sitioSaturado={data.sitioSaturado}
        onClose={() => setDoseOpen(false)}
        onSalvar={salvarAplicacao}
      />

      <SetupWizard
        open={wizardOpen}
        catalogo={data.catalogo}
        prefill={data.perfilPrefill}
        inicial={{
          medicamentoId: config.medicamentoId,
          dose: config.dose,
          frequencia: config.frequencia,
          diaSemana: config.diaSemana,
          horario: config.horario,
          nascimento: config.perfil.nascimento,
          alturaCm: config.perfil.alturaCm,
          pesoAtualKg: stats.pesoAtualKg,
          pesoAlvoKg: config.meta.pesoAlvoKg,
          dataAlvo: config.meta.dataAlvo,
          lembreteAtivo: config.lembreteAtivo,
        }}
        onClose={() => setWizardOpen(false)}
        onConcluir={concluirWizard}
      />

      <ToastInline mensagem={toast} />
    </div>
  )
}

function Beneficio({
  icone,
  titulo,
  texto,
}: {
  icone: React.ReactNode
  titulo: string
  texto: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-3">
      <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
        {icone}
      </div>
      <div>
        <div className="text-slate-100 text-[13px] font-medium">{titulo}</div>
        <div className="mt-0.5 text-slate-400 text-[11.5px] leading-snug">{texto}</div>
      </div>
    </div>
  )
}

function ToastInline({ mensagem }: { mensagem: string | null }) {
  if (!mensagem) return null
  return (
    <div className="fixed left-4 right-4 bottom-24 z-[60] flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-3 shadow-lg shadow-teal-500/20">
      <span className="text-slate-950 text-[13px] font-semibold">{mensagem}</span>
    </div>
  )
}
