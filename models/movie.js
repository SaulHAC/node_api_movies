import { createRequire } from 'node:module'
import { randomUUID } from 'node:crypto'

const require = createRequire(import.meta.url)
const movies = require('../movies.json')

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      return movies.data.filter((movie) =>
        movie.genres.some(
          (gen) => gen.toLowerCase() === genre.toLocaleLowerCase(),
        ),
      )
    }
    return movies.data
  }

  static async getById({ id }) {
    const movie = movies.data.find((movie) => movie.mal_id === id)
    return movie
  }

  static async create({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input,
    }

    movies.data.push(newMovie)

    return newMovie
  }

  static async delete({ id }) {
    const movieIndex = movies.data.findIndex((movie) => movie.mal_id === id)
    if (movieIndex === -1) return false

    movies.data.splice(movieIndex, 1)
    return true
  }

  static async update({ id, input }) {
    const movieIndex = movies.data.findIndex((movie) => movie.mal_id === id)
    if (movieIndex === -1) return false

    movies.data[movieIndex] = {
      ...movies.data[movieIndex],
      ...input,
    }

    return movies.data[movieIndex]
  }
}
