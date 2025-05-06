import React, { useReducer, useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "react-virtualized/styles.css";
import "../style/qna.scss";

const initialState = {
  questionList: [],
  currentQuestion: null,
  page: 1,
  loading: false,
  hasMore: true,
};

const actionTypes = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  INIT_PAGE: "INIT_PAGE",
  SET_LOADING: "SET_LOADING",
  INCREMENT_PAGE: "INCREMENT_PAGE",
  TOGGLE_DETAIL: "TOGGLE_DETAIL",
};

function questionReducer(state, action) {
  switch (action.type) {
    case actionTypes.CREATE:
      const newQuestions = [action.load, ...state.questionList];
      return {
        ...state,
        questionList: newQuestions,
      };
    case actionTypes.READ:
      const foundQuestion = state.questionList.find(
        (question) => question.id === action.load.id
      );
      return { ...state, currentQuestion: foundQuestion };
    case actionTypes.UPDATE:
      const updatedQuestions = state.questionList.map((question) =>
        question.id === action.load.id ? action.load : question
      );
      return { ...state, questionList: updatedQuestions };
    case actionTypes.DELETE:
      const remainingQuestions = state.questionList.filter(
        (question) => question.id !== action.load.id
      );
      return { ...state, questionList: remainingQuestions };
      case actionTypes.INIT_PAGE:
        return {
          ...state,
          questionList:
            action.page === 1
              ? action.load
              : [...state.questionList, ...action.load], 
          page: action.page,
          hasMore: action.hasMore,
        };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.load,
      };
      case "INCREMENT_PAGE":
        console.log('INCREMENT_PAGE', state.page); // 페이지 증가 확인용 로그
        return {
          ...state,
          page: state.page + 1,
        };
    case "TOGGLE_DETAIL":
      if (state.currentQuestion?.id === action.id) {
        return { ...state, currentQuestion: null };
      } else {
        const found = state.questionList.find((q) => q.id === action.id);
        return { ...state, currentQuestion: found };
      }
    default:
      return state;
  }
}

const QnA = () => {
  const listRef = useRef(null);
  const [state, dispatch] = useReducer(questionReducer, initialState);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [id, setId] = useState(null);
  const titleRef = useRef(null);
  const showQuestions = useMemo(() => {
    return state.questionList;
  }, [state.questionList]);
  

  const createBulkData = () => {
    const array = [];
    for (let i = 1; i <= 2500; i++) {
      array.push({
        id: Date.now() + i,
        title: `더미 제목 ${i}`,
        content: `더미 내용 ${i}입니다.`,
      });
    }
    return array;
  };
  
  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("qnaQuestions"));
    if (!storedQuestions || storedQuestions.length === 0) {
      const dummyData = createBulkData();
      localStorage.setItem("qnaQuestions", JSON.stringify(dummyData));
      fetchQuestions(1); // 초기 데이터 로딩
    } else {
      fetchQuestions(state.page); // 기존 데이터가 있으면 현재 페이지 로딩
    }
  }, [state.page]);

  const fetchQuestions = async (page) => {
    dispatch({ type: "SET_LOADING", load: true });
  
    const storedQuestions = JSON.parse(localStorage.getItem("qnaQuestions")) || [];
    console.log('storedQuestions:', storedQuestions); // 데이터 확인용 로그 추가
  
    const startIndex = (page - 1) * 10;
    const endIndex = Math.min(startIndex + 10, storedQuestions.length);
    const newQuestions = storedQuestions.slice(startIndex, endIndex);
  
    dispatch({
      type: actionTypes.INIT_PAGE,
      load: newQuestions,
      page: page,
      hasMore: newQuestions.length > 0 && storedQuestions.length > endIndex,
    });
    dispatch({ type: "SET_LOADING", load: false });
  };
  
  // useEffect(() => {
  //   const storedQuestions = JSON.parse(localStorage.getItem("qnaQuestions"));
  //   if (!storedQuestions || storedQuestions.length === 0) {
  //     const dummyData = createBulkData();
  //     localStorage.setItem("qnaQuestions", JSON.stringify(dummyData));
  //     fetchQuestions(1); // 초기 데이터 로딩 (첫 페이지)
  //   } else {
  //     fetchQuestions(state.page); // 기존 데이터가 있으면 현재 페이지 로딩
  //   }
  // }, [state.page]);

  const saveQuestion = () => {
    if (title.trim() === "") {
      alert("제목을 입력해주세요.");
      return;
    }
    if (body.trim() === "") {
      alert("내용을 입력해주세요.");
      return;
    }
    const newQuestion = {
      id: Date.now(),
      title,
      content: body,
    };
    const newList = [newQuestion, ...state.questionList];
    dispatch({ type: actionTypes.CREATE, load: newQuestion });
    localStorage.setItem("qnaQuestions", JSON.stringify(newList));
    setTitle("");
    setBody("");
    alert("게시물이 등록되었습니다.");
    navigate("/qna");
  };
  const getQuestion = (id) => {
    if (state.currentQuestion && state.currentQuestion.id === id) {
      dispatch({ type: actionTypes.READ, load: { id: null } });
    } else {
      dispatch({ type: actionTypes.READ, load: { id } });
    }
  };
  const updateQuestion = () => {
    const updatedQuestion = { id, title, content: body };
    const updatedList = state.questionList.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    dispatch({ type: actionTypes.UPDATE, load: updatedQuestion });
    localStorage.setItem("qnaQuestions", JSON.stringify(updatedList));
    setTitle("");
    setBody("");
    setId(null);
    alert("수정되었습니다.");
    navigate("/qna");
  };
  const editQuestion = (id) => {
    const question = state.questionList.find((q) => q.id === id);
    if (question) {
      setId(question.id);
      setTitle(question.title);
      setBody(question.content);
      setTimeout(() => {
        if (titleRef.current) {
          titleRef.current.focus();
        }
      }, 0);
    }
  };
  const deleteQuestion = (id) => {
    const remainingList = state.questionList.filter((q) => q.id !== id);
    dispatch({ type: actionTypes.DELETE, load: { id } });
    localStorage.setItem("qnaQuestions", JSON.stringify(remainingList));
    alert("삭제되었습니다.");
  };
  const handleToggle = (id) => {
    dispatch({ type: "TOGGLE_DETAIL", id });
  };

  useEffect(() => {
    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (listElement) {
        listElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [state.loading, state.hasMore]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
  
    if (
      !state.loading &&
      state.hasMore &&
      scrollTop + clientHeight >= scrollHeight - 200
    ) {
      dispatch({ type: "INCREMENT_PAGE" });
    }
  };
  
  



  return (
    <>
      <div className='allcover'>
        <div className='mainbox'>
          <div className='caution'>
            <h2 className='communitytilte'>❗영화 게시판 이용 시 주의사항 (스포일러 관련)❗</h2>
            <p>스포일러가 내용이 포함될 경우 반드시 [스포일러] 를 표시해주세요.</p>
            <p>예: [스포일러] OOO 영화 결말 질문</p>

            <p>게시글 작성 시 타인을 배려하는 표현을 사용해주세요.</p>
            <p>영화 내용을 모르는 사람에게 피해가 가지 않도록 신중하게 작성해 주세요.</p>

            <p>고의적 스포일러 유출 시 게시글이 삭제될 수 있습니다.</p>
          </div>
        </div>
      </div>
      <div className="qnacontainer">
        <div className="formbox">
          <label>
            <span>제목 *필수 </span>
            <input
              type="text"
              placeholder="질문 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              ref={titleRef}
            />
          </label>

          <label>
            <span>본문 내용 *필수</span>
            <textarea
              placeholder="질문 내용을 입력해주세요"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </label>

          <div className="buttongroup">
            {id ? (
              <button onClick={updateQuestion}>수정하기</button>
            ) : (
              <button onClick={saveQuestion}>게시글 등록</button>
            )}
          </div>
        </div>

        <h3>게시글 목록</h3>
        <div className="listbox" ref={listRef} style={{ overflow: 'auto', height: 400 }}>
          {showQuestions.map((question, index) => (
            <div key={question.id} className="questionitem">
              <div className="questioninfo">
                <strong>{question.title}</strong>
              </div>
              <div className="itembuttons">
                <button onClick={() => handleToggle(question.id)}>
                  {state.currentQuestion && state.currentQuestion.id === question.id ? "접기" : "펼치기"}
                </button>
                <button onClick={() => editQuestion(question.id)}>수정</button>
                <button onClick={() => deleteQuestion(question.id)}>삭제</button>
              </div>
              {state.currentQuestion && state.currentQuestion.id === question.id && (
                <div className="detailbox">
                  <p>{question.content}</p>
                </div>
              )}
            </div>
          ))}
          {state.loading && <div>Loading...</div>}
          {!state.hasMore && state.questionList.length > 0 && <div>No more questions.</div>}
        </div>
      </div>
    </>
  );
};

export default QnA;