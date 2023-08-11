import '../stylesheets/Register.css'
import twitterLogo from '../images/image 1.png'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Loading from './Loading'

function Register() {
    const [username,setUsername] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
    const ApiURL = 'http://localhost:8000'

    const handleUsernameChange = e =>{
        setUsername(e.target.value)
    }

    const handleEmailChange = e =>{
        setEmail(e.target.value)
    }

    const handlePasswordChange = e =>{
        setPassword(e.target.value)
    }

    const handleSubmit = e =>{
        e.preventDefault()
        const formData = {username,email,password}
        setLoading(true)
        axios.post(ApiURL+'/register',formData)
        .then(response => {
            console.log(response.data)
            navigate('/home')
        })
        .catch(err => console.log(err))
        .finally(()=>setLoading(false))
    }

    if(loading){
        return(<Loading/>)
    }else{
        return (
            <main className='register-container'>
                <form className="register-form" onSubmit={handleSubmit}>  
                    <div className='logo-container'>
                        <img src={twitterLogo} alt="" srcset="" />
                    </div>
                    <div className='title-container'>
                    <h1>Registrate en Twitter</h1>   
                    </div>                           
                    <input type="text" id='username' placeholder='Nombre de usuario' value={username} onChange={handleUsernameChange}/>                
                    <input type="text" id='email' placeholder='Correo' value={email} onChange={handleEmailChange}/>                
                    <input type="password" id='password' placeholder='Contraseña' value={password} onChange={handlePasswordChange}/>
                    <input type="submit" id='submit' value="Enviar" />                    
                </form>
            </main>
        )
    }
}

export default Register