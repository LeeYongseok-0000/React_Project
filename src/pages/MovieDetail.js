
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/moviedetail.scss';

const API_KEY = '';
const BASE_URL = 'https://api.themoviedb.org/3/movie';

function MovieDetail() {
  const { id } = useParams(); //영화 개별 Id
  const [movie, setMovie] = useState(null);
  const [videoKey, setVideoKey] = useState(null); //예고편 Key
  const [credits, setCredits] = useState(null); //영화 제작진(주연배우)
  const [reviews, setReviews] = useState([]); //영화 리뷰
  const [similarMovies, setSimilarMovies] = useState([]); //비슷한 영화
  const MAX_REVIEW_COUNT = 4; //리뷰 출력 최대 개수

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        //기본 정보
        const movieData = await fetchData(`${BASE_URL}/${id}`, { language: 'ko-KR' });
        setMovie(movieData);
        //예고편
        const videoData = await fetchData(`${BASE_URL}/${id}/videos`, { language: 'en-US' });
        const trailer = videoData.results?.find(
          video => video.type === 'Trailer' && video.site === 'YouTube');
        setVideoKey(trailer?.key || null);
        //주연 배우
        const creditsData = await fetchData(`${BASE_URL}/${id}/credits`, { language: 'ko-KR' });
        setCredits(creditsData);
        //리뷰
        const reviewsData = await fetchData(`${BASE_URL}/${id}/reviews`);
        setReviews(reviewsData.results || []);
        //비슷한 영화
        const similarData = await fetchData(`${BASE_URL}/${id}/similar`, { language: 'ko-KR', page: 1 });
        setSimilarMovies(similarData.results || []);
        //에러
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchAllData();
  }, [id]);
  //영화 Id 값에 따른 API 호출
  const fetchData = async (url, params = {}) => {
    //URL 객체 생성, API 키, 추가 파라미터 설정
    const urlWithParams = new URL(url);
    urlWithParams.search = new URLSearchParams({ api_key: API_KEY, ...params }).toString();
    //데이터 요청
    const response = await fetch(urlWithParams);
    //에러
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    //데이터 JSON 형태로 반환
    return response.json();
  };
    //로딩 중 메시지
  if (!movie) return <p>영화 정보를 불러오고 있습니다.</p>;

  return (
    <div>
    {/* 영화 이미지(상단 백그라운드) */}
    <div
      className="moviedetailbackimgcover"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}>
    </div>
    {/* 영화 상세 정보 */}
    <div className='detailallcover'>
      <div className='stringcontain'>
        <h2 className='detailmovietitle'>{movie.title}</h2>
        {/* 제목 */}
        <p>{movie.original_title}</p>
        {/* 개봉 연도, 장르, 제작 국가 */}
        <p style={{ paddingBlock: "5px" }}>{new Date(movie.release_date).getFullYear()} / {movie.genres.map(g => g.name).join(', ')}
          / {movie.production_countries.map(c => c.name).join(', ')}
        </p>
        {/* 러닝 타임(분) */}
        <p>{movie.runtime}분</p><br />
      </div>
      <div className='imgtratilerbox'>
        <div className='imgbox'>
        {/* 영화 포스터 이미지 */}
          <img className='detailimg' src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.title} />
          {/* 개봉 날짜(연-월-일) */}
          <p style={{ paddingTop: "10px" }}>개봉: {movie.release_date}</p>
          {/* 평점 */}
          <p>평점: {movie.vote_average}</p>
          {/* 감독(이름) */}
          {credits && (
            <p>감독: {credits.crew.filter(person => person.job === 'Director').map(d => d.name).join(', ')}</p>
          )}
        </div>
        {/* 영화 예고편 */}
        {videoKey && (
          <div className="movietrailer">
            <iframe
              width="854"
              height="480"
              src={`https://www.youtube.com/embed/${videoKey}`}
              title="YouTube player"
            ></iframe>
            {/* 영화 줄거리 */}
            <p className='overviewcontain'>{movie.overview}</p>
          </div>
        )}
      </div>
        {/* 출연 배우 */}
      {credits && (
        <div className='personlist'>
          <h4>주연 배우</h4>
          <div className="actors">
            {credits.cast.slice(0, 5).map(actor => (
              <div key={actor.cast_id} className="actor-card">
                <img
                  src={actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : 'https://via.placeholder.com/185x278?text=No+Image'}
                  alt={actor.name}
                  width={90}
                  height={130}
                />
                <p>{actor.name} <br /><small>({actor.character})</small></p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* 영화 리뷰 */}
      {reviews.length > 0 && (
        <>
          <h4 style={{ paddingTop: "30px", paddingBottom: "10px" }}>관람객 리뷰</h4>
          <div className="reviewscontain">
            {reviews.slice(0, MAX_REVIEW_COUNT).map((review, idx) => (
              <div key={idx}>
                <p style={{ padding: "10px" }}><strong>{review.author}</strong>
                  ({new Date(review.created_at).toLocaleDateString()})
                </p>
                <p className='reviews'>{review.content.length > 315 ? review.content.slice(0, 315) + '...' : review.content}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {/* 비슷한 영화 목록 */}
      {similarMovies.length > 0 && (
        <div className="similarmovies">
          <h4 style={{ padding: "10px", paddingLeft: "25%" }}>비슷한 영화</h4>
          <div className="similarlist">
            {similarMovies.slice(0, 5).map(movie => (
              <div key={movie.id} className="similarmovie">
                <img
                  src={movie.poster_path
                    ? `https://image.tmdb.org/t/p/w154${movie.poster_path}`
                    : 'https://via.placeholder.com/154x231?text=No+Image'}
                  alt={movie.title}
                  width={77}
                />
                <p>{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);
}

export default MovieDetail;