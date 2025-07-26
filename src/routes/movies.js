const express = require("express");
const { runQuery, getQuery, allQuery } = require("../database/database");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      genre = "",
      releaseFrom = "",
      releaseTo = "",
      minRating = "",
      maxRating = "",
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = ["m.user_id = ?"];
    let params = [req.user.id];

    if (search) {
      whereConditions.push("m.title LIKE ?");
      params.push(`%${search}%`);
    }

    if (genre) {
      whereConditions.push(
        "EXISTS (SELECT 1 FROM movie_genres mg WHERE mg.movie_id = m.id AND mg.genre_id = ?)"
      );
      params.push(genre);
    }

    if (releaseFrom) {
      whereConditions.push("m.release_date >= ?");
      params.push(releaseFrom);
    }
    if (releaseTo) {
      whereConditions.push("m.release_date <= ?");
      params.push(releaseTo);
    }

    if (minRating) {
      whereConditions.push("m.vote_average >= ?");
      params.push(parseFloat(minRating));
    }
    if (maxRating) {
      whereConditions.push("m.vote_average <= ?");
      params.push(parseFloat(maxRating));
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const moviesQuery = `
      SELECT m.*, GROUP_CONCAT(g.name) as genres
      FROM movies m 
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      ${whereClause}
      GROUP BY m.id
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT m.id) as total
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      ${whereClause}
    `;

    const movies = await allQuery(moviesQuery, [
      ...params,
      parseInt(limit),
      offset,
    ]);
    const countResult = await getQuery(countQuery, params);
    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    const formattedMovies = movies.map((movie) => ({
      ...movie,
      genre_names: movie.genres ? movie.genres.split(",") : [],
    }));

    res.json({
      movies: formattedMovies,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Erro ao listar filmes:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await getQuery(
      `
      SELECT m.*, GROUP_CONCAT(g.id || ':' || g.name) as genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE m.id = ? AND m.user_id = ?
      GROUP BY m.id
    `,
      [id, req.user.id]
    );

    if (!movie) {
      return res.status(404).json({ error: "Filme não encontrado" });
    }

    const genreList = movie.genres
      ? movie.genres.split(",").map((g) => {
          const [genreId, genreName] = g.split(":");
          return { id: parseInt(genreId), name: genreName };
        })
      : [];

    res.json({
      ...movie,
      genre_list: genreList,
    });
  } catch (error) {
    console.error("Erro ao buscar filme:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      title,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      vote_average = 0,
      popularity = 0,
      genre_ids = [],
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Título é obrigatório" });
    }

    const result = await runQuery(
      `
      INSERT INTO movies (title, overview, poster_path, backdrop_path, release_date, vote_average, popularity, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        title,
        overview,
        poster_path,
        backdrop_path,
        release_date,
        vote_average,
        popularity,
        req.user.id,
      ]
    );

    const movieId = result.id;

    if (genre_ids.length > 0) {
      for (const genreId of genre_ids) {
        await runQuery(
          "INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)",
          [movieId, genreId]
        );
      }
    }

    const newMovie = await getQuery(
      `
      SELECT m.*, GROUP_CONCAT(g.name) as genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE m.id = ?
      GROUP BY m.id
    `,
      [movieId]
    );

    res.status(201).json({
      message: "Filme criado com sucesso",
      movie: {
        ...newMovie,
        genre_names: newMovie.genres ? newMovie.genres.split(",") : [],
      },
    });
  } catch (error) {
    console.error("Erro ao criar filme:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      overview,
      poster_path,
      backdrop_path,
      release_date,
      vote_average,
      popularity,
      genre_ids = [],
    } = req.body;

    const existingMovie = await getQuery(
      "SELECT id FROM movies WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (!existingMovie) {
      return res.status(404).json({ error: "Filme não encontrado" });
    }

    await runQuery(
      `
      UPDATE movies 
      SET title = ?, overview = ?, poster_path = ?, backdrop_path = ?, 
          release_date = ?, vote_average = ?, popularity = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `,
      [
        title,
        overview,
        poster_path,
        backdrop_path,
        release_date,
        vote_average,
        popularity,
        id,
        req.user.id,
      ]
    );

    await runQuery("DELETE FROM movie_genres WHERE movie_id = ?", [id]);

    if (genre_ids.length > 0) {
      for (const genreId of genre_ids) {
        await runQuery(
          "INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)",
          [id, genreId]
        );
      }
    }

    const updatedMovie = await getQuery(
      `
      SELECT m.*, GROUP_CONCAT(g.name) as genres
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.movie_id
      LEFT JOIN genres g ON mg.genre_id = g.id
      WHERE m.id = ?
      GROUP BY m.id
    `,
      [id]
    );

    res.json({
      message: "Filme atualizado com sucesso",
      movie: {
        ...updatedMovie,
        genre_names: updatedMovie.genres ? updatedMovie.genres.split(",") : [],
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar filme:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existingMovie = await getQuery(
      "SELECT id FROM movies WHERE id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (!existingMovie) {
      return res.status(404).json({ error: "Filme não encontrado" });
    }

    await runQuery("DELETE FROM movies WHERE id = ? AND user_id = ?", [
      id,
      req.user.id,
    ]);

    res.json({ message: "Filme deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar filme:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

router.get("/utils/genres", async (req, res) => {
  try {
    const genres = await allQuery("SELECT * FROM genres ORDER BY name");
    res.json({ genres });
  } catch (error) {
    console.error("Erro ao listar gêneros:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = router;
