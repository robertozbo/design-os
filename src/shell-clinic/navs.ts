/**
 * Navegação por persona — fonte única.
 *
 * O RBAC do V1 é fixo e não é cosmético: admin e recepção não podem ver conteúdo clínico, e o
 * médico não administra o workspace nem o financeiro da clínica. A navegação é a primeira
 * materialização disso, então ela mora aqui e é consumida tanto pelo preview do shell quanto pela
 * página de section — quando as duas tinham listas próprias, a do preview de section acabou
 * mostrando Faturamento e Contas a pagar para o médico.
 */
import {
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  Building2,
  Calendar,
  ClipboardList,
  CreditCard,
  DoorOpen,
  FlaskConical,
  Home,
  MessageSquare,
  Pill,
  Settings as SettingsIcon,
  Stethoscope,
  Tag,
  Tags,
  Truck,
  Users,
} from 'lucide-react'
import type { NavGroup } from './components'

export type Persona = 'medico' | 'admin' | 'recepcao'

const s = (id: string) => `/clinic/sections/${id}`

/** Médico: centrado no paciente. Prontuário/Exames/Prescrição/Consulta ficam nested em Pacientes. */
export const NAV_MEDICO: NavGroup[] = [
  {
    label: 'Atendimento',
    items: [
      { label: 'Início', href: s('inicio'), icon: Home },
      { label: 'Agenda', href: s('agenda'), icon: Calendar },
      { label: 'Pacientes', href: s('pacientes'), icon: Users },
    ],
  },
  {
    label: 'Clínico',
    items: [
      { label: 'Atendimentos', href: s('atendimentos'), icon: ClipboardList },
      { label: 'Exames', href: s('exames'), icon: FlaskConical },
      { label: 'Prescrições', href: s('prescricao'), icon: Pill },
    ],
  },
  {
    label: 'Operacional',
    items: [
      { label: 'Mensagens', href: s('mensagens'), icon: MessageSquare },
      { label: 'Configurações', href: s('configuracoes-medico'), icon: SettingsIcon },
    ],
  },
]

/** Admin/gestor: gestão do workspace e o dinheiro. Sem acesso ao conteúdo clínico dos pacientes. */
export const NAV_ADMIN: NavGroup[] = [
  {
    label: 'Gestão',
    items: [
      { label: 'Visão geral', href: s('inicio-gestao'), icon: Building2 },
      { label: 'Equipe', href: s('equipe'), icon: Stethoscope },
      { label: 'Salas & recursos', href: s('salas'), icon: DoorOpen },
    ],
  },
  {
    label: 'Financeiro',
    items: [
      { label: 'Faturamento', href: s('faturamento'), icon: CreditCard },
      { label: 'Relatórios', href: s('relatorios'), icon: BarChart3 },
      { label: 'Contas a receber', href: s('contas-receber'), icon: ArrowUpCircle },
      { label: 'Contas a pagar', href: s('contas-pagar'), icon: ArrowDownCircle },
    ],
  },
  {
    label: 'Cadastros',
    items: [
      { label: 'Serviços', href: s('servicos'), icon: Tag },
      { label: 'Fornecedores', href: s('fornecedores'), icon: Truck },
      { label: 'Tipos de conta', href: s('categorias-financeiras'), icon: Tags },
    ],
  },
  {
    label: 'Operacional',
    items: [
      { label: 'Agenda', href: s('agenda'), icon: Calendar },
      { label: 'Configurações', href: s('configuracoes-clinica'), icon: SettingsIcon },
    ],
  },
]

/** Recepção: operacional puro. Agenda multi-médico, cadastro admin, cobrança. Zero clínico. */
export const NAV_RECEPCAO: NavGroup[] = [
  {
    label: 'Principal',
    items: [
      { label: 'Agenda', href: s('agenda'), icon: Calendar },
      { label: 'Pacientes', href: s('pacientes'), icon: Users },
      { label: 'Mensagens', href: s('mensagens'), icon: MessageSquare },
      { label: 'Cobrança', href: s('cobranca'), icon: CreditCard },
      { label: 'Configurações', href: s('configuracoes-recepcao'), icon: SettingsIcon },
    ],
  },
]

/** Quem está logado em cada persona — o rodapé do shell mostra este usuário. */
export const USER_POR_PERSONA: Record<Persona, { name: string; role: string }> = {
  medico: { name: 'Dra. Helena Prado', role: 'Endocrinologista · CRM 456789-SP' },
  admin: { name: 'Roberto Dias', role: 'Gestor da clínica' },
  recepcao: { name: 'Carla Souza', role: 'Recepção' },
}

export const NAV_POR_PERSONA: Record<Persona, NavGroup[]> = {
  medico: NAV_MEDICO,
  admin: NAV_ADMIN,
  recepcao: NAV_RECEPCAO,
}

/**
 * De quem é cada section. Define sob qual navegação ela é exibida no preview — e, na
 * implementação, quem tem permissão de abrir a rota.
 *
 * Agenda e Pacientes aparecem para mais de uma persona; ficam com a de menor privilégio que as usa
 * como tela principal, porque é o recorte mais restritivo que a tela precisa suportar.
 */
export const PERSONA_DA_SECTION: Record<string, Persona> = {
  // Médico — clínico
  inicio: 'medico',
  consulta: 'medico',
  prontuario: 'medico',
  acompanhamento: 'medico',
  atendimentos: 'medico',
  exames: 'medico',
  prescricao: 'medico',
  encaminhamento: 'medico',
  perfil: 'medico',
  'configuracoes-medico': 'medico',
  // Pacientes tem duas telas: `PacientesLista` (médico — condições crônicas, equipe de cuidado) e
  // `PacientesAdmin` (recepção — só nome, contato, convênio, financeiro). A section fica com a
  // persona da tela principal; o recorte da recepção é declarado em PERSONA_DO_DESIGN abaixo.
  pacientes: 'medico',
  // Admin — gestão e dinheiro
  'inicio-gestao': 'admin',
  equipe: 'admin',
  salas: 'admin',
  faturamento: 'admin',
  relatorios: 'admin',
  'contas-receber': 'admin',
  'contas-pagar': 'admin',
  servicos: 'admin',
  fornecedores: 'admin',
  'categorias-financeiras': 'admin',
  'configuracoes-clinica': 'admin',
  // Recepção — balcão
  agenda: 'recepcao',
  mensagens: 'recepcao',
  cobranca: 'recepcao',
  'configuracoes-recepcao': 'recepcao',
}

/**
 * Screen designs que pertencem a outra persona que não a da section.
 * Chave: `<sectionId>:<ComponentName>`. Hoje só Pacientes tem duas visões da mesma tela.
 */
export const PERSONA_DO_DESIGN: Record<string, Persona> = {
  'pacientes:PacientesAdmin': 'recepcao',
}

/** Sections clínicas nested dentro de Pacientes — o nav destaca "Pacientes". */
export const NESTED_UNDER_PACIENTES = new Set(['consulta', 'prontuario', 'acompanhamento'])
