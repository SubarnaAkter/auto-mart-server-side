const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors')
require('dotenv').config()
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
//middle wire
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vithd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect()

    const database = client.db("auto-mart")
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    const usersCollection = database.collection("users");
    const np = database.collection("reviews");
    //all products
    app.get('/products', async (req, res) => {
      const size = req.query.size;
      let cursor;
      if (size) {
        cursor = productsCollection.find({}).limit(6)
      }
      else {
        cursor = productsCollection.find({})
      }

      const result = await cursor.toArray();
      res.json(result)
    })

    //find product by id

    app.get('/products/:productId', async (req, res) => {
      const id = req.params.productId;
      const query = { _id: ObjectId(id) }
      const result = await productsCollection.findOne(query)
      res.json(result)
    })

    app.post('/products', async (req, res) => {

      const cursor = req.body;
      const orders = await productsCollection.insertOne(cursor)
      res.json(orders)

    })

    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const deleted = await productsCollection.deleteOne(query);
      res.json(deleted)
    })
    ///post order details........................

    app.post('/orders', async (req, res) => {

      const cursor = req.body;
      const orders = await ordersCollection.insertOne(cursor)
      res.json(orders)

    })

    app.get('/orders', async (req, res) => {


      const cursor = ordersCollection.find({})
      const result = await cursor.toArray();
      res.json(result)

    })
    //delete order

    app.delete('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const deleted = await ordersCollection.deleteOne(query);
      res.json(deleted)
    })

    app.post('/users', async (req, res) => {

      const cursor = req.body;
      const orders = await usersCollection.insertOne(cursor)
      res.json(orders)

    })

    //user role update..................................
    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'Admin' } }
      const result = await usersCollection.updateOne(filter, updateDoc)
      res.json(result)
    })

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const user = await usersCollection.findOne(query)
      let isAdmin = false
      if (user?.role === "Admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin })
    })

    //review

    app.post('/reviews', async (req, res) => {

      const cursor = req.body;
      const orders = await reviewCollection.insertOne(cursor)
      res.json(orders)

    })

    //get reviews
    app.get('/reviews', async (req, res) => {
      const cursor = reviewCollection.find({})
      const result = await cursor.toArray();
      res.json(result)

    })
  }


  finally {
    // await client.close()
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello Auto Mart!')
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})