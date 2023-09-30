
import cookieParser from 'cookie-parser';
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt";
import multer from 'multer';
import jwt from "jsonwebtoken"

const SECRET = '564581565468126';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 4000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.set('view engine', 'ejs');


mongoose.connect(
    'mongodb+srv://jessiiaaraujo:P0oWd6wj1QyDs4zl@cluster0.bq93zt3.mongodb.net/users', 
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const Usuario = mongoose.model('Usuario', {
    nome: String,
    email: String,
    senha: String,
    foto: String,
  });


app.get('/cadastro.html', (req, res) => {
      res.sendFile(__dirname + '/views/cadastro.html');
    });





app.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(req.body.senha, 10); 

    const novoUsuario = new Usuario({ nome, email, senha: hashedPassword });
    await novoUsuario.save();
  console.log("teste");

    res.redirect('/login');

  } catch (error) {
    console.error(error);
    return res.status(500).send("Erro ao cadastrar o usuário.");
  }
});



app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find(); 
   
    res.json(usuarios); 
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erro ao buscar usuários.");
  }
});


app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
  });

  

 

  app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).send('Usuário não encontrado');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).send('Senha incorreta');
    }

    // Se o login for bem-sucedido, gera um token JWT
    const token = jwt.sign({ id: usuario._id }, SECRET, { expiresIn: '5s' });

    // Define o token como um cookie
    res.cookie('token', token, { httpOnly: true });

    console.log('Antes do redirecionamento para /perfil então até aqui está ok');

    res.redirect('/perfil');

    } catch (error) {
      console.error(error);
      return res.status(500).send("Erro ao fazer login.");
    }
  });
 


    
    
// Middleware para verificar o token JWT
function verificaToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Token não fornecido",
    });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Token expirado, redirecionar para a página de login
        return res.redirect('/login');
      } else {
        // Outro erro ao verificar o token
        return res.status(403).json({
          message: "Token inválido",
        });
      }
    }

    req.userId = decoded.id;
    next();
  });
}



app.use('/uploads', express.static('uploads'));

   
// app.get('/perfil', verificaToken, (req, res) => {
//   // vai poder acessar req.userId - req.id para saber qual usuário está logado
//   res.sendFile(__dirname + '/views/perfil.html');
// });
    
app.get('/perfil',verificaToken, (req, res) => {
  //prossegue se o token for válido
  //cookie incluido no redirecionamento pro perfil
  // da p acessar req.userId - req.id para saber qual usuário está logado
  res.sendFile(__dirname + '/views/perfil.html');
});



app.post('/perfil', (req, res) => {

});

   // essa rota é pra exibir a escolha do usuário
   app.get('/escolha', verificaToken, (req, res) => {
    // apos expirar escolher continuar logado ou fazer login novamente
    res.sendFile(__dirname + '/views/escolha.html');
  });

  

app.get('/configuracao', (req, res) => {
  res.sendFile(__dirname + '/views/configuracao.html');
});

// Configuração do multer para salvar as imagens em um diretório no servidor
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Pasta onde as imagens serão salvas
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  },
});

const upload = multer({ storage: storage });

/// Rota para processar o upload da nova foto de perfil
app.post('/perfil', verificaToken, upload.single('foto'), async (req, res) => {
  try {
    // Verificar se houve um erro durante o upload
    if (req.fileValidationError) {
      return res.status(400).send('Erro no upload da imagem: ' + req.fileValidationError);
    } else if (!req.file) {
      return res.status(400).send('Nenhuma imagem foi selecionada.');
    }

    // O upload foi bem-sucedido, você pode salvar o caminho do arquivo no banco de dados
    const filePath = req.file.path;

    // Atualizar a propriedade 'foto' no usuário com o novo caminho do arquivo
    await Usuario.findByIdAndUpdate(req.userId, { foto: filePath });

    // Redirecionar de volta para a página de perfil
    res.redirect('/perfil');
    // res.send('<script>window.location.href = "/perfil";</script>');

  } catch (error) {
    console.error(error);
    return res.status(500).send("Erro ao salvar a nova foto de perfil.");
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export default app;

