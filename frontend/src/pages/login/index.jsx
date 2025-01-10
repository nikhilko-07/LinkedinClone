import React, {useEffect, useState} from 'react';
import styles from './style.module.css';
import UserLayout from "@/layout/UserLayout";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {loginUser, registerUser} from "@/config/redux/action/authAction";
import {emptyMessage} from "@/config/redux/reducer/authReducer";

function LoginComponent() {

    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const [userLoginMethod, setuserLoginMethod] = useState(false);
    const [username, setusername] = useState("");
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");


    useEffect(() => {
        if (authState.isLoggedIn) {
            router.push("/dashboard");
        }
    }, [authState.loggedIn]);

    useEffect(() => {
        dispatch(emptyMessage());
    },[userLoginMethod])

    useEffect(()=>{
        if(localStorage.getItem("token")){
            router.push("/dashboard");
        }
    })

    const handleLogin = () => {
        console.log("login");
        dispatch(loginUser({email, password}));
    }

    const handleRegister = () => {
        console.log("registering")
        dispatch(registerUser({username, email, password, name}));
    }

    return(
        <UserLayout>
            <div className={styles.container}>

                <div className={styles.registerContainer}>
                <h1 className={styles.header}>{userLoginMethod ? "Sign in": "Sign up" }</h1>
                            <p className={styles.error} style={{color : authState.isError ? "red" : "green"}}>{authState.message.message}</p>
                    <div className={styles.inputContainer}>

                        {!userLoginMethod && <div className={styles.inputRow}>
                            <input onChange={(e) => setusername(e.target.value)} placeholder={"username"}
                                   type={"username"} name={username}/>
                            <input onChange={(e) => setname(e.target.value)} placeholder={"name"} type={"name"}
                                   name={name}/>
                        </div>}


                        <input onChange={(e) => setemail(e.target.value)} placeholder={"Email"} type={"email"}
                               name={email}/>
                        <input onChange={(e) => setpassword(e.target.value)} placeholder={"password"} type={"password"}
                               name={password}/>

                        <div className={styles.btnContainer}>
                    <button onClick={()=>{
                        if(userLoginMethod){
                        handleLogin();
                        }else {
                        handleRegister();
                        }
                    }} className={styles.submitBtn}> {userLoginMethod ? "Sign in" : "Sign up"}</button>
                        </div>
                        </div>



                    <div  className={styles.loginContainer}>
                        <h4 className={styles.loginintro}>{userLoginMethod ? "Create a new account" : "Already you have an account"} </h4>

                        <div className={styles.btnContainer}>
                            <button onClick={() => {
                                setuserLoginMethod(!userLoginMethod);
                            }} className={styles.submitBtn }> {userLoginMethod ? "Sign up" : "Sign in"}</button>
                        </div>

                    </div>
                </div>
            </div>
        </UserLayout>
    )
}

export default LoginComponent;