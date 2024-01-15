# Ília - Desafio Técnico

## Autor: Bartolomeu Spegiorin Gusella

## Como rodar o projeto 

### Pela 1ª vez
com o docker instalado, rode o comando
```
docker compose build 
```
depois rode este comando
```
docker compose up
```
O comando `compose up` vai subir 2 containers, a aplicação e o banco de dados MySQL

Agora vamos rodar a migração para criar a tabela do sistema. Primeiro precisamos saber o nome do conteiner da aplicação, neste caso o projeto foi clonado para a pasta `desafio-ilia`, então ao rodar o comando

```
docker ps
```
Exibe-se a seguinte saída

```
CONTAINER ID   IMAGE              COMMAND                  CREATED         STATUS         PORTS                                                  NAMES
98f1e1cd5535   desafio-ilia-api   "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp              desafio-ilia-api-1
4d6415df752c   mysql:8.0.28       "docker-entrypoint.s…"   30 hours ago    Up 2 minutes   0.0.0.0:3306->3306/tcp, :::3306->3306/tcp, 33060/tcp   desafio-ilia-mysqldb-1
```

Note que o conteiner da imagem `desafio-ilia-api` ganhou o nome `desafio-ilia-api-1`,
então rode o comando trocando `<mycontainer>` pelo nome recebido no comando anterior, neste caso `desafio-ilia-api-1`

```
docker exec -it <mycontainer> bash

docker exec -it desafio-ilia-api-1 base
```
Logo você estará dentro do conteiner, basta rodar o comando para criar as tabelas

```
npm run typeorm:run-migrations
```

Procedendo desta maneira, os conteiners estão criados e em execução, cujo acesso se dá pelo swagger da api pelo http://localhost:3000/api

Para sair do terminal use o comando `exit` ou `ctrl+C`

### Rodando o projeto nas vezes seguinte
Depois de rodar o build no compose e a migração, basta usar o comando na pasta do projeto

```
docker compose up
```

## Considerações
Alguns dados ficam subentendidos, como quantidade de dias a ser trabalhado no mês
(calcula feriado?)
Neste caso usei o valor `22`.

Usei o valor absoluto `8` como padrão para horas trabalhadas por dia

### Usuário

O arquivo api.yml não fez nenhuma menção ao funcionário/usuário. Usualmente, não há sentido um sistema de folha de ponto que não tem uma entidade usuário/funcionário. Portanto pressupõe-se que o usuário está logado no sistema e que informa seu ID *(numérico) no cabeçalho da requisição no campo `profile`. Não foi feita nenhuma validação deste campo, pois subentende-se que em um projeto real seria utilizado um JWT para trafegar a informação criptografada, de forma segura e com prazo de expiração

### README.MD antigo

O conteúdo anteior deste arquivo pode ser encontrado no arquivo `INITIAL_INSTRUCTIONS.md`