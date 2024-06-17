import config from '../../../etc/config.js';
const { API_KEY,AUTH_KEY } = config;

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
      AUTH_KEY,
  },
};

fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`, options)
  .then((res) => res.json())
  .then((data) => {
    allMovies = data.results;

    data.results.map((item) => {
      paintMovies(item);
      // const options1 = {
      //   method: 'GET',
      //   headers: {
      //     accept: 'application/json',
      //     Authorization:
     //        AUTH_KEY,
      //   },
      // };
      // fetch(`https://api.themoviedb.org/3/movie/${item.id}?api_key=${API_KEY}`, options1)
      //   .then((response) => response.json())
      //   .then((response) => console.log(response))
      //   .catch((err) => console.error(err));
    });
    console.log(data);
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
  popular.textContent = `인기도 : ${~~(item.popularity)}`;
  title.textContent = `${item.title}`;
  overview.textContent = `${item.overview}`;
  img.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;

  movieCard.append(img, rate, popular, title, overview);
  movies.appendChild(movieCard);

 

  movieMap.set(item.title, movieCard);
}

// 영화 카드 클릭 이벤트 함수
movies.addEventListener('click', handleClickCard);

// function handleClickCard(e) {
//   // 카드 이외 영역 클릭 시
//   if (e.target === movies) return;

//   // 카드 클릭
//   if (e.target.matches('.movie_card')) {
//     alert(`🎬 선택하신 영화의 id는 ${e.target.id}입니다.`);
//   } else {
//     // 카드의 자식 태그 클릭 시 부모의 id로 접근
//     alert(`🎬 선택하신 영화의 id는 ${e.target.parentNode.id}입니다.`);
//   }
// }

function handleClickCard(e) { 
  // 카드 이외 영역 클릭 시
  if (e.target === movies) return;

  // 카드 클릭
  if (e.target.matches('.movie_card')) {
    window.location.href = `./detail.html?id=${e.target.id}`;
  } else {
    // 카드의 자식 태그 클릭 시 부모의 id로 접근
    window.location.href = `./detail.html?id=${e.target.parentNode.id}`;
  }
};

// 영화 이름 정렬
const sortBtn1 = document.querySelector(".sortBtn1");
const sortBtn2 = document.querySelector(".sortBtn2");
const sortBtn3 = document.querySelector(".sortBtn3");
const sortBtn4 = document.querySelector(".sortBtn4");
const sortReset = document.querySelector(".sortReset");

function sortingMoviesName(order){
  const movies = document.getElementById("movies");
  const movieCards = [...document.querySelectorAll(".movie_card")];
  
  const sortedMovies = [...movieCards].sort((movie1, movie2) => {
    const title1 = movie1.querySelector('#movie_title').textContent.trim().toLowerCase();
    const title2 = movie2.querySelector('#movie_title').textContent.trim().toLowerCase();

    if (order === 'ASC') {
      return title1.localeCompare(title2);
    } else if (order === 'DESC') {
      return title2.localeCompare(title1);
    }

  });
  
  movies.innerHTML = '';
  sortedMovies.forEach((card) => {
    movies.appendChild(card);
  });
  
}

// 영화 평점 정렬
function sortingMoviesRate(order){ 
  const movies = document.getElementById("movies");
  const movieCards = [...document.querySelectorAll(".movie_card")];
  const rate = document.createElement('p');

  const sortedMovies = [...movieCards].sort((movie1, movie2) => {
    const rate1 = Number(movie1.querySelector('.rate').textContent.slice(8, rate.length));
    const rate2 = Number(movie2.querySelector('.rate').textContent.slice(8, rate.length));
    
    if (order === 'ASC') {
      return rate1 - rate2;
    } else if (order === 'DESC') {
      return rate2 - rate1;
    }
  })

  movies.innerHTML = '';
  sortedMovies.forEach((card) => {
    movies.appendChild(card);
  });
}

function resetSortingMovies() {
  movies.innerHTML = '';
  allMovies.forEach((card) => {
    paintMovies(card);
  });
}

sortBtn1.addEventListener("click", () => {
  console.log('sort 오름')
  sortingMoviesName('ASC');
});

sortBtn2.addEventListener("click", () => {
  console.log('sort 내림')
  sortingMoviesName('DESC'); 
});

sortBtn3.addEventListener("click", () => {
  console.log('sort 평점 오름')
  sortingMoviesRate('ASC');
});

sortBtn4.addEventListener("click", () => {
  console.log('sort 평점 내림')
  sortingMoviesRate('DESC'); 
});

sortReset.addEventListener("click", () => {
  console.log('sorting reset');
  resetSortingMovies();
});

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
      //console.log('ddd');
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
