const http = require('http')

const server = http.createServer()

const io = require('socket.io')(server,{
    cors:{origin:'*'}
})

io.on('connection',(socket)=>{
    console.log('Se ha conectado un cliente')

    socket.on('joinRoom',(email)=>{
        socket.join(email)        
        console.log(`${email} has joined`)
    })
    socket.on('chat_message',(data)=>{        
        io.to(socket.id).emit('chat_message',data)
        io.to(data.contact).emit('chat_message',data)
    })

})

server.listen(8080)