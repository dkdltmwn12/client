import React, { useEffect, useState } from 'react'
import BoardDropdown from '../components/Board/BoardDropdown'
import ArticleList from '../components/Board/articles/ArticleList'
import { useDispatch, useSelector } from 'react-redux'
import { fetchingBoardList } from '../features/board/boardSlice';

export default function Board() {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const articleList = useSelector((state) => state.board.getBoard.filteredArticleList);
  const sortedList = articleList.map(article => article).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 

  useEffect(() => {
    dispatch(fetchingBoardList())
  }, [dispatch])

  return (
    <div className='w-full  h-full'>
      <div className='w-[85%] pt-5 m-auto text-center min-w-[320px] max-w-[930px]'>
        <span className='w-[85%] text-4xl'>DUO 게시판</span>
      </div>
      <section className='h-full min-h-[800px] m-auto max-w-[930px] mobile:w-[95%] tablet:w-[93%] tablet_big:w-[85%] '>
        <BoardDropdown setPage={setPage}/>
        {sortedList && (<ArticleList sortedList={sortedList} page={page} setPage={setPage} />)}
      </section>
    </div>
  )
}
