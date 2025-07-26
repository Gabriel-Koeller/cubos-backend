# 🎬 Cubos Movies - Backend

API RESTful moderna para gerenciamento de filmes desenvolvida em Node.js com Express, SQLite e autenticação JWT, totalmente integrada com o frontend React.

## 🚀 Funcionalidades

- ✅ **Autenticação JWT**: Login, cadastro e logout de usuários
- ✅ **CRUD de Filmes**: Criar, listar, visualizar, editar e deletar filmes
- ✅ **Filtros Avançados**: Busca por título, gênero, data de lançamento e avaliação
- ✅ **Paginação**: Listagem de filmes com paginação (10 por página)
- ✅ **Permissões**: Usuários só podem ver/editar seus próprios filmes
- ✅ **Validações**: Validação de dados de entrada e sanitização
- ✅ **Segurança**: Helmet, CORS, rate limiting e hash de senhas
- ✅ **Integração Frontend**: Totalmente conectado com aplicação React
- ✅ **Dados Ricos**: Base de dados populada com 16 filmes diversos

## 📊 Base de Dados

O sistema inclui uma base de dados robusta com:

- **16 filmes** populares incluindo Avatar, Pantera Negra, Homem-Aranha, etc.
- **Múltiplos gêneros** (Ação, Ficção Científica, Aventura, Drama, etc.)
- **Usuário de teste** pré-configurado
- **Relações de gêneros** para cada filme
- **Metadados completos** (avaliações, popularidade, datas de lançamento)

## 📋 Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**

## 🔧 Instalação e Configuração

1. **Instale as dependências:**
   ```bash
   cd cubos-backend
   npm install
   ```

2. **Configure o banco de dados:**
   ```bash
   npm run setup
   ```
   Este comando irá:
   - Criar as tabelas no banco SQLite
   - Popular com 16 filmes de exemplo
   - Criar usuário de teste com credenciais padrão
   - Configurar relações de gêneros

3. **Inicie o servidor:**
   ```bash
   # Desenvolvimento (com hot reload)
   npm run dev

   # Produção
   npm start
   ```

4. **Servidor disponível em:**
   ```
   http://localhost:3001
   ```

## 🔐 Credenciais de Teste

Para acessar a aplicação use:

- **📧 Email:** `admin@exemplo.com`
- **🔑 Senha:** `123456`

## 📚 Documentação da API

### 🌐 Base URL
```
http://localhost:3001/api
```

### 🔒 Rotas de Autenticação

#### POST `/auth/register`
Cadastra um novo usuário no sistema.

**Body:**
```json
{
  "name": "Nome do Usuário",
  "email": "email@exemplo.com",
  "password": "senha123"
}
```

**Resposta (201):**
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 2,
    "name": "Nome do Usuário",
    "email": "email@exemplo.com"
  }
}
```

#### POST `/auth/login`
Realiza autenticação do usuário.

**Body:**
```json
{
  "email": "admin@exemplo.com",
  "password": "123456"
}
```

**Resposta (200):**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin Teste",
    "email": "admin@exemplo.com"
  }
}
```

#### GET `/auth/verify`
Verifica se o token JWT é válido.

**Headers:**
```
Authorization: Bearer seu_jwt_token
```

**Resposta (200):**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "name": "Admin Teste",
    "email": "admin@exemplo.com"
  }
}
```

#### POST `/auth/logout`
Realiza logout do usuário (invalida token).

**Headers:**
```
Authorization: Bearer seu_jwt_token
```

### 🎬 Rotas de Filmes

> **⚠️ Importante:** Todas as rotas de filmes requerem autenticação via JWT token no header `Authorization: Bearer token`.

#### GET `/movies`
Lista filmes com filtros opcionais e paginação.

**Query Parameters:**
- `page` (número): Página atual (padrão: 1)
- `limit` (número): Itens por página (padrão: 10, máximo: 50)
- `search` (string): Busca por título do filme
- `genre` (número): Filtrar por ID do gênero
- `releaseFrom` (data): Data mínima de lançamento (YYYY-MM-DD)
- `releaseTo` (data): Data máxima de lançamento (YYYY-MM-DD)
- `minRating` (número): Avaliação mínima (0-10)
- `maxRating` (número): Avaliação máxima (0-10)

**Exemplo de Requisição:**
```
GET /api/movies?page=1&limit=10&search=avatar&genre=878&minRating=7
```

**Resposta (200):**
```json
{
  "movies": [
    {
      "id": 1,
      "title": "Avatar: O Caminho da Água",
      "overview": "Mais de uma década depois dos eventos...",
      "poster_path": "https://image.tmdb.org/t/p/w500/...",
      "backdrop_path": "https://image.tmdb.org/t/p/w1280/...",
      "release_date": "2022-12-14",
      "vote_average": 7.7,
      "popularity": 2547.855,
      "genre_names": ["Ficção científica", "Aventura", "Fantasia"],
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 16,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### GET `/movies/:id`
Busca filme específico por ID.

**Resposta (200):**
```json
{
  "id": 1,
  "title": "Avatar: O Caminho da Água",
  "overview": "Descrição completa do filme...",
  "poster_path": "https://image.tmdb.org/t/p/w500/...",
  "backdrop_path": "https://image.tmdb.org/t/p/w1280/...",
  "release_date": "2022-12-14",
  "vote_average": 7.7,
  "popularity": 2547.855,
  "genre_names": ["Ficção científica", "Aventura", "Fantasia"],
  "genre_ids": [878, 12, 14],
  "user_id": 1,
  "created_at": "2024-01-15T10:30:00.000Z",
  "updated_at": "2024-01-15T10:30:00.000Z"
}
```

#### POST `/movies`
Cria um novo filme.

**Body:**
```json
{
  "title": "Novo Filme",
  "overview": "Descrição do filme...",
  "poster_path": "https://exemplo.com/poster.jpg",
  "backdrop_path": "https://exemplo.com/backdrop.jpg",
  "release_date": "2024-01-15",
  "vote_average": 8.5,
  "popularity": 1500.0,
  "genre_ids": [28, 12, 878]
}
```

#### PUT `/movies/:id`
Atualiza filme existente (apenas filmes do usuário autenticado).

#### DELETE `/movies/:id`
Remove filme (apenas filmes do usuário autenticado).

#### GET `/movies/utils/genres`
Lista todos os gêneros disponíveis.

**Resposta (200):**
```json
[
  { "id": 28, "name": "Ação" },
  { "id": 12, "name": "Aventura" },
  { "id": 16, "name": "Animação" },
  { "id": 35, "name": "Comédia" },
  { "id": 18, "name": "Drama" },
  { "id": 878, "name": "Ficção científica" }
]
```

## 🗂️ Estrutura do Projeto

```
cubos-backend/
├── src/
│   ├── database/
│   │   ├── database.js      # Configuração e conexão SQLite
│   │   ├── migrate.js       # Scripts de criação de tabelas
│   │   └── seed.js          # Dados iniciais (16 filmes + usuário)
│   ├── middleware/
│   │   └── auth.js          # Middleware de autenticação JWT
│   ├── routes/
│   │   ├── auth.js          # Rotas de autenticação
│   │   └── movies.js        # Rotas CRUD de filmes
│   └── server.js            # Servidor Express principal
├── database.sqlite          # Banco de dados SQLite (gerado)
├── package.json             # Dependências e scripts
└── README.md               # Esta documentação
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento com hot reload (nodemon)
npm run dev

# Produção
npm start

# Configuração inicial completa
npm run setup

# Apenas criar tabelas
npm run migrate

# Apenas popular dados
npm run seed

# Limpar e recriar banco
npm run reset
```

## 🔍 Testando a API

### 🔧 Ferramentas Recomendadas:
- **Postman** - Interface gráfica completa
- **Insomnia** - Alternativa ao Postman
- **Thunder Client** - Extensão do VS Code
- **curl** - Linha de comando

### 💡 Exemplo com curl:

1. **Fazer Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@exemplo.com","password":"123456"}'
```

2. **Listar Filmes (com token):**
```bash
curl -X GET http://localhost:3001/api/movies \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

3. **Buscar com Filtros:**
```bash
curl -X GET "http://localhost:3001/api/movies?search=avatar&genre=878" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🌐 Integração com Frontend

### ✅ Status da Integração:
O backend está **totalmente integrado** com o frontend React e funcionando em produção.

### 🔗 Configurações CORS:
- Frontend permitido: `http://localhost:5173`
- Headers aceitos: `Content-Type, Authorization`
- Métodos permitidos: `GET, POST, PUT, DELETE, OPTIONS`

### 📝 Exemplo de Uso no Frontend:
```javascript
// Configuração do cliente Axios
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor automático para JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Exemplo de uso
const movies = await apiClient.get('/movies?page=1&limit=10');
```

## 🎯 Status Atual do Projeto

- ✅ **Servidor Express** configurado e otimizado
- ✅ **Autenticação JWT** completa e segura
- ✅ **CRUD de usuários** implementado
- ✅ **CRUD de filmes** totalmente funcional
- ✅ **Sistema de filtros** avançado
- ✅ **Paginação** eficiente
- ✅ **Base de dados** rica (16 filmes)
- ✅ **Integração frontend** 100% funcional
- ✅ **Segurança** (CORS, Helmet, Rate Limiting)
- ✅ **Validações** robustas de entrada
- ⏳ **Testes automatizados** (planejado)
- ⏳ **Deploy em produção** (planejado)
- ⏳ **Documentação OpenAPI/Swagger** (planejado)

## 🔐 Segurança Implementada

- **🔒 JWT Authentication** - Tokens seguros com expiração
- **🛡️ CORS** - Proteção contra requisições não autorizadas
- **🔐 Bcrypt** - Hash seguro de senhas
- **⚡ Rate Limiting** - Proteção contra ataques de força bruta
- **🧹 Helmet** - Headers de segurança HTTP
- **✅ Sanitização** - Limpeza de dados de entrada
- **👤 Autorização** - Usuários só acessam seus próprios dados

## 🚀 Próximos Passos

- [ ] **Swagger/OpenAPI** - Documentação interativa da API
- [ ] **Testes automatizados** - Jest + Supertest
- [ ] **Docker** - Containerização da aplicação
- [ ] **CI/CD** - Pipeline de deploy automatizado
- [ ] **Logs estruturados** - Winston para logging
- [ ] **Métricas** - Monitoramento de performance
- [ ] **Cache Redis** - Cache de consultas frequentes
- [ ] **Upload de arquivos** - Sistema de upload de posters

## 🤝 Como Contribuir

1. Faça um **fork** do projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um **Pull Request**

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**🎬 Cubos Movies Backend - Desenvolvido em Node.js**