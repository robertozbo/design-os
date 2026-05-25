import { useMemo, useRef, useState } from 'react'
import type {
  ConfigurarCertificadoProps,
  OrigemCertificado,
  PermissaoCertificado,
} from '@/../product/sections/eventos-esocial/types'
import {
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  ShieldAlert,
  Upload,
  KeyRound,
  Eye,
  EyeOff,
  Building2,
  Search,
  Check,
  X,
  RefreshCw,
  CircleAlert,
  FileLock2,
  CalendarClock,
  BadgeCheck,
  Trash2,
} from 'lucide-react'

const ORIGEM_OPCOES: {
  value: OrigemCertificado
  titulo: string
  descricao: string
  Icon: typeof FileLock2
}[] = [
  {
    value: 'proprio_procuracao',
    titulo: 'Meu certificado · procuração eletrônica',
    descricao:
      'Você atua como representante do empregador via procuração eletrônica concedida no e-CAC. Um único certificado serve toda a carteira.',
    Icon: BadgeCheck,
  },
  {
    value: 'do_empregador',
    titulo: 'Certificado do empregador',
    descricao:
      'O empregador fornece o próprio certificado A1/A3. Específico desta empresa, não compartilhado com outras da carteira.',
    Icon: Building2,
  },
]

const PERMISSAO_OPCOES: {
  value: PermissaoCertificado
  titulo: string
  descricao: string
}[] = [
  {
    value: 'esocial',
    titulo: 'Transmissão eSocial',
    descricao: 'Envio de eventos S-2210/2220/2221/2240/2245 e eventos de exclusão S-3000.',
  },
  {
    value: 'assinatura_documentos',
    titulo: 'Assinatura digital de documentos',
    descricao: 'PGR, relatórios NR-1, ASOs, declarações — válida juridicamente.',
  },
]

export function ConfigurarCertificado({
  empregadorContexto,
  certificado,
  empregadoresDisponiveis,
  onVoltar,
  onFechar,
  onUploadArquivo,
  onRemoverArquivo,
  onSalvar,
  onRevogar,
}: ConfigurarCertificadoProps) {
  const [origem, setOrigem] = useState<OrigemCertificado>(
    certificado.origem ?? 'proprio_procuracao',
  )
  const [permissoes, setPermissoes] = useState<Set<PermissaoCertificado>>(
    new Set(certificado.permissoes.length > 0 ? certificado.permissoes : ['esocial']),
  )
  const [escopo, setEscopo] = useState<Set<string>>(
    new Set(certificado.empregadoresEscopo.map((e) => e.id)),
  )
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [arquivo, setArquivo] = useState<{ nome: string; tamanhoKb: number } | null>(
    certificado.configurado
      ? { nome: 'certificado-renato-holanda.pfx', tamanhoKb: 4 }
      : null,
  )
  const [substituir, setSubstituir] = useState(false)
  const [buscaEmpregador, setBuscaEmpregador] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const isExpirado = certificado.status === 'expirado'
  const isExpirando = certificado.alertaExpiracao
  const escopoVisivel = origem === 'proprio_procuracao'

  const empregadoresFiltrados = useMemo(() => {
    const termo = buscaEmpregador.trim().toLowerCase()
    return empregadoresDisponiveis.filter(
      (e) =>
        !termo ||
        e.nomeFantasia.toLowerCase().includes(termo) ||
        e.cnpj.replace(/\D/g, '').includes(termo.replace(/\D/g, '')) ||
        (e.cliente && e.cliente.toLowerCase().includes(termo)),
    )
  }, [empregadoresDisponiveis, buscaEmpregador])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const upload = { nome: f.name, tamanhoKb: Math.round(f.size / 1024) }
    setArquivo(upload)
    setSubstituir(false)
    e.target.value = ''
  }

  const validForm = (substituir || !certificado.configurado ? arquivo !== null && senha.length > 0 : true) && permissoes.size > 0

  const handleSalvar = () => {
    if (!validForm) return
    if ((substituir || !certificado.configurado) && arquivo && onUploadArquivo) {
      onUploadArquivo({ nome: arquivo.nome, tamanhoKb: arquivo.tamanhoKb, senha })
    }
    onSalvar?.({
      origem,
      permissoes: Array.from(permissoes),
      empregadoresEscopo: escopoVisivel ? Array.from(escopo) : [empregadorContexto.id],
    })
  }

  return (
    <div className="relative min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <RevealStyles />

      <div className="relative mx-auto w-full max-w-[960px] px-4 sm:px-6 lg:px-10 pt-8 pb-16">
        {/* Breadcrumb */}
        <div className="nymos-reveal opacity-0 flex items-center gap-1.5 mb-2 text-[12px] text-slate-500 dark:text-slate-400 flex-wrap">
          <button
            type="button"
            onClick={onVoltar}
            className="text-teal-600 dark:text-teal-400 font-medium hover:underline"
          >
            Empregadores
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-700 dark:text-slate-200 font-medium">
            {empregadorContexto.nomeFantasia}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <button
            type="button"
            onClick={onVoltar}
            className="text-teal-600 dark:text-teal-400 font-medium hover:underline"
          >
            Configurações
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" strokeWidth={1.75} />
          <span className="text-slate-500 dark:text-slate-400">Certificado Digital</span>
        </div>

        <button
          type="button"
          onClick={onVoltar}
          className="nymos-reveal opacity-0 inline-flex items-center gap-1 mb-3 text-[12px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition lg:hidden"
        >
          <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2} />
          Voltar
        </button>

        {/* Header */}
        <header className="nymos-reveal opacity-0 mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500 dark:text-slate-400">
              SST · Configurações · Certificado Digital
            </span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 inline-flex items-center gap-2">
                <FileLock2 className="w-6 h-6 text-teal-600 dark:text-teal-400" strokeWidth={1.75} />
                Certificado Digital
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-[680px]">
                Necessário pra transmitir eventos eSocial e assinar documentos digitalmente. Aceita
                certificados A1 (arquivo <span className="font-mono">.pfx</span>) e A3 (token/cartão
                conectado).
              </p>
            </div>
            {onFechar && (
              <button
                type="button"
                onClick={onFechar}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Fechar"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            )}
          </div>
        </header>

        {/* Status atual */}
        {certificado.configurado && (
          <section
            style={{ animationDelay: '120ms' }}
            className={`
              nymos-reveal opacity-0 mb-5 rounded-2xl border overflow-hidden
              ${
                isExpirado
                  ? 'border-rose-200/70 dark:border-rose-900/60 bg-gradient-to-br from-rose-50 via-white to-rose-50/30 dark:from-rose-950/30 dark:via-slate-900 dark:to-slate-950'
                  : isExpirando
                    ? 'border-amber-200/70 dark:border-amber-900/60 bg-gradient-to-br from-amber-50 via-white to-amber-50/30 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-950'
                    : 'border-emerald-200/70 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-950'
              }
            `}
          >
            <div className="px-5 py-4 flex items-start gap-4">
              <span
                className={`shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-2xl ${
                  isExpirado
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                    : isExpirando
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {isExpirado ? (
                  <ShieldAlert className="w-5 h-5" strokeWidth={1.75} />
                ) : (
                  <ShieldCheck className="w-5 h-5" strokeWidth={1.75} />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                    {certificado.titular}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ring-1 ${
                      isExpirado
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 ring-rose-200 dark:ring-rose-900'
                        : isExpirando
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 ring-amber-200 dark:ring-amber-900'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 ring-emerald-200 dark:ring-emerald-900'
                    }`}
                  >
                    {certificado.tipo}
                    {certificado.tipo === 'A1' ? ' · arquivo' : ' · token'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5 text-[11px]">
                  <Meta label="CNPJ titular" value={certificado.cnpjTitular ?? '—'} mono />
                  <Meta label="Série" value={certificado.numeroSerie ?? '—'} mono />
                  <Meta label="Emitido por" value={certificado.emitidoPor ?? '—'} />
                  <Meta
                    label="Válido até"
                    value={
                      certificado.validoAte
                        ? `${formatDate(certificado.validoAte)} · ${
                            certificado.diasAteExpiracao ?? 0
                          }d`
                        : '—'
                    }
                    mono
                    highlight={isExpirado ? 'danger' : isExpirando ? 'warning' : undefined}
                  />
                  {certificado.procuracaoValidaAte && (
                    <Meta
                      label="Procuração até"
                      value={formatDate(certificado.procuracaoValidaAte)}
                      mono
                    />
                  )}
                  <Meta
                    label="Em uso"
                    value={`${certificado.empregadoresEscopo.length} empresa${certificado.empregadoresEscopo.length > 1 ? 's' : ''}`}
                  />
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setSubstituir(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-white/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 transition"
                >
                  <RefreshCw className="w-3 h-3" strokeWidth={1.75} />
                  Substituir
                </button>
                <button
                  type="button"
                  onClick={onRevogar}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                >
                  <Trash2 className="w-3 h-3" strokeWidth={1.75} />
                  Revogar
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Upload de arquivo (quando não configurado OU está substituindo) */}
        {(!certificado.configurado || substituir) && (
          <section
            style={{ animationDelay: '180ms' }}
            className="nymos-reveal opacity-0 mb-5 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <header className="px-5 py-3.5 flex items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 inline-flex items-center gap-2">
                <Upload className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
                {certificado.configurado ? 'Substituir certificado' : 'Arquivo do certificado'}
                <span className="text-rose-500 dark:text-rose-400">*</span>
              </h2>
              {substituir && (
                <button
                  type="button"
                  onClick={() => {
                    setSubstituir(false)
                    setArquivo(certificado.configurado ? { nome: 'certificado-renato-holanda.pfx', tamanhoKb: 4 } : null)
                    setSenha('')
                  }}
                  className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
                >
                  Cancelar substituição
                </button>
              )}
            </header>

            <div className="px-5 py-4 space-y-4">
              <input
                ref={fileRef}
                type="file"
                accept=".pfx,.p12"
                className="hidden"
                onChange={handleFile}
              />

              {!arquivo || substituir ? (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full px-4 py-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-900/40 text-center hover:border-teal-400 dark:hover:border-teal-700 hover:bg-teal-50/30 dark:hover:bg-teal-950/20 transition group"
                >
                  <Upload
                    className="w-6 h-6 mx-auto mb-2 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition"
                    strokeWidth={1.5}
                  />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Selecione o arquivo .pfx do certificado
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Formato PKCS#12 · A1 ou A3 exportado · até 50 KB
                  </p>
                </button>
              ) : (
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/70 dark:border-teal-900/50">
                  <span className="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
                    <FileLock2 className="w-4 h-4" strokeWidth={1.75} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-slate-900 dark:text-slate-100 truncate">
                      {arquivo.nome}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {arquivo.tamanhoKb} KB · pronto pra envio
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setArquivo(null)
                      onRemoverArquivo?.()
                    }}
                    className="inline-flex items-center justify-center w-7 h-7 rounded text-slate-500 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    aria-label="Remover arquivo"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              )}

              <label className="block">
                <span className="block text-[12px] font-medium text-slate-700 dark:text-slate-300 mb-1 inline-flex items-center gap-1.5">
                  <KeyRound className="w-3 h-3" strokeWidth={1.75} />
                  Senha do certificado
                  <span className="text-rose-500 dark:text-rose-400">*</span>
                </span>
                <div className="relative">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    className="
                      w-full pl-3 pr-10 py-2 rounded-xl
                      bg-white dark:bg-slate-950/40
                      border border-slate-200 dark:border-slate-800
                      placeholder:text-slate-400 dark:placeholder:text-slate-600
                      text-sm font-mono text-slate-900 dark:text-slate-100
                      focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
                      transition
                    "
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-6 h-6 rounded text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition"
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {mostrarSenha ? (
                      <EyeOff className="w-3.5 h-3.5" strokeWidth={1.75} />
                    ) : (
                      <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
                  <CircleAlert className="w-2.5 h-2.5 text-slate-400" strokeWidth={2} />
                  Senha criptografada e armazenada com AES-256 — só usada no momento da transmissão.
                </p>
              </label>
            </div>
          </section>
        )}

        {/* Origem */}
        <section
          style={{ animationDelay: '240ms' }}
          className="nymos-reveal opacity-0 mb-5 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <header className="px-5 py-3.5 border-b border-slate-200/70 dark:border-slate-800/80">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Origem do certificado
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Define quem é o titular e quais empresas podem usá-lo.
            </p>
          </header>
          <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {ORIGEM_OPCOES.map((opt) => {
              const active = origem === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setOrigem(opt.value)}
                  className={`
                    text-left px-4 py-3 rounded-xl border transition
                    ${
                      active
                        ? 'border-teal-400 dark:border-teal-700 bg-teal-50 dark:bg-teal-950/40 shadow-[0_4px_14px_-4px_rgba(13,148,136,0.25)]'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }
                  `}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg ${
                        active
                          ? 'bg-teal-600 dark:bg-teal-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {active ? (
                        <Check className="w-4 h-4" strokeWidth={2.5} />
                      ) : (
                        <opt.Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={`text-[13px] font-semibold ${
                          active
                            ? 'text-teal-900 dark:text-teal-100'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {opt.titulo}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {opt.descricao}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Permissões */}
        <section
          style={{ animationDelay: '300ms' }}
          className="nymos-reveal opacity-0 mb-5 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <header className="px-5 py-3.5 border-b border-slate-200/70 dark:border-slate-800/80">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Permissões habilitadas
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Esse certificado autoriza Nymos a executar as ações abaixo em nome do titular.
            </p>
          </header>
          <div className="px-5 py-3 space-y-2">
            {PERMISSAO_OPCOES.map((opt) => {
              const ativo = permissoes.has(opt.value)
              return (
                <label
                  key={opt.value}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer"
                >
                  <span
                    className={`mt-0.5 inline-flex items-center justify-center w-5 h-5 rounded-md transition ${
                      ativo
                        ? 'bg-teal-600 dark:bg-teal-500'
                        : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {ativo && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </span>
                  <input
                    type="checkbox"
                    checked={ativo}
                    onChange={(e) =>
                      setPermissoes((prev) => {
                        const out = new Set(prev)
                        if (e.target.checked) out.add(opt.value)
                        else out.delete(opt.value)
                        return out
                      })
                    }
                    className="sr-only"
                  />
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-slate-900 dark:text-slate-100">
                      {opt.titulo}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {opt.descricao}
                    </p>
                  </div>
                </label>
              )
            })}
          </div>
        </section>

        {/* Escopo de empresas — só se origem = própria */}
        {escopoVisivel && (
          <section
            style={{ animationDelay: '360ms' }}
            className="nymos-reveal opacity-0 mb-5 rounded-2xl bg-white/80 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <header className="px-5 py-3.5 flex items-center justify-between gap-3 border-b border-slate-200/70 dark:border-slate-800/80">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 inline-flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" strokeWidth={1.75} />
                  Escopo · empresas da carteira
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Marque as empresas para as quais esse certificado tem procuração eletrônica
                  válida.
                </p>
              </div>
              <div className="text-[12px] text-slate-500 dark:text-slate-400 tabular-nums">
                {escopo.size} de {empregadoresDisponiveis.length}
              </div>
            </header>

            <div className="px-3 py-2 border-b border-slate-200/70 dark:border-slate-800/80">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
                  strokeWidth={1.75}
                />
                <input
                  type="search"
                  value={buscaEmpregador}
                  onChange={(e) => setBuscaEmpregador(e.target.value)}
                  placeholder="Buscar por empresa, CNPJ ou cliente"
                  className="
                    w-full pl-9 pr-3 py-1.5 rounded-lg
                    bg-slate-50 dark:bg-slate-900/60
                    border border-slate-200 dark:border-slate-800
                    placeholder:text-slate-400 dark:placeholder:text-slate-500
                    text-[12px] text-slate-700 dark:text-slate-200
                    focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950/60
                    transition
                  "
                />
              </div>
            </div>

            <div className="px-2 py-2 max-h-[280px] overflow-y-auto">
              <div className="flex items-center justify-between px-3 py-1.5 mb-1">
                <button
                  type="button"
                  onClick={() => setEscopo(new Set(empregadoresFiltrados.map((e) => e.id)))}
                  className="text-[11px] text-teal-700 dark:text-teal-300 hover:underline"
                >
                  Selecionar todos
                </button>
                <button
                  type="button"
                  onClick={() => setEscopo(new Set())}
                  className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
                >
                  Limpar
                </button>
              </div>
              <ul className="space-y-1">
                {empregadoresFiltrados.map((emp) => {
                  const marcado = escopo.has(emp.id)
                  return (
                    <li key={emp.id}>
                      <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition cursor-pointer">
                        <span
                          className={`shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-md transition ${
                            marcado
                              ? 'bg-teal-600 dark:bg-teal-500'
                              : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {marcado && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </span>
                        <input
                          type="checkbox"
                          checked={marcado}
                          onChange={(e) =>
                            setEscopo((prev) => {
                              const out = new Set(prev)
                              if (e.target.checked) out.add(emp.id)
                              else out.delete(emp.id)
                              return out
                            })
                          }
                          className="sr-only"
                        />
                        <div className="min-w-0 flex-1 flex items-baseline justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-slate-900 dark:text-slate-100 truncate">
                              {emp.nomeFantasia}
                            </p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              <span className="font-mono">{emp.cnpj}</span>
                              {emp.cliente && <> · {emp.cliente}</>}
                            </p>
                          </div>
                          {emp.jaUsaCertificadoAtual && (
                            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300">
                              <BadgeCheck className="w-2.5 h-2.5" strokeWidth={2} />
                              em uso
                            </span>
                          )}
                        </div>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>
        )}

        {!escopoVisivel && (
          <div
            style={{ animationDelay: '360ms' }}
            className="nymos-reveal opacity-0 mb-5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 px-4 py-3 flex items-start gap-2.5"
          >
            <CalendarClock className="w-3.5 h-3.5 mt-0.5 text-slate-500 dark:text-slate-400 shrink-0" strokeWidth={1.75} />
            <p className="text-[12px] text-slate-700 dark:text-slate-300 leading-snug">
              Como é certificado do empregador, o escopo é fixo:{' '}
              <span className="font-medium">{empregadorContexto.nomeFantasia}</span>. Não pode ser
              usado para outras empresas da carteira.
            </p>
          </div>
        )}

        {/* Footer com ações */}
        <div
          style={{ animationDelay: '420ms' }}
          className="nymos-reveal opacity-0 sticky bottom-3 z-10 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-8px_24px_-12px_rgba(15,23,42,0.18)] backdrop-blur"
        >
          <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
            {validForm
              ? 'Pronto pra salvar — o certificado será validado e ativado em segundos.'
              : 'Preencha arquivo, senha e ao menos uma permissão.'}
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onVoltar}
              className="px-3.5 py-2 rounded-xl text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSalvar}
              disabled={!validForm}
              className={`
                inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition
                ${
                  validForm
                    ? 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400 text-white shadow-[0_4px_14px_-4px_rgba(13,148,136,0.45)]'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                }
              `}
            >
              <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2.25} />
              {certificado.configurado && !substituir
                ? 'Salvar alterações'
                : 'Ativar certificado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Meta({
  label,
  value,
  mono = false,
  highlight,
}: {
  label: string
  value: string
  mono?: boolean
  highlight?: 'danger' | 'warning'
}) {
  const highlightCls =
    highlight === 'danger'
      ? 'text-rose-700 dark:text-rose-300 font-semibold'
      : highlight === 'warning'
        ? 'text-amber-800 dark:text-amber-300 font-semibold'
        : 'text-slate-700 dark:text-slate-300'
  return (
    <div>
      <p className="uppercase tracking-[0.14em] font-semibold text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className={`${highlightCls} ${mono ? 'font-mono tabular-nums' : ''}`}>{value}</p>
    </div>
  )
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    return `${dd}/${mm}/${d.getFullYear()}`
  } catch {
    return '—'
  }
}

function RevealStyles() {
  return (
    <style>{`
      @keyframes nymos-reveal-up {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .nymos-reveal {
        animation: nymos-reveal-up 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @media (prefers-reduced-motion: reduce) {
        .nymos-reveal {
          animation: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      }
    `}</style>
  )
}
