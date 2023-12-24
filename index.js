const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require('express')
const cors=require('cors')

require("dotenv").config();


const app = express()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000
const uri = "mongodb+srv://marufdev09:oNtWzu4aMbfQTa9p@cluster0.fvqqkrx.mongodb.net/?retryWrites=true&w=majority";



const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });






  async function run() {
    try {
      // await client.connect();
      const database= client.db("pizza-haven")
      const pizzaCollection=database.collection("pizza")
      const orders=database.collection("orders")

      app.post("/add-pizza", async (req, res) => {
        const pizza = req.body;
        // console.log(pizza);
       
        const result = await pizzaCollection.insertOne(pizza);
        res.send(result);
      });

      app.get("/get-pizzas", async (req, res) => {
        const result = await pizzaCollection.find().toArray();
        res.send(result);
      });



      app.post("/add-order", async (req, res) => {
        const order = req.body;
        // console.log(pizza);
       
        const result = await orders.insertOne(order);
        res.send(result);
      });

      app.get("/get-orders", async (req, res) => {
        const result = await orders.find().sort({ date: -1 }).toArray();
        res.send(result);
      });


      
      app.put("/update-status/:id", async (req, res) => {
        const id = req.params.id;
        const body = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            Order_status: body.status,
          },
        };
        const result = await orders.updateOne(filter, updateDoc);
        res.send(result);
      });
    

     







      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})