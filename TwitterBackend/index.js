const express = require('express')
const morgan = require('morgan')
const http = require('http')
const SocketIO = require('socket.io')
const ejs = require('ejs')
const path = require('path')
const cors = require('cors')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const PassportLocal = require('passport-local').Strategy
const jwt = require('jsonwebtoken')
const { login,
    register,
    postTweet,
    getPosts,
    getUserPosts,
    obtainUserData,
    followUser,
    getContacts,
    unfollowUser,
    chatExistence,
    saveMessage,
    getThread,
    manageThreadResponse,
    verifyFollow,
} = require('./bd')
const { error } = require('console')
const { rejects } = require('assert')

const app = express()

process.env.SECRET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const secret = process.env.SECRET

app.set('PORT', 8000)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("case sensitive routing", true);
morgan('dev')

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }))

const TOKEN_KEY = "x4TvnRET7vho2ajcotsmnkGJ8p7hp"

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log(authHeader)
    if (token == null)
        return res.status(401).send('Token required')
    jwt.verify(token, TOKEN_KEY, (err, user) => {
        if (err) return res.status(403).send('Invalid token')
        console.log(user)
        req.user = user
        next()
    })
}

app.get('/Home', verifyToken, (req, res) => {
    getPosts()
        .then(data => res.send({ message: 'Posts obtained', posts: data }))
        .catch(error => console.log(error))
})

app.post('/Home', (req, res) => {
    const { body, user } = req.body
    postTweet(body, user)
        .then(resolve => {
            if (resolve)
                return res.send({ message: 'Tweet posted successfully', body: req.body.body, usuario: req.body.user })
            return res.send({ message: 'Tweet was not created' })
        })
})

app.get('/api/data', (req, res) => {
    const data = { message: 'Hola react' }
    res.json(data)
})

app.post('/auth', (req, res, next) => {
    const user = req.body
    login(user.email, user.password)
        .then(resolve => {
            if (resolve.state) {
                console.log(resolve.userData)
                const token = jwt.sign(
                    resolve.userData,
                    TOKEN_KEY,
                    { expiresIn: '2h' }
                )
                let data = { ...resolve.userData, token }
                res.json({ message: 'the credentials are correct', redirect: true, data: data })
            }
            else
                res.send('The credentials are not correct')
        })
        .catch(error => res.send(error))
})

app.post('/register', (req, res) => {
    const user = req.body
    register(user.username, user.email, user.password)
        .then(resolve => {
            if (resolve)
                res.status(200).send('User created successfully')
            else
                res.status(200).send('The user cannot be created')
        })
        .catch(error => res.send('Error:' + error))
})

app.post('/user/:email', (req, res) => {
    const userEmail = req.params.email
    const visitedEmail = req.body.visited    
    let follow = false

    const selfUser = req.body.email
    console.log(selfUser, visitedEmail)
    verifyFollow(selfUser, visitedEmail)
        .then(resolve => {            
            if (resolve >= 1)
                follow = true
            return getUserPosts(userEmail)
        })
        .then(data => res.send({ message: 'Posts obtained', posts: data, follow }))
        .catch(error => res.send(error))
})

app.get('/user/:email', (req, res) => {
    const userEmail = req.params.email
    getUserPosts(userEmail)
        .then(data => {
            obtainUserData(userEmail)
                .then(doc => res.send({ message: 'Posts obtained', posts: data, userData: doc }))
                .catch(error => res.send(error))
        })
        .catch(error => res.send(error))
})

app.put('/user/:email', (req, res) => {
    const userEmail = req.body.userEmail
    const visitedEmail = req.params.email
    const action = req.body.action
    if (action == 'follow') {
        followUser(userEmail, visitedEmail)
            .then(resolve => {
                if (resolve == true)
                    res.send({ message: 'User follow done' })
            })
            .catch(reject => res.send({ message: 'An error ocurred during the follow process', error: reject }))
    } else if (action == 'unfollow') {
        unfollowUser(userEmail, visitedEmail)
            .then(resolve => {
                if (resolve)
                    res.send({ message: 'User unfollow done' })
            })
            .catch(reject => res.send({ message: 'An error ocurred during the unfollow process', error: reject }))
    }

})

app.post('/messages', (req, res) => {
    getContacts(req.body.email)
        .then(contacts => res.send({ message: 'contacts obtained', follows: contacts.follows, followers: contacts.followers }))
        .catch(error => res.send({ message: 'Error', error: error }))
})

app.get('/messages', (req, res) => {
    const emiter = req.body.emiter
    const receiver = req.body.receiver
    console.log(emiter, receiver)
    chatExistence(emiter, receiver)
        .then(count => {
            console.log('R:', count)
            if (count === true)
                res.send({ com: true, message: 'The chat exists' })
            else
                res.send({ com: false, message: 'The chat does not exist' })
        })
        .catch(error => console.error(error))
})

app.put('/messages', (req, res) => {
    const emiter = req.body.emiter, receiver = req.body.receiver
    const message = req.body.message
    const action = req.body.action
    saveMessage(emiter, receiver, message, action)
        .then(resolve => {
            if (resolve)
                return res.send({ message: 'Message saved', resolve: resolve })
            return res.send({ message: 'Message not saved' })
        })
})

app.get('/status/:id', (req, res) => {
    const pid = req.params.id
    getThread(pid)
        .then(data => res.send({ message: 'Thread data', thread: data }))
        .catch(error => console.log(error))
})

app.post('/status/:id', (req, res) => {
    const pid = req.params.id
    console.log('Formulario:', req.body)
    manageThreadResponse(req.body, pid)
        .then((resolve) => {
            (resolve === true) ?
                res.status(200).send({ message: 'The comment was added to the post' }) :
                res.status(200).send({ message: 'The comment was not added to the post' })
        })
        .catch(error => {
            console.log(error)
            res.status(400).send({ message: 'Error', error })
        })
})

app.listen(app.get('PORT'), () => {
    console.log(`Server listening at http://localhost:${app.get('PORT')}`)
})