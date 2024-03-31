import React from 'react'
import {AiOutlineLoading} from 'react-icons/ai'
export default function LoadingSpinner() {
  return (
    <>
      <AiOutlineLoading className=' absolute text-9xl text-slate-900  left-[50%] top-[50%] animate-spin'/>
    </>
  )
}
