const pool = require('../model/db')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
  const { firstname, lastname, user, email, password } = req.body
  if (!user || !email || !firstname || !lastname || !password) { return res.status(400).json({ 'message': "We couldn't receive all the information fields" }) }
  const duplicate = await pool.query("SELECT * FROM customers WHERE username = $1;", [user])
  if (duplicate.rowCount > 0) { return res.sendStatus(409) } else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      const roles = { User: 2001 }
      const result = await pool.query("INSERT INTO customers (firstname, lastname, email, username, password, roles) VALUES ($1,$2,$3,$4,$5,$6);", [firstname, lastname, email, user, hashedPassword, roles])
      res.status(201).json({ 'success': `New user ${user} created!` })
    }
    catch (err) {
      res.status(500).json({ 'message': err.message })
    }
  }
}

module.exports = { handleNewUser }