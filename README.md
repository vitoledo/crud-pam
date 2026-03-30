# Projeto CRUD-PAM 👥

## Descrição do projeto
Este projeto é um aplicativo mobile desenvolvido com React Native e Expo para o gerenciamento de registros de pessoas, permitindo operações de criação, leitura, atualização e exclusão (CRUD). Durante o desenvolvimento, foram implementadas funcionalidades avançadas como busca e filtragem em tempo real, tratamento de estados de carregamento e erro, além da configuração de acesso externo à API utilizando túneis do Cloudflare.

## Tecnologias utilizadas
- **React Native / Expo**: Principais tecnologias para o desenvolvimento mobile multiplataforma.
- **React Navigation**: Essencial para o roteamento e navegação entre as telas do aplicativo.
- **JSON Server**: Utilizado para simular uma API REST fornecendo os dados para persistência local.
- **PNPM**: Gerenciador de pacotes utilizado no projeto por sua rapidez e eficiência.
- **Cloudflared**: Ferramenta para criação de túnel seguro, substituindo o localtunnel para permitir o acesso da rede externa (como de um dispositivo físico) ao JSON Server local.

## Instalação e Configuração do ambiente

1. **Pré-requisitos**: Certifique-se de ter o **Node.js** instalado na sua máquina.
2. **Gerenciador de pacotes**: O projeto utiliza o `pnpm`. Se não o tiver, instale rodando:
   ```bash
   npm install -g pnpm
   ```
3. **Instalação das dependências**: Clone este repositório, abra o terminal na pasta raiz do projeto e execute:
   ```bash
   pnpm install
   ```
4. **Instalação do Cloudflared (Opcional, para testes em dispositivo físico)**:
   - No Windows, abra o PowerShell como administrador e instale com o comando:
     ```powershell
     winget install cloudflare.cloudflared
     ```

## Execução

Para rodar o projeto, você deve inicializar o servidor de banco de dados (API) e o aplicativo Expo.

1. **Iniciar a API local (JSON Server)**:
   Abra um terminal na pasta do projeto e execute:
   ```bash
   pnpm start:json
   ```
   *(O servidor rodará em `http://localhost:3000`)*

2. **Criar o túnel da API com Cloudflared (Se for usar celular físico)**:
   Em outro terminal, execute o comando abaixo para expor a porta 3000 na internet:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```
   - *Copie a URL HTTPS gerada nos logs do terminal.*
   - *Cole a URL copiada no arquivo `src/servers/configApi.js`, substituindo a `API_URL`.*

3. **Iniciar o aplicativo (Expo)**:
   Em um novo terminal, abra o expo:
   ```bash
   pnpm start:expo:web
   ```
   - *Ou use `pnpm start:expo` para abrir diretamente e escanear o QR Code no seu celular com o aplicativo Expo Go.*


## Explicação da solução

Durante o projeto, os seguintes desafios de implementação e lógicas de negócios foram solucionados:

- **Implementação do filtro de pessoas (Nível Pleno)**:
  Foi feto um campo de pesquisa (`TextInput`) na `HomeScreen`. Foi criado um estado local `search` e a lista de pessoas é dinamicamente filtrada utilizando a função `.filter()` do JavaScript no state dos dados da API, aplicando o `.toLowerCase()` para garantir que a pesquisa fosse "case-insensitive". O resultado atualiza a propriedade `data` da `FlatList` instantaneamente à medida que o usuário digita.

- **Tratamento de dados e interface (Nível Sênior)**:
  Para simular um ambiente de sistema real e prover feedbacks ao usuário, o consumo da API foi envolvido num bloco `try/catch/finally`. Foram adicionados dois estados: `loading` e `error`. O aplicativo agora exibe um `ActivityIndicator` nativo enquanto aguarda a resposta dos dados. Caso ocorra uma falha de conexão com a API, uma mensagem de erro é renderizada na tela (`<Text style={styles.error}>Erro ao carregar pessoas</Text>`), tudo isso resolvido com rederização condicional via operador ternário no JSX.

- **Ciclo de vida e UX na atualização de dados**:
  Foi identificado que ao adicionar um novo usuário e retornar para a Home (utilizando o `goBack()` do navigation), os dados não atualizavam instantaneamente. O problema foi resolvido usando o Hook `useFocusEffect` (do pacote `@react-navigation/native`), que refaz a busca dos itens na API sempre que a tela Home recebe de volta o "foco" pelas rolagens de pilha de navegação.

- **Resolução do bloqueio do Localtunnel**:
  A dependência inicial de localtunnel apresentava muita instabilidade. A abordagem foi modificada para o uso da ferramenta oficial da Cloudflare (`cloudflared`), garantindo uma rota externa TLS estável e acessível para que a execução via dispositivo móvel funcionasse com alta fidelidade sem perder as referências para consultas no JSON Server.
