import React from 'react'

export default function PatchCard({patch : {abilityImg, statTitle, statValue, championImg, championName}}) {
  const {ability1Img, ability2Img, ability3Img, ability4Img, ability5Img, ability6Img} = abilityImg;
  const {ability1Title, ability2Title, ability3Title, ability4Title, ability5Title, ability6Title} = statTitle;
  const {ability1Value, ability2Value, ability3Value, ability4Value, ability5Value, ability6Value} = statValue;
  return (
    <div className=" flex flex-row h-96 bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-400 rounded-lg shadow ">
      <div className='w-[300px]'>
        <img className="h-full rounded-lg" src={championImg} alt={championName}/>
      </div>
      <div className="flex flex-col w-full mobile:p-1 leading-normal">
        <h5 className="mb-2 text-2xl font-bold mobile:text-base ">{championName}</h5>
        <div className='overflow-auto scrollbar-thin scrollbar-thumb-rounded-md  scrollbar-track-white dark:scrollbar-track-slate-900 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700'>
          <p className='mt-1 font-bold mobile:text-xs'>변경점</p>
          <div>
            <div className='flex items-center mt-4'>
              {ability1Img === '' ? null : <img className='mobile:w-[20px] rounded-lg' src={ability1Img} alt={ability1Title}/>}
              <span className='ml-2 font-serif mobile:text-xs'>{ability1Title}</span>
            </div>
            {ability1Value && ability1Value.map((ability, index) => (
              <div key={index} className=' mt-2 ml-2 font-semibold text-xs'>
                {ability}
              </div> 
            ))}
          </div>
          <div>
            <div className='flex items-center mt-4'>
              {ability2Img === '' ? null : <img className='mobile:w-[20px] rounded-lg' src={ability2Img} alt={ability2Title}/>}
              <span className='ml-2 font-serif mobile:text-xs'>{ability2Title}</span>
            </div>
            {ability2Value && ability2Value.map((ability, index) => (
              <div key={index} className=' mt-2 ml-2 font-semibold text-xs'>
                {ability}
              </div> 
            ))}
          </div>
          <div>
            <div className='flex items-center mt-4'>
              {ability3Img === '' ? null : <img className='mobile:w-[20px] rounded-lg' src={ability3Img} alt={ability3Title}/>}
              <span className='ml-2 font-serif mobile:text-xs'>{ability3Title}</span>
            </div>
            {ability3Value && ability3Value.map((ability, index) => (
              <div key={index} className=' mt-2 ml-2 font-semibold text-xs'>
                {ability}
              </div> 
            ))}
          </div>
          <div>
            <div className='flex items-center mt-4'>
              {ability4Img === '' ? null : <img className='mobile:w-[20px] rounded-lg' src={ability4Img} alt={ability4Title}/>}
              <span className='ml-2 font-serif mobile:text-xs'>{ability4Title}</span>
            </div>
            {ability4Value && ability4Value.map((ability, index) => (
              <div key={index} className=' mt-2 ml-2 font-semibold text-xs'>
                {ability}
              </div> 
            ))}
          </div>
          <div>
            <div className='flex items-center mt-4'>
              {ability5Img === '' ? null : <img className='mobile:w-[20px] rounded-lg' src={ability5Img} alt={ability5Title}/>}
              <span className='ml-2 font-serif mobile:text-xs'>{ability5Title}</span>
            </div>
            {ability5Value && ability5Value.map((ability, index) => (
              <div key={index} className=' mt-2 ml-2 font-semibold text-xs'>
                {ability}
              </div> 
            ))}
          </div>
          <div>
            <div className='flex items-center mt-4'>
              {ability6Img === '' ? null : <img className='mobile:w-[20px] rounded-lg' src={ability6Img} alt={ability6Title}/>}
              <span className='ml-2 font-serif mobile:text-xs'>{ability6Title}</span>
            </div>
            {ability6Value && ability6Value.map((ability, index) => (
              <div key={index} className=' mt-2 ml-2 font-semibold text-xs'>
                {ability}
              </div> 
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
