import { Link } from "react-router-dom"
import "./chatlist.css"
import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
const ChatList = () => {

    const {isPending, error, data} = useQuery({
        queryKey: ["userChats"],
        queryFn: () => 
            fetch(`${import.meta.env.VITE_API_URL}/api/userchats`,{
                credentials:"include"
            })
            .then((res) => res.json()),
    });
    
    return(
        <div className="chatlist">
            <span className="title">DSAHBOARD</span>
            <Link to="/dashboard">Create a New Chat</Link>
            <Link to="/">Explore Nandan AI</Link>
            <Link to="/">Contact</Link>
            <hr/>
            <span className="title">RECENT CHATS</span>
            <div className="list">
                {isPending 
                    ? "Loading..." 
                    : error 
                    ? "Something Error" 
                    : data?.map((chat) => (
                     <Link 
                        to={`/dashboard/chats/${chat._id}`} 
                        key={chat._id}>
                        {chat.title}
                    </Link>
                ))}    
            </div>
            <hr/>
            <div className="upgrade">
                <img src="/logo.png" alt=""/> 
                <div className="text">
                    <span>Upgrade to Nandan AI pro</span>
                    <span>Unlimited access to all features and advanced models</span>
                </div>
            </div>
        </div>
    )
}
export default ChatList