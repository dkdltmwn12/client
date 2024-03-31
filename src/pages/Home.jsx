import React from 'react'
import PatchCarousel from '../components/patchCarousel/PatchCarousel'
import SearchInput from '../components/SearchInput/SearchInput'
import ArticleCarousel from '../components/Board/articles/ArticleCarousel';
import { TbHorseToy } from "react-icons/tb";

export default function Home() {
  return (
    <>
      <div className='flex justify-center'>
        <TbHorseToy className='mobile:w-[250px] mobile:h-[250px]'/>
      </div>
      <SearchInput/>
      <PatchCarousel/>
      <ArticleCarousel/>
    </>
  )
}
