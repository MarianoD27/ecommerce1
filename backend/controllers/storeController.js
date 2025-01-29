const pool = require('../model/db')


const addProduct = async (req, res) => {
  const { user, name, category, description, price, img_url } = req.body
  if (!name || !category || !description || !price) { return res.status(400).json({ 'message': "We couldn't receive all the information fields" }) }
  console.log(user, name, category, description, price, img_url);
  const customer_id = (await pool.query("SELECT * FROM customers WHERE username = $1;", [user])).rows[0].customer_id
  // console.log(customer_id);
  if (!customer_id) { return res.json({ 'message': "No customer found?" }).status(400) } else {
    try {
      const duplicate_name = await pool.query("SELECT * FROM items where name=$1 AND customer_id=$2", [name, customer_id])
      // console.log(duplicate_name.rowCount);
      if (duplicate_name.rowCount > 0) { return res.status(409).json({ "message": "item already exists" }) }
      const result = await pool.query("INSERT INTO items (name,category,description,price,customer_id,img_url) VALUES ($1,$2,$3,$4,$5,$6);", [name, category, description, price, customer_id, img_url])
      console.log(result.command, result.rowCount);
      res.status(201).json({ 'success': `New item ${name} created!` })
    } catch (error) {
      res.status(500).json({ "message": error.message })
    }
  }
}

const getProducts = async (req, res) => {
  const items = await pool.query("SELECT * FROM items;")
  if (!items) { return res.status(204).json({ "message": "no items found" }) }
  res.json(items.rows)
}

const getProductById = async (req, res) => {
  const id = req.params.id
  if (!id) { return res.status(400).json({ "message": "id needed as a param" }) }
  try {
    const item = await pool.query("SELECT * FROM items WHERE item_id = $1;", [id])
    if (!item) {
      console.log('no product with this ID');
      return res.sendStatus(204)
    }
    res.json(item.rows)
  } catch (error) {
    console.error(error);
  }
}

module.exports = { addProduct, getProducts, getProductById }