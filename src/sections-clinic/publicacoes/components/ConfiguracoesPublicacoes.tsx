import { useRef, useState } from 'react'
import {
  AlertTriangle,
  Building2,
  Check,
  Instagram,
  Palette,
  Upload,
  X,
  Repeat,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import type {
  ContaConectada,
  ContextoNegocio,
  ObjetivoConteudo,
  TemplateId,
  PadroesMarca,
  PautaSemanal,
  QuemAprova,
  RegrasAprovacao,
} from '@/../product-clinic/sections/publicacoes/types'
import { Arte } from './Arte'
import { extrairPaleta } from './paleta'
import {
  DIA_SEMANA,
  TEMPLATE_DESCRICAO,
  TEMPLATE_LABEL,
  diasAte,
  quando,
} from './helpers'

interface Props {
  conta: ContaConectada
  pauta: PautaSemanal
  contexto: ContextoNegocio
  clinica: { nome: string; especialidades: string[] }
  padroes: PadroesMarca
  regras: RegrasAprovacao
  onConectarConta: () => void
  onDesconectarConta: () => void
  onAlternarPauta: (ativa: boolean) => void
  onSalvarPadroes: (p: PadroesMarca) => void
  onSalvarRegras: (r: RegrasAprovacao) => void
  onSalvarContexto: (c: ContextoNegocio) => void
}

const TONS = ['acolhedor', 'informativo', 'direto', 'técnico']

const ACENTOS = [
  { id: 'teal', nome: 'Teal (marca)', classe: 'bg-teal-600' },
  { id: 'emerald', nome: 'Verde', classe: 'bg-emerald-600' },
  { id: 'sky', nome: 'Azul', classe: 'bg-sky-600' },
  { id: 'violet', nome: 'Violeta', classe: 'bg-violet-600' },
  { id: 'amber', nome: 'Âmbar', classe: 'bg-amber-500' },
  { id: 'stone', nome: 'Neutro', classe: 'bg-stone-600' },
]
const TEMPLATES: TemplateId[] = [
  'editorial',
  'lista',
  'estatistica',
  'convite',
  'citacao',
  'foto',
]

/**
 * Uma palavra por template para a carta do leque.
 *
 * A vitrine da grade é larga e comporta a frase inteira; a carta do leque tem 72px e a
 * mesma frase quebrava em três linhas até bater na barra de acento. A carta ali só
 * precisa provar a cor.
 */
const AMOSTRA_CURTA: Record<TemplateId, string> = {
  editorial: 'Dica',
  lista: 'Passo',
  estatistica: '',
  convite: 'Agende',
  citacao: 'Fala',
  foto: 'Bastidor',
}

/** Conteúdo de vitrine da miniatura — cada layout mostrado com o que ele serve. */
const AMOSTRA: Record<TemplateId, { titulo: string; texto: string; destaque?: string }> = {
  editorial: { titulo: 'Nutrição em todas as idades', texto: 'Na infância constrói.' },
  lista: { titulo: 'Proteína em toda refeição', texto: 'É o que sustenta a saciedade.' },
  estatistica: { titulo: 'do sódio vem de industrializado', texto: '', destaque: '77%' },
  convite: { titulo: 'Agenda aberta', texto: 'Avaliação com a equipe' },
  citacao: { titulo: '“A sede engana no frio.”', texto: 'Marina Coelho' },
  foto: { titulo: 'Bastidor da clínica', texto: 'Reunião de caso' },
}

const OBJETIVO_LABEL: Record<ObjetivoConteudo, { titulo: string; ajuda: string }> = {
  captar: { titulo: 'Captar pacientes', ajuda: 'Todo post fecha em convite para avaliação' },
  educar: { titulo: 'Educar', ajuda: 'Explica e não vende; o convite é discreto' },
  fidelizar: { titulo: 'Fidelizar', ajuda: 'Fala com quem já é paciente — bastidor, equipe, rotina' },
  'divulgar-servicos': { titulo: 'Divulgar serviços', ajuda: 'Destaca exames, convênios e novidades da casa' },
}

const APROVA_LABEL: Record<QuemAprova, string> = {
  gestor: 'Só o gestor',
  'gestor-e-autor': 'Gestor ou o autor do post',
  qualquer: 'Qualquer pessoa da equipe',
}

/**
 * A aba de configurações do módulo.
 *
 * Mora aqui, e não nas Configurações da clínica, porque o módulo é vendido à parte:
 * quem não compra Marketing não deve ver configuração de Instagram no cadastro da
 * clínica. O que fica lá é só o preço e a cota — que é cobrança, não preferência.
 */
export function ConfiguracoesPublicacoes({
  conta,
  pauta,
  contexto,
  clinica,
  padroes,
  regras,
  onConectarConta,
  onDesconectarConta,
  onAlternarPauta,
  onSalvarPadroes,
  onSalvarRegras,
  onSalvarContexto,
}: Props) {
  const [rascunho, setRascunho] = useState<PadroesMarca>(padroes)
  const [extraindo, setExtraindo] = useState(false)
  const [erroPaleta, setErroPaleta] = useState<string | null>(null)
  const inputLogo = useRef<HTMLInputElement>(null)
  const sujo = JSON.stringify(rascunho) !== JSON.stringify(padroes)
  const diasToken = diasAte(conta.tokenExpiraEm)

  /** Cores da marca Nymos + as extraídas do logo da clínica, nesta ordem. */
  const cores = [
    ...ACENTOS,
    ...rascunho.paletaImportada.map((hex) => ({ id: hex, nome: hex, classe: '' })),
  ]

  const importarLogo = async (arquivo: File | undefined) => {
    if (!arquivo) return
    setExtraindo(true)
    setErroPaleta(null)
    try {
      const paleta = await extrairPaleta(arquivo)
      if (paleta.length === 0) {
        // Logo monocromático ou em preto e branco: o filtro descarta cinza e quase-branco,
        // então não sobra cor. Dizer isso é melhor que devolver cinco cinzas.
        setErroPaleta('Não achei cor de marca nessa imagem — logo em preto e branco não tem o que extrair.')
        return
      }
      setRascunho((r) => ({
        ...r,
        paletaImportada: paleta.map((c) => c.hex),
        acento: paleta[0].hex,
      }))
    } catch {
      setErroPaleta('Não consegui ler o arquivo. Use PNG, JPG ou WebP.')
    } finally {
      setExtraindo(false)
    }
  }

  // Multi-column em vez de grid: os blocos têm alturas muito diferentes (Padrões é
  // três vezes Aprovação) e, no grid, a linha inteira esticava para caber o maior,
  // deixando metade da tela vazia. Aqui cada bloco flui para a coluna com espaço.
  return (
    <div className="gap-4 lg:columns-2 [&>*]:mb-4 [&>*]:break-inside-avoid">
      {/* Conta do Instagram */}
      <Bloco titulo="Conta do Instagram" icone={Instagram}>
        {conta.conectada ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-mono text-sm text-slate-700 dark:text-slate-200">
                  {conta.usuario}
                </p>
                <p className="truncate text-xs text-slate-400 dark:text-slate-500">{conta.nome}</p>
              </div>
              <button
                onClick={onDesconectarConta}
                className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Desconectar
              </button>
            </div>

            <dl className="mt-3 space-y-1.5 text-xs">
              <Linha rotulo="Publicações hoje">
                <span className="tabular-nums">
                  {conta.publicadosHoje} de {conta.limiteDiario}
                </span>
                <span className="text-slate-400"> · limite da API</span>
              </Linha>
              <Linha rotulo="Autorização">
                <span
                  className={
                    diasToken <= 7 ? 'font-medium text-amber-600 dark:text-amber-400' : undefined
                  }
                >
                  {diasToken <= 0 ? 'expirada' : `expira em ${diasToken} dias`}
                </span>
              </Linha>
            </dl>

            {diasToken <= 7 && (
              <button
                onClick={onConectarConta}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Renovar autorização
              </button>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Nenhuma conta conectada — nada é publicado.
            </p>
            <button
              onClick={onConectarConta}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              <Instagram className="h-4 w-4" /> Conectar Instagram
            </button>
          </>
        )}

        <p className="mt-3 border-t border-slate-100 pt-2.5 text-[11px] leading-relaxed text-slate-400 dark:border-slate-800 dark:text-slate-500">
          Exige conta <strong className="font-medium">Business</strong> ou{' '}
          <strong className="font-medium">Creator</strong> — conta pessoal não publica por API. Não
          há chave para digitar: o aplicativo no Meta é da Nymos, já aprovado. Conectar abre o
          consentimento e você escolhe a conta.
        </p>
      </Bloco>

      {/* Pauta semanal */}
      <Bloco titulo="Pauta semanal" icone={Repeat}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {pauta.ativa
              ? `Toda ${DIA_SEMANA[pauta.diaSemana]} às ${pauta.hora} · próxima em ${quando(pauta.proximaGeracao)}`
              : 'Desligada — nenhum rascunho é gerado sozinho'}
          </p>
          <Toggle ativo={pauta.ativa} onToggle={() => onAlternarPauta(!pauta.ativa)} rotulo="Pauta semanal" />
        </div>

        {pauta.ativa && (
          <>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {pauta.temas.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-300"
                >
                  {t}
                </span>
              ))}
            </div>
            {/*
              O texto vai num <span> único: com `flex` no <p>, cada nó filho — inclusive
              o <strong> e cada pedaço de texto ao redor dele — virava um flex item e a
              frase quebrava em colunas.
            */}
            <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
              <span>
                Gera em <strong className="font-medium">Revisar</strong>, nunca em Agendado, e usa{' '}
                {padroes.autorPadrao.nome} ({padroes.autorPadrao.conselho}) como autor — é o
                conselho dele que valida a peça.
              </span>
            </p>
          </>
        )}
      </Bloco>

      {/* Padrões da marca */}
      <Bloco titulo="Padrões da marca" icone={Sparkles}>
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          O que a IA assume quando o brief não diz.
        </p>

        <Campo rotulo="Cor de acento">
          {/*
            Leque em vez de bolinha de cor: cada carta é o template ESCOLHIDO naquela
            cor, então a decisão é tomada olhando a peça, não uma amostra abstrata que
            ainda precisa ser imaginada aplicada.
          */}
          <div className="flex items-end pt-1.5">
            {cores.map((c, i) => {
              const ativo = rascunho.acento === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setRascunho({ ...rascunho, acento: c.id })}
                  aria-label={c.nome}
                  aria-pressed={ativo}
                  title={c.nome}
                  style={{ marginLeft: i === 0 ? 0 : '-0.6rem', zIndex: ativo ? 20 : cores.length - i }}
                  className={`relative shrink-0 overflow-hidden rounded-lg shadow-sm transition-all duration-150 hover:-translate-y-1 ${
                    ativo
                      ? 'w-20 -translate-y-1.5 ring-2 ring-slate-900 dark:ring-slate-100'
                      : 'w-7 ring-1 ring-black/10 dark:ring-white/10'
                  }`}
                >
                  <div className="aspect-[4/5]">
                    {/*
                      Só a carta da frente mostra o texto. Com todas escritas, a
                      sobreposição empilhava seis títulos no mesmo lugar e não dava para
                      ler nenhum — a de trás só precisa provar a cor.
                    */}
                    <Arte
                      mini
                      slide={{
                        ordem: 1,
                        titulo: ativo ? AMOSTRA_CURTA[rascunho.template] : '',
                        texto: '',
                        destaque: ativo ? AMOSTRA[rascunho.template].destaque : undefined,
                      }}
                      midia={{
                        tipo: rascunho.template === 'foto' ? 'upload' : 'template',
                        template: rascunho.template,
                        acento: c.id,
                      }}
                      indice={1}
                      usuario=""
                      registro=""
                      mostrarRegistro={false}
                    />
                  </div>
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
            {cores.find((c) => c.id === rascunho.acento)?.nome ?? rascunho.acento} ·{' '}
            {TEMPLATE_LABEL[rascunho.template]}
          </p>

          {/*
            Extração no navegador: a imagem vai para um canvas e os pixels são agrupados
            por cor. O arquivo não sai da máquina — nem precisa, já que o que interessa
            são cinco hexadecimais.
          */}
          <div className="mt-2.5 rounded-lg border border-dashed border-slate-200 p-2.5 dark:border-slate-700">
            <input
              ref={inputLogo}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={(e) => {
                void importarLogo(e.target.files?.[0])
                e.target.value = ''
              }}
            />
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-200">
                  <Palette className="h-3.5 w-3.5" /> Cores do seu logo
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                  {rascunho.paletaImportada.length > 0
                    ? `${rascunho.paletaImportada.length} cores extraídas — entram no leque acima`
                    : 'Envie o logo ou uma arte sua e eu tiro a paleta dela'}
                </p>
              </div>
              <button
                onClick={() => inputLogo.current?.click()}
                disabled={extraindo}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Upload className="h-3 w-3" /> {extraindo ? 'Lendo…' : 'Enviar logo'}
              </button>
            </div>

            {rascunho.paletaImportada.length > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                {rascunho.paletaImportada.map((hex) => (
                  <button
                    key={hex}
                    onClick={() => setRascunho({ ...rascunho, acento: hex })}
                    title={hex}
                    aria-label={hex}
                    style={{ backgroundColor: hex }}
                    className={`h-5 w-5 rounded ${
                      rascunho.acento === hex
                        ? 'ring-2 ring-slate-900 ring-offset-1 dark:ring-slate-100 dark:ring-offset-slate-900'
                        : 'ring-1 ring-black/10'
                    }`}
                  />
                ))}
                <button
                  onClick={() =>
                    setRascunho({ ...rascunho, paletaImportada: [], acento: 'teal' })
                  }
                  className="ml-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  limpar
                </button>
              </div>
            )}

            {erroPaleta && (
              <p className="mt-2 text-[11px] text-amber-600 dark:text-amber-400">{erroPaleta}</p>
            )}
          </div>
        </Campo>

        <Campo rotulo="Template padrão">
          <div className="grid grid-cols-3 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t}
                onClick={() => setRascunho({ ...rascunho, template: t })}
                title={TEMPLATE_DESCRICAO[t]}
                className={`overflow-hidden rounded-lg border text-left transition-colors ${
                  rascunho.template === t
                    ? 'border-teal-500 ring-1 ring-teal-500'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                }`}
              >
                <div className="aspect-[4/5]">
                  <Arte
                    mini
                    slide={{ ordem: 1, ...AMOSTRA[t] }}
                    midia={{
                      tipo: t === 'foto' ? 'upload' : 'template',
                      template: t,
                      acento: rascunho.acento,
                    }}
                    indice={1}
                    usuario=""
                    registro=""
                    mostrarRegistro={false}
                  />
                </div>
                <p className="truncate px-1.5 py-1 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                  {TEMPLATE_LABEL[t]}
                </p>
              </button>
            ))}
          </div>
        </Campo>

        <Campo rotulo="Tom">
          <div className="flex flex-wrap gap-1.5">
            {TONS.map((t) => (
              <Pilula
                key={t}
                ativo={rascunho.tom === t}
                onClick={() => setRascunho({ ...rascunho, tom: t })}
              >
                {t}
              </Pilula>
            ))}
          </div>
        </Campo>

        <Campo rotulo="Fecho fixo da legenda">
          <input
            value={rascunho.ctaFixo}
            onChange={(e) => setRascunho({ ...rascunho, ctaFixo: e.target.value })}
            placeholder="Vazio = sem CTA"
            className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </Campo>

        <div className="mt-3 flex items-start justify-between gap-3 border-t border-slate-100 pt-2.5 dark:border-slate-800">
          <div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
              Registro no rodapé do cartão
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
              {rascunho.autorPadrao.registro}. Os conselhos exigem identificar o responsável
              técnico na peça — desligar é decisão sua, e é você que responde por ela.
            </p>
          </div>
          <Toggle
            ativo={rascunho.mostrarRegistro}
            onToggle={() => setRascunho({ ...rascunho, mostrarRegistro: !rascunho.mostrarRegistro })}
            rotulo="Registro no cartão"
          />
        </div>

        <button
          onClick={() => onSalvarPadroes(rascunho)}
          disabled={!sujo}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
        >
          <Check className="h-3.5 w-3.5" /> Salvar padrões
        </button>
      </Bloco>

      {/* Aprovação */}
      <Bloco titulo="Aprovação" icone={ShieldCheck}>
        <Campo rotulo="Quem pode aprovar e agendar">
          <div className="space-y-1.5">
            {(Object.keys(APROVA_LABEL) as QuemAprova[]).map((q) => (
              <button
                key={q}
                onClick={() => onSalvarRegras({ ...regras, quemAprova: q })}
                className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs ${
                  regras.quemAprova === q
                    ? 'border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span
                  className={`h-3 w-3 shrink-0 rounded-full border ${
                    regras.quemAprova === q
                      ? 'border-teal-600 bg-teal-600'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                />
                {APROVA_LABEL[q]}
              </button>
            ))}
          </div>
        </Campo>

        <div className="mt-3 flex items-start justify-between gap-3 border-t border-slate-100 pt-2.5 dark:border-slate-800">
          <div>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
              Aviso exige ciência antes de agendar
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
              Vale só para <strong className="font-medium">aviso</strong>. Bloqueio nunca tem
              caminho de passar — nem com isto ligado.
            </p>
          </div>
          <Toggle
            ativo={regras.exigirCienciaDeAviso}
            onToggle={() =>
              onSalvarRegras({ ...regras, exigirCienciaDeAviso: !regras.exigirCienciaDeAviso })
            }
            rotulo="Exigir ciência de aviso"
          />
        </div>
      </Bloco>

      <SobreAClinica
        contexto={contexto}
        clinica={clinica}
        onSalvar={onSalvarContexto}
      />
    </div>
  )
}

/**
 * O contexto de negócio que entra em toda geração.
 *
 * É o que separa um post que poderia ser de qualquer clínica de um que só faz sentido
 * nesta. Não repete o cadastro: nome e especialidades aparecem em cinza, com a casa
 * onde se mudam — duplicar o campo aqui criaria a segunda versão da razão social.
 */
function SobreAClinica({
  contexto,
  clinica,
  onSalvar,
}: {
  contexto: ContextoNegocio
  clinica: { nome: string; especialidades: string[] }
  onSalvar: (c: ContextoNegocio) => void
}) {
  const [r, setR] = useState<ContextoNegocio>(contexto)
  const [termo, setTermo] = useState('')
  const sujo = JSON.stringify(r) !== JSON.stringify(contexto)

  /*
   * Público e descrição são obrigatórios porque são exatamente o que a IA não consegue
   * inventar: sem eles o post sai correto e genérico — serve para qualquer clínica do
   * país, que é a mesma coisa que não servir para nenhuma.
   */
  const faltando = [
    r.publico.trim().length < 10 ? 'público' : null,
    r.descricao.trim().length < 30 ? 'descrição' : null,
  ].filter(Boolean) as string[]
  const completo = faltando.length === 0

  const addTermo = () => {
    const t = termo.trim().toLowerCase()
    if (!t || r.evitar.includes(t)) {
      setTermo('')
      return
    }
    setR({ ...r, evitar: [...r.evitar, t] })
    setTermo('')
  }

  return (
    <Bloco titulo="Sobre a clínica" icone={Building2}>
      <p className="text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
        Entra em toda geração. Sem isso a IA escreve um post que serviria para qualquer
        clínica do país.
      </p>

      <div className="mt-2.5 rounded-lg bg-slate-50 px-2.5 py-2 dark:bg-slate-800/50">
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">{clinica.nome}</p>
        <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
          {clinica.especialidades.join(' · ')}
        </p>
        <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
          Vem do cadastro e da Equipe — mude lá, não aqui.
        </p>
      </div>

      <Campo rotulo="Objetivo do conteúdo">
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.keys(OBJETIVO_LABEL) as ObjetivoConteudo[]).map((o) => (
            <button
              key={o}
              onClick={() => setR({ ...r, objetivo: o })}
              title={OBJETIVO_LABEL[o].ajuda}
              className={`rounded-lg border px-2.5 py-2 text-left text-xs ${
                r.objetivo === o
                  ? 'border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-200'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {OBJETIVO_LABEL[o].titulo}
            </button>
          ))}
        </div>
        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
          {OBJETIVO_LABEL[r.objetivo].ajuda}
        </p>
      </Campo>

      <Campo rotulo="Público" obrigatorio>
        <textarea
          value={r.publico}
          onChange={(e) => setR({ ...r, publico: e.target.value })}
          rows={2}
          placeholder="Quem é o paciente típico?"
          className="w-full resize-y rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs leading-relaxed text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        />
      </Campo>

      <Campo rotulo="Descrição e diferencial" obrigatorio>
        <textarea
          value={r.descricao}
          onChange={(e) => setR({ ...r, descricao: e.target.value })}
          rows={4}
          maxLength={600}
          placeholder="O que a clínica é, e o que ela faz diferente"
          className="w-full resize-y rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs leading-relaxed text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        />
        <p className="mt-1 text-right text-[10px] tabular-nums text-slate-400 dark:text-slate-500">
          {r.descricao.length}/600
        </p>
      </Campo>

      <Campo rotulo="Palavras a evitar">
        <div className="flex flex-wrap gap-1.5">
          {r.evitar.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-amber-50 py-0.5 pl-2 pr-1 text-[11px] text-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
            >
              {t}
              <button
                onClick={() => setR({ ...r, evitar: r.evitar.filter((x) => x !== t) })}
                aria-label={`Remover ${t}`}
                className="rounded-full p-0.5 hover:bg-amber-200/60 dark:hover:bg-amber-900/60"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-1.5">
          <input
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTermo()
            }}
            placeholder="detox, milagre…"
            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
          <button
            onClick={addTermo}
            className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Adicionar
          </button>
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">
          Vira <strong className="font-medium">aviso</strong> na revisão, nunca bloqueio — é
          preferência da casa, não vedação de conselho.
        </p>
      </Campo>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => onSalvar(r)}
          disabled={!sujo || !completo}
          title={completo ? undefined : `Preencha ${faltando.join(' e ')}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600"
        >
          <Check className="h-3.5 w-3.5" /> Salvar contexto
        </button>
        {!completo && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400">
            Falta {faltando.join(' e ')}.
          </p>
        )}
      </div>
    </Bloco>
  )
}

function Bloco({
  titulo,
  icone: Icone,
  children,
}: {
  titulo: string
  icone: typeof Instagram
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-800">
      <header className="flex items-center gap-2 border-b border-slate-100 px-3.5 py-2.5 dark:border-slate-800">
        <Icone className="h-3.5 w-3.5 text-slate-400" />
        <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {titulo}
        </h2>
      </header>
      <div className="px-3.5 py-3">{children}</div>
    </section>
  )
}

function Campo({
  rotulo,
  obrigatorio = false,
  children,
}: {
  rotulo: string
  obrigatorio?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="mt-3">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {rotulo}
        {obrigatorio && (
          <span className="ml-1 text-amber-600 dark:text-amber-400" title="Obrigatório">
            *
          </span>
        )}
      </p>
      {children}
    </div>
  )
}

function Linha({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-slate-500 dark:text-slate-400">{rotulo}</dt>
      <dd className="text-right text-slate-700 dark:text-slate-200">{children}</dd>
    </div>
  )
}

function Pilula({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-[11px] ${
        ativo
          ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300'
          : 'border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
      }`}
    >
      {children}
    </button>
  )
}

function Toggle({
  ativo,
  onToggle,
  rotulo,
}: {
  ativo: boolean
  onToggle: () => void
  rotulo: string
}) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={ativo}
      aria-label={rotulo}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        ativo ? 'bg-teal-600' : 'bg-slate-200 dark:bg-slate-700'
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
          ativo ? 'left-[1.125rem]' : 'left-0.5'
        }`}
      />
    </button>
  )
}
