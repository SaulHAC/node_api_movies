const express = require('express') // CommonJS
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./shcemas/movies')

const app = express()
app.disable('x-powered-by')

app.use(express.json())

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// CORS PRE-Flight
// OPTIONS

app.get('/', (req, res) => {
  res.json({ message: 'hola mundo' })
})

const ACCEPTED_ORIGINS = [
  'http://localhost:5500',
  'http://localhost:5501',
  'http://movies.com',
]

app.get('/movies', (req, res) => {
  const origin = req.header('origin')

  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
  }

  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.data.filter((movie) =>
      movie.genres.some(
        (gen) => gen.toLowerCase() === genre.toLocaleLowerCase(),
      ),
    )

    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.delete('/movies/:id', (req, res) => {
  const origin = req.header('origin')

  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
  }

  const { id } = req.params
  const movieIndex = movies.data.findIndex((movie) => movie.mal_id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.data.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.data.find((movie) => movie.mal_id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ messaje: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  //result.success result.error

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  }

  movies.data.push(newMovie)

  res.status(201).json(newMovie) //actualizar la cache del cliente
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params

  const movieIndex = movies.data.findIndex((movie) => movie.mal_id === id)

  if (movieIndex < 0) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  let updateMovie = {
    ...movies.data[movieIndex],
    ...result.data,
  }

  if (req.body.rate === undefined) {
    const oldRate = movies.data[movieIndex].rate
    updateMovie = { ...updateMovie, rate: oldRate }
  }

  movies.data[movieIndex] = updateMovie

  return res.json(updateMovie)
})

app.options('/movies/:id', (req, res) => {
  const origin = req.header('origin')

  if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUS, PATCH, DELETE')
  }
  res.send(200)
})

const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
