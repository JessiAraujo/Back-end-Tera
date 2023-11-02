import cookieParser from "cookie-parser";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import multer from "multer";
import jwt from "jsonwebtoken";

const SECRET = "564581565468126";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 4000;

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("views"));
app.use("/uploads", express.static("uploads"));
app.set("view engine", "ejs");

mongoose.connect(
  "mongodb+srv://jessiiaaraujo:P0oWd6wj1QyDs4zl@cluster0.bq93zt3.mongodb.net/users",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const Usuario = mongoose.model("Usuario", {
  nome: String,
  email: String,
  senha: String,
  foto: String,
});

app.get("/cadastro.html", (req, res) => {
  res.sendFile(__dirname + "/views/cadastro.html");
});

app.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(req.body.senha, 10);

    const novoUsuario = new Usuario({ nome, email, senha: hashedPassword });
    await novoUsuario.save();
    res.cookie("nomeUsuario", nome, { httpOnly: true });
    res.redirect(`/login?nome=${nome}`);

    // res.redirect("/login");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erro ao cadastrar o usuário.");

  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await Usuario.find();

    res.json(usuarios);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erro ao buscar usuários.");
  }
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/views/login.html");
});

app.post("/login", async (req, res) => {
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

    // Se o login for bem-sucedido, gera um token JWT
    const token = jwt.sign({ id: usuario._id }, SECRET, { expiresIn: "300s" });

    // Define o token como um cookie
    res.cookie("token", token, { httpOnly: true });

    console.log(
      "Antes do redirecionamento para /perfil então até aqui está ok"
    );

    res.redirect("/perfil");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erro ao fazer login.");
  }
});

app.use("/uploads", express.static("uploads"));

app.get("/perfil", verificaToken, (req, res) => {
  app.get("/perfil", verificaToken, async (req, res) => {
    try {
      const usuario = await Usuario.findById(req.userId);
    
      if (!usuario) {
        return res.status(404).send("Usuário não encontrado");
      }
  
      const nomeUsuario = req.query.nome || usuario.nome;
      const fotoUsuario = req.query.foto || usuario.foto;
  
      res.render(__dirname + "/views/perfil.html", { nomeUsuario, fotoUsuario });
  

  
    } catch (error) {
      console.error(error);
      return res.status(500).send("Erro ao carregar perfil.");
    }
  });
  
  console.log("para verificar se perfil esta ok");

  res.sendFile(__dirname + "/views/perfil.html");
});

app.post("/perfil", (req, res) => {});


app.get("/escolha", (req, res) => {
  res.sendFile(__dirname + "/views/escolha.html");
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Pasta onde as imagens serão salvas
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });


function verificaToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    console.log("Token não encontrado, redirecionando para /escolha");
    res.clearCookie("token");
    return res.status(401).json({
      message: "Token não fornecido",
    });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        console.log("Token expirado, redirecionando para /escolha");
        res.clearCookie("token");
        return res.status(401).json({
          message: "Token expirado",
        });
      } else {
        return res.status(403).json({
          message: "Token inválido",
        });
      }
    }

    req.userId = decoded.id;
    next();
  });
}


app.get("/configuracao", (req, res) => {
  res.sendFile(__dirname + "/views/configuracao.html");
});

app.post("/atualizar-perfil", verificaToken, async (req, res) => {
  const { nome } = req.body;

  try {
    await Usuario.findByIdAndUpdate(req.userId, { nome });
    res.redirect("/perfil");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erro ao atualizar o perfil.");
  }
});


app.post(
  "/atualizar-foto",
  verificaToken,
  upload.single("foto"),
  async (req, res) => {
    try {
      if (req.fileValidationError) {
        return res
          .status(400)
          .send("Erro no upload da imagem: " + req.fileValidationError);
      } else if (!req.file) {
        return res.status(400).send("Nenhuma imagem foi selecionada.");
      }

      const filePath = req.file.path;
      await Usuario.findByIdAndUpdate(req.userId, { foto: filePath });

      res.redirect("/perfil");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Erro ao salvar a nova foto de perfil.");
    }
  }
);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export default app;
