import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../style/movieList.module.scss';


const API_KEY = "";


const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수
    const [searchButton, setSearchButton] = useState('');
  
  const handleSearchSubmit = (query) => {
    navigate(`/search?query=${query}`); // 검색어를 URL로 전달하여 SearchMovies로 이동
  };
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);
  const TOTAL_PAGES = 10;


  useEffect(() => {
    const TMDB_API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=${currentPage}`;
    fetch(TMDB_API_URL)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results);


        setTotalPages(TOTAL_PAGES); 
      })
      .catch((error) => {
        console.error("영화 데이터를 불러오는 중 오류 발생:", error);
      });
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };



  return (
    // className={styles.moviesPosterContain}
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
        <h2>실시간 인기 영화
        <p>지금 가장 인기 있는 영화들을 확인하세요.</p></h2>
        {/* className={styles.moviesul} */}
        <ul >
        {movies.map((movie) => (
          <li key={movie.id}>
            <Link to={`/movie/${movie.id}`}> 
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
              alt={movie.title}
            />
            <div title={movie.title}>{movie.title}</div> 
            {/* <p>평균⭐ {movie.vote_average.toFixed(2)}</p> */}
            <p>개봉일: {movie.release_date}</p>
            </Link>
          </li>
        ))}
      </ul>

  <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          ◀ 이전
        </button>
        <span style={{ margin: '0 10px' }}>{currentPage} / {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          다음 ▶
        </button>
      </div>
    </div>
  </>
    );
  };

export default PopularMovies;