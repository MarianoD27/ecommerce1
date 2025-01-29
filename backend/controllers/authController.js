const pool = require('../model/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
  const { user, password } = req.body;
  if (!user || !password) { return res.status(400).json({ "message": "Username and password are required." }) }
  const foundUser = (await pool.query('SELECT * FROM customers WHERE username = $1;', [user])).rows[0]
  if (!foundUser) { return res.sendStatus(401) }
  const match = await bcrypt.compare(password, foundUser.password)
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean)
    // console.log(roles);
    const accessToken = jwt.sign(
      { "UserInfo": { "username": foundUser.username, "roles": roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' })
    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    )
    //writing the db
    foundUser.refreshtoken = refreshToken
    console.log(foundUser);
    await pool.query("UPDATE customers SET refreshtoken = $1 WHERE username = $2;", [refreshToken, user])
    res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true }) // 
    res.json({ accessToken })
  } else {
    res.sendStatus(401)
  }
}


module.exports = { handleLogin }
