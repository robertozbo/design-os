import { AlertTriangle, CheckCircle2, Eye, Save, X } from 'lucide-react'
import type {
  AbaFormulario,
  CircunferenciaId,
  DobraId,
  LiberacaoMedica,
  Medidas,
  NivelAtividade,
  NovaAvaliacaoFormProps,
  ObjetivoId,
  ProtocoloId,
} from '@/../product-clinic/sections/avaliacao-fisica/types'
import {
  CIRCUNFERENCIAS,
  DOBRAS_ORDEM,
  DOBRA_LABEL,
  LIBERACAO_LABEL,
  LIBERACAO_TOM,
  LIMITES,
  NIVEL_ATIVIDADE_LABEL,
  PROTOCOLOS,
  PROTOCOLO_POR_ID,
  calcular,
  dobrasDoProtocolo,
  fmsTotal,
  resumirFuncional,
} from './formulas'
import {
  ClassBadge,
  CollapsibleBlock,
  NumberInput,
  PhotoSlot,
  Select,
  SubTitulo,
  TextArea,
  ValorDoCadastro,
} from './FormPrimitives'
import { FuncionalForm } from './FuncionalForm'
import { ResultadoFuncionalPanel } from './ResultadoFuncionalPanel'
import { ResultadoPanel } from './ResultadoPanel'
import {
  CONSELHO_LABEL,
  COR_CONSELHO,
  NIVEIS_ATIVIDADE,
  OBJETIVOS,
  OBJETIVO_LABEL,
  TOM_BADGE,
  numero,
} from './helpers'

/**
 * O formulário de avaliação física da clínica — a mesma tela para a nutricionista e para o
 * educador físico.
 *
 * Três decisões carregam o resto:
 *
 * 1. **Nenhuma dobra some quando o protocolo muda.** Os nove sítios ficam sempre montados; o
 *    protocolo só decide quais ganham destaque (anel teal + ponto) e quais recuam (opacidade 40%,
 *    voltando no hover). Esconder campo faria o avaliador perder a medida que já tinha na mão só
 *    porque trocou de equação — e a medida vale mesmo fora do cálculo.
 *
 * 2. **O painel da direita recalcula a cada tecla.** Não existe botão "calcular": um resultado que
 *    só aparece no fim é um resultado que ninguém confere enquanto ainda está com o adipômetro na
 *    mão.
 *
 * 3. **Funcional é aba, não bloco.** Para a nutrição ela nunca é preenchida, e cinco blocos vazios
 *    no meio do formulário ensinam que a avaliação está incompleta quando ela está inteira.
 */
export function NovaAvaliacaoForm({
  paciente,
  avaliador,
  avaliacao,
  anterior,
  aba,
  onAba,
  onData,
  onMedidas,
  onProtocolo,
  onUsarBioimpedancia,
  onCondicao,
  onFotos,
  onFuncional,
  onParecer,
  onVisivelAoPaciente,
  onObjetivo,
  onNivelAtividade,
  onMetaGordura,
  onSalvarRascunho,
  onConcluir,
  onCancelar,
}: NovaAvaliacaoFormProps) {
  const m = avaliacao.medidas
  const cor = COR_CONSELHO[avaliador.conselho]
  const ctx = {
    sexo: paciente.sexo,
    idade: paciente.idade,
    nivelAtividade: paciente.nivelAtividade,
    metaGorduraPct: paciente.metaGorduraPct,
  }
  const r = calcular(m, avaliacao.protocolo, ctx, avaliacao.usarBioimpedancia)
  const rAnterior = anterior
    ? calcular(anterior.medidas, anterior.protocolo, ctx, anterior.usarBioimpedancia)
    : null

  const exigidas = dobrasDoProtocolo(avaliacao.protocolo, paciente.sexo)
  const exigidasSet = new Set<DobraId>(exigidas)
  const meta = avaliacao.protocolo ? PROTOCOLO_POR_ID[avaliacao.protocolo] : null

  const setMedidas = (patch: Partial<Medidas>) => onMedidas({ ...m, ...patch })
  const setDobra = (id: DobraId, v: number | null) => {
    const dobras = { ...m.dobras }
    if (v == null) delete dobras[id]
    else dobras[id] = v
    setMedidas({ dobras })
  }
  const setCirc = (id: CircunferenciaId, v: number | null) => {
    const circunferencias = { ...m.circunferencias }
    if (v == null) delete circunferencias[id]
    else circunferencias[id] = v
    setMedidas({ circunferencias })
  }
  const setBio = (campo: keyof NonNullable<Medidas['bioimpedancia']>, v: number | null) => {
    const base = m.bioimpedancia ?? {
      gorduraPct: null,
      massaMagraKg: null,
      massaMuscularKg: null,
      aguaCorporalPct: null,
      gorduraVisceralNivel: null,
      massaOsseaKg: null,
      tmbKcal: null,
      idadeMetabolica: null,
    }
    setMedidas({ bioimpedancia: { ...base, [campo]: v } })
  }

  // Validação por faixa. Nenhum campo é obrigatório — o que trava é valor impossível.
  const foraDaFaixa = (v: number | null | undefined, min: number, max: number) =>
    v != null && (v < min || v > max)
  const invalido =
    foraDaFaixa(m.pesoKg, LIMITES.pesoKg.min, LIMITES.pesoKg.max) ||
    foraDaFaixa(m.alturaCm, LIMITES.alturaCm.min, LIMITES.alturaCm.max) ||
    DOBRAS_ORDEM.some((d) => foraDaFaixa(m.dobras[d], LIMITES.dobraMm.min, LIMITES.dobraMm.max)) ||
    CIRCUNFERENCIAS.some((c) => foraDaFaixa(m.circunferencias[c.id], c.min, c.max))

  const semBasico = !m.pesoKg || !m.alturaCm
  const bloqueio = invalido
    ? 'Corrija os campos em vermelho'
    : semBasico
      ? 'Informe peso e estatura para concluir'
      : null

  const cond = avaliacao.condicao
  const temCircunferencia = Object.keys(m.circunferencias).length > 0
  const temDobra = Object.keys(m.dobras).length > 0
  const temBio = !!m.bioimpedancia
  const temCondicao =
    cond.lesoesAtuais.trim().length > 0 ||
    cond.cirurgiasPrevias.trim().length > 0 ||
    cond.restricoes.trim().length > 0 ||
    cond.liberacaoMedica !== 'nao-informado'
  const temFoto = avaliacao.fotos.frontal || avaliacao.fotos.lateral || avaliacao.fotos.posterior

  const resumoFuncional = resumirFuncional(avaliacao.funcional, m.pesoKg)
  const temFuncional =
    resumoFuncional.totalRM != null ||
    fmsTotal(avaliacao.funcional?.fms ?? null) != null ||
    !!avaliacao.funcional?.cardio ||
    !!avaliacao.funcional?.flexibilidade ||
    !!avaliacao.funcional?.resistenciaLocal

  // O conselho de quem avalia decide o que já abre: a nutricionista mede fita e balança de
  // bioimpedância; o educador físico mede adipômetro. Os dois blocos existem para os dois — o
  // que muda é o que está na frente ao abrir a tela.
  const focoDobras = avaliador.conselho === 'CREF'

  const abas: { id: AbaFormulario; label: string; preenchida: boolean }[] = [
    { id: 'antropometria', label: 'Antropometria', preenchida: !!m.pesoKg },
    { id: 'funcional', label: 'Funcional', preenchida: temFuncional },
  ]

  const parecerBloco = (
    <CollapsibleBlock
      title="Parecer do avaliador"
      description="Vira a evolução no prontuário compartilhado ao concluir"
      defaultOpen
      active={avaliacao.parecer.trim().length > 0}
    >
      <div className="space-y-3">
        <textarea
          value={avaliacao.parecer}
          onChange={(e) => onParecer(e.target.value)}
          rows={4}
          placeholder="Leitura da avaliação, conduta e o que reavaliar na próxima…"
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-xs leading-relaxed text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        />

        <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-800">
          <input
            type="checkbox"
            checked={avaliacao.visivelAoPaciente}
            onChange={(e) => onVisivelAoPaciente(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 accent-teal-500"
          />
          <span className="text-[11px] leading-snug text-slate-600 dark:text-slate-300">
            <Eye className="mr-1 inline h-3 w-3 text-slate-400" />
            Publicar esta avaliação no app do paciente
            <span className="mt-0.5 block text-[10px] text-slate-400">
              Dentro da clínica as medidas já são compartilhadas entre os profissionais
              vinculados ao paciente. O que precisa de decisão é o que sai da clínica.
            </span>
          </span>
        </label>

        <p className="text-[10px] leading-snug text-slate-400">
          Assinado por {avaliador.nome} ({avaliador.registro}).
        </p>
      </div>
    </CollapsibleBlock>
  )

  return (
    <div className="min-h-screen bg-slate-100 pb-24 dark:bg-slate-950">
      {/* Barra fixa: quem é o paciente, quem assina e as duas ações que encerram */}
      <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto max-w-7xl px-4 py-3 pl-16 lg:pl-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              aria-label="Sair da avaliação"
              onClick={onCancelar}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>

            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${cor.barra}`}
            >
              {paciente.iniciais}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {paciente.nome}
                </span>
                <span className="text-[11px] text-slate-400">
                  {paciente.idade}a · {paciente.sexo === 'M' ? 'masculino' : 'feminino'} ·{' '}
                  {paciente.convenio}
                </span>
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${cor.chip}`}>
                  Avaliação física · {CONSELHO_LABEL[avaliador.conselho]}
                </span>
                <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {OBJETIVO_LABEL[paciente.objetivo]}
                </span>
              </div>
              <div className="truncate text-[11px] text-slate-400">
                {avaliador.nome} · {avaliador.registro} · {avaliacao.dataLabel}
                {anterior ? ` · anterior em ${anterior.dataLabel}` : ' · primeira avaliação'}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onSalvarRascunho}
                disabled={invalido}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Save className="h-3.5 w-3.5" /> Salvar rascunho
              </button>
              <button
                onClick={onConcluir}
                disabled={!!bloqueio}
                title={bloqueio ?? undefined}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-slate-300 dark:disabled:bg-slate-700"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Concluir avaliação
              </button>
            </div>
          </div>

          {paciente.observacaoCritica && (
            <div className="mt-2 rounded-lg bg-rose-50 px-3 py-1.5 text-[11px] font-medium text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
              {paciente.observacaoCritica}
            </div>
          )}

          {/* Abas: antropometria é de todo mundo; funcional é de quem prescreve treino */}
          <div className="mt-2 flex items-center gap-1">
            {abas.map((t) => {
              const ativo = aba === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => onAba(t.id)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                    ativo
                      ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
                      : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  {t.label}
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      t.preenchida ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                </button>
              )
            })}
            {bloqueio && (
              <span className="ml-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                {bloqueio}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-4 lg:grid lg:grid-cols-[1fr_380px] lg:gap-4">
        {/* Formulário */}
        <div className="min-w-0 space-y-3">
          {aba === 'antropometria' ? (
            <>
              <p className="px-1 text-[11px] text-slate-500 dark:text-slate-400">
                Cada bloco pode ser preenchido ou pulado — a avaliação que só mediu peso e cintura
                continua valendo. O painel ao lado recalcula a cada medida.
              </p>

              {/* Identificação: o que muda o cálculo antes de qualquer medida */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <SubTitulo>Identificação</SubTitulo>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="block">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      Data
                    </span>
                    <input
                      type="date"
                      value={avaliacao.data}
                      onChange={(e) => onData(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-700 outline-none transition-colors focus:border-teal-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                    />
                  </label>
                  <ValorDoCadastro label="Idade" valor={`${paciente.idade} anos`} />
                  <ValorDoCadastro
                    label="Sexo"
                    valor={paciente.sexo === 'M' ? 'Masculino' : 'Feminino'}
                  />
                  <ValorDoCadastro label="Avaliador" valor={avaliador.registro} />
                </div>
                <p className="mt-1.5 text-[10px] text-slate-400">
                  Idade e sexo entram na equação do % de gordura e na tabela de classificação —
                  vêm do cadastro do paciente e não se editam aqui.
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Select
                    label="Objetivo"
                    value={paciente.objetivo}
                    options={OBJETIVOS.map((o: ObjetivoId) => ({
                      id: o,
                      label: OBJETIVO_LABEL[o],
                    }))}
                    onChange={onObjetivo}
                  />
                  <Select
                    label="Nível de atividade"
                    value={paciente.nivelAtividade}
                    options={NIVEIS_ATIVIDADE.map((n: NivelAtividade) => ({
                      id: n,
                      label: NIVEL_ATIVIDADE_LABEL[n],
                    }))}
                    onChange={onNivelAtividade}
                    hint="multiplica a TMB no GET"
                  />
                  <NumberInput
                    label="Meta de gordura"
                    unit="%"
                    step={0.5}
                    min={3}
                    max={50}
                    value={paciente.metaGorduraPct}
                    onChange={onMetaGordura}
                    hint={`adequado ~${numero(r.gorduraAlvoPct)}%`}
                  />
                </div>
              </section>

              <CollapsibleBlock
                title="Básico"
                description="Peso, estatura e IMC (calculado)"
                defaultOpen
                active={!!m.pesoKg || !!m.alturaCm}
                badge={<ClassBadge prefixo="IMC" classificacao={r.imcClasse} />}
              >
                <div className="grid gap-3 sm:grid-cols-3">
                  <NumberInput
                    label="Peso"
                    unit="kg"
                    step={0.1}
                    min={LIMITES.pesoKg.min}
                    max={LIMITES.pesoKg.max}
                    value={m.pesoKg}
                    onChange={(v) => setMedidas({ pesoKg: v })}
                  />
                  <NumberInput
                    label="Estatura"
                    unit="cm"
                    step={0.5}
                    min={LIMITES.alturaCm.min}
                    max={LIMITES.alturaCm.max}
                    value={m.alturaCm}
                    onChange={(v) => setMedidas({ alturaCm: v })}
                  />
                  <NumberInput
                    label="IMC"
                    unit="kg/m²"
                    value={r.imc != null ? Math.round(r.imc * 10) / 10 : null}
                    computed
                    hint="auto-calculado"
                  />
                </div>
              </CollapsibleBlock>

              <CollapsibleBlock
                title="Dobras cutâneas"
                description={
                  meta ? `${meta.label} → % de gordura calculado` : 'Escolha o protocolo de análise'
                }
                defaultOpen={focoDobras}
                active={temDobra}
                badge={
                  r.somaDobras != null ? (
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                      Σ {numero(r.somaDobras, 0)} mm
                    </span>
                  ) : undefined
                }
              >
                <div className="space-y-3">
                  <label className="block">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      Protocolo de análise
                    </span>
                    <select
                      value={avaliacao.protocolo ?? ''}
                      onChange={(e) => onProtocolo(e.target.value as ProtocoloId)}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none transition-colors focus:border-teal-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                    >
                      <option value="" disabled>
                        Selecione um protocolo…
                      </option>
                      {PROTOCOLOS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  {meta && (
                    <div className="rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/50">
                      <p className="text-[11px] leading-snug text-slate-600 dark:text-slate-300">
                        <span className="mr-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500 align-middle" />
                        Dobras usadas pelo {meta.label}:{' '}
                        <strong className="font-semibold text-slate-800 dark:text-slate-100">
                          {exigidas.map((d) => DOBRA_LABEL[d]).join(' · ')}
                        </strong>
                        . As demais ficam opacas — podem ser medidas, mas não entram no cálculo.
                      </p>
                      <p className="mt-1.5 font-mono text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                        {meta.formula}
                      </p>
                      {meta.populacao && (
                        <p className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">
                          Validado para: {meta.populacao}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {DOBRAS_ORDEM.map((d) => (
                      <NumberInput
                        key={d}
                        label={DOBRA_LABEL[d]}
                        unit="mm"
                        step={1}
                        min={LIMITES.dobraMm.min}
                        max={LIMITES.dobraMm.max}
                        value={m.dobras[d] ?? null}
                        onChange={(v) => setDobra(d, v)}
                        destaque={exigidasSet.has(d)}
                        apagado={!!avaliacao.protocolo && !exigidasSet.has(d)}
                      />
                    ))}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <NumberInput
                      label="% Gordura"
                      unit="%"
                      value={r.gorduraPct != null ? Math.round(r.gorduraPct * 10) / 10 : null}
                      computed
                      hint={
                        r.gorduraPct != null
                          ? `${meta?.label ?? ''} · ${paciente.sexo} · ${paciente.idade}a`
                          : r.faltando.length > 0
                            ? `falta ${r.faltando.length} dobra${r.faltando.length > 1 ? 's' : ''}`
                            : 'sem protocolo'
                      }
                    />
                    <NumberInput
                      label="Massa gorda"
                      unit="kg"
                      value={r.massaGordaKg != null ? Math.round(r.massaGordaKg * 10) / 10 : null}
                      computed
                      hint={
                        r.massaGordaAlvoKg != null
                          ? `ideal ~${numero(r.massaGordaAlvoKg)} kg`
                          : undefined
                      }
                    />
                    <NumberInput
                      label="Massa magra"
                      unit="kg"
                      value={r.massaMagraKg != null ? Math.round(r.massaMagraKg * 10) / 10 : null}
                      computed
                      hint={
                        r.massaMagraAlvoKg != null
                          ? `ideal ~${numero(r.massaMagraAlvoKg)} kg`
                          : undefined
                      }
                    />
                  </div>
                </div>
              </CollapsibleBlock>

              <CollapsibleBlock
                title="Circunferências"
                description="Fita métrica · alimentam RCQ, RCE, risco de cintura e CMB"
                defaultOpen={!focoDobras}
                active={temCircunferencia}
                badge={<ClassBadge prefixo="RCQ" classificacao={r.rcqClasse} />}
              >
                <div className="space-y-4">
                  {(['Tronco', 'Membros superiores', 'Membros inferiores'] as const).map(
                    (grupo) => (
                      <div key={grupo}>
                        <SubTitulo>{grupo}</SubTitulo>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {CIRCUNFERENCIAS.filter((c) => c.grupo === grupo).map((c) => (
                            <NumberInput
                              key={c.id}
                              label={c.label}
                              unit="cm"
                              step={0.5}
                              min={c.min}
                              max={c.max}
                              value={m.circunferencias[c.id] ?? null}
                              onChange={(v) => setCirc(c.id, v)}
                            />
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CollapsibleBlock>

              <CollapsibleBlock
                title="Bioimpedância"
                description="O que a balança informa. O aparelho mediu — aqui não se recalcula."
                active={temBio && avaliacao.usarBioimpedancia}
                badge={
                  avaliacao.usarBioimpedancia ? (
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-950/40 dark:text-teal-300">
                      fonte do % de gordura
                    </span>
                  ) : undefined
                }
              >
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-slate-200 px-3 py-2.5 dark:border-slate-800">
                    <input
                      type="checkbox"
                      checked={avaliacao.usarBioimpedancia}
                      onChange={(e) => onUsarBioimpedancia(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 accent-teal-500"
                    />
                    <span className="text-[11px] leading-snug text-slate-600 dark:text-slate-300">
                      Usar a bioimpedância como fonte do % de gordura
                      <span className="mt-0.5 block text-[10px] text-slate-400">
                        Dobras e balança quase nunca dão o mesmo número. A tela mostra um só, e diz
                        qual — dois percentuais de gordura na mesma avaliação é o começo de um
                        laudo que ninguém sabe ler.
                      </span>
                    </span>
                  </label>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <NumberInput
                      label="% Gordura"
                      unit="%"
                      value={m.bioimpedancia?.gorduraPct ?? null}
                      onChange={(v) => setBio('gorduraPct', v)}
                    />
                    <NumberInput
                      label="Massa magra"
                      unit="kg"
                      value={m.bioimpedancia?.massaMagraKg ?? null}
                      onChange={(v) => setBio('massaMagraKg', v)}
                    />
                    <NumberInput
                      label="Massa muscular"
                      unit="kg"
                      value={m.bioimpedancia?.massaMuscularKg ?? null}
                      onChange={(v) => setBio('massaMuscularKg', v)}
                    />
                    <NumberInput
                      label="Massa óssea"
                      unit="kg"
                      value={m.bioimpedancia?.massaOsseaKg ?? null}
                      onChange={(v) => setBio('massaOsseaKg', v)}
                    />
                    <NumberInput
                      label="Água corporal"
                      unit="%"
                      value={m.bioimpedancia?.aguaCorporalPct ?? null}
                      onChange={(v) => setBio('aguaCorporalPct', v)}
                    />
                    <NumberInput
                      label="Gordura visceral"
                      unit="nível"
                      step={1}
                      value={m.bioimpedancia?.gorduraVisceralNivel ?? null}
                      onChange={(v) => setBio('gorduraVisceralNivel', v)}
                      hint="≥ 10 é alto"
                    />
                    <NumberInput
                      label="TMB"
                      unit="kcal"
                      step={1}
                      value={m.bioimpedancia?.tmbKcal ?? null}
                      onChange={(v) => setBio('tmbKcal', v)}
                    />
                    <NumberInput
                      label="Idade metabólica"
                      unit="anos"
                      step={1}
                      value={m.bioimpedancia?.idadeMetabolica ?? null}
                      onChange={(v) => setBio('idadeMetabolica', v)}
                      hint={`cronológica ${paciente.idade}a`}
                    />
                  </div>
                </div>
              </CollapsibleBlock>

              <CollapsibleBlock
                title="Condição física"
                description="Lesões, cirurgias, restrições e liberação médica"
                active={temCondicao}
                badge={
                  cond.liberacaoMedica !== 'nao-informado' ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        TOM_BADGE[LIBERACAO_TOM[cond.liberacaoMedica]]
                      }`}
                    >
                      {LIBERACAO_LABEL[cond.liberacaoMedica]}
                    </span>
                  ) : undefined
                }
              >
                <div className="space-y-3">
                  <TextArea
                    label="Lesões / dores atuais"
                    valor={cond.lesoesAtuais}
                    onChange={(v) => onCondicao({ ...cond, lesoesAtuais: v })}
                    placeholder="Ex.: dor lombar baixa, tendinite no ombro direito…"
                  />
                  <TextArea
                    label="Cirurgias prévias"
                    valor={cond.cirurgiasPrevias}
                    onChange={(v) => onCondicao({ ...cond, cirurgiasPrevias: v })}
                    placeholder="Ex.: reconstrução de LCA em 2022 (joelho direito)…"
                  />
                  <TextArea
                    label="Restrições / cuidados"
                    valor={cond.restricoes}
                    onChange={(v) => onCondicao({ ...cond, restricoes: v })}
                    placeholder="Movimentos a evitar, cargas máximas, recomendações…"
                  />
                  <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
                    <Select
                      label="Liberação médica"
                      value={cond.liberacaoMedica}
                      options={(
                        [
                          'nao-informado',
                          'liberado',
                          'com-restricoes',
                          'contraindicado',
                        ] as LiberacaoMedica[]
                      ).map((l) => ({ id: l, label: LIBERACAO_LABEL[l] }))}
                      onChange={(l) => onCondicao({ ...cond, liberacaoMedica: l })}
                    />
                    <TextArea
                      label="Nota da liberação"
                      linhas={1}
                      valor={cond.liberacaoNota}
                      onChange={(v) => onCondicao({ ...cond, liberacaoNota: v })}
                      placeholder="Quem liberou (CRM), restrições e data do atestado…"
                    />
                  </div>

                  {cond.liberacaoMedica === 'contraindicado' && (
                    <p className="inline-flex items-start gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-[11px] leading-snug text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
                      <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                      <span>
                        Exercício contraindicado por médico. A avaliação pode ser registrada — o
                        que não pode é virar prescrição de treino.
                      </span>
                    </p>
                  )}
                  {cond.liberacaoMedica === 'nao-informado' && avaliador.conselho === 'CREF' && (
                    <p className="text-[10px] leading-snug text-amber-600 dark:text-amber-400">
                      Sem liberação registrada. Na clínica ela pode vir do médico da própria equipe
                      — vale pedir antes de prescrever.
                    </p>
                  )}
                </div>
              </CollapsibleBlock>

              <CollapsibleBlock
                title="Fotos"
                description="Frontal, lateral e posterior — pareadas com as da avaliação anterior"
                active={temFoto}
                badge={
                  temFoto ? (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold tabular-nums text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {[
                        avaliacao.fotos.frontal,
                        avaliacao.fotos.lateral,
                        avaliacao.fotos.posterior,
                      ].filter(Boolean).length}
                      /3
                    </span>
                  ) : undefined
                }
              >
                <div className="grid grid-cols-3 gap-3 sm:max-w-md">
                  <PhotoSlot
                    label="Frontal"
                    preenchida={avaliacao.fotos.frontal}
                    onToggle={() =>
                      onFotos({ ...avaliacao.fotos, frontal: !avaliacao.fotos.frontal })
                    }
                  />
                  <PhotoSlot
                    label="Lateral"
                    preenchida={avaliacao.fotos.lateral}
                    onToggle={() =>
                      onFotos({ ...avaliacao.fotos, lateral: !avaliacao.fotos.lateral })
                    }
                  />
                  <PhotoSlot
                    label="Posterior"
                    preenchida={avaliacao.fotos.posterior}
                    onToggle={() =>
                      onFotos({ ...avaliacao.fotos, posterior: !avaliacao.fotos.posterior })
                    }
                  />
                </div>
                <p className="mt-2 text-[10px] leading-snug text-slate-400">
                  Foto é dado de saúde: entra na mesma decisão de publicação do parecer, e não vai
                  ao app do paciente sem ela.
                </p>
              </CollapsibleBlock>

              {parecerBloco}
            </>
          ) : (
            <>
              <p className="px-1 text-[11px] text-slate-500 dark:text-slate-400">
                Metade de desempenho — força, mobilidade, aptidão cardiorrespiratória e resistência
                local. Opcional: a consulta de nutrição costuma parar na antropometria.
              </p>
              <FuncionalForm
                funcional={avaliacao.funcional}
                pesoKg={m.pesoKg}
                onChange={onFuncional}
              />
              {parecerBloco}
            </>
          )}
        </div>

        {/* Resultado ao vivo */}
        <div className="mt-3 lg:mt-0">
          <div className="lg:sticky lg:top-24">
            {aba === 'antropometria' ? (
              <ResultadoPanel
                paciente={paciente}
                protocolo={avaliacao.protocolo}
                resultado={r}
                anterior={rAnterior}
              />
            ) : (
              <ResultadoFuncionalPanel
                funcional={avaliacao.funcional}
                pesoKg={m.pesoKg}
                anterior={anterior?.funcional ?? null}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
