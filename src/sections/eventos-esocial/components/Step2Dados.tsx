import type { TipoEvento } from '@/../product/sections/eventos-esocial/types'
import { Info } from 'lucide-react'

interface FieldDef {
  name: string
  label: string
  type: 'text' | 'date' | 'datetime-local' | 'select' | 'textarea' | 'number'
  placeholder?: string
  hint?: string
  required?: boolean
  options?: { value: string; label: string }[]
  mono?: boolean
  colSpan?: 1 | 2
}

interface GroupDef {
  titulo: string
  descricao?: string
  campos: FieldDef[]
}

const SCHEMAS: Record<TipoEvento, GroupDef[]> = {
  'S-2210': [
    {
      titulo: 'Acidente',
      descricao: 'Identifique o acidente conforme registrado no boletim de ocorrência ou comunicado.',
      campos: [
        {
          name: 'tipoCat',
          label: 'Tipo do CAT',
          type: 'select',
          required: true,
          options: [
            { value: 'inicial', label: 'Inicial' },
            { value: 'reabertura', label: 'Reabertura' },
            { value: 'comunicacao_obito', label: 'Comunicação de óbito' },
          ],
        },
        {
          name: 'tipoAcidente',
          label: 'Categoria',
          type: 'select',
          required: true,
          options: [
            { value: 'tipico', label: 'Típico' },
            { value: 'trajeto', label: 'Trajeto' },
            { value: 'doenca', label: 'Doença ocupacional' },
          ],
        },
        {
          name: 'dataHoraAcidente',
          label: 'Data e hora do acidente',
          type: 'datetime-local',
          required: true,
        },
        { name: 'horasTrabalhadas', label: 'Horas antes do acidente', type: 'number', hint: 'Ex: 4' },
        {
          name: 'localAcidente',
          label: 'Local do acidente',
          type: 'text',
          placeholder: 'Ex: Linha de envase 2, próximo ao tanque T-04',
          colSpan: 2,
          required: true,
        },
      ],
    },
    {
      titulo: 'Lesão',
      campos: [
        {
          name: 'codCidPrincipal',
          label: 'CID principal',
          type: 'text',
          placeholder: 'S62.6',
          mono: true,
          required: true,
          hint: 'Código CID-10',
        },
        { name: 'parteCorpo', label: 'Parte do corpo atingida', type: 'text', placeholder: 'Mão direita', required: true },
        {
          name: 'agenteCausador',
          label: 'Agente causador',
          type: 'text',
          placeholder: 'Esteira transportadora',
          colSpan: 2,
        },
        {
          name: 'gravidade',
          label: 'Avaliação inicial',
          type: 'select',
          options: [
            { value: 'sem_afastamento', label: 'Sem afastamento' },
            { value: 'afastamento_ate_15', label: 'Afastamento até 15 dias' },
            { value: 'afastamento_mais_15', label: 'Afastamento > 15 dias' },
            { value: 'obito', label: 'Óbito' },
          ],
        },
      ],
    },
  ],
  'S-2220': [
    {
      titulo: 'Identificação do exame',
      campos: [
        {
          name: 'tipoExame',
          label: 'Tipo de ASO',
          type: 'select',
          required: true,
          options: [
            { value: 'admissional', label: 'Admissional' },
            { value: 'periodico', label: 'Periódico' },
            { value: 'demissional', label: 'Demissional' },
            { value: 'mudanca_funcao', label: 'Mudança de função' },
            { value: 'retorno_trabalho', label: 'Retorno ao trabalho' },
          ],
        },
        { name: 'dataASO', label: 'Data do ASO', type: 'date', required: true },
        {
          name: 'ordemServico',
          label: 'Ordem de serviço',
          type: 'text',
          placeholder: 'OS-2026-XXXXX',
          mono: true,
        },
        { name: 'cnesLocal', label: 'CNES local de realização', type: 'text', placeholder: '2078412', mono: true },
      ],
    },
    {
      titulo: 'Médico responsável',
      descricao: 'O CRM é validado contra a base do CFM no momento da transmissão.',
      campos: [
        { name: 'medicoNome', label: 'Nome completo', type: 'text', required: true },
        {
          name: 'medicoCRM',
          label: 'CRM (com UF)',
          type: 'text',
          placeholder: 'CRM/SP 187432',
          mono: true,
          required: true,
          hint: 'Formato CRM/UF número',
        },
      ],
    },
    {
      titulo: 'Resultado',
      campos: [
        {
          name: 'resultado',
          label: 'Conclusão',
          type: 'select',
          required: true,
          options: [
            { value: 'apto', label: 'Apto' },
            { value: 'apto_restricoes', label: 'Apto com restrições' },
            { value: 'inapto_temp', label: 'Inapto temporariamente' },
            { value: 'inapto', label: 'Inapto' },
          ],
        },
        { name: 'proximoExame', label: 'Próximo exame', type: 'date' },
        {
          name: 'restricoes',
          label: 'Restrições / observações',
          type: 'textarea',
          colSpan: 2,
          placeholder: 'Ex: evitar levantamento de peso acima de 15kg por 90 dias.',
        },
      ],
    },
  ],
  'S-2240': [
    {
      titulo: 'Fator de risco',
      descricao: 'Selecione o fator do catálogo do PGR e descreva intensidade e tempo de exposição.',
      campos: [
        {
          name: 'fatorRiscoCode',
          label: 'Fator de risco',
          type: 'select',
          required: true,
          options: [
            { value: 'ruido_continuo', label: 'Ruído contínuo (físico)' },
            { value: 'ruido_impacto', label: 'Ruído de impacto (físico)' },
            { value: 'calor', label: 'Calor (físico)' },
            { value: 'vibracao', label: 'Vibração (físico)' },
            { value: 'poeira_mineral', label: 'Poeira mineral (químico)' },
            { value: 'vapores_organicos', label: 'Vapores orgânicos (químico)' },
            { value: 'biologico_paciente', label: 'Agente biológico (biológico)' },
            { value: 'ergonomico_postura', label: 'Postura inadequada (ergonômico)' },
          ],
        },
        { name: 'intensidade', label: 'Intensidade / concentração', type: 'text', placeholder: 'Ex: 92 dB(A)', mono: true },
        { name: 'unidadeMedida', label: 'Unidade', type: 'text', placeholder: 'dB(A) · ppm · m/s²', mono: true },
        {
          name: 'tempoExposicaoMeses',
          label: 'Tempo de exposição (meses)',
          type: 'number',
          placeholder: '12',
        },
        {
          name: 'descricaoAtividade',
          label: 'Descrição da atividade',
          type: 'textarea',
          colSpan: 2,
          placeholder: 'Operação de prensa hidráulica em jornada padrão de 8h/dia.',
        },
      ],
    },
    {
      titulo: 'Proteção (EPI/EPC)',
      campos: [
        {
          name: 'temEpi',
          label: 'EPI fornecido?',
          type: 'select',
          options: [
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' },
            { value: 'nao_aplicavel', label: 'Não aplicável' },
          ],
        },
        { name: 'tipoEpi', label: 'Tipo de EPI', type: 'text', placeholder: 'Protetor auricular CA 12345' },
        {
          name: 'eficaciaEpi',
          label: 'Eficácia do EPI',
          type: 'select',
          options: [
            { value: 'eficaz', label: 'Eficaz' },
            { value: 'ineficaz', label: 'Ineficaz' },
            { value: 'nao_avaliada', label: 'Não avaliada' },
          ],
        },
        { name: 'caEpi', label: 'Número do CA', type: 'text', placeholder: 'CA 12345', mono: true },
      ],
    },
  ],
  'S-2245': [
    {
      titulo: 'Treinamento',
      campos: [
        {
          name: 'nrAplicada',
          label: 'NR aplicada',
          type: 'select',
          required: true,
          options: [
            { value: 'nr-01', label: 'NR-01 — Disposições gerais' },
            { value: 'nr-06', label: 'NR-06 — EPI' },
            { value: 'nr-10', label: 'NR-10 — Eletricidade' },
            { value: 'nr-11', label: 'NR-11 — Movimentação de cargas' },
            { value: 'nr-12', label: 'NR-12 — Máquinas e equipamentos' },
            { value: 'nr-17', label: 'NR-17 — Ergonomia' },
            { value: 'nr-20', label: 'NR-20 — Inflamáveis' },
            { value: 'nr-33', label: 'NR-33 — Espaços confinados' },
            { value: 'nr-35', label: 'NR-35 — Trabalho em altura' },
          ],
        },
        {
          name: 'modalidade',
          label: 'Modalidade',
          type: 'select',
          options: [
            { value: 'inicial', label: 'Inicial' },
            { value: 'periodico', label: 'Periódico' },
            { value: 'eventual', label: 'Eventual' },
            { value: 'reciclagem', label: 'Reciclagem' },
          ],
        },
        {
          name: 'cargaHoraria',
          label: 'Carga horária (horas)',
          type: 'number',
          required: true,
          hint: 'Verifique o mínimo exigido pela NR escolhida',
        },
        { name: 'dataInicio', label: 'Data de início', type: 'date', required: true },
        { name: 'dataConclusao', label: 'Data de conclusão', type: 'date', required: true },
      ],
    },
    {
      titulo: 'Instrutor',
      campos: [
        { name: 'instrutorNome', label: 'Nome do instrutor', type: 'text', required: true },
        {
          name: 'instrutorRegistro',
          label: 'Registro profissional',
          type: 'text',
          placeholder: 'CREA/SP 123456',
          mono: true,
        },
        {
          name: 'conteudoProgramatico',
          label: 'Conteúdo programático',
          type: 'textarea',
          colSpan: 2,
          placeholder: 'Tópicos abordados no treinamento.',
        },
      ],
    },
  ],
}

interface Props {
  tipo: TipoEvento
  valores: Record<string, string>
  onChange: (campo: string, valor: string) => void
}

export function Step2Dados({ tipo, valores, onChange }: Props) {
  const grupos = SCHEMAS[tipo]
  return (
    <div className="space-y-6">
      {grupos.map((grupo, gIdx) => (
        <fieldset key={gIdx} className="border-0 p-0 m-0">
          <legend className="text-[11px] uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400 mb-2">
            {grupo.titulo}
          </legend>
          {grupo.descricao && (
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-3 -mt-1 inline-flex items-start gap-1.5">
              <Info className="w-3 h-3 mt-0.5 text-slate-400" strokeWidth={2} />
              {grupo.descricao}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {grupo.campos.map((campo) => (
              <Field
                key={campo.name}
                campo={campo}
                valor={valores[campo.name] ?? ''}
                onChange={(v) => onChange(campo.name, v)}
              />
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  )
}

function Field({
  campo,
  valor,
  onChange,
}: {
  campo: FieldDef
  valor: string
  onChange: (v: string) => void
}) {
  const baseInput = `
    w-full px-3 py-2 rounded-lg
    bg-white dark:bg-slate-900/60
    border border-slate-200 dark:border-slate-800
    placeholder:text-slate-400 dark:placeholder:text-slate-600
    text-sm text-slate-900 dark:text-slate-100
    focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
    transition
    ${campo.mono ? 'font-mono tabular-nums' : ''}
  `

  return (
    <label className={`block ${campo.colSpan === 2 ? 'sm:col-span-2' : ''}`}>
      <span className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1">
        {campo.label}
        {campo.required && <span className="text-rose-600 dark:text-rose-400 ml-0.5">*</span>}
      </span>
      {campo.type === 'textarea' ? (
        <textarea
          rows={2}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={campo.placeholder}
          className={`${baseInput} resize-none`}
        />
      ) : campo.type === 'select' ? (
        <select
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          className={`${baseInput} cursor-pointer`}
        >
          <option value="">Selecione…</option>
          {campo.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={campo.type}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={campo.placeholder}
          className={baseInput}
        />
      )}
      {campo.hint && (
        <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-1">
          {campo.hint}
        </span>
      )}
    </label>
  )
}

export function getRequiredFieldsForTipo(tipo: TipoEvento): string[] {
  return SCHEMAS[tipo]
    .flatMap((g) => g.campos)
    .filter((c) => c.required)
    .map((c) => c.name)
}
