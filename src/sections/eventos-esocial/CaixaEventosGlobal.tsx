import { useMemo, useState } from 'react'
import data from '@/../product/sections/eventos-esocial/data.json'
import type {
  AgregadoCarteira,
  Ambiente,
  EmpregadorCarteira,
  EventoEsocial,
} from '@/../product/sections/eventos-esocial/types'
import { CaixaEventosGlobal } from './components/CaixaEventosGlobal'

const EMPREGADORES: EmpregadorCarteira[] = [
  {
    id: 'emp-002',
    fantasia: 'Vegamax',
    razaoSocial: 'Vegamax Indústria de Alimentos S.A.',
    cnpj: '12.345.678/0001-90',
    cliente: 'Vegamax',
    ambienteCorrente: 'producao',
    certificadoOk: true,
  },
  {
    id: 'emp-003',
    fantasia: 'Horizonte Engenharia',
    razaoSocial: 'Construtora Horizonte Engenharia',
    cnpj: '34.567.890/0001-12',
    cliente: 'Horizonte',
    ambienteCorrente: 'producao',
    certificadoOk: true,
  },
  {
    id: 'emp-004',
    fantasia: 'Distribuidora RJ',
    razaoSocial: 'Vegamax Distribuidora RJ Ltda',
    cnpj: '12.345.678/0004-04',
    cliente: 'Vegamax',
    ambienteCorrente: 'producao',
    certificadoOk: true,
  },
  {
    id: 'emp-005',
    fantasia: 'Têxtil Aurora',
    razaoSocial: 'Aurora Indústria Têxtil',
    cnpj: '45.678.901/0001-23',
    cliente: 'Aurora',
    ambienteCorrente: 'producao',
    certificadoOk: false,
  },
  {
    id: 'emp-006',
    fantasia: 'Bel Pão',
    razaoSocial: 'Bel Pão Alimentos ME',
    cnpj: '78.901.234/0001-67',
    cliente: 'Bel Pão',
    ambienteCorrente: 'producao',
    certificadoOk: true,
  },
]

function enriquecerEventos(eventos: EventoEsocial[]): EventoEsocial[] {
  // Eventos existentes (Vegamax) + 5 eventos sintéticos de outros empregadores
  const vegamax = eventos.map((e) => ({
    ...e,
    empregadorId: 'emp-002',
    empregadorFantasia: 'Vegamax',
  }))

  const horaAgora = new Date('2026-05-25T09:30:00Z').toISOString()
  const horaCAT = new Date('2026-05-25T07:30:00Z').toISOString()
  const dayMs = 24 * 60 * 60 * 1000

  const extras: EventoEsocial[] = [
    {
      id: 'evt-2210-h001',
      tipo: 'S-2210',
      tipoLabel: 'CAT — Comunicação de Acidente de Trabalho',
      numeroSequencial: 1,
      ambiente: 'producao',
      status: 'em_transmissao',
      statusLabel: 'Em transmissão',
      empregadorId: 'emp-003',
      empregadorFantasia: 'Horizonte Engenharia',
      trabalhador: {
        id: 'trab-h-021',
        nome: 'Marcelo Vinicius Tavares',
        cpf: '***.412.876-**',
        setor: 'Obra Linha Verde 04',
        estabelecimento: 'Filial Curitiba',
      },
      dataFatoGerador: horaCAT,
      dataCriacao: horaCAT,
      ultimaAtualizacao: horaAgora,
      recibo: null,
      hashAuditoria: null,
      origem: 'manual',
      origemLabel: 'Manual',
      origemReferenciaId: null,
      motivoGatilho: 'cat_lancada',
      motivoGatilhoLabel: 'CAT lançada',
      criadoPor: 'Renato Holanda',
      retificacaoDe: null,
      retificadoPor: null,
      prazoLegal: new Date(new Date(horaCAT).getTime() + 1 * dayMs).toISOString(),
      atrasado: false,
      transmissoes: [],
      validacaoXsd: { valido: true, erros: [], avisos: [] },
      anexos: [],
    },
    {
      id: 'evt-2220-a001',
      tipo: 'S-2220',
      tipoLabel: 'ASO — Monitoramento da Saúde do Trabalhador',
      numeroSequencial: 14,
      ambiente: 'producao',
      status: 'rejeitado',
      statusLabel: 'Rejeitado',
      empregadorId: 'emp-005',
      empregadorFantasia: 'Têxtil Aurora',
      trabalhador: {
        id: 'trab-a-007',
        nome: 'Daniel Coutinho Vale',
        cpf: '***.812.453-**',
        setor: 'Tecelagem',
        estabelecimento: 'Matriz Blumenau',
      },
      dataFatoGerador: '2026-05-18T08:00:00Z',
      dataCriacao: '2026-05-22T11:00:00Z',
      ultimaAtualizacao: '2026-05-22T14:30:00Z',
      recibo: null,
      hashAuditoria: null,
      origem: 'sugerido_aso',
      origemLabel: 'Sugerido por ASO',
      origemReferenciaId: 'aso-a-388',
      motivoGatilho: 'novo_aso',
      motivoGatilhoLabel: 'Novo ASO registrado',
      criadoPor: 'Sistema (sugestão)',
      retificacaoDe: null,
      retificadoPor: null,
      prazoLegal: '2026-05-25T08:00:00Z',
      atrasado: true,
      transmissoes: [
        {
          timestamp: '2026-05-22T14:30:00Z',
          statusRetorno: 'rejeitado',
          codigoRetorno: 'MS3041',
          codigoErro: 'MS3041',
          descricaoErro: 'Fator de risco informado não consta no catálogo eSocial.',
          sugestaoCorrecao: 'Verifique o código do agente nocivo em tabela 23 do eSocial.',
          duracaoMs: 1820,
        },
      ],
      validacaoXsd: { valido: true, erros: [], avisos: [] },
      anexos: [],
    },
    {
      id: 'evt-2240-r001',
      tipo: 'S-2240',
      tipoLabel: 'Condições Ambientais — Exposição a Agentes Nocivos',
      numeroSequencial: 8,
      ambiente: 'producao',
      status: 'disponivel',
      statusLabel: 'Disponível para envio',
      empregadorId: 'emp-004',
      empregadorFantasia: 'Distribuidora RJ',
      trabalhador: {
        id: 'trab-r-018',
        nome: 'Vinícius Almeida Pessoa',
        cpf: '***.567.901-**',
        setor: 'Recebimento',
        estabelecimento: 'Centro Distribuição RJ',
      },
      dataFatoGerador: '2026-05-20T00:00:00Z',
      dataCriacao: '2026-05-24T16:00:00Z',
      ultimaAtualizacao: '2026-05-24T16:00:00Z',
      recibo: null,
      hashAuditoria: null,
      origem: 'sugerido_risco',
      origemLabel: 'Sugerido por Avaliação de Risco',
      origemReferenciaId: 'aval-rj-q2',
      motivoGatilho: 'atualizacao_riscos',
      motivoGatilhoLabel: 'Atualização de riscos',
      criadoPor: 'Sistema (sugestão)',
      retificacaoDe: null,
      retificadoPor: null,
      prazoLegal: new Date(
        new Date('2026-05-20T00:00:00Z').getTime() + 30 * dayMs,
      ).toISOString(),
      atrasado: false,
      transmissoes: [],
      validacaoXsd: { valido: true, erros: [], avisos: [] },
      anexos: [],
    },
    {
      id: 'evt-2245-b001',
      tipo: 'S-2245',
      tipoLabel: 'Treinamentos, Capacitações e Exercícios Simulados',
      numeroSequencial: 3,
      ambiente: 'producao',
      status: 'disponivel',
      statusLabel: 'Disponível para envio',
      empregadorId: 'emp-006',
      empregadorFantasia: 'Bel Pão',
      trabalhador: {
        id: 'trab-b-002',
        nome: 'Lúcia Helena Mendes',
        cpf: '***.987.124-**',
        setor: 'Produção',
        estabelecimento: 'Matriz São Paulo',
      },
      dataFatoGerador: '2026-05-21T08:00:00Z',
      dataCriacao: '2026-05-23T17:00:00Z',
      ultimaAtualizacao: '2026-05-23T17:00:00Z',
      recibo: null,
      hashAuditoria: null,
      origem: 'manual',
      origemLabel: 'Manual',
      origemReferenciaId: null,
      motivoGatilho: 'treinamento_concluido',
      motivoGatilhoLabel: 'Treinamento concluído',
      criadoPor: 'Renato Holanda',
      retificacaoDe: null,
      retificadoPor: null,
      prazoLegal: new Date(
        new Date('2026-05-21T08:00:00Z').getTime() + 30 * dayMs,
      ).toISOString(),
      atrasado: false,
      transmissoes: [],
      validacaoXsd: { valido: true, erros: [], avisos: [] },
      anexos: [],
    },
    {
      id: 'evt-2220-h002',
      tipo: 'S-2220',
      tipoLabel: 'ASO — Monitoramento da Saúde do Trabalhador',
      numeroSequencial: 22,
      ambiente: 'producao',
      status: 'aceito',
      statusLabel: 'Aceito',
      empregadorId: 'emp-003',
      empregadorFantasia: 'Horizonte Engenharia',
      trabalhador: {
        id: 'trab-h-011',
        nome: 'Camila Ribeiro Salles',
        cpf: '***.345.678-**',
        setor: 'Administrativo',
        estabelecimento: 'Matriz Curitiba',
      },
      dataFatoGerador: '2026-05-23T09:00:00Z',
      dataCriacao: '2026-05-23T11:00:00Z',
      ultimaAtualizacao: '2026-05-23T11:30:00Z',
      recibo: '1.2.202605.00000016234',
      hashAuditoria: 'b9f4e2c1a8d3b5e7c9f2a1d4b8e5c2a9',
      origem: 'sugerido_aso',
      origemLabel: 'Sugerido por ASO',
      origemReferenciaId: 'aso-h-122',
      motivoGatilho: 'novo_aso',
      motivoGatilhoLabel: 'Novo ASO registrado',
      criadoPor: 'Sistema (sugestão)',
      retificacaoDe: null,
      retificadoPor: null,
      loteId: 'lot-h-091',
      prazoLegal: '2026-05-30T09:00:00Z',
      atrasado: false,
      transmissoes: [
        {
          timestamp: '2026-05-23T11:30:00Z',
          statusRetorno: 'sucesso',
          codigoRetorno: '201',
          duracaoMs: 1520,
        },
      ],
      validacaoXsd: { valido: true, erros: [], avisos: [] },
      anexos: [],
    },
  ]

  return [...vegamax, ...extras]
}

export default function CaixaEventosGlobalPreview() {
  const [ambiente, setAmbiente] = useState<Ambiente>('producao')
  const [eventos, setEventos] = useState<EventoEsocial[]>(() =>
    enriquecerEventos(data.eventos as EventoEsocial[]),
  )
  const [selecionados, setSelecionados] = useState<string[]>([])

  const agregado = useMemo<AgregadoCarteira>(() => {
    const ambEventos = eventos.filter((e) => e.ambiente === ambiente)
    const mes = new Date('2026-05-01T00:00:00Z').toISOString()
    return {
      pendentes: ambEventos.filter(
        (e) => e.status === 'disponivel' || e.status === 'rejeitado',
      ).length,
      emTransmissao: ambEventos.filter((e) => e.status === 'em_transmissao').length,
      emLote: ambEventos.filter((e) => e.status === 'em_lote').length,
      ignorados: ambEventos.filter((e) => e.status === 'ignorado').length,
      aceitosMes: ambEventos.filter(
        (e) => e.status === 'aceito' && e.ultimaAtualizacao >= mes,
      ).length,
      rejeitadosMes: ambEventos.filter(
        (e) => e.status === 'rejeitado' && e.ultimaAtualizacao >= mes,
      ).length,
      slaRisk: ambEventos.filter((e) => e.atrasado).length,
      certificadosBloqueando: EMPREGADORES.filter((e) => !e.certificadoOk).length,
      empregadoresAtivos: EMPREGADORES.length,
    }
  }, [eventos, ambiente])

  return (
    <CaixaEventosGlobal
      empregadores={EMPREGADORES}
      agregado={agregado}
      eventos={eventos}
      ambienteAtivo={ambiente}
      selecionados={selecionados}
      onAmbienteChange={setAmbiente}
      onAbrirEvento={(empId, evtId) =>
        console.log('Abrir evento dentro do empregador:', empId, evtId)
      }
      onAbrirEmpregador={(empId) => console.log('Abrir empregador:', empId)}
      onSelecionarEvento={(id, sel) =>
        setSelecionados((prev) => (sel ? [...prev, id] : prev.filter((x) => x !== id)))
      }
      onSelecionarTodos={(sel) =>
        setSelecionados(sel ? eventos.map((e) => e.id) : [])
      }
      onIgnorarSelecionados={(ids) => {
        setEventos((prev) =>
          prev.map((e) =>
            ids.includes(e.id)
              ? { ...e, status: 'ignorado', statusLabel: 'Ignorado' }
              : e,
          ),
        )
        setSelecionados([])
      }}
      onReprocessarSelecionados={(ids) => console.log('Reprocessar:', ids)}
      onQuickView={(id) => console.log('Quick view:', id)}
      onIrParaNovoEvento={() => console.log('Ir pra lista de empregadores')}
    />
  )
}
