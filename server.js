import express, { json } from "express";
import jwt from "jsonwebtoken";
import usuarios from "./usuarios.js";
import informacoes from "./informações.js";
import unidades_metricas from "./unidade_metricas.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;
app.use(express.json());

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const usuario = usuarios.find(
    (user) => user.username === username && user.password === password,
  );

  if (usuario) {
    const token = jwt.sign(
      { id: usuario.id, username: usuario.username, role: usuario.role },
      SECRET_KEY,
      { expiresIn: "1h" },
    );
    res.status(201).json({ token });
  } else {
    res.status(401).json({ message: "Usuario ou senha inválidos" });
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const usuario = usuarios.find(
    (user) => user.username === username && user.password === password,
  );

  if (usuario) {
    const token = jwt.sign(
      { id: usuario.id, username: usuario.username, role: usuario.role },
      SECRET_KEY,
      { expiresIn: "1h" },
    );
    res.status(201).json({ token });
  } else {
    res.status(401).json({ message: "Usuario ou senha inválidos" });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "Token não fornecido" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });

    req.user = user;
    console.log(user);
    next();
  });
};

app.get("/informacoes", authenticateToken, (req, res) => {
  res.status(200).send(informacoes);
});

app.get("/admin", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acesso negado" });
  }
  res.status(200).send(unidades_metricas);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
