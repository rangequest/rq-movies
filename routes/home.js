const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  const page = 'visit >> https://github.com/rangequest/rq-movies'
  return res.send(page)
})

module.exports = router
