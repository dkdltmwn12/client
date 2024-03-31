import React, { useEffect, useRef, useState } from 'react'
import champData from '../../util/champion.json';
import {v4 as uuidv4} from 'uuid'
import { FaQuestion } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { fetchingRecentTeamRankMatchListForStat } from '../../features/summoner/summonerSlice';
const championImgURL = 'http://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/';

export default function RankStat({summonerInfo, summonerTierInfo}) {
  const dispatch = useDispatch();
  const [rankType, setRankType] = useState('solo');
  const ulRef = useRef(null);
  const [width, setWidth] = useState(ulRef.current)
  const {puuid} = summonerInfo;
  const {solo : {recentSoloRankMatch}, team : {recentTeamRankMatch}} = summonerTierInfo;

  useEffect(() => {
    const logWidth = () => {
      if (ulRef.current) {
        const componentWidth = ulRef.current.offsetWidth;
        setWidth(componentWidth)
        return componentWidth
      }
    };
    logWidth();
  
    window.addEventListener('resize', logWidth);
    return () => {
      window.removeEventListener('resize', logWidth);
    };
  }, []);

  const onClickSoloRankStat = () => {
    setRankType('solo')
  }

  const onClickTeamRankStat = () => {
    setRankType('team');
    dispatch(fetchingRecentTeamRankMatchListForStat(puuid)) 

  }
  return (
    <div className='bg-slate-400 dark:bg-slate-800 rounded-md mt-4'>
      <div className='flex justify-center border-black dark:border-white border-b-2'>{rankType === 'solo' ? `최근(10게임) 솔로랭크 통계` : `최근(10게임) 자유랭크 통계`}</div>
      <div className='p-1'>
        <button onClick={onClickSoloRankStat} className={rankType === 'solo' ? 'w-[50%] bg-slate-500 dark:bg-slate-700 rounded-md outline-none' : 'w-[50%]  rounded-md outline-none'}>솔로랭크</button>
        <button onClick={onClickTeamRankStat} className={rankType === 'team' ? 'w-[50%] bg-slate-500 dark:bg-slate-700 rounded-md outline-none' : 'w-[50%]  rounded-md outline-none'}>자유랭크</button>
      </div>
      <ul className='flex flex-col items-center justify-center' ref={ulRef}>
        {rankType === 'solo' && recentSoloRankMatch.length > 0 && (
          <ul className='ml-1.5 mt-2 flex text-xs'>
            <li className='min-w-[140px]'>챔피언 / CS</li>
            <li className='flex justify-center w-[90px]'>KDA</li>
            <li className='flex justify-center w-[60px]'>승률</li>
            {width >= 348 && (<li className='flex justify-center w-[40px]'>최대 킬</li>)}
            {width >= 390 && (<li className='flex justify-center w-[60px]'>최대 데스</li>)}
            {width >= 455 && (<li className='flex justify-center w-[65px]'>가한 피해량</li>)}
            {width >= 520 && (<li className='flex justify-center w-[65px]'>받은 피해량</li>)}
            {width >= 568 && (<li className='flex justify-center w-[48px]'>더블 킬</li>)}
            {width >= 630 && (<li className='flex justify-center w-[52px]'>트리플 킬</li>)}
            {width >= 685 && (<li className='flex justify-center w-[55px]'>쿼드라 킬</li>)}
            {width >= 733 && (<li className='flex justify-center w-[48px]'>펜타 킬</li>)}
            {width >= 781 && (<li className='flex justify-center w-[48px]'>골드</li>)}
            {width >= 829 && (<li className='flex justify-center w-[48px]'>CS</li>)}
            {width >= 889 && (<li className='flex justify-center w-[60px]'>시야 점수</li>)}
          </ul>
        )}
        {rankType === 'team' && recentTeamRankMatch.length > 0 && (
          <ul className='ml-1.5 mt-2 flex text-xs'>
            <li className='min-w-[140px]'>챔피언 / CS</li>
            <li className='flex justify-center w-[90px]'>KDA</li>
            <li className='flex justify-center w-[60px]'>승률</li>
            {width >= 348 && (<li className='flex justify-center w-[40px]'>최대 킬</li>)}
            {width >= 390 && (<li className='flex justify-center w-[60px]'>최대 데스</li>)}
            {width >= 455 && (<li className='flex justify-center w-[65px]'>가한 피해량</li>)}
            {width >= 520 && (<li className='flex justify-center w-[65px]'>받은 피해량</li>)}
            {width >= 568 && (<li className='flex justify-center w-[48px]'>더블 킬</li>)}
            {width >= 630 && (<li className='flex justify-center w-[52px]'>트리플 킬</li>)}
            {width >= 685 && (<li className='flex justify-center w-[55px]'>쿼드라 킬</li>)}
            {width >= 733 && (<li className='flex justify-center w-[48px]'>펜타 킬</li>)}
            {width >= 781 && (<li className='flex justify-center w-[48px]'>골드</li>)}
            {width >= 829 && (<li className='flex justify-center w-[48px]'>CS</li>)}
            {width >= 889 && (<li className='flex justify-center w-[60px]'>시야 점수</li>)}
          </ul>
        )}
        {rankType === 'solo' && recentSoloRankMatch && recentSoloRankMatch.map(match => (
          <li key={uuidv4()} className='ml-1.5 flex items-center h-[50px] text-xs'>
            <div className='min-w-[50px]'>
              <img className='w-[30px] h-[30px] rounded-full' src={`${championImgURL}${match.championName}.png`} alt={match.championName}/>
            </div>
            <div className='min-w-[90px]'>
              <div className='font-bold'>{champData.data[match.championName].name}</div>
              <div>CS {match.cs}</div>
            </div>
            <div className='w-[90px] flex flex-col items-center'>
              <div className={
                ((match.kda / match.played).toFixed(2) >= 3 && (match.kda / match.played).toFixed(2) < 4) ? ' text-teal-400 dark:text-kda-3over'
                : ((match.kda / match.played).toFixed(2) >= 4 && (match.kda / match.played).toFixed(2) < 5) ? ' text-blue-500 dark:text-kda-4over'
                : (match.kda / match.played).toFixed(2) >= 5 ? ' text-orange-400 dark:text-kda-5over'
                : ''
              }>{(match.kda / match.played).toFixed(2)} 평점</div>
              <div>{match.kills} / {match.deaths} / {match.assists}</div>
            </div>
            <div className='w-[60px] flex flex-col items-center'>
              <div className={Math.floor((match.win / match.played) * 100).toFixed(0) >= 60 ? 'text-red-500 ' : ''}>{Math.floor((match.win / match.played) * 100)}%</div>
              <div>{match.played}게임</div>
            </div>
            {width >= 348 && (
              <div className='text-center w-[40px]'>
                {match.maximumKills}
              </div>
            )}
            {width >= 390 && (
              <div className='text-center w-[60px]'>
                {match.maximumDeaths}
              </div>
            )}
            {width >= 455 && (
              <div className='text-center w-[65px]'>
                {match.totalDamageDealtToChampions}
              </div>
            )}
            {width >= 520 && (
              <div className='text-center w-[65px]'>
                {match.totalDamageTaken}
              </div>
            )}
            {width >= 568 && (
              <div className={match.doubleKills !== 0 ? 'text-center font-bold text-red-600 w-[48px]' : 'text-center w-[48px]'}>
                {match.doubleKills}
              </div>
            )}
            {width >= 630 && (
              <div className={match.tripleKills !== 0 ? 'text-center font-bold text-red-600 w-[52px]' : 'text-center w-[52px]'}>
                {match.tripleKills}
              </div>
            )}
            {width >= 685 && (
              <div className={match.quadraKills !== 0 ? 'text-center font-bold text-red-600 w-[55px]' : 'text-center w-[55px]'}>
                {match.quadraKills}
              </div>
            )}
            {width >= 733 && (
              <div className={match.pentaKills !== 0 ? 'text-center font-bold text-red-600 w-[48px]' : 'text-center w-[48px]'}>
                {match.pentaKills}
              </div>
            )}
            {width >= 781 && (
              <div className='text-center w-[48px]'>
                {match.goldEarned}
              </div>
            )}
            {width >= 829 && (
              <div className='text-center w-[48px]'>
                {match.cs} ({(match.cs / match.played).toFixed(1)})
              </div>
            )}
            {width >= 889 && (
              <div className='text-center w-[60px]'>
                {match.visionScore} ({(match.visionScore / match.played).toFixed(1)})
              </div>
            )}
          </li>
        ))}
        {rankType === 'team' && recentTeamRankMatch && recentTeamRankMatch.map(match => (
          <li key={uuidv4()} className='ml-1.5 flex items-center h-[50px] text-xs'>
            <div className='min-w-[50px]'>
              <img className='w-[30px] h-[30px] rounded-full' src={`${championImgURL}${match.championName}.png`} alt={match.championName}/>
            </div>
            <div className='min-w-[90px]'>
              <div className='font-bold'>{champData.data[match.championName].name}</div>
              <div>CS {match.cs}</div>
            </div>
            <div className='w-[90px] flex flex-col items-center'>
              <div className={
                ((match.kda / match.played).toFixed(2) >= 3 && (match.kda / match.played).toFixed(2) < 4) ? ' text-teal-400 dark:text-kda-3over'
                : ((match.kda / match.played).toFixed(2) >= 4 && (match.kda / match.played).toFixed(2) < 5) ? ' text-blue-500 dark:text-kda-4over'
                : (match.kda / match.played).toFixed(2) >= 5 ? ' text-orange-400 dark:text-kda-5over'
                : ''
              }>{(match.kda / match.played).toFixed(1)} 평점</div>
              <div>{match.kills} / {match.deaths} / {match.assists}</div>
            </div>
            <div className='w-[60px] flex flex-col items-center'>
              <div className={Math.floor((match.win / match.played) * 100).toFixed(0) >= 60 ? 'text-red-500 ' : ''}>{Math.floor((match.win / match.played) * 100)}%</div>
              <div>{match.played}게임</div>
            </div>
            {width >= 348 && (
              <div className='text-center w-[40px]'>
                {match.maximumKills}
              </div>
            )}
            {width >= 390 && (
              <div className='text-center w-[60px]'>
                {match.maximumDeaths}
              </div>
            )}
            {width >= 455 && (
              <div className='text-center w-[65px]'>
                {match.totalDamageDealtToChampions}
              </div>
            )}
            {width >= 520 && (
              <div className='text-center w-[65px]'>
                {match.totalDamageTaken}
              </div>
            )}
            {width >= 568 && (
              <div className={match.doubleKills !== 0 ? 'text-center font-bold text-red-600 w-[48px]' : 'text-center w-[48px]'}>
                {match.doubleKills}
              </div>
            )}
            {width >= 630 && (
              <div className={match.tripleKills !== 0 ? 'text-center font-bold text-red-600 w-[52px]' : 'text-center w-[52px]'}>
                {match.tripleKills}
              </div>
            )}
            {width >= 685 && (
              <div className={match.quadraKills !== 0 ? 'text-center font-bold text-red-600 w-[55px]' : 'text-center w-[55px]'}>
                {match.quadraKills}
              </div>
            )}
            {width >= 733 && (
              <div className={match.pentaKills !== 0 ? 'text-center font-bold text-red-600 w-[48px]' : 'text-center w-[48px]'}>
                {match.pentaKills}
              </div>
            )}
            {width >= 781 && (
              <div className='text-center w-[48px]'>
                {match.goldEarned}
              </div>
            )}
            {width >= 829 && (
              <div className='text-center w-[48px]'>
                {match.cs} ({(match.cs / match.played).toFixed(1)})
              </div>
            )}
            {width >= 889 && (
              <div className='text-center w-[60px]'>
                {match.visionScore} ({(match.visionScore / match.played).toFixed(1)})
              </div>
            )}
          </li>
        ))}
        {rankType === 'solo' && recentSoloRankMatch.length === 0 && (
          <div className='mt-2 mb-2'>
            <div className='m-auto'>
              <FaQuestion className='m-auto text-5xl mb-2'/>
              <span className='text-base'>최근 솔로랭크 전적이 없습니다.</span>
            </div>
          </div>
        )}
        {rankType === 'team' && recentTeamRankMatch.length === 0 && (
          <div className='mt-2 mb-2'>
            <div className='m-auto'>
              <FaQuestion className='m-auto text-5xl mb-2'/>
              <span className='text-base'>최근 자유랭크 전적이 없습니다.</span>
            </div>
          </div>
        )}
      </ul>
    </div>
  )
}
