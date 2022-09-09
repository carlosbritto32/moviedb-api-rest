let page = 1;
let maxPage;
let infiniteScroll;

searchFormBtn.addEventListener("click", () => {
  if (searchFormInput.value !== "") {
    location.hash = `#search=${searchFormInput.value}`;
  } else {
    return alert("Please type something to search!");
  }
});
trendingBtn.addEventListener("click", () => {
  location.hash = "#trends";
});
arrowBtn.addEventListener("click", () => {
  // history.back(); this is a function to go back like histroy search instead to go to the main page
  location.hash = "";
});

window.addEventListener("DOMContentLoaded", navigator, false);
window.addEventListener("hashchange", navigator, false);
window.addEventListener("scroll", infiniteScroll, false);

function navigator() {
  if (infiniteScroll) {
    window.removeEventListener("scroll", infiniteScroll, { passive: false });
    infiniteScroll = undefined;
  }

  if (location.hash.startsWith("#trends")) {
    trendsPage();
  } else if (location.hash.startsWith("#search=")) {
    searchPage();
  } else if (location.hash.startsWith("#movie=")) {
    movieDetailsPage();
  } else if (location.hash.startsWith("#category=")) {
    categoriesPage();
  } else {
    homePage();
  }

  window.scrollTo(0, 0);

  if (infiniteScroll) {
    window.addEventListener("scroll", infiniteScroll, { passive: false });
  }
}

function homePage() {
  console.log("Home!!");

  headerSection.classList.remove("header-container--long");
  // headerSection.getElementsByClassName.background = "";
  arrowBtn.classList.add("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.remove("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.remove("inactive");

  trendingPreviewSection.classList.remove("inactive");
  categoriesPreviewSection.classList.remove("inactive");
  genericSection.classList.add("inactive");
  movieDetailSection.classList.add("inactive");

  headerSection.style.background = ``;
  getTrendingMoviesPreview();
  getCategoriesPreview();
}

function categoriesPage() {
  console.log("Categories!!");
  headerSection.classList.remove("header-container--long");
  // headerSection.getElementsByClassName.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");

  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.add("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  // destructuring from hash to get the id number ["doesnt-matter","ID-PART"]
  const [_, categoryData] = location.hash.split("=");
  // destructuring from hash to get the id number ["ID","ID-NAME"]
  const [id, categoryName] = categoryData.split("-");

  headerCategoryTitle.innerHTML = `${categoryName}`;

  getMoviesByCategory(id);
  infiniteScroll = getPaginatedMoviesByCategory(id);
}
function movieDetailsPage() {
  console.log("Movie!!");
  headerSection.classList.add("header-container--long");
  // headerSection.getElementsByClassName.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.add("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.add("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.add("inactive");
  movieDetailSection.classList.remove("inactive");

  const [movieName, id] = location.hash.split("=");
  getMovieById(id);

  // relatedMovies
  getRelatedMovies(id);
}
function searchPage() {
  console.log("Search!!");

  headerSection.classList.remove("header-container--long");
  // headerSection.getElementsByClassName.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.add("inactive");
  searchForm.classList.remove("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  const [_, query] = location.hash.split("=");
  getMoviesBySearch(query);
  infiniteScroll = getPaginatedMoviesBySearch(query);
}
function trendsPage() {
  console.log("TRENDS!!");

  headerSection.classList.remove("header-container--long");
  // headerSection.getElementsByClassName.background = "";
  arrowBtn.classList.remove("inactive");
  arrowBtn.classList.remove("header-arrow--white");
  headerTitle.classList.add("inactive");
  headerCategoryTitle.classList.remove("inactive");
  searchForm.classList.add("inactive");

  trendingPreviewSection.classList.add("inactive");
  categoriesPreviewSection.classList.add("inactive");
  genericSection.classList.remove("inactive");
  movieDetailSection.classList.add("inactive");

  headerCategoryTitle.innerHTML = "Trends";
  getTrendingMovies();
  infiniteScroll = getPaginatedTrendingMovies;
}
