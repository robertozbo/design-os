import data from '@/../product/sections/plano-de-a-o-and-pgr/data.json'
import type {
  EmpregadorContexto,
  PlanoAcaoItem,
  PlanoVigente,
} from '@/../product/sections/plano-de-a-o-and-pgr/types'
import { ExportarPgrDrawer } from './components/ExportarPgrDrawer'

export default function ExportarPgrDrawerPreview() {
  const itens = data.itens as PlanoAcaoItem[]
  const totalEvidencias = itens.reduce((acc, i) => acc + i.evidencias.length, 0)

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

      <ExportarPgrDrawer
        open
        empregadorContexto={data.empregadorContexto as EmpregadorContexto}
        planoVigente={data.planoVigente as PlanoVigente}
        totalItens={itens.length}
        totalEvidencias={totalEvidencias}
        onClose={() => console.log('Fechar drawer')}
        onConfirmar={(input) => console.log('Exportar PGR:', input)}
      />
    </div>
  )
}
