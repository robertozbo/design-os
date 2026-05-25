import { useState } from 'react'
import data from '@/../product/sections/configura-es-nutri/data.json'
import type {
  ConfiguracoesNutriBundle,
  ConfiguracoesNutriOpcoes,
  ConfiguracoesNutriProps,
  PerfilContexto,
  PreferenciasLembretes,
  PreferenciasMedicoes,
  PredefinicoesPaciente,
  PreferenciasUnidades,
  SubPagina,
  SubPaginaId,
  IdiomaCodigo,
  Preferencias,
} from '@/../product/sections/configura-es-nutri/types'
import { ConfiguracoesNutriPage } from './components/ConfiguracoesNutriPage'

type DataShape = {
  perfilContexto: PerfilContexto
  subPaginas: SubPagina[]
  configuracoes: ConfiguracoesNutriBundle
  opcoes: ConfiguracoesNutriOpcoes
}

export default function ConfiguracoesNutriPagePreview() {
  const baseProps = data as unknown as DataShape

  // Live state for subPagina + key bundles that the user can interact with
  const [activeSubPagina, setActiveSubPagina] = useState<SubPaginaId>('perfil')
  const [predefinicoes, setPredefinicoes] = useState<PredefinicoesPaciente>(
    baseProps.configuracoes.predefinicoesPaciente,
  )
  const [medicoes, setMedicoes] = useState<PreferenciasMedicoes>(
    baseProps.configuracoes.preferenciasMedicoes,
  )
  const [preferencias, setPreferencias] = useState<Preferencias>(
    baseProps.configuracoes.preferencias,
  )
  const [perguntas, setPerguntas] = useState(baseProps.configuracoes.perguntas)
  const [googleCalendar, setGoogleCalendar] = useState(baseProps.configuracoes.googleCalendar)

  function togglePerguntaHabilitada(id: string, next: boolean) {
    setPerguntas((cat) => ({
      ...cat,
      itens: cat.itens.map((p) => (p.id === id ? { ...p, habilitada: next } : p)),
    }))
  }

  function setIdioma(idioma: IdiomaCodigo) {
    setPreferencias((p) => ({ ...p, idioma }))
  }
  function setUnidades(unidades: PreferenciasUnidades) {
    setPreferencias((p) => ({ ...p, unidades }))
  }
  function setLembretes(lembretes: PreferenciasLembretes) {
    setPreferencias((p) => ({ ...p, lembretes }))
  }

  const liveBundle: ConfiguracoesNutriBundle = {
    ...baseProps.configuracoes,
    predefinicoesPaciente: predefinicoes,
    preferenciasMedicoes: medicoes,
    preferencias,
    perguntas,
    googleCalendar,
  }

  const handlers: Partial<ConfiguracoesNutriProps> = {
    onSubPaginaChange: setActiveSubPagina,

    onSavePerfil: (perfil) => console.log('Save perfil', perfil),
    onUploadFoto: (file) => console.log('Upload foto', file),
    onRemoveFoto: () => console.log('Remove foto'),
    onUploadAssinatura: (file) => console.log('Upload assinatura', file),
    onRemoveAssinatura: () => console.log('Remove assinatura'),

    onSaveDisponibilidade: (d) => console.log('Save disponibilidade', d),
    onAddIntervalo: (dia, ini, fim) => console.log('Add intervalo', { dia, ini, fim }),
    onRemoveIntervalo: (dia, id) => console.log('Remove intervalo', { dia, id }),

    onConnectGoogleCalendar: () => {
      console.log('Connect Google Calendar')
      setGoogleCalendar((g) => ({ ...g, status: 'sincronizando' }))
    },
    onDisconnectGoogleCalendar: () => {
      console.log('Disconnect Google Calendar')
      setGoogleCalendar((g) => ({ ...g, status: 'desconectado' }))
    },
    onSyncNowGoogleCalendar: () => {
      console.log('Sync now Google Calendar')
      setGoogleCalendar((g) => ({ ...g, ultimaSincronizacaoIso: new Date().toISOString() }))
    },
    onReconnectGoogleCalendar: () => console.log('Reconnect Google Calendar'),
    onToggleBloquearHorariosOcupados: (next) =>
      setGoogleCalendar((g) => ({ ...g, bloquearHorariosOcupados: next })),

    onCreatePergunta: (p) => console.log('Create pergunta', p),
    onEditPergunta: (id) => console.log('Edit pergunta', id),
    onDeletePergunta: (id) => console.log('Delete pergunta', id),
    onTogglePerguntaHabilitada: togglePerguntaHabilitada,
    onReorderPergunta: (id, ord) => console.log('Reorder pergunta', { id, ord }),

    onChangePredefinicoes: setPredefinicoes,
    onChangePreferenciasMedicoes: setMedicoes,
    onChangeIdioma: setIdioma,
    onChangeUnidades: setUnidades,
    onChangeLembretes: setLembretes,
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-config-nutri],
        [data-nymos-config-nutri] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
        }
        [data-nymos-config-nutri] .font-mono,
        [data-nymos-config-nutri] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
      `}</style>

      <ConfiguracoesNutriPage
        perfilContexto={baseProps.perfilContexto}
        subPaginas={baseProps.subPaginas}
        opcoes={baseProps.opcoes}
        configuracoes={liveBundle}
        activeSubPagina={activeSubPagina}
        {...handlers}
      />
    </>
  )
}
