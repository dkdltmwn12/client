import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {v4 as uuidv4} from 'uuid'
import { deleteSummonerBookMark, deleteRecentSearchedSummoner, addSummonerBookMark } from '../../features/recentSearch/recentSearchSlice';
import { MdOutlineCancel } from 'react-icons/md';
import { IoIosWarning } from 'react-icons/io';
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function RecentSearchedList() {
    const dispatch = useDispatch();
    const recentSearchList = useSelector(state => state.recentSearch.getRecent.getRecentSearchList);
    const bookMarkList = useSelector(state => state.recentSearch.getRecent.getBookMarkList);

    const [toggleMenu, setToggleMenu] = useState('recent');

    const getBookMarkStatus = (search) => {
        const foundTarget = recentSearchList.find(target => target.name === search.name);
        return foundTarget.bookMark;
    };

    const onClickBookMarkHandle = (search) => {
        const currentBookMarkStatus = getBookMarkStatus(search);
        const newBookMarkStatus = !currentBookMarkStatus;
        if (newBookMarkStatus) {
          dispatch(addSummonerBookMark(search));
        }
        else {
          dispatch(deleteSummonerBookMark(search));
        }

    }
  return (
    <>
        <div className='max-w-[600px] h-[35px] '>
            <button disabled={toggleMenu === 'recent'} onClick={() => setToggleMenu('recent')}
                className={toggleMenu === 'recent' ? 'w-[50%] h-full p-1 bg-slate-500 dark:bg-slate-600 text-xs cursor-pointer' : 'w-[50%] h-full p-1 bg-slate-400 dark:bg-slate-900 text-xs cursor-pointer'}>
                최근 검색한 소환사
            </button>
            <button disabled={toggleMenu === 'bookmark'} onClick={() => setToggleMenu('bookmark')}
                className={toggleMenu === 'bookmark' ? 'w-[50%] h-full p-1 bg-slate-500 dark:bg-slate-600 text-xs cursor-pointer' : 'w-[50%] h-full p-1 bg-slate-400 dark:bg-slate-900 text-xs cursor-pointer'}>
                즐겨찾기
            </button>
        </div>
        <ul className='min-h-[215px] bg-slate-500 dark:bg-slate-600'> 
            {toggleMenu === 'recent' ? (
                <>
                    {recentSearchList.length > 0 ? (
                        <>
                            {recentSearchList.map(search => (
                            <li key={uuidv4()} className=' flex items-center justify-between p-2 cursor-pointer hover:bg-slate-300 hover:dark:bg-slate-700'>
                                <Link className='w-[90%] mobile:text-xs tablet:text-sm lg:text-base' to={`/summoner/${search.name.replace('#', '-').split('-')[0]}-${search.tag}`}>{search.name.replace('#', '-').split('-')[0]} #{search.tag}</Link>
                                {toggleMenu === 'recent' && (<button className='mr-3' onClick={() => onClickBookMarkHandle(search)}>{search.bookMark ? <FaBookmark/> : <FaRegBookmark/>}</button>)}
                                <button className='' onClick={() =>  dispatch(deleteRecentSearchedSummoner(search))}><MdOutlineCancel/></button>
                            </li>
                            ))}
                        </>
                        ) : (
                        <li className='w-[250px] h-[250px] m-auto flex flex-col justify-center items-center'>
                            <IoIosWarning className=' text-8xl'/>
                            최근 검색한 소환사가 없습니다.
                        </li>
                    )}
                </>
            ) : (
                <>
                    {bookMarkList.length > 0 ? (
                        <>
                            {bookMarkList.map(search => (
                            <li key={uuidv4()} className=' flex items-center justify-between p-2 cursor-pointer hover:bg-slate-300 hover:dark:bg-slate-700'>
                                <Link className='w-[90%] mobile:text-xs tablet:text-sm lg:text-base' to={`/summoner/${search.name}-${search.tag}`}>{search.name} #{search.tag}</Link>
                                <button className='' onClick={() =>  dispatch(deleteSummonerBookMark(search.name))}><MdOutlineCancel/></button>
                            </li>
                            ))}
                        </>
                        ) : (
                        <li className='w-[250px] h-[250px] m-auto flex flex-col justify-center items-center'>
                            <FaBookmark className=' text-8xl mb-1'/>
                            즐겨찾기를 추가하세요.
                        </li>
                    )}
                </>
            )}
        </ul>
    </>
  )
}
