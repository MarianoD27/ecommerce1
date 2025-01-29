const express = require('express')
const router = express.Router()

router.get('*', (req, res) => {
  res.status(404)
  if (req.accepts('json')) {
    res.json({ error: '404 mulatto json' })
  } else {
    res.type('txt').send('404 not found txt')
  }
})

module.exports = router