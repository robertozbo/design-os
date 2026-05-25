export type Modalidade = 'presencial' | 'tele';

export type EstadoConsulta =
  | 'pre-consulta'
  | 'iniciando'
  | 'gravando'
  | 'pausada'
  | 'encerrada'
  | 'assinada';

export type GravacaoStatus =
  | 'idle'
  | 'preparando'
  | 'gravando'
  | 'pausado'
  | 'encerrado';

export type TabAtiva = 'anamnese' | 'soap' | 'prescricao' | 'laboratorio' | 'imagens';

export type ModalidadeImagem = 'raio-x' | 'usg' | 'rm' | 'tc' | 'cintilografia';
export type SignificanciaImagem = 'normal' | 'atencao' | 'critico';

export type SoapTipo = 'S' | 'O' | 'A' | 'P';

export type AlertNivel = 'baixo' | 'normal' | 'alto' | 'critico';

export type Falante = 'medico' | 'paciente';

export interface Consulta {
  id: string;
  pacienteId: string;
  agendamentoId: string;
  modalidade: Modalidade;
  estado: EstadoConsulta;
  iniciadaEm: string;
  tempoDecorridoSeg: number;
  gravacaoStatus: GravacaoStatus;
  tabAtiva: TabAtiva;
  termoGravacaoAceito: boolean;
  modeloIA: string;
  assinadaEm: string | null;
  assinadaPor: string | null;
}

export interface Paciente {
  id: string;
  nome: string;
  idade: number;
  genero: 'feminino' | 'masculino' | 'outro';
  condicoesCronicas: string[];
  ultimaConsultaEm: string | null;
  telefone: string;
  convenio: string;
}

export interface AnamneseEntrada {
  preenchidaEm: string;
  preenchidaPor: 'paciente' | 'medico';
  campos: {
    queixaPrincipal: string;
    sintomas: string[];
    medicacaoAtual: string;
    duvidas: string;
  };
}

export interface SoapBloco {
  tipo: SoapTipo;
  rotulo: string;
  texto: string;
  geradoPorIA: boolean;
  editadoPeloMedico: boolean;
}

export interface TranscricaoTrecho {
  ts: string;
  fala: Falante;
  texto: string;
}

export interface MedicacaoAtiva {
  id: string;
  nome: string;
  dose: string;
  posologia: string;
  prescricaoId: string;
  adesaoUltimos7Dias: number | null;
  iniciadaEm: string;
}

export interface Biomarker {
  nome: string;
  valor: number;
  unidade: string;
  faixaReferencia: string;
  alertNivel: AlertNivel;
  historico: number[];
}

export interface ExameRecente {
  id: string;
  tipo: string;
  laboratorio: string;
  dataColeta: string;
  biomarkers: Biomarker[];
}

export interface ImagemRecente {
  id: string;
  tipo: string;
  modalidade: ModalidadeImagem;
  laboratorio: string;
  dataColeta: string;
  /** Identificador anatômico do mock visual (mesmos valores do ImagemSerie da section Exames). */
  mockVisual:
    | 'torax-pa'
    | 'torax-perfil'
    | 'tireoide-long'
    | 'tireoide-trans'
    | 'abdome-fig-hepatico'
    | 'abdome-rim'
    | 'crânio-sagital-t1'
    | 'crânio-coronal-t1';
  /** Destaque do principal achado (ex: "Nódulo TI-RADS 3 LD 8mm", "Sem alterações"). */
  destaqueAchado: string;
  significancia: SignificanciaImagem;
}

export interface EvolucaoAnterior {
  id: string;
  data: string;
  planoResumo: string;
}

export interface AcaoPosConsulta {
  id: 'ret' | 'resumo' | 'cobranca';
  rotulo: string;
  habilitada: boolean;
  sugestao?: string;
  dataSugerida?: string;
  preview?: string;
  motivo?: string;
}

export interface ConsultaProps {
  consulta: Consulta;
  paciente: Paciente;
  anamneseEntrada: AnamneseEntrada;
  soapBlocos: SoapBloco[];
  transcricaoTrechos: TranscricaoTrecho[];
  medicacaoAtiva: MedicacaoAtiva[];
  examesRecentes: ExameRecente[];
  imagensRecentes: ImagemRecente[];
  evolucoesAnteriores: EvolucaoAnterior[];
  acoesPosConsulta: AcaoPosConsulta[];

  /** Inicia a captura de áudio da consulta (estado: idle → gravando). */
  onIniciarGravacao?: () => void;
  /** Pausa a captura sem encerrar a consulta. */
  onPausarGravacao?: () => void;
  /** Retoma a captura após pausa. */
  onRetomarGravacao?: () => void;
  /** Encerra captura (não assina ainda; libera SOAP pra edição final). */
  onEncerrarGravacao?: () => void;

  /** Troca a aba ativa do painel central. */
  onTrocarTab?: (tab: TabAtiva) => void;

  /** Salva edição inline de um bloco do SOAP (registra diff no audit log). */
  onEditarSoapBloco?: (tipo: SoapTipo, novoTexto: string) => void;

  /** Disparado quando o médico edita anamnese via chips/textarea (registra diff no audit log). */
  onAlterarAnamnese?: (campos: AnamneseEntrada['campos']) => void;

  /** Abre o modal/embed do Memed pra criar prescrição na consulta atual. */
  onAbrirMemed?: () => void;

  /** Assina a evolução (click-to-attest no V1). Fecha a consulta e abre modal de pós-consulta. */
  onAssinarEFechar?: () => void;

  /** Confirma as ações pós-consulta selecionadas no modal de fechamento. */
  onConfirmarAcoesPosConsulta?: (acoesIds: AcaoPosConsulta['id'][]) => void;

  /** Abre a sala de teleconsulta (apenas se modalidade = 'tele'). */
  onEntrarSalaTele?: () => void;
  /** Minimiza/maximiza a janela de vídeo da teleconsulta. */
  onAlternarTamanhoVideo?: () => void;

  /** Abre o detalhe de um exame laboratorial do painel de contexto. */
  onAbrirExameDetalhe?: (exameId: string) => void;
  /** Abre o detalhe de uma imagem (raio-X, USG, RM) do painel de contexto. Pode abrir drawer ou nova rota. */
  onAbrirImagemDetalhe?: (imagemId: string) => void;
  /** Disparado ao confirmar upload de uma nova imagem dentro da Consulta. */
  onCarregarImagem?: (form: { tipo: string; modalidade: string; arquivos: number }) => void;
  /** Lookup do detalhe completo da imagem (cross-section). Usado pelo viewer inline da tab Imagens. */
  getExameImagemDetalhe?: (imagemId: string) => unknown;
  /** Lookup do detalhe completo do exame laboratorial (cross-section). Usado pelo inline da tab Laboratório. */
  getExameLabDetalhe?: (exameId: string) => unknown;
  /** Disparado quando o médico salva a análise IA de uma imagem (com comentário) no prontuário. */
  onSalvarAnaliseImagem?: (data: {
    imagemId: string;
    comentarioMedico: string | null;
    imagensAnalisadasIds: string[];
  }) => void;
  /** Análises IA já salvas pra cada imagem nesta consulta. Usado pra mostrar badge "Analisado" + pré-popular comentário ao reabrir. */
  analisesSalvasPorImagem?: Record<
    string,
    { comentarioMedico: string | null; imagensAnalisadasIds: string[]; salvoEm: string }
  >;
  /** Abre o detalhe de uma evolução anterior do painel de contexto. */
  onAbrirEvolucaoAnterior?: (evolucaoId: string) => void;
}
