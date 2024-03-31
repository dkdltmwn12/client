import React from 'react'

export default function WriteSelectedQueueType({queueType , selectedQueue, setSelectedQueue}) {
  return (
    <div className='mt-2'>
      <div onClick={() => setSelectedQueue(queueType)}
        className={`text-xs  cursor-pointer mt-2
        ${queueType === selectedQueue ? 'text-white dark:text-slate-900 font-extrabold' : ''} ${queueType === '솔로랭크' ? '' : 'mt-2'}`}>
        {queueType}
      </div>
    </div>
  )
}
