import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../style/movieList.module.scss';


const SearchMovies = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation(); // 현재 위치를 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
    const [searchButton, setSearchButton] = useState('');
  
  const handleSearchSubmit = (query) => {
    navigate(`/search?query=${query}`); // 검색어를 URL로 전달하여 SearchMovies로 이동
  };

  const query = new URLSearchParams(location.search).get('query'); // 쿼리 파라미터에서 검색어 가져오기

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      const API_KEY = "";
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((data) => {
          setSearchResults(data.results);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [query]); // 쿼리값이 변경될 때마다 실행

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
      <h2>검색 결과</h2>
      {isLoading ? (
        <p>검색 중...</p>
      ) : (
        <ul>
          {searchResults.length > 0 ? (
            searchResults.map((movie) => (
              <li key={movie.id}>
            <Link to={`/movie/${movie.id}`}> 
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
              alt={movie.title}
            />
            <div title={movie.title}>{movie.title}</div> 
            <p>개봉일: {movie.release_date}</p>
            </Link>
              
              </li>
            ))
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </ul>
      )}
    </div>
    </>
  );
};

export default SearchMovies;
