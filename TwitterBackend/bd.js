const { MongoClient, ObjectId } = require('mongodb')

const uri = "mongodb+srv://andresocampo82211:1234@cluster0.az2rjb3.mongodb.net/";

async function connection() {
    try {
        const client = await MongoClient.connect(uri)
        const bd = client.db('twitterDB')
        const collection = bd.collection('Users')
        const docs = await collection.find().toArray()
        client.close()
        console.log(docs)
        return docs
    } catch (err) {
        console.log('Error connecting to the database:', err)
    }
}

async function login(username, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await MongoClient.connect(uri)
            const bd = client.db('twitterDB')
            const collection = bd.collection('Users')
            if (
                (await collection.countDocuments({
                    email: username,
                    password: password
                })) == 1
            ) {
                const doc = await collection.findOne({ email: username, password: password })
                let userData = { _id, username, hash, follows, followers, verified } = doc
                console.log('The user exists')
                resolve({ state: true, userData: userData })
            } else {
                console.log('The user does not exist')
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}

async function register(username, email, password) {
    const user = {
        username: username,
        hash: '@' + username.toLowerCase(),
        follows: [],
        followers: [],
        password: password,
        email: email,
        verified: false,
        enrollmentDate: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
    return new Promise(async (resolve, reject) => {
        try {
            const client = await MongoClient.connect(uri)
            const db = client.db('twitterDB')
            const collection = db.collection('Users')
            if (await collection.countDocuments({ email: user.email }) >= 1) {
                console.log('This email belongs to an existing account')
                resolve(false)
            } else {
                await collection.insertOne(user)
                console.log('User created successfully')
                resolve(true)
            }
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
}

async function postTweet(body, user) {
    const post = {
        body: body,
        retweets: 0,
        comments: [],
        reactions: 0,
        user: {
            username: user.username,
            hash: user.hash,
            email: user.email
        }
    }
    return new Promise(async (resolve, reject) => {
        try {
            const client = await MongoClient.connect(uri)
            const db = client.db('twitterDB')
            const collection = db.collection('Posts')
            await collection.insertOne({ post })
            resolve(true)
        } catch (error) {
            console.log('Query error:' + error)
            resolve(false)
        }
    })
}

async function obtainUserData(username) {
    try {
        const client = await MongoClient.connect(uri)
        const db = client.db('twitterDB')
        const collection = db.collection('Users')
        const doc = await collection.findOne({ email: username }, { _id: 0, password: 0 })
        console.log('DOC:', username, doc)
        return doc
    } catch (error) {
        console.log('Query error:', error)
    }
}

async function getPosts() {
    try {
        const client = await MongoClient.connect(uri)
        const db = client.db('twitterDB')
        const collection = db.collection('Posts')
        const posts = await collection.find().toArray()
        return posts
    } catch (error) {
        console.log('Query error:', error)
    }
}

async function getUserPosts(email) {
    try {
        const client = await MongoClient.connect(uri)
        const db = client.db('twitterDB')
        const collection = db.collection('Posts')
        const posts = await collection.find({ 'post.user.email': email }).toArray()
        console.log('User posts:', posts)
        return posts
    } catch (error) {
        console.log('Query error:', error)
    }
}

async function followUser(userEmail, email) {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await MongoClient.connect(uri)
            const db = client.db('twitterDB')
            const collection = db.collection('Users')
            await collection.updateOne({ email: email }, { $push: { followers: userEmail } })
            await collection.updateOne({ email: userEmail }, { $push: { follows: email } })
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}

async function unfollowUser(userEmail, email) {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await MongoClient.connect(uri)
            const db = client.db('twitterDB')
            const collection = db.collection('Users')
            await collection.updateOne({ email: email }, { $pull: { followers: userEmail } })
            await collection.updateOne({ email: userEmail }, { $pull: { follows: email } })
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}

async function getContacts(email) {
    try {
        const client = await MongoClient.connect(uri)
        const db = client.db('twitterDB')
        const collection = db.collection('Users')
        const contacts = await collection.findOne({ email: email }, { followers: 1, follows: 1 })
        return contacts
    } catch (error) {
        console.log('Query error:', error)
    }
}

async function chatExistence(emiter, receiver) {
    try {
        const client = await MongoClient.connect(uri)
        const db = client.db('twitterDB')
        const collection = db.collection('Chats')
        return await collection.countDocuments({ $or: [{ emiter: emiter, receiver: receiver }, { emiter: receiver, receiver: emiter }] }) >= 1
    } catch (error) {
        console.error(error)
    }
}

async function saveMessage(emiter, receiver, message, action) {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await MongoClient.connect(uri)
            const db = client.db('twitterDB')
            const collection = db.collection('Chats')
            if (action === 'update') {
                await collection.updateOne({
                    $or: [
                        { emiter: emiter, receiver: receiver },
                        { emiter: receiver, receiver: emiter }]
                }, {
                    $push: {
                        messages: {
                            author: emiter,
                            message: message
                        }
                    }
                }
                )
                resolve(true)
            } else if (action === 'post') {
                await collection.insertOne({
                    emiter: emiter,
                    receiver: receiver,
                    messages: {
                        author: emiter,
                        message: message
                    }
                })
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}

async function getThread(id) {
    try {
        const client = await MongoClient.connect(uri)
        const db = client.db('twitterDB')
        const collection = db.collection('Posts')
        const thread = await collection.findOne({ _id: new ObjectId(id) })
        return thread
    } catch (error) {
        console.log('Query error:', error)
    }
}

async function manageThreadResponse(data, pid) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = {
                email: data.user.email,
                username: data.user.username,
                hash: data.user.hash,
                body: data.body,
                date: new Date().toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            }
            const client = await MongoClient.connect(uri)
            const db = client.db('twitterDB')
            const collection = db.collection('Posts')
            await collection.updateOne({ _id: new ObjectId(pid) }, { $push: { 'post.comments': response } })
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}

const verifyFollow = async (email, visited) => {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await MongoClient.connect(uri)
            const db = client.db('twitterDB')
            const collection = db.collection('Users')            
            resolve(await collection.countDocuments({ email: visited, followers: { $all: [email] } }))        
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = { connection, login, obtainUserData, register, postTweet, getPosts, getUserPosts, followUser, getContacts, unfollowUser, chatExistence, saveMessage, getThread, manageThreadResponse, verifyFollow }