import React, {useRef, useState } from 'react'
import {BsChatSquare} from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'
import { timeAgo } from '../../util/timeAgo';
import { Link } from 'react-router-dom'
import { parseTierNum } from '../../util/parseTierNum';
import { shortenTierName } from '../../util/shortenTierName';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '../../api/postData';
import CommentList from '../../components/Comment/CommentList';
import { getCommentListFromDB } from '../../features/comment/commentSlice';


export default function ModalArticleDetails({setToggleDetails, selectedPostCommentList, article : {_id, myPositionType, title, name, contents, createdAt, microType, gameStyleType, tier, tier : {tierName, rank, recentChampList}}}) {
  const dispatch = useDispatch();
  const loginUserInfo = useSelector(state => state.loginUser.getUser);
  const {userInfo} = loginUserInfo;
  const [focus, setFocus] = useState(false);
  const [text, setText] = useState('');
  const textareaRef = useRef();

  const onChangeHandle = (e) => {
    setText(e.target.value);
    textareaRef.current.style.height = 'auto'; //height 초기화
    textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
  }

  const onSubmitHanndle = async (e) => {
    e.preventDefault();
    try {
      await createComment({
        writer : (({isAdmin, isAuth, role, email, ...rest }) => rest)(userInfo), //IIFE
        content : text,
        postId : _id,
      })
      dispatch(getCommentListFromDB())
      setFocus(false);
      setText('');
    } catch (error) {
      console.log(error)
    }
  }

  const onClickCancelHandle = () => {
    setFocus(false);
    setText('');
    textareaRef.current.style.height = 'auto'; //height 초기화
  }

  return (
    <div className='z-10 w-full flex justify-center items-center overflow-y-hidden bg-black bg-opacity-50
      mobile:fixed mobile:h-full lg:absolute lg:min-h-[1050px]'>
      <article className=' w-full text-xs flex flex-col bg-slate-300 dark:bg-slate-700 text-black dark:text-white rounded-md
        mobile:w-[300px] mobile:h-[500px] mobile:p-3 tablet:w-[526px] tablet:h-[532px] tablet:p-5 lg:w-[834px] lg:h-[624px] lg:p-7 lg:-translate-y-4 xl:w-[922px] '>
        <div  className='absolute cursor-pointer flex justify-end
          mobile:w-[290px] mobile:-translate-y-3 tablet:w-[505px] tablet:-translate-y-5 lg:w-[800px] lg:-translate-y-5 xl:w-[885px]'>
          <IoClose onClick={() => setToggleDetails(false)} className='w-[25px] h-[25px] text-black dark:text-white '/>
        </div>
        <div className='flex'>
          <div className='min-w-[200px]'>
            <h1 className='font-bold mobile:text-xs tablet:text-sm lg:text-base xl:text-lg'>{title}</h1>
            <div className='flex text-xs mt-1
              mobile:leading-[13px] tablet:leaing-[15px] xl:text-lg'>
              <img className=' mobile:w-[13px] mobile:h-[13px] tablet:w-[15px] tablet:h-[15px] lg:w-[20px] lg:h-[20px] xl:w-[30px] xl:h-[30px]'
                src={title.includes('솔로랭크') ?
                tier !== 'unranked' ?
                `./img/emblem/emblem-${tierName}.png` :
                `./img/emblem/emblem-${tier}.png` :
                title.includes('자유랭크') ?
                tier !== 'unranked' ?
                `./img/emblem/emblem-${tierName}.png` :
                `./img/emblem/emblem-${tier}.png` :
                './img/emblem/emblem-unranked.png'} 
                alt={tier !== 'unranked' ? tierName : 'unranked'}
              />
              {title.includes('솔로랭크') ? tierName !== 'unranked' ? (<span className=' ml-2 '>{shortenTierName(tierName)}{parseTierNum(rank)}</span>) : (<span className=' ml-2'>Unranked</span>)
                : title.includes('자유랭크') ? tierName !== 'unranked' ? (<span className=' ml-2'>{shortenTierName(tierName)}{parseTierNum(rank)}</span>) : (<span className='ml-2'>Unranked</span>)
                : <span className='ml-2'>Unranked</span>
              }
              <img className='ml-1 mr-1
                mobile:w-[13px] mobile:h-[13px] tablet:w-[15px] tablet:h-[15px] lg:w-[20px] lg:h-[20px] xl:w-[30px] xl:h-[30px]'
                src={`./img/position/Position_${myPositionType}.png`} alt={myPositionType}
              />
              <span className='truncate mobile:w-[100px] tablet:w-full '>
                <Link to={`/summoner/${name.replace('#', '-').split('-')[0]}-${name.replace('#', '-').split('-')[1]}`}>
                  {name.includes('#KR1') ? name.replace('#', '-').split('-')[0] : name}
                </Link>
              </span>
            </div>
          </div>
          <div className='flex justify-center items-center text-end ml-auto'>
            <span className='w-[60px] mobile:text-xs tablet:text-sm lg:text-base lg:w-[100px]'>{timeAgo(createdAt, 'ko')}</span>
          </div>
        </div>
        <p className='mt-1 mobile:h-[50px] tablet:h-[60px] lg:text-base'>{contents}</p>
        <div className='most3champ flex'> 
          <ul className='flex'>
            {recentChampList && recentChampList.map((champName, index) => (
              <li key={index} className='mr-0.5'>
                <img className=' rounded-lg w-[20px] h-[20px]' src={`${process.env.REACT_APP_RIOT_CHAMPION_URL}${champName}.png`} alt={champName}/>
              </li>
            ))}
          </ul>
        </div>
        <div className='coment-caption flex mt-1 mb-1 lg:mt-2 lg:mb-2 xl:mt-1.5 xl:mb-1.5'>
          <div className='p-1 bg-slate-500 dark:bg-slate-600 rounded-md mobile:text-xs lg:text-sm '>
            {microType ? '마이크 가능' : '마이크 불가능'}
          </div>
          {gameStyleType !== '' && (
            <div className='p-1 bg-slate-500 dark:bg-slate-600 rounded-md ml-2 mobile:text-xs lg:text-sm'>
              {gameStyleType === 'hard' ? '빡겜지향' : gameStyleType === 'funny' ? '즐겜지향' : ''}
            </div>
          )}
        </div>
        <div className='bg-gray-400 dark:bg-slate-500 h-[1px] mobile:w-[295px] mobile:-ml-[10px] tablet:w-[515px] tablet:-ml-[10px]  lg:w-[830px] lg:-ml-[25px] xl:w-[915px]'></div>
        <div className='flex mt-1 mb-1 lg:mt-2 lg:mb-2 xl:mt-1.5 xl:mb-1.5'>
          <div className='flex items-center mobile:text-xs tablet:text-lg xl:text-2xl'>
            <BsChatSquare className='mr-1 mobile:w-[18px] mobile:h-[18px] tablet:w-[24px] tablet:h-[24px] lg:w-[30px] lg:h-[30px] xl:w-[35px] xl:h-[35px]'/>
            {selectedPostCommentList.length}
          </div>
        </div>
        <div className='bg-gray-400 dark:bg-slate-500 h-[1px] mobile:w-[295px] mobile:-ml-[10px] tablet:w-[515px] tablet:-ml-[10px] lg:w-[830px] lg:-ml-[25px] xl:w-[915px]'></div>
        <div className='mobile:h-[235px] lg:h-[245px] overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-md  scrollbar-track-white dark:scrollbar-track-slate-500 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700
          mobile:w-[285px] tablet:w-[505px] lg:w-[805px] xl:w-[890px]'>
          <CommentList selectedPostId={_id}/>
        </div>
        <div className='bg-gray-400 dark:bg-slate-500 h-[1px] mobile:w-[295px] mobile:-ml-[10px] tablet:w-[515px] tablet:-ml-[10px]  lg:w-[830px] lg:-ml-[25px] xl:w-[915px]'></div>
        {userInfo && (
          <>
            <div className=' flex w-full mt-3 mobile:h-[60px] lg:h-[85px]'>
              <div className=' flex justify-center  mobile:mr-2 lg:mr-3'>
                <img className='rounded-full mobile:w-[25px] mobile:h-[25px] tablet:w-[30px] tablet:h-[30px] lg:w-[50px] lg:h-[50px]' src={userInfo.profileImg} alt='profile' />
              </div>
              <div className=' overflow-x-hidden scrollbar-thin scrollbar-thumb-rounded-md  scrollbar-track-white dark:scrollbar-track-slate-500 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700
                mobile:w-[244px] tablet:w-[448px] lg:w-[715px] xl:w-[795px]'>
                <form  className=' mobile:w-[224px] tablet:w-[430px] lg:w-[695px] xl:w-[775px]'>
                  <textarea ref={textareaRef} rows={1}  placeholder='댓글 추가' value={text} onChange={onChangeHandle} onFocus={() => setFocus(true)} className={focus ? 
                    'outline-none w-full  bg-slate-300 dark:bg-slate-700 resize-none border-b-[1px] border-slate-500 dark:border-slate-900 transition-colors duration-700 text-lg overflow-hidden mobile:text-xs lg:text-lg'
                    : 'outline-none w-full  bg-slate-300 dark:bg-slate-700 resize-none border-b-[1px] border-white text-lg overflow-hidden mobile:text-xs lg:text-lg'}/>
                  {focus && (
                    <div className='flex justify-end mt-2 mobile:mt-1 mobile:text-xs mobile:h-[25px] lg:h-[35px]'>
                      <button type='button' onClick={onClickCancelHandle} className='mr-4 rounded-md bg-slate-500 dark:bg-slate-900 mobile:w-[25px] mobile:h-[25px] lg:w-[50px] lg:h-[35px]'>
                        취소
                      </button>
                      <button type='submit' disabled={text === ''} onClick={onSubmitHanndle} className={
                        text !== '' ? 'rounded-md bg-green-500 mobile:w-[25px] mobile:h-[25px] lg:w-[50px] lg:h-[35px]'
                        :'rounded-md bg-slate-500 dark:bg-slate-900 cursor-not-allowed mobile:w-[25px] mobile:h-[25px] lg:w-[50px] lg:h-[35px]'}>
                        작성
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </>
        )}
        {!userInfo && (
          <div className='h-[99px] flex justify-center items-center mobile:text-xs tablet:text-sm lg:text-base '>
            로그인 시 댓글 작성이 가능합니다.
          </div>
        )}
      </article>
  </div>
  )
}
