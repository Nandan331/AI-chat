import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import "./homepage.css"
import axios from "axios"
import { useAuth } from "@clerk/clerk-react";
const Home = () => {


    // const test = async() => {
    //     await axios.get("http://localhost:3500/api/test",{
    //         withCredentials:true
    //     })
    // }

    return (
        <div className="homepage">
            <div className="left">
                <h1>Nandan AI</h1>
                <h2>Super charge your creativity and Productivity</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                     Repellat cumque temporibus modi eos aspernatur commodi
                </p>
                <Link to="/dashboard">Get Started</Link>
            </div>
            <div className="right">
                <div className="chat-bot">
                    <TypeAnimation
                    sequence={[
                        // Same substring at the start will only be typed out once, initially
                        'Human: We produce food for Mice',
                        1000, // wait 1s before replacing "Mice" with "Hamsters"
                        'Bot: We produce food for Hamsters',
                        1000,
                        'Human: We produce food for Guinea Pigs',
                        1000,
                        'Bot: We produce food for Chinchillas',
                        1000
                      ]}
                      wrapper="span"
                      speed={50}
                      cursor={true}
                      repeat={Infinity}
                      omitDeletionAnimation={true}
                    />
                </div>
            </div>
            <div className="terms">
                <img src="/logo.png" alt=""/>
                <div className="links">
                    <Link>Terms and Services</Link>
                    <span>|</span>
                    <Link>Privacy and Policies</Link>
                </div>
            </div>
        </div>
    )
}
export default Home;