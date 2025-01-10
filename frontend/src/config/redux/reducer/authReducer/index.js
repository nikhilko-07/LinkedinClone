import {createSlice} from "@reduxjs/toolkit";
import {
    getAboutUser,
    loginUser,
    registerUser,
    getAllUsers,
    getConnectionRequest, getMyConnectionRequest
} from "@/config/redux/action/authAction";


const initialState = {
    user: undefined,
    isError: false,
    isServer: false,
    isLoading: false,
    isLoggedIn: false,
    isTokenThere: false,
    message: "",
    profileFetcher:false,
    connections:[],
    connectionRequest:[],
    all_users:[],
    all_profiles_fetched:false,
}
const authSlice = createSlice({
    name: "auth",
    initialState:initialState,
    reducers:{
        reset:()=> initialState,
        handleLoginUser:(state)=> {
            state.message = "hello"
        },
        emptyMessage:(state)=> {
            state.message = ""
        },
        setTokenIsThere:(state)=> {
            state.isTokenThere = true
        },
        setTokenIsNotThere:(state)=> {
            state.isTockenThere = false
        },
        },
        extraReducers:(builder)=>{
            builder
                .addCase(loginUser.pending,(state,action)=>{
                        state.isLoading = true;
                        state.message = "Knocking the door.."
                })
                .addCase(loginUser.fulfilled,(state, action)=>{
                    state.isLoading = false;
                    state.isError = false;
                    state.isSuccess = true;
                    state.loggedIn = true;
                    state.message = "Login successfully"
                })
                .addCase(loginUser.rejected,(state, action)=>{
                    state.isLoading = false;
                    state.isError = true;
                    state.message = action.payload;
                })
                .addCase(registerUser.pending,(state, action)=>{
                    state.isLoading = true;
                    state.message = "Registering user..."
                })
                .addCase(registerUser.fulfilled,(state, action)=>{
                    state.isLoading = false;
                    state.isError = false;
                    state.isSuccess = true;
                    state.loggedIn = true;
                    state.message = {
                        message: "Registeration is successfull. Please login",
                    }

                })
                .addCase(registerUser.rejected,(state, action)=>{
                    state.isLoading = false;
                    state.isError = true;
                    state.message = action.payload;
                })
                .addCase(getAboutUser.fulfilled,(state, action)=>{
                    state.isLoading = false;
                    state.isError = false;
                    state.profileFetched = true;
                    state.user = action.payload.profile;
                })
                .addCase(getAllUsers.fulfilled,(state, action)=>{
                    state.isLoading = false;
                    state.isError = false;
                    state.all_profiles_fetched = true;
                    state.allUsers = action.payload.profiles;

                })
                .addCase(getConnectionRequest.fulfilled,(state, action)=>{
                    state.connections = action.payload;
                })
                .addCase(getConnectionRequest.rejected,(state, action)=>{
                    state.message = action.payload;
                })
                .addCase(getMyConnectionRequest.fulfilled,(state, action)=>{
                    state.connectionRequest = action.payload;
                })
                .addCase(getMyConnectionRequest.rejected,(state, action)=>{
                    state.message = action.payload;
                })
        }

})

export const {reset, emptyMessage, setTokenIsThere, setTokenIsNotThere} = authSlice.actions;
export default authSlice.reducer;
