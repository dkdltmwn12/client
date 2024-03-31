import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {IoIosWarning} from 'react-icons/io'
import {useSelector } from 'react-redux';
import { best3ChampList } from '../../util/recentMostChamp';

const championImgURL = 'http://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/';

export default function MatchStat({filteredMatchList, filteredAddedMatchList}) {
    const {id} = useParams();
    const [width, setWidth] = useState(window.innerWidth);
    
    const recentplayedChampList = useSelector(state => state.matchList.getMatch.recentPlayed3Champion);
    const addedRecentPlayedChampList = useSelector(state => state.addedMatch.getAddedMatch.addedRecentPlayed3Champion);
    const concatRecentPlayedChampList = [...recentplayedChampList, ...addedRecentPlayedChampList];
    const bestPlayedChampionList = best3ChampList(concatRecentPlayedChampList);
    const allMatchList = [...filteredMatchList, ...filteredAddedMatchList];
    const searchedTargetRecord = allMatchList.filter(match => match.info.gameDuration > 215).map(match => match.info.participants.filter(participant => participant.riotIdGameName && participant.riotIdGameName.toUpperCase() === id.toUpperCase().split('-')[0])).flatMap(arr => arr);
    const winRecord = searchedTargetRecord.filter(record => record.win === true);
    const loseRecord = searchedTargetRecord.filter(record => record.win !== true);

    const targetTotalKills = searchedTargetRecord.map(record => record.kills).reduce((acc, curr) => acc + curr, 0);
    const targetTotalDeaths = searchedTargetRecord.map(record => record.deaths).reduce((acc, curr) => acc + curr, 0);
    const targetTotalAssists = searchedTargetRecord.map(record => record.assists).reduce((acc, curr) => acc + curr, 0);
    const targetTotalkdaRate = searchedTargetRecord.map(target => Number(target.challenges.kda.toFixed(2))).reduce((acc, curr) => acc + curr, 0);
    const myTeamID = searchedTargetRecord.map(target => target.teamId);
    const myTeam = myTeamID.map((teamId, index) => allMatchList[index].info.participants.filter(participant => participant.teamId === teamId).map((participant => participant.kills)).reduce((acc,curr) => acc + curr, 0));
    const targetTeamTotalKills = myTeam.reduce((acc, curr) => acc + curr, 0);

    const handleResize = () => {
        setWidth(window.innerWidth);
    };


    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, [width]);

  return (
    <>
    {searchedTargetRecord.length > 0 ? (
        <>
            <div className='max-h-[212px] bg-slate-400 dark:bg-slate-800 rounded-bl-md rounded-br-md'>
                <div className='h-full match-stat bg-slate-400 dark:bg-slate-800 rounded-bl-md rounded-br-md'>
                    <div className='h-full stats border-t-2 border-slate-500 dark:border-slate-900'>
                        <div className='h-full total-average flex justify-center  mobile:p-1 lg:p-2'>
                            <div className='win-rate relative  min-w-[80px] mobile_big:w-[150px] tablet:w-[200px] h-full'>
                                <svg viewBox="0 0 200 200">
                                    <circle cx="100" cy="100" r="90" fill="none" stroke={winRecord.length > loseRecord.length ? "#E84057" : "#5383E8"} strokeWidth="20" />
                                    <circle
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    fill="none"
                                    stroke={winRecord.length > loseRecord.length ? "#5383E8" : "#E84057"}
                                    strokeWidth="20"
                                    strokeDasharray={winRecord.length > loseRecord.length ? 2 * Math.PI * 90 * (winRecord.length / searchedTargetRecord.length).toFixed(2) : 2 * Math.PI * 90 * (loseRecord.length / searchedTargetRecord.length).toFixed(2)}
                                    />
                                </svg>
                                <div className='absolute min-w-[80px] w-full h-full flex justify-center items-center text-center top-0 mobile:text-xs tablet:text-sm tablet_big:text-base md:text-lg  '>
                                    <strong>{searchedTargetRecord.length}전 {winRecord.length}승 {loseRecord.length}패</strong>
                                </div>
                                <div className='absolute min-w-[80px] w-full h-full text-blue-500 flex justify-center items-center text-center top-0 mobile:text-xs tablet:text-sm tablet_big:text-base md:text-lg  '>
                                    <strong className='translate-y-4 mobile:mt-0 tablet:mt-2 tablet_big:mt-3 md:mt-4 lg:mt-6'>{Math.floor((winRecord.length / searchedTargetRecord.length) * 100)}%</strong>
                                </div>
                            </div>
                            <div className='kda text-center mobile:min-w-[80px] mobile:mt-2 mobile_big:min-w-[120px] mobile_big:mt-5 tablet:min-w-[160px] tablet:mt-12 md:w-[200px]'>
                                <div className='kda-value text-2xl mobile:text-xs mobile_big:text-sm tablet:text-xl tablet_big:text-2xl'>
                                    <span className=''>{(targetTotalKills / allMatchList.length).toFixed(1)}</span> / <span className='text-red-500'>{(targetTotalDeaths / allMatchList.length).toFixed(1)}</span> / <span>{(targetTotalAssists / allMatchList.length).toFixed(1)}</span>
                                </div>
                                <div className='kda-rate text-xl mt-1 mobile:text-xs  tablet:text-base tablet_big:text-xl'>
                                    <span>{(targetTotalkdaRate / allMatchList.length).toFixed(2)}:1평점</span>
                                </div>
                                <div className='k-a-participation mt-1 mobile:text-xs mobile_big:text-sm tablet:text-base'>
                                    <span className='text-red-500'>킬관여 {(((targetTotalKills + targetTotalAssists) / targetTeamTotalKills * 100)).toFixed(0)}%</span>
                                </div>
                            </div>
                            <div className='recent-played-champion w-[250px] flex flex-col mobile:items-center min-[500px]:items-start  min-[500px]:mt-1 min-[500px]:ml-3'>
                                <div className='mobile:text-xs tablet:text-sm tablet_big:text-base md:text-lg'> ({allMatchList.length}게임) 챔피언 TOP 3</div>
                                <ul className=' leading-[36px]'>
                                    {bestPlayedChampionList && bestPlayedChampionList.filter(list => list.championName !== null && list.championName !== undefined).map((champ, index) => (
                                        <li key={index} className='flex mobile:items-center mobile:mt-2 min-[500px]:mt-4'>
                                            <img className='w-[36px] h-[36px] mobile:w-[15px] mobile:h-[15px] mobile_big:w-[20px] mobile_big:h-[20px] tablet:w-[30px] tablet:h-[30px] tablet_big:w-[36px] tablet_big:h-[36px] rounded-full ' src={`${championImgURL}${champ.championName !== 'FiddleSticks' ? champ.championName : 'Fiddlesticks'}.png`} alt={champ.championName}/>
                                            <div className='win-lose mobile:mr-0.5 tablet:mr-2'>
                                                <div className='win-rate mobile:ml-0.5 mobile:text-xs tablet_big:text-base lg:ml-1'>
                                                    <span className={(champ.win / (champ.win + champ.lose) * 100).toFixed(0) >= 60 ? 'text-red-500 text-center mobile:block mobile:mr-0 mobile:text-xs tablet:text-base min-[500px]:inline min-[500px]:mr-2 ' : 'text-center mobile:block mobile:mr-0 mobile:text-xs tablet:text-base min-[500px]:inline min-[500px]:mr-2 '}>{(champ.win / (champ.win + champ.lose) * 100).toFixed(0)}%</span>
                                                    {width > 400 && (<span>({champ.win}승 {champ.lose}패)</span>)}
                                                </div>
                                            </div>
                                            <span className={
                                                ((champ.totalKDA / (champ.win + champ.lose)).toFixed(2) >= 3 && (champ.totalKDA / (champ.win + champ.lose)).toFixed(2) < 4) ? ' text-teal-400 dark:text-kda-3over ml-1 mobile:text-xs  tablet:text-base'
                                                : ((champ.totalKDA / (champ.win + champ.lose)).toFixed(2) >= 4 && (champ.totalKDA / (champ.win + champ.lose)).toFixed(2) < 5) ? ' text-blue-500 dark:text-kda-4over ml-1 mobile:text-xs  tablet:text-base'
                                                : (champ.totalKDA / (champ.win + champ.lose)).toFixed(2) >= 5 ? ' text-orange-400 dark:text-kda-5over ml-1 mobile:text-xs  tablet:text-base' : 'ml-1 mobile:text-xs  tablet:text-base'
                                                }>
                                                {(champ.totalKDA / (champ.win + champ.lose)).toFixed(2)}평점
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    ) : (
        <div className=' bg-slate-400 dark:bg-slate-800 rounded-bl-md rounded-br-md w-full h-[218px] text-center  text-3xl pt-10'>
            <IoIosWarning className='m-auto text-8xl mb-2'/>
            <span>기록 된 데이터가 없습니다.</span>
        </div>
    )}
    </>
  )
}
