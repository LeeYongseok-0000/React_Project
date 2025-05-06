import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavLinkList from './components/NavLinkList';
import Main from './pages/Main';
import QnA from './community/QnA';
import PopularMovies from './pages/PopularMovies';
import TopRateMovies from './pages/TopRateMovies';
import TrendMovies from './pages/TrendMovies';
import MovieDetail from './pages/MovieDetail';
import UpComing from './pages/UpComing';
import SearchMovies from './components/SearchMovies';


const App = () => {
  return (
    <div>
    <NavLinkList />
    <Routes>
    <Route path="/" element={<Main />} />
    <Route path="/popularmovies" element={<PopularMovies />} />
    <Route path="/topratemovies" element={<TopRateMovies />} />
    <Route path="/trendmovies" element={<TrendMovies />} />
    <Route path="/movie/:id" element={<MovieDetail />} />    
    <Route path="/upcoming" element={<UpComing />} />
    <Route path="QnA" element={<QnA />} />
    <Route path="/search" element={<SearchMovies />} /> {/* 검색 결과 페이지 */}    
    </Routes>
    </div>
  );
};
export default App;
