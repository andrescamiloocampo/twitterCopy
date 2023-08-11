import '../stylesheets/Thread.css'
import Bar from './Bar'
import Bar2 from './Bar2'
import { AiOutlineArrowLeft, AiOutlineEllipsis } from 'react-icons/ai'
import { BsChat, BsArrowRepeat, BsHeart, BsBookmark, BsUpload,BsFillBarChartFill } from 'react-icons/bs'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { userDataContext } from '../App'
import { useContext } from 'react'
import axios from 'axios'

function Thread(props) {
    const postId = useParams()?.id
    const userData = useContext(userDataContext)
    const [post, setPost] = useState(null)
    const [body, setBody] = useState('')

    useEffect(() => {
        axios.get(`http://localhost:8000/status/${postId}`)
            .then(response => {
                console.log(response)
                setPost(response.data.thread.post)
            })
            .catch(error => console.log(error))
    }, [postId, setPost])

    const handleBodyChange = (e) => {
        setBody(e.target.value)
    }

    const handleResponseText = (e) => {
        e.preventDefault()
        const postData = {
            user: {
                email: userData?.data.email,
                username: userData?.data.username,
                hash: userData?.data.hash
            },
            body: body
        }
        axios.post(`http://localhost:8000/status/${postId}`, postData)
            .then(response => console.log(response))
            .catch(error => console.error(error))
    }    
    return (
        <div className='threads-container'>
            <Bar />
            <main className='threads-principal'>
                <header className='threads-header'>
                    <section className='header-contents'>
                        <Link to={'/home'}><AiOutlineArrowLeft className='arrow-left' /></Link>
                        <h2>Tweet</h2>
                    </section>
                </header>
                <section className='thread'>
                    <article className='user-data-thread'>
                        <div className='author-container'>
                            <div className='photo-container'></div>
                            <section className='user-info-container'>
                                <h3>{post?.user.username}</h3>
                                <p>{post?.user.hash}</p>
                            </section>
                        </div>
                        <div className='controls-container'>
                            <button>Suscribirse</button>
                            <AiOutlineEllipsis className='dots' />
                        </div>
                    </article>
                    <article className='publication-body'>
                        <p>
                            {post?.body}
                        </p>
                    </article>
                    <article className='thread-interactions'>
                        <BsChat />
                        <BsArrowRepeat />
                        <BsHeart />
                        <BsBookmark />
                        <BsUpload />
                    </article>
                    <form className='post-section' onSubmit={handleResponseText}>
                        <div className='photo-container'></div>
                        <input type="text" name="" id="" placeholder='Publica tu respuesta!' value={body} onChange={handleBodyChange} />
                        <button>Responder</button>
                    </form>
                    <article className='comments-section'>
                        {post?.comments.map((comment,index) => (
                            <div key={index} className='comment'>
                                <section className='user-comment-data'>
                                <div className='photo-container'></div>
                                <h1 className='comment-username'>{comment.username}</h1>
                                <p>{comment.hash}</p>
                                <p className='date'>
                                    {comment.date}
                                </p>
                                </section>
                                <p className='comment-body'>
                                    {comment.body}
                                </p>
                                <section className='comment-controls'>
                                    <BsChat />
                                    <BsArrowRepeat />
                                    <BsHeart />
                                    <BsFillBarChartFill />
                                    <BsUpload />
                                </section>
                            </div>
                        ))}
                    </article>
                </section>
            </main>
            <Bar2 />
        </div>
    )
}

export default Thread