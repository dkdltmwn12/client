import React from 'react'
import { timeAgo } from '../../../util/timeAgo';
import { shortenTierName } from '../../../util/shortenTierName';
import { parseTierNum } from '../../../util/parseTierNum';
import { Link } from 'react-router-dom';
import { BsChatSquare } from 'react-icons/bs';

export default function ArticleSlideCard({commentList, article : {_id, myPositionType, title, name, contents, createdAt, microType, gameStyleType, tier, tier : {tierName, rank, recentChampList}}}) {

  const selectedPostCommentList = commentList.filter((comment) => comment.postId === _id);
  const recentComment = selectedPostCommentList.filter((comment) => !comment.replyTo).slice(-1);

  return (
    <article className='w-full h-[300px] text-xs flex flex-col bg-slate-300 dark:bg-slate-700 rounded-md mobile:w-[295px] mobile:p-3 mobile:m-1 tablet:w-[255px] tablet:p-2 lg:w-[270px] xl:w-[295px] xl:p-3 xl:m-1.5 '>
      <div className='flex max-h-[52px] '>
        <div className=''>
          <h1 className=' text-xs font-bold'>{title}</h1>
          <div className='flex text-xs mt-1 mobile:leading-[13px] tablet:leaing-[15px]'>
            <img className=' w-[20px] h-[20px] mobile:w-[13px] mobile:h-[13px] tablet:w-[15px] tablet:h-[15px]' src={
              title.includes('솔로랭크') ? tier !== 'unranked' ? `./img/emblem/emblem-${tierName}.png` : `./img/emblem/emblem-${tier}.png`
              : title.includes('자유랭크') ? tier !== 'unranked' ? `./img/emblem/emblem-${tierName}.png` : `./img/emblem/emblem-${tier}.png`
              : './img/emblem/emblem-unranked.png'}  alt={tier !== 'unranked' ? tierName : 'unranked'}
            />
            {title.includes('솔로랭크') ? tier !== 'unranked' ? (<span className='ml-2 '>{shortenTierName(tierName)}{parseTierNum(rank)}</span>) : (<span className='ml-1'>Unranked</span>)
              : title.includes('자유랭크') ? tier !== 'unranked' ? (<span className='ml-2'>{shortenTierName(tierName)} {parseTierNum(rank)}</span>) : (<span className='ml-1'>Unranked</span>)
              : <span className='ml-1'>Unranked</span>
            }
            <img className='w-[20px] h-[20px] ml-1 mr-1 mobile:w-[13px] mobile:h-[13px] tablet:w-[15px] tablet:h-[15px]' src={`./img/position/Position_${myPositionType}.png`} alt={myPositionType}/>
            <span className='w-[100px] truncate '><Link to={`/summoner/${name.replace('#', '-').split('-')[0]}-${name.replace('#', '-').split('-')[1]}`}>{name.includes('#KR1') ? name.replace('#', '-').split('-')[0] : name}</Link></span>
          </div>
        </div>
        <div className='flex justify-center items-center text-end ml-auto'>
          <span className='text-xs  w-[60px]'>{timeAgo(createdAt, 'ko')}</span>
        </div>
      </div>
      <p className='mt-2 h-[50px]'>{contents}</p>
      <div className='most3champ flex'> 
        <ul className='flex'>
          {recentChampList && recentChampList.map((champName, index) => (
              <li key={index} className='mr-0.5'>
                <img className=' rounded-lg w-[20px] h-[20px]' src={`${process.env.REACT_APP_RIOT_CHAMPION_URL}${champName}.png`} alt={champName}/>
              </li>
            ))}
          </ul>
      </div>
      <div className='coment-caption flex mt-2 mr-2 mb-2'>
        <div className='p-1 bg-slate-500 dark:bg-slate-600 rounded-md'>{microType ? '마이크 가능' : '마이크 불가능'}</div>
        {gameStyleType !== '' && (<div className='p-1 bg-slate-500 dark:bg-slate-600 rounded-md ml-2'>{gameStyleType === 'hard' ? '빡겜지향' : gameStyleType === 'funny' ? '즐겜지향' : ''}</div>)}
      </div>
      <div className='h-[1px] bg-slate-500 dark:bg-slate-600 mobile:w-[295px] mobile:-ml-[13px] tablet:w-[255px] tablet:-ml-[8px] lg:w-[270px] xl:w-[295px] xl:-ml-[12px]'></div>
      <div className='flex m-1'>
        <div className='flex items-center'>
          <BsChatSquare className='mr-1 mobile:w-[18px] mobile:h-[18px] tablet:w-[24px] tablet:h-[24px] '/>
          <span className='mobile:text-xs tablet:text-lg leading-[24px]'>{selectedPostCommentList.length}</span>
        </div>
      </div>
      <div className='h-[1px] bg-slate-500 dark:bg-slate-600 mobile:w-[295px] mobile:-ml-[13px] tablet:w-[255px] tablet:-ml-[8px] lg:w-[270px] xl:w-[295px] xl:-ml-[12px]'></div>
      {recentComment.length > 0 && recentComment.map(({content, _id, createdAt, writer : {name, profileImg}}) => (
        <div key={_id} className='flex mt-2 min-h-[70px]'>
          <div className=' flex justify-center mr-2'>
            <img className='rounded-full w-[25px] h-[25px] ' src={profileImg} alt='profile'/>
          </div>
          <div className='w-full flex flex-col'>
            <div className='font-bold text-xs'>{name} <span className='font-normal'>{timeAgo(createdAt, 'ko')}</span></div>
            <div className='text-xs whitespace-pre-wrap'>{content}</div>
          </div>
        </div>
      ))}
    </article>
  )
}
