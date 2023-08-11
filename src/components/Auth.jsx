import React, { useContext, useState } from "react";
import '../stylesheets/Auth.css'
import twitterLogo from '../images/image 1.png'
import axios from "axios";
import { dataContext } from "../App";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Loading from "./Loading";

function Auth(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()        
    const PORT = 8000;
    const ApiURL = `http://localhost:${PORT}`;    
    const setUserData = useContext(dataContext)    
    
    const handleChangeEmail = e => {
        setEmail(e.target.value);
    }

    const handleChangePassword = e => {
        setPassword(e.target.value);
    }

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true)
        const formData = { email, password };
        axios.post(ApiURL + "/auth", formData)
            .then(response => {
                console.log(response.data);                         
                setUserData(response.data)    
                navigate('/home')
            })
            .catch(error => console.log('Error en la solicitud:' + error))
            .finally(()=>setLoading(false))
    }

    if(loading){
        return(
            <Loading/>
        )
    }else{
        return (
            <div className='Auth'>
                <form onSubmit={handleSubmit} className="form-container">
                    <section className="logo-container">
                        <img src={twitterLogo} alt="" srcset="" />
                    </section>
                    <section className="title-container">
                        <h1>{props.t0}</h1>
                    </section>
                    <input type="text" placeholder="Ingrese su correo" value={email} onChange={handleChangeEmail} />
                    <input type="password" placeholder="Ingrese su contraseña" value={password} onChange={handleChangePassword} />
                    <input type="submit" value={props.t1} />
                    <p className="link">No tienes una cuenta? <Link to='/register'>Registrate</Link></p>
                </form>
            </div>
        )
    }

}

export default Auth;
