// action faild hua wagera yeh sab reducer me hota hai




// Steps for state Management
//submit action
// handle action in it's reducer
// register here => reducer


import {configureStore} from "@reduxjs/toolkit";
import authReducer from "@/config/redux/reducer/authReducer";
import postReducer from "@/config/redux/reducer/postReducer";

export const store = configureStore({
    reducer:{
        auth: authReducer,
        postreducer: postReducer,
    }
})