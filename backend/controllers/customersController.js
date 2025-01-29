const pool = require('../model/db')

const getAllCustomers = async (req, res) => {
  const users = await pool.query("SELECT * FROM customers;")
  if (!users) return res.status(204).json({ 'message': 'No Users Found' })
  res.json(users.rows)
}

const getCustomerById = async (req, res) => {
  if (!req?.params?.id) return res.status(404).json({ "message": "ID required as params" })
  const id = req.params.id
  const foundUser = await pool.query("SELECT * FROM customers WHERE customer_id=$1", [id])
  if (!foundUser) return res.status(204).json({ "message": `Couldn't find customer with id of ${id}` })
  res.json(foundUser.rows)
}

const updateCustomer = async (req, res) => {
  if (!req?.body?.id) return res.status(409).json({ "message": "Need an ID" })
  const id = req.body.id
  const foundUser = (await pool.query("SELECT * FROM customers WHERE customer_id = $1", [id])).rows[0]
  if (!foundUser) return res.status(204).json({ "message": `Couldn't find User with customer_id of ${id}` })
  if (req.body.username) { await pool.query("UPDATE customers SET username = $2 WHERE customer_id = $1;", [id, req.body.username]) }
  if (req.body.firstname) { await pool.query("UPDATE customers SET firstname = $2 WHERE customer_id = $1;", [id, req.body.firstname]) }
  if (req.body.lastname) { await pool.query("UPDATE customers SET lastname = $2 WHERE customer_id = $1;", [id, req.body.lastname]) }
  if (req.body.email) { await pool.query("UPDATE customers SET email = $2 WHERE customer_id = $1;", [id, req.body.email]) }
  res.json({ 'message': 'Finished Updating' })
}

const deleteCustomer = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ 'message': "Need to send an ID" })
  const foundUser = (await pool.query("SELECT * FROM customers WHERE customer_id = $1", [req.body.id]))
  if (!foundUser) return res.status(204).json({ "message": `Couldn't find a customer with id of ${req.body.id}` })
  const result = await pool.query("DELETE FROM customers WHERE customer_id = $1", [req.body.id])
  res.json({ "message": `${result.command} ${result.rowCount}` })
  console.log(`${result.command} ${result.rowCount}`)
}


module.exports = { getAllCustomers, getCustomerById, updateCustomer, deleteCustomer }