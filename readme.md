# API AGNES

## Instalação

Entre na pasta do oprojeto e utilize o instalador de pacotes Yarn.

```bash
yarn install
```

## Para rodar

Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis

```bash
MONGODB_URI = URL DO BANCO DE DADOS
SECRET_KEY = CHAVE PARA GERAÇÃO DE SENHAS ÚNICAS
```

Em seguida, basta rodar

```bash
yarn start:dev
```

para iniciar o servidor em modo de desenvolvimento (ou seja, ele irá observar mudanças no código e reiniciar a cada mudança. Você também pode rodar o 

```bash
yarn start
```
