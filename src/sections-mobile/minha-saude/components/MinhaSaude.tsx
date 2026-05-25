import { useState } from 'react'
import type { MinhaSaudeAba, MinhaSaudeProps } from '@/../product-mobile/sections/minha-saude/types'
import { EstadoAtualTab } from './EstadoAtualTab'
import { AnalisesTab } from './AnalisesTab'
import { EvolucaoTab } from './EvolucaoTab'
import { CompararTab } from './CompararTab'
import { SnapshotDetail } from './SnapshotDetail'

const ABAS: { id: MinhaSaudeAba; label: string }[] = [
  { id: 'estado-atual', label: 'Estado' },
  { id: 'analises', label: 'Análises' },
  { id: 'evolucao', label: 'Evolução' },
  { id: 'comparar', label: 'Comparar' },
]

export function MinhaSaude(props: MinhaSaudeProps) {
  const [aba, setAba] = useState<MinhaSaudeAba>(props.abaInicial ?? 'estado-atual')
  const [snapshotAbertoId, setSnapshotAbertoId] = useState<string | null>(null)

  const snapshotAberto = snapshotAbertoId
    ? props.data.snapshots.find((s) => s.id === snapshotAbertoId) ?? null
    : null

  if (snapshotAberto) {
    return (
      <SnapshotDetail
        snapshot={snapshotAberto}
        projecaoMeta={props.data.projecao.meta}
        promptTexto={props.data.projecao.prompt?.promptTexto}
        modeloIA={props.data.projecao.prompt?.modelo ?? 'nano-banana'}
        disclaimerEducativo={props.data.projecao.prompt?.disclaimerEducativo}
        onBack={() => setSnapshotAbertoId(null)}
        onGerarProjecao={props.onGerarProjecao}
        onEditarMeta={props.onEditarMeta}
      />
    )
  }

  return (
    <div className="min-h-full bg-slate-950 pb-6">
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md border-b border-slate-900">
        <div className="px-4 pt-3 pb-2 grid grid-cols-4 gap-1">
          {ABAS.map((a) => {
            const active = aba === a.id
            return (
              <button
                key={a.id}
                onClick={() => setAba(a.id)}
                className={`h-9 rounded-xl text-[12px] font-semibold transition-colors ${
                  active
                    ? 'bg-slate-800 text-slate-50'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {a.label}
              </button>
            )
          })}
        </div>
      </div>

      {aba === 'estado-atual' && (
        <EstadoAtualTab
          data={props.data}
          onDimensaoClick={props.onDimensaoClick}
          onColetarDado={props.onColetarDado}
        />
      )}

      {aba === 'analises' && (
        <AnalisesTab
          data={props.data}
          onGerarAnalise={props.onGerarAnalise}
          onSnapshotClick={(id) => {
            setSnapshotAbertoId(id)
            props.onSnapshotClick?.(id)
          }}
          onColetarDado={props.onColetarDado}
        />
      )}
      {aba === 'evolucao' && (
        <EvolucaoTab
          data={props.data}
          onSnapshotClick={(id) => {
            setSnapshotAbertoId(id)
            props.onSnapshotClick?.(id)
          }}
        />
      )}
      {aba === 'comparar' && (
        <CompararTab
          data={props.data}
          onTrocarSnapshotInicial={props.onTrocarSnapshotInicial}
          onTrocarSnapshotFinal={props.onTrocarSnapshotFinal}
          onGerarProjecao={props.onGerarProjecao}
          onEditarMeta={props.onEditarMeta}
        />
      )}
    </div>
  )
}
