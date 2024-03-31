import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { parseSpell } from '../../util/spell';
import { getRune} from '../../util/runes';
import { calculationTime } from '../../util/calculationTime';
import {GiTowerFall, GiDragonHead, GiDoubleDragon} from 'react-icons/gi'
import { useSelector } from 'react-redux';
import { parseTierNum } from '../../util/parseTierNum';
import {AiOutlineLoading} from 'react-icons/ai'
import {v4 as uuidv4} from 'uuid'
import itemData from '../../util/item.json'
import summonerData from '../../util/summoner.json'


export default function MatchDetails({ gameDuration, teams, participants, participant : {teamId, win}}) {
    // team 200 red team 300 blue
    const isLoading = useSelector(state => state.participants.loading)
    const participantsInfo = useSelector(state => state.participants.getParticipants)
    
    const [toggleTip, setToggleTip] = useState(false);
    const [isMobile, setIsMobile] = useState();
    const [DspellTip, setDspellTip] = useState();
    const [FspellTip, setFspellTip] = useState();
    const [runeTip, setRuneTip] = useState();
    const [damageTip, setDamageTip] = useState();
    const [damageTakenTip, setDamageTakenTip] = useState();
    const [wardTip, setWardTip] = useState();
    const [itemTip, setItemTip] = useState();
    const [objectTip, setObjectTip] = useState();

    const {id} = useParams();


    const enemyTeamId = teamId === 200 ? 100 : 200;
    const totalKillsByTeam = participants.filter(participant => participant.teamId === teamId).map(participant => participant.kills).reduce((acc, curr) => acc + curr, 0);
    const totalKillsByEnemyTeam = participants.filter(participant => participant.teamId === enemyTeamId).map(participant => participant.kills).reduce((acc, curr) => acc + curr, 0);
    const totalGoldByTeam = participants.filter(participant => participant.teamId === teamId).map(participant => participant.goldEarned).reduce((acc, curr) => acc + curr, 0);
    const totalGoldByEnemyTeam = participants.filter(participant => participant.teamId === enemyTeamId).map(participant => participant.goldEarned).reduce((acc, curr) => acc + curr, 0);

    const onMouseEnteredHandle = (e, type, arg1, arg2, arg3, callback) => {
        if(type === 'pc' && callback === setItemTip) {
            callback({name:arg1, item:arg2, index:arg3});
        }
        else if(type === 'pc' && callback === setRuneTip) {
            callback({rune:arg1, name:arg2})
        }
        else if(type === 'pc' && (callback === setDspellTip || callback === setFspellTip)) {
            callback({spell:arg1, name:arg2})
        }
        else if(type === 'pc' && callback === setObjectTip) {
            callback({team: arg1, object:arg2})
        }
        else if(type === 'mobile') {
            e.preventDefault();
        }
        else {
            callback(arg1)
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

    const onTouchStartHandle = (arg1, arg2, arg3, callback) => {
        setIsMobile('mobile');
        setToggleTip(() =>  {
            const toggleTouch = !toggleTip
            if(callback === setItemTip) {
                callback(toggleTouch ? {name:arg1, item:arg2, index:arg3} : null);
            }
            else if(callback === setRuneTip) {
                callback(toggleTouch ? {rune:arg1, name:arg2} : null)
            }
            else if(callback === setDspellTip || callback === setFspellTip) {
                callback(toggleTouch ? {spell:arg1, name:arg2} : null)
            }
            else if(callback === setObjectTip) {
                callback(toggleTouch ? {team:arg1, object:arg2} : null)
            }
            else {
                callback(toggleTouch ? arg1 : null)
            }
            return toggleTouch
        });
    }

    function seperateTeamAndRender(teamCode) {
        const position = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'];
        const totalKills = participants.filter(participant => participant.teamId === teamCode).map(participant => participant.kills).reduce((acc, curr) => acc + curr, 0)
        const maximumDeal = participants.map(participant => participant.totalDamageDealtToChampions).sort((a, b) => b - a)[0]
        const maxumumTaken = participants.map(participant => participant.totalDamageTaken).sort((a, b) => b - a)[0]
        return (
            <table className='w-full h-full'>
                <colgroup>
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                    <col />
                </colgroup>
                <thead className={gameDuration < 215 ? 'bg-slate-300 dark:bg-gray-700' :'bg-gray-400 dark:bg-gray-600'}>
                    <tr>
                        {teams.filter(teams => teams.teamId === teamCode).map((team) => (
                            <th colSpan={4} key={uuidv4()} className='mobile:text-xs tablet:text-base'>
                                <span key={uuidv4()} className={
                                    gameDuration < 215 ? 'text-slate-400 dark:text-slate-500 ml-2'
                                    : team.win ? ' text-blue-600 dark:text-blue-500 ml-2 '
                                    : 'text-red-600 dark:text-red-500 ml-2'}>
                                    {gameDuration < 215 ? '다시하기'
                                    : team.win  ? '승리' : '패배'}
                                </span>
                                {teamCode === 200 ? ' (레드팀)' : ' (블루팀)'}
                            </th>
                        ))}
                        <th className='text-center mobile:text-xs tablet:text-base'>KDA</th>
                        <th className='text-center mobile:text-xs tablet:text-base'>피해량</th>
                        <th className='text-center mobile:text-xs tablet:text-base'>와드</th>
                        <th className='text-center mobile:text-xs tablet:text-base'>CS</th>
                        <th className='text-center mobile:text-xs tablet:text-base'>아이템</th>
                    </tr>
                </thead>
                <tbody className=' mobile:h-[350px]'>
                    {participants.filter(participant => participant.teamId === teamCode).sort((a, b) => {
                        return position.indexOf(a.teamPosition) - position.indexOf(b.teamPosition);
                    })
                    .map((participant) => ( 
                        <tr key={uuidv4()} className={
                            gameDuration < 215 ? 'bg-slate-400 dark:bg-slate-600'
                            : participant.win ? 'bg-win dark:bg-dark-win'
                            : 'bg-lose dark:bg-dark-lose'}>
                            <td className='champion pt-2 pl-2 max-w-[42px] mobile:w-[7%] mobile:pt-0 mobile:pl-1 tablet:w-[42px]'>
                                <div className=' rounded-full mobile:w-[17px] mobile:h-[17px] mobile_big:w-[22px] mobile_big:h-[22px] min-[490px]:w-[32px] min-[490px]:h-[32px] '>
                                    <img className=' rounded-full mobile:w-[17px] mobile:h-[17px] mobile_big:w-[22px] mobile_big:h-[22px] min-[490px]:w-[32px] min-[490px]:h-[32px] '
                                    src={`${process.env.REACT_APP_RIOT_CHAMPION_URL}${participant.championName !== 'FiddleSticks' ? participant.championName : 'Fiddlesticks'}.png`} alt={participant.championName} />
                                </div>
                                <div className='w-[14px] bg-slate-500 dark:bg-slate-600 rounded-full text-xs text-center -translate-y-4 
                                mobile:-translate-x-1 mobile:-translate-y-2 mobile_big:-translate-x-0 mobile_big:-translate-y-2.5 min-[490px]:-translate-y-3'>{participant.champLevel}</div>
                            </td>
                            <td className='spells mobile:w-[3%] tablet:w-[18px] '>
                                <div className='key-D-spell relative w-[16px] mobile:w-[10px] mobile_big:w-[12px] min-[490px]:w-[14px] tablet:w-[16px]'
                                    onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, parseSpell(participant.summoner1Id), participant.riotIdGameName, null, setDspellTip)}
                                    onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setDspellTip)}
                                    onTouchStart={() => onTouchStartHandle(parseSpell(participant.summoner1Id), participant.riotIdGameName, null, setDspellTip)}
                                    >
                                    {DspellTip && DspellTip.name === participant.riotIdGameName && (
                                        <>
                                        <div className='spellD-tool-tip text-white bg-black p-2 z-10 rounded-md inline-block absolute min-w-[250px] min-h-[50px] text-xs -top-1.5 -left-[110px] -translate-y-full'>
                                            <div>
                                                <div className=' text-zinc-600 font-bold mb-1'>{summonerData.data[DspellTip.spell].name}</div>
                                                <div>{summonerData.data[DspellTip.spell].description}</div>
                                            </div>
                                        </div>
                                        <span className='item-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[6px] left-[5px]'></span>
                                        </>
                                    )}
                                    <img className='w-[16px] mobile:w-[10px] mobile_big:w-[12px] min-[490px]:w-[14px] tablet:w-[16px] rounded-md mb-0.5'
                                    src={`${process.env.REACT_APP_RIOT_SPELL_URL}${parseSpell(participant.summoner1Id)}.png`}
                                    alt={participant.summoner1Id}/>
                                </div>
                                <div className='key-F-spell relative w-[16px] mobile:w-[10px] mobile_big:w-[12px] min-[490px]:w-[14px] tablet:w-[16px]'
                                    onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, parseSpell(participant.summoner2Id), participant.riotIdGameName, null, setFspellTip)}
                                    onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setFspellTip)}
                                    onTouchStart={() => onTouchStartHandle(parseSpell(participant.summoner2Id), participant.riotIdGameName, null, setFspellTip)}>
                                    {FspellTip && FspellTip.name === participant.riotIdGameName && (
                                        <>
                                        <div className='spellF-tool-tip text-white bg-black p-2 z-10 rounded-md  inline-block absolute min-w-[250px] min-h-[50px] text-xs -top-1.5 -left-[110px] -translate-y-full'>
                                            <div>
                                                <div className=' text-zinc-600 font-bold mb-1'>{summonerData.data[FspellTip.spell].name}</div>
                                                <div>{summonerData.data[FspellTip.spell].description}</div>
                                            </div>
                                        </div>
                                        <span className='item-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[6px] left-[4px]'></span>
                                        </>
                                    )}
                                    <img className='w-[16px] mobile:w-[10px] mobile_big:w-[12px] min-[490px]:w-[14px] tablet:w-[16px]  rounded-md mb-0.5'
                                    src={`${process.env.REACT_APP_RIOT_SPELL_URL}${parseSpell(participant.summoner2Id)}.png`}
                                    alt={participant.summoner2Id}/>
                                </div>
                            </td>
                            <td className='runes mobile:w-[3%] tablet:w-[18px] '>
                                <div className='primary-rune relative w-[16px] mobile:w-[10px] mobile_big:w-[12px] min-[490px]:w-[14px] tablet:w-[16px]  bg-black rounded-lg'
                                    onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, participant.perks.styles[0].selections[0].perk, participant.riotIdGameName, null, setRuneTip)}
                                    onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setRuneTip)}
                                    onTouchStart={() => onTouchStartHandle(participant.perks.styles[0].selections[0].perk, participant.riotIdGameName, null, setRuneTip)}>
                                    {runeTip && runeTip.name === participant.riotIdGameName && (
                                        <>
                                            <div className='rune-tool-tip text-white bg-black p-2 z-10 rounded-md inline-block absolute min-w-[250px] min-h-[50px] text-xs -top-2 -left-[110px] -translate-y-full'>
                                                <div className=' text-start'>
                                                    <div className=' text-zinc-600 font-bold mb-1'>{getRune(runeTip.rune).name}</div>
                                                    <>
                                                        {getRune(runeTip.rune).description.split(/<br\s*\/?>/).map(str => (
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
                                    className='primary w-[16px] mobile:w-[10px] mobile_big:w-[12px] min-[490px]:w-[14px] tablet:w-[16px] rounded-md mb-0.5'
                                    src={`${process.env.REACT_APP_RIOT_RUNE_URL}${getRune(participant.perks.styles[0].selections[0].perk).icon}`}
                                    alt={participant.perks.styles[0].selections[0].perk}/>
                                </div>
                                <div className='sub-rune w-[16px] mobile:w-[10px] mobile_big:w-[12px] min-[490px]:w-[14px] tablet:w-[16px] rounded-md mb-0.5'>
                                    <img 
                                    className='sub w-[16px] mobile:w-[10px] mobile_big:w-[12px] min-[490px]:w-[14px] tablet:w-[16px]'
                                    src={`${process.env.REACT_APP_RIOT_RUNE_URL}${getRune(participant.perks.styles[1].style).icon}`}
                                    alt={participant.perks.styles[1].style}/>
                                </div>
                            </td>
                            <td className='name mobile:max-w-[50px] mobile_big:w-[19%] mobile:truncate mobile:pl-0 mobile_big:pl-1 tablet:pl-3'>
                                <Link className={participant.riotIdGameName === id.split('-')[0] ? 'font-bold h-[16px] text-xs  truncate  ' : 'h-[16px] text-xs  truncate  '}
                                    to={`/summoner/${participant.riotIdGameName}`}>
                                    {participant.riotIdGameName}
                                </Link>
                                {participantsInfo && participantsInfo.map(info => info.name === participant.summonerName && (
                                    <div key={uuidv4()} className='truncate text-xs'>{info.tier === 'unranked' ? `level ${info.level}` : `${info.tier} ${parseTierNum(info.rank)}`}</div>
                                ))}
                            </td>
                            <td className='kda w-[15%]'>
                                <div>
                                    <div className='kda font-semibold text-center text-xs'>
                                        <div className='inline'>{participant.kills}/{participant.deaths}/{participant.assists}</div>
                                        <div className='inline'> ({isNaN(((participant.kills + participant.assists) / totalKills * 100).toFixed()) ? 0 : ((participant.kills + participant.assists) / totalKills * 100).toFixed()})%</div>
                                    </div>
                                    <div className='kda-ratio  text-xs text-center'>
                                        <span className={
                                            (participant.kills > 0 && participant.deaths === 0) || (participant.assists > 0 && participant.deaths === 0) ?'text-teal-400 dark:text-kda-3over font-bold' :
                                            (participant.challenges.kda.toFixed(2) >= 3 && participant.challenges.kda.toFixed(2) < 4) ? ' text-kda-3over font-bold' :
                                            (participant.challenges.kda.toFixed(2) >= 4 && participant.challenges.kda.toFixed(2) < 5) ? 'text-blue-500 dark:text-kda-4over font-bold' :
                                            participant.challenges.kda.toFixed(2) >= 5 ? 'text-orange-400 dark:text-kda-5over font-bold' : ''}>
                                            {(participant.kills > 0 && participant.deaths === 0) || (participant.assists > 0 && participant.deaths === 0) ? 'Perfect' :
                                            `${participant.challenges.kda.toFixed(2)}:1`}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className='damage w-[15%]'> 
                                <div className='flex mobile:flex-col tablet:flex-row'>
                                    <div className='damage-dealt relative text-center mobile:pl-0 tablet:w-[50%] tablet:pl-1'
                                        onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, participant.riotIdGameName, null, null, setDamageTip)}
                                        onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setDamageTip)}
                                        onTouchStart={() => onTouchStartHandle(participant.riotIdGameName, null, null, setDamageTip)}>
                                        {damageTip && damageTip === participant.riotIdGameName && (
                                            <>
                                                <div className='damage-tool-tip text-white bg-black p-2 z-10 rounded-md  inline-block absolute w-[200px] text-xs -top-[37px] -left-[80px]'>
                                                    챔피언에게 가한 피해량: {participant.totalDamageDealtToChampions}
                                                </div>
                                                <span className='damage-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[5px] left-[23px]'></span>
                                            </>
                                        )}
                                        <div className='dealt-text  text-sm mobile:text-xs'>{participant.totalDamageDealtToChampions}</div>
                                        <div className='dealt-graph h-[6px] bg-slate-600 dark:bg-slate-700 mt-1 ml-0.5 m-auto max-w-[52px] '>
                                            <div className=' bg-red-400 dark:bg-red-500  h-[6px]' style={{width: `${Math.floor((participant.totalDamageDealtToChampions / maximumDeal) * 100)}%`}}></div>
                                        </div>    
                                    </div>
                                    <div className='damage-taken relative text-center mobile:pl-0 tablet:w-[50%] tablet:pl-1'
                                        onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, participant.riotIdGameName, null, null, setDamageTakenTip)}
                                        onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setDamageTakenTip)}
                                        onTouchStart={() => onTouchStartHandle(participant.riotIdGameName, null, null, setDamageTakenTip)}>
                                        {damageTakenTip && damageTakenTip === participant.riotIdGameName && (
                                            <>
                                                <div className='damage-tool-tip text-white bg-black p-2 z-10 rounded-md  inline-block absolute w-[150px] text-xs -top-[37px] -left-[50px]'>
                                                    받은 총 피해량: {participant.totalDamageTaken}
                                                </div>
                                                <span className='damage-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[5px] left-[23px]'></span>
                                            </>
                                        )}
                                        <div className='taken-text  text-sm mobile:text-xs'>{participant.totalDamageTaken}</div>
                                        <div className='taken-graph h-[6px] bg-slate-600 dark:bg-slate-700 mt-1 ml-0.5 m-auto max-w-[52px] '>
                                            <div className='bg-gray-300 dark:bg-gray-500 h-[6px]' style={{width: `${Math.floor((participant.totalDamageTaken / maxumumTaken) * 100)}%`}}></div>
                                        </div>    
                                    </div>
                                </div>    
                            </td>
                            <td className='ward mobile:w-[10%] lg:w-[8%]'>
                                <div className='text-center text-xs relative'
                                    onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, participant.riotIdGameName, null, null, setWardTip)}
                                    onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setWardTip)}
                                    onTouchStart={() => onTouchStartHandle(participant.riotIdGameName, null, null, setWardTip)}>
                                    {wardTip && wardTip === participant.riotIdGameName && (
                                        <>
                                            <div className='ward-tool-tip text-white bg-black p-2 z-10 rounded-md  inline-block absolute w-[95px] h-[65px] text-xs -top-[69px] -left-[20px]'>
                                                <span className={participant.visionWardsBoughtInGame > 10 ? 'block pl-1' : 'block'}>제어와드: {participant.visionWardsBoughtInGame}</span>
                                                <span className={participant.wardsPlaced > 10 ? 'block pl-1' : 'block'}>와드설치: {participant.wardsPlaced}</span>
                                                <span className={participant.wardsKilled > 10 ? 'block pl-1' : 'block'}>와드제거: {participant.wardsKilled}</span>
                                            </div>
                                            <span className='ward-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[4px] left-[23px]'></span>
                                        </>
                                    )}
                                    <div>{participant.visionWardsBoughtInGame}</div>
                                    <div>{participant.wardsPlaced} / {participant.wardsKilled}</div>
                                </div>
                            </td>
                            <td className='cs mobile:w-[10%] lg:w-[8%]'>
                                <div className='text-center text-xs '>{participant.neutralMinionsKilled + participant.totalMinionsKilled}</div> 
                                <div className='text-center text-xs '>분당 {((participant.neutralMinionsKilled + participant.totalMinionsKilled) / ((calculationTime(gameDuration, 'minutes') * 60 + calculationTime(gameDuration, 'seconds')) / 60)).toFixed(1)}</div>   
                            </td>
                            <td className='items text-center mobile:w-[25%] lg:w-[35%]'>
                                {[participant.item0, participant.item1, participant.item2, participant.item3,
                                participant.item4, participant.item5, participant.item6].map((item, index) => (
                                    <div key={uuidv4()} className={
                                        item === 0 ? gameDuration < 215 ? 
                                        'bg-slate-300 dark:bg-slate-700 rounded-md inline-block relative mobile:mr-0.5 mobile:w-[13px] mobile:h-[13px] mobile_big:w-[15px] mobile_big:h-[15px]  tablet:w-[18px] tablet:h-[18px] tablet_big:w-[20px] tablet_big:h-[20px] min-[812px]:w-[22px] min-[812px]:h-[22px] min-[890px]:mr-1 lg:mr-0.5 lg:w-[20px] lg:h-[20px]  min-[1100px]:mr-1 min-[1100px]:w-[22px] min-[1100px]:h-[22px]'
                                        : participant.win ? 'bg-details-blue dark:bg-dark-details-blue rounded-md inline-block relative mobile:mr-0.5 mobile:w-[13px] mobile:h-[13px] mobile_big:w-[15px] mobile_big:h-[15px]  tablet:w-[18px] tablet:h-[18px] tablet_big:w-[20px] tablet_big:h-[20px] min-[812px]:w-[22px] min-[812px]:h-[22px] min-[890px]:mr-1 lg:w-[20px] lg:h-[20px] lg:mr-0.5 min-[1100px]:mr-1 min-[1100px]:w-[22px] min-[1100px]:h-[22px]'
                                        : 'bg-details-red dark:bg-dark-details-red rounded-md inline-block relative mobile:mr-0.5 mobile:w-[13px] mobile:h-[13px] mobile_big:w-[15px] mobile_big:h-[15px]  tablet:w-[18px] tablet:h-[18px] tablet_big:w-[20px] tablet_big:h-[20px] min-[812px]:w-[22px] min-[812px]:h-[22px] min-[890px]:mr-1 lg:w-[20px] lg:h-[20px] lg:mr-0.5 min-[1100px]:mr-1 min-[1100px]:w-[22px] min-[1100px]:h-[22px]'
                                        : ' inline-block relative mobile:w-[13px] mobile:mr-0.5 mobile:h-[13px] mobile_big:w-[15px] mobile_big:h-[15px]  tablet:w-[18px] tablet:h-[18px] tablet_big:w-[20px] tablet_big:h-[20px] min-[812px]:w-[22px] min-[812px]:h-[22px] min-[890px]:mr-1 lg:w-[20px] lg:h-[20px] lg:mr-0.5 min-[1100px]:mr-1 min-[1100px]:w-[22px] min-[1100px]:h-[22px]'
                                        }
                                        // onMouseEnter={() => setItemTip({name : participant.riotIdGameName, item, index})}
                                        onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, participant.riotIdGameName, item, index, setItemTip)}
                                        onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setItemTip)} 
                                        onTouchStart={() => onTouchStartHandle(participant.riotIdGameName, item, index, setItemTip)}>
                                        {item !== 0 && itemTip && itemTip.index === index && itemTip.name === participant.riotIdGameName && itemTip.item === item && (
                                            <>
                                                <div className='item-tool-tip text-white bg-black p-2 z-10 rounded-md inline-block absolute min-w-[250px] min-h-[50px] text-xs -top-1 -left-[110px] -translate-y-full'>
                                                    <div className=' text-start'>
                                                        <div className=' text-zinc-600 font-bold mb-1'>{itemData.data[itemTip.item].name}</div>
                                                        <div className='mb-1'>{itemData.data[itemTip.item].plaintext}</div>
                                                        {itemData.data[itemTip.item].description.split(/<br\s*\/?>/).map((str) => (
                                                            <div key={uuidv4()}>
                                                                <span>{str.replace(/<[^>]*>/g, '')}</span>
                                                                <br/>
                                                            </div>
                                                        ))}
                                                        <div className='text-zinc-600 font-bold'>
                                                            가격: {itemData.data[itemTip.item].gold.total} ({(itemData.data[itemTip.item].gold.total - (itemData.data[itemTip.item].from !== undefined && itemData.data[itemTip.item].from.map(i => itemData.data[i].gold.total).reduce((acc, curr) => acc + curr, 0)))})
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className='item-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[4px] left-[7px]'></span>
                                            </>
                                        )}
                                        {item !== 0 && (
                                            <div>
                                                <img className={item !== participant.item6 ? 'rounded-md w-[22px] mobile:w-[13px] mobile_big:w-[15px] tablet:w-[18px] tablet_big:w-[20px] min-[812px]:w-[22px]' : 'rounded-full w-[22px] mobile:w-[13px] mobile_big:w-[15px] tablet:w-[18px] tablet_big:w-[20px] min-[812px]:w-[22px] lg:w-[20px] min-[1100px]:h-[22px]'} src={`${process.env.REACT_APP_RIOT_ITEM_URL}${item}.png`} alt={item}/>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </td>  
                        </tr>
                    ))}
                </tbody>
            </table> 
        );
    }

    function compareObjectAndRender(teamCode) {
        return (
            <>
                {teams.filter(team => team.teamId === teamCode).map((team) => (
                    <div key={uuidv4()} className='count-object-tower  h-full pl-4 mobile:pl-0'>
                        <div className='object-baron relative w-[28px] h-[30px] inline mobile:text-xs mobile_big:text-sm tablet:text-base tablet_big:text-lg lg:text-xl'
                            onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, teamCode, '바론', null, setObjectTip)}
                            onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setObjectTip)}
                            onTouchStart={() => onTouchStartHandle(teamCode, '바론', null, setObjectTip)}>
                            {objectTip && objectTip.object === '바론' && objectTip.team === teamCode && (
                                <>
                                    <div className='damage-tool-tip text-white bg-black p-2 z-10 rounded-md  inline-block absolute w-[40px] text-xs -top-[37px] -left-[10px]'>
                                        바론
                                    </div>
                                    <span className='damage-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[5px] left-[5px]'></span>
                                </>
                            )}
                            <GiDoubleDragon className={
                            team.win === true ? ' text-blue-400 dark:text-blue-500 inline mobile:text-xs mobile_big:text-sm tablet:text-base tablet_big:text-lg lg:text-xl '
                            : 'text-red-400 dark:text-red-500 inline mobile:text-xs mobile_big:text-sm tablet:text-base tablet_big:text-lg lg:text-xl'}
                            />
                            <span className='text-sm w-[6px] ml-1 mobile:ml-0.5 mobile:text-xs mobile_big:text-sm tablet:text-base '>{team.objectives.baron.kills}</span>
                        </div>
                        <div className='object-dragon relative w-[28px] h-[30px] inline ml-2 mobile:ml-0.5 mobile:text-xs mobile_big:text-sm tablet:text-base tablet_big:text-lg lg:text-xl' 
                            onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, teamCode, '드래곤', null, setObjectTip)}
                            onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setObjectTip)}
                            onTouchStart={() => onTouchStartHandle(teamCode, '드래곤', null, setObjectTip)}>
                            {objectTip && objectTip.object === '드래곤' && objectTip.team === teamCode && (
                                <>
                                    <div className='damage-tool-tip text-white bg-black p-2 z-10 rounded-md  inline-block absolute w-[55px] text-xs -top-[37px] -left-[20px]'>
                                        드래곤
                                    </div>
                                    <span className='damage-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[5px] left-[5px]'></span>
                                </>
                            )}
                            <GiDragonHead className={
                                team.win === true ? ' text-blue-400 dark:text-blue-500 inline mobile:text-xs mobile_big:text-sm tablet:text-base tablet_big:text-lg lg:text-xl '
                                : 'text-red-400 dark:text-red-500 inline mobile:text-xs mobile_big:text-sm tablet:text-base tablet_big:text-lg lg:text-xl'
                            }/>
                            <span className=' text-sm w-[6px] ml-1 mobile:ml-0.5  mobile:text-xs mobile_big:text-sm tablet:text-base'>{team.objectives.dragon.kills}</span>
                        </div> 
                        <div className='object-tower relative w-[28px] h-[30px] inline ml-2 mobile:ml-0.5 mobile:text-xs mobile_big:text-sm tablet:text-base'
                            onMouseEnter={(e) => onMouseEnteredHandle(e, isMobile, teamCode, '타워', null, setObjectTip)}
                            onMouseLeave={(e) => onMouseLeavedHandle(e, isMobile, setObjectTip)}
                            onTouchStart={() => onTouchStartHandle(teamCode, '타워', null, setObjectTip)}>
                            {objectTip && objectTip.object === '타워' && objectTip.team === teamCode && (
                                <>
                                    <div className='damage-tool-tip text-white bg-black p-2 z-10 rounded-md  inline-block absolute w-[40px] text-xs -top-[37px] -left-[10px]'>
                                        타워
                                    </div>
                                    <span className='damage-tool-tip-arrow z-10 border-solid border-t-[7px] border-t-gray-950 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent absolute -top-[5px] left-[5px]'></span>
                                </>
                            )}
                            <GiTowerFall className={
                                team.win === true ? 'text-blue-400 dark:text-blue-500 inline mobile:text-xs mobile_big:text-sm tablet:text-base tablet_big:text-lg lg:text-xl'
                                : 'text-red-400 dark:text-red-500 inline mobile:text-xs mobile_big:text-sm tablet:text-base tablet_big:text-lg lg:text-xl'
                            }/>
                            <span className='text-sm w-[6px] ml-1 mobile:ml-0.5  mobile:text-xs mobile_big:text-sm tablet:text-base'>{team.objectives.tower.kills}</span>
                        </div>
                    </div>
                ))}
            </>         
        )
    }

  return (
    <div>
        {isLoading ? 
            (
            <div className='h-[678px] bg-slate-400 dark:bg-slate-800 mt-1 rounded-md'>
                <AiOutlineLoading className='text-slate-600 dark:text-slate-900 text-9xl animate-spin relative top-[40%] left-[40%]'/>
            </div>
            )
            : (
            <>
                {seperateTeamAndRender(teamId)}
                {gameDuration > 215 && (
                    <div className='compare-graph h-[56px] bg-slate-600 dark:bg-slate-800 flex items-center justify-center  '>
                        <div className='team-object-tower w-[23%] flex justify-end'>
                            {compareObjectAndRender(teamId)}
                        </div>
                        <div className='total-diff-graph w-[55%] max-w-[405px] text-sm'>
                            <div className='relative flex h-[16px] mt-1 ml-1 mr-1'>
                                <div className='absolute h-[16px] leading-[16px] mobile:text-xs mobile:left-[40%] mobile_big:left-[45%] '>Total Kill</div>
                                    <div className='absolute w-[35px] h-[16px] leading-[16px] ml-1 mobile:text-xs'>
                                    {totalKillsByTeam}
                                    </div>
                                    <div className='absolute w-[35px] h-[16px] leading-[16px] right-[1px] mr-1 text-right mobile:text-xs'>
                                        {totalKillsByEnemyTeam}
                                    </div>
                                <div className={win ? 'bg-blue-400 dark:bg-blue-500' : 'bg-red-400 dark:bg-red-500'}
                                    style={{flex: `1 1 ${Math.floor((totalKillsByTeam / (totalKillsByTeam + totalKillsByEnemyTeam)) * 100)}%`}}>
                                </div>
                                <div className={!win ? 'bg-blue-400 dark:bg-blue-500' : 'bg-red-400 dark:bg-red-500'} 
                                    style={{flex: `1 1 ${Math.floor((totalKillsByEnemyTeam / (totalKillsByTeam + totalKillsByEnemyTeam)) * 100)}%`}}>
                                </div>
                            </div>
                            <div className='relative flex h-[16px] mt-1 ml-1 mr-1'>
                                <div className='absolute h-[16px] leading-[16px] mobile:text-xs mobile:left-[40%] mobile_big:left-[45%]'>Total Gold</div>
                                <div className='absolute w-[35px] h-[16px] leading-[16px] ml-1 mobile:text-xs'>{totalGoldByTeam}</div>
                                <div className='absolute w-[35px] h-[16px] leading-[16px] right-[1px] mr-1 text-right mobile:text-xs'>{totalGoldByEnemyTeam}</div>
                                <div className={win ? 'bg-blue-400 dark:bg-blue-500' : 'bg-red-400 dark:bg-red-500'} 
                                    style={{flex: `1 1 ${Math.floor((totalGoldByTeam / (totalGoldByTeam + totalGoldByEnemyTeam)) * 100)}%`}}>   
                                </div>
                                <div className={!win ? 'bg-blue-400 dark:bg-blue-500' : 'bg-red-400 dark:bg-red-500'} 
                                    style={{flex: `1 1 ${Math.floor((totalGoldByEnemyTeam / (totalGoldByTeam + totalGoldByEnemyTeam)) * 100)}%`}}>  
                                </div>
                            </div>
                        </div>
                        <div className='enemy-object-tower w-[23%] flex'>
                            {compareObjectAndRender(enemyTeamId)}
                        </div>
                    </div>
                )}
                {seperateTeamAndRender(enemyTeamId)}
            </>
        )}
    </div>
  )
}
