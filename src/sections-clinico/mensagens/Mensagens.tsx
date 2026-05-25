import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import data from '@/../product-clinico/sections/mensagens/data.json'
import type {
  Canal,
  ContadoresCanais,
  Mensagem,
  Thread,
  ThreadAberta,
} from '@/../product-clinico/sections/mensagens/types'
import { MensagensInbox } from './components/MensagensInbox'

type CanalAtivo = Canal | 'arquivadas'

export default function MensagensPreview() {
  const navigate = useNavigate()
  const persona = (data.persona as 'medico' | 'secretaria') ?? 'medico'
  const [canalAtivo, setCanalAtivo] = useState<CanalAtivo>(
    (data.canalAtivo as CanalAtivo) ?? 'clinico',
  )
  const [threads, setThreads] = useState<Thread[]>(data.threads as Thread[])
  const [threadAtiva, setThreadAtiva] = useState<ThreadAberta | null>(
    data.threadAtiva as ThreadAberta,
  )

  const contadores: ContadoresCanais = useMemo(() => {
    const clin = threads
      .filter((t) => t.canal === 'clinico' && t.status === 'ativa')
      .reduce((s, t) => s + t.naoLidas, 0)
    const adm = threads
      .filter((t) => t.canal === 'admin' && t.status === 'ativa')
      .reduce((s, t) => s + t.naoLidas, 0)
    const arq = threads.filter((t) => t.status === 'arquivada').length + (data.contadores?.arquivadas ?? 0)
    return { clinico: clin, admin: adm, arquivadas: arq }
  }, [threads])

  const abrirThread = (threadId: string) => {
    const t = threads.find((x) => x.id === threadId)
    if (!t) return
    // Reseta naoLidas otimisticamente
    setThreads((prev) =>
      prev.map((x) => (x.id === threadId ? { ...x, naoLidas: 0 } : x)),
    )
    // Se for a thread já carregada com mensagens, usa ela; senão monta básica
    const base: ThreadAberta =
      threadAtiva?.id === threadId
        ? { ...threadAtiva, naoLidas: 0 }
        : {
            ...t,
            naoLidas: 0,
            mensagens: (data.threadAtiva?.id === threadId
              ? (data.threadAtiva.mensagens as Mensagem[])
              : []) as Mensagem[],
          }
    setThreadAtiva(base)
  }

  const enviarMensagem = (conteudo: string) => {
    if (!threadAtiva) return
    const nova: Mensagem = {
      id: `msg-${Date.now()}`,
      autor: persona,
      conteudo,
      enviadaEm: new Date().toISOString(),
      status: 'enviada',
    }
    const proxima: ThreadAberta = {
      ...threadAtiva,
      mensagens: [...threadAtiva.mensagens, nova],
      ultimaMensagem: { autor: persona, conteudo, enviadaEm: nova.enviadaEm },
      atualizadaEm: nova.enviadaEm,
    }
    setThreadAtiva(proxima)
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadAtiva.id
          ? {
              ...t,
              ultimaMensagem: proxima.ultimaMensagem,
              atualizadaEm: proxima.atualizadaEm,
            }
          : t,
      ),
    )
    // Simula "entregue" 800ms depois
    setTimeout(() => {
      setThreadAtiva((cur) =>
        cur && cur.id === proxima.id
          ? {
              ...cur,
              mensagens: cur.mensagens.map((m) =>
                m.id === nova.id ? { ...m, status: 'entregue' as const } : m,
              ),
            }
          : cur,
      )
    }, 800)
  }

  const arquivarThread = (threadId: string) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, status: 'arquivada' as const } : t)),
    )
    setThreadAtiva(null)
  }

  return (
    <MensagensInbox
      threads={threads}
      threadAtiva={threadAtiva}
      canalAtivo={canalAtivo}
      persona={persona}
      contadores={contadores}
      onTrocarCanal={(c) => {
        setCanalAtivo(c)
        setThreadAtiva(null)
      }}
      onAbrirThread={abrirThread}
      onFecharThread={() => setThreadAtiva(null)}
      onEnviarMensagem={enviarMensagem}
      onArquivarThread={arquivarThread}
      onAbrirPaciente={(pacienteId) => {
        console.log('abrir paciente:', pacienteId)
        navigate('/clinico/sections/pacientes')
      }}
    />
  )
}
