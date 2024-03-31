import React from 'react'
import CommentCard from './CommentCard';
import { useSelector } from 'react-redux';

export default function CommentList({selectedPostId}) {
  const commentList = useSelector(state => state.comment.getCommentList);
  const selectedPostCommentList = commentList.filter((comment) => comment.postId === selectedPostId);
  
  return (
    <>
      {selectedPostCommentList && selectedPostCommentList.filter(post => !post.replyTo).map((comment) => (
        <li key={comment._id} className='commentList list-none m-2'>
          <CommentCard selectedPostId={selectedPostId} selectedPostCommentList={selectedPostCommentList} comment={comment}/>
        </li> 
      ))}
    </>
  )
}
