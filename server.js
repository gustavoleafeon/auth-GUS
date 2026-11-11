import express, { json } from "express";
import jwt from "jsonwebtoken";
import usuarios from "./usuarios.js";
import unidades from "./unidades.js";
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
