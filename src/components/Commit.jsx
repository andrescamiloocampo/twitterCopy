import React, { useState } from "react";
import axios from "axios";
import i8 from '../images/image 8.png'
import i9 from '../images/image 9.png'
import i10 from '../images/image 10.png'
import i11 from '../images/image 11.png'
import i12 from '../images/image 12.png'
import i13 from '../images/image 13.png'
import Button from "./Button";
import '../stylesheets/commit.css'

function Commit(props) {
    const username = props.username
    const hash = props.hash
    const email = props.email
    const [body,setBody] = useState('')
    const handleBodyChange = e =>{
        setBody(e.target.value)
    }
    const handleSubmit = e =>{
        e.preventDefault()
        const tweetData = {
            body:body,
            retweets:0,
            comments:[],
            reactions:0,
            user:{
                username:username,
                hash:hash,
                email:email
            }
        }
        axios.post('http://localhost:8000/Home',tweetData)
        .then(response => console.log(response.data))
        .catch(error=>console.log('Error:'+error))
    }
    return (
        <form className='commit' onSubmit={handleSubmit}>
            <div className='publish-container'>                
                <div className="photo-container">
                    <img src="#" alt="" srcset="" />
                </div>
                <input type="text" placeholder="!¿Qué está pasando?!" value={body} onChange={handleBodyChange}/>
            </div>
            <div className="icons">
                <div className="icon-container">
                    <img src={i8} alt="" />
                </div>
                <div className="icon-container">
                    <img src={i9} alt="" />
                </div>
                <div className="icon-container">
                    <img src={i10} alt="" />
                </div>
                <div className="icon-container">
                    <img src={i11} alt="" />
                </div>
                <div className="icon-container">
                    <img src={i12} alt="" />
                </div>
                <div className="icon-container">
                    <img src={i13} alt="" />
                </div>
            </div>
            <div className="button-container">
                <Button>Twittear</Button>
            </div>
        </form>
    )
}

export default Commit