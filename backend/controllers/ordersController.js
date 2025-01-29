const pool = require('../model/db')


const addOrder = async (req, res) => {
  //need: customer_id, 
  const { cartItems, username } = req.body
  if (!cartItems || !username) { return res.status(400).json({ 'message': "We couldn't receive all the information fields" }) }
  console.log(`Cart Info: ${cartItems.length} ${username}`);
  const buyer_id = (await pool.query("SELECT * FROM customers WHERE username = $1;", [username])).rows[0].customer_id
  console.log(`buyer id:${buyer_id}`);
  // after getting everything from req
  if (!buyer_id) { return res.json({ 'message': "No buyer id found?" }).status(400) } else {
    try {
      const order_id = (await pool.query("INSERT INTO orders (buyer_id) VALUES ($1) RETURNING order_id;", [buyer_id])).rows[0].order_id
      console.log(`order id: ${order_id}`);
      for (const item of cartItems) {
        await pool.query("INSERT INTO orders_products (order_id, product_id, quantity) VALUES ($1,$2,$3)", [order_id, item.item_id, item.quantity])
        // console.log(item.item_id, item.quantity);
      }
      console.log(`order created: order_id ${order_id}, buyer_id ${buyer_id}:`);
      res.status(201).json({ 'success': `New order id: ${order_id} made by ${buyer_id} created!` })
    } catch (error) {
      res.status(500).json({ "message": error.message })
    }
  }
}

const getOrders = async (req, res) => {
  const result = await pool.query(`SELECT "or".order_id, "or".completed, "or".order_date, it.name, op.quantity, it.category, it.price, cu.username FROM orders "or" INNER JOIN orders_products op ON "or".order_id=op.order_id INNER JOIN items it ON op.product_id=it.item_id JOIN customers cu ON "or".buyer_id=cu.customer_id ORDER BY "or".order_id;`)
  console.log(result.rowCount);
  if (!result) { return res.status(204).json({ "message": "no items found" }) }
  res.json(result.rows)
}

const markOrderAsDone = async (req, res) => {
  const { id } = req?.body
  if (!id) { return res.status(400).json({ 'message': "We couldn't receive all the information fields" }) }
  console.log(`order id: ${id}`);
  try {
    const result = await pool.query("UPDATE orders SET completed=NOT completed WHERE order_id=$1", [id])
    res.status(204).json({ 'message': 'order set as completed' })
  } catch (error) {
    res.status(500).json({ "message": error.message })
  }
}

module.exports = { addOrder, getOrders, markOrderAsDone }