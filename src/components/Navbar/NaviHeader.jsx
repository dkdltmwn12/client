import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { MdMenu } from "react-icons/md";
import { TbHorseToy } from "react-icons/tb";
import { IoSunny, IoMoon } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../../features/darkMode/darkModeSlice';
import ModalLoginForm from '../../portal/Login/ModalLoginForm';
import Modal from '../../portal/Modal';
import ModalRegisterForm from '../../portal/register/ModalRegisterForm';
import { fetchAuthUserData, fetchLogoutAccount } from '../../features/login/loginUserSlice';
import ModalProfile from '../../portal/Login/ModalProfile';
import ModalPasswordForm from '../../portal/Login/ModalPasswordForm';
import { getRefresh } from '../../api/getData';

export default function NaviHeader() {
  const dispatch = useDispatch();
  const darkMode = useSelector(state => state.darkMode.darkMode)
  const loginUserInfo = useSelector(state => state.loginUser.getUser);
  const {loginStatus, userInfo} = loginUserInfo;

  const [width, setWidth] = useState(window.innerWidth);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleSignUp, setToggleSignUp] = useState(false);
  const [toggleFindPW, setToggleFindPW] = useState(false);
  const [toggleProfile, setToggleProfile] = useState(false);
  const [file, setFile] = useState();


  const loginHandle = () => {
    if(!loginStatus) {
      setToggleModal(!toggleModal);
      setToggleSignUp(false);
      setToggleMenu(false);
    }
  };

  const logoutHandle = () => {
    if(loginStatus && userInfo) {
      dispatch(fetchLogoutAccount())
      setToggleModal(false);
      setToggleFindPW(false);
    }
  }
  
  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    if(loginStatus) {
      dispatch(fetchAuthUserData()).then(() => {
        const refreshInterval = setInterval(() => {
        getRefresh().catch(error => {
          if(error) {
            dispatch(fetchLogoutAccount());
            clearInterval(refreshInterval);
          }
        })
      }, 9 * 60 * 1000)})
    }
    // eslint-disable-next-line
  }, [loginStatus, dispatch])

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    if(width >= 500) {
      setToggleMenu(false);
    }
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  return (
    <nav className={'w-full pt-2 pb-2 bg-slate-500 text-black dark:bg-slate-900 dark:text-white'}>
      <div className='w-[95%] h-[40px] flex items-center m-auto '>
        <span className='min-w-[90px] text-xl ml-2 mr-2'>
          <Link  onClick={() => setToggleMenu(false)} to={'/'}>
            <div className='flex items-center'>
              <TbHorseToy className='w-[25px] h-[25px] mr-1'/>
              롤이터
            </div>
          </Link>
        </span>
        <div className='w-full flex justify-between items-center leading-[40px]'>
          <ul className='flex w-full items-center mobile:text-xs tablet:text-sm lg:text-base'>
            {width >= 500 ? 
              (
                <>
                  <li className='mr-2 '><Link to={'/patchNote'}>패치 노트</Link></li>
                  <li className='mr-2 '><Link to={'/board'}>DUO 게시판</Link></li>
                  {userInfo && (
                    <li className='flex items-center ml-auto'>
                      <div className='flex items-center mr-4'>
                        <div onClick={() => setToggleProfile(!toggleProfile)} className='cursor-pointer'>
                          <img className='rounded-full w-[40px] h-[40px]' src={userInfo.profileImg} alt='user' />
                          <span className='absolute bg-slate-600 dark:bg-slate-700 rounded-full translate-x-6 -translate-y-4  w-[20px] h-[20px] flex items-center justify-center'>
                            <IoMdSettings className='w-[15px] h-[15px]'/>
                          </span>
                        </div>
                        {toggleProfile && userInfo && (
                          <Modal>
                            <ModalProfile setToggleProfile={setToggleProfile} setToggleFindPW={setToggleFindPW} file={file} setFile={setFile}/>
                          </Modal>
                        )}
                        <span className='ml-2 hidden min-[550px]:inline'>{userInfo.name}</span>
                      </div>                         
                      <div onClick={logoutHandle} className='cursor-pointer'>로그아웃</div>
                    </li>
                  )}
                  {!userInfo && (<li onClick={loginHandle} className='ml-auto  cursor-pointer'>로그인</li>)}
                  {toggleModal && !userInfo && (
                    <Modal>
                      {toggleSignUp ? (
                        <ModalRegisterForm setToggleModal={setToggleModal} setToggleSignUp={setToggleSignUp}/>
                      ) : (
                        <ModalLoginForm  setToggleModal={setToggleModal} setToggleSignUp={setToggleSignUp} setToggleFindPW={setToggleFindPW}/>
                      )}
                    </Modal>
                  )}
                  {toggleModal && toggleFindPW && (
                    <Modal>
                      <ModalPasswordForm setToggleFindPW={setToggleFindPW}/>
                    </Modal>
                  )}
                </>
              ) : 
              (
                <>
                  <button onClick={() => setToggleMenu(!toggleMenu)} className='ml-auto w-[60px] h-[40px] flex justify-center items-center rounded-md bg-slate-400 dark:bg-slate-800'>
                    <MdMenu className='w-[60px] text-4xl'/>
                  </button>
                </>
              )
            }
          </ul>
          <ul className='ml-2 mr-2'>
            <div onClick={() => dispatch(toggleDarkMode())} className={'w-[70px] h-[24px] bg-slate-200 dark:bg-slate-700 rounded-full cursor-pointer'}>
              <div 
                className={
                  darkMode ? 'absolute flex items-center bg-slate-900 w-[20px] h-[20px] rounded-full duration-200 top-[18px] translate-x-0.5'
                  : 'absolute flex items-center bg-slate-900 w-[20px] h-[20px] rounded-full duration-200 top-[18px] translate-x-12'}>
                {darkMode ? <IoMoon className='absolute w-[15px] h-[15px] right-[3px] text-gray-600 '/> : <IoSunny className='absolute w-[15px] h-[15px] right-[2px] text-orange-500 '/>}</div>
              </div>
          </ul>
        </div>
      </div>
      <div className={` ${toggleMenu && width <= 500 ? 'relative left-0 transition-[left] duration-300' : 'absolute -left-[100%] transition-none'} w-[95%] list-none flex flex-col m-auto mobile:max-w-[600px] tablet:max-w-[768px] md:max-w-[1024px] lg:max-w-[1300px]`}>
        <li className='p-2 hover:bg-slate-600 hover:dark:bg-slate-700'><Link onClick={() => setToggleMenu(false)} to={'/patchNote'}>패치 노트</Link></li>
        <li className='p-2 hover:bg-slate-600 hover:dark:bg-slate-700'><Link onClick={() => setToggleMenu(false)} to={'/board'}>DUO 게시판</Link></li>
        {!userInfo && (<li className='p-2 hover:bg-slate-600 hover:dark:bg-slate-700' onClick={loginHandle}><Link>로그인</Link></li>)}
        {userInfo && (<li className='p-2 hover:bg-slate-600 hover:dark:bg-slate-700'><Link onClick={() => {setToggleMenu(false); setToggleProfile(true)}}>프로필 수정</Link></li>)}
        {toggleProfile && userInfo && width < 500 && (
          <Modal>
            <ModalProfile setToggleProfile={setToggleProfile}/>
          </Modal>
        )}
        {userInfo && (<li className='p-2 hover:bg-slate-600 hover:dark:bg-slate-700' onClick={logoutHandle}><Link>로그아웃</Link></li>)}
        {toggleModal && !userInfo && width < 500 && (
          <Modal>
            {toggleSignUp ? (
              <ModalRegisterForm setToggleModal={setToggleModal} setToggleSignUp={setToggleSignUp}/>
                ) : (
                <ModalLoginForm  setToggleModal={setToggleModal} setToggleSignUp={setToggleSignUp}/>
            )}
          </Modal>
        )}
      </div>
    </nav>
  )
}
