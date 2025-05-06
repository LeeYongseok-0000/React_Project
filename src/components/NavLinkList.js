import React from 'react';
import { NavLink } from 'react-router';
import '../style/navlinklist.scss';


const NavLinkList = () => {
    return (
        <div className='UlContain'>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
              end // 홈 경로를 정확히 매칭하기 위해 end
            >
              <h1>Movie Library<p>모든 영화, 모든 정보</p></h1>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/upcoming"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              개봉 예정 영화
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/popularmovies"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              인기 영화
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/topratemovies"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              명작 영화
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/trendmovies"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              최신 트렌드 영화
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/qna"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              게시판
            </NavLink>
          </li>
        </ul>
      </div>
    );
};

export default NavLinkList;