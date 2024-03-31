import React, { useEffect, useRef, useState } from 'react'
import { ImSearch } from 'react-icons/im';
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { parseTierNum } from '../../util/parseTierNum';
import { useDispatch, useSelector, } from 'react-redux';
import { addSummonerBookMark, deleteSummonerBookMark, addRecentSearchedSummonerList } from '../../features/recentSearch/recentSearchSlice';
import RecentSearchedList from '../SearchInput/RecentSearchedList';

export default function Profile({summonerTierInfo, summonerInfo, summonerInfo :{name, profileIconId, summonerLevel, inGameName, tagName}}) {

  const bookMarkList = useSelector(state => state.recentSearch.getRecent.getBookMarkList);
  const inputRef = useRef();
  const divRef = useRef();
  const [focus, setFocus] = useState(false);
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {solo} = summonerTierInfo;

  
  const onSubmitHandle = () => {
    if(nickname !== '') {
      setNickname(nickname)
      navigate(`/summoner/${nickname.includes('#') ? nickname.replace('#', '-') : nickname.concat('#KR1').replace('#', '-')}`)
    }
  }
  
  const onEnterHandle = (e) => {
    if(e.key === "Enter") {
      onSubmitHandle();
      dispatch(addRecentSearchedSummonerList({
        name : nickname.includes('#') ? nickname.replace('#', '-').split('-')[0] : nickname.concat('#KR1').replace('#', '-').split('-')[0],
        tag : nickname.includes('#') ? nickname.replace('#', '-').split('-')[1] : nickname.concat('#KR1').replace('#', '-').split('-')[1],
        bookMark: false,
      }))
    }
  }

  const clickWrapperTag = (e) => {
    // e.composedPath() event가 발생한 tag의 경로를 array로 반환, 최상위 경로(window > document > html > body > div#root > ... >)부터 내려옴. composedPath()[0] === e.target
    if(document.activeElement !== inputRef.current && !e.composedPath().includes(divRef.current)) {
      setFocus(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', clickWrapperTag);
  })

  return (
    <>
    {summonerInfo && (
      <div className='w-[85%] mobile:w-[95%] xl:w-[85%] max-w-[1200px] bg-slate-200 dark:bg-slate-800 m-auto'>
        <div className='w-full min-w-[288px] max-w-[363px] pt-2 mb-3 rounded-md  h-[38px]'>
          <div className='w-full h-full flex flex-row items-center rounded-md bg-white text-black'>
            <input ref={inputRef} className='w-[90%] h-full p-2 outline-none text-xl rounded-md'
              onFocus={() => setFocus(true)}
              type='text'
              placeholder='소환사 이름 + #태그'
              value={nickname}
              onKeyDown={onEnterHandle}
              onChange={(e) => setNickname(e.target.value)}
            />
            <div className='w-[10%] h-full flex'>
              <button className='flex items-center w-[100%] h-full text-xl text-gray-500 dark:text-blue-950' onClick={onSubmitHandle}><ImSearch className='w-[100%]'/></button>
            </div>
          </div>
          {focus && (
            <div ref={divRef} className='absolute z-10 w-[85%] min-w-[288px] max-w-[363px] mt-0.5 min-h-[250px] bg-slate-900'>
              <RecentSearchedList/>
            </div>
          )}
        </div>
        <div className='flex gap-4 w-full min-w-[288px] max-w-[363px]'>
          <div className=''>
            <img className='w-[90px] rounded-3xl' src={`https://ddragon.leagueoflegends.com/cdn/13.24.1/img/profileicon/${profileIconId}.png`} alt={profileIconId}/>
            <div className='flex w-[25px] m-auto -translate-y-4 bg-slate-500 dark:bg-slate-900 rounded-md justify-items-center text-sm'>{summonerLevel}</div>
          </div>
          <div className=' w-[100%]'>
            {solo.stat === 'unranked' ? (
              <div className='flex'>
                <span className='mr-5 mobile:text-base'>{solo.stat}</span>
                {bookMarkList.some(target => target.name === inGameName) ? (
                  <button onClick={() => dispatch(deleteSummonerBookMark(inGameName))} className='flex items-center w-[28px] rounded-md bg-slate-500 dark:bg-slate-900'>
                    <FaBookmark className='cursor-pointer w-full'/>
                  </button>
                  ) : (
                  <button onClick={() => dispatch(addSummonerBookMark({name : inGameName, tag : tagName, bookMark: true}))} className='flex items-center w-[28px] rounded-md bg-slate-500 dark:bg-slate-900'>
                    <FaRegBookmark className='cursor-pointer w-full'/>
                  </button>
                )}
              </div>
              ) : (
              <div className='flex'>
                <span className='mr-5 mobile:text-base'>{solo.stat.tier} {solo.stat.tier !== 'MASTER' && solo.stat.tier !== 'GRANDMASTER' && solo.stat.tier !== 'CHALLENGER' && parseTierNum(solo.stat.rank)} | {solo.stat.leaguePoints} LP</span>
                <>
                  {bookMarkList.some(target => target.name === inGameName) ? (
                    <button onClick={() => dispatch(deleteSummonerBookMark(inGameName))} className='flex items-center w-[28px] rounded-md bg-slate-500 dark:bg-slate-900'>
                      <FaBookmark  className='cursor-pointer w-full' />
                    </button>
                    ) : (
                    <button onClick={() => dispatch(addSummonerBookMark({name : inGameName, tag : tagName, bookMark: true}))} className='flex items-center w-[28px] rounded-md bg-slate-500 dark:bg-slate-900'>
                      <FaRegBookmark className='cursor-pointer w-full' />
                    </button>
                  )}
                </>
              </div>)
            }
            <div className='font-bold mt-1 mobile:text-lg lg:text-xl'>{inGameName} #{tagName}</div>
            <div className='mt-1 mobile:text-xs lg:text-sm'>PrevName. {name}</div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
