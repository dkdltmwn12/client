import React from 'react'
import ArticleCard from './ArticleCard'
import {IoIosWarning} from 'react-icons/io'
import LoadingSpinner from '../../loading/LoadingSpinner';
import { useSelector } from 'react-redux';
import {v4 as uuidv4} from 'uuid'
export default function ArticleList({sortedList, page, setPage}) {

  const isLoading = useSelector((state) => state.board.loading);
  const maximumViewPage = 5; // 한 화면에 보여줄 수 있는 최대 페이지 갯수
  const maximumViewList = 6; // 한 페이지에 보여주는 리스트의 최대 갯수
  const pageEndPoint = Math.ceil(sortedList.length / maximumViewList) // 마지막 페이지
  const indexOfStartPost = (page - 1) * maximumViewList + 1; // 한페이지의 시작 포스트 번호
  const indexOfEndPost = indexOfStartPost + maximumViewList - 1; // 한페이지의 마지막 포스트 번호
  const currentList = sortedList.slice(indexOfStartPost - 1, indexOfEndPost); // 한화면에 나오는 리스트 1 ~ 6개
  const currentSet = Math.ceil(page / maximumViewPage); // 페에지 갯수의 세트 별 숫자 (1-5는 1, 6-10는 2, ...)
  const indexOfStartPage = (currentSet - 1) * maximumViewPage + 1; // 현재 보여지는 시작 페이지 인덱스 

  return (
    <>
      {isLoading ? 
        (        
          <div className='w-[1200px] h-[790px] bg-slate-800'>
            <LoadingSpinner/>
          </div>
        ) : (
        <>
          {currentList.length > 0 ? 
            (
              <>
                <div className={`w-full h-full flex flex-wrap content-baseline bg-slate-500 dark:bg-slate-900 rounded-md mobile:max-w-[303px] mobile:m-auto mobile:mt-5 tablet:max-w-[526px] tablet:min-h-[924px] lg:max-w-[834px] lg:min-h-[616px] xl:max-w-[922px] xl:min-h-[624px] `}>
                  {currentList && currentList.map((article) => (<ArticleCard key={article._id} article={article}/>))}
                </div>
                <ul className='flex justify-center mobile:max-w-[308px] mobile:m-auto mobile:mt-2 tablet:max-w-[530px] min-[930px]:max-w-[790px] lg:max-w-[840px] xl:max-w-none'>
                  {pageEndPoint > 5 && (
                    <li onClick={() => setPage(1)} className='w-[25px] h-[25px] p-1 text-center text-xs bg-slate-500 dark:bg-slate-900 rounded-tl-md rounded-bl-md leading-[15px] cursor-pointer'>&lt;&lt;</li>
                  )}
                  <li onClick={() => page !== 1 && setPage(page - 1)} className='w-[25px] h-[25px] p-1 text-center text-xs bg-slate-500 dark:bg-slate-900 leading-[15px] cursor-pointer'>&lt;</li>
                  {Array(5).fill(indexOfStartPage).map((_, index) => (
                    <li key={uuidv4()} onClick={() => setPage(indexOfStartPage + index)} className={page === indexOfStartPage + index ? 'w-[25px] h-[25px] p-1 text-center text-xs bg-slate-400 dark:bg-slate-600 cursor-pointer' : 'w-[25px] h-[25px] p-1 text-center text-xs bg-slate-500 dark:bg-slate-900 cursor-pointer'}>
                      {indexOfStartPage + index} 
                    </li>
                  )).slice(0, (currentList.length === maximumViewList ? pageEndPoint : pageEndPoint - maximumViewPage))}
                  <li onClick={() => page !== Math.ceil(pageEndPoint) && setPage(page + 1)} className='w-[25px] h-[25px] p-1 text-center text-xs bg-slate-500 dark:bg-slate-900 leading-[15px] cursor-pointer'>&gt;</li>
                  {pageEndPoint > 5 && (
                    <li onClick={() => setPage(pageEndPoint)} className='w-[25px] h-[25px] p-1 text-center text-xs bg-slate-500 dark:bg-slate-900 rounded-tr-md rounded-br-md leading-[15px] cursor-pointer'>&gt;&gt;</li>
                  )}
                </ul>
              </>     
            ): 
            (
              <div className='w-full flex justify-center bg-slate-500 dark:bg-slate-900 rounded-md text-center mobile:max-w-[303px] mobile:h-[303px] mobile:m-auto mobile:mt-5 tablet:max-w-[526px] tablet:min-h-[924px] lg:max-w-[834px] lg:min-h-[616px] xl:max-w-[922px] xl:min-h-[624px] '>
                <div className='m-auto'>
                  <IoIosWarning className='m-auto text-9xl mb-2'/>
                  <span className='mobile:text-base tablet:text-4xl'>관련된 게시물이 없습니다.</span>
                </div>
              </div>
            )
          }
        </>
      )}
    </>
  )
}
