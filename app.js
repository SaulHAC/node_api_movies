import express from 'express' // CommonJS
import moviesRouter from './routes/movies.js'
import { corsMiddleWare } from './middlewares/cors.js'

// eslint-disable-next-line
// import movies from './movies.json' with { type: 'json' }

// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// CORS PRE-Flight
// OPTIONS

const app = express()
app.disable('x-powered-by')

app.use(express.json())
app.use(corsMiddleWare())

app.get('/', (req, res) => {
  res.json({ message: 'hola mundo' })
})

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
