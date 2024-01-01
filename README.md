# auction-project

## Sumário

- [auction-project](#auction-project)
  - [Sumário](#sumário)
  - [Motivação](#motivação)
  - [Pilha de tecnologia](#pilha-de-tecnologia)

## Motivação

Este app é uma plataforma de leilão de artigos de tecnologia, onde a singularidade se manifesta na possibilidade de apenas um leilão ocorrer por vez. Oferecendo a todos os usuários a oportunidade de se tornarem leiloeiros, o processo se inicia quando o leiloeiro cadastra uma foto do item desejado, juntamente com seu nome, uma descrição detalhada e o lance inicial.

Assim que o leilão é iniciado, uma notificação instantânea é enviada a todos os usuários alertando sobre o início do leilão. Enquanto isso, nos bastidores, um servidor web socket entra em ação, receptivo aos lances oferecidos pelos participantes do leilão. Este processo dinâmico continua até que nenhum participante deseje mais oferecer lances e o leiloeiro anuncie oficialmente que o item está vendido.

O encerramento do leilão desencadeia a etapa de arquivamento, onde o artefato, o comprador e o último lance são registrados no banco de dados. A integração contínua do Firebase Storage garante que cada imagem associada ao leilão seja armazenada de forma segura e acessível.

Este foi o sexto repositório de código apresentado no [Curso Superior de TSI do IFMS](https://www.ifms.edu.br/campi/campus-aquidauana/cursos/graduacao/sistemas-para-internet/sistemas-para-internet) como requisito para obtenção da nota parcial das atividades da unidade curricular Linguagem de Programação IV.

| [&larr; Repositório anterior](https://github.com/mdccg/socket-demo) |
|-|

## Pilha de tecnologia

As seguintes tecnologias foram utilizadas para desenvolver este app:

| Papel | Tecnologia |
|-|-|
| Ambiente de execução | [Node](https://nodejs.org/en/) |
| Linguagem de programação | [TypeScript](https://www.typescriptlang.org/) |
| Framework de API | [Express](https://expressjs.com/pt-br/) |
| Tecnologia de mapeamento objeto-relacional | [TypeORM](https://typeorm.io/) |
| Banco de dados | [SQLite3](https://www.sqlite.org/) |
| Biblioteca de desenvolvimento front-end | [React](https://react.dev/) |
| Armazenamento de imagens | [Firebase Storage](https://firebase.google.com/docs/storage) |
| Biblioteca orientada a eventos | [Socket.IO](https://socket.io/) |