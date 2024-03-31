import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import {v4 as uuidv4} from 'uuid'
import { fetchingRecentSoloRankMatchListForStat, fetchingSummoner} from '../features/summoner/summonerSlice';
import {IoIosWarning} from 'react-icons/io'
import {AiOutlinePlus} from 'react-icons/ai'
import Profile from '../components/Summoner/Profile';
import MatchList from '../components/matchList/MatchList';
import TierProfile from '../components/Summoner/TierProfile';
import MatchStat from '../components/matchList/MatchStat';
import LoadingSpinner from '../components/loading/LoadingSpinner';
import {fetchingAddMatchList, allAddedQueueMatchList, filteredAddedQueueMatchList, resetAddedMatchList } from '../features/match/addedMatchListSlice';
import LinearTimePerWinGraphStats from '../components/Stats/LinearTimePerWinGraphStats';
import BarTeamPerWinGraphStats from '../components/Stats/BarTeamPerWinGraphStats';
import BarPostionPerWinGraphStats from '../components/Stats/BarPostionPerWinGraphStats';
import { allQueueMatchList, fetchingRecentALLMatchList, fetchingSelectedTypeRecentMatchList, filteredQueueMatchList } from '../features/match/matchListSlice';
import RankStat from '../components/matchList/RankStat';


export default function SummonerDetails() {
  const options = [
    { value: 'ALL', label: '큐 타입(전체)'},
    { value: 490, label: '일반(빠른 대전)' }, // 420 솔랭 430 일반 440 자랭 490 빠대
    { value: 450, label: '무작위 총력전' },
  ];
  const {id} = useParams();
  const dispatch = useDispatch();

  const darkMode = useSelector(state => state.darkMode.darkMode);
  const summonerLoading = useSelector(state => state.summoner.loading);
  const summonerStatLoading = useSelector(state => state.summoner.matchStatLoading);
  const matchLoading = useSelector(state => state.matchList.loading);
  
  const targetInfo = useSelector(state => state.summoner.getSummoner);
  const matchListInfo = useSelector(state => state.matchList.getMatch);
  const filteredAddedMatchList = useSelector(state => state.addedMatch.getAddedMatch.filteredAddedMatchList);
  const {filteredMatchList, soloRankMatchList, teamRankMatchList, quickMatchList, ARAMMatchList} = matchListInfo;
  const {summonerInfo, summonerInfo : {puuid}, summonerTierInfo} = targetInfo;
  const allMatchList = [...(filteredMatchList ?? []), ...(filteredAddedMatchList ?? [])];

  const [selectedBtn, setSeletedBtn] = useState(1);
  const [selectedOption, setSelectedOption] = useState('ALL');
  const [queue, setQueue] = useState('ALL');
  const [nextPage, setNextPage] = useState(1);
  const [error, setError] = useState(null)

  useEffect(() => {
    dispatch(fetchingSummoner(id.includes('-') ? id : id.concat('#KR1').replace('#', '-')))
    .unwrap()
    .then(() => {
      setError(null); // 소환사 정보를 성공적으로 가져오면 에러를 초기화
    })
    .catch((err) => {
      console.log(err);
      setError({message : err.message, errorText: '소환사 검색에 실패했습니다.'}); // 실패 시 에러 설정
    });
    if (puuid) {
      dispatch(fetchingRecentSoloRankMatchListForStat(puuid))
      .then((response) => {
        setError(null); // 에러 초기화
        if(response.meta.requestStatus === 'fulfilled') {
          // setTimeout(() => {
            dispatch(fetchingRecentALLMatchList(puuid))
            .unwrap()
            .then(() => {
              setError(null); // 에러 초기화
            })
            .catch((err) => {
              setError({ message: err.message, errorText: '매치 리스트를 가져오는 데 실패했습니다.' }); // 실패 시 에러 설정
            });
          // }, 500);
        }
      })
      .catch((err) => {
        setError({ message: err.message, errorText: '소환사 검색에 실패했습니다.' }); // 실패 시 에러 설정
      });
    }
  }, [dispatch, puuid, id]);

  const handleQueueTypeBtn = (queueId, btnNum) => {
    if(queueId === 'ALL') { // 최근 전체 타입 15게임
      setSeletedBtn(btnNum)
      dispatch(allQueueMatchList())
      dispatch(allAddedQueueMatchList(id))
      dispatch(resetAddedMatchList())
      setQueue('ALL')
      setSelectedOption('ALL');
      setNextPage(1); 
    }
    else if(queueId === 420) { // 솔랭 버튼 클릭 시
      setNextPage(1); 
      if(soloRankMatchList && soloRankMatchList.length === 0) {
        dispatch(fetchingSelectedTypeRecentMatchList({type : queueId, puuid: puuid}))
        setSeletedBtn(btnNum)
        setSelectedOption(queueId)
      }
      else {
        setSeletedBtn(btnNum)
        dispatch(filteredQueueMatchList(queueId))
        dispatch(filteredAddedQueueMatchList({queueId, id}))
        dispatch(resetAddedMatchList())
        setQueue(queueId)
        setSelectedOption(queueId)
      }
    }
    else if(queueId === 440) { // 자랭 버튼 클릭 시
      setNextPage(1); 
      if(teamRankMatchList && teamRankMatchList.length === 0) {
        dispatch(fetchingSelectedTypeRecentMatchList({type : queueId, puuid: puuid}))
        setSeletedBtn(btnNum)
        setSelectedOption(queueId)
      }
      else {
        setSeletedBtn(btnNum)
        dispatch(filteredQueueMatchList(queueId))
        dispatch(filteredAddedQueueMatchList({queueId, id}))
        dispatch(resetAddedMatchList())
        setQueue(queueId)
        setSelectedOption(queueId)
      }
    }
  };
   
  const handleOptionChange = (e) => {
    const selectedtype = e.target.value
    setSelectedOption(e.target.value);
    setQueue(e.target.value)
    setSeletedBtn(null);

    if(selectedtype === 'ALL') { // 전체 셀렉트
      setNextPage(1); 
      setSeletedBtn(1)
      dispatch(allQueueMatchList())
      dispatch(allAddedQueueMatchList(id))
      dispatch(resetAddedMatchList())
    }
    else if(parseInt(selectedtype) === 490) { // 빠대 셀렉트
      setNextPage(1); 
      if(quickMatchList && quickMatchList.length === 0) {
        dispatch(fetchingSelectedTypeRecentMatchList({type : parseInt(selectedtype), puuid: puuid}))
      }
      else {
        dispatch(filteredQueueMatchList(parseInt(selectedtype)))
        dispatch(filteredAddedQueueMatchList({queueId: parseInt(selectedtype), id}))
        dispatch(resetAddedMatchList())
      }
    }
    else if(parseInt(selectedtype) === 450) { // 칼바람 셀렉트
      setNextPage(1); 
      if(ARAMMatchList && ARAMMatchList.length === 0) {
        dispatch(fetchingSelectedTypeRecentMatchList({type : parseInt(selectedtype), puuid: puuid}))
      }
      else {
        dispatch(filteredQueueMatchList(parseInt(selectedtype)))
        dispatch(filteredAddedQueueMatchList({queueId: parseInt(selectedtype), id}))
        dispatch(resetAddedMatchList())
      }
    }
  };

  const addMatchListHandle = () => {
    if(selectedOption === 'ALL') { // 전체일 때 added match 버튼 클릭 시
      setNextPage(nextPage => nextPage + 1);
      dispatch(fetchingAddMatchList({id: summonerInfo.name, puuid: summonerInfo.puuid, type: selectedOption, page: nextPage}))
      .then(() => {
        dispatch(allQueueMatchList())
        dispatch(allAddedQueueMatchList(id.replace('#', '-').split('-')[0]))
      })

    }
    else  { // 전체가 아닌 added match 버튼 클릭 시
      setNextPage(nextPage => nextPage + 1);
      dispatch(fetchingAddMatchList({id: summonerInfo.name, puuid: summonerInfo.puuid, type: parseInt(selectedOption), page: nextPage}))
      .then(() => {
        dispatch(filteredQueueMatchList(parseInt(selectedOption)))
        dispatch(filteredAddedQueueMatchList({type: parseInt(selectedOption), id : id.split('-')[0]}))
      })
    }
  };
  return (
  <>
    {error !== null ? (
      <div className='flex max-w-[1080px] m-auto flex-col pt-5 justify-center items-center'>
        <div><IoIosWarning className='text-8xl'/></div>
        <div>{error.errorText}</div>
        <div>{error.message}</div>
      </div>)
      : (
        <>
          {summonerLoading || matchLoading || summonerStatLoading ? (<LoadingSpinner/>) : (
            <>
              {summonerInfo &&  (
              <>
                <Profile summonerInfo={summonerInfo} summonerTierInfo={summonerTierInfo}/>
                <div className='w-full bg-slate-500 dark:bg-slate-900'>
                  <section className={allMatchList.length > 0 ? ' w-[85%] mobile:w-[95%] xl:w-[85%] max-w-[1200px] h-full m-auto pt-5' : ' w-[85%] mobile:w-[95%] xl:w-[85%] max-w-[1200px] h-[1450px] m-auto pt-5'}>
                    <div className='mobile:w-full tablet_big:flex tablet_big:flex-col min-[812px]:inline-block lg:inline-flex lg:w-[310px]'>
                      <TierProfile summonerTierInfo={summonerTierInfo}/>
                      <RankStat summonerInfo={summonerInfo} summonerTierInfo={summonerTierInfo}/>
                      {allMatchList.length > 0 && (
                        <div className='w-full mobile:m-0  tablet_big:flex tablet_big:flex-wrap tablet_big:mt-4'>
                          <div className='w-full h-[416px] bg-slate-400 dark:bg-slate-800 rounded-md mobile:mt-20 mobile:flex mobile:flex-col tablet_big:mt-0 tablet_big:w-[49.6%] min-[812px]:w-[33%] lg:w-[310px] lg:mt-20 '>
                            <div className='pt-2 pl-2 mobile:text-base min-[812px]:text-sm lg:text-lg'>시간 별 승률</div>
                            <LinearTimePerWinGraphStats darkMode={darkMode} allMatchList={allMatchList}/>
                          </div>
                          <div className='w-full h-[416px] bg-slate-400 dark:bg-slate-800 rounded-md mobile:mt-4 mobile:flex mobile:flex-col tablet_big:mt-0 tablet_big:w-[49.7%] tablet_big:ml-1 min-[812px]:w-[32.9%] lg:w-[310px] lg:ml-0 lg:mt-4 '>
                            <div className='pt-2 pl-2 mobile:text-base min-[812px]:text-sm lg:text-lg'>팀(Red/Blue) 별 승률</div>
                            <BarTeamPerWinGraphStats darkMode={darkMode} allMatchList={allMatchList}/>
                          </div>
                          <div className='w-full h-[416px] bg-slate-400 dark:bg-slate-800 rounded-md mobile:mt-4 mobile:flex mobile:flex-col tablet_big:mt-4 tablet_big:w-full tablet_big:ml-0 min-[812px]:w-[33%] min-[812px]:ml-1 min-[812px]:mt-0 lg:w-[310px] lg:ml-0 lg:mt-4 xl:w-[310px] xl:ml-0 xl:mt-4   '>
                            <div className='pt-2 pl-2 mobile:text-base min-[812px]:text-sm lg:text-lg'>포지션 별 승률(무작위 총력전 제외)</div>
                            <BarPostionPerWinGraphStats darkMode={darkMode} allMatchList={allMatchList}/>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className='match-list align-top max-w-[1200px] mobile:w-full lg:w-[66%] lg:inline-block lg:ml-3 xl:ml-5 '>
                      <div className=' bg-slate-400 dark:bg-slate-800 rounded-tl-md rounded-tr-md flex mobile:p-1 mobile:mt-4 lg:p-2 lg:mt-0 mobile:text-xs tablet:text-base'>
                        <ul className=' flex'>
                          <li className={selectedBtn === 1 ? ' bg-slate-300 dark:bg-gray-700 font-bold rounded-md ' : ' cursor-pointer hover:bg-slate-500 hover:dark:bg-slate-600 rounded-md '}>
                            <button className='mobile:p-0.5 lg:p-1' disabled={selectedBtn === 1} onClick={() => handleQueueTypeBtn('ALL', 1)}>전체</button>
                          </li>
                          <li className={selectedBtn === 2 ? 'ml-2 bg-slate-300 dark:bg-gray-700 font-bold rounded-md ' : 'ml-2 cursor-pointer hover:bg-slate-500 hover:dark:bg-slate-600 rounded-md '}>
                            <button className='mobile:p-0.5 lg:p-1' disabled={selectedBtn === 2} onClick={() => handleQueueTypeBtn(420, 2)}>솔로랭크</button>
                          </li>
                          <li className={selectedBtn === 3 ? 'ml-2 bg-slate-300 dark:bg-gray-700 font-bold rounded-md ' : 'ml-2 cursor-pointer hover:bg-slate-500 hover:dark:bg-slate-600 rounded-md '}>
                            <button className='mobile:p-0.5 lg:p-1' disabled={selectedBtn === 3} onClick={() => handleQueueTypeBtn(440, 3)}>자유랭크</button>
                          </li>
                          <li className='ml-2'>
                            <span className='inline-block'>
                              <select className={
                                queue === 'ALL' ? 
                                'mobile:p-0.5 lg:p-1 bg-slate-400 dark:bg-slate-800 outline-none rounded-md cursor-pointer hover:bg-slate-500 hover:dark:bg-slate-600'
                                : 'mobile:p-0.5 lg:p-1 bg-slate-500 dark:bg-slate-600 outline-none rounded-md cursor-pointer hover:bg-slate-500 hover:dark:bg-slate-600'
                                } value={selectedOption} onChange={handleOptionChange}>
                                {options.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </span>
                          </li>
                        </ul>
                      </div>
                      {filteredMatchList && (<MatchStat filteredMatchList={filteredMatchList} filteredAddedMatchList={filteredAddedMatchList} />)}
                      <div className='mobile:mt-2 tablet:mt-3 tablet_big:mt-5 md:mt-7 lg:mt-3 w-full'>
                        {allMatchList && allMatchList.map((match) =>(<MatchList key={uuidv4()} match={match}/>))}
                      </div>
                      {allMatchList.length > 0 && (
                        <>
                          <button onClick={() => addMatchListHandle()} className='w-full h-[65px] bg-slate-400 dark:bg-slate-800 rounded-md border-[1px] border-black dark:border-white'>
                            <AiOutlinePlus className='text-4xl m-auto'/>
                          </button>
                        </>
                      )}
                    </div>
                  </section>
                </div>
              </>
            )}
          </>
        )}
      </>
    )}   
  </>
  )
}
