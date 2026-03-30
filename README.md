# Projeto CRUD-PAM 📱

## Descrição do projeto
Este projeto é um aplicativo mobile desenvolvido com React Native e Expo para o gerenciamento de registros de pessoas, permitindo operações de criação, leitura, atualização e exclusão (CRUD). 

Ele foi desenvolvido como parte do **"The Code Challenge - Desafio de Programação"**, visando estimular a autonomia, prática mobile e resolução de problemas. O projeto implementa todos os níveis rigorosamente propostos, tornando-se uma aplicação completa, robusta e tolerante a falhas (atingindo requisitos desde a avaliação básica até a avançada).

### 🎥 Preview do Aplicativo

[**Clique aqui para assistir ao vídeo de demonstração do projeto**](./video-funcionamento.mp4)

## Tecnologias utilizadas
- **React Native / Expo**: Core do desenvolvimento mobile multiplataforma.
- **React Navigation**: Gerenciamento do fluxo de telas e roteamento.
- **JSON Server**: Utilizado para simular localmente as chamadas de uma API REST completa para persistência em JSON.
- **PNPM**: Ferramenta de gerenciamento de pacotes Node por sua estabilidade e velocidade.
- **Cloudflared (Alternativa ao Localtunnel)**: Utilizado em desenvolvimento móvel físico via Wi-Fi/dados móveis para rotear seguramente o servidor local para a internet.

## Configuração do ambiente

1. **Pré-requisitos**: É obrigatório ter o **Node.js** instalado na sua máquina.
2. **Gerenciador de pacotes**: O projeto utiliza o gestor `pnpm`. Se não o tiver, rode o comando:
   ```bash
   npm install -g pnpm
   ```
3. **App no celular**: Baixe o aplicativo "Expo Go" no seu dispositivo (disponível para Android/iOS).

## Instalação

1. Clone o repositório ou baixe a pasta.
2. Acesse a raiz do repositório no seu terminal e instale as dependências:
   ```bash
   pnpm install
   ```
3. *(Opcional)* Se for testar pelo celular utilizando internet, instale os utilitários do **Cloudflared**.
   - No Windows, via PowerShell (Administrador):
     ```powershell
     winget install cloudflare.cloudflared
     ```

## Execução

É necessário executar o Back-End e o Front-End de forma separada em abas do terminal.

1. **Iniciar a API (JSON Server)**:
   Na raiz do projeto, digite:
   ```bash
   pnpm start:json
   ```
   *(A API rodará localmente respondendo em `http://localhost:3000`)*

2. **Expor a API (Apenas se for rodar o código no celular físico)**:
   Em outro terminal, digite o comando abaixo para que o celular enxergue a API:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```
   - Ache a URL segura iniciada em `https://[...].trycloudflare.com` que aparecerá nos logs.
   - Navegue até `src/servers/configApi.js` e troque a variável `API_URL` por ela.

3. **Iniciar o projeto Expo (Front-End)**:
   Numa terceira aba do terminal, faça o start do App:
   ```bash
   pnpm start:expo
   ```
   *(Escaneie o QR exibido no console com o aplicativo Expo Go ou digite a letra "w" para abrir diretamente no navegador local)*


## Explicação da solução

Para cumprir todos os estágios do desafio, a aplicação absorveu lógicas focadas na funcionalidade do usuário final, contemplando as seguintes camadas:

### 1. Ampliação do escopo e Navegação (Nível Júnior)
- **Desafio de Adição de Campo:** A estrutura foi adequada para comportar o dado essencial "phone" (telefone). O registro do novo atributo foi implementado desde o arquivo de persistência principal `database.json`, injetado nos formulários de input via states locais e exibido no componente `CardPersonal`. O Payload (formato JSON do Body do método POST e PUT na API) envia a propriedade completando o fluxo.
- **React Navigation:** Mudou-se a abordagem padrão para um modelo flexível. O aplicativo unificou a `HomeScreen` (tela de contatos) e `AddEditScreen` (gestão e criação) através do esquema `Stack.Navigator` introduzido no `App.js`. O roteamento flui passando props/parâmetros via hook de navegação quando um usuário edita.

### 2. Busca e Filtragem (Nível Pleno)
- Com o objetivo de encontrar registros de forma simples, no topo da `HomeScreen`, declaramos um `TextInput`. Usando manipulação de array no JavaScript (`.filter()`), toda a lista carregada do `JSON Server` passa por uma verificação toda vez que o estado primário da pesquisa muda. O método foi normalizado pelo `.toLowerCase()` no dado original e no texto digitado ("RafaEl" encontra "Rafael"), sendo imune a cases do teclado retornando o output dinamicamente ao `FlatList`.

### 3. Tratamento de Erros e Feedback de Carregamento (Nível Sênior)
- Chamadas de rede nunca são imediatas e dependem do estado do servidor. Ao invés da tela base continuar vazia para o usuário "congelada", o consumo assíncrono à API base e a atribuição local das listas foram encapsulados entre lógicas imperativas de exceção (`try/catch/finally`). 
- **Loading UI:** Por padrão o estado local `loading` é preenchido com _true_. O bloco desliga no comando `finally` exibindo graciosamente um `<ActivityIndicator>`. 
- **Erro de Conexão:** Caso a requisição esbarre com o servidor desligado na porta 3000 ou falha na rota externa, o comando salta para o `catch` que imediatamente acusa via Renderização Condicional o texto estilizado em vermelho reportando erro na disponibilidade.
- *(Otimização UX)*: Por conta das mecânicas intrínsecas do Expo Navigation, atualizamos a regra do uso de life-cycles (Hooks). As requisições à API foram remapeadas do tradicional `useEffect`, para escutar o `useFocusEffect` (`@react-navigation/native`), instruindo o React a relidar os novos itens não apenas uma vez na montagem de tela, mas para recarregar com exatidão dados que foram instanciados a cada retorno do botão _"Save"_ ou _"Update"_.
