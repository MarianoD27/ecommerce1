const pool = require('../model/db')
const jwt = require('jsonwebtoken')

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies
  // console.log(cookies);
  if (!cookies?.jwt) { return res.sendStatus(401) }
  const refreshToken = cookies.jwt
  const foundUser = (await pool.query('SELECT * FROM customers WHERE refreshtoken = $1;', [refreshToken])).rows[0]
  // console.log(foundUser)
  if (!foundUser) return res.sendStatus(403)
  //evaluate jwt:
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) return res.sendStatus(403)
    const roles = Object.values(foundUser.roles).filter(Boolean)
    const accessToken = jwt.sign(
      { "UserInfo": { "username": decoded.username, "roles": roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' })
    res.json({ accessToken })
  })
}

module.exports = { handleRefreshToken }