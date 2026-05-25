import { useState } from 'react'
import {
  AlertTriangle,
  Check,
  Download,
  Globe,
  Languages,
  Moon,
  Sun,
  Trash2,
} from 'lucide-react'
import type {
  DadosConfig,
  Idioma,
  Tema,
} from '@/../product-personal/sections/configuracoes/types'
import { Panel } from './PerfilPanel'

interface DadosPanelProps {
  dados: DadosConfig
  onChangeIdioma?: (id: Idioma) => void
  onChangeTema?: (t: Tema) => void
  onExportar?: () => void
  onExcluirConta?: () => void
}

const IDIOMAS: { id: Idioma; label: string; flag: string }[] = [
  { id: 'pt-BR', label: 'Português (Brasil)', flag: '🇧🇷' },
  { id: 'en-US', label: 'English (US)', flag: '🇺🇸' },
  { id: 'es', label: 'Español', flag: '🇪🇸' },
]

const TEMAS: { id: Tema; label: string; icon: React.ElementType }[] = [
  { id: 'light', label: 'Claro', icon: Sun },
  { id: 'dark', label: 'Escuro', icon: Moon },
  { id: 'system', label: 'Sistema', icon: Globe },
]

export function DadosPanel({
  dados,
  onChangeIdioma,
  onChangeTema,
  onExportar,
  onExcluirConta,
}: DadosPanelProps) {
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)

  return (
    <div className="space-y-5">
      {/* Idioma */}
      <Panel title="Idioma" description="Idioma da interface do app">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {IDIOMAS.map((i) => {
            const active = dados.idioma === i.id
            return (
              <button
                key={i.id}
                type="button"
                onClick={() => onChangeIdioma?.(i.id)}
                className={`flex items-center gap-3 rounded-xl border p-3.5 text-left transition-colors ${
                  active
                    ? 'border-teal-300 bg-teal-50/30 ring-2 ring-teal-200 dark:border-teal-700 dark:bg-teal-900/20 dark:ring-teal-900'
                    : 'border-slate-200 bg-white hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700'
                }`}
              >
                <span className="text-2xl">{i.flag}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                    {i.label}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {i.id}
                  </p>
                </div>
                {active && (
                  <Check
                    size={14}
                    className="shrink-0 text-teal-600 dark:text-teal-400"
                  />
                )}
              </button>
            )
          })}
        </div>
      </Panel>

      {/* Tema */}
      <Panel
        title="Tema"
        description="Escolha entre claro, escuro ou seguir preferência do sistema"
      >
        <div className="grid grid-cols-3 gap-2">
          {TEMAS.map((t) => {
            const Icon = t.icon
            const active = dados.tema === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onChangeTema?.(t.id)}
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors ${
                  active
                    ? 'border-teal-300 bg-teal-50/30 ring-2 ring-teal-200 dark:border-teal-700 dark:bg-teal-900/20 dark:ring-teal-900'
                    : 'border-slate-200 bg-white hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700'
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active
                      ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <Icon size={16} />
                </span>
                <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
                  {t.label}
                </p>
              </button>
            )
          })}
        </div>
      </Panel>

      {/* LGPD - Exportar */}
      <Panel
        title="Seus dados (LGPD)"
        description="Conforme LGPD, você pode baixar uma cópia de todos os seus dados a qualquer momento"
      >
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/40 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
            <Download size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50">
              Exportar todos os dados
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              Inclui perfil, alunos, treinos, avaliações, mensagens e
              configurações em formato JSON e PDF. Pode levar alguns minutos
              dependendo do volume.
            </p>
          </div>
          <button
            type="button"
            onClick={onExportar}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            <Download size={13} />
            Exportar
          </button>
        </div>
      </Panel>

      {/* Idioma legenda */}
      <Panel title="Acessibilidade">
        <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
          <Languages
            size={14}
            className="mt-0.5 shrink-0 text-slate-500 dark:text-slate-400"
          />
          <p className="text-[12px] leading-relaxed text-slate-600 dark:text-slate-400">
            O Nymos suporta leitores de tela e navegação por teclado. Em
            breve: alto contraste e tamanho de fonte ajustável.
          </p>
        </div>
      </Panel>

      {/* Excluir conta — destrutivo */}
      <Panel title="Zona de perigo">
        <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/50 dark:bg-rose-900/10">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={16}
              className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-rose-900 dark:text-rose-200">
                Excluir conta permanentemente
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-rose-800 dark:text-rose-300">
                Esta ação é <strong>irreversível</strong>. Todos os seus dados
                serão deletados — perfil, alunos, treinos, avaliações,
                mensagens, histórico. Os alunos vinculados ao app perdem o
                vínculo automaticamente. Recomendamos exportar seus dados antes.
              </p>

              {!confirmandoExclusao ? (
                <button
                  type="button"
                  onClick={() => setConfirmandoExclusao(true)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300 dark:hover:bg-rose-900/40"
                >
                  <Trash2 size={13} />
                  Excluir minha conta
                </button>
              ) : (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmandoExclusao(false)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onExcluirConta?.()
                      setConfirmandoExclusao(false)
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                  >
                    <Trash2 size={13} />
                    Sim, quero excluir tudo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}
