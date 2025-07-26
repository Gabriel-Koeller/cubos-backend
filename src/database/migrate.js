const { runQuery } = require("./database");

async function migrate() {
  try {
    console.log("🔄 Iniciando migração do banco...");

    await runQuery(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        overview TEXT,
        poster_path TEXT,
        backdrop_path TEXT,
        release_date DATE,
        vote_average REAL DEFAULT 0,
        popularity REAL DEFAULT 0,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS genres (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

    await runQuery(`
      CREATE TABLE IF NOT EXISTS movie_genres (
        movie_id INTEGER,
        genre_id INTEGER,
        PRIMARY KEY (movie_id, genre_id),
        FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
        FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE
      )
    `);

    const genres = [
      { id: 28, name: "Ação" },
      { id: 12, name: "Aventura" },
      { id: 16, name: "Animação" },
      { id: 35, name: "Comédia" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentário" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Família" },
      { id: 14, name: "Fantasia" },
      { id: 36, name: "História" },
      { id: 27, name: "Terror" },
      { id: 10402, name: "Música" },
      { id: 9648, name: "Mistério" },
      { id: 10749, name: "Romance" },
      { id: 878, name: "Ficção Científica" },
      { id: 10770, name: "Cinema TV" },
      { id: 53, name: "Thriller" },
      { id: 10752, name: "Guerra" },
      { id: 37, name: "Faroeste" },
    ];

    for (const genre of genres) {
      await runQuery("INSERT OR IGNORE INTO genres (id, name) VALUES (?, ?)", [
        genre.id,
        genre.name,
      ]);
    }

    console.log("✅ Migração concluída com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro na migração:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrate();
}

module.exports = { migrate };
