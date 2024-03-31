import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5';
import { FaExchangeAlt } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { useDispatch, useSelector } from 'react-redux';
import { deleteProfileImage, updateUserProfile, uploadProfileImage } from '../../api/postData';
import { fetchAuthUserData } from '../../features/login/loginUserSlice';

export default function ModalProfile({setToggleProfile, setToggleFindPW, file, setFile}) {
  const dispatch = useDispatch()
  const loginUserInfo = useSelector(state => state.loginUser.getUser);
  const {userInfo} = loginUserInfo;
  const [inputs, setInputs] = useState({
    email: userInfo.email,
    newName : userInfo.name || '',
  });
  const [previewImg, setPreviewImg] = useState(file ? URL.createObjectURL(file) : null);
  const {email, newName} = inputs;

  console.log('all inputs', inputs);
  
  const onChangeHandle = (e) => {
    const {id, value, files} = e.target
    if(id === 'profileImg') {
      setFile(files && files[0]);
      return
    }
    setInputs({...inputs, [id]:value})
  }

  const toggleFindPassWordHandle = () => {
    setToggleFindPW(true);
    setToggleProfile(false);
  }

    
  const onSubmitHandle = async (e) => {
    e.preventDefault();
    console.log('submit handle in file:', file)
    try {
      await updateUserProfile(inputs);
      await uploadProfileImage(file);
      dispatch(fetchAuthUserData());
      setToggleProfile(false);
    }
    catch (error) {
      console.log(error)
    }
  }

  const onClickProfileDelete = async () => {
    try {
      await deleteProfileImage();
      dispatch(fetchAuthUserData())
      setPreviewImg(null);
      setFile(null);
      setToggleProfile(false);
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div id='profile' className='absolute z-10 top-[55px] h-[400px] bg-slate-400 dark:bg-slate-600 rounded-md text-black dark:text-white mobile:w-[304px] mobile:right-2 mobile_big:w-[350px] mobile_big:right-7 min-[500px]:right-10'>
      <div onClick={() => setToggleProfile(false)} className='absolute right-2 top-2 w-[50px] cursor-pointer text-end flex items-center justify-end'>
        <IoClose className='w-[25px] h-[25px]'/>
      </div>
      <form onSubmit={onSubmitHandle} className='w-[80%] m-auto h-full flex flex-col p-4' name='profileForm' encType='multipart/form-data'>
        <span className='flex justify-center'>
          {userInfo.profileImg !== '/img/default-profile-img.png' && (
            <span onClick={onClickProfileDelete} className='w-[100px] h-[100px] rounded-full bg-gray-600 absolute flex justify-center items-center opacity-0 hover:opacity-80 duration-500 cursor-pointer'>
              <FaTrashCan className='w-[30px] h-[30px] text-emerald-500'/>
            </span>
          )}
          <img className='rounded-full w-[100px] h-[100px]' src={previewImg ? previewImg : userInfo.profileImg} alt='profile'/>
        </span>
        <label htmlFor='profileImg' className='absolute bg-slate-500 dark:bg-slate-900 rounded-md cursor-pointer mobile:translate-x-[65px] mobile_big:translate-x-[85px] translate-y-20'>이미지 변경</label>
        <input onChange={onChangeHandle} className='hidden' type='file' id='profileImg' name='profileImg' accept='image/*'/>
        <label htmlFor='newName'>이름</label>
        <input onChange={onChangeHandle} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-2' type='name' id='newName' value={newName} />
        <label htmlFor='email' className='mt-4 '>이메일</label>
        <input onChange={onChangeHandle} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-2 cursor-not-allowed' disabled={true} type='email' id='email' value={email}/>
        <div className='flex flex-col mt-auto'>
          <div onClick={toggleFindPassWordHandle} className='flex items-center cursor-pointer mb-1.5'>
            <FaExchangeAlt className='mr-1.5'/>
            비밀번호 변경
          </div>
          <button onSubmit={onSubmitHandle} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md '>업데이트</button>
        </div>
      </form>
    </div>
  )
}
