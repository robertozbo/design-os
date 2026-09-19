import data from '@/../product-mobile/sections/glp1/data.json'
import type { Glp1Data } from '@/../product-mobile/sections/glp1/types'
import { Glp1 as Glp1Component } from './components/Glp1'

const HOJE = '2026-09-16'

/**
 * Semana 1: o wizard acabou de rodar e o paciente registrou a primeira
 * aplicação. Existe uma pesagem só — o gráfico traça o ritmo necessário até
 * a meta em vez de esperar a segunda pesagem pra aparecer.
 */
export default function Glp1PrimeiraDosePreview() {
  const base = data as unknown as Glp1Data
  const pesoInicial = 96.4

  const baseData = {
    ...base,
    configuracao: {
      ...base.configuracao!,
      dose: '2,5 mg',
      iniciadoEm: HOJE,
      perfil: {
        ...base.configuracao!.perfil,
        pesoInicialKg: pesoInicial,
        pesoAtualKg: pesoInicial,
        pesoAtualizadoEm: HOJE,
      },
    },
    stats: {
      pesoAtualKg: pesoInicial,
      pesoInicialKg: pesoInicial,
      perdidoKg: 0,
      perdidoPct: 0,
      imc: 30.4,
      imcClassificacao: 'Obesidade grau I',
      faltaKg: 18.4,
      diasRestantes: 95,
      ritmoSemanalKg: 0,
      ritmoNecessarioKg: 1.36,
      projecao: 'atrasado' as const,
      dosesAplicadas: 1,
      dosesEsperadas: 1,
      adesaoPct: 100,
      semanasTratamento: 1,
      proximaDose: {
        data: '2026-09-23',
        label: 'Quarta, 23/09 · 20:00',
        emDias: 7,
        atrasada: false,
      },
    },
    aplicacoes: [
      {
        id: 'ap-1',
        aplicadaEm: `${HOJE}T20:00:00-03:00`,
        haLabel: 'agora',
        medicamentoNome: 'Mounjaro®',
        dose: '2,5 mg',
        sitio: 'abdome_sup_dir' as const,
        dor: 3,
        sintomas: [],
        observacao: 'Primeira aplicação. Caneta em temperatura ambiente.',
        pesoNoDiaKg: pesoInicial,
      },
    ],
    evolucaoPeso: [
      { data: HOJE, pesoKg: pesoInicial, projetado: false, aplicacao: true },
    ],
    sitiosRecentes: ['abdome_sup_dir' as const],
    sitioSaturado: null,
  } satisfies Glp1Data

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        [data-nymos-mobile],
        [data-nymos-mobile] * {
          font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        [data-nymos-mobile] .font-mono,
        [data-nymos-mobile] .tabular-nums {
          font-family: 'IBM Plex Mono', ui-monospace, monospace;
        }
        [data-nymos-mobile] .no-scrollbar::-webkit-scrollbar { display: none; }
        [data-nymos-mobile] .no-scrollbar { scrollbar-width: none; }
      `}</style>
      <div data-nymos-mobile="true">
        <Glp1Component
          data={baseData}
          onSalvarConfiguracao={(p) => console.log('Configuração GLP-1:', p)}
          onSalvarAplicacao={(p) => console.log('Nova aplicação:', p)}
        />
      </div>
    </>
  )
}
