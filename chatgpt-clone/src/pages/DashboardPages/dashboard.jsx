import "./dashboard.css"
import axios from "axios"
import {useAuth} from "@clerk/clerk-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
const DashBoard = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (text) => {
            return fetch(`${import.meta.env.VITE_API_URL}/api/chats`,{
                method:"POST",
                credentials:"include",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({ text })
            }).then((res) => res.json())
        }, 
        onSuccess : (id) => {
            queryClient.invalidateQueries({queryKey: ["userChats"]})
            navigate(`/dashboard/chats/${id}`)
        }
    })

    const handleSubmit = async(e) => {
        e.preventDefault();
        const text = e.target.text.value
        if(!text) return

        mutation.mutate(text)
    };

    return (
        <div className="dashboard">
            <div className="texts">
                <div className="logo">
                    <img src="/logo.png" alt=""/>
                    <h1>Nandan AI</h1>
                </div>
                <div className="options">
                    <div className="option">
                        <img src="/chat.png" alt=""/>
                        <span> Create a new chat</span>
                    </div>
                    <div className="option">
                        <img src="/image.png" alt=""/>
                        <span>Analyse the image</span>
                    </div>
                    <div className="option">
                        <img src="/code.png" alt=""/>
                        <span>Help me with my code</span>
                    </div>
                </div>
            </div>
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="text" placeholder="Ask me anything....."/>
                    <button>
                        <img src="/arrow.png" alt=""/>
                    </button>
                </form>
            </div>
        </div>
    )
}
export default DashBoard