import React from "react";
import Tweet from "./Tweet";

function Publish(props) {
  const posts = props.posts  
  return (    
    <div className='container-publicaciones'>      
      {posts.map(tweet => (<Tweet 
        id = {tweet?._id}
        username = {tweet?.post?.user?.username}
        interactions = {{          
          comments:tweet?.post?.comments?.length,
          rt:tweet?.post?.retweets,
          reactions:tweet?.post?.reactions,
          views:0
        }}      
        body = {tweet?.post?.body}
        at = {tweet?.post?.user?.hash}
        hasImage = {false}
        email = {tweet?.post.user.email}
      />))}
    </div>    
  )
}

export default Publish
