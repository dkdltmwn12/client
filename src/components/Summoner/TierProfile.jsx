import React from 'react'
import { parseTierNum } from '../../util/parseTierNum'

export default function TierProfile({summonerTierInfo}) {
    const {solo, team} = summonerTierInfo;
  return (
    <>
        <div className='rank-info w-full h-full rounded-md tablet_big:flex tablet_big:justify-center lg:block   '>
            {solo.stat !== 'unranked' ? (
                <div className='rounded-md bg-slate-400 dark:bg-slate-800 mobile:w-full tablet_big:w-[50%] lg:w-full '>
                    <div className=' border-b-2 border-black dark:border-white text-lg p-1'>솔로랭크</div>
                    <div className='rank-content flex items-center min-[450px]:justify-center lg:justify-normal p-2'>
                        <div className='tier-img min-w-[100px] h-[110px] bg-slate-300 dark:bg-slate-500 rounded-full  flex items-center'>
                            <img  className=' w-[85px]  translate-x-2 translate-y-1' src={`/img/emblem/emblem-${solo.stat.tier}.png`} alt={solo.stat.tier} />
                        </div>
                        <div className='tier-info w-[105px]  text-center pl-1.5'>
                            <div className='tier font-bold text-xs'>{solo.stat.tier} {solo.stat.tier !== 'MASTER' && solo.stat.tier !== 'GRANDMASTER' && solo.stat.tier !== 'CHALLENGER' && parseTierNum(solo.stat.rank)}</div>
                            <div className='leaguePoints text-gray-200 dark:text-gray-500 text-sm'>{solo.stat.leaguePoints} LP</div>
                        </div>
                        <div className='w-[100px] text-center'>
                            <div className='win-lose'>
                                <div className='text-sm'> {solo.stat.wins}승 {solo.stat.losses}패</div>
                            </div>
                            <div className='win-rate mt-1'>
                                <div className='text-xs'>승률 {Math.round((solo.stat.wins / (solo.stat.wins + solo.stat.losses)) * 100)}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='mobile:w-full h-[35px]  tablet_big:flex tablet_big:w-[50%] lg:w-full bg-slate-400 dark:bg-slate-800 rounded-md'>
                    <div className='w-full flex justify-between pl-3 pr-3 h-[35px] leading-[35px] '>
                        솔로랭크
                        <span>{solo.stat}</span>
                    </div>
                </div>
            )}
            {team.stat !== 'unranked' ? (
                <div className=' rounded-md bg-slate-400 dark:bg-slate-800 mobile:w-full tablet_big:w-[50%] lg:w-full mobile:mt-3 tablet_big:mt-0 tablet_big:ml-1 lg:m-0 lg:mt-3'>
                    <div className=' border-b-2 border-black dark:border-white text-lg p-1 '>자유랭크</div>
                    <div className='rank-content flex items-center min-[450px]:justify-center lg:justify-normal p-2'>
                        <div className='tier-img min-w-[100px] h-[110px] bg-slate-300 dark:bg-slate-500 rounded-full  flex items-center'>
                            <img  className=' w-[85px]  translate-x-2 translate-y-1' src={`/img/emblem/emblem-${team.stat.tier}.png`} alt={team.stat.tier} />
                        </div>
                        <div className='tier-info w-[105px]  text-center pl-1.5'>
                            <div className='tier font-bold text-xs'>{team.stat.tier} {team.stat.tier !== 'MASTER' && team.stat.tier !== 'GRANDMASTER' && team.stat.tier !== 'CHALLENGER' && parseTierNum(team.stat.rank)}</div>
                            <div className='leaguePoints text-gray-200 dark:text-gray-500 text-sm'>{team.stat.leaguePoints} LP</div>
                        </div>
                        <div className='w-[100px] text-center'>
                            <div className='win-lose'>
                                <div className='text-sm'> {team.stat.wins}승 {team.stat.losses}패</div>
                            </div>
                            <div className='win-rate mt-1'>
                                <div className='text-xs'>승률 {Math.round((team.stat.wins / (team.stat.wins + team.stat.losses)) * 100)}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='mobile:w-full h-[35px] tablet_big:flex tablet_big:w-[50%] lg:w-full bg-slate-400 dark:bg-slate-800 mt-3 rounded-md mobile:!mt-3 tablet_big:!mt-0 tablet_big:!ml-1 lg:!ml-0 xl:!ml-0 lg:!mt-3 xl:!mt-3  '>
                    <div className='w-full flex justify-between pl-3 pr-3 h-[35px] leading-[35px] '>
                        자유랭크
                        <span>{team.stat}</span>
                    </div>
                </div>
            )}
            
        </div>
    </>
  )
}
