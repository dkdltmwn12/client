import React from 'react'

export default function ThumbnailsCard({ patch : {championName, championImg}}) {

  return (
    <div className=' mt-[8.5rem] flex justify-center'>
      <div>
        <img className='w-[168px] h-[250px]  rounded-2xl' src={championImg} alt={championName}/>
        <div className=' text-center text-sm  -translate-y-6 rounded-lg text-zinc-300 dark:text-zinc-50'>{championName}</div>
      </div>
    </div>
  )
}
