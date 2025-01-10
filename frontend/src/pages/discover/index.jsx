import react, {useEffect} from 'react';
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import {useDispatch, useSelector} from "react-redux";
import {getAllUsers} from "@/config/redux/action/authAction";
import style from "./style.module.css"
import {BASE_URL} from "@/config";
import {useRouter} from "next/router";

export default function Discover (){

    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);
    useEffect(()=>{
             if(!authState.all_profiles_fetched){
                 dispatch(getAllUsers());
             }
    },[])

    return (
       <UserLayout>
           <DashboardLayout>
               <div className={style.container}>
                   <h1 style={{marginLeft:"2.5%",marginTop:"2.5%",marginBottom:"2.5%"}}>
                       Discover
                   </h1>
                   <div className={style.allUserProfile}>
                       {authState.all_profiles_fetched && authState.allUsers.map((user) =>{
                           return(
                               <div onClick={()=>{
                                   router.push(`/view_profile/${user.userId.username}`);
                               }} key={user.id} className={style.userCard}>
                                   <img className={style.userCard_img} src={`${BASE_URL}/${user.userId.profilePicture}`} alt={user.username} />
                                   <div>
                                   <h1>{user.userId.name}</h1>
                                   <p>{user.userId.username}</p>
                               </div>
                               </div>
                           )
                       })}
                   </div>
               </div>
           </DashboardLayout>
       </UserLayout>
    )
};