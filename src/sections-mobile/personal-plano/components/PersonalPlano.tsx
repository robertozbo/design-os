import { Check, Sparkles } from 'lucide-react'
import type { PersonalPlanoProps } from '@/../product-mobile/sections/personal-plano/types'
import { Card, CardHeader, Chip, PrimaryButton, Progress, Screen } from '../../_personal/components/kit'

export function PersonalPlano({ data, onEscolher, onGerenciar }: PersonalPlanoProps) {
  const atual = data.planos.find((p) => p.atual)

  return (
    <Screen>
      <Card className="!mt-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-mono text-slate-400">Plano atual</div>
            <div className="text-white text-[22px] font-semibold">{atual?.nome}</div>
          </div>
          <div className="text-right">
            <div className="text-slate-100 text-[14px] font-mono">{atual?.preco}</div>
            <div className="text-slate-500 text-[11.5px]">{data.renovacao}</div>
          </div>
        </div>
        <ul className="mt-4 space-y-3">
          {data.uso.map((u) => (
            <li key={u.label}>
              <div className="flex justify-between text-[12.5px] mb-1">
                <span className="text-slate-300">{u.label}</span>
                <span className="text-slate-400 font-mono">
                  {u.limite === null ? `${u.usado} · ilimitado` : u.limite === 0 ? 'só no Pro' : `${u.usado}/${u.limite}`}
                </span>
              </div>
              {u.limite ? <Progress value={(u.usado / u.limite) * 100} tone={u.usado / u.limite > 0.85 ? 'warning' : 'primary'} /> : null}
            </li>
          ))}
        </ul>
        <button onClick={onGerenciar} className="mt-4 text-emerald-300 text-[13px] font-medium">
          Gerenciar assinatura
        </button>
      </Card>

      {data.planos.map((p) => (
        <Card key={p.id} className={p.destaque ? '!border-emerald-500/60' : ''}>
          <CardHeader titulo={p.nome} />
          <div className="-mt-2 flex items-center justify-between">
            <span className="text-white text-[18px] font-mono font-semibold">{p.preco}</span>
            {p.atual && <Chip tone="primary">Seu plano</Chip>}
            {p.destaque && (
              <Chip tone="primary">
                <Sparkles size={11} /> IA
              </Chip>
            )}
          </div>
          <ul className="mt-3 space-y-1.5">
            {p.recursos.map((r) => (
              <li key={r} className="flex items-start gap-2 text-slate-300 text-[13px]">
                <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" /> {r}
              </li>
            ))}
          </ul>
          {p.destaque && !p.atual && (
            <div className="mt-4">
              <PrimaryButton onClick={() => onEscolher?.(p.id)}>Assinar {p.nome}</PrimaryButton>
            </div>
          )}
        </Card>
      ))}
    </Screen>
  )
}
