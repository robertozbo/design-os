import { useState } from 'react'
import data from '@/../product-personal/sections/configuracoes/data.json'
import type {
  ConfiguracoesData,
  Idioma,
  PlanoTier,
  SecaoId,
  Tema,
} from '@/../product-personal/sections/configuracoes/types'
import { ConfiguracoesPage as ConfiguracoesView } from './components/ConfiguracoesPage'

export default function ConfiguracoesPagePreview() {
  const [config, setConfig] = useState<ConfiguracoesData>(
    data as ConfiguracoesData,
  )
  const [secao, setSecao] = useState<SecaoId>('perfil')

  return (
    <ConfiguracoesView
      data={config}
      selectedSecao={secao}
      onSecaoChange={setSecao}
      onSavePerfil={(perfil) => {
        setConfig((prev) => ({ ...prev, perfil }))
        console.log('save perfil:', perfil)
      }}
      onSaveAgenda={(agenda) => {
        setConfig((prev) => ({ ...prev, agenda }))
        console.log('save agenda:', agenda)
      }}
      onTrocarPlano={(tier: PlanoTier) => {
        setConfig((prev) => ({ ...prev, plano: { ...prev.plano, atual: tier } }))
        console.log('trocar plano:', tier)
      }}
      onAddMetodoPagamento={() => console.log('add metodo pagamento')}
      onRemoveMetodo={(id) => {
        setConfig((prev) => ({
          ...prev,
          plano: {
            ...prev.plano,
            metodos: prev.plano.metodos.filter((m) => m.id !== id),
          },
        }))
      }}
      onMakeMetodoPrincipal={(id) => {
        setConfig((prev) => ({
          ...prev,
          plano: {
            ...prev.plano,
            metodos: prev.plano.metodos.map((m) => ({
              ...m,
              principal: m.id === id,
            })),
          },
        }))
      }}
      onToggleNotificacao={(categoriaId, canal, valor) => {
        setConfig((prev) => ({
          ...prev,
          notificacoes: {
            ...prev.notificacoes,
            categorias: prev.notificacoes.categorias.map((c) =>
              c.id === categoriaId ? { ...c, [canal]: valor } : c,
            ),
          },
        }))
      }}
      onConectarIntegracao={(id) => {
        setConfig((prev) => ({
          ...prev,
          integracoes: prev.integracoes.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: 'conectado',
                  conectadoEm: new Date().toISOString().slice(0, 10),
                }
              : i,
          ),
        }))
      }}
      onDesconectarIntegracao={(id) => {
        setConfig((prev) => ({
          ...prev,
          integracoes: prev.integracoes.map((i) =>
            i.id === id
              ? { ...i, status: 'disponivel', conectadoEm: undefined }
              : i,
          ),
        }))
      }}
      onChangeIdioma={(id: Idioma) => {
        setConfig((prev) => ({ ...prev, dados: { ...prev.dados, idioma: id } }))
      }}
      onChangeTema={(t: Tema) => {
        setConfig((prev) => ({ ...prev, dados: { ...prev.dados, tema: t } }))
      }}
      onExportarDados={() => console.log('exportar dados')}
      onExcluirConta={() => console.log('excluir conta')}
      onUploadAvatar={() => console.log('upload avatar')}
    />
  )
}
