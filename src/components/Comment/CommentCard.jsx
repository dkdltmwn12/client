import React, { useRef, useState } from 'react'
import { timeAgo } from '../../util/timeAgo'
import { CiMenuKebab } from "react-icons/ci";
import { FaLongArrowAltUp } from "react-icons/fa";
import { FaLongArrowAltDown } from "react-icons/fa";
import { BsPencil } from "react-icons/bs";
import { BsTrash } from "react-icons/bs";
import { useDispatch, useSelector } from 'react-redux';
import { getCommentListFromDB } from '../../features/comment/commentSlice';
import { createReplyComment, deleteComment, modifyComment } from '../../api/postData';
import ReplyCommentList from './ReplyCommentList';
export default function CommentCard({selectedPostId, selectedPostCommentList, comment, comment : {_id, content, postId, createdAt, writer : {name, profileImg}}}) {
  
  const dispatch = useDispatch();
  const [replyForm, setReplyForm] = useState(false);
  const loginUserInfo = useSelector(state => state.loginUser.getUser);
  const {userInfo} = loginUserInfo;
  const [focus, setFocus] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [toggleReply, setToggleReply] = useState(false);
  const [toggleCommentMenu, setToggleCommentMenu] = useState(false);
  const [toggleModifyComment, setToggleModifyComment] = useState(false);
  const textareaRef = useRef();
  const selectedPostReplyCommentList = selectedPostCommentList.filter((comment) => comment.replyTo === _id);
  const replyALLCommentList = selectedPostCommentList.filter((comment) => comment.replyTo && comment.rootCommentId === _id);

  
  const onClickToggleReplyComment = () => {
    setToggleReply(!toggleReply)
  }

  const onChangeHandle = (e) => {
    setReplyText(e.target.value);
    textareaRef.current.style.height = 'auto'; //height 초기화
    textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
  }

  const onSubmitCreateReplyHandle = async (e) => {
    e.preventDefault();
    try {
      const response =await createReplyComment({
        writer : (({isAdmin, isAuth, role, email, ...rest }) => rest)(userInfo), //IIFE
        content : replyText,
        postId : selectedPostId,
        replyTo : _id,
        rootCommentId: _id,
      })
      if(response.status === 200) {
        dispatch(getCommentListFromDB())
      }
      setFocus(false);
      setReplyText('');
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmitCommentModifyHandle = async (e) => {
    e.preventDefault();
    try {
      const response = await modifyComment({
        writer : (({isAdmin, isAuth, role, email, ...rest }) => rest)(userInfo), //IIFE
        content : replyText,
        postId : selectedPostId,
        selectedCommentId: _id,
      })
      if(response.status === 200) {
        dispatch(getCommentListFromDB())
      }
      setFocus(false);
      setReplyText('');
    } catch (error) {
      console.log(error)
    }
  }

  const commentDeleteHandle = async() => {
    try {
      const response = await deleteComment({
        writer : (({isAdmin, isAuth, role, email, ...rest }) => rest)(userInfo), //IIFE
        content : `@${name} ${replyText}`,
        postId : selectedPostId,
        selectedCommentId: _id,
      })
      if(response.status === 200) {
        dispatch(getCommentListFromDB())
      }
      setToggleCommentMenu(false);
    } catch (error) {
      console.log(error)
    }
  }

  const onClickCancelHandle = () => {
    setFocus(false);
    setReplyText('');
    setReplyForm(false);
    textareaRef.current.style.height = 'auto'; //height 초기화
  }

  const onClickModifyCancel = () => {
    setToggleCommentMenu(false);
    setToggleModifyComment(false);
    setReplyText('');
  }



  return (
    <>
      <div className='comment flex min-h-[70px]'>
        <div className=' flex justify-center  mobile:mr-2 lg:mr-3'>
          <img className='rounded-full mobile:w-[25px] mobile:h-[25px] tablet:w-[30px] tablet:h-[30px] lg:w-[50px] lg:h-[50px]' src={profileImg} alt='profile' />
        </div>
        <div className='w-full flex flex-col'>
          {!toggleModifyComment && (
            <>
              <div className='font-bold mobile:tex-xs lg:text-base'>{name} <span className='text-xs font-normal'>{timeAgo(createdAt, 'ko')}</span></div>
              <div className='mt-0.5 mobile:text-xs tablet:text-sm lg:text-base xl:text-lg whitespace-pre-wrap'>{content}</div>
              {userInfo && (
                <div className='mt-1'>
                  <div className='w-[60px] cursor-pointer mobile:text-xs tablet:text-sm ' onClick={() => setReplyForm(!replyForm)}>답글작성</div>
                </div>
              )}
              {replyForm && (
                <div className=' flex w-full mt-3 mobile:h-[60px] lg:h-[85px]'>
                  <div className=' flex justify-center  mobile:mr-2 lg:mr-3'>
                    <img className='rounded-full mobile:w-[20px] mobile:h-[20px] tablet:w-[25px] tablet:h-[25px] lg:w-[40px] lg:h-[40px]' src={userInfo.profileImg} alt='profile' />
                  </div>
                  <div className='w-full overflow-x-hidden '>
                    <form className=''>
                      <textarea ref={textareaRef} rows={1}  placeholder='답글 추가' value={replyText} onChange={onChangeHandle} onFocus={() => setFocus(true)} className={focus ? 
                        'outline-none w-full  bg-slate-300 dark:bg-slate-700 resize-none border-b-[1px] border-slate-500 dark:border-slate-900 transition-colors duration-700 text-lg overflow-hidden mobile:text-xs lg:text-lg'
                        : 'outline-none w-full  bg-slate-300 dark:bg-slate-700 resize-none border-b-[1px] border-white text-lg overflow-hidden mobile:text-xs lg:text-lg'}/>
                      {focus && (
                        <div className='flex justify-end mt-2 mobile:mt-1 mobile:text-xs mobile:h-[25px] lg:h-[35px]'>
                          <button type='button' onClick={onClickCancelHandle} className='mr-4 rounded-md bg-slate-500 dark:bg-slate-900 mobile:w-[25px] mobile:h-[25px] lg:w-[50px] lg:h-[35px]'>
                            취소
                          </button>
                          <button type='submit'  disabled={replyText === ''} onClick={onSubmitCreateReplyHandle} className={
                            replyText !== '' ? 'rounded-md bg-green-500 mobile:w-[25px] mobile:h-[25px] lg:w-[50px] lg:h-[35px]'
                            :'rounded-md bg-slate-500 dark:bg-slate-900 cursor-not-allowed mobile:w-[25px] mobile:h-[25px] lg:w-[50px] lg:h-[35px]'}>
                            작성
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
          {toggleModifyComment && (
            <div className='w-full overflow-x-hidden '>
              <form className='mobile:min-h-[54px] tablet:min-h-[62px] lg:min-h-[76px] xl:min-h-[80px]'>
                <textarea ref={textareaRef} rows={1}  placeholder='댓글 수정' value={replyText} onChange={onChangeHandle} onFocus={() => setFocus(true)}
                  className='outline-none w-full  bg-slate-300 dark:bg-slate-700 resize-none border-b-[1px] border-slate-500 dark:border-slate-900 transition-colors duration-700 text-lg overflow-hidden mobile:text-xs lg:text-lg'
                />
                <div className='flex justify-end mt-2 mobile:mt-1 mobile:text-xs mobile:h-[25px] lg:h-[35px]'>
                  <button type='button' onClick={onClickModifyCancel} className='mr-4 rounded-md bg-slate-500 dark:bg-slate-900 mobile:w-[25px] mobile:h-[25px] lg:w-[50px] lg:h-[35px]'>
                    취소
                  </button>
                  <button type='submit'  disabled={replyText === ''} onClick={onSubmitCommentModifyHandle} className={
                    replyText !== '' ? 'rounded-md bg-green-500 mobile:w-[25px] mobile:h-[25px] lg:w-[50px] lg:h-[35px]'
                    : 'rounded-md bg-slate-500 dark:bg-slate-900 cursor-not-allowed mobile:w-[25px] mobile:h-[25px] lg:w-[50px] lg:h-[35px]'}>
                    수정
                  </button>
                </div>
              </form>
            </div>
          )}
          {replyALLCommentList.length > 0 && (
            <div onClick={onClickToggleReplyComment} className='w-[85px] justify-center items-center flex mt-3 cursor-pointer rounded-full bg-slate-500
              mobile:h-[20px] lg:h-[30px]'>
              {toggleReply ? <FaLongArrowAltUp className='inline w-[15px] h-[15px] leading-[21px] text-xs'/> : <FaLongArrowAltDown className='inline w-[15px] h-[15px] leading-[21px] text-xs'/>} 답글 보기 {replyALLCommentList.length}
            </div>
          )}
        </div>
        <div className='relative mobile:min-w-[10px] tablet:min-w-[15px] lg:min-w-[20px]'>
          {userInfo._id === comment.writer._id && (
            <>
              <CiMenuKebab onClick={() => setToggleCommentMenu(!toggleCommentMenu)} className='cursor-pointer mobile:w-[10px] mobile:h-[10px] tablet:w-[15px] tablet:h-[15px] lg:w-[20px] lg:h-[20px]'/>
              {toggleCommentMenu && (
                <div className='cursor-pointer absolute bg-slate-400 dark:bg-slate-800 rounded-md -translate-x-12 pt-1 pb-1 w-[70px]'>
                  <div onClick={() => {setToggleModifyComment(true); setToggleCommentMenu(false);}} className=' h-[30px] flex justify-center items-center hover:bg-slate-500'>
                    <div>
                    <BsPencil className='mr-1'/>
                    </div>
                    <span>수정</span>
                  </div>
                  <div onClick={commentDeleteHandle} className='h-[30px] flex justify-center items-center hover:bg-slate-500'>
                    <div>
                      <BsTrash className='mr-1'/>
                    </div>
                    <span>삭제</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {toggleReply && (<ReplyCommentList toggleReply={toggleReply} setToggleReply={setToggleReply} selectedPostId={selectedPostId} selectedCommentId={_id} selectedPostCommentList={selectedPostCommentList} selectedPostReplyCommentList={selectedPostReplyCommentList}/>)}
    </>
  )
}
