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

// UTILS
function createMovies(movies, container) {
  container.innerHTML = "";
  movies.forEach((movie) => {
    const movieContainer = document.createElement("div");
    movieContainer.classList.add("movie-container");
    const movieImg = document.createElement("img");
    movieImg.classList.add("movie-img");

    movieImg.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
    );
    movieImg.setAttribute("alt", movie.title);
    movieImg.addEventListener("click", () => {
      location.hash = `#movie=${movie.id}-${movie.title}`;
    });

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
