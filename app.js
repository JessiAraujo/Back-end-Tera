
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken"
const SECRET = 'jess';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const port = 4000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
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
        return res.status(401).send("Usuário não encontrado");
      }
  
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
  
      if (!senhaValida) {
        return res.status(401).send("Senha incorreta");
      }
  
      // retirei  o envio do token JSON pra tentar redirecionar
      // res.json({ token });
      console.log("Antes do redirecionamento para /perfil");
      res.redirect('/perfil');

    } catch (error) {
      console.error(error);
      return res.status(500).send("Erro ao fazer login.");
    }
  });
 


    
    
// Middleware para verificar o token JWT
// function verificaToken(req, res, next) {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({
//       message: "Token não fornecido",
//     });
//   }

//   jwt.verify(token, SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({
//         message: "Token inválido",
//       });
//     }

//     req.userId = decoded.id;
//     next();
//   });
// }
   
// app.get('/perfil', verificaToken, (req, res) => {
//   // vai poder acessar req.userId - req.id para saber qual usuário está logado
//   res.sendFile(__dirname + '/views/perfil.html');
// });
    
app.get('/perfil', (req, res) => {
  // vai poder acessar req.userId - req.id para saber qual usuário está logado
  res.sendFile(__dirname + '/views/perfil.html');
});



app.post('/perfil', (req, res) => {

});




app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export default app;

