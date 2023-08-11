import React from "react";
import twl from '../images/image 1.png'
import i2 from '../images/image 2.png'
import i3 from '../images/image 3.png'
import i4 from '../images/image 4.png'
import i5 from '../images/image 5.png'
import i6 from '../images/image 6.png'
import i7 from '../images/image 7.png'
import '../stylesheets/Bar.css'
import Button from "./Button";
import { Link } from 'react-router-dom'
import { userDataContext } from "../App";
import { useContext } from "react";

function Bar() {
  const userData = useContext(userDataContext)
  return (
    <div className='container'>
      <Link to={'/home'} className='container-logo'>
        <img src={twl} alt="" />
      </Link>
      <div className="container-iconos">
        <Link to={'/home'}>
        <div className="icon">
          <img src={i2} alt="" />
          <p>Inicio</p>
        </div>
        </Link>
        <div className="icon">
          <img src={i3} alt="" />
          <p>Explorar</p>
        </div>
        <div className="icon">
          <img src={i4} alt="" />
          <p>Notificaciones</p>
        </div>
        <Link to={`/messages`} className="link">
          <div className="icon">
            <img src={i5} alt="" />
            <p>Mensajes</p>
          </div>
        </Link>
        <div className="icon">
          <img src={i6} alt="" />
          <p>Listas</p>
        </div>
        <Link to={`/user/:${userData?.data.email}`}>
        <div className="icon">
          <img src={i7} alt="" />
          <p>Perfil</p>
        </div>
        </Link>
        <button
          className='post-button'
          bclass="button-blue"
        >
          Twittear
        </button>

        {(userData) ?
          (<button className="user-section">
            <section className="sub-user-section">      
              <h1>{userData.data.username}</h1>
            </section>
            <section className="hash-section">
              <h2>{userData.data.hash}</h2>
            </section>
          </button>) :
          (<Button bclass="button-black">
            <Link to={'/auth'} style={{color:'white'}}>
              Iniciar sesión
            </Link>
          </Button>)
        }
      </div>
    </div>
  )
}

export default Bar