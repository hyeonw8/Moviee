import config from './config.js';
const { API_KEY } = config;

const movies = document.querySelector('#movies');
const searchContainer = document.querySelector('.search');
const form = document.querySelector('#form_container');
const scrollBtn = document.querySelector('.scrollBtn');
let movieMap = new Map();
let allMovies;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: API_KEY,
  },
};

fetch(
  'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1',
  options
)
  .then((res) => res.json())
  .then((data) => {
    allMovies = data.results;

    data.results.map((item) => {
      paintMovies(item);
    });
  })
  .catch((err) => console.error(err));

// 화면에 카드 그리기
function paintMovies(item) {
  const div = document.createElement('div');
  div.classList.add('movie_card');
  div.id = item.id;

  const rate = document.createElement('p');
  rate.classList.add('rate');
  const popular = document.createElement('p');
  popular.classList.add('popular');
  const title = document.createElement('h2');
  title.id = 'movie_title';
  const overview = document.createElement('p');
  const img = document.createElement('img');

  rate.textContent = `평점 : ⭐️ ${item.vote_average}`;
  popular.textContent = `인기도 : ${item.popularity}`;
  title.textContent = `${item.title}`;
  overview.textContent = `${item.overview}`;
  img.src = `https://image.tmdb.org/t/p/w300${item.poster_path}`;

  div.append(img, rate, popular, title, overview);
  movies.appendChild(div);

  movieMap.set(item.title, div);

  img.addEventListener('click', () => {
    alert(`🎬 선택하신 영화의 id는 ${item.id}입니다.`);
  });
}

const searchInput = document.querySelector('#searchInput');
const searchBtn = document.querySelector('.searchBtn');

function search() {
  const searchText = searchInput.value.trim().toLowerCase();

  allMovies.forEach((movie) => {
    let movieTitle = movie.title;
    if (movieTitle.toLowerCase().includes(searchText)) {
      movieMap.get(movieTitle).style.display = 'block';
    } else {
      movieMap.get(movieTitle).style.display = 'none';
    }
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
});
searchBtn.addEventListener('click', (e) => {
  search();
});
// enter key
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    search();
  }
});
searchInput.addEventListener('keyup', (e) => {
  search();
});
// focus
searchInput.focus();

// scroll up
scrollBtn.addEventListener('click', (e) => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
});

// 모드 변경 저장
document.addEventListener('DOMContentLoaded', (event) => {
  const userTheme = localStorage.getItem('theme');
  if (userTheme === 'dark') {
    switchDarkTheme();
  } else {
    switchLightTheme();
  }
});

// 다크모드, 라이트모드 변경
const switchBtn = document.querySelector('#switchBtn');
const html = document.querySelector('html');
const mode = 'dark';

switchBtn.addEventListener('click', () => {
  if (html.classList.contains(mode)) {
    switchLightTheme();
  } else {
    switchDarkTheme();
  }
});
const switchDarkTheme = () => {
  localStorage.setItem('theme', 'dark');
  html.classList.add(mode);
};
const switchLightTheme = () => {
  localStorage.removeItem('theme', 'dark');
  html.classList.remove(mode);
}
