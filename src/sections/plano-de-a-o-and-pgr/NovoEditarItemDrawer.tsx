import data from '@/../product/sections/plano-de-a-o-and-pgr/data.json'
import type {
  PlanoAcaoItem,
  ResponsavelDisponivel,
  SetorAfetado,
} from '@/../product/sections/plano-de-a-o-and-pgr/types'
import { NovoEditarItemDrawer } from './components/NovoEditarItemDrawer'

const ACOES_SUGERIDAS = [
  'Redistribuir cargas operacionais',
  'Treinamento de gestão de tempo',
  'Reuniões 1:1 semanais',
  'Política formal de horas extras',
  'Pesquisa de clima follow-up em 60d',
]

export default function NovoEditarItemDrawerPreview() {
  // Modo "Edição" pra mostrar pré-preenchido
  const itens = data.itens as PlanoAcaoItem[]
  const itemEmEdicao = itens.find((i) => i.origem.tipo === 'matriz') ?? itens[0]

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      {/* Background simulando a tela do Plano por trás */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="mx-auto max-w-[1280px] px-10 py-8">
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded" />
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <NovoEditarItemDrawer
        open
        itemEmEdicao={itemEmEdicao}
        setoresAfetados={data.setoresAfetados as SetorAfetado[]}
        responsaveisDisponiveis={data.responsaveisDisponiveis as ResponsavelDisponivel[]}
        acoesSugeridas={ACOES_SUGERIDAS}
        onClose={() => console.log('Fechar drawer')}
        onSave={(input) => console.log('Salvar item:', input)}
      />
    </div>
  )
}
