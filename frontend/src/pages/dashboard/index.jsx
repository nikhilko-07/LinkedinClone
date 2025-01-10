import { getAboutUser, getAllUsers} from '@/config/redux/action/authAction';
import {
    createPost,
    deletePost,
    getAllComments,
    getAllPosts,
    incrementPostLike,
    postComment
} from '@/config/redux/action/postAction';
import UserLayout from '@/layout/UserLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from "@/layout/DashboardLayout";
import style from "./style.module.css";
import {BASE_URL} from "@/config";
import {resetPostId} from "@/config/redux/reducer/postReducer";

export default function  Dashboard () {



const dispatch = useDispatch();
const router = useRouter();
const postState = useSelector((state) => state.postreducer);
const authState = useSelector((state) => state.auth);
const [postContent, setPostContent] = useState("");
const [fileContent, setFileContent] = useState();
const [commentText, setCommentText] = useState();


useEffect(()=>{

    if(authState.isTokenThere){
        console.log("Token there");
        dispatch(getAllPosts())
        dispatch(getAboutUser({token:localStorage.getItem('token')}))
    }
    if(!authState.all_profiles_fetched){
        dispatch(getAllUsers())
    }
},[authState.isTokenThere])

const handleUpload = async () => {

    await dispatch(createPost({file: fileContent, body: postContent}));
    setPostContent("")
    setFileContent(null)
    dispatch(getAllPosts())
}

    if(authState.user){
  return (
    <UserLayout>
         <DashboardLayout>
             <div className={style.homeComponent}>

                 <div className={style.createPostContainer}>
                     <img className={style.userProfile}  src={`${BASE_URL}/${authState.user.userId.profilePicture}`}/>
                     <textarea onChange={(e)=>setPostContent(e.target.value)} value={postContent} placeholder={"What's in your mind?"} className={style.textAreaOfContent} name={""} id={""}></textarea>
                     <label htmlFor={"fileUpload"}>
                     <div  className={style.fab}>
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                              stroke="currentColor" className="size-6">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                         </svg>
                     </div>
                     </label>
                     <input onChange={(e)=>setFileContent(e.target.files[0])} type={"file"} hidden={true} id={"fileUpload"}/>
                     {postContent.length > 0 && <div onClick={handleUpload} className={style.sendBtn}>Send</div>}

                 </div>

                 <div className={style.postsContainer}>
                     {postState.posts.map((post) => {
                         return (
                             <div key={post._id} className={style.singleCard}>
                                 <div className={style.trashWrapper}>
                                     <div className={style.username_pic}>
                                         <img className={style.postProfilePic}
                                              src={`${BASE_URL}/${post.userId.profilePicture}`}/>
                                         <div>
                                             <p className={style.name}>{post.userId.name}</p>
                                             <p className={style.username}>{post.userId.username}</p>
                                         </div>
                                     </div>
                                     {post.userId._id === authState.user.userId._id &&

                                         <div onClick={async () => {
                                             await dispatch(deletePost({post_id: post._id}))
                                             await dispatch(getAllPosts())
                                         }} className={style.trash}>
                                             <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                  viewBox="0 0 24 24"
                                                  strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                 <path strokeLinecap="round" strokeLinejoin="round"
                                                       d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                             </svg>

                                         </div>
                                     }
                                 </div>
                                 <div className={style.singleCard_profileContainer}>

                                     <div>
                                         <p className={style.content}>{post.body}</p>

                                         <div className={style.singleCardImage}>
                                             <img src={`${BASE_URL}/${post.media}`}/>
                                         </div>

                                         <div className={style.optionContainer}>
                                             <div onClick={async () => {
                                                 await dispatch(incrementPostLike({post_id: post._id}))
                                                 dispatch(getAllPosts())
                                             }} className={style.singleOption}>
                                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                      strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                     <path strokeLinecap="round" strokeLinejoin="round"

                                                           d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"/>
                                                 </svg>


                                             </div>
                                             <div className={style.singleOption}>


                                                 <p className={style.likes}>{post.likes} Likes</p>
                                             </div>
                                             <div onClick={() => {
                                                 dispatch(getAllComments({post_id: post._id}))
                                             }} className={style.singleOption}>
                                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                      strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                     <path strokeLinecap="round" strokeLinejoin="round"
                                                           d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/>
                                                 </svg>

                                             </div>

                                             {/*<div className={style.singleOption}>*/}
                                             {/*    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"*/}
                                             {/*         strokeWidth={1.5} stroke="currentColor" className="size-6">*/}
                                             {/*        <path strokeLinecap="round" strokeLinejoin="round"*/}
                                             {/*              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>*/}
                                             {/*    </svg>*/}

                                             {/*</div>*/}

                                         </div>

                                     </div>
                                 </div>
                             </div>
                         )
                     })}
                 </div>

             </div>
             {
                 postState.postId !== "" &&
                 <div onClick={() => {
                     dispatch(resetPostId())
                 }} className={style.commentsContainer}>
                     <div onClick={(e) => {
                         e.stopPropagation()
                     }} className={style.allCommentsContainer}>
                         {postState.comments.length === 0 && <h2>No Comments</h2>}

                         {postState.comments.length !== 0 &&


                             <div>
                                 {postState.comments.map((comment, index) => {
                                     return (
                                         <div className={style.SingleComment} key={comment.id}>
                                             <div className={style.singleComment_profile}>
                                                 <img className={style.commentPic}
                                                      src={`${BASE_URL}/${comment.userId.profilePicture}`} alt={""}/>
                                                 <div className={style.commentName}>

                                                     <p className={style.Commentname}>{comment.userId.username}</p>
                                                     <p>{comment.body}</p>
                                                     {/*{postState.postId === comment.id && <button style={{backgroundColor:"white"}}></button>}*/}


                                                 </div>
                                             </div>


                                         </div>)

                                 })}
                             </div>}


                         <div className={style.postCommentContainer}>
                             <input type={""} value={commentText} onChange={(e) => setCommentText(e.target.value)}
                                    placeholder={"Add a comment"}/>
                             <div onClick={async () => {
                                 await dispatch(postComment({
                                     post_id: postState.postId,
                                     body: commentText,
                                     setCommentText:""}))
                                 await dispatch(getAllComments({post_id:postState.postId}))

                             }} className={style.postCommentContainer_commentBtn}>
                                 <p className={style.shareIcon}>
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                          strokeWidth={1.5} stroke="currentColor" className="size-6">
                                         <path strokeLinecap="round" strokeLinejoin="round"
                                               d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"/>
                                     </svg>
                                 </p>
                             </div>
                         </div>

                     </div>
                 </div>
             }
         </DashboardLayout>
    </UserLayout>
  )
    } else {
        return (
            <UserLayout>
                <DashboardLayout>
                    <h2>Loading...</h2>
                </DashboardLayout>
            </UserLayout>
        )
    }
}



