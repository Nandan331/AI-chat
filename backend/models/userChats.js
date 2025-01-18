import mongoose from "mongoose";

const userChatsSchema = mongoose.Schema({
    userId: {
        type:String,
        required: true
    },
    chats: [
        {
            _id: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now()
            },
        },
    ],
},{timestamps: true})

const UserChats = new mongoose.model("userchats", userChatsSchema);
export default UserChats