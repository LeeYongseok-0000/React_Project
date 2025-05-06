import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../style/movieList.module.scss';


const TrendMovies = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
  const [searchButton, setSearchButton] = useState('');

  const handleSearchSubmit = (query) => {
    navigate(`/search?query=${query}`); // 검색어를 URL로 전달하여 SearchMovies로 이동
  };

  useEffect(() => {
    const API_KEY = "";
    fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=ko-KR&page=1`)
      .then((response) => response.json())
      .then((data) => setMovies(data.results))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div>
      {/* 검색 입력 */}
      <div className={styles.searchContainer}>
  <input 
    className={styles.moviesSearchInputBox}
    type="text"
    placeholder="영화 검색..."
    value={searchButton}
    onChange={(e) => setSearchButton(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        handleSearchSubmit(e.target.value);
      }
    }}
  />
  <button 
    className={styles.searchButton}
    onClick={() => handleSearchSubmit(searchButton)}
  >
    검색
  </button>
</div>

      <div className={styles.moviesPosterContain}>
        <h2>급상승 영화</h2>
        <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <NavLink to={`/movie/${movie.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
              <div title={movie.title}>{movie.title}</div>
              <p>개봉일: {movie.release_date}</p>
            </NavLink>
          </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrendMovies;
