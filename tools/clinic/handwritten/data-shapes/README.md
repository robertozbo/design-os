# UI Data Shapes

Estes tipos definem a forma dos dados que os componentes esperam receber via props. São o
**contrato de frontend** — o que a UI precisa para renderizar.

Como você modela, guarda e busca esse dado no backend é decisão sua. Combine, divida ou estenda à
vontade: nada aqui é schema de banco.

## Arquivos

| Arquivo | O que é |
|---|---|
| `overview.ts` | Todos os tipos de entidade agregados, compila isolado |
| `divergencias.md` | Nomes que aparecem em mais de uma section com definições diferentes |
| `../sections/<id>/types.ts` | O contrato completo da section, incluindo as interfaces `Props` |

As interfaces `*Props` **não** entram no `overview.ts` — elas pertencem a cada section e mudam com o
componente. O que está agregado são as entidades.

## Entidades centrais

Do modelo conceitual do produto, o que atravessa quase todas as sections:

- **Clinic** — o workspace multi-especialidade sob um CNPJ
- **Professional** — médico da clínica (especialidade, CRM, status)
- **Membership / Role** — vínculo de uma pessoa à clínica e seu papel (Admin, Médico, Recepção)
- **Patient** — pertence à Clinic (pool compartilhado), não a um médico
- **CareLink** — vínculo ativo Patient↔Professional; governa, junto com Role, o acesso ao prontuário
- **Appointment** — Patient + Professional + Room + horário + tipo + status

## Antes de escrever o schema, leia `divergencias.md`

15 nomes de tipo aparecem em mais de uma section com definições diferentes — `PacienteRef`,
`MedicoRef`, `StatusConsulta`, `FiltroStatus` e outros. Isso é consequência de as telas terem sido
desenhadas section a section: cada uma modelou o subconjunto de que precisava.

No `overview.ts` esses tipos vêm sufixados (`PacienteRef__prontuario`) só para o arquivo compilar.
**Não reproduza o sufixo no seu modelo.** Onde o conceito é o mesmo, unifique no backend e deixe
cada tela projetar o recorte que usa; onde for realmente conceito diferente, dê nomes diferentes.

Note que isso é divergência de **tipo**, não de dado: os `sample-data.json` já foram unificados —
uma clínica, um corpo clínico, um pool de 22 pacientes coerente entre todas as sections. Se
`PacienteRef` do prontuário tem menos campos que o de exames, é recorte, não conflito.
