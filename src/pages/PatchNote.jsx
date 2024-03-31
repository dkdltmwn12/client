import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {v4 as uuidv4} from 'uuid'
import { FaBoltLightning } from "react-icons/fa6";
import { FaQuoteLeft } from "react-icons/fa";
import { FaQuoteRight } from "react-icons/fa";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { getPatchNoteFromDB } from '../features/patchNote/patchNoteSlice';
export default function PatchNote() {
  const dispatch = useDispatch();
  const patchNoteList = useSelector(state => state.patchNote.getPatchNotes)
  const championList = patchNoteList.filter(item => item.championName)
  const itemList = patchNoteList.filter(item => item.itemName);
  const [width, setWidth] = useState(window.innerWidth);
  const [selectedChampListIndex, setSelectedChampListIndex] = useState();
  const [selectedItemListIndex, setSelectedItemListIndex] = useState();
  const [selectedCurrentChampIndex, setSelectedCurrentChampIndex] = useState(0);
  const [selectedCurrentItemIndex, setSelectedCurrentItemIndex] = useState();
  const [toggleChampList, setToggleChampList] = useState(false);
  const [toggleItemList, setToggleItemList] = useState(false);
  const divChampRef = useRef({});
  const divItemRef = useRef({});

  const moveToScrollTargetChampHandle = (index) => {
    divChampRef.current[index].scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
    setSelectedChampListIndex(index)
  }

  const moveToScrollTargetItemHandle = (index) => {
    divItemRef.current[index].scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
    setSelectedItemListIndex(index)
  }

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const champElement = divChampRef.current[selectedChampListIndex];
      const itemElement = divItemRef.current[selectedItemListIndex];
      
      if (champElement) {
        const { top: champTop, bottom: champBottom, height: champHeight } = champElement.getBoundingClientRect();
        if (champTop >= 0 && (champBottom - champHeight) <= viewportHeight) {
          setSelectedCurrentChampIndex(selectedChampListIndex);
          setSelectedCurrentItemIndex(null);
        }
      }
  
      if (itemElement) {
        const { top: itemTop, bottom: itemBottom, height: itemHeight } = itemElement.getBoundingClientRect();
        if (itemTop >= 0 && (itemBottom - itemHeight) <= viewportHeight) {
          setSelectedCurrentItemIndex(selectedItemListIndex);
          setSelectedCurrentChampIndex(null);
        }
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [selectedChampListIndex, selectedItemListIndex]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  useEffect(() => {
    dispatch(getPatchNoteFromDB())
  }, [dispatch])
  return (
    <>
      <div className='w-full h-full'>
        <div className='w-[85%] pt-5 m-auto text-center min-w-[320px] max-w-[1150px]'>
          <span className='text-4xl'>패치 노트</span>
        </div>
        <section className='flex w-[95%] h-full m-auto max-w-[1150px]'>
          <div className={width >= 600 ? 'patch-list w-[75%] lg:w-[85%]' : 'patch-list'}>
            <header className='text-2xl font-bold pb-8'>챔피언</header>
            {championList && championList.map(({
              championName,
              championImg,
              championChangePurpose,
              championChangeSummary,
              abilityImg : {
                ability1Img,
                ability2Img,
                ability3Img,
                ability4Img,
                ability5Img,
                ability6Img,
              },
              statTitle : {
                ability1Title,
                ability2Title,
                ability3Title,
                ability4Title,
                ability5Title,
                ability6Title
              }, 
              statValue : {
                ability1Value,
                ability2Value,
                ability3Value,
                ability4Value,
                ability5Value,
                ability6Value,
              }}, index) => (
              <div key={uuidv4()} ref={(el) => divChampRef.current[index] = el} className='relative border-[1px] border-black dark:border-white
                mobile:m-2 mobile:mb-12 mobile:p-4 lg:m-5 lg:mb-12 lg:p-10'>
                <img className='absolute rounded-full 
                  mobile:w-[70px] mobile:h-[70px] lg:w-[105px] lg:h-[105px]
                  mobile:-translate-x-7 mobile:-translate-y-12 lg:-translate-x-20 lg:-translate-y-20' src={championImg} alt={championName}
                />
                <div className='absolute w-[70px] text-sm text-center text-slate-200 bg-black bg-opacity-50 rounded-full
                  mobile:-translate-x-7 lg:-translate-x-16 lg:translate-y-1'>{championName}
                </div>
                <div className='mt-6 leading-[30px] font-bold
                  mobile:text-xs'>
                  <FaBoltLightning className='inline mobile:text-xs lg:text-base'/> {championChangeSummary}
                </div>
                <div className='mt-2 mobile:text-sm lg:text-base'>
                  <FaQuoteLeft className='inline mr-2 -translate-y-1'/>
                  <span className='leading-[30px] font-bold font-serif'>{championChangePurpose}</span>
                  <FaQuoteRight className='inline ml-2'/>
                </div>
                <div className=' border-[1px] border-slate-500 dark:border-slate-600  mt-3 mb-3'></div>
                {ability1Title !== '' && (
                  <>
                    <h3 className='flex items-center'>
                      {ability1Img !== '' && <img className='rounded-md mobile:w-[25px] mobile:h-[25px] lg:w-[50px] lg:h-[50px]' src={ability1Img} alt={ability1Title}/>}
                      <span className={ability1Img !== '' ? 'ml-2 font-serif mobile:text-xs lg:text-base' : 'font-serif mobile:text-xs lg:text-base'}>{ability1Title}</span>
                    </h3>
                    <ul>
                      {ability1Value.map((value) => (
                        <li key={uuidv4()} className='list-disc mt-1 font-bold mobile:text-xs lg:text-sm'>{value}</li>
                      ))}
                    </ul>
                    {ability2Title !== '' && <div className=' border-[1px] border-slate-500 dark:border-slate-600  mt-3 mb-3'></div>}
                  </>
                )}
                {ability2Title !== '' && (
                  <>
                    <h3 className='flex items-center'>
                      {ability2Img !== '' && <img className='rounded-md mobile:w-[25px] mobile:h-[25px] lg:w-[50px] lg:h-[50px]' src={ability2Img} alt={ability2Title}/>}
                      <span className={ability2Img !== '' ? 'ml-2 font-serif mobile:text-xs lg:text-base' : 'font-serif mobile:text-xs lg:text-base'}>{ability2Title}</span>
                    </h3>
                    <ul>
                      {ability2Value.map((value) => (
                        <li key={uuidv4()} className='list-disc mt-1 font-bold mobile:text-xs lg:text-sm'>{value}</li>
                      ))}
                    </ul>
                    {ability3Title !== '' && <div className=' border-[1px] border-slate-500 dark:border-slate-600  mt-3 mb-3'></div>}
                  </>
                )}
                {ability3Title !== '' && (
                  <>
                    <h3 className='flex items-center'>
                      {ability3Img !== '' && <img className='rounded-md mobile:w-[25px] mobile:h-[25px] lg:w-[50px] lg:h-[50px]' src={ability3Img} alt={ability3Title}/>}
                      <span className={ability3Img !== '' ? 'ml-2 font-serif mobile:text-xs lg:text-base' : 'font-serif mobile:text-xs lg:text-base'}>{ability3Title}</span>
                    </h3>
                    <ul>
                      {ability3Value.map((value) => (
                        <li key={uuidv4()} className='list-disc mt-1 font-bold mobile:text-xs lg:text-sm'>{value}</li>
                      ))}
                    </ul>
                    {ability4Title !== '' && <div className=' border-[1px] border-slate-500 dark:border-slate-600  mt-3 mb-3'></div>}
                  </>
                )}
                {ability4Title !== '' && (
                  <>
                    <h3 className='flex items-center'>
                      {ability4Img !== '' && <img className='rounded-md mobile:w-[25px] mobile:h-[25px] lg:w-[50px] lg:h-[50px]' src={ability4Img} alt={ability4Title}/>}
                      <span className={ability4Img !== '' ? 'ml-2 font-serif mobile:text-xs lg:text-base' : 'font-serif mobile:text-xs lg:text-base'}>{ability4Title}</span>
                    </h3>
                    <ul>
                      {ability4Value.map((value) => (
                        <li key={uuidv4()} className='list-disc mt-1 font-bold mobile:text-xs lg:text-sm'>{value}</li>
                      ))}
                    </ul>
                    {ability5Title !== '' && <div className=' border-[1px] border-slate-500 dark:border-slate-600  mt-3 mb-3'></div>}
                  </>
                )}
                {ability5Title !== '' && (
                  <>
                    <h3 className='flex items-center'>
                      {ability5Img !== '' && <img className='rounded-md mobile:w-[25px] mobile:h-[25px] lg:w-[50px] lg:h-[50px]' src={ability5Img} alt={ability5Title}/>}
                      <span className={ability5Img !== '' ? 'ml-2 font-serif mobile:text-xs lg:text-base' : 'font-serif mobile:text-xs lg:text-base'}>{ability5Title}</span>
                    </h3>
                    <ul>
                      {ability5Value.map((value) => (
                        <li key={uuidv4()} className='list-disc mt-1 font-bold mobile:text-xs lg:text-sm'>{value}</li>
                      ))}
                    </ul>
                    {ability6Title !== '' && <div className=' border-[1px] border-slate-500 dark:border-slate-600  mt-3 mb-3'></div>}
                  </>
                )}
                {ability6Title !== '' && (
                  <>
                    <h3 className='flex items-center'>
                      {ability6Img !== '' && <img className='rounded-md mobile:w-[25px] mobile:h-[25px] lg:w-[50px] lg:h-[50px]' src={ability6Img} alt={ability6Title}/>}
                      <span className={ability6Img !== '' ? 'ml-2 font-serif mobile:text-xs lg:text-base' : 'font-serif mobile:text-xs lg:text-base'}>{ability6Title}</span>
                    </h3>
                    <ul>
                      {ability6Value.map((value) => (
                        <li key={uuidv4()} className=' list-disc mt-1 font-bold mobile:text-xs lg:text-sm'>{value}</li>
                      ))}
                    </ul>
                  </>
                )}
                <div className='after:absolute after:w-[50px] after:h-[30px] after:border-b-[0.8px] after:border-black after:dark:border-white after:-top-[8px] after:-right-[18px] after:rotate-45 after:bg-slate-200 after:dark:bg-slate-800'></div>
              </div>
            ))}
            <header className='text-2xl font-bold pb-8'>아이템</header>
            {itemList && itemList.map(({
              itemName,
              itemImg,
              itemChangePurpose,
              itemValueChange : {itemValueChangeList}
              }, index) => (
              <div key={uuidv4()} ref={(el) => divItemRef.current[index] = el} className='relative border-[1px] border-black dark:border-white
                mobile:m-2 mobile:mb-12 mobile:p-4 lg:m-5 lg:mb-12 lg:p-10'>
                <img className='absolute rounded-full 
                  mobile:w-[70px] mobile:h-[70px] lg:w-[105px] lg:h-[105px]
                  mobile:-translate-x-7 mobile:-translate-y-12 lg:-translate-x-20 lg:-translate-y-20' src={itemImg} alt={itemName}/>
                <div className='absolute  text-sm text-center text-slate-200 bg-black bg-opacity-50 rounded-full
                  mobile:w-[70px] mobile:-translate-x-7 lg:w-[105px] lg:-translate-x-20 lg:translate-y-1'>{itemName}</div>
                {itemChangePurpose !== '' && (
                  <div className='mobile:mt-10 lg:mt-8 mobile:text-sm lg:text-base'>
                    <FaQuoteLeft className='inline mr-2 -translate-y-1'/>
                    <span className='leading-[30px] font-bold font-serif'>{itemChangePurpose}</span>
                    <FaQuoteRight className='inline ml-2'/>
                  </div>
                )}
                {itemChangePurpose !== '' && (
                  <div className=' border-[1px] border-slate-500 dark:border-slate-600  mt-3 mb-3'></div>
                )}
                {itemChangePurpose === '' && (
                  <div className=' mt-[72px]'></div>
                )}
                <ul className={itemChangePurpose !== '' ? '' : 'mt-3'}>
                  {itemValueChangeList.map((value) => (
                    <li key={uuidv4()} className='list-disc mt-1 font-bold mobile:text-xs lg:text-sm'>{value}</li>
                  ))}
                </ul>
                <div className='after:absolute after:w-[50px] after:h-[30px] after:border-b-[0.8px] after:border-black after:dark:border-white after:-top-[8px] after:-right-[18px] after:rotate-45 after:bg-slate-200 after:dark:bg-slate-800'></div>
              </div>
            ))}
          </div>
          {width >=600 && (
            <aside className='ml-4 text-xs w-[25%] lg:w-[15%]'>
              <nav className='fixed pl-2 border-l-[1px] border-black dark:border-white'>
                <h3 className='font-bold font-serif'>패치노트 (Ver. 14.5)</h3>
                <div onClick={() => setToggleChampList(!toggleChampList)} className='mt-2 cursor-pointer '>
                  {toggleChampList ? (<MdOutlineKeyboardArrowUp className='inline w-[16px] h-[16px] -translate-y-0.5'/>) : (<MdOutlineKeyboardArrowDown className='inline w-[16px] h-[16px] -translate-y-0.5'/>)}
                  <span className='font-bold'>챔피언</span>
                </div>
                {toggleChampList && championList.map(({championName}, index) => (
                  <li onClick={() => moveToScrollTargetChampHandle(index)} key={uuidv4()} className={selectedCurrentChampIndex === index ? 'm-1 ml-1.5 cursor-pointer font-extrabold font-serif' : 'm-1 ml-1.5 cursor-pointer font-thin' }>
                    {/* {console.log(divChampRef.current[index].querySelector('div').textContent)} */}
                    {championName}
                  </li>
                ))}
                <div onClick={() => setToggleItemList(!toggleItemList)} className='mt-2 cursor-pointer'>
                  {toggleItemList ? (<MdOutlineKeyboardArrowUp className='inline w-[16px] h-[16px] -translate-y-0.5'/>) : (<MdOutlineKeyboardArrowDown className='inline w-[16px] h-[16px] -translate-y-0.5'/>)}
                  <span className='font-bold'>아이템</span>
                </div>
                {toggleItemList && itemList.map(({itemName}, index) => (
                  <li onClick={() => moveToScrollTargetItemHandle(index)} key={uuidv4()} className={selectedCurrentItemIndex === index ? 'm-1 ml-1.5 cursor-pointer font-extrabold font-serif' : 'm-1 ml-1.5 cursor-pointer font-thin' }>
                    {itemName}
                  </li>
                ))}
              </nav>
            </aside>
          )}
        </section>
      </div>
    </>
  )
}
