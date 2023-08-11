import React from "react";
import { Link } from "react-router-dom";
import '../stylesheets/Tweet.css'
import i1 from '../images/1814099_chat_cloud_speech_talk_text_icon.png'
import i2 from '../images/8665655_retweet_social_icon.png'
import i3 from '../images/211754_heart_icon.png'
import i4 from '../images/9035174_stats_chart_icon.png'
import i5 from '../images/9026081_upload_simple_icon.png'

function Tweet(props) {
    const {comments,rt,reactions,views} = props.interactions || {}
    const id = props.id
    return (
        <Link to={`/home/status/${id}`}>
        <div className='container-tweet'>            
            <div className='info-container'>
                <Link to={`/user/:${props.email}`}>
                <div className="photo-container">
                    <img src="" alt="" />
                </div>
                </Link>
                <p>{props.username}</p>
                <p>{props.at}</p>
            </div>
            <div className="body-container">
                <p className="body-text">{props.body}</p>
            </div>

            {props.hasImage && (
                <div className="pImage">
                    <img src="" alt="" />
                </div>
            )}

            <div className="buttons">
                <button>
                    <img src={i1} alt="" srcset="" />
                    <h6>{comments}</h6>
                </button>
                <button>
                    <img src={i2} alt="" srcset="" />
                    <h6>{rt}</h6>
                </button>
                <button>
                    <img src={i3} alt="" srcset="" />
                    <h6>{reactions}</h6>
                </button>
                <button>
                    <img src={i4} alt="" srcset="" />
                    <h6>{views}</h6>
                </button>
                <button>
                    <img src={i5} alt="" srcset="" />
                </button>
            </div>
        </div>
        </Link>
    )
}

export default Tweet