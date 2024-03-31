import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { resetUserPassword } from '../api/postData';

export default function ResetPasswordForm() {
    const {token} = useParams();
    const [error, setError] = useState({error : false, message : ''})
    const [success, setSuccess] = useState({status : false, message : ''})
    const [inputs, setInputs] = useState({
        newPassword : '',
        confirmNewPassword : '',
    })
    const {newPassword, confirmNewPassword} = inputs;
    console.log(inputs)
    const onChangeHandle = (e) => {
        const {id, value} = e.target;
        setInputs({...inputs, [id]:value})
    }

    const onSubmitHandle = async (e) => {
        e.preventDefault();
        try {
            const response = await resetUserPassword({token, newPassword, confirmNewPassword});
            console.log(response)
            setSuccess({status : true, message : response.data.message})
            setTimeout(() => {
              setSuccess({status : false})
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
  return (
    <div className='w-[350px] mt-52 m-auto'>
        <form onSubmit={onSubmitHandle} className='flex flex-col'>
            <label htmlFor='newPassword' className='mt-4 '> 새로운 비밀번호 (8자리 이상)</label>
            <input onChange={onChangeHandle} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-2' type='password' id='newPassword' value={newPassword} />
            <label htmlFor='confirmNewPassword' className='mt-4 '>비밀번호 확인</label>
            <input onChange={onChangeHandle} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-2' type='password' id='confirmNewPassword' value={confirmNewPassword}/>
            <p className={success.status ? 'w-full h-[20px] text-green-500 text-sm mt-2' : 'w-full h-[20px] text-red-500 text-sm mt-2'}>{error.error && error.message} {success.status && success.message}</p>
            <button onSubmit={onSubmitHandle} className='h-[30px] bg-slate-500 dark:bg-slate-900 rounded-md outline-none mt-4'>제출</button>
        </form>
    </div>
  )
}
