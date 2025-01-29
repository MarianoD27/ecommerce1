const express = require('express')
const router = express.Router()

router.get('^/$|/index(.html)?', (req, res) => {
  res.json({ info: "Hello World" });
});

module.exports = router