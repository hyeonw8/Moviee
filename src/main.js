import config from './config.js';
const { API_KEY } = config;

const movies = document.getElementById('movies');
const form = document.getElementById('form_container');
const scrollBtn = document.querySelector('.scrollBtn');
let movieMap = new Map();
let allMovies;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkNWVhMmE4YWQ3MjY3ODczYzQ0Y2M4YjEwMDQ5Yzc5MyIsInN1YiI6IjY2MjhiMjVjYWY5NTkwMDE2NDZhMGQ4ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.F9d4xz9sqS6xrWUx9S9lK0xe1ViSZCbj2uVkHjKTfDo',
  },
};

fetch(
  `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`,
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
  const movieCard = document.createElement('div');
  movieCard.classList.add('movie_card');
  movieCard.id = item.id;

  const rate = document.createElement('p');
  rate.classList.add('rate');
  const popular = document.createElement('p');
  popular.classList.add('popular');
  const title = document.createElement('h2');
  title.id = 'movie_title';
  const overview = document.createElement('p');
  const img = document.createElement('img');
  img.classList.add('movie_img');
  img.alt = item.title;

  rate.textContent = `평점 : ⭐️ ${item.vote_average}`;
  popular.textContent = `인기도 : ${item.popularity}`;
  title.textContent = `${item.title}`;
  overview.textContent = `${item.overview}`;
  img.src = `https://image.tmdb.org/t/p/w300${item.poster_path}`;

  movieCard.append(img, rate, popular, title, overview);
  movies.appendChild(movieCard);

  movieMap.set(item.title, movieCard);
}

// 영화 카드 클릭 이벤트 함수
movies.addEventListener('click', handleClickCard);
4;
function handleClickCard(e) {
  // 카드 이외 영역 클릭 시
  if (e.target === movies) return;

  // 카드 클릭
  if (e.target.matches('.movie_card')) {
    alert(`🎬 선택하신 영화의 id는 ${e.target.id}입니다.`);
  } else {
    // 카드의 자식 태그 클릭 시 부모의 id로 접근
    alert(`🎬 선택하신 영화의 id는 ${e.target.parentNode.id}입니다.`);
  }
}

// 영화 검색
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
const switchBtn = document.getElementById('switchBtn');
const html = document.getElementsByTagName('html')[0];
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
};
