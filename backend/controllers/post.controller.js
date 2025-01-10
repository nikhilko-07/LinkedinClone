import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Post from "../models/posts.model.js";
import err from "multer/lib/multer-error.js";
import Comment from "../models/comments.model.js";

export const activeCheck = async(req,res)=>{
    return res.status(200).json({ message: "running" });
}

export const createPost = async(req,res)=>{
    const {token} = req.body;
    try{
        const user = await User.findOne({token:token})
        if(!user){
            return res.status(400).json({message:"no user found"});
        }
        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file != undefined ? req.file.filename : "",
            filetypes: req.file != undefined ? req.file.mimetype.split("/")[1] : ""
        })
        await post.save()
        return res.status(201).json({message:"post success"});

    }catch(err){
        return res.status(400).json({message:err});
    }
}

export const getAllPost = async (req, res)=>{
    try{
        const posts = await Post.find().populate('userId','name username email profilePicture')
        return res.json({posts})
    }catch(err){
        return res.status(400).json({message:err.message})
    }
}

export  const deletePost = async(req,res)=>{
    const {token, post_id} = req.body;
    try{
        const user = await User
            .findOne({token:token})
            .select("_id");
        if(!user){cd
            return res.status(400).json({message:"no user found"});
        }
        const post = await Post.findOne({_id:post_id});
        if(!post){
            return res.status(400).json({message:"no post found"});
        }
        if(post.userId.toString() !== user._id.toString()){
            return res.status(400).json({message:"Unathorized"});
        }
        await Post.deleteOne({_id:post_id});
        return res.status(200).json({message:"post successfully deleted"});
    }catch(err){
        return res.status(400).json({message:err.message})
    }
}
export const commentPost = async (req, res) => {
    const { token, post_id, commentBody } = req.body;
    try {
        const user = await User.findOne({ token: token }).select("_id");
        if (!user) {
            return res.status(400).json({ message: "no user found" });
        }
        const post = await Post.findOne({ _id: post_id });
        if (!post) {
            return res.status(400).json({ message: "no post found" });
        }
        const comment = new Comment({
            userId: user._id,
            postId: post_id, // Corrected this line
            body: commentBody,
        });
        await comment.save();
        return res.status(200).json({ message: "Comment Added" });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


export const get_comments_by_post = async (req, res)=>{
    const {post_id} = req.query;

    try {
        const post = await Post.findOne({_id:post_id});
        if(!post){
            return res.status(400).json({message:"no post found"});
        }

        const comments = await Comment
            .find({postId: post_id})
            .populate("userId","username name profilePicture")
        return res.json(comments.reverse())

    }catch(err){
        return res.status(400).json({message:err.message})
    }
}

export const delete_comment_of_user = async (req,res)=>{
    const {token, comment_id} = req.body;
    try{
        const user =  await User
            .findOne({token: token})
            .select("_id");
        if(!user){
            return res.status(400).json({message:"no user found"});
        }
        const comment = await Comment.findOne({_id:comment_id});
        if(!comment){
            return res.status(400).json({message:"no comment found"});
        }
        if(comment.userId.toString() !== user._id.toString()){
            return res.status(400).json({message:err.message})
        }
        await Comment.deleteOne({_id:comment_id});
        return res.status(200).json({message:"comment successfully deleted"});
    }catch (error){
        return res.status(400).json({message:err.message})
    }
}

export const increment_likes = async(req,res)=>{
    const {post_id} = req.body;
    try{
        const post = await Post.findOne({_id:post_id});
        if(!post){
            return res.status(400).json({message:"no post found"});
        }
        post.likes = post.likes +1
        await post.save()
        return res.json({message:"Likes Icremented"})
    }catch(err){
        return res.status(400).json({message:err.message})
    }
}




