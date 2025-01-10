import react, {useEffect} from 'react'
import style from './style.module.css'
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import {useDispatch, useSelector} from "react-redux";
import {AcceptConnection, getMyConnectionRequest} from "@/config/redux/action/authAction";
import {BASE_URL} from "@/config";
import {useRouter} from "next/router";
import {connection} from "next/server";
export default function MyConnections () {

    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMyConnectionRequest({token:localStorage.getItem("token")}));
    },[])
    useEffect(() => {

        if(authState.connectionRequest.length != 0){
            console.log(authState.connectionRequest)
        }
    },[authState.connectionRequest])


    return (
        <UserLayout>
            <DashboardLayout>
                <div className={style.container}>
                    {/*<h1>My Connections</h1>*/}
                    {authState.connectionRequest.length === 0 && <h1>No Pending Request</h1>}
                    {authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection)=> connection.status_accepted === null).map((user, index) => {
                        return (
                            <div onClick={()=>{
                                router.push(`/view_profile/${user.userId.username}`)
                            }} className={style.userCard} key={index}>
                                <div className={style.CardWrapper}>
                                    <div className={style.profilePicture}>
                                        <img  src={`${BASE_URL}/${user.userId.profilePicture}`} alt="profilePicture"/>
                                    </div>
                                    <div className={style.userInfo}>
                                        <h3>{user.userId.name}</h3>
                                        <h3>{user.userId.username}</h3>
                                    </div>
                                    <button onClick={(e)=>{
                                        e.stopPropagation();

                                        dispatch(AcceptConnection({
                                            connectionId:user._id,
                                            token: localStorage.getItem("token"),
                                            action: "accept",
                                        }))
                                    }} className={style.acceptBtn}>Accept</button>
                                </div>
                            </div>
                        )
                    })}

                    <h1 className={style.networkHeader}>My Network</h1>
                    {authState.connectionRequest.filter((connection)=> connection.status_accepted !== null).map((user, index)=> {
                        return (
                            <div onClick={() => {
                                router.push(`/view_profile/${user.userId.username}`)
                            }} className={style.userCard} key={index}>
                                <div className={style.CardWrapper}>
                                    <div className={style.profilePicture}>
                                        <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="profilePicture"/>
                                    </div>
                                    <div className={style.userInfo}>
                                        <h3>{user.userId.name}</h3>
                                        <h3>{user.userId.username}</h3>
                                    </div>

                                </div>
                            </div>
                        )
                    })}


                </div>
            </DashboardLayout>
        </UserLayout>
    )
}