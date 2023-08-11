import '../stylesheets/User.css'
import Bar from './Bar'
import Bar2 from './Bar2'
import { useContext, useEffect, useState } from 'react'
import { userDataContext } from '../App'
import { AiOutlineArrowLeft, AiOutlineMail } from 'react-icons/ai'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import axios from 'axios'
import Tweet from './Tweet'

function User() {
    const navigate = useNavigate()
    const userData = useContext(userDataContext)
    const [userPosts, setUserPosts] = useState([])
    const [userProjection, setUserProjection] = useState(null)
    const [follow, setFollow] = useState(false)
    const [visit, setVisit] = useState(false)
    let visitedEmail = useParams()?.email
    visitedEmail = visitedEmail.slice(1, visitedEmail.length)

    useEffect(() => {
        const email = userData?.data.email;
        if (visitedEmail === email) {
            if (email) {
                setVisit(false)
                setUserProjection(userData?.data)
                axios
                    .post(`http://localhost:8000/user/${email}`, { email: email })
                    .then(response => setUserPosts(response.data.posts))
                    .catch(error => console.log(error));
            }
        } else {
            setVisit(true)
            axios
                .get(`http://localhost:8000/user/${visitedEmail}`, { email: visitedEmail })
                .then(response => {
                    setUserPosts(response.data.posts)
                    setUserProjection(response.data.userData)
                })
                .catch(error => console.log(error));
            axios
                .post(`http://localhost:8000/user/${visitedEmail}`, { email: userData?.data.email, visited: visitedEmail })
                .then(response => {
                    setFollow(response.data.follow)
                })
                .catch(error => console.log(error))
        }
    }, [userData, visitedEmail, setUserProjection, setVisit])

    const handleFollow = () => {
        const selfEmail = userData?.data.email
        setFollow(prevFollow => !prevFollow)
        console.log('FOLLOW:', follow)
        if (follow) {
            axios
                .put(`http://localhost:8000/user/${visitedEmail}`, { action: 'follow', userEmail: selfEmail })
                .then(response => console.log(response.data))
                .catch(error => console.log(error))
        } else {
            axios
                .put(`http://localhost:8000/user/${visitedEmail}`, { action: 'unfollow', userEmail: selfEmail })
                .then(response => console.log(response.data))
                .catch(error => console.log(error))
        }
    }

    const handleFollowMessage = () => {
        const selfEmail = userData?.data.email
        axios
            .put(`http://localhost:8000/user/${visitedEmail}`, { action: 'follow', userEmail: selfEmail })
            .then(response => console.log(response.data))
            .catch(error => console.error(error))
            .finally(navigate('/messages'))
    }

    return (
        <main className='user-container'>
            <Bar />
            <section className='user-info'>
                <nav className='user-nav'>
                    <header className='user-header'>
                        <Link to='/home' className='arrow-link'>
                            <AiOutlineArrowLeft className='back-arrow' />
                        </Link>
                        <h1>{userProjection?.username}</h1>
                    </header>
                    <article className='user-cover'></article>
                    <article className='user-photo'></article>
                    {visit && <section className='interactions'>
                        <button><BiDotsHorizontalRounded className='interaction-1' /></button>
                        <button onClick={handleFollowMessage}><AiOutlineMail /></button>
                        <button onClick={handleFollow}>
                            {follow ? 'Siguiendo' : 'Seguir'}
                        </button>
                    </section>}
                    <section className='user-data'>
                        <h1 className='subtitle'>{userProjection?.username}</h1>
                        <p className='subtitle-h'>{userProjection?.hash}</p>
                        <p>Se unió el {userProjection?.enrollmentDate}</p>
                        <p>{userProjection?.follows.length} Siguiendo {userProjection?.followers.length} Seguidores</p>
                    </section>
                    <section className='options-bar'>
                        <h1>Tweets</h1>
                        <h1>Respuestas</h1>
                        <h1>Destacados</h1>
                        <h1>Fotos y videos</h1>
                        <h1>Me gusta</h1>
                    </section>
                </nav>
                <section className='container-publicaciones'>
                    {userPosts.map(tweet => (<Tweet
                        username={tweet?.post?.user?.username}
                        interactions={{
                            comments: tweet?.post?.comments?.length,
                            rt: tweet?.post?.retweets,
                            reactions: tweet?.post?.reactions,
                            views: 0
                        }}
                        body={tweet?.post?.body}
                        at={tweet?.post?.user?.hash}
                        hasImage={false}
                        id={tweet?._id}
                        email={tweet?.post.user.email}
                    />))}
                </section>
            </section>
            <Bar2 />
        </main>
    )
}

export default User