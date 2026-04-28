# Samuel Solana Bootcamp Prodabel

Este repositório contém dois projetos Anchor para Solana:

- `contador`: um programa simples de contador que inicializa e incrementa um valor armazenado na blockchain.
- `sendsol`: um programa de cadastro de usuário e transferência de SOL usando contas PDA.

## Estrutura do repositório

- `contador/`
  - Projeto Anchor que implementa um contador on-chain.
  - Contém um programa Rust em `programs/contador/src` e testes em `tests/contador.ts`.
- `sendsol/`
  - Projeto Anchor que registra usuários e permite transferências de SOL.
  - Contém um programa Rust em `programs/sendsol/src` e testes em `tests/sendsol.ts`.

## `contador`

### Funcionalidade

- `inicializar`: cria a conta `Contador` com valor inicial `0`.
- `incrementar`: aumenta o valor do contador em `1`.

### Como usar

1. Acesse o diretório:
   ```bash
   cd contador
   ```
2. Instale dependências:
   ```bash
   npm install
   ```
3. Rode os testes:
   ```bash
   npm test
   ```

### Notas

- Usa `@coral-xyz/anchor`.
- O programa é identificado em `Anchor.toml` como `2GWJNatGfyBNEnRrp3PAm91ZAYNr46qGkm96Y5xj5x3D` para `localnet`.

## `sendsol`

### Funcionalidade

- `registrar_usuario(nome)`: cria uma conta de usuário usando um PDA derivado de `["usuario", nome]`.
- `transferir(valor)`: transfere SOL do remetente para um destinatário, validando que o valor seja maior que zero.

### Como usar

1. Acesse o diretório:
   ```bash
   cd sendsol
   ```
2. Instale dependências:
   ```bash
   yarn install
   ```
3. Rode os testes:
   ```bash
   yarn test
   ```

### Notas

- Usa `@anchor-lang/core` e `@coral-xyz/anchor`.
- O programa é identificado em `Anchor.toml` como `2sHW7DmHBzu75ZHWgxLg5bWudJ4nxy5VYWVUWhktLGng` para `localnet`.
- Validações de usuário:
  - nome mínimo de 3 caracteres
  - nome máximo de 50 caracteres
  - valor de transferência maior que zero

## Pré-requisitos

- Solana CLI (`solana`)
- Anchor CLI
- Node.js
- npm e yarn
- Carteira local em `~/.config/solana/id.json`

## Recomendações para desenvolvimento

1. Inicialize o validador local:
   ```bash
   solana-test-validator --reset
   ```
2. Em outro terminal, execute os testes no projeto desejado:
   ```bash
   cd contador && npm test
   ```
   ou
   ```bash
   cd sendsol && yarn test
   ```

## Observações

- Cada pasta é um projeto Anchor independente.
- Os testes usam `ts-mocha` para executar as interações com o programa.
- Atualize `Anchor.toml` caso mude a configuração de cluster ou as IDs do programa.
