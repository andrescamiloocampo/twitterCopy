import React from "react";
import '../stylesheets/Bar2.css'

function Bar2(){
    return(
        <div className="right-container">
            <input className="search-bar" type="text" placeholder="Buscar en twitter"/>
            <div className="trends">
                <div className="sub-trends">
                <h2>Qué está pasando</h2>                
                </div>
            </div>
        </div>
    )
}

export default Bar2