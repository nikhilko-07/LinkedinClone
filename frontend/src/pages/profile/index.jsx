import React, { useEffect, useState } from "react";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import style from "@/pages/view_profile/style.module.css";
import { BASE_URL, clientServer } from "@/config";
import { getAboutUser, sendConnectionRequest } from "@/config/redux/action/authAction";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import styles from "./style.module.css";

export default function Profile() {
    const dispatch = useDispatch();
    const [userPosts, setUserPosts] = useState([]);
    const [userProfile, setUserProfile] = useState({});
    const authState = useSelector(state => state.auth);
    const postState = useSelector(state => state.postreducer);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputData, setInputData] = useState({company:'',position:'',years:''});

    const handleWorkInputChange = (e)=>{
        const {name, value} = e.target;
        setInputData({...inputData, [name]: value});
    }

    useEffect(() => {
        dispatch(getAllPosts());
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }, [dispatch]);

    useEffect(() => {
        if (authState.user) {
            setUserProfile(authState.user);
            const posts = postState.posts.filter(post => post.userId.username === authState.user.username);
            setUserPosts(posts);
        }
    }, [authState.user, postState.posts]);

    const updateProfilePicture = async (file) => {
        const formData = new FormData();
        formData.append("profile_picture", file);
        formData.append("token", localStorage.getItem("token"));

        await clientServer.post("/update_profile_picture", formData);
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }

    const updateProfileData = async ()=>{
        const request = await clientServer.post("/user_update",{
            token: localStorage.getItem("token"),
            name: userProfile.userId.name,
        });
        const response = await clientServer.post("/update_profile_data",{
            token: localStorage.getItem("token"),
            bio: userProfile.bio,
            currentPost: userProfile.currentPost,
            pastWork: userProfile.pastWork,
            education: userProfile.education,
        })
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }

    return (
        <UserLayout>
            <DashboardLayout>
                {authState.user && userProfile.userId ? (
                    <div className={style.container}>
                        <div className={style.backDropContainer}>

                            <input
                                onChange={(e) => {
                                    updateProfilePicture(e.target.files[0]);
                                }}
                                hidden
                                type={"file"}
                                id={"profilePictureUpload"}
                            />
                            <label className={style.profilePic} htmlFor={"profilePictureUpload"}>
                                <img
                                    className={style.backDrop}
                                    src={`${BASE_URL}/${userProfile.userId.profilePicture}`}

                                    alt={"backDrop"}
                                />
                            </label>
                        </div>
                        <div className={style.prfileContainer_details}>
                            <div style={{flex: "0.8"}}>
                                <div className={style.infoContainer}>
                                    <input className={styles.name} type={"text"} value={userProfile.userId.name}
                                           onChange={(e) => {
                                               setUserProfile({
                                                   ...userProfile,
                                                   userId: {...userProfile.userId, name: e.target.value}
                                               });
                                           }}/>
                                </div>
                                <p className={styles.username}>{userProfile.userId.username}</p>
                            </div>
                            <div>
                                <textarea className={styles.bio} value={userProfile.bio} onChange={(e) => {
                                    setUserProfile({...userProfile, bio: e.target.value})
                                }}></textarea>
                            </div>
                        </div>
                        <div className={style.workHistory}>
                            <div className={style.workHistoryContainer}>
                                {userProfile.pastWork.map((work, index) => (
                                    <div key={index} className={style.workHistoryCard}>
                                        <p
                                            style={{
                                                fontWeight: "bold",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.8rem",
                                            }}
                                        >
                                            {work.company}-{work.position}
                                        </p>
                                        <p>{work.years}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {userProfile != authState.user &&
                            <div onClick={() => {
                                updateProfileData();
                            }} className={styles.update}>
                                Update Profile
                            </div>
                        }

                        <button className={styles.addWork} onClick={() => {
                            setIsModalOpen(!isModalOpen);
                        }}>Add Work
                        </button>

                        {isModalOpen &&
                            <div onClick={() => {
                                setIsModalOpen(false)
                            }} className={styles.commentContainer}>
                                <div onClick={(e) => {
                                    e.stopPropagation()
                                }} className={style.allCommentsContainer}>
                                    <input name={"company"} type={"text"} onChange={handleWorkInputChange}
                                           placeholder="Enter Company"/>
                                    <input name={"position"} type={"text"} onChange={handleWorkInputChange}
                                           placeholder="Enter Position"/>
                                    <input name={"years"} type={"number"} onChange={handleWorkInputChange}
                                           placeholder="Years"/>

                                    <div className={styles.workBtn} onClick={() => {
                                        setUserProfile({
                                            ...userProfile,
                                            pastWork: [...userProfile.pastWork, inputData]
                                        });
                                        setIsModalOpen(false);
                                    }}> Add
                                    </div>

                                </div>
                            </div>}




                    </div>
                ) : (
                    <p>Loading...</p>
                )}

            </DashboardLayout>
        </UserLayout>
    );
}
