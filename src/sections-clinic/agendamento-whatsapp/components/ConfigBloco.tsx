import { useState } from 'react'
import { Lock, Save, SlidersHorizontal } from 'lucide-react'
import type { ConfigBot, ServicoExposto } from '@/../product-clinic/sections/agendamento-whatsapp/types'
import { resumoServico } from './helpers'

interface Props {
  config: ConfigBot
  servicos: ServicoExposto[]
  onSalvar: (config: ConfigBot) => void
  onAlternarServico: (servicoId: string) => void
}

export function ConfigBloco({ config, servicos, onSalvar, onAlternarServico }: Props) {
  const [rascunho, setRascunho] = useState<ConfigBot>(config)

  const set = <K extends keyof ConfigBot>(chave: K, valor: ConfigBot[K]) =>
    setRascunho((c) => ({ ...c, [chave]: valor }))

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
      <header className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
        <SlidersHorizontal className="h-4 w-4 text-slate-400" />
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Configuração do bot</h2>
      </header>

      <div className="space-y-4 bg-white px-4 py-4 dark:bg-slate-900">
        {/* Saudação */}
        <div>
          <Rotulo>Mensagem de saudação</Rotulo>
          <textarea
            value={rascunho.saudacao}
            onChange={(e) => set('saudacao', e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
          <p className="mt-1 text-right text-[11px] text-slate-400">{rascunho.saudacao.length}/1024</p>
        </div>

        {/* Janelas */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <Rotulo>Antecedência mínima</Rotulo>
            <Sufixo sufixo="horas">
              <input
                type="number"
                min={0}
                value={rascunho.antecedenciaMinHoras}
                onChange={(e) => set('antecedenciaMinHoras', Number(e.target.value))}
                className="w-full bg-transparent text-sm text-slate-700 outline-none dark:text-slate-200"
              />
            </Sufixo>
          </div>
          <div>
            <Rotulo>Janela máxima da agenda</Rotulo>
            <Sufixo sufixo="dias">
              <input
                type="number"
                min={1}
                value={rascunho.janelaMaxDias}
                onChange={(e) => set('janelaMaxDias', Number(e.target.value))}
                className="w-full bg-transparent text-sm text-slate-700 outline-none dark:text-slate-200"
              />
            </Sufixo>
          </div>
        </div>

        {/* Horário de atendimento */}
        <div>
          <Rotulo>Horário de atendimento do bot</Rotulo>
          <div className="flex items-center gap-2">
            <Hora
              valor={rascunho.horarioAtendimento.inicio}
              onChange={(v) => set('horarioAtendimento', { ...rascunho.horarioAtendimento, inicio: v })}
            />
            <span className="text-xs text-slate-400">até</span>
            <Hora
              valor={rascunho.horarioAtendimento.fim}
              onChange={(v) => set('horarioAtendimento', { ...rascunho.horarioAtendimento, fim: v })}
            />
          </div>
        </div>

        {/* Serviços expostos */}
        <div>
          <Rotulo>Serviços que o bot oferece</Rotulo>
          <ul className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            {servicos.map((s) => (
              <li
                key={s.id}
                className="flex items-center gap-3 border-b border-slate-100 px-3 py-2 last:border-0 dark:border-slate-800"
              >
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm ${s.exposto ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}
                  >
                    {s.nome}
                  </p>
                  <p className="text-[11px] text-slate-400">{resumoServico(s)}</p>
                </div>
                <Toggle ligado={s.exposto} onClick={() => onAlternarServico(s.id)} rotulo={`Expor ${s.nome}`} />
              </li>
            ))}
          </ul>
          <p className="mt-1 text-[11px] text-slate-400">
            Duração e preço vêm do cadastro de Serviços — aqui só se decide o que aparece no chat.
          </p>
        </div>

        {/* Travas */}
        <div className="space-y-2">
          <Travado
            ligado
            titulo="Cria como pendente"
            explicacao="A recepção valida sala, convênio e encaixe antes de firmar o horário."
          />
          <Travado
            ligado={false}
            titulo="Gerar cobrança"
            explicacao="Parcelas, convênio e desconto vivem na etapa Financeiro do wizard — não cabem em chat."
          />
        </div>

        <button
          onClick={() => onSalvar(rascunho)}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          <Save className="h-4 w-4" /> Salvar configuração
        </button>
      </div>
    </section>
  )
}

function Rotulo({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      {children}
    </label>
  )
}

function Sufixo({ sufixo, children }: { sufixo: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 dark:border-slate-700 dark:bg-slate-950">
      {children}
      <span className="shrink-0 text-xs text-slate-400">{sufixo}</span>
    </div>
  )
}

function Hora({ valor, onChange }: { valor: string; onChange: (v: string) => void }) {
  return (
    <input
      type="time"
      value={valor}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 [color-scheme:light] dark:[color-scheme:dark]"
    />
  )
}

function Toggle({ ligado, onClick, rotulo }: { ligado: boolean; onClick: () => void; rotulo: string }) {
  return (
    <button
      role="switch"
      aria-checked={ligado}
      aria-label={rotulo}
      onClick={onClick}
      className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
        ligado ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${ligado ? 'left-[1.125rem]' : 'left-0.5'}`}
      />
    </button>
  )
}

function Travado({ ligado, titulo, explicacao }: { ligado: boolean; titulo: string; explicacao: string }) {
  return (
    <div
      title={explicacao}
      className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/60"
    >
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Lock className="h-3.5 w-3.5 text-slate-400" /> {titulo}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{explicacao}</p>
      </div>
      <span
        aria-disabled
        className={`relative mt-0.5 h-5 w-9 shrink-0 cursor-not-allowed rounded-full opacity-50 ${
          ligado ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-700'
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white ${ligado ? 'left-[1.125rem]' : 'left-0.5'}`}
        />
      </span>
    </div>
  )
}
