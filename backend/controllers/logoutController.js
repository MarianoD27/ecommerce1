const pool = require('../model/db')

const handleLogout = async (req, res) => {
  //on client also delete the access token
  const cookies = req.cookies
  if (!cookies?.jwt) { return res.sendStatus(204) }
  const refreshToken = cookies.jwt
  //is refTok in db?
  const foundUser = (await pool.query("SELECT * FROM customers WHERE refreshtoken = $1", [refreshToken])).rows[0]
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    return res.sendStatus(204)
  }
  //delete refTok from db
  const result = await pool.query("UPDATE customers SET refreshtoken='' WHERE refreshtoken = $1;", [refreshToken])
  console.log(`${result.command} ${result.rowCount}`);
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  return res.sendStatus(204)
}

module.exports = { handleLogout }
