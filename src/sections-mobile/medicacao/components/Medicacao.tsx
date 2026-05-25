import { useMemo, useState } from 'react'
import type {
  MedicacaoAtiva,
  MedicacaoProps,
  RegistroReceita,
} from '@/../product-mobile/sections/medicacao/types'
import { HistoricoReceitas } from './HistoricoReceitas'
import { MedicacaoAtivaCard } from './MedicacaoAtivaCard'
import { MedicacaoDetalhe } from './MedicacaoDetalhe'
import { MedicacaoHojeCard } from './MedicacaoHojeCard'
import { MedicacaoOralCard } from './MedicacaoOralCard'
import { MedicacaoSemanaCard } from './MedicacaoSemanaCard'
import { ReceitaDetalheDrawer } from './ReceitaDetalheDrawer'
import { ReceitaRenovadaBanner } from './ReceitaRenovadaBanner'
import { RegistrarInjecao } from './RegistrarInjecao'
import { RegistrarSintomas } from './RegistrarSintomas'
import { Toasts, type ToastData } from './Toast'

let toastSeq = 0

function isGlp1Injetavel(m: MedicacaoAtiva): boolean {
  return m.categoria === 'glp1_injetavel' || m.via === 'subcutanea'
}

function isGlp1Oral(m: MedicacaoAtiva): boolean {
  return m.categoria === 'glp1_oral'
}

function exigeJejum(m: MedicacaoAtiva): boolean {
  return m.farmaco === 'semaglutide_oral' || /jejum/i.test(m.posologia)
}

/**
 * Filtra histórico de receitas relacionado a uma medicação específica —
 * compara nome (case-insensitive) com o título do registro.
 */
function receitasDaMedicacao(
  receitas: RegistroReceita[],
  med: MedicacaoAtiva,
): RegistroReceita[] {
  const alvo = med.nome.toLowerCase()
  return receitas.filter((r) => r.titulo.toLowerCase().includes(alvo))
}

export function Medicacao({
  data,
  onMarcarDose,
  onAbrirReceitaMemed,
  onAbrirDetalheReceita,
  onVerHistoricoCompleto,
  onFalarComMedico,
  onDispensarRenovada,
  onAplicarDose,
  onMarcarComprimido,
  onRegistrarSintomas,
}: MedicacaoProps) {
  const {
    medicosVinculados,
    resumoHoje,
    medicacoesAtivas,
    historicoReceitas,
    receitaRenovada,
    curvasPK = [],
    injecoes = [],
    sintomas = [],
  } = data

  const medicosMap = useMemo(() => {
    const m: Record<string, (typeof medicosVinculados)[number]> = {}
    medicosVinculados.forEach((med) => (m[med.id] = med))
    return m
  }, [medicosVinculados])

  const medicoPrincipal = medicosVinculados[0] ?? null
  const multiMedico = medicosVinculados.length > 1

  const [receitaAberta, setReceitaAberta] = useState<RegistroReceita | null>(null)
  const [bannerVisivel, setBannerVisivel] = useState(!!receitaRenovada)
  const [toasts, setToasts] = useState<ToastData[]>([])

  const [injecaoAberta, setInjecaoAberta] = useState<MedicacaoAtiva | null>(null)
  const [sintomasAbertos, setSintomasAbertos] = useState<{
    contexto: string | null
  } | null>(null)
  const [medDetalhe, setMedDetalhe] = useState<MedicacaoAtiva | null>(null)

  const receitasMap = useMemo(() => {
    const map: Record<string, RegistroReceita> = {}
    historicoReceitas.forEach((r) => (map[r.id] = r))
    return map
  }, [historicoReceitas])

  const glp1Injetaveis = useMemo(
    () => medicacoesAtivas.filter(isGlp1Injetavel),
    [medicacoesAtivas],
  )
  const glp1Orais = useMemo(
    () => medicacoesAtivas.filter(isGlp1Oral),
    [medicacoesAtivas],
  )
  const outrasAtivas = useMemo(
    () => medicacoesAtivas.filter((m) => !isGlp1Injetavel(m) && !isGlp1Oral(m)),
    [medicacoesAtivas],
  )

  const curvaDoDetalhe = useMemo(() => {
    if (!medDetalhe) return null
    return curvasPK.find((c) => c.medicacaoId === medDetalhe.id) ?? null
  }, [curvasPK, medDetalhe])

  const sintomasDoDetalhe = useMemo(() => {
    if (!medDetalhe) return []
    const injsDestaMed = new Set(
      injecoes.filter((i) => i.medicacaoId === medDetalhe.id).map((i) => i.id),
    )
    return sintomas.filter(
      (s) => !s.injecaoId || injsDestaMed.has(s.injecaoId),
    )
  }, [sintomas, injecoes, medDetalhe])

  const receitasDoDetalhe = useMemo(() => {
    if (!medDetalhe) return []
    return receitasDaMedicacao(historicoReceitas, medDetalhe)
  }, [historicoReceitas, medDetalhe])

  const pushToast = (tone: ToastData['tone'], texto: string) => {
    const id = ++toastSeq
    setToasts((prev) => [...prev, { id, tone, texto }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  const handleMarcarDose = (doseId: string) => {
    onMarcarDose?.(doseId)
    const dose = resumoHoje?.doses.find((d) => d.id === doseId)
    if (dose) {
      const agora = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
      pushToast('success', `${dose.nome} marcada · ${agora}`)
    }
  }

  const handleAbrirDetalheReceita = (id: string) => {
    const r = receitasMap[id]
    if (r) setReceitaAberta(r)
    onAbrirDetalheReceita?.(id)
  }

  const handleAbrirMemed = (medicacaoId: string) => {
    pushToast('info', 'Abrindo receita no Memed…')
    onAbrirReceitaMemed?.(medicacaoId)
  }

  const handleFalarComMedico = (medicacaoId: string, nome: string) => {
    pushToast('info', `Falar sobre ${nome}`)
    onFalarComMedico?.({ medicacaoId, nome })
  }

  const handleAbrirDetalheMed = (medicacaoId: string) => {
    const med = medicacoesAtivas.find((m) => m.id === medicacaoId)
    if (med) setMedDetalhe(med)
  }

  const handleAplicarDose = (medicacaoId: string) => {
    const med = medicacoesAtivas.find((m) => m.id === medicacaoId)
    if (med) setInjecaoAberta(med)
    setMedDetalhe(null)
    onAplicarDose?.(medicacaoId)
  }

  const handleConfirmarInjecao = () => {
    if (!injecaoAberta) return
    const nome = injecaoAberta.nome
    setInjecaoAberta(null)
    pushToast('success', `${nome} aplicado · registrado`)
    setTimeout(() => {
      pushToast('info', `Como você está se sentindo após ${nome}?`)
    }, 1500)
  }

  const handleMarcarComprimido = (medicacaoId: string) => {
    const med = medicacoesAtivas.find((m) => m.id === medicacaoId)
    pushToast('success', med ? `${med.nome} marcado · siga firme` : 'Marcado')
    onMarcarComprimido?.(medicacaoId)
  }

  const handleAbrirSintomas = (contexto?: string | null) => {
    setSintomasAbertos({ contexto: contexto ?? null })
    onRegistrarSintomas?.()
  }

  const handleAbrirSintomasDoDetalhe = (medicacaoId: string) => {
    const med = medicacoesAtivas.find((m) => m.id === medicacaoId)
    handleAbrirSintomas(med?.nome)
  }

  const handleSalvarSintomas = () => {
    setSintomasAbertos(null)
    pushToast('success', 'Sintomas registrados')
  }

  // Sem vínculo
  if (!medicoPrincipal) {
    return (
      <div className="min-h-full bg-slate-950 pb-8 pt-3">
        <div className="px-4 mb-4">
          <h1 className="text-slate-50 text-[20px] font-semibold tracking-tight">
            Medicação
          </h1>
        </div>
        <div className="mx-4 rounded-2xl bg-slate-900 border border-slate-800 p-6 text-center">
          <p className="text-slate-400 text-[13px] leading-snug">
            Você ainda não está vinculado a um médico Nymos. Use o código de convite que recebeu pra liberar essa aba.
          </p>
        </div>
      </div>
    )
  }

  // Vinculado sem prescrição
  const semPrescricao = medicacoesAtivas.length === 0 && historicoReceitas.length === 0
  const temGlp1 = glp1Injetaveis.length > 0 || glp1Orais.length > 0

  return (
    <div className="min-h-full bg-slate-950 pb-8 pt-3">
      {/* Header */}
      <div className="px-4 mb-4">
        <h1 className="text-slate-50 text-[20px] font-semibold tracking-tight">Medicação</h1>
        {multiMedico ? (
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] uppercase tracking-wider">
              {medicosVinculados.length} médicos
            </span>
            <span className="text-slate-700">·</span>
            <div className="flex -space-x-1.5">
              {medicosVinculados.map((m) => (
                <div
                  key={m.id}
                  title={`${m.nome} · ${m.especialidade}`}
                  className="w-6 h-6 rounded-full bg-teal-500/15 text-teal-300 border-2 border-slate-950 flex items-center justify-center text-[10px] font-semibold"
                >
                  {m.iniciais}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-1 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-teal-500/15 text-teal-300 flex items-center justify-center text-[10px] font-semibold">
              {medicoPrincipal.iniciais}
            </div>
            <span className="text-slate-400 text-[12px]">
              {medicoPrincipal.nome} · {medicoPrincipal.especialidade}
            </span>
          </div>
        )}
      </div>

      {/* Banner receita renovada */}
      {bannerVisivel && receitaRenovada && (
        <ReceitaRenovadaBanner
          receita={receitaRenovada}
          onDispensar={() => {
            setBannerVisivel(false)
            onDispensarRenovada?.()
          }}
          onAbrir={(id) => handleAbrirMemed(id)}
        />
      )}

      {/* Estado vazio: vinculado sem prescrição */}
      {semPrescricao ? (
        <div className="mx-4 rounded-2xl bg-slate-900 border border-slate-800 p-6 text-center">
          <p className="text-slate-100 text-[13.5px] font-medium mb-1">
            Nenhuma medicação prescrita ainda
          </p>
          <p className="text-slate-400 text-[12px] leading-snug">
            Após sua primeira consulta com {medicoPrincipal.nome}, suas medicações aparecem aqui.
          </p>
        </div>
      ) : (
        <>
          {/* GLP-1: Cards de aplicação semanal */}
          {glp1Injetaveis.map((med) => (
            <MedicacaoSemanaCard
              key={med.id}
              medicacao={med}
              injecoes={injecoes}
              onAplicarDose={handleAplicarDose}
              onAbrirDetalhe={handleAbrirDetalheMed}
            />
          ))}

          {/* GLP-1: Cards orais */}
          {glp1Orais.map((med) => (
            <MedicacaoOralCard
              key={med.id}
              medicacao={med}
              streakDias={12}
              tomadoHoje={false}
              exigeJejum={exigeJejum(med)}
              onMarcarComprimido={handleMarcarComprimido}
              onAbrirDetalhe={handleAbrirDetalheMed}
            />
          ))}

          {/* Bloco "Hoje" tradicional — só pra doses não-GLP-1-injetáveis */}
          {resumoHoje && resumoHoje.doses.length > 0 && (
            <MedicacaoHojeCard resumo={resumoHoje} onMarcarDose={handleMarcarDose} />
          )}

          {/* GLP-1: Atalho registrar sintomas */}
          {temGlp1 && (
            <div className="mx-4 mb-4">
              <button
                onClick={() => handleAbrirSintomas(glp1Injetaveis[0]?.nome)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 text-[12.5px] text-teal-300 active:scale-[0.99] transition-all"
              >
                Registrar sintomas pós-dose →
              </button>
            </div>
          )}

          {/* Bloco 2: Outras medicações ativas (não-GLP-1) */}
          {outrasAtivas.length > 0 && (
            <>
              <div className="px-4 mb-2 mt-2 flex items-center justify-between">
                <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  Outras medicações
                </span>
                <span className="text-slate-500 font-mono text-[11px] tabular-nums">
                  {outrasAtivas.length}
                </span>
              </div>
              {outrasAtivas.map((m) => (
                <MedicacaoAtivaCard
                  key={m.id}
                  medicacao={m}
                  onAbrir={handleAbrirDetalheMed}
                />
              ))}
            </>
          )}

          {/* Bloco 3: Histórico */}
          {historicoReceitas.length > 0 && (
            <>
              <div className="px-4 mb-2 mt-4">
                <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                  Histórico de receitas
                </span>
              </div>
              <HistoricoReceitas
                registros={historicoReceitas}
                onAbrirDetalhe={handleAbrirDetalheReceita}
                onVerTodas={onVerHistoricoCompleto}
              />
            </>
          )}
        </>
      )}

      {/* Drawer detalhe de receita */}
      <ReceitaDetalheDrawer
        receita={receitaAberta}
        onClose={() => setReceitaAberta(null)}
        onAbrirMemed={(memedId) => {
          setReceitaAberta(null)
          pushToast('info', `Abrindo Memed (${memedId})`)
          onAbrirReceitaMemed?.(memedId)
        }}
      />

      {/* Modal detalhe de medicação */}
      {medDetalhe && (
        <MedicacaoDetalhe
          medicacao={medDetalhe}
          medicoPrescritor={
            medDetalhe.medicoId ? medicosMap[medDetalhe.medicoId] ?? null : null
          }
          curva={curvaDoDetalhe}
          injecoes={injecoes}
          sintomas={sintomasDoDetalhe}
          receitas={receitasDoDetalhe}
          open={!!medDetalhe}
          onClose={() => setMedDetalhe(null)}
          onAbrirReceitaMemed={handleAbrirMemed}
          onFalarComMedico={handleFalarComMedico}
          onAplicarDose={handleAplicarDose}
          onMarcarComprimido={handleMarcarComprimido}
          onRegistrarSintomas={handleAbrirSintomasDoDetalhe}
        />
      )}

      {/* Modal registrar injeção */}
      {injecaoAberta && (
        <RegistrarInjecao
          medicacao={injecaoAberta}
          historico={injecoes}
          open={!!injecaoAberta}
          onClose={() => setInjecaoAberta(null)}
          onConfirmar={handleConfirmarInjecao}
        />
      )}

      {/* Modal registrar sintomas */}
      {sintomasAbertos && (
        <RegistrarSintomas
          open={!!sintomasAbertos}
          contextoLabel={sintomasAbertos.contexto}
          onClose={() => setSintomasAbertos(null)}
          onSalvar={handleSalvarSintomas}
        />
      )}

      {/* Toasts */}
      <Toasts items={toasts} />
    </div>
  )
}
