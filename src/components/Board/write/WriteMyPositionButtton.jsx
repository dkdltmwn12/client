import React from 'react'

export default function WriteMyPositionButtton({position, myPosition, setMyPosition}) {
  return (
    <li 
        className={`list-none w-[52px] h-[40px]  mobile:w-[30px] mobile_big:w-[42px] md:w-[52px]
        ${myPosition === position ? 'bg-slate-400 dark:bg-slate-600' : 'bg-slate-500 dark:bg-slate-900'} dark:border-gray-400 border-1
        ${myPosition === position ? '' : 'hover:bg-gray-400 hover:dark:bg-gray-600'}
        ${position === 0 ? 'rounded-tl-md rounded-bl-md' : position === 5 ? 'rounded-tr-md rounded-br-md' : ''}`}>
        <button onClick={() => setMyPosition(position)} className='flex items-center justify-center w-[52px] h-[40px] mobile:w-[30px] mobile_big:w-[42px] md:w-[52px]'>
            <img className='w-[20px] h-[20px] '
                src={`/img/position/Position_${
                    position === 'ALL' ? 'ALL' : 
                    position === 'Top' ? 'Top' : 
                    position === 'Jungle' ? 'Jungle' : 
                    position === 'Middle' ? 'Middle' : 
                    position === 'Bottom' ? 'Bottom' : 'Support'
                    }.png`
                }
                alt={
                    position === 'ALL' ? 'ALL' : 
                    position === 'Top' ? 'Top' :
                    position === 'Jungle' ? 'Jungle' :
                    position === 'Middle' ? 'Middle' :
                    position === 'Bottom' ? 'Bottom' : 'Support'
                }
            />
        </button>
    </li>
  )
}

