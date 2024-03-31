import React, {  useState, useRef, useEffect } from 'react'
import { IoClose } from "react-icons/io5";
import {FiRefreshCw} from 'react-icons/fi'
import {PiMicrophoneFill, PiMicrophoneSlashFill} from 'react-icons/pi'
import PositionButton from './PositionButton';
import SelectedPartyType from './SelectedPartyType';
import WriteSelectedQueueType from './write/WriteSelectedQueueType';
import WritePositionButton from './write/WritePositionButton';
import WriteMyPositionButtton from './write/WriteMyPositionButtton';
import { useDispatch } from 'react-redux';
import { selectAndClickedAndUpdateArticleList, fetchingBoardList, clickedPositionArticleList, selectedQueueArticleList, selectedTierArticleList } from '../../features/board/boardSlice';
import { articleRegister, } from '../../api/postData';

const queueOptions = [
    { value: '일반', label: '일반' },
    { value: '솔로랭크', label: '솔로랭크' },
    { value: '자유랭크', label: '자유랭크' },
    { value: '무작위 총력전', label: '무작위 총력전' },
];

const tierOptions = [
    { value: 'CHALLENGER', label: '챌린저' },
    { value: 'GRANDMASTER', label: '그랜드마스터' },
    { value: 'MASTER', label: '마스터' },
    { value: 'DIAMOND', label: '다이아몬드' },
    { value: 'EMERALD', label: '에매랄드' },
    { value: 'PLATINUM', label: '플래티넘' },
    { value: 'GOLD', label: '골드' },
    { value: 'SILVER', label: '실버' },
    { value: 'BRONZE', label: '브론즈' },
    { value: 'IRON', label: '아이언' },
];

export default function BoardDropdown({setPage}) {
    const dispatch = useDispatch();
    const [queueOption, setQueueOption] = useState('ALL')
    const [tierOption, setTierOption] = useState('ALL')
    const [selected, setSelected] = useState('ALL')
    const [myPosition, setMyPosition] = useState('ALL')
    const [wantedPosition, setWantedPosition] = useState('ALL')
    const [gameStyle, setGameStyle] = useState('');
    const [toggleHard, setToggleHard] = useState(false);
    const [toggleFunny, setToggleFunny] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [recruit, setRecruit] = useState('구해요');
    const [selectedQueue, setSelectedQueue] = useState('솔로랭크')
    const [micro, setMicro] = useState(false);
    const [name, setName] = useState('');
    const [contents, setContents] = useState('');
    const [error, setError] = useState(false);

    const btnRef = useRef(null);
    const divRef = useRef(null);
    const parsePosition = wantedPosition === 'ALL' ? '포지션 상관 없이'
    : wantedPosition === 'Top' ? '탑'
    : wantedPosition === 'Jungle' ? '정글'
    : wantedPosition === 'Middle' ? '미드'
    : wantedPosition === 'Bottom' ? '원딜'
    : wantedPosition === 'Support' ? '서폿' : '';

    const clickWrapperTag = (e) => {
        if(document.activeElement !== btnRef.current && !e.composedPath().includes(divRef.current)) {
            setToggle(false)
        }
    }
    
    const clickedUpdateHandle = () => {
        dispatch(fetchingBoardList())
        dispatch(selectAndClickedAndUpdateArticleList({queueType : queueOption, tierType: tierOption, positionType : selected}))
        setPage(1)

    }
    
    const selectedQueueOptionChangeHandle = (e) => {
        setQueueOption(e.target.value)
        dispatch(selectedQueueArticleList({queueType : e.target.value, tierType: tierOption, positionType : selected}))
        setPage(1)
    }

    const selectedTierOptionChangeHandle = (e) => {
        setTierOption(e.target.value)
        dispatch(selectedTierArticleList({queueType : queueOption, tierType : e.target.value,  positionType : selected}))
        setPage(1)
    }

    const clickedPositionTypeHandle = (type) => {
        setSelected(type)
        dispatch(clickedPositionArticleList({queueType: queueOption, tierType : tierOption, positionType: type}))
        setToggle(false)
        setPage(1)
    }

    const toggleFormHandle = () => {
        setToggle(!toggle)
        setMyPosition('ALL');
        setWantedPosition('ALL');
        setGameStyle('');
        setToggleHard(false);
        setToggleFunny(false);
        setRecruit('구해요');
        setSelectedQueue('솔로랭크');
        setName('');
        setContents('');
        setMicro(false);
    }


    const writeSelectGameStyleHandle = (type) => {
        if(type === 'hard') {
            setGameStyle('hard')
            setToggleHard(!toggleHard)
            if(toggleHard) {
                setGameStyle('')
            }
        }
        else if(type === 'funny') {
            setGameStyle('funny')
            setToggleFunny(!toggleFunny)
            if(toggleFunny) {
                setGameStyle('')
            }
        }
    }

    const writeOnSubmitHandle = (e) => {
        e.preventDefault();
    
        const info = {
            writeType: recruit,
            queueType: selectedQueue,
            microType: micro,
            myPositionType: myPosition, 
            wantedPositionType: recruit === '구해요' ? wantedPosition : '',
            gameStyleType: gameStyle,
            title: selectedQueue !== '무작위 총력전' ? `${selectedQueue} ${parsePosition} ${recruit}` : selectedQueue === '무작위 총력전' && recruit === '구해요' ? `${selectedQueue} 같이 할 사람 ${recruit}` : ` ${selectedQueue} 같이 할 사람 ${recruit}`,
            name : name.includes('#') ? name : '',
            contents,
        }
        console.log(info);
        articleRegister(info)
        .then(() => {
            dispatch(fetchingBoardList())
            setToggle(false);
            setSelected('ALL')
            setQueueOption('ALL')
            setError(false)
        })
        .catch(() => {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 3000)
        })
    }

    useEffect(() => {
        document.addEventListener('click', clickWrapperTag)
    })

  return (
    <>
        <ul className='w-full flex mt-5 flex-wrap m-auto  mobile:max-w-[308px] mobile:justify-center mobile_big:justify-normal tablet:max-w-[540px]  lg:max-w-[840px] xl:max-w-none'>
            <li className=' h-[40px]'>
                <button
                className='flex justify-center items-center w-[75px] h-[40px] rounded-md bg-green-500 hover:bg-green-400 dark:bg-green-600 hover:dark:bg-green-500'
                onClick={clickedUpdateHandle}
                >
                    <FiRefreshCw className='mr-1'/>
                    <span className=' text-xs'>업데이트</span>
                </button>
            </li>
            <div className='flex ml-1 mr-2'>
                <li className=' w-[80px] h-[40px]  leading-[40px] bg-slate-500 dark:bg-slate-900 rounded-md text-xs'>
                    <select className='w-[80px] bg-slate-500 dark:bg-slate-900 outline-none cursor-pointer truncate' onChange={selectedQueueOptionChangeHandle}>
                        <option value="ALL">전체 큐</option>
                        {queueOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </li>
                <li className='ml-1 leading-[40px] w-[80px] h-[40px] bg-slate-500 dark:bg-slate-900 rounded-md text-xs'>
                    <select className='w-[80px]  bg-slate-500 dark:bg-slate-900 outline-none cursor-pointer' onChange={selectedTierOptionChangeHandle}>
                        <option value="ALL">전체 티어</option>
                        {tierOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </li>
            </div>
            <div className='flex mr-2 mobile:mt-2 min-[600px]:mt-0 tablet:mr-1 '>
                {queueOption !== '무작위 총력전' && ['ALL', 'Top', 'Jungle', 'Middle', 'Bottom', 'Support'].map(position => (
                    <PositionButton key={position} position={position} selected={selected}  clickedPositionTypeHandle={clickedPositionTypeHandle} />
                ))}
            </div>
            <li className={queueOption !== '무작위 총력전' ? 'flex items-center w-[65px] h-[40px] ml-auto text-xs mobile:mt-2 min-[600px]:mt-0  ' : 'flex items-center w-[65px] h-[40px] ml-auto text-xs mobile:mt-2 min-[600px]:mt-0'}>
                <button ref={btnRef} className={toggle ? 'w-[65px] h-[40px]  bg-slate-500 dark:bg-slate-900 rounded-md' :
                    'w-[140px] h-[40px]  bg-sky-900 rounded-md'} onClick={toggleFormHandle}>{toggle ? '닫기' : '글쓰기'}
                </button>
            </li>
        </ul>
        {toggle && (
            <>
                <div ref={divRef} className='absolute h-[650px] p-3 mt-2 z-10 bg-slate-600 dark:bg-slate-700 rounded-md
                    mobile:w-[285px] mobile:p-1 mobile_big:w-[360px] mobile_big:p-2 tablet:w-[405px] tablet:p-3 md:w-[460px] left-[55%] mobile:left-[3%] tablet:left-[27%] md:left-[30%] lg:left-[47%] xl:left-[55%] '>
                    <div onClick={() => setToggle(false)} className='absolute right-2 top-2 w-[50px] cursor-pointer text-end flex items-center justify-end'><IoClose className='w-[25px] h-[25px]'/></div>
                    <div className='mt-6 flex h-[26px]'>
                    {['구해요', '찾아요'].map((partyType) => (
                        <SelectedPartyType key={partyType} partyType={partyType} recruit={recruit}  setRecruit={setRecruit}/>
                    ))}
                    </div>
                    <div className='inline-flex flex-col w-[95px] h-[550px] mobile:w-[80px] mobile_big:w-[90px] md:w-[95px]'>
                        {['솔로랭크', '자유랭크', '일반', '무작위 총력전'].map((queueType) => (
                            <WriteSelectedQueueType key={queueType} queueType={queueType} selectedQueue={selectedQueue} setSelectedQueue={setSelectedQueue}/>
                        ))}
                        <div className='flex  mt-96 cursor-pointer' onClick={() => setMicro(!micro)}>
                            {micro ? <PiMicrophoneFill className='text-xl text-slate-400 dark:text-white'/> : <PiMicrophoneSlashFill className='text-xl text-slate-400 dark:text-white'/>}
                            <div className={micro ? 'relative w-[70px] bg-slate-300 dark:bg-slate-500 rounded-full ml-2' : 'relative w-[70px] bg-slate-500 dark:bg-slate-900 rounded-full ml-2'}>
                                <div className={
                                    micro ? 'absolute w-[13px] h-[13px] bg-white rounded-full duration-200 translate-x-12 translate-y-1 ' :
                                    'absolute w-[13px] h-[13px] bg-white rounded-full duration-200 translate-x-1.5 translate-y-1'
                                }/>
                            </div>
                            
                        </div>
                    </div>
                    <div className=' inline-flex flex-col w-[310px] h-[550px] ml-7 mt-7 mobile:ml-1 mobile:mt-5 md:ml-7 md:mt-7 mobile:w-[180px] mobile_big:w-[250px] md:w-[310px]'>
                        <input  className='h-[40px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none p-4 ' type='text' placeholder='소환사명 + #태그' value={name} onChange={(e) => setName(e.target.value)}/>
                        <span className='h-[48px] text-sm text-red-500'>
                            {error && (
                                <>
                                    등록된 소환사가 아닙니다.
                                    <div>소환사명과 태그를 확인해주세요.</div>
                                </>
                            )}
                        </span>
                        {selectedQueue !== '무작위 총력전' && (
                            <>
                                {recruit === '구해요' && (
                                    <>
                                        <div className='mt-3 text-sm'>나의 포지션</div>
                                        <div className=' flex mt-2 w-[310px] mobile_big:w-[250px] md:w-[310px]'>
                                            {['ALL', 'Top', 'Jungle', 'Middle', 'Bottom', 'Support'].map((position) => (
                                                <WriteMyPositionButtton key={position} position={position} myPosition={myPosition}  setMyPosition={setMyPosition}/>
                                            ))}
                                        </div>
                                    </>
                                )}
                                <div className='mt-3 text-sm'>{recruit === '구해요' ? '구하는 포지션' : '희망하는 포지션'}</div>
                                <div className=' flex mt-2 w-[310px] mobile_big:w-[250px] md:w-[310px]'>
                                    {['ALL', 'Top', 'Jungle', 'Middle', 'Bottom', 'Support'].map((position) => (
                                        <WritePositionButton key={position} position={position} wantedPosition={wantedPosition}  setWantedPosition={setWantedPosition}/>
                                    ))}
                                </div>
                                <div className='mt-3 text-sm'>플레이 스타일(옵션, 택1)</div>
                                <div className='flex mt-2'>
                                    <button disabled={toggleFunny}  onClick={() => writeSelectGameStyleHandle('hard')}
                                        className={
                                        toggleHard ? 'h-[40px] flex items-center text-center rounded-md p-1 bg-slate-400 dark:bg-slate-500 mr-2 text-sm'
                                        : ' h-[40px] flex items-center text-center rounded-md p-1 bg-slate-700 dark:bg-slate-900 mr-2 text-sm'
                                        }>
                                        빡겜지향
                                    </button>
                                    <button disabled={toggleHard} onClick={() => writeSelectGameStyleHandle('funny')}
                                        className={
                                        toggleFunny ? 'h-[40px] flex items-center text-center rounded-md p-1 bg-slate-400 dark:bg-slate-500 mr-2 text-sm'
                                        : ' h-[40px] flex items-center text-center rounded-md p-1 bg-slate-700 dark:bg-slate-900 mr-2 text-sm'
                                        }>
                                        즐겜지향
                                    </button>
                                </div>
                            </>
                        )}
                        <div className='mt-3 text-sm'>글 내용</div>
                        <textarea  className='w-[310px] h-[120px] mobile:w-[180px] mobile_big:w-[250px] md:w-[310px]
                        mt-2 bg-slate-500 dark:bg-slate-900 rounded-md outline-none p-2 text-sm resize-none'
                            placeholder='글 작성, 생략가능 50자 내외' value={contents} onChange={(e) => setContents(e.target.value)}
                        />
                        <button className={
                            recruit === '구해요' && selectedQueue !== '무작위 총력전' ? 'mt-7 w-[310px] mobile:w-[180px] mobile_big:w-[250px] md:w-[310px] h-[40px] bg-slate-500 dark:bg-slate-900 rounded-md' :
                            recruit !== '구해요' && selectedQueue !== '무작위 총력전' ? ' mt-[116px] w-[310px] mobile:w-[180px] mobile_big:w-[250px] md:w-[310px] h-[40px] bg-slate-500 dark:bg-slate-900 rounded-md' :
                            `mt-[292px] w-[310px] mobile_big:w-[250px] h-[40px] bg-slate-500 dark:bg-slate-900 rounded-md`}
                            onClick={writeOnSubmitHandle}>등록하기
                        </button>
                    </div>
                </div>
            </>
        )}
    </>
  )
}
