import React, { useEffect, useRef, useState } from 'react'
import {ImSearch} from 'react-icons/im'
import { useNavigate} from 'react-router-dom'
import RecentSearchedList from './RecentSearchedList';
import { useDispatch } from 'react-redux';
import { addRecentSearchedSummonerList } from '../../features/recentSearch/recentSearchSlice';

export default function SearchInput() {
  const inputRef = useRef(null);
  const ulRef = useRef(null);
  const [name, setName] = useState('');
  const [focus, setFocus] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmitHandle = () => {
    if(name !== '') {
      setName(name);
      navigate(`./summoner/${name.includes('#') ? name.replace('#', '-') : name.concat('#KR1').replace('#', '-')}`);
    }
 
  }
  const onEnterHandle = (e) => {
    if(e.key === "Enter") {
      onSubmitHandle();
      dispatch(addRecentSearchedSummonerList({
        name : name.includes('#') ? name.replace('#', '-').split('-')[0] : name.concat('#KR1').replace('#', '-').split('-')[0],
        tag : name.includes('#') ? name.replace('#', '-').split('-')[1] : name.concat('#KR1').replace('#', '-').split('-')[1],
        bookMark: false
      }))
    }
  }

  const clickWrapperTag = (e) => {
    // e.composedPath() event가 발생한 tag의 경로를 array로 반환, 최상위 경로(window > document > html > body > div#root > ... >)부터 내려옴. composedPath()[0] === e.target
    if(document.activeElement !== inputRef.current && !e.composedPath().includes(ulRef.current)) {
      setFocus(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', clickWrapperTag)
  })

  return (
    <>
      <div className='w-[95%] m-auto mt-3 rounded-md h-[58px] mobile_big:max-w-[600px]  '>
        <div className='h-full flex flex-row rounded-md bg-white'>
          <input className='w-[90%] h-full p-2 outline-none text-black text-xl rounded-md'
            ref={inputRef}
            onFocus={() => setFocus(true)}
            type='text'
            placeholder='소환사 이름 + #태그'
            value={name}
            onKeyDown={onEnterHandle}
            onChange={(e) => setName(e.target.value)}/>
          <div className='w-[10%] h-full flex'>
            <button className='flex items-center w-[100%] h-full text-xl text-gray-500 dark:text-blue-950' onClick={onSubmitHandle}><ImSearch className='w-[100%] h-[29px]'/></button>
          </div>
        </div>
      </div>
      {focus && (
        <ul ref={ulRef} className='absolute z-10 w-[95%] m-auto mt-0.5 max-w-[600px]  right-0 -left-[1px]'>
          <RecentSearchedList/>
        </ul>
      )} 
    </>
  )
}
