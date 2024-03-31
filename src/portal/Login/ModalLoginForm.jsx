import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoginAccount } from '../../features/login/loginUserSlice';

export default function ModalLoginForm({setToggleModal, setToggleSignUp, setToggleFindPW}) {
  const dispatch = useDispatch();
  const ErrorMessage = useSelector(state => state.loginUser.message);
  const [inputs, setInputs] = useState({
    loginEmail: '',
    password: ''
  });
  const {loginEmail, password} = inputs;

  const onChangeHandle = (e) => {
    const {id, value} = e.target
    setInputs({...inputs, [id]:value})
  }

  const toggleFindPassWordHandle = () => {
    setToggleFindPW(true);
  }

  const onSubmitHandle = (e) => {
    e.preventDefault();
    if(loginEmail === '' && password === '') return
    dispatch(fetchLoginAccount(inputs))

  }
  
  return (
    <div id='login' className='absolute z-10 top-[55px] h-[400px] bg-slate-400 dark:bg-slate-600 rounded-md text-black dark:text-white mobile:w-[304px] mobile:right-2 mobile_big:w-[350px] mobile_big:right-7 min-[500px]:right-10'>
        <div onClick={() => setToggleModal(false)} className='absolute right-2 top-2 w-[50px] cursor-pointer text-end flex items-center justify-end'><IoClose className='w-[25px] h-[25px]'/></div>
        <form onSubmit={onSubmitHandle} className='w-[80%] m-auto h-full flex flex-col p-4'>
          <label htmlFor='loginEmail' className=''>이메일</label>
          <input onChange={onChangeHandle} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-2' type='email' id='loginEmail' value={loginEmail} />
          <label htmlFor='password' className='mt-4 '>비밀번호</label>
          <input onChange={onChangeHandle} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-2' type='password' id='password' value={password} />
          <p className='w-full h-[20px] text-red-500 text-sm'>{ErrorMessage}</p>
          <div className='flex flex-col mt-auto'>
            <div onClick={toggleFindPassWordHandle} className='flex items-center cursor-pointer mb-1.5'>
              <FaSearch className='mr-1.5'/>
              비밀번호 찾기
            </div>
            <button onSubmit={onSubmitHandle} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md '>로그인</button>
          </div>
          <button onClick={() => setToggleSignUp(true)} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md  mt-2' type='button'>회원가입</button>
        </form>
    </div>
  )
}
