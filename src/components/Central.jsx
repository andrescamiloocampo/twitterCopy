import React from "react";
import '../stylesheets/Central.css'
import { Link } from 'react-router-dom'
import Publish from "./Publish";
import Commit from './Commit'

function Central(props) {    
    const posts = props.posts    
    return (
        <div className="container-central">
            <h1 className="container-central-title">Inicio</h1>
            <nav className="principal">
                <Link to={'/home'} className="link-container">
                    <p>Para ti</p>
                    <section className="focus"></section>
                </Link>
                <Link to={'/follows'} className="link-container">
                    <p>Siguiendo</p>
                    <section className="focus"></section>
                </Link>
            </nav>
            <Commit
                username = {props.username}
                email = {props.email}
                hash = {props.hash}
            />
            <Publish 
            posts = {posts}
            data={props.data}
            />          
        </div>
    )
}

export default Central