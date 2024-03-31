import React, { useEffect } from 'react'
import { fetchingBoardList } from '../../../features/board/boardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import  { Navigation } from 'swiper';
import {Swiper, SwiperSlide } from 'swiper/react';
import {v4 as uuidv4} from 'uuid'
import { FaSearchPlus } from "react-icons/fa";
import ArticleSlideCard from './ArticleSlideCard';
import { getCommentListFromDB } from '../../../features/comment/commentSlice';

export default function ArticleCarousel() {
    const dispatch = useDispatch()
    const articleList = useSelector((state) => state.board.getBoard.filteredArticleList).slice(0, 10);
    const commentList = useSelector(state => state.comment.getCommentList);
  
    useEffect(() => {
      dispatch(fetchingBoardList())
      dispatch(getCommentListFromDB())
    }, [dispatch])
    
  return (
    <div className='w-[95%] max-w-[1050px] m-auto mt-4 rounded-md'>
        <div className='font-bold cursor-pointer'>
            <Link className='p-2' to={'/board'}>DUO 게시판</Link>
        </div>
        <Swiper
            className='overflow-hidden'
            modules={[Navigation]}
            slideToClickedSlide={true}
            navigation
            slidesPerView={3}
            spaceBetween={5}
            breakpoints={{
                320: {
                    width: 304,
                    slidesPerView: 1,
                },
                600: {
                    width: 600,
                    slidesPerView: 2,
                },
                900: {
                    width: 900,
                    slidesPerView: 3,
                }
            }}
        >
        {articleList && articleList.reverse().map(article => (
            <SwiperSlide key={uuidv4()}>
                <ArticleSlideCard article={article} commentList={commentList}/>
            </SwiperSlide>
        ))}
            <SwiperSlide>
                <Link to={'/board'} className='flex flex-col justify-center items-center w-[295px] h-[300px] border-gray-400 border-1 rounded-md mt-1.5 ml-2 bg-slate-300 dark:bg-slate-700'>
                    <FaSearchPlus className='w-[75px] h-[75px] mb-2'/>
                    게시판 더보기
                </Link>
            </SwiperSlide>

        </Swiper>
    </div>
  )
}
