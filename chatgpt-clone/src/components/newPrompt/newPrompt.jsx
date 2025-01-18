import { useRef, useEffect, useState } from "react"
import "./newPrompt.css"
import Upload from "../upload/Upload";
import model from "../../lib/gemini";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown"
import { useQueryClient,  useMutation } from "@tanstack/react-query"


const NewPrompt = ({data}) => {
    const [img, setImg] = useState({
        isLoading: false,
        error:"",
        dbData:{},
        aiData:{}
    })
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");
    const endRef = useRef(null)
    const formRef = useRef(null)

    // const chat = model.startChat({
    //     history: [
    //       data?.history.map(({role, parts}) => ({
    //         role,
    //         parts: [{text:parts[0].text}]
    //       }))
    //     ],
    //     generationConfig: {
    //         // maxOutputTokens
    //     }
    //   });

    const formatHistory = () => {
        if( !data?.history || !Array.isArray(data.history)) return []

        return data.history.map(({role, parts}) => ({
            role: role === "users" ? "user" : role,
            parts: [{text: parts[0].text}]
        }));
    }

    const initChat = () => {
        try{
            const history = formatHistory();
            return model.startChat({
                history: history.length > 0 ? history : undefined,
                generationConfig: {

                }
            })
        }catch(err){
            console.error("Error initializing chat :", err);
            return model.startChat()
        }
    };

    const chat = initChat();

    useEffect(() => {
        endRef.current.scrollIntoView({behavior: "smooth"})
    },[data, query, answer, img.dbData]);

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: () => {
            return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`,{
                method:"PUT",
                credentials:"include",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({ 
                    query: query.length ? query : undefined,
                    answer,
                    img: img.dbData?.filePath || undefined 
                })
            }).then((res) => res.json())
        }, 
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey: ["chat", data._id]})
            .then(() =>{
                formRef.current.reset()
                setQuery("");
                setAnswer("");
                setImg({
                    isLoading: false,
                    error:"",
                    dbData: {},
                    aiData: {}
                })
            })
        },
        onError: (err) => {
            console.log(err)
        }
    })

    const add = async(text, isInitial) => {
        if(!isInitial) setQuery(text)

        try{
        const result = await chat.sendMessageStream (
            Object.entries(img.aiData).length ? [img.aiData, text] : [text]
        );
        let accumulatedText = "";
        for await (const chunk of result.stream){
            const chunkText = chunk.text();
            accumulatedText += chunkText
            setAnswer(accumulatedText);
        }
        mutation.mutate();
        }catch(err){
            console.error(err);
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const text = e.target.text.value
        if(!text) return;
        
        add(text, false)
    }

    const hasRun = useRef(false);
    useEffect(() => {
     if(!hasRun.current){
        if(data?.history?.length === 1){
            add(data.history[0].parts[0].text, true)
        }
    }
    hasRun.current = true;
    },[])
    return(
        <>
        {img.isLoading && <div className="">Loading.....</div>}
        {img.dbData?.filePath && (
            <IKImage
                urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                path={img.dbData.filePath}
                width="180"
                height="180"
                transformation={[{width:180}]}
            />
        )}
        {query && 
            <div 
                className="message user">{query}
            </div>
        }
        {answer && 
             <div 
                className="message">
                <Markdown>{answer}</Markdown>
            </div>
        }
        <div className="endChat" ref={endRef}></div>
            <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
                <Upload setImg={setImg}/>
                <input id="file" type="file" multiple={false} hidden/>
                <input type="text" name="text" placeholder="Ask me anything...."/>
                <button>
                    <img src="/arrow.png" alt=""/>
                </button>
            </form>
        </>
    )
}
export default NewPrompt