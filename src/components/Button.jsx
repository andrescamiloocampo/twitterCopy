import React from "react";
import '../stylesheets/Button.css'

function Button(props){
    return(
        <button className={props.bclass}>{props.children}</button>
    )
}

export default Button