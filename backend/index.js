import express from "express"
import Imagekit from 'imagekit'
import cors from 'cors'
import path from "path";
import url, { fileURLToPath } from "url";
import mongoose from "mongoose"
import Chat from "./models/chats.js"
import UserChats from "./models/userChats.js"
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node"
import cookieParser from "cookie-parser"

const port = process.env.PORT||3500

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Data base connected"))
.catch((err) => console.error("Unable to connect the Database", err))

const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true,
}))

app.use(express.json());
app.use(cookieParser());

const imagekit = new Imagekit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
})

app.get("/api/upload",(req,res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
});


app.post("/api/chats", ClerkExpressRequireAuth(), async(req,res) => {
    const userId = req.auth.userId
    const { text } = req.body;
    try{

        //creating a new chat
        const newchat = new Chat({
            userId: userId,
            history: [{ role: "user", parts: [{text}] }],
        });

        const savedChat = await newchat.save();

        //checking if the user chats exists
        const userChats = await UserChats.find({userId: userId});

        //if doesn't exist create a new one and add the chat in the chats array
        if(!userChats.length){
            const newUserChats = new UserChats({
                userId: userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title:text.substring(0,40)
                    }
                ]
            })
            await newUserChats.save();
        }else{
            //if exists, push the chat to the existing array
            await UserChats.updateOne({userId: userId}, {
                $push:{
                   chats: {
                    _id: savedChat._id,
                    title:text.substring(0,40)
                   },
                }
            })
            res.status(201).json(newchat._id);
        }
    }catch(err){
        console.error(err)
        res.status(500).json({
            error:"Error creating chat",
            message: err.message
        })
    }
});


app.get("/api/userchats",ClerkExpressRequireAuth(), async(req,res) => {
    const userId = req.auth.userId;
    try{
        const userChats = await UserChats.find({userId});
        if(userChats && userChats.length > 0){
            res.status(200).json(userChats[0].chats)
        }else{
            res.status(200).json([]);
        }
    }catch(err){
        console.error(err)
        res.status(500).json({
            error: "Error",
            message: err.message
        })
    }
});

app.get("/api/chats/:id",ClerkExpressRequireAuth(), async(req,res) => {
    const userId = req.auth.userId;
    try{
        const chat = await Chat.findOne({ _id : req.params.id, userId});
        res.status(200).json(chat);
    }catch(err){
        console.error(err)
        res.status(500).json({
            error: "Something Wrong",
            message: err.message
        });
    }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async(req,res) => {
    const userId = req.auth.userId;
    const {query, answer, img} = req.body;
    const newItems = [
        ...(query
            ?[{role: "user", parts: [{text: query}], ...(img && {img})}]
            :[]
           ),
        {role: "model", parts: [{text: answer}]}
    ];
    try{
        const updatedChat = await Chat.updateOne({ _id:req.params.id, userId},{
            $push: {
                history: {
                    $each: newItems
                }
            }
        });

        res.status(200).json(updatedChat)
    }catch(err){
        console.error(err)
        res.status(500).json({
            error: "Something wrong",
            message: err.message
        })
    }
})

app.use(express.static(path.join(__dirname, "../chatgpt-clone")));

app.get("*",(req,res) => {
    res.sendFile(path.join(__dirname, "../chatgpt-clone", "index.html"))
})

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(401).json({
        error: "UnAuthenticated",
        message: err.message
    })
});



app.listen(port, () => {
    console.log("Port is running on 3500")
});