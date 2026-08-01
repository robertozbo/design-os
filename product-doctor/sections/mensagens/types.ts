export type Canal = 'clinico' | 'admin'
export type Autor = 'paciente' | 'medico' | 'secretaria' | 'sistema'
export type StatusEnvio = 'enviada' | 'entregue'
export type StatusThread = 'ativa' | 'arquivada'

export interface Anexo {
  id: string
  tipo: 'imagem' | 'pdf'
  nome: string
  url: string
  tamanhoKb: number
}

export interface Mensagem {
  id: string
  autor: Autor
  conteudo: string
  enviadaEm: string // ISO
  status?: StatusEnvio // só pras nossas (médico/secretária)
  anexos?: Anexo[]
  /** Sistema: tipo de evento (exame, consulta, prescricao, etc.) */
  tipoSistema?: 'exame' | 'consulta' | 'prescricao' | 'cobranca' | 'outro'
}

export interface ThreadParticipantePaciente {
  id: string
  nome: string
  iniciais: string
  avatarUrl?: string | null
  idade?: number
  condicoesCronicas?: string[]
  statusApp?: 'vinculado' | 'convite-pendente' | 'nao-convidado'
}

export interface Thread {
  id: string
  paciente: ThreadParticipantePaciente
  canal: Canal
  status: StatusThread
  /** Última mensagem da thread (pra preview na lista). */
  ultimaMensagem: {
    autor: Autor
    conteudo: string
    enviadaEm: string
  }
  /** Quantidade de não-lidas pra mim (médico ou secretária). */
  naoLidas: number
  /** Atualizada quando última mensagem mudou — usado pra ordenação. */
  atualizadaEm: string
}

export interface ThreadAberta extends Thread {
  mensagens: Mensagem[]
}

export interface ContadoresCanais {
  clinico: number // não-lidas
  admin: number
  arquivadas: number
}

export interface MensagensProps {
  threads: Thread[]
  threadAtiva: ThreadAberta | null
  canalAtivo: Canal | 'arquivadas'
  /** Persona logada — controla se vê o canal clínico. */
  persona: 'medico' | 'secretaria'
  contadores: ContadoresCanais
  /** Troca o canal/tab ativo. */
  onTrocarCanal?: (canal: Canal | 'arquivadas') => void
  /** Abre uma thread (carrega mensagens). */
  onAbrirThread?: (threadId: string) => void
  /** Volta pra lista (mobile). */
  onFecharThread?: () => void
  /** Envia mensagem na thread ativa. */
  onEnviarMensagem?: (conteudo: string, anexos?: Anexo[]) => void
  /** Arquiva a thread ativa. */
  onArquivarThread?: (threadId: string) => void
  /** Reabre thread arquivada. */
  onDesarquivarThread?: (threadId: string) => void
  /** Navega pro detalhe do paciente. */
  onAbrirPaciente?: (pacienteId: string) => void
}
