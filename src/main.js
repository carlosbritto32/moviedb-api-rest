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
function createMovies(movies, container) {
  container.innerHTML = "";
  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    movieContainer.addEventListener("click", () => {
      location.hash = `#movie=${movie.id}`;
    });

    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");

    movieImg.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
    );
    movieImg.setAttribute("alt", movie.title);

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
  createMovies(movies, trendingMoviesPreviewList);
}

async function getCategoriesPreview() {
  const { data } = await api(`${genre}`);
  const categories = data.genres;

  console.log(categories);
  createCategories(categories, categoriesPreviewList);
}

async function getMoviesByCategory(id) {
  const { data } = await api(`${discoverGenre}`, {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;

  console.log(movies);
  createMovies(movies, genericSection);
}

async function getMoviesBySearch(query) {
  const { data } = await api(`${searchMovie}`, {
    params: {
      query: query,
    },
  });

  const movies = data.results;
  console.log(movies);
  createMovies(movies, genericSection);
}

async function getTrendingMovies() {
  const { data } = await api(`${trending}`);
  const movies = data.results;

  console.log(movies);
  createMovies(movies, genericSection);
}

async function getMovieById(id) {
  const { data } = await api(`${searchMovieById}${id}`);

  console.log(data);
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
  console.log("related", movies);

  createMovies(movies, relatedMoviesContainer);
}
