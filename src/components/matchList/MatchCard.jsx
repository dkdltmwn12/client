import React, { useEffect, useState } from 'react'
import {v4 as uuidv4} from 'uuid'
import {getRune} from '../../util/runes.js'
import { parseSpell } from '../../util/spell';
import { calculationTime } from '../../util/calculationTime.js';
import { Link, useParams } from 'react-router-dom';
import { parseQueueID } from '../../util/parseQueueID.js';
import { convertEpochTime } from '../../util/convertEpochTime.js';
import {AiOutlineDown} from 'react-icons/ai'
import { parseMultiKill } from '../../util/parseMultiKill.js';
import { useDispatch } from 'react-redux';
import { fetchingParticipants } from '../../features/participants/participantsSlice.js';
import itemData from '../../util/item.json'
import summonerData from '../../util/summoner.json'
import { convertTime } from '../../util/convertTime.js';
import { addRecentSearchedSummonerList } from '../../features/recentSearch/recentSearchSlice.js';

// const itemImgURL = 'https://ddragon.leagueoflegends.com/cdn/14.3.1/img/item/';
// const championImgURL = 'http://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/';
// const spellImgURL = 'http://ddragon.leagueoflegends.com/cdn/14.3.1/img/spell/';
// const runeImgURL = 'https://ddragon.leagueoflegends.com/cdn/img/';


export default function MatchCard({toggle, setToggle, gameEndTimestamp, gameDuration, queueId, gameMode, participants, teams,   participant : {championName, champLevel, summoner1Id, summoner2Id, perks : {styles}, kills, deaths, assists,
    challenges : {kda}, visionWardsBoughtInGame, neutralMinionsKilled, totalMinionsKilled, item0, item1, item2, item3, item4, item5, item6, teamId, win, largestMultiKill, individualPosition}}) {
    
    const [width, setWidth] = useState(window.innerWidth);    
    const [toggleTip, setToggleTip] = useState(false);
    const [isMobile, setIsMobile] = useState();
    const [timeTip, setTimeTip] = useState();
    const [DspellTip, setDspellTip] = useState();
    const [FspellTip, setFspellTip] = useState();
    const [creepTip, setCreepTip] = useState();
    const [runeTip, setRuneTip] = useState();
    const [itemTip, setItemTip] = useState();
    const [killTip, setKillTip] = useState();
    const dispatch = useDispatch();
    const {id} = useParams();
    const enemyTeamId = teamId === 100 ? 200 : 100;
    const totalKillsByMyTeam = teams.filter((team) => team.teamId === teamId)[0].objectives.champion.kills
    const participantsName = participants.map(participant => participant.puuid)


    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };
        
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [width]);

    const toggleDetailsHandler = () => {
        setToggle(!toggle);
        if(!toggle === true) {
          dispatch(fetchingParticipants(participantsName))   
        }
    }

    const onMouseEnteredHandle = (e, type, arg1, arg2, callback) => {
        if (type === 'pc' && callback === setItemTip) {
            callback({item:arg1, index:arg2});
        } 
        else if(type === 'pc' && callback !== setItemTip) {
            callback(arg1)
        }
        else if (type === 'mobile') {
            e.preventDefault();
        }
        setIsMobile('pc')
    }

    const onMouseLeavedHandle = (e, type, callback) => {
        if(type === 'pc' && callback) {
            callback(null)
        }
        else if(type === 'mobile') {
            e.preventDefault();
        }
        setIsMobile('pc')
    }

    const onTouchStartHandle = (arg1, arg2, callback) => {
        setIsMobile('mobile');
        setToggleTip(() =>  {
            const toggleTouch = !toggleTip
            if(callback === setItemTip) {
                callback(toggleTouch ? {item:arg1, index:arg2} : null);
            }
            else if(callback !== setItemTip) {
                callback(toggleTouch ? arg1 : null)
            }
            return toggleTouch
        });
    }
    
    function seperateTeamAndRender(teamId, className) {
        const position = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'];

        return (
            <ul className={className}>
                {participants.filter(participant => participant.teamId === teamId).sort((a, b) => {
                    return position.indexOf(a.teamPosition) - position.indexOf(b.teamPosition);
                })
                .map((participant) => (
                    <li key={uuidv4()} className='flex mb-1'>
                            <div className='mr-1'>
                                <img className='w-[16px] rounded-md' src={`${process.env.REACT_APP_RIOT_CHAMPION_URL}${participant.championName !== 'FiddleSticks' ? participant.championName : 'Fiddlesticks'}.png`} alt={participant.championName} />
                            </div>
                            <div className={participant.riotIdGameName === id.replace('#', '-').split('-')[0] ? 'font-bold w-[80%] min-w-[42px] h-[16px] text-xs  truncate' : 'w-[80%] min-w-[42px] h-[16px] text-xs  truncate'}>
                                <Link onClick={() => dispatch(addRecentSearchedSummonerList({name : participant.riotIdGameName, tag : participant.riotIdTagline, bookMark : false}))}  to={`/summoner/${participant.riotIdGameName}-${participant.riotIdTagline}`}>{participant.riotIdGameName}</Link>
                            </div>
                            
                    </li>
                ))}
            </ul>
        );
    }
  return (
    <div className={
        gameDuration < 215 ? 'w-full  mobile:h-[190px] min-[490px]:h-[130px] bg-slate-400 dark:bg-slate-700 opacity-90 rounded-md '
        : win ? ' w-full h-[130px] mobile:h-[190px] min-[490px]:h-[130px]  bg-win dark:bg-dark-win opacity-90 rounded-md '
        : ' w-full h-[130px] mobile:h-[190px] min-[490px]:h-[130px]  bg-lose dark:bg-dark-lose opacity-85 rounded-md '}>
        <div className='w-full h-full flex '>
            <div className={
                gameDuration < 215 ? 'min-w-[4px] rounded-tl-md rounded-bl-md bg-slate-700 dark:bg-slate-500'
                : win ? 'min-w-[4px] rounded-tl-md rounded-bl-md bg-blue-800 dark:bg-blue-500'
                : 'min-w-[4px] rounded-tl-md rounded-bl-md bg-red-800 dark:bg-red-600'}>
            </div>
            <div className='game-content w-[20%] min-w-[67px] h-full mobile:pl-1 mobile:pt-2 tablet:pt-2 tablet:pl-2 '>
                <div className={
                    gameDuration < 215 ? 'text-slate-600 dark:text-slate-500 flex mobile:text-xs'
                    : win ? 'text-blue-800 dark:text-blue-500 flex mobile:text-xs'
                    : 'text-red-800 dark:text-red-500 flex mobile:text-xs'
                    }>
                    {parseQueueID(queueId)}
                    {individualPosition !== 'Invalid' ? individualPosition === 'UTILITY' ?  (<img className=' w-[15px] h-[15px] tablet:ml-1 inline leading-[27px]' src={`/img/position/Position_Support.png`} alt={individualPosition}/>)
                    : (<img className='w-[15px] h-[15px] tablet:ml-1 inline leading-[27px]' src={`/img/position/Position_${individualPosition}.png`} alt={individualPosition}/>) 
                    : (<img className='w-[15px] h-[15px] tablet:ml-1 inline leading-[27px]' src='/img/position/Position_Middle.png' alt='aram'/>)}
                </div>
                <div className='pb-1 relative text-gray-600 dark:text-gray-500 mobile:text-xs tablet:text-sm'
                    onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, gameEndTimestamp, null, setTimeTip)}
                    onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setTimeTip)}
                    onTouchStart={() => onTouchStartHandle(gameEndTimestamp, null, setTimeTip)}>
                    {timeTip && (
                        <>
                            <div className='time-tool-tip bg-black text-white p-1 z-10 rounded-md  inline-block absolute min-w-[165px] h-[25px] text-xs -top-7  mobile:-left-[10px] lg:-left-[35px]'>
                                {convertTime(gameEndTimestamp)}
                            </div>
                            <span className='time-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-1 left-[23px]'></span>
                        </>
                    )}
                    {convertEpochTime(gameEndTimestamp)}
                </div>
                <div className={
                    gameDuration < 180 ? 'w-[50px] h-[1px]   border-slate-800 border-b'
                    : win ? 'w-[50px] h-[1px]  border-details-blue dark:border-dark-details-blue border-b'
                    : 'w-[50px] h-[1px]  border-details-red dark:border-dark-details-red border-b'}>
                </div>
                <div className='pt-1 font-semibold mobile:text-xs tablet:text-base'>
                    {gameDuration < 215 ? '다시하기'
                    : gameDuration > 215 && win ? '승리' : '패배'}
                </div>
                <div className='mobile:text-xs tablet:text-base'>
                    {calculationTime(gameDuration, 'minutes')}분 {calculationTime(gameDuration, 'seconds')}초
                </div>
            </div>
            <div className='game-info h-full  mobile:w-[40%] min-[490px]:w-[60%] min-[490px]:min-w-[215px] mobile:ml-0.5 mobile:pt-1 tablet:ml-1 min-[490px]:pt-3 '>
                <div className='mobile:inline-flex mobile:flex-col min-[490px]:flex min-[490px]:flex-row'>
                    <div className='champion-spec flex mt-1'>
                        <div className='champion-img'>
                            <img className=' rounded-full  mobile:w-[25px] tablet:w-[47px]'
                            src={`${process.env.REACT_APP_RIOT_CHAMPION_URL}${championName !== 'FiddleSticks' ? championName : 'Fiddlesticks'}.png`}
                            alt={championName}/>
                            <div className='w-[12px] bg-slate-600 rounded-lg opacity-85  text-sm text-center  -translate-y-5 translate-x-7 mobile:text-xs mobile:translate-x-4 mobile:-translate-y-3'>{champLevel}</div>
                        </div>
                        <div className='spells ml-2'>
                            <div className='spell-D relative'
                                onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, summoner1Id, null, setDspellTip)}
                                onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setDspellTip)}
                                onTouchStart={() => onTouchStartHandle(summoner1Id, null, setDspellTip)}>
                                {DspellTip && (
                                    <>
                                        <div className='spell-D-tool-tip bg-black text-white p-2 z-10 rounded-md  inline-block absolute min-w-[250px] min-h-[50px] text-xs -top-1.5 -left-[110px] -translate-y-full'>
                                            <div>
                                                <div className=' text-zinc-600 font-bold mb-1'>{summonerData.data[parseSpell(summoner1Id)].name}</div>
                                                <div>{summonerData.data[parseSpell(summoner1Id)].description}</div>
                                            </div>
                                        </div>
                                        <span className='spell-D-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[6px] left-[5px]'></span>
                                    </>
                                )}
                                <img className=' mobile:w-[15px] tablet:w-[22px] rounded-md'
                                src={`${process.env.REACT_APP_RIOT_SPELL_URL}${parseSpell(summoner1Id)}.png`}
                                alt={summoner1Id}/>
                            </div>
                            <div className='spell-F relative'
                               onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, summoner2Id, null, setFspellTip)}
                               onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setFspellTip)}
                               onTouchStart={() => onTouchStartHandle(summoner2Id, null, setFspellTip)}>
                                {FspellTip && (
                                    <>
                                        <div className='spell-F-tool-tip bg-black text-white p-2 z-10 rounded-md  inline-block absolute min-w-[250px] min-h-[50px] text-xs -top-1.5 -left-[110px] -translate-y-full'>
                                            <div>
                                                <div className=' text-zinc-600 font-bold mb-1'>{summonerData.data[parseSpell(summoner2Id)].name}</div>
                                                <div>{summonerData.data[parseSpell(summoner2Id)].description}</div>
                                            </div>
                                        </div>
                                        <span className='spell-F-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[6px] left-[5px]'></span>
                                    </>
                                )}
                                <img className='mobile:w-[15px] tablet:w-[22px] rounded-md'
                                src={`${process.env.REACT_APP_RIOT_SPELL_URL}${parseSpell(summoner2Id)}.png`}
                                alt={summoner2Id}/>
                            </div>
                        </div>
                        <div className='runes ml-1'>
                            <div className='primary-rune relative'
                                onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, styles[0].selections[0].perk, null, setRuneTip)}
                                onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setRuneTip)}
                                onTouchStart={() => onTouchStartHandle(styles[0].selections[0].perk, null, setRuneTip)}>
                                {runeTip && (
                                    <>
                                        <div className='rune-tool-tip bg-black text-white p-2 z-10 rounded-md  inline-block absolute min-w-[250px] min-h-[50px] text-xs -top-2 -left-[110px] -translate-y-full'>
                                            <div className=' text-start'>
                                                <div className=' text-zinc-600 font-bold mb-1'>{getRune(styles[0].selections[0].perk).name}</div>
                                                <>
                                                    {getRune(styles[0].selections[0].perk).description.split(/<br\s*\/?>/).map(str => (
                                                        <div key={uuidv4()}>
                                                            {str.replace(/<[^>]*>/g, '').split(/\.\s+/).map((str) => (
                                                                <div key={uuidv4()}>
                                                                    {str !== '' && (
                                                                        <>
                                                                            <div className='mt-2'>{str}</div>
                                                                        </> 
                                                                    )} 
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </>
                                            </div>
                                        </div>
                                        <span className='rune-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[8px] left-[3px]'></span>
                                    </>
                                )}
                                <img 
                                className='mobile:w-[15px] tablet:w-[22px]'
                                src={`${process.env.REACT_APP_RIOT_RUNE_URL}${getRune(styles[0].selections[0].perk).icon}`}
                                alt={styles[0].selections[0].perk}/>
                            </div>
                            <div className='sub-rune'>
                                <img 
                                className='mobile:w-[15px] tablet:w-[22px]'
                                src={`${process.env.REACT_APP_RIOT_RUNE_URL}${getRune(styles[1].style).icon}`}
                                alt={styles[1].style}/>
                            </div>
                        </div>
                    </div>
                    <div className={
                        gameDuration < 215 ? 'kda-spec ml-1 max-w-[110px] mobile:pr-0 min-[490px]:pr-1 md:pr-2  border-r border-slate-800'
                        : win ? 'kda-spec ml-1 max-w-[110px] min-[490px]:pr-1 md:pr-2 border-r border-details-blue dark:border-dark-details-blue'
                        : 'kda-spec ml-1 max-w-[110px] min-[490px]:pr-1 md:pr-3 border-r border-details-red dark:border-dark-details-red'}>
                        <div className='kda font-semibold mobile:text-xs tablet:text-base'>
                            <span>{kills}</span> / <span className='text-red-600 dark:text-red-500'>{deaths}</span> / <span>{assists}</span>
                        </div>
                        <div className='kda-ratio text-gray-600 dark:text-gray-500 text-xs'>
                            <span>{ deaths === 0 ? 'Perfect' : `${kda.toFixed(2)}:1`} 평점</span>
                        </div>
                    </div>
                    <div className='stat mobile:ml-1 md:ml-5 flex-row text-xs'>
                        <div className='kda-ratio pt-0.5  font-bold text-red-600 dark:text-red-500'>킬관여 {isNaN((((kills + assists) / totalKillsByMyTeam) * 100).toFixed()) ? 0 : (((kills + assists) / totalKillsByMyTeam) * 100).toFixed()}%</div>
                        <div className='pt-0.5'>제어 와드 {visionWardsBoughtInGame}</div>
                        <div className='pt-0.5 relative'
                            onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, true, null, setCreepTip)}
                            onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setCreepTip)}
                            onTouchStart={() => onTouchStartHandle(true, null, setCreepTip)}>
                            {creepTip && (
                                <>
                                    <div className='creep-tool-tip bg-black text-white p-2 z-10 rounded-md  inline-block absolute min-w-[150px] h-[45px] text-xs -top-12 -left-[35px]'>
                                        <div>미니언 {totalMinionsKilled} + 몬스터 {neutralMinionsKilled}</div>
                                        <div>분당 CS {((neutralMinionsKilled + totalMinionsKilled) / ((calculationTime(gameDuration, 'minutes') * 60 + calculationTime(gameDuration, 'seconds')) / 60)).toFixed(1)}</div>
                                    </div>
                                    <span className='creep-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-1 left-[23px]'></span>
                                </>
                            )}
                            CS {neutralMinionsKilled + totalMinionsKilled} ({((neutralMinionsKilled + totalMinionsKilled) / ((calculationTime(gameDuration, 'minutes') * 60 + calculationTime(gameDuration, 'seconds')) / 60)).toFixed(1)})
                        </div>
                    </div>
                </div>
                <div className='item-list pt-2 '>
                    <div className='purchase-items flex mobile:flex-col min-[490px]:flex-row'>
                        <ul className='flex mobile:h-[15px] tablet:h-[25px]'>
                            {[item0, item1, item2, item3, item4, item5, item6].map((item, index) => (
                                <li key={uuidv4()} className={
                                    item === 0 ? gameDuration < 215 ? 'relative bg-slate-500 dark:bg-slate-600 rounded-md mobile:mr-0.5 tablet:mr-1 mobile:w-[15px] mobile:h-[15px] min-[490px]:w-[20px] min-[490px]:h-[20px] tablet:w-[25px] tablet:h-[25px]'
                                    : win ? 'relative bg-details-blue dark:bg-dark-details-blue rounded-md mobile:mr-0.5 tablet:mr-1 mobile:w-[15px] mobile:h-[15px] min-[490px]:w-[20px] min-[490px]:h-[20px] tablet:w-[25px] tablet:h-[25px]'
                                    : 'relative bg-details-red dark:bg-dark-details-red rounded-md mobile:mr-0.5 tablet:mr-1 mobile:w-[15px] mobile:h-[15px] min-[490px]:w-[20px] min-[490px]:h-[20px] tablet:w-[25px] tablet:h-[25px]'
                                    : 'relative mobile:mr-0.5 tablet:mr-1 mobile:w-[15px] mobile:h-[15px] min-[490px]:w-[20px] min-[490px]:h-[20px] tablet:w-[25px] tablet:h-[25px]'}>
                                    {item !== 0 && (
                                        <>
                                            <div
                                                onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, item, index, setItemTip)}
                                                onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setItemTip)}
                                                onTouchStart={() => onTouchStartHandle(item, index, setItemTip)}>
                                                {itemTip && itemTip.item === item && itemTip.index === index && (
                                                    <>
                                                        <div className={itemTip.index === 0 
                                                            ? 'item-tool-tip bg-black text-white p-2 z-10 rounded-md  inline-block absolute min-w-[250px] min-h-[50px] text-xs -top-1.5 -translate-y-full mobile:-left-[73px] lg:-left-[110px]'
                                                            : itemTip.index === 1 ? 'item-tool-tip bg-black text-white p-2 z-10 rounded-md  inline-block absolute min-w-[250px] min-h-[50px] text-xs -top-1.5 -translate-y-full mobile:-left-[90px] lg:-left-[110px]'
                                                            : itemTip.index === 6 ? 'item-tool-tip bg-black text-white p-2 z-10 rounded-md  inline-block absolute min-w-[250px] min-h-[50px] text-xs -top-1.5 -translate-y-full mobile:-left-[125px] lg:-left-[110px]'
                                                            : 'item-tool-tip bg-black text-white p-2 z-10 rounded-md  inline-block absolute min-w-[250px] min-h-[50px] text-xs -top-1.5 -translate-y-full mobile:-left-[107px] lg:-left-[110px]'}>
                                                            <div className=' text-start'>
                                                                <div className=' text-zinc-600 font-bold mb-1'>{itemData.data[item].name}</div>
                                                                <div className='mb-1'>{itemData.data[item].plaintext}</div>
                                                                {itemData.data[item].description.split(/<br\s*\/?>/).map((str) => (
                                                                    <div key={uuidv4()}>
                                                                        <span>{str.replace(/<[^>]*>/g, '')}</span>
                                                                        <br/>
                                                                    </div>
                                                                ))}
                                                                <div className='text-zinc-600 font-bold'>
                                                                    가격: {itemData.data[item].gold.total} ({(itemData.data[item].gold.total - (itemData.data[item].from !== undefined && itemData.data[item].from.map(i => itemData.data[i].gold.total).reduce((acc, curr) => acc + curr, 0)))})
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className={itemTip.index === 0 
                                                        ? 'item-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[6px] mobile:left-[5px] tablet:left-[7px]'
                                                        : itemTip.index === 1 ? 'item-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[6px] mobile:left-[4px] tablet:left-[7px]'
                                                        : itemTip.index === 6 ? 'item-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[6px] mobile:left-[5px] tablet:left-[7px]'
                                                        : 'item-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[6px] mobile:left-[5px] tablet:left-[7px]'}></span>
                                                    </>
                                                )}
                                                <img className={item !== item6
                                                    ? 'rounded-md  mobile:w-[15px] mobile:h-[15px] min-[490px]:w-[20px] min-[490px]:h-[20px] tablet:w-[25px] tablet:h-[25px]'
                                                    : 'rounded-full mobile:w-[15px] mobile:h-[15px] min-[490px]:w-[20px] min-[490px]:h-[20px] tablet:w-[25px] tablet:h-[25px]'}
                                                src={`${process.env.REACT_APP_RIOT_ITEM_URL}${item}.png`} alt={item}/>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {(largestMultiKill !== 1 && largestMultiKill !== 0) && (
                            <div className='largest-multi-kill relative w-[60px] h-[25px] mobile:mt-1 min-[490px]:mt-0 bg-red-500 rounded-xl text-center pt-1 text-xs'
                                onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, largestMultiKill, null, setKillTip)}
                                onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setKillTip)}
                                onTouchStart={() => onTouchStartHandle(largestMultiKill, null, setKillTip)}>
                                {killTip && (
                                    <>
                                        <div className='kill-tool-tip bg-black text-white p-1 z-10 rounded-md  inline-block absolute mw-[50px] h-[25px] text-xs -top-7 -left-[15px]'>
                                            최대 연속 킬
                                        </div>
                                        <span className='kill-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-1 left-[23px]'></span>
                                    </>
                                )}
                                {parseMultiKill(largestMultiKill)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='participants flex  mobile:w-[40%] mobile:min-w-[115px] min-[360px]:min-w-[142px] mobile:-ml-10 min-[490px]:ml-1 tablet:ml-2 mt-3 h-[100px]'>
                {width > 360 && (
                    <ul className='w-[16px]'>
                        {gameMode !== 'ARAM' ? (
                            <>
                                {['Top', 'Jungle', 'Middle', 'Bottom', 'Support'].map((position) => (
                                    <li key={uuidv4()}><img className='w-[16px] mb-1' src={`/img/position/Position_${position}.png`} alt={position}/></li>
                                ))}
                            </>
                        ) : (
                            <>
                                {Array(5).fill('Middle').map((middle) => (
                                <li key={uuidv4()}><img className='w-[16px] mb-1' src={`/img/position/Position_${middle}.png`} alt='aram'/></li>
                                ))} 
                            </>
                        )}
                    </ul>
                )}
                {seperateTeamAndRender(teamId, 'team mr-1 mobile:w-[40%] tablet:w-[46%] min-w-[61px]')}
                {seperateTeamAndRender(enemyTeamId, 'enemy mobile:w-[40%] tablet:w-[46%] min-w-[61px]')}
            </div>
            <div className='w-[12%] max-w-[40px] h-[130px] mobile:h-[190px] min-[490px]:h-[130px] relative overflow-hidden  '>
                <button onClick={() => toggleDetailsHandler()} className={
                    gameDuration < 215 ? ' w-full h-full bg-slate-300 poninterhover:hover:bg-slate-400 dark:bg-slate-600 poninterhover:hover:dark:bg-slate-700 rounded-br-md rounded-r-md '
                    : win ? ' w-full h-full bg-details-blue dark:bg-dark-details-blue poninterhover:hover:bg-win poninterhover:hover:dark:bg-dark-win rounded-br-md rounded-r-md '
                    : ' w-full h-full bg-details-red dark:bg-dark-details-red poninterhover:hover:bg-lose poninterhover:hover:dark:bg-dark-lose rounded-br-md rounded-r-md'}>
                    <AiOutlineDown className={
                        gameDuration < 215 ? 'w-full h-full m-auto max-[490px]:pt-[168px] pt-28  text-slate-600 dark:text-slate-500 text-lg  '
                        : win ? 'w-full h-full m-auto max-[490px]:pt-[168px] pt-28  text-blue-600 dark:text-blue-500 text-lg  '
                        : 'w-full h-full m-auto max-[490px]:pt-[168px] pt-28  text-red-600 dark:text-red-500 text-lg  '
                    }/>
                </button>
            </div>
        </div>
    </div>
    )
}
