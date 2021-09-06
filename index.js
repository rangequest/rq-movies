const express = require('express')
const app = express()
const Joi = require('joi')

app.use(express.json())

let movies = [
    {id:1, title:'Movie1'},
    {id:2, title:'Movie2'},
    {id:3, title:'Movie3'}
]

app.get('/api/movies', (req, res) => {
    return res.send(movies)
})

app.post('/api/movies', (req, res) => {
    const {error} = validateMovie(req.body)
    if(error) return res.status(400).send(error.details)

    const movie = {
        id: movies.length + 1,
        title: req.body.title
    }

    movies.push(movie)
    return res.send(movie)
})

app.put('/api/movies/:id', (req, res) => {
    const movie = movies.find(movie => movie.id === parseInt(req.params.id))
    if(!movie) return res.status(400).send('The requested movie to PUT not found')

    const {error} = validateMovie(req.body)
    if(error) return res.status(400).send(error.details)

    movie.title = req.body.title
    return res.send(movie)
})

app.delete('/api/movies/:id', (req, res) => {
    const movie = movies.find(movie => movie.id === parseInt(req.params.id))
    if(!movie) return res.status(400).send('The requested movie to DELETE not found')

    let index = movies.indexOf(movie)
    movies.splice(index,1)

    return res.send(movie)
})

const validateMovie = movie => {
    const schema = Joi.object({
        title: Joi.string().min(3).required()
    })

    return schema.validate(movie)
}

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server is listening on port ${port}...`))
