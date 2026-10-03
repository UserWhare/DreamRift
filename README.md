<div align="center">

# DreamRift V6

**Um gerador onírico local onde três palavras viram sonhos, fendas, anomalias e um arquivo que evolui com você.**

![Go](https://img.shields.io/badge/Go-1.22-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

---

O **DreamRift** transforma três palavras em sonhos estranhos com atmosferas, níveis de estranheza, símbolos e interpretações deliberadamente fictícias.

A V6 mantém a identidade escura da V5, mas adiciona progressão, continuidade entre sonhos e um Codex local que registra o que já apareceu nas suas fendas. A interface usa uma base preto/grafite `#121214`, painéis mais retos e animações sutis ativadas por padrão.

## Recursos

- Geração por três palavras
- Atmosferas que alteram narrativa e aparência
- Sonhos Curto, Médio, Profundo e Delírio
- Métricas de lucidez, ameaça, nonsense e nostalgia
- Raridades de Comum até Impossível
- Progressão por **Fragmentos**
- Níveis e títulos de perfil
- **Codex** de atmosferas, símbolos e anomalias
- Combinações secretas que liberam anomalias
- **Fenda do Dia** com recompensa diária
- Sonhos conectados por símbolos e atmosferas recorrentes
- Arquivo, favoritos, ranking e perfil estatístico
- Backup e importação em JSON
- Migração automática dos dados da V5
- Espelhamento local em IndexedDB
- Visual preto/grafite `#121214`, mais reto e minimalista
- Animações leves ativadas por padrão, com opção para reduzi-las
- Interface responsiva para desktop e celular
- Go puro no servidor, sem dependências externas

## Como rodar

Clone o projeto:

```bash
git clone https://github.com/UserWhare/DreamRift.git
cd DreamRift
```

Inicie com Go:

```bash
go run .
```

Depois acesse:

```text
http://localhost:8080
```

No Windows também é possível usar:

```text
start_windows.bat
```

Se a porta 8080 estiver ocupada:

```text
start_windows_8090.bat
```

A porta também pode ser alterada pela variável de ambiente `PORT`.

## Estrutura

```text
DreamRift/
├── data/
├── static/
│   ├── app.js
│   ├── index.html
│   ├── styles.css
│   ├── v6-data.js
│   ├── v6-features.js
│   └── v6-storage.js
├── go.mod
├── main.go
├── start_windows.bat
├── start_windows_8090.bat
└── README.md
```

## Dados locais

O DreamRift não exige conta ou banco remoto.

Os sonhos, configurações e progressão ficam no navegador. Na primeira execução da V6, o arquivo da V5 é migrado automaticamente sem apagar as chaves antigas. A sessão atual também é espelhada em IndexedDB como camada extra de armazenamento local.

O backup da V6 inclui sonhos, configurações, Fragmentos, nível, sequência diária e descobertas do Codex. Backups antigos contendo apenas a lista de sonhos também podem ser importados.

## Fenda do Dia

A Fenda do Dia usa um conjunto diário de três palavras e concede **+25 Fragmentos** na primeira conclusão do dia.

Revisitar a mesma fenda continua permitido, mas a recompensa diária só é entregue uma vez por data local.

## Codex

O Codex cresce enquanto você joga. Atmosferas são registradas quando aparecem, símbolos são catalogados pelas palavras usadas e determinadas combinações abrem anomalias ocultas.

---

<div align="center">

**três palavras → uma fenda → um arquivo impossível**

Feito por [UserWhare](https://github.com/UserWhare)

</div>
