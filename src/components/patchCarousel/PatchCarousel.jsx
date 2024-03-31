import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPatchNoteFromDB } from '../../features/patchNote/patchNoteSlice';
import {v4 as uuidv4} from 'uuid'
import PatchCard from './PatchCard';
import ThumbnailsCard from './ThumbnailsCard';
import {Swiper, SwiperSlide} from 'swiper/react';
import { Navigation, Pagination, Autoplay} from 'swiper'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './note.css'
import { fetchingPatchNote } from '../../api/getData';

export default function PatchCarousel() {
  const dispatch = useDispatch();
  const patchNoteList = useSelector(state => state.patchNote.getPatchNotes)

  useEffect(() => {
    fetchingPatchNote()
    dispatch(getPatchNoteFromDB())
  }, [dispatch])

  return (
    <>
      <div className='overflow-hidden h-[440px] m-auto  w-[95%] max-w-[1050px] '>
        <div className='flex justify-between p-1 m-auto max-w-[1050px]  '>
          <h2 className='font-bold  p-1 text-base'>변경된 챔피언 (Ver.14-5)</h2>
          <div className='flex items-center'>
            <div className='patchlist-pagination'></div>
          </div>
        </div>
        <div className='max-w-[1050px]  m-auto'>
        <Swiper
          className='overflow-visible w-full  h-[420px] '
          loop={true}
          modules={[Navigation, Pagination, Autoplay]}
          // slideToClickedSlide={true}
          navigation
          // pagination={{el: '.patchlist-pagination',  type: 'bullets'}}
          slidesPerView={3}
          spaceBetween={25}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            600: {
              slidesPerView: 2,
            },
            1050: {
              slidesPerView: 3,
            },
          }}
          >
          {patchNoteList && patchNoteList.filter(item => item.championName).map((patch, index) => (
            <SwiperSlide key={uuidv4()}>
              {({isActive}) => (
                <>
                {isActive  ? (<PatchCard isActive={isActive} key={index} patch={patch}/>) : (<ThumbnailsCard patch={patch}/>)}
                </>
              )} 
            </SwiperSlide>
          ))}
        </Swiper>
        </div>
      </div>
  </>
  )
}
