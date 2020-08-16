# Projeto: Dashboard em Real-Time

![Tecnologias](https://uploaddeimagens.com.br/images/002/831/765/original/tecnologias.png?1597539856)

### Objetivos

Este projeto tem como objetivo colocar em prática meus conhecimentos de desenvolvimento back-end e Node.js 
na criação de um dashboard em tempo real baseado em operações de CRUD relacionadas a lançamento de vendas.

O usuário terá a possibilidade de registra seus produtos, quais são suas categorias e fornecedores, e em seguida
registrar quais foram as vendas destes produtos, e a cada venda lançada, o dashboard principal será atualizado 
em tempo real conforme cada venda é lançada.

### Motivação

Minha motivação foi de juntar meus conhecimentos em desenvolvimento back-end e front-end com a análise de dados,
unindo as duas áreas na tentativa de entregar uma ferramenta que corresponde ao objetivo de muitos gestores e 
tomadores de decisão: saber o que está acontecendo na hora, em tempo real!

![Demonstração da Dashboard](https://im5.ezgif.com/tmp/ezgif-5-74a7fd55d93d.gif)

### Tecnologias

* Javascript ES6
* Node.js
* Express.js
* Socket.io
* MongoDB
* Handlebars
* Arquitetura de API REST e MVC
* HTML
* Materialize CSS
* Chart.js

### Instalação

Para instalar o projeto, execute o comando:

`yarn`

### Executando

Para executar o projeto, rode o comando:

`yarn start`

O projeto estará disponível no endereço: `http://localhost:8080`.

### Demonstração

No GIF abaixo, podemos ver a dashboard atualizando conforme são feitas
requisições ao back-end através do endpoint: `http://localhost:8080/atualizar-dados` (POST), em que
dispara o envio dos dado no back-end, gera-se um JSON que é emitido pelo Socket.io, e atualiza 
a dashboard conforme o listener do Socket.io no front-end.

![Demonstração Dashboard API Call](https://im5.ezgif.com/tmp/ezgif-5-0ed27eb99445.gif)

### Autor

### Victor Hugo Negrisoli
#### Desenvolvedor Full-Stack Pleno & Analista de Dados
