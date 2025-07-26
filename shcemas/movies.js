import z from 'zod'

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required',
  }),
  year: z.number().int().min(1900).max(2024),

  rate: z.number().min(0).max(10).default(5.5),
  image_url: z
    .string()
    .url({ message: 'Poster must be a valis URL' })
    .endsWith('jpg'),
  genres: z.array(
    z.enum([
      'Action',
      'Comedy',
      'Drama',
      'Sci-Fi',
      'Adventure',
      'Fantasy',
      'Thriller',
      'Shounen',
      'Comedy',
      'School',
    ]),
    {
      required_error: 'Movie genre is required',
      invalid_type_error: 'Movie genre must be an array of enum Genre',
    },
  ),
})

export function validateMovie(object) {
  return movieSchema.safeParse(object)
}

export function validatePartialMovie(input) {
  return movieSchema.partial().safeParse(input)
}

// Zod te devuelve un objeto así:

// {
//   success: true,
//   data: {
//     title: "Koe no Katachi",
//     genres: ["Drama", "School", "Shounen"],
//     year: 2000,
//     rate: 8.5,
//     image_url: "https://..."
//   }
// }

// Si falla

// {
//   success: false,
//   error: [objeto con información del error]
// }
