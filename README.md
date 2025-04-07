# Comunicação gRPC entre APIs NestJS

Este projeto demonstra a implementação de comunicação gRPC entre microserviços NestJS em uma arquitetura de monorepo usando Turborepo.

## Estrutura do Projeto

```
├── packages/
│   └── shared/             # Código compartilhado entre os serviços
├── apps/
│   ├── grpc-client/        # API cliente que consome serviços gRPC
│   └── grpc-server/        # API servidor que fornece serviços gRPC
├── README.md
└── package.json
```

## Packages Compartilhados

### packages/shared

Este diretório contém código que é compartilhado entre todos os microserviços do projeto, evitando duplicação e garantindo consistência.

#### DTOs (Data Transfer Objects)

- **NotificationResponseDTO**: Representa a resposta retornada pelo serviço de notificação
  ```typescript
  export class NotificationResponseDTO {
    constructor(
      public id: number,
      public message: string,
      public date: string,
    ) {}
  }
  ```

- **UserDTO**: Representa informações de usuário enviadas para o serviço
  ```typescript
  export class UserDTO {
    name: string;
  }
  ```

#### Interfaces

- **GRPCNotificationInterface**: Define o contrato de comunicação entre o cliente e o servidor
  ```typescript
  export interface GRPCNotificationInterface {
    run(user: UserDTO): Observable<NotificationResponseDTO>;
  }
  ```

#### Proto Files

- **interface.proto**: Define o contrato gRPC utilizando Protocol Buffers
  ```protobuf
  syntax = "proto3";

  package interface;

  service NotificationService {
    rpc run(UserDTO) returns (NotificationResponseDTO) {}
  }

  message UserDTO {
    string name = 1;
  }

  message NotificationResponseDTO {
    int32 id = 1;
    string message = 2;
    string date = 3;
  }
  ```

## Aplicações

### apps/grpc-client

Este serviço atua como cliente gRPC, consumindo os serviços disponibilizados pelo servidor.

#### Componentes Principais

- **NotificationService**: Serviço que encapsula a lógica de comunicação gRPC
  - Inicializa o cliente gRPC durante a inicialização do módulo
  - Fornece métodos que encaminham chamadas para o servidor

- **NotificationModule**: Módulo que configura o cliente gRPC
  - Registra o cliente gRPC com as configurações apropriadas (URL, caminho do proto, etc.)
  - Exporta o serviço para ser usado por outros módulos

- **AppController**: Controller que expõe endpoints REST que internamente utilizam o serviço gRPC
  - Endpoint `/notification` que recebe parâmetros via query e encaminha para o serviço gRPC

### apps/grpc-server

Este serviço atua como servidor gRPC, fornecendo implementações de serviços que podem ser consumidos remotamente.

#### Componentes Principais

- **NotificationService**: Implementa os métodos definidos no arquivo proto
  - Método `run` que recebe um UserDTO e retorna um NotificationResponseDTO

- **NotificationModule**: Módulo que registra o serviço
  - Disponibiliza o serviço para ser exposto como gRPC

- **Main.ts**: Configura o servidor gRPC
  - Define o transporte gRPC
  - Configura o path para o arquivo proto
  - Define a URL e porta de escuta

## Comparativo: gRPC vs REST/JSON

| Característica | gRPC | REST/JSON |
|----------------|------|-----------|
| **Protocolo** | HTTP/2 | HTTP/1.1 |
| **Formato** | Protocol Buffers (binário) | JSON (texto) |
| **Tamanho dos Dados** | Compacto (até 60-80% menor) | Maior overhead devido à natureza textual |
| **Velocidade** | Mais rápido devido à serialização binária e HTTP/2 | Mais lento devido ao parsing JSON e HTTP/1.1 |
| **Contratos** | Fortemente tipados via arquivo .proto | Geralmente documentação ou esquemas como OpenAPI |
| **Streaming** | Suporte nativo a streaming bidirecional | Limitado (precisa de WebSockets ou SSE) |
| **Latência** | Menor devido à multiplexação HTTP/2 | Maior devido às limitações do HTTP/1.1 |

### Vantagens do gRPC sobre REST/JSON

1. **Performance**: Comunicação significativamente mais rápida e eficiente
2. **Contratos Rígidos**: Interface definida claramente via Protocol Buffers
3. **Multiplexação**: Várias chamadas simultâneas em uma única conexão TCP
4. **Compatibilidade entre Linguagens**: Facilita integração entre serviços escritos em diferentes linguagens

## Processo de Serialização/Desserialização no gRPC

### 1. Definição do Contrato

O processo começa com a definição do contrato de comunicação no arquivo `.proto`, que especifica:
- Serviços e métodos disponíveis
- Estrutura exata das mensagens de entrada e saída
- Tipos de dados para cada campo

### 2. Geração de Código via Compilador de Protobuff

O compilador Protocol Buffers gera código específico para a linguagem escolhida:
- Classes para cada tipo de mensagem
- Métodos de serialização/desserialização
- Código boilerplate para cliente e servidor

### 3. Processo de Chamada do Cliente

1. **Preparação dos Dados**: O cliente preenche um objeto do tipo de mensagem de requisição
   ```typescript
   const user = new UserDTO();
   user.name = "Exemplo";
   ```

2. **Serialização**: O objeto é convertido em um formato binário compacto
   - Os campos são codificados usando técnicas eficientes de compressão
   - Apenas os dados são transferidos, sem metadados de estrutura

3. **Transporte**: Os dados binários são enviados através de HTTP/2
   - Aproveita recursos como compressão de cabeçalhos
   - Utiliza multiplexação para enviar múltiplas requisições em paralelo

### 4. Processo no Servidor

1. **Desserialização**: O servidor recebe os bytes e os converte de volta para objetos
   - Utiliza os stubs gerados para reconstruir o objeto
   - Validação automática dos tipos de dados

2. **Processamento**: O método implementado é executado com o objeto reconstruído
   ```typescript
   run(user: UserDTO): NotificationResponseDTO {
     return new NotificationResponseDTO(1, user.name, 'asd');
   }
   ```

3. **Serialização da Resposta**: O objeto de resposta é convertido em formato binário
   - Processo similar ao do cliente, mas na direção oposta

### 5. Recepção pelo Cliente

1. **Desserialização**: O cliente recebe os bytes da resposta e os converte em objeto
   - Novamente usando os stubs gerados pelo compilador Protocol Buffers

2. **Disponibilização**: O objeto é disponibilizado para a aplicação cliente

### Otimizações

- **Campos Opcionais**: Não são transmitidos quando vazios
- **Inteiros Variáveis**: Números pequenos ocupam menos bytes
- **Reutilização de Conexão**: HTTP/2 mantém conexões abertas para múltiplas chamadas
- **Streaming**: Permite iniciar o processamento antes de receber todos os dados

Esta arquitetura resulta em comunicação extremamente eficiente e tipada entre os serviços, essencial para sistemas distribuídos modernos.

<hr>
<br>
<br>
<br>

# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turbo.build/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/docs/reference/configuration)
- [CLI Usage](https://turbo.build/docs/reference/command-line-reference)
