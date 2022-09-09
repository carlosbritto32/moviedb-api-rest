const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  params: {
    api_key: V3_API_KEY,
  },
});

const trending = "/trending/movie/day";
const genre = "/genre/movie/list";
const discoverGenre = "/discover/movie";
const searchMovie = "/search/movie";
const searchMovieById = "/movie/";

// UTILS

const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!!entry.isIntersecting) {
      const url = entry.target.getAttribute("data-img");
      entry.target.setAttribute("src", url);
    }
  });
});

function createMovies(
  movies,
  container,
  { lazyLoad = false, clean = true } = {}
) {
  if (clean) {
    container.innerHTML = "";
  }
  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    movieContainer.addEventListener("click", () => {
      location.hash = `#movie=${movie.id}`;
    });

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");
    movieImg.setAttribute(
      lazyLoad ? "data-img" : "src",
      `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
    );
    movieImg.setAttribute("alt", movie.title);
    movieImg.addEventListener("error", () => {
      movieImg.setAttribute(
        "src",
        "https://static.platzi.com/static/images/error/img404.png"
      );
    });

    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }

    movieContainer.appendChild(movieImg);
    container.appendChild(movieContainer);
  });
}

function createCategories(categories, container) {
  container.innerHTML = "";
  categories.forEach((category) => {
    const categoryContainer = document.createElement("div");
    categoryContainer.classList.add("category-container");
    const categoryName = document.createElement("h3");
    categoryName.classList.add("category-title");

    categoryName.innerHTML = `${category.name}`;
    categoryName.setAttribute("id", `id${category.id}`);
    categoryName.addEventListener("click", () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });

    categoryContainer.appendChild(categoryName);
    container.appendChild(categoryContainer);
  });
}

// API CALLS

async function getTrendingMoviesPreview() {
  const { data } = await api(`${trending}`);
  const movies = data.results;
  console.log(movies);

  createMovies(movies, trendingMoviesPreviewList, { lazyLoad: true });
}

async function getCategoriesPreview() {
  const { data } = await api(`${genre}`);
  const categories = data.genres;

  createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id) {
  const { data } = await api(`${discoverGenre}`, {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;
  maxPage = data.total_pages;
  createMovies(movies, genericSection, { lazyLoad: true });
}

function getPaginatedMoviesByCategory(id) {
  return async function () {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 10;
    const pageIsntMax = page < maxPage;
    if (scrollIsBottom && pageIsntMax) {
      page++;
      const { data } = await api(`${discoverGenre}`, {
        params: {
          with_genres: id,
          page,
        },
      });
      const movies = data.results;
      createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    }
  };
}

async function getMoviesBySearch(query) {
  const { data } = await api(`${searchMovie}`, {
    params: {
      query: query,
    },
  });
  const movies = data.results;
  maxPage = data.total_pages;
  createMovies(movies, genericSection, { lazyLoad: true });
}

function getPaginatedMoviesBySearch(query) {
  return async function () {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 10;
    const pageIsntMax = page < maxPage;
    if (scrollIsBottom && pageIsntMax) {
      page++;
      const { data } = await api(`${searchMovie}`, {
        params: {
          query,
          page,
        },
      });

      const movies = data.results;
      console.log(movies);

      createMovies(movies, genericSection, { lazyLoad: true, clean: false });
    }
  };
}

async function getTrendingMovies() {
  const { data } = await api(`${trending}`);
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection, { lazyLoad: true });
}

async function getPaginatedTrendingMovies() {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  const scrollIsBottom = scrollTop + clientHeight >= scrollHeight - 10;
  const pageIsntMax = page < maxPage;
  if (scrollIsBottom && pageIsntMax) {
    page++;
    const { data } = await api(`${trending}`, {
      params: {
        page,
      },
    });

    const movies = data.results;
    console.log(movies);

    createMovies(movies, genericSection, { lazyLoad: true, clean: false });
  }
}

async function getMovieById(id) {
  const { data } = await api(`${searchMovieById}${id}`);

  const movieImgUrl = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
  headerSection.style.background = `linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.35) 19.27%,
    rgba(0, 0, 0, 0) 29.17%
  ),
  url(${movieImgUrl})`;

  movieDetailTitle.textContent = data.title;
  movieDetailDescription.textContent = data.overview;
  movieDetailScore.textContent = data.vote_average.toFixed(1);

  createCategories(data.genres, movieDetailCategoriesList);
}

async function getRelatedMovies(id) {
  const { data } = await api(`${searchMovieById}${id}/recommendations`);
  const movies = data.results;

  createMovies(movies, relatedMoviesContainer);
}
