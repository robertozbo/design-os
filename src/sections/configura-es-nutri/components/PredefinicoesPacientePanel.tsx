import { Smartphone, MessageSquare, NotebookPen, Sigma, Info } from 'lucide-react'
import type { PredefinicoesPaciente } from '@/../product/sections/configura-es-nutri/types'
import { Card, PanelHeader, ToggleRow } from './_shared'

interface PredefinicoesPacientePanelProps {
  predefinicoes: PredefinicoesPaciente
  onChange?: (next: PredefinicoesPaciente) => void
}

export function PredefinicoesPacientePanel({
  predefinicoes,
  onChange,
}: PredefinicoesPacientePanelProps) {
  function set<K extends keyof PredefinicoesPaciente>(key: K, val: PredefinicoesPaciente[K]) {
    onChange?.({ ...predefinicoes, [key]: val })
  }

  return (
    <div>
      <PanelHeader
        eyebrow="Predefinições de Pacientes"
        title="Permissões padrão para novos pacientes"
        description="Configure os defaults que serão aplicados quando você cadastrar um novo paciente. Você sempre pode ajustar individualmente depois."
      />

      <Card title="Permissões padrão" description="Ativadas no momento do cadastro de cada novo paciente.">
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          <ToggleRow
            icon={<Smartphone size={14} strokeWidth={1.75} />}
            label="Acesso ao app"
            description="Paciente recebe convite por código e usa o app Nymos para enxergar seu plano alimentar."
            checked={predefinicoes.acessoApp}
            onChange={(v) => set('acessoApp', v)}
          />
          <ToggleRow
            icon={<MessageSquare size={14} strokeWidth={1.75} />}
            label="Mensagens"
            description="Paciente pode enviar mensagens diretas ao nutri pelo app, e vice-versa."
            checked={predefinicoes.mensagens}
            onChange={(v) => set('mensagens', v)}
          />
          <ToggleRow
            icon={<NotebookPen size={14} strokeWidth={1.75} />}
            label="Diário alimentar"
            description="Você visualiza o diário alimentar (foto + IA ou manual) registrado pelo paciente no app."
            checked={predefinicoes.diarioAlimentar}
            onChange={(v) => set('diarioAlimentar', v)}
          />
          <ToggleRow
            icon={<Sigma size={14} strokeWidth={1.75} />}
            label="Info nutricional"
            description="Paciente vê valores de macros e kcal nos planos. Algumas abordagens preferem esconder os números."
            checked={predefinicoes.infoNutricional}
            onChange={(v) => set('infoNutricional', v)}
          />
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-900/40">
          <Info className="mt-0.5 shrink-0 text-slate-500 dark:text-slate-400" size={14} />
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Você sempre pode ajustar essas permissões individualmente em cada paciente, na aba <strong className="text-slate-700 dark:text-slate-300">Perfil</strong> da página do paciente.
          </p>
        </div>
      </Card>
    </div>
  )
}
