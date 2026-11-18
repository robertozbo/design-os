export interface Mensagem {
  id: string
  autor: 'personal' | 'aluno'
  texto?: string
  hora: string
  anexo?: { tipo: 'video' | 'treino'; titulo: string; detalhe: string }
}

export interface PersonalConversaData {
  aluno: { nome: string; inicial: string; status: string }
  dia: string
  mensagens: Mensagem[]
  respostasRapidas: string[]
}

export interface PersonalConversaProps {
  data: PersonalConversaData
  onAbrirFicha?: () => void
  onEnviar?: (texto: string) => void
  onAnexar?: () => void
}
