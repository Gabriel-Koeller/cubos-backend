const express = require("express");
const bcrypt = require("bcryptjs");
const { runQuery, getQuery } = require("../database/database");
const { generateToken } = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validações básicas
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Nome, email e senha são obrigatórios" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "A senha deve ter pelo menos 6 caracteres" });
    }

    // Verificar se o email já existe
    const existingUser = await getQuery(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // Criptografar senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Criar usuário no banco
    const result = await runQuery(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, passwordHash]
    );

    // Gerar token
    const token = generateToken(result.id);

    // Buscar dados do usuário criado
    const user = await getQuery(
      "SELECT id, name, email FROM users WHERE id = ?",
      [result.id]
    );

    res.status(201).json({
      message: "Usuário cadastrado com sucesso",
      token,
      user,
    });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const user = await getQuery("SELECT * FROM users WHERE email = ?", [email]);
    if (!user) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const token = generateToken(user.id);

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    res.json({
      message: "Login realizado com sucesso",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "cubos_movies_jwt_secret_2024"
    );

    const user = await getQuery(
      "SELECT id, name, email FROM users WHERE id = ?",
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    res.json({ user });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }
    return res.status(401).json({ error: "Token inválido" });
  }
});

router.post("/logout", (req, res) => {
  res.json({ message: "Logout realizado com sucesso" });
});

module.exports = router;
