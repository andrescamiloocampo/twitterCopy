import Bar from '../components/Bar'
import Central from '../components/Central';
import Bar2 from '../components/Bar2';
import '../stylesheets/Menu.css'
import axios from 'axios';
import { useEffect,useState } from 'react';

function Menu(props){        
    const [posts,setPosts] = useState([])    
    useEffect(()=>{
        axios.get('http://localhost:8000/Home',{
            headers:{
                authorization:'Bearer '+props?.userData?.data?.token
            }
        })
        .then((response)=>{                      
            setPosts(response.data.posts)               
        })
        .catch(error=>{
            console.log('Credentials error ',error)
        })
    },[props])        

    return(
        <div className='menu-container'>                 
            <Bar/>
            <Central 
            username={props?.userData?.data?.username}
            email = {props?.userData?.data?.email}
            hash = {props?.userData?.data?.hash}
            posts = {posts}
            />            
            <Bar2 />
        </div>
    )
}

export default Menu