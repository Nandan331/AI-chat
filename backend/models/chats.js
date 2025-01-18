import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    userId: {
        type:String,
        required: true
    },
    history: [
        {
            role: {
                type:String,
                enum: ["user", "model"],
                required:true
            },
            parts: [
                {
                    text: {
                        type: String,
                        required: true
                    }
                }
            ],
            img: {
                type: String,
                required: false
            }
        }
    ]
},{timestamps: true})

const Chat = new mongoose.model("chat", chatSchema);
export default Chat