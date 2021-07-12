const express = require('express')

const app = express()
const port = 3333


app.get('/', async (req, res ) => {
  res.send(`Welcome to your local server at port ${port}`)
})