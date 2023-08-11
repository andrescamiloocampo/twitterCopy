import Bar from "./Bar"
import '../stylesheets/Message.css'
import Modal from "./Modal"
import { AiOutlineSetting, AiOutlineMail } from 'react-icons/ai'
import { useState, useEffect, useContext } from "react"
import { io } from 'socket.io-client';
import { userDataContext } from "../App";
import axios from "axios";

const socket = io('http://localhost:8080')
function Message(props) {
    const [openMessages, setOpenMessages] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [hasMessages, setHasMessages] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [messages, setMessages] = useState([])
    const userData = useContext(userDataContext)
    const [contacts, setContacts] = useState({})
    const [contactsLoaded, setContactsLoaded] = useState(false);
    const [contactSelected, setContactSelected] = useState('username')

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true)
            const email = userData.data.email
            socket.emit('joinRoom', email)
        })

        socket.on('chat_message', (data) => {
            console.log('FOLLOWS ', contacts?.follows, data)
            if (data.email !== userData.data.email && contacts?.follows.indexOf(data.email) === -1) {
                setContacts({
                    follows: [...contacts?.follows, data.email],
                    followers: contacts?.followers
                })
            }
            setMessages(messages => [...messages, data])
        })

        return () => {
            socket.off('connect')
            socket.off('chat_message')
        }
    }, [userData, contacts, setContacts])


    useEffect(() => {
        if (contactsLoaded === false) {
            axios.post('http://localhost:8000/messages', { email: userData?.data.email })
                .then(data => {
                    setContacts({
                        follows: [...data.data.follows],
                        followers: [...data.data.followers],
                    })
                    if (contacts?.follows.length > 0 || contacts?.followers.length > 0) {
                        setHasMessages(true)
                    }
                    setContactsLoaded(true)
                })
                .catch(error => console.log(error))
        }
    }, [userData, setContacts, setHasMessages, contacts, contactsLoaded, setContactsLoaded])

    function handleMessages() {
        setOpenMessages(true)
    }

    function sendMessage(receiver) {        
        socket.emit('chat_message', {
            user: userData.data.username || socket.id,
            email: userData.data.email,
            message: newMessage,
            contact: receiver
        })
        axios
            .get('http://localhost:8000/messages', { emiter: userData.data.email, receiver: receiver })
            .then(response => {                
                if (response.com === true){
                    console.log(`There is a communication channel between ${userData.data.username} and ${receiver}`)
                    axios
                    .put('http://localhost:8000/messages', { 
                        emiter: userData.data.email, 
                        receiver: receiver, 
                        message: newMessage,
                        action: 'update'
                    }).then(data=>console.log(data)).catch(error=>console.log(error))
                }
                else {
                    console.log(`There is not a communication channel`)
                    axios
                        .put('http://localhost:8000/messages', { 
                            emiter: userData.data.email, 
                            receiver: receiver, 
                            message: newMessage,
                            action: 'post'
                        }).then(data=>console.log(data,'Recibido')).catch(error=>console.log(error))
                }
            })
    }

    if (hasMessages) {
        return (
            <main className='message-container'>
                <Bar />
                <section className="message-dashboard">
                    <header>
                        <h2>Mensajes</h2>
                        <section className="header-message-container">
                            <AiOutlineSetting className="Ai" />
                            <AiOutlineMail className="Ai" onClick={() => setOpenMessages(true)} />
                        </section>
                    </header>
                    <section className="contacts">
                        <input type="text" placeholder="Buscar Mensajes Directos" className="search-contacts" />
                        {contacts?.follows.map((c, index) => (
                            <div className="contact" key={index} onClick={() => setContactSelected(c)}>
                                <div className="photo"></div>
                                <h3>{c}</h3>
                            </div>
                        ))}
                        {contacts?.followers.map((c, index) => (
                            <div className="contact" key={index} onClick={() => setContactSelected(c)}>
                                <div className="photo"></div>
                                <h3>{c}</h3>
                            </div>
                        ))}
                    </section>
                </section>
                <section className="chat-container">
                    <header className="user-vitals">
                        <h1>{contactSelected}</h1>
                        <section className={(isConnected) ? "dot online" : "dot offline"}></section>
                    </header>
                    <article className="chat-messages">
                        {messages.map((m, index) => (
                            <div key={index} className={(m.email === userData?.data.email) ? "message-right" : "message"}>
                                <h1>{m.user}</h1>
                                <p>{m.message}</p>
                            </div>
                        ))}
                    </article>
                    <article>
                        <input type="text"
                            onChange={e => {
                                setNewMessage(e.target.value)
                            }}
                        />
                        <button onClick={() => sendMessage(contactSelected)}>Send</button>
                    </article>
                </section>
                <Modal show={openMessages} toggle={setOpenMessages}></Modal>
            </main>
        )
    } else {
        return (
            <main className='message-container'>
                <Bar />
                <section className="message-dashboard">
                    <header>
                        <h2>Mensajes</h2>
                        <section className="header-message-container">
                            <AiOutlineSetting className="Ai" />
                            <AiOutlineMail className="Ai" onClick={() => setOpenMessages(true)} />
                        </section>
                    </header>
                    <Modal show={openMessages} toggle={setOpenMessages}></Modal>
                    <section className="content-message-container">
                        <h1>
                            ¡Te damos la bienvenida a tu bandeja de entrada!
                        </h1>
                        <p>Envía una frase,
                            comparte Tweets y mucho más
                            con las conversaciones privadas entre tú
                            y otras personas en Twitter.</p>
                        <button onClick={handleMessages}>Escribir un mensaje</button>
                    </section>
                </section>
            </main>
        )
    }
}

export default Message