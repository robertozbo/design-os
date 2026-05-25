import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import data from '@/../product-personal/sections/alunos/data.json'
import avaliacoesData from '@/../product-personal/sections/avaliacoes/data.json'
import treinosData from '@/../product-personal/sections/treinos/data.json'
import type {
  Aluno,
  AnotacaoPrivada,
  DetailTabId,
  MensagemAluno,
  ObjetivoFiltroId,
  SessaoExecutadaShowcase,
  SortId,
  TabId,
} from '@/../product-personal/sections/alunos/types'
import type {
  AlunoPicker,
  Avaliacao,
  DetailTabId as AvaliacaoDetailTabId,
} from '@/../product-personal/sections/avaliacoes/types'
import type { AlunoOption, Plano } from '@/../product-personal/sections/treinos/types'
import { AlunosList as AlunosListView } from './components/AlunosList'
import { AlunoFicha } from './components/AlunoFicha'
import { NovaAvaliacaoDrawer } from '../avaliacoes/components/NovaAvaliacaoDrawer'
import { AvaliacaoDetail } from '../avaliacoes/components/AvaliacaoDetail'
import { AplicarEmAlunoModal } from '../treinos/components/AplicarEmAlunoModal'

const alunosPicker = (avaliacoesData.alunosPicker as AlunoPicker[]) ?? []
const avaliacoesAll = (avaliacoesData.avaliacoes as Avaliacao[]) ?? []
const planosTreinos = treinosData.planos as Plano[]

function toAlunoOption(aluno: Aluno | undefined): AlunoOption | undefined {
  if (!aluno) return undefined
  return {
    id: aluno.id,
    nome: aluno.nome,
    avatarUrl: aluno.avatarUrl,
    hasPlanoAtivo: aluno.status === 'em-plano',
    planoAtivoNome: aluno.planoAtual?.nome,
    ultimaAtividade: aluno.ultimaSessaoData
      ? `Última sessão: ${new Date(aluno.ultimaSessaoData).toLocaleDateString('pt-BR')}`
      : 'Sem sessões registradas',
  }
}

const initialAlunos = enrichAlunosComMetricas(
  enrichAlunosComSessoes(data.alunos as Aluno[]),
)

/**
 * Gera 90 dias de métricas diárias para alunos vinculados ao app.
 * Padrões realistas baseados em hipertrofia (peso ↑, FC ↓ com adaptação, sono variável).
 * Pulamos randomicamente alguns dias pra simular falhas de sync (realista).
 */
function enrichAlunosComMetricas(alunos: Aluno[]) {
  return alunos.map((aluno) => {
    if (!aluno.vinculadoApp) return aluno
    const dias = 90
    const hoje = new Date()
    const metricasDiarias = []

    // Tendência base por aluno
    const isJoao = aluno.id === 'alu-001'
    const isMaria = aluno.id === 'alu-002'

    // Seed determinístico por aluno (não muda entre reloads)
    let seed = aluno.id
      .split('')
      .reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    for (let i = dias - 1; i >= 0; i--) {
      const d = new Date(hoje)
      d.setDate(d.getDate() - i)
      const iso = d.toISOString().slice(0, 10)
      const progresso = (dias - i) / dias // 0 (passado) → 1 (hoje)

      // Skip ~5% dos dias pra simular falha de sync (mais realista)
      if (random() < 0.05) continue

      // Peso — varia por aluno
      let peso: number | null = null
      if (isJoao) {
        // 78 → 81, oscilação ±0.4
        peso = 78 + progresso * 3 + (random() - 0.5) * 0.8
        peso = Math.round(peso * 10) / 10
      } else if (isMaria) {
        // 72 → 67, perda
        peso = 72 - progresso * 5 + (random() - 0.5) * 0.6
        peso = Math.round(peso * 10) / 10
      } else {
        peso = 70 + (random() - 0.5) * 1
        peso = Math.round(peso * 10) / 10
      }

      // FC repouso — leve melhora ao longo do tempo
      const fcBase = isJoao ? 62 : isMaria ? 70 : 65
      const fcRepouso = Math.round(fcBase - progresso * 4 + (random() - 0.5) * 6)

      // HRV (ms) — sobe com adaptação
      const hrvBase = isJoao ? 55 : 45
      const hrv = Math.round(hrvBase + progresso * 12 + (random() - 0.5) * 14)

      // Sono — 6.5-8.5h, oscila
      const sonoHoras =
        Math.round((6.5 + random() * 2 + (i % 7 === 5 || i % 7 === 6 ? 0.5 : 0)) * 10) / 10

      // Passos — 4000-12000
      const passos = Math.round(4000 + random() * 8000)

      // Energia (1-5)
      const energia =
        Math.round((3 + (random() - 0.3) * 1.5 + progresso * 0.5) * 10) / 10
      const energiaClamped = Math.min(5, Math.max(1, energia))

      metricasDiarias.push({
        data: iso,
        peso,
        fcRepouso,
        hrv,
        sonoHoras,
        passos,
        energia: Math.round(energiaClamped * 10) / 10,
      })
    }

    return { ...aluno, metricasDiarias }
  })
}

/**
 * Enriquecer cada aluno com sessoesExecutadas do plano atribuído correspondente.
 * Cruza alunos.planoAtual.id com treinos.planos[atribuídos].sessoesExecutadas.
 */
function enrichAlunosComSessoes(alunos: Aluno[]): Aluno[] {
  return alunos.map((aluno) => {
    if (!aluno.planoAtual) return aluno
    const plano = (treinosData.planos as Plano[]).find(
      (p) => p.id === aluno.planoAtual!.id,
    )
    if (!plano || !plano.sessoesExecutadas) return aluno
    // Mapeia SessaoExecutada (treinos) → SessaoExecutadaShowcase (alunos)
    const sessoes: SessaoExecutadaShowcase[] = plano.sessoesExecutadas.map(
      (s) => {
        // Pra cada exercício executado, casar com prescrição correspondente
        const treino = plano.treinos.find((t) => t.letra === s.treinoLetra)
        return {
          id: s.id,
          data: s.data,
          treinoLetra: s.treinoLetra,
          treinoNome: s.treinoNome,
          status: s.status,
          duracaoMinutos: s.duracaoMinutos,
          rpeMedio: s.rpeMedio,
          comentarioAluno: s.comentarioAluno,
          exercicios: s.exercicios.map((ex) => {
            const exPresc = treino?.exercicios.find(
              (e) => e.exercicioId === ex.exercicioId,
            )
            return {
              exercicioId: ex.exercicioId,
              exercicioNome: ex.exercicioNome,
              series: ex.series.map((sr) => {
                const sPresc = exPresc?.series.find(
                  (sp) => sp.numero === sr.numero,
                )
                return {
                  numero: sr.numero,
                  repsReal: sr.repsReal,
                  tempoRealSegundos: sr.tempoRealSegundos,
                  cargaRealKg: sr.cargaRealKg,
                  cargaPrescritaKg: sPresc?.cargaKg ?? null,
                  repsPrescrita: sPresc?.reps ?? null,
                  rpePrescrito: sPresc?.rpeAlvo ?? null,
                  rpePercebido: sr.rpePercebido,
                }
              }),
            }
          }),
        }
      },
    )
    return { ...aluno, sessoesExecutadas: sessoes }
  })
}

export default function AlunosListPreview() {
  const [alunos, setAlunos] = useState<Aluno[]>(initialAlunos)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState<TabId>(
    data.selected.tab as TabId,
  )
  const [selectedObjetivo, setSelectedObjetivo] = useState<ObjetivoFiltroId>(
    data.selected.objetivo as ObjetivoFiltroId,
  )
  const [selectedSort, setSelectedSort] = useState<SortId>(
    data.selected.sort as SortId,
  )
  const [openFichaId, setOpenFichaId] = useState<string | null>(null)
  const [detailTab, setDetailTab] = useState<DetailTabId>('visao-geral')
  const [novaAvaliacaoOpen, setNovaAvaliacaoOpen] = useState(false)
  const [novaAvaliacaoAlunoId, setNovaAvaliacaoAlunoId] = useState<string | undefined>()
  const [aplicarTemplateOpen, setAplicarTemplateOpen] = useState(false)
  const [aplicarTemplateAlunoId, setAplicarTemplateAlunoId] = useState<string | undefined>()
  const [editAvaliacaoId, setEditAvaliacaoId] = useState<string | null>(null)
  const [openAvaliacaoId, setOpenAvaliacaoId] = useState<string | null>(null)
  const [avaliacaoDetailTab, setAvaliacaoDetailTab] =
    useState<AvaliacaoDetailTabId>('antropometria')
  const [avaliacaoComparacaoId, setAvaliacaoComparacaoId] = useState<
    string | null
  >(null)

  // Deep-link da sidebar Histórico de avaliações
  const [searchParams, setSearchParams] = useSearchParams()
  useEffect(() => {
    const openAlunoParam = searchParams.get('openAluno')
    const tabParam = searchParams.get('tab')
    const openAvaliacaoParam = searchParams.get('openAvaliacao')
    if (openAlunoParam) {
      setOpenFichaId(openAlunoParam)
      if (tabParam === 'avaliacoes') {
        setDetailTab('avaliacoes')
      }
      if (openAvaliacaoParam) {
        setOpenAvaliacaoId(openAvaliacaoParam)
        setAvaliacaoDetailTab('antropometria')
      }
      // Limpa params depois de consumir
      setSearchParams({}, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fichaAluno = openFichaId
    ? alunos.find((a) => a.id === openFichaId) ?? null
    : null

  const detailAvaliacao = openAvaliacaoId
    ? avaliacoesAll.find((a) => a.id === openAvaliacaoId) ?? null
    : null

  // Render avaliação detail (rich view com 4 tabs) — vive dentro do contexto do aluno
  if (fichaAluno && detailAvaliacao) {
    const outras = avaliacoesAll.filter(
      (a) => a.alunoId === detailAvaliacao.alunoId && a.id !== detailAvaliacao.id,
    )
    return (
      <>
        <AvaliacaoDetail
          avaliacao={detailAvaliacao}
          outrasAvaliacoes={outras}
          selectedTab={avaliacaoDetailTab}
          comparacaoId={avaliacaoComparacaoId}
          onTabChange={setAvaliacaoDetailTab}
          onComparacaoChange={setAvaliacaoComparacaoId}
          onBack={() => {
            setOpenAvaliacaoId(null)
            setAvaliacaoDetailTab('antropometria')
            setAvaliacaoComparacaoId(null)
            setDetailTab('avaliacoes')
          }}
          onEdit={() => setEditAvaliacaoId(detailAvaliacao.id)}
          onDuplicate={() => console.log('duplicate', detailAvaliacao.id)}
          onCompare={() => {
            setAvaliacaoDetailTab('comparacao')
            const anterior = outras
              .filter((a) => a.data < detailAvaliacao.data)
              .sort((a, b) => b.data.localeCompare(a.data))[0]
            if (anterior) setAvaliacaoComparacaoId(anterior.id)
          }}
          onExportPdf={() => console.log('export pdf', detailAvaliacao.id)}
          onDelete={() => console.log('delete', detailAvaliacao.id)}
          onToggleNutriShare={() =>
            console.log('toggle nutri share', detailAvaliacao.id)
          }
        />
        <NovaAvaliacaoDrawer
          open={!!editAvaliacaoId}
          alunos={alunosPicker}
          editing={
            editAvaliacaoId
              ? avaliacoesAll.find((a) => a.id === editAvaliacaoId) ?? null
              : null
          }
          onClose={() => setEditAvaliacaoId(null)}
          onSave={(payload) => {
            console.log('editar avaliacao do detalhe:', payload)
            setEditAvaliacaoId(null)
          }}
        />
      </>
    )
  }

  if (fichaAluno) {
    return (
      <>
        <AlunoFicha
          aluno={fichaAluno}
          selectedTab={detailTab}
          onTabChange={setDetailTab}
          onBack={() => {
            setOpenFichaId(null)
            setDetailTab('visao-geral')
          }}
          onMessage={() => setDetailTab('mensagens')}
          onApplyTemplate={() => {
            setAplicarTemplateAlunoId(fichaAluno.id)
            setAplicarTemplateOpen(true)
          }}
          onNovaAvaliacao={() => {
            setNovaAvaliacaoAlunoId(fichaAluno.id)
            setNovaAvaliacaoOpen(true)
          }}
          onOpenAvaliacao={(id) => {
            setOpenAvaliacaoId(id)
            setAvaliacaoDetailTab('antropometria')
            setAvaliacaoComparacaoId(null)
          }}
          onEditAvaliacao={(id) => setEditAvaliacaoId(id)}
          onPausar={() => console.log('pausar')}
        onSendMessage={(texto) => {
          const novaMsg: MensagemAluno = {
            id: `m-${Date.now()}`,
            autor: 'personal',
            texto,
            timestamp: new Date().toISOString(),
            lida: true,
          }
          setAlunos((prev) =>
            prev.map((a) =>
              a.id === fichaAluno.id
                ? {
                    ...a,
                    mensagens: [...(a.mensagens ?? []), novaMsg],
                    mensagensNaoLidas: 0,
                  }
                : a,
            ),
          )
        }}
        onAddNotaPrivada={(texto) => {
          const novaNota: AnotacaoPrivada = {
            id: `ap-${Date.now()}`,
            texto,
            criadoEm: new Date().toISOString(),
          }
          setAlunos((prev) =>
            prev.map((a) =>
              a.id === fichaAluno.id
                ? {
                    ...a,
                    anotacoesPrivadas: [
                      ...(a.anotacoesPrivadas ?? []),
                      novaNota,
                    ],
                  }
                : a,
            ),
          )
        }}
        onRemoveNotaPrivada={(notaId) => {
          setAlunos((prev) =>
            prev.map((a) =>
              a.id === fichaAluno.id
                ? {
                    ...a,
                    anotacoesPrivadas: (a.anotacoesPrivadas ?? []).filter(
                      (n) => n.id !== notaId,
                    ),
                  }
                : a,
            ),
          )
        }}
      />
        <NovaAvaliacaoDrawer
          open={novaAvaliacaoOpen}
          alunos={alunosPicker}
          preSelectedAlunoId={novaAvaliacaoAlunoId}
          onClose={() => setNovaAvaliacaoOpen(false)}
          onSave={(payload) => {
            console.log('nova avaliacao do ficha:', payload)
            setNovaAvaliacaoOpen(false)
          }}
        />
        <NovaAvaliacaoDrawer
          open={!!editAvaliacaoId}
          alunos={alunosPicker}
          editing={
            editAvaliacaoId
              ? avaliacoesAll.find((a) => a.id === editAvaliacaoId) ?? null
              : null
          }
          onClose={() => setEditAvaliacaoId(null)}
          onSave={(payload) => {
            console.log('editar avaliacao da ficha:', payload)
            setEditAvaliacaoId(null)
          }}
        />
        <AplicarEmAlunoModal
          open={aplicarTemplateOpen}
          templates={planosTreinos}
          preSelectedAlunoId={aplicarTemplateAlunoId}
          alunoFixo={
            aplicarTemplateAlunoId
              ? toAlunoOption(alunos.find((a) => a.id === aplicarTemplateAlunoId))
              : undefined
          }
          onClose={() => setAplicarTemplateOpen(false)}
          onConfirm={(payload) => {
            console.log('aplicar template no aluno:', payload)
            setAplicarTemplateOpen(false)
          }}
        />
      </>
    )
  }

  return (
    <>
      <AlunosListView
      alunos={alunos}
      tabs={data.tabs as never}
      selectedTab={selectedTab}
      objetivos={data.objetivos as never}
      selectedObjetivo={selectedObjetivo}
      sortOptions={data.sortOptions as never}
      selectedSort={selectedSort}
      kpis={data.kpis}
      emptyStates={data.emptyStates}
      searchQuery={searchQuery}
      onTabChange={setSelectedTab}
      onSearchChange={setSearchQuery}
      onObjetivoChange={setSelectedObjetivo}
      onSortChange={setSelectedSort}
      onCreate={() => console.log('create aluno')}
      onOpenFicha={(id) => {
        setOpenFichaId(id)
        setDetailTab('visao-geral')
      }}
      onMessage={(id) => {
        setOpenFichaId(id)
        setDetailTab('mensagens')
      }}
      onApplyTemplate={(id) => console.log('apply template:', id)}
      onNovaAvaliacao={(id) => {
        setNovaAvaliacaoAlunoId(id)
        setNovaAvaliacaoOpen(true)
      }}
      onPausar={(id) => console.log('pausar:', id)}
      onDespausar={(id) => console.log('despausar:', id)}
      onArquivar={(id) => console.log('arquivar:', id)}
      onRestaurar={(id) => console.log('restaurar:', id)}
      onConvidarApp={(id) => console.log('convidar app:', id)}
      onClearFilters={() => {
        setSearchQuery('')
        setSelectedObjetivo('todos')
      }}
    />
    <NovaAvaliacaoDrawer
      open={novaAvaliacaoOpen}
      alunos={alunosPicker}
      preSelectedAlunoId={novaAvaliacaoAlunoId}
      onClose={() => setNovaAvaliacaoOpen(false)}
      onSave={(payload) => {
        console.log('nova avaliacao da lista:', payload)
        setNovaAvaliacaoOpen(false)
      }}
    />
    </>
  )
}
