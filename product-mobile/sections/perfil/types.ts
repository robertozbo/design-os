// Types for Perfil (Mobile)
//
// Dados pessoais do paciente — críticos pra benchmarks de saúde (idade+sexo) e
// cálculos antropométricos (altura+peso → IMC).

import type { User } from '../../api-types'

export type SexoBiologico = 'masculino' | 'feminino' | 'intersexo' | 'nao_informar'

export interface ContatoEmergencia {
  nome: string
  relacao: string
  telefone: string
}

export interface PerfilData {
  user: User
  /** Nome de exibição */
  nomeCompleto: string
  /** ISO date "YYYY-MM-DD" */
  dataNascimento: string | null
  idade: number | null
  sexo: SexoBiologico | null
  /** Altura em cm */
  alturaCm: number | null
  /** Peso atual em kg (última medição) */
  pesoAtualKg: number | null
  /** ISO date da última pesagem */
  pesoMedidoEm: string | null
  /** Avatar inicial fallback */
  avatarInicial: string
  /** Foto URL */
  fotoUrl: string | null
  /** Total de profissionais ativos (resumo — lista completa fica em /profissionais) */
  profissionaisVinculados: number
  /** Convites pendentes (recebidos a aceitar) */
  convitesPendentes: number
  /** Contato de emergência (opcional) */
  contatoEmergencia: ContatoEmergencia | null
}

export interface PerfilProps {
  data: PerfilData
  onEditarFoto?: () => void
  onEditarNome?: () => void
  onEditarNascimento?: () => void
  onEditarSexo?: (sexo: SexoBiologico) => void
  onEditarAltura?: () => void
  onAtualizarPeso?: () => void
  /** Abrir section dedicada /profissionais */
  onProfissionaisClick?: () => void
  onEditarEmergencia?: () => void
  onAlterarSenha?: () => void
  onExcluirConta?: () => void
}
