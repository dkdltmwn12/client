import React from 'react'

export default function PositionButton({ position, selected, clickedPositionTypeHandle }) {

  return (
    <li className={`w-[35px] h-[40px] ${selected === position ? 'bg-slate-400 dark:bg-slate-600' : 'bg-slate-500 dark:bg-slate-900'} border-gray-400 border-1 ${selected === position ? '' : 'hover:bg-gray-400 hover:dark:bg-gray-600'} ${position === 'ALL' ? 'rounded-tl-md rounded-bl-md' : position === 'Support' ? 'rounded-tr-md rounded-br-md' : ''}`}>
      <button className='w-[35px] h-[40px] flex items-center justify-center' onClick={() => clickedPositionTypeHandle(position)}>
        <img className='w-[20px] h-[20px]'
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
