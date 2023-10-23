const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()
app.use(cors())
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",  // replace with your frontend application's URL
    methods: ["GET", "POST"]
  }
})
let currentSlide = 'dashboard'
let currentReactions = {
  "❤️": 0,
  "👏": 0,
  "🔥": 0,
  "😍": 0,
  "🎉": 0,
}

io.on('connection', (socket) => {
  socket.emit('init-slide', currentSlide)

  socket.on('change-slide', (newSlide) => {
    currentSlide = newSlide
    io.emit('slide-changed', currentSlide)
  })

  socket.emit('init-reactions', currentReactions)

  socket.on('change-reaction', (reaction) => {

    console.log('change-reaction', reaction)

    currentReactions[reaction] += 1
    io.emit('reaction-changed', {
      newReaction: reaction,
      currentReactions
    })
  })
})

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080')
})
