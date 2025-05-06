import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../style/movieList.module.scss';

const API_KEY = "";
const TMDB_API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&region=KR&page=1`;


const Main = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
    const [searchButton, setSearchButton] = useState('');
  
  const handleSearchSubmit = (query) => {
    navigate(`/search?query=${query}`); // 검색어를 URL로 전달하여 SearchMovies로 이동
  };

  useEffect(() => {
    fetch(TMDB_API_URL)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results);
      })
      .catch((error) => {
        console.error("영화 데이터를 불러오는 중 오류 발생:", error);
      });
  }, []);

  return (
    <>
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
      <h2>현재 상영 중</h2>
      <p>지금 극장에서 상영 중인 영화들, 놓치지 마세요.</p>
      <div style={{ marginBottom: '20px' }}>
        
      </div>
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
    </>
  );
};

export default Main;