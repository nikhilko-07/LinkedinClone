import {createSlice} from "@reduxjs/toolkit";
import {getAllComments, getAllPosts} from "@/config/redux/action/postAction";


const initialState = {
    posts:[],
    isError: false,
    postFetched: false,
    isLoading: false,
    isLoggedIn: false,
    message: "",
    comments:[],
    postId: "",
}

const postSlice = createSlice({
    name:"posts",
    initialState,
    reducers:{
        reset: () => initialState,
        resetPostId:(state)=>{
            state.postId = ""
        },
    },
    extraReducers:(builder) => {
        builder
            .addCase(getAllPosts.pending,(state)=>{
                state.isLoading = true;
                state.message = "Fetching posts...";
            })
            .addCase(getAllPosts.fulfilled,(state, action)=>{
                state.isLoading = false;
                state.isError = false;
                state.postFetched = true;
                state.posts = action.payload.posts.reverse();
            })
            .addCase(getAllPosts.rejected,(state, action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAllComments.fulfilled,(state, action)=>{
                state.postId = action.payload.post_id;
                state.comments = action.payload.comments;
            })
            .addCase(getAllComments.rejected, (state, action) => {
                console.error("Failed to load comments", action.payload);
            });
    }
})

export const { resetPostId} = postSlice.actions;
export default postSlice.reducer;