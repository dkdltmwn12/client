import React from 'react'

export default function SelectedPartyType({partyType, recruit, setRecruit}) {

  return (
    <div onClick={() => setRecruit(partyType)}
      className={`w-[250px]  text-center cursor-pointer 
      ${partyType === recruit ? ' border-b-2 border-slate-500 dark:border-gray-900' : ' border-b-2 border-gray-400 hover:border-gray-300' }`}>
      {partyType}
    </div>

  )
}
