import React, {useEffect, useState} from 'react';
import {useSearchParams} from "next/navigation";
import {BASE_URL, clientServer} from "@/config";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import style from "./style.module.css";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {getAllPosts} from "@/config/redux/action/postAction";
import {getConnectionRequest, getMyConnectionRequest, sendConnectionRequest} from "@/config/redux/action/authAction";

export default function viewProfilePage({userProfile}) {

    const router = useRouter();
    const postReducer = useSelector((state)=> state.postreducer);
    const dispatch = useDispatch();
    const authState = useSelector((state)=>state.auth);
    const [userPosts,setUserPosts] = useState([]);
    const [isCurrentUserInConnection,setIsCurrentUserInConnection] = useState(false);
    const [isconnectionnull, setIsConnectionNull] = useState(true);

    const getUserPost = async () => {
        await dispatch(getAllPosts());
        await dispatch(getConnectionRequest({token: localStorage.getItem('token')}));
        await dispatch(getMyConnectionRequest({token: localStorage.getItem('token')}));
    }

    useEffect(() => {
        let post = postReducer.posts.filter((post) => {
            return post.userId.username === router.query.username;
        })
        setUserPosts(post);
    }, [postReducer.posts])

    useEffect(() => {
        // console.log(authState.connections, userProfile.userId._id)
        if(authState.connections.some(user => user.connectionId._id === userProfile.userId._id)){
            setIsCurrentUserInConnection(true)
                if(authState.connections.find(user => user.connectionId._id === userProfile.userId._id).status_accepted === true){
                    setIsConnectionNull(false);
                }
        }
        if(authState.connectionRequest.some(user => user.userId._id === userProfile.userId._id)){
            setIsCurrentUserInConnection(true)
            if(authState.connectionRequest.find(user => user.userId._id === userProfile.userId._id).status_accepted === true){
                setIsConnectionNull(false)
            }
        }

    }, [authState.connections, authState.connectionRequest]);

    useEffect(() => {
        getUserPost()
    },[])


    return (
        <UserLayout>
            <DashboardLayout>

                <div className={style.container}>
                    <div className={style.backDropContainer}>
                        <img className={style.backDrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
                             alt={"backDrop"}/>
                    </div>
                    <div className={style.prfileContainer_details}>
                        <div style={{flex: "0.8"}}>
                            <div className={style.infoContainer}>
                                <h2>{userProfile.userId.name}</h2>
                                <p>{userProfile.userId.username}</p>
                            </div>

                           <div className={style.btnContainer}> {isCurrentUserInConnection ?
                                <button
                                    className={style.connectedButton}>{isconnectionnull ? "Pending" : "Connected"}</button>
                                :
                                <button onClick={() => {
                                    dispatch(sendConnectionRequest({
                                        token: localStorage.getItem("token"),
                                        user_id: userProfile.userId._id,

                                    }));
                                }} className={style.connectBtn}>Connect</button>}

                               <div onClick={async () => {
                                       const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
                                       window.open(`${BASE_URL}/${response.data.message}`, "_blank");

                               }}
                                    className={style.cvIcon}>
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        strokeWidth={1.5} stroke="currentColor" className="size-6">
                                       <path strokeLinecap="round" strokeLinejoin="round"
                                             d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/>
                                   </svg>

                               </div>
                           </div>
                        </div>

                        <p>{userProfile.bio}</p>

                    </div>
                    <div className={style.workHistory}>
                        <div className={style.workHistoryContainer}>
                            {
                                userProfile.pastWork.map((work, index) => {
                                    return (
                                        <div key={index} className={style.workHistoryCard}>
                                            <p style={{
                                                fontWeight: "bold",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.8rem"
                                            }}>{work.company}-{work.position}</p>
                                            <p>{work.years}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <h3 className={style.recentHeader}>Recent Activity</h3>
                    <div className={style.recentActivity}>
                        {userPosts.map((post) => {
                            return (
                                <div key={post.id} className={style.postCard}>
                                    <div className={style.card}>
                                        <div className={style.card_profileContainer}>
                                            {post.media == "" ? null
                                                :
                                                <img className={style.recentImg} src={`${BASE_URL}/${post.media}`}/>}

                                            {post.body}
                                        </div>

                                    </div>
                                </div>
                            )
                        })}
                    </div>


                </div>
            </DashboardLayout>
        </UserLayout>
    )
}

export async function getServerSideProps(context) {
    const request = await clientServer.get("/user/get_profile_based_on_username", {
        params: {
            username: context.query.username
        }
    })
    const response = await request.data;
    return {props: {userProfile: request.data.profile}};
}