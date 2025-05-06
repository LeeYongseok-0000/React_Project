import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../style/movieList.module.scss';


const API_KEY = "";


const TopRateMovies = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
    const [searchButton, setSearchButton] = useState('');
  
  const handleSearchSubmit = (query) => {
    navigate(`/search?query=${query}`); // 검색어를 URL로 전달하여 SearchMovies로 이동
  };
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMovies = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);  
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=ko-KR&page=${page}`)

      .then((response) => response.json())
      .then((data) => {

        setMovies((prev) => [...prev, ...data.results]);
        setPage((prev) => prev + 1);

        if (data.page >= data.total_pages) setHasMore(false);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("영화 데이터를 불러오는 중 오류 발생:", error);
        setIsLoading(false);
      });
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    fetchMovies(); 
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !isLoading) {
        fetchMovies();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchMovies, hasMore, isLoading]);
 


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


    {/* // className={styles.moviesPosterContain} */}
    <div className={styles.moviesPosterContain}>
    <h2>역대 영화
    <p>관객이 인정한 평점 높은 명작들을 만나보세요. </p></h2>
    {/* className={styles.moviesul} */}
    <ul >
        {movies.map((movie) => (
          <li key={movie.id}>
            <NavLink to={`/movie/${movie.id}`}> 
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
              alt={movie.title}
            />
            <div title={movie.title}>{movie.title}</div> 
            <p>개봉일: {movie.release_date}</p>

        <p>평점: {movie.vote_average.toFixed(2)} < br />참여 인원: {movie.vote_count} </p>
        
        </NavLink>
      </li>
    ))}
  </ul>

  {isLoading && <p style={{ textAlign: 'center' }}>불러오는 중...</p>}
  {!hasMore && <p style={{ textAlign: 'center' }}> 모든 영화 로드 완료</p>}
</div>
  </div>
    );
  };

export default TopRateMovies;