import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5';
import { reigsterAccount } from '../../api/postData';

export default function ModalRegisterForm({setToggleModal, setToggleSignUp}) {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [error, setError] = useState({error : false, message : ''});
  const {email, name, password, confirmPassword} = inputs;

  const onChangeHandle = (e) => {
    const {id, value} = e.target
    setInputs({...inputs, [id]:value})
  }

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    try {
      const response = await reigsterAccount(inputs)
      setToggleSignUp(false);
      return response
    }
    catch (error) {
      setError({error : true, message : error.response.data.message});
      setTimeout(() => {
        setError({error : false})
      }, 2000);
    }
    // if(password !== confirmPassword) {
    //   setError({error : true, message : '비밀번호가 일치하지 않습니다.'})
    //   setTimeout(() => {
    //     setError({error : false})
    //   }, 2000)
    // }
    // else {
    //   reigsterAccount(inputs)
    //   .then((response) => {
    //     setToggleSignUp(false);
    //     console.log('Register Data', response);
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //    setError({
    //     error : true,
    //     message : error.response.data.includes('shorter than the minimum allowed length') ? '비밀번호를 8자리 이상 입력해주세요.' 
    //     : error.response.data.includes('email_1 dup key') ? '중복된 이메일입니다.'
    //     : error.response.data})
    //    setTimeout(() => {
    //     setError({error : false})
    //    }, 2000)
    //   })
    // }
  }
  
  return (
    <div className='absolute z-10 top-[55px] h-[450px] bg-slate-400 dark:bg-slate-600 rounded-md text-black dark:text-white mobile:w-[304px] mobile_big:w-[350px] mobile:right-2 mobile_big:right-7 min-[500px]:right-10'>
        <div onClick={() => setToggleModal(false)} className='absolute right-2 top-2 w-[50px] cursor-pointer text-end flex items-center justify-end'><IoClose className='w-[25px] h-[25px]'/></div>
        <form onSubmit={onSubmitHandle} className='w-[80%] m-auto h-full flex flex-col p-4'>
          <label htmlFor='name'>이름</label>
          <input onChange={onChangeHandle} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-2' type='name' id='name' value={name} />
          <label htmlFor='email' className='mt-4'>이메일</label>
          <input onChange={onChangeHandle} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-2' type='email' id='email' value={email} />
          <p className='w-full h-[20px]'></p>
          <label htmlFor='password' className='mt-4 '>비밀번호 (8자리 이상)</label>
          <input onChange={onChangeHandle} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-2' type='password' id='password' value={password} />
          <label htmlFor='confirm-password' className='mt-4 '>비밀번호 확인</label>
          <input onChange={onChangeHandle} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-2' type='password' id='confirmPassword' value={confirmPassword} />
          <p className='w-full h-[20px] text-red-500 text-sm'>{error.error && error.message}</p>
          <div className='flex flex-col mt-auto'>
            <button onSubmit={onSubmitHandle} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md  mt-2' type='submit'>회원가입</button>
          </div>
        </form>
    </div>
  )
}
