const bcrypt = require("bcryptjs");
const { runQuery, getQuery } = require("./database");

async function seed() {
  try {
    console.log("🌱 Iniciando seed do banco...");

    const passwordHash = await bcrypt.hash("123456", 10);

    const existingUser = await getQuery(
      "SELECT id FROM users WHERE email = ?",
      ["admin@exemplo.com"]
    );

    let userId;
    if (!existingUser) {
      const userResult = await runQuery(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        ["Admin Teste", "admin@exemplo.com", passwordHash]
      );
      userId = userResult.id;
      console.log("✅ Usuário de teste criado: admin@exemplo.com / 123456");
    } else {
      userId = existingUser.id;
      console.log("ℹ️  Usuário de teste já existe");
    }

    const movies = [
      {
        title: "Bumblebee",
        overview:
          "Em 1987, Bumblebee se refugia em um ferro-velho em uma pequena cidade praia da Califórnia. Charlie, que está prestes a fazer 18 anos e tentando encontrar seu lugar no mundo, descobre Bumblebee, destruído e quebrado. Quando Charlie o reanima, ela rapidamente descobre que este não é um VW Beetle amarelo comum.",
        poster_path:
          "https://media.themoviedb.org/t/p/w500/x9vAcoPsyFQ6m3Re5S9DQSbudyi.jpg",
        backdrop_path:
          "https://media.themoviedb.org/t/p/w1280/hMANgfPHR1tRObNp2oPiOi9mMlz.jpg",
        release_date: "2018-12-21",
        vote_average: 6.7,
        popularity: 1876.543,
        runtime: 115,
        revenue: 467220000,
        genre_ids: [28, 12, 878],
      },
      {
        title: "Avatar: O Caminho da Água",
        overview:
          "Mais de uma década depois dos eventos do primeiro filme, 'Avatar: O Caminho da Água' começa a contar a história da família Sully (Jake, Neytiri e seus filhos), o problema que os persegue, as medidas que tomam para se manter em segurança, as batalhas que lutam para se manter vivos e as tragédias que suportam.",
        poster_path:
          "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
        backdrop_path:
          "https://image.tmdb.org/t/p/w1280/s16H6tpK2utvwDtzZ8Qy4qm5Emw.jpg",
        release_date: "2022-12-14",
        vote_average: 7.7,
        popularity: 2547.855,
        runtime: 192,
        revenue: 2320250000,
        genre_ids: [878, 12, 14],
      },
      {
        title: "Pantera Negra: Wakanda Para Sempre",
        overview:
          "A rainha Ramonda, Shuri, M'Baku, Okoye e as Dora Milaje lutam para proteger sua nação das potências mundiais intervenientes após a morte do rei T'Challa. Enquanto os wakandanos se esforçam para abraçar seu próximo capítulo, os heróis devem se unir com a ajuda da Nakia e Everett Ross para forjar um novo caminho para o reino de Wakanda.",
        poster_path:
          "https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg",
        backdrop_path:
          "https://image.tmdb.org/t/p/w1280/yYrvN5WFeGYjJnRzhY0QXuo4Isw.jpg",
        release_date: "2022-11-09",
        vote_average: 7.3,
        popularity: 1947.912,
        runtime: 161,
        revenue: 859102000,
        genre_ids: [28, 12, 18],
      },
      {
        title: "Homem-Aranha: Sem Volta Para Casa",
        overview:
          "Peter Parker tem a sua identidade secreta revelada e pede ajuda ao Doutor Estranho. Quando um feitiço para reverter o evento não sai como esperado, inimigos perigosos de outros mundos começam a aparecer, forçando Peter a descobrir o que realmente significa ser o Homem-Aranha.",
        poster_path:
          "https://image.tmdb.org/t/p/w500/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg",
        backdrop_path:
          "https://image.tmdb.org/t/p/w1280/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg",
        release_date: "2021-12-15",
        vote_average: 8.4,
        popularity: 1689.932,
        runtime: 148,
        revenue: 1921847000,
        genre_ids: [28, 12, 878],
      },
      {
        title: "Top Gun: Maverick",
        overview:
          "Depois de mais de 30 anos de serviço como um dos principais aviadores da Marinha, Pete 'Maverick' Mitchell está onde ele pertence, empurrando o envelope como um piloto de testes corajoso e evitando o avanço de patente que o colocaria no chão.",
        poster_path:
          "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
        backdrop_path:
          "https://image.tmdb.org/t/p/w1280/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg",
        release_date: "2022-05-24",
        vote_average: 8.2,
        popularity: 1456.321,
        runtime: 130,
        revenue: 1488732821,
        genre_ids: [28, 18],
      },
      {
        title: "Capitã Marvel",
        overview:
          "Carol Danvers se torna uma das heroínas mais poderosas do universo quando a Terra fica no meio de uma guerra galáctica entre duas raças alienígenas. Situado nos anos 1990, esta é uma aventura totalmente nova de um período da história do Universo Cinematográfico Marvel.",
        poster_path:
          "https://my-cubos-bucket.s3.us-east-2.amazonaws.com/movies/1748636043548-uul4f.png",
        backdrop_path:
          "https://image.tmdb.org/t/p/w1280/w2PMyoyLU22YvrGK3smVM9fW1jj.jpg",
        release_date: "2024-05-23",
        vote_average: 6.8,
        popularity: 1234.567,
        runtime: 123,
        revenue: 1128462972,
        genre_ids: [28, 12, 878],
      },
      {
        title: "Alita: Anjo de Combate",
        overview:
          "Quando Alita desperta sem memória de quem ela é em um mundo futuro que não reconhece, ela é acolhida por Ido, um médico compassivo que percebe que em algum lugar nesta carcaça de ciborgue abandonada está o coração e a alma de uma jovem com um passado extraordinário.",
        poster_path:
          "https://my-cubos-bucket.s3.us-east-2.amazonaws.com/movies/1748636034581-4frki.png",
        backdrop_path:
          "https://image.tmdb.org/t/p/w1280/aQXTw3wIWuFMy0beXRiZ1xVKtQf.jpg",
        release_date: "2024-10-04",
        vote_average: 7.2,
        popularity: 987.654,
        runtime: 122,
        revenue: 404980906,
        genre_ids: [28, 878, 53],
      },
      {
        title: "Como Treinar Seu Dragão 3",
        overview:
          "Quando Banguela encontra uma fêmea da sua espécie, uma Fúria da Luz, Soluço descobre que há mais dragões do que ele jamais imaginou, e que alguns não podem ser treinados. Agora, Soluço, Banguela e o restante do bando devem deixar o único lar que conheceram e viajar para um mundo escondido.",
        poster_path:
          "https://my-cubos-bucket.s3.us-east-2.amazonaws.com/movies/1748636048236-212zx.png",
        backdrop_path:
          "https://image.tmdb.org/t/p/w1280/xt1CFJh6wAJXn7fOKXi4sIwrXp4.jpg",
        release_date: "2024-05-24",
        vote_average: 7.5,
        popularity: 1567.89,
        runtime: 104,
        revenue: 521172832,
        genre_ids: [16, 10751, 12],
      },
      {
        title: "Aquaman",
        overview:
          "Arthur Curry, o relutante governante do reino subaquático de Atlântida, é pego entre um mundo terrestre que saqueia constantemente o mar e os habitantes de Atlântida que estão prontos para se revoltar e invadir a superfície.",
        poster_path:
          "https://my-cubos-bucket.s3.us-east-2.amazonaws.com/movies/1748620233078-0844ts.webp",
        backdrop_path:
          "https://image.tmdb.org/t/p/w1280/7icgF1dgUJaCpnWV235eafXFznJ.jpg",
        release_date: "2024-03-22",
        vote_average: 6.9,
        popularity: 2134.567,
        runtime: 143,
        revenue: 1148161989,
        genre_ids: [28, 12, 14],
      },
      {
        title: "O Menino que Queria Ser Rei",
        overview:
          "Alex pensa que ele é apenas outro garoto nerd até que ele tropeça na lendária espada na pedra, Excalibur. Agora, ele deve unir seus amigos e inimigos em uma banda de cavaleiros e, junto com o lendário feiticeiro Merlin, tomar o malvado Morgana.",
        poster_path:
          "https://my-cubos-bucket.s3.us-east-2.amazonaws.com/movies/1748636097517-dneg6e.png",
        backdrop_path:
          "https://image.tmdb.org/t/p/w1280/8jCKTSBGKMZBFUk0gjs2XBUB8jX.jpg",
        release_date: "2024-04-12",
        vote_average: 6.1,
        popularity: 678.901,
        runtime: 120,
        revenue: 32094270,
        genre_ids: [12, 10751, 14],
      },
      {
        title: "Megarromântico",
        overview:
          "Harper, uma escritora de Nova York, é enviada para a Austrália para salvar uma revista que está falhando. Lá ela conhece um editor local charmoso que a ajuda com histórias de vida selvagem, porém elas não são as únicas com química selvagem.",
        poster_path:
          "https://my-cubos-bucket.s3.us-east-2.amazonaws.com/movies/1748636093685-a5tygy.png",
        backdrop_path:
          "https://image.tmdb.org/t/p/w1280/6CoRTJTmijhBLJTUNoVSUNy3Q4q.jpg",
        release_date: "2024-06-14",
        vote_average: 6.5,
        popularity: 543.21,
        runtime: 98,
        revenue: 53300000,
        genre_ids: [35, 10749, 18],
      },
      {
        title: "Uma Nova Chance",
        overview:
          "Uma mulher retorna à sua cidade natal após anos longe, buscando uma segunda oportunidade na vida e no amor. Ela deve confrontar seu passado e descobrir se é possível recomeçar quando tudo parece perdido.",
        poster_path:
          "https://my-cubos-bucket.s3.us-east-2.amazonaws.com/movies/1748636101684-gcy52.png",
        backdrop_path:
          "https://image.tmdb.org/t/p/w1280/vQrdnkJuHsaKjxhHCl69ApzIzuL.jpg",
        release_date: "2024-03-28",
        vote_average: 7.1,
        popularity: 789.123,
        runtime: 110,
        revenue: 45200000,
        genre_ids: [18, 10749, 35],
      },
      {
        title: "Homem-Aranha no Aranhaverso",
        overview:
          "Phil Lord e Christopher Miller, os mentes criativas por trás de 'Uma Aventura LEGO' e '21 Jump Street', trazem sua visão única para um novo universo do Homem-Aranha, com uma nova dimensão artística inovadora.",
        poster_path:
          "https://my-cubos-bucket.s3.us-east-2.amazonaws.com/movies/1748636052647-k1k2o8.png",
        backdrop_path:
          "https://image.tmdb.org/t/p/w1280/uonggkNfR8YWVm1d6LQF6q5xYW4.jpg",
        release_date: "2024-11-08",
        vote_average: 8.4,
        popularity: 3456.789,
        runtime: 117,
        revenue: 384299543,
        genre_ids: [16, 28, 12],
      },
      {
        title: "Máquinas Mortais",
        overview:
          "Milhares de anos depois da destruição da civilização por um evento catastrófico, a humanidade se adaptou e milhares de cidades agora perambulam pela Terra em rodas gigantes, devorando cidades menores para recursos.",
        poster_path:
          "https://my-cubos-bucket.s3.us-east-2.amazonaws.com/movies/1748636059667-yikvf9.png",
        backdrop_path:
          "https://image.tmdb.org/t/p/w1280/rxYG6Sj95as9rv9wKIHUx6ATWd3.jpg",
        release_date: "2024-11-27",
        vote_average: 6.1,
        popularity: 1234.321,
        runtime: 128,
        revenue: 173108382,
        genre_ids: [28, 12, 878],
      },
    ];

    await runQuery(
      "DELETE FROM movie_genres WHERE movie_id IN (SELECT id FROM movies WHERE user_id = ?)",
      [userId]
    );
    await runQuery("DELETE FROM movies WHERE user_id = ?", [userId]);

    for (const movie of movies) {
      const movieResult = await runQuery(
        `
        INSERT INTO movies (title, overview, poster_path, backdrop_path, release_date, vote_average, popularity, runtime, revenue, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          movie.title,
          movie.overview,
          movie.poster_path,
          movie.backdrop_path,
          movie.release_date,
          movie.vote_average,
          movie.popularity,
          movie.runtime,
          movie.revenue,
          userId,
        ]
      );

      for (const genreId of movie.genre_ids) {
        await runQuery(
          "INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)",
          [movieResult.id, genreId]
        );
      }
    }

    console.log(`✅ ${movies.length} filmes inseridos no banco`);

    console.log("🎉 Seed concluído com sucesso!");
    console.log("📧 Login de teste: admin@exemplo.com");
    console.log("🔑 Senha de teste: 123456");
  } catch (error) {
    console.error("❌ Erro no seed:", error);
  }
}

if (require.main === module) {
  seed().then(() => process.exit(0));
}

module.exports = { seed };
