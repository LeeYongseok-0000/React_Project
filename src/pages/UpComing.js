import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../style/movieList.module.scss';
// import SearchMovies from '../components/SearchMovies';

const API_KEY = "";
const TMDB_API_URL = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=ko-KR&page=1&region=KR`; //region=KR (한국 개봉일 기준)

const UpComing = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
    const [searchButton, setSearchButton] = useState('');
  
 
   const handleSearchSubmit = (query) => {
     navigate(`/search?query=${query}`); // 검색어를 URL로 전달하여 SearchMovies로 이동
   };
  //기준 시간 설정(한국 기준)
  const getDday = (releaseDate) => {
    const today = new Date(); 
    const koreaTimeOffset = 9 * 60 * 60 * 1000; 
    const todayKST = new Date(today.getTime() + koreaTimeOffset);
    const release = new Date(releaseDate);
    const diff = Math.ceil((release - todayKST) / (1000 * 60 * 60 * 24)); 
    //D-day 반환 설정
    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return '오늘 개봉!';
    return null; 
  };

  useEffect(() => {
    fetch(TMDB_API_URL)
      .then((response) => response.json())
      .then((data) => {
        const filtered = data.results.filter((movie) => getDday(movie.release_date) !== null);
        setMovies(filtered);
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
      <h2>개봉 예정 영화
      <p>개봉 예정인 영화를 미리 만나보세요.</p></h2>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <NavLink to={`/movie/${movie.id}`}> 
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
              alt={movie.title}
            />
            <div title={movie.title}>{movie.title}</div> 
            <p>개봉일: {movie.release_date} (<strong>{getDday(movie.release_date)}</strong>)</p>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default UpComing;
