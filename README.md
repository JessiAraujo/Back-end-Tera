# Back-end-Tera


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
