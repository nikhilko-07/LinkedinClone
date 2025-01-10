import react from "react";
import styles from "./styles.module.css";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {reset} from "@/config/redux/reducer/authReducer";
import {BASE_URL} from "@/config";

export default function NavbarComponent() {

    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);


    return (
        <div className={styles.container}>
           <nav className={styles.navBar}>
               <h1 style={{cursor:"pointer"}} onClick={()=>{
                   router.push("/");
               }}>Pro Connect</h1>

               <div className={styles.navBarOptionContainer}>
                   {authState.profileFetched && <div>
                       <div style={{display: "flex", gap: "1.2rem"}}>
                           <p className={styles.hey}>Hey, {authState.user.userId.name}</p>
                           <p onClick={()=>{router.push("/profile")}} style={{fontWeight: "bold", cursor: "pointer"}}><img  className={styles.profilePic} src={`${BASE_URL}/${authState.user.userId.profilePicture}`}/></p>
                           <p className={styles.logoutOptn} onClick={()=>{
                               localStorage.removeItem("token");
                               router.push("/login")
                               dispatch(reset())
                           }} style={{fontWeight: "bold", cursor: "pointer"}}>Logout</p>
                       </div>
                   </div>}

                   {!authState.profileFetched && <div onClick={()=>{
                       router.push("/login");
                   }} className={styles.buttonJoin}>Join</div>}

               </div>

           </nav>

        </div>
    )
}