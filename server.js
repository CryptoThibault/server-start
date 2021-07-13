const express = require('express')
const fsPromises = require('fs/promises')
const ethers = require('ethers')
const app = express()

const PORT = 3333
const IP_LOOPBACK = 'localhost'
const LOG_FILE = 'login.json'

app.get('/', async (req, res ) => {
  res.send(`Welcome to your local server at PORT ${PORT}`)
})

app.get('/hello/:name', async (req, res) => {
  res.send(`Hello ${req.params.name}!`)
})

app.get('/register/:name/:password', async (req, res) => {
  try {
    const log = { name: req.params.name, password: req.params.password }
    await fsPromises.appendFile(LOG_FILE, JSON.stringify(log), 'utf-8')
    res.send(`You register as ${req.params.name}`)
  } catch (e) {
    console.error(`Error: can't write in ${LOG_FILE}`)
  }
})
app.get('/login/:name/:password', async (req, res) => {
  try {
    const log = await fsPromises.readFile(LOG_FILE, 'utf-8')
    log.forEach(el => {
      if (el.name === req.params.name && el.password === req.params.password) {
        res.send(`You login as ${req.params.name}`)
      }
    });
  } catch (e) {
    console.log(`Error: can't read in ${LOG_FILE}`)
  }
})

app.get('/balance/:network/:address', async (req, res) => {
  const project_id = '2ada296de2764e16915ac5a874444b0c'
  const provider = new ethers.providers.InfuraProvider(req.params.network, project_id)
  if (ethers.utils.isAddress(req.params.address)) {
    res.send(ethers.utils.formatEther(await provider.getBalance(req.params.address)))
  }
})

app.listen(PORT, async () => {
  console.log(`App listening at http://${IP_LOOPBACK}:${PORT}`)
})