import { useState } from 'react'
import data from '@/../product-clinic/sections/publicacoes/data.json'
import type {
  BriefValues,
  ContaConectada,
  PautaSemanal,
  Publicacao,
  PublicacoesData,
  QuotaAddon,
  FiltroPublicacao,
} from '@/../product-clinic/sections/publicacoes/types'
import { AgendarModal, BriefModal, PublicacoesView, validarLegenda } from './components'

interface Toast {
  id: number
  texto: string
}
let toastSeq = 0
let pubSeq = 0

const AUTOR_PADRAO = {
  nome: 'Marina Coelho',
  conselho: 'CRN' as const,
  registro: 'CRN-3 12345',
}

/** Quem está logado neste preview — é quem aprova. */
const APROVADOR = 'Roberto Dias'

export default function PublicacoesPreview() {
  const base = data as unknown as PublicacoesData

  const [publicacoes, setPublicacoes] = useState<Publicacao[]>(base.publicacoes)
  const [conta, setConta] = useState<ContaConectada>(base.conta)
  const [quota, setQuota] = useState<QuotaAddon>(base.quota)
  const [pauta, setPauta] = useState<PautaSemanal>(base.pauta)
  const [filtro, setFiltro] = useState<FiltroPublicacao>('tudo')
  const [selecionadaId, setSelecionadaId] = useState<string | null>(base.publicacoes[0]?.id ?? null)
  const [drawerAberto, setDrawerAberto] = useState(false)
  const [modal, setModal] = useState<'voz' | 'manual' | null>(null)
  const [agendando, setAgendando] = useState<Publicacao | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])

  const selecionada = publicacoes.find((p) => p.id === selecionadaId) ?? null

  const pushToast = (texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3600)
  }

  const patch = (id: string, campos: Partial<Publicacao>) =>
    setPublicacoes((prev) => prev.map((p) => (p.id === id ? { ...p, ...campos } : p)))

  /** Gerar e refazer gastam cota. É o que torna o contador do header honesto. */
  const gastarCota = () =>
    setQuota((q) => ({ ...q, postsUsados: Math.min(q.postsUsados + 1, q.postsIncluidos) }))

  const gerar = (brief: BriefValues) => {
    const id = `novo-${++pubSeq}`
    const nova: Publicacao = {
      id,
      tema: brief.tema,
      formato: brief.formato,
      status: 'gerando',
      origem: brief.origem,
      autor: AUTOR_PADRAO,
      legenda: '',
      hashtags: [],
      slides: [],
      midia: { tipo: 'template', template: 'Dica clínica', acento: 'teal' },
      briefOriginal: brief.briefOriginal,
      versoes: 0,
      agendadoPara: brief.agendadoPara ? `${brief.agendadoPara}:00-03:00` : null,
      publicadoEm: null,
      permalink: null,
      criadoEm: new Date().toISOString(),
      aprovadoPor: null,
      alertas: [],
      falha: null,
    }
    setPublicacoes((prev) => [nova, ...prev])
    setSelecionadaId(id)
    setModal(null)
    gastarCota()

    // A geração é assíncrona no produto (chamada de IA), então o preview também
    // passa por `gerando` — é o estado em que a fila fica e que a tela precisa
    // saber desenhar.
    setTimeout(() => {
      const legenda = redigir(brief.tema, brief.tom)
      patch(id, {
        status: 'revisar',
        versoes: 1,
        legenda,
        hashtags: hashtagsDe(brief.tema),
        slides: slidesDe(brief.tema, brief.formato),
        alertas: validarLegenda(legenda, AUTOR_PADRAO.conselho),
      })
      pushToast('Post gerado — falta você revisar')
    }, 1400)
  }

  const refazer = (id: string, instrucao: string) => {
    const atual = publicacoes.find((p) => p.id === id)
    if (!atual) return
    patch(id, { status: 'gerando' })
    gastarCota()
    setTimeout(() => {
      const legenda = reescrever(atual.legenda, atual.tema, instrucao)
      patch(id, {
        status: 'revisar',
        versoes: atual.versoes + 1,
        legenda,
        aprovadoPor: null,
        agendadoPara: atual.status === 'agendado' ? null : atual.agendadoPara,
        alertas: validarLegenda(legenda, atual.autor.conselho),
      })
      pushToast(`Reescrito · versão ${atual.versoes + 1}`)
    }, 1100)
  }

  const editarLegenda = (id: string, legenda: string) => {
    const atual = publicacoes.find((p) => p.id === id)
    if (!atual) return
    const alertas = validarLegenda(legenda, atual.autor.conselho)
    patch(id, {
      legenda,
      alertas,
      // Texto editado volta para revisão e perde a aprovação: aprovar o texto de
      // ontem e publicar o de hoje é exatamente o buraco que isto fecha.
      status: 'revisar',
      aprovadoPor: null,
      agendadoPara: null,
    })
    const bloqueios = alertas.filter((a) => a.severidade === 'bloqueio').length
    pushToast(
      bloqueios > 0
        ? `Texto salvo · ${bloqueios} bloqueio${bloqueios === 1 ? '' : 's'} de publicidade`
        : 'Texto salvo · volta para Revisar',
    )
  }

  const agendar = (id: string, quando: string) => {
    patch(id, { status: 'agendado', agendadoPara: quando, aprovadoPor: APROVADOR, falha: null })
    setAgendando(null)
    pushToast('Agendado')
  }

  const publicarAgora = (p: Publicacao) => {
    patch(p.id, { status: 'publicando', aprovadoPor: APROVADOR })
    setTimeout(() => {
      patch(p.id, {
        status: 'publicado',
        publicadoEm: new Date().toISOString(),
        permalink: `https://www.instagram.com/p/${p.id.replace(/\W/g, '')}Demo/`,
        falha: null,
      })
      setConta((c) => ({ ...c, publicadosHoje: c.publicadosHoje + 1 }))
      pushToast('Publicado no Instagram')
    }, 1600)
  }

  const excluir = (p: Publicacao) => {
    setPublicacoes((prev) => prev.filter((x) => x.id !== p.id))
    if (selecionadaId === p.id) {
      setSelecionadaId(null)
      setDrawerAberto(false)
    }
    pushToast(`“${p.tema}” excluído`)
  }

  const tentarNovamente = (p: Publicacao) => {
    patch(p.id, { status: 'publicando' })
    setTimeout(() => {
      patch(p.id, {
        status: 'publicado',
        publicadoEm: new Date().toISOString(),
        permalink: `https://www.instagram.com/p/${p.id.replace(/\W/g, '')}Retry/`,
        falha: null,
      })
      setConta((c) => ({ ...c, publicadosHoje: c.publicadosHoje + 1 }))
      pushToast('Publicado na segunda tentativa')
    }, 1500)
  }

  /**
   * Reconectar não é só renovar o token: os posts que falharam por `token_expirado`
   * voltam para a fila. Sem isso a pessoa reconecta, vê "conta ok" e descobre dias
   * depois que o post de novembro nunca saiu.
   */
  const reconectar = () => {
    setConta((c) => ({ ...c, conectada: true, tokenExpiraEm: '2026-11-16T00:00:00-03:00' }))
    const presos = publicacoes.filter((p) => p.falha?.codigo === 'token_expirado')
    setPublicacoes((prev) =>
      prev.map((p) =>
        p.falha?.codigo === 'token_expirado' ? { ...p, status: 'agendado', falha: null } : p,
      ),
    )
    pushToast(
      presos.length > 0
        ? `Conta reconectada · ${presos.length} post${presos.length === 1 ? '' : 's'} de volta na fila`
        : 'Conta reconectada · autorização válida por 60 dias',
    )
  }

  return (
    <>
      <PublicacoesView
        conta={conta}
        quota={quota}
        pauta={pauta}
        publicacoes={publicacoes}
        filtro={filtro}
        selecionada={selecionada}
        drawerAberto={drawerAberto}
        onFiltro={setFiltro}
        onSelecionar={(p) => {
          setSelecionadaId(p.id)
          setDrawerAberto(true)
        }}
        onFecharDrawer={() => setDrawerAberto(false)}
        onDitar={() => setModal('voz')}
        onNovo={() => setModal('manual')}
        onAlternarPauta={(ativa) => {
          setPauta((p) => ({ ...p, ativa }))
          pushToast(ativa ? 'Pauta semanal ligada' : 'Pauta semanal desligada')
        }}
        onRefazer={refazer}
        onEditarLegenda={editarLegenda}
        onAbrirAgendar={setAgendando}
        onPublicarAgora={publicarAgora}
        onExcluir={excluir}
        onTentarNovamente={tentarNovamente}
        onReconectarConta={reconectar}
      />

      {modal && <BriefModal modo={modal} onGerar={gerar} onFechar={() => setModal(null)} />}

      {agendando && (
        <AgendarModal
          publicacao={agendando}
          conta={conta}
          onAgendar={agendar}
          onFechar={() => setAgendando(null)}
        />
      )}

      <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm text-white shadow-lg dark:bg-slate-100 dark:text-slate-900"
          >
            {t.texto}
          </div>
        ))}
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ *
 * O "modelo" do preview. Texto canônico o suficiente para a tela ser
 * julgada; a geração real é uma chamada com saída estruturada.
 * ------------------------------------------------------------------ */

function redigir(tema: string, tom: string): string {
  const abertura =
    tom === 'acolhedor'
      ? 'Cuidar da saúde não começa num diagnóstico — começa no prato de todos os dias.'
      : tom === 'direto'
        ? 'Três coisas que mudam o seu dia e não dependem de remédio.'
        : tom === 'técnico'
          ? 'A evidência é consistente: hábito alimentar é fator modificável de risco.'
          : 'Uma conversa curta sobre o que a alimentação faz pelo seu corpo.'
  return `${abertura}\n\n${tema} — e é disso que a nossa equipe trata na consulta: do que cabe na sua rotina, não do plano perfeito que ninguém segue.\n\nQuer conversar sobre o seu caso? A agenda está aberta.`
}

function reescrever(legenda: string, tema: string, instrucao: string): string {
  const i = instrucao.toLowerCase()
  if (i.includes('curto')) {
    return `${tema}.\n\nÉ disso que a consulta trata: do que cabe na sua rotina. Agenda aberta.`
  }
  if (i.includes('emoji')) return legenda.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
  if (i.includes('convite')) {
    return `${legenda}\n\nAgende sua avaliação pelo link da bio.`
  }
  if (i.includes('formal')) {
    return legenda.replace(/^\S.*?\n/, 'Vamos falar de comida de verdade.\n')
  }
  return `${tema}.\n\nA nossa equipe trata do que cabe na sua rotina — sem plano impossível e sem promessa. Agenda aberta para avaliação.`
}

function hashtagsDe(tema: string): string[] {
  const base = ['#clinicavidaplena', '#saude']
  const t = tema.toLowerCase()
  if (t.includes('nutri') || t.includes('aliment')) base.push('#nutricao', '#alimentacaosaudavel')
  if (t.includes('sono')) base.push('#sono')
  if (t.includes('exame')) base.push('#prevencao', '#checkup')
  if (t.includes('idade')) base.push('#qualidadedevida')
  return base
}

function slidesDe(tema: string, formato: string) {
  const titulo = tema.length > 42 ? `${tema.slice(0, 42).trimEnd()}…` : tema
  if (formato !== 'carrossel') {
    return [{ ordem: 1, titulo, texto: 'O que cabe na sua rotina, não o plano perfeito.' }]
  }
  return [
    { ordem: 1, titulo, texto: 'Desliza para o lado' },
    { ordem: 2, titulo: '1. Comece pela refeição que já existe', texto: 'Ajustar é mais fácil que criar.' },
    { ordem: 3, titulo: '2. Proteína em toda refeição', texto: 'É o que sustenta a saciedade.' },
    { ordem: 4, titulo: '3. Regularidade ganha de perfeição', texto: 'Cinco dias bons valem mais que um mês perfeito.' },
    { ordem: 5, titulo: 'Conversa, não dieta', texto: 'Agende uma avaliação com a nossa equipe.' },
  ]
}
