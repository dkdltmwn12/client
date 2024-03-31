import React, { useState } from 'react'
import ReplyCommentCard from './ReplyCommentCard'
import { MdOutlineSubdirectoryArrowRight } from 'react-icons/md'

export default function ReplyCommentList({toggleReply, selectedPostCommentList, selectedPostId, selectedCommentId, selectedPostReplyCommentList}) {
  const replyALLCommentList = selectedPostCommentList.filter((comment) => comment.replyTo && comment.rootCommentId === selectedCommentId)
  console.log('selectedPostALLComment :', selectedPostCommentList);
  console.log('replyALLCommentList :', replyALLCommentList);

  const [toggleMore, setToggleMore] = useState(false);
  return (
    <>
      {toggleReply && replyALLCommentList && replyALLCommentList.slice(0, 3).map((comment) => (
        <div key={comment._id} className='replyList list-none mt-2 mobile:ml-8 lg:ml-14'>
          <ReplyCommentCard selectedPostId={selectedPostId} selectedPostCommentList={selectedPostCommentList} selectedCommentId={selectedCommentId} selectedPostReplyCommentList={selectedPostReplyCommentList} comment={comment}/>
        </div>
      ))}
      {!toggleMore && (
        <>
          {replyALLCommentList.length > 3 && (
            <div className='h-[30px] mobile:mt-2 lg:mt-3 cursor-pointer rounded-full mobile:ml-8 lg:ml-14'>
              <span onClick={() => setToggleMore(true)} className='font-bold leading-[21px]'>
                <MdOutlineSubdirectoryArrowRight className='inline w-[21px] h-[21px]'/> 답글 더보기
              </span>
            </div>
          )}
        </>
      )}
      {toggleMore && (
        <>
          {replyALLCommentList && replyALLCommentList.slice(3, replyALLCommentList.length).map((comment) => (
            <div key={comment._id} className='replyList list-none mt-2 mobile:ml-8 lg:ml-14'>
              <ReplyCommentCard selectedPostId={selectedPostId} selectedPostCommentList={selectedPostCommentList} selectedCommentId={selectedCommentId} selectedPostReplyCommentList={selectedPostReplyCommentList} comment={comment}/>
            </div>
          ))}
        </>
      )}
      
    </>
  )
}
