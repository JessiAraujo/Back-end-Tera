# Back-end-Tera


Este código é uma aplicação Node.js que utiliza várias tecnologias para construir um sistema de cadastro, login e perfil de usuários. Vou resumir o uso de cada tecnologia presente no código:

Express: É um framework web para Node.js. Ele é utilizado para lidar com as rotas da aplicação, definir middlewares e simplificar a criação de APIs e aplicativos web.

Cookie-parser: Middleware utilizado para analisar os cookies anexados à solicitação HTTP. Neste código, é utilizado para lidar com cookies de autenticação e armazenar informações de sessão.

Body-parser: Middleware para analisar o corpo das solicitações HTTP. É usado neste código para analisar os corpos das solicitações POST enviadas ao servidor.

Mongoose: Uma biblioteca de modelagem de objetos MongoDB para Node.js. Facilita a interação com bancos de dados MongoDB ao fornecer uma estrutura baseada em esquemas para modelar os dados.

Bcrypt: Uma biblioteca de hashing de senhas utilizada para criptografar as senhas dos usuários antes de armazená-las no banco de dados.

Multer: Middleware para lidar com o upload de arquivos. Neste código, é usado para lidar com o upload de imagens de perfil dos usuários.

JWT (JSON Web Token): Utilizado para autenticação e autorização. Gera tokens assinados que podem ser verificados e decodificados para identificar o usuário autenticado.

EJS (Embedded JavaScript): Um mecanismo de modelo para JavaScript que permite gerar HTML com JavaScript simples. Neste código, é usado para renderizar as páginas HTML com dados dinâmicos.

Além disso, o código também utiliza o Node.js nativo para manipulação de arquivos e URLs.




INFORMAÇÃO POR ROTA
Rota /cadastro
Essa rota de cadastro é responsável por processar as informações enviadas pelo formulário de cadastro, garantindo que as senhas sejam armazenadas de forma segura (hash) e redirecionando o usuário para a página de login após o cadastro bem-sucedido.

Rota /login que lida com o envio do formulário de login e verifica as credenciais.

Rota /usuarios
Busca todos os usuários no banco de dados e retorna em formato JSON.


Rota /escolha
Esta tela é apresentada ao usuário quando a sessão expira. Ele tem a opção de continuar logado (verificando se a sessão ainda é válida- porém essa primeira opção ainda precisa ser desenvolvida) ou fazer login novamente(redireciona para o login- essa opção está funcionando). 
O JavaScript está usando a API `fetch` para realizar a verificação da sessão no servidor. 

Rota /atualizar-foto que processa o upload de uma nova foto de perfil usando o middleware `multer`.
Está salvando no banco de dados porém não consigo substituir pela imagem nova 

Acesse a URL do projeto 
https://jessiaraujo.github.io/Back-end-Tera/
