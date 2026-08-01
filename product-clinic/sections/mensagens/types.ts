export type CorEspecialidade = 'teal' | 'rose' | 'violet' | 'slate' | 'sky' | 'amber'
export type Canal = 'clinico' | 'admin'
export type Autor = 'paciente' | 'profissional'

export interface Mensagem {
  id: string
  autor: Autor
  texto: string
  hora: string
  /** Rótulo do dia para agrupar (ex.: "Hoje", "Ontem", "18 jul"). */
  dia: string
}

export interface Thread {
  id: string
  canal: Canal
  paciente: {
    nome: string
    iniciais: string
    idade: number
    condicoesCronicas: string[]
  }
  /** Nome do profissional do lado da clínica (médico do vínculo ou recepção). */
  profissional: string
  especialidade: string
  cor: CorEspecialidade
  naoLidas: number
  ultimaEm: string
  mensagens: Mensagem[]
}

export interface MensagensData {
  clinica: string
  medicoLogado: string
  /** Canal acessível na visão atual (médico = clinico). */
  canalPadrao: Canal
  threads: Thread[]
}
