import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import {  useSelector } from 'react-redux';
import { findUserPasswordforEmail, updateUserPassword } from '../../api/postData';


export default function ModalPasswordForm({setToggleFindPW}) {
  const loginUserInfo = useSelector(state => state.loginUser.getUser);
  const {loginStatus, userInfo} = loginUserInfo;
  const [error, setError] = useState({error : false, message: ''});
  const [sendMailMsg, setSendMailMsg] = useState({status : false, message : ''})
  const [inputs, setInputs] = useState({
    email: loginStatus ? userInfo.email : '',
    nowPW: '',
    changePW: '',
    changeConfirmPW: '',
  })
  const {email} = inputs;

  const onChangeHandle = (e) => {
    const {id, value} = e.target;
    setInputs({...inputs, [id]:value})
  }

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    if(loginStatus) { // 로그인 상태에서 비밀번호를 변경하는 로직
      try {
        await updateUserPassword(inputs);
        setToggleFindPW(false);
        // dispatch(fetchLogoutAccount())
      }
      catch (error) {
        setError({error : true, message : error.response.data.message});
        setTimeout(() => {
          setError({error : false})
        }, 2000);
      }
    }
    else { // 비로그인 상태에서 비밀번호를 찾는 로직
      try {
        const response = await findUserPasswordforEmail(email);
        console.log(response)
        setSendMailMsg({status : true, message : response.data.message})
        setTimeout(() => {
          setSendMailMsg({status : false})
        }, 2000);
        return response
      } catch (error) {
        console.log(error)
        setError({error : true, message : error.response.data.message});
        setTimeout(() => {
          setError({error : false})
        }, 2000);
      }
    }
  }
  return (
    <div id='findPassword' className='absolute z-10 top-[55px] h-[400px] bg-slate-400 dark:bg-slate-600 rounded-md text-black dark:text-white mobile:w-[304px] mobile:right-2 mobile_big:w-[350px] mobile_big:right-7 min-[500px]:right-10'>
        <div onClick={() => setToggleFindPW(false)} className='absolute right-2 top-2 w-[50px] cursor-pointer text-end flex items-center justify-end'>
          <IoClose className='w-[25px] h-[25px]'/>
        </div>
        <form onSubmit={onSubmitHandle} className='w-[80%] m-auto h-full flex flex-col p-4'>
          <label htmlFor='email' className='mt-4'>이메일</label>
          <input id='email' className={loginStatus ?
            'h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-2 cursor-not-allowed'
            : 'h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-2'}
            onChange={onChangeHandle} type='email' disabled={loginStatus && true} value={email}
          />
          {loginStatus && (
            <>
              <label htmlFor='nowPW' className='mt-4'>현재 비밀번호</label>
              <input onChange={onChangeHandle} id='nowPW' type='password' className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-2'/>
              <label htmlFor='ChangePW' className='mt-4'>새 비밀번호 (8자리 이상)</label>
              <input onChange={onChangeHandle} id='changePW' type='password' className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-2'/>
              <label htmlFor='changeConfirmPW' className='mt-4'>새 비밀번호 확인</label>
              <input onChange={onChangeHandle} id='changeConfirmPW' type='password' className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-2'/>
              <p className='w-full h-[20px] text-red-500 text-sm'>{error.error && error.message}</p>
            </>
          )}
          {!loginStatus && (<p className={sendMailMsg.status ? 'w-full h-[20px] text-green-500 text-sm mt-2' : 'w-full h-[20px] text-red-500 text-sm mt-2'}>{error.error && error.message} {sendMailMsg.status && sendMailMsg.message}</p>)}
          <div className={loginStatus ? 'flex flex-col mt-auto' : 'flex flex-col mt-5'}>
            <button onSubmit={onSubmitHandle} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md '>{loginStatus ? '업데이트' : '이메일 전송'}</button>
          </div>
        </form>
    </div>
  )
}
