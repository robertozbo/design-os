import type {
  Antecedencia,
  FormaLink,
  Tema,
  VisaoAgenda,
} from '@/../product-medical-clinic/sections/configuracoes-recepcao/types'

export const VISAO_OPCOES: { value: VisaoAgenda; label: string }[] = [
  { value: 'medico', label: 'Por médico' },
  { value: 'sala', label: 'Por sala' },
]

export const TEMA_OPCOES: { value: Tema; label: string }[] = [
  { value: 'claro', label: 'Claro' },
  { value: 'escuro', label: 'Escuro' },
  { value: 'sistema', label: 'Sistema' },
]

export const FORMA_OPCOES: { value: FormaLink; label: string }[] = [
  { value: 'pix', label: 'PIX' },
  { value: 'cartao', label: 'Cartão' },
]

export const ANTECEDENCIA_OPCOES: { value: Antecedencia; label: string }[] = [
  { value: '24h', label: '24 horas antes' },
  { value: '3h', label: '3 horas antes' },
  { value: '1h', label: '1 hora antes' },
]
