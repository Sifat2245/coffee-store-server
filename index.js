const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

//middlewares
app.use(cors())
app.use(express.json())

//mongodb code. do not change the code.

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qwhtqkb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

const run = async () => {
    try {
        await client.connect()

        const coffeeCollection = client.db('CoffeeDatabase').collection('coffees');
        const userCollection = client.db('CoffeeDatabase').collection('users')

        //get data from database
        app.get('/coffees', async (req, res) => {
            // const cursor = coffeeCollection.find()
            // const result = await cursor.toArray()
            const result = await coffeeCollection.find().toArray()
            res.send(result)
        })

        //get single coffee data

        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })


        //store data to the database
        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            const result = await coffeeCollection.insertOne(newCoffee)
            res.send(result)
            console.log(newCoffee);
        })

        //updating data in database 

        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new Object(id) };
            const options = { upsert: true }
            const updatedCoffee = req.body;
            const updatedDoc = {
                $set: updatedCoffee
            }

            const result = await coffeeCollection.updateOne(filter, updatedDoc, options)
            res.send(result)

        })


        //deleting the data from the server

        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollection.deleteOne(query);
            res.send(result)
        })



        // user database 

        //getting data
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray()
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const userProfile = req.body;
            console.log(userProfile);
            const result = await userCollection.insertOne(userProfile)
            res.send(result)
        })

        app.patch('/users', async(req, res) =>{
            const {email, lastSignInTime} = req.body;
            const filter = {email: email }
            const updatedDoc = {
                $set: {
                    lastSignInTime: lastSignInTime
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })

        //deleting user from db

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })

        await client.db('admin').command({ ping: 1 })
        console.log('Connected to the mongoDB server');
    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('coffee server is getting hotter.')
})




app.listen(port, () => {
    console.log(`coffee server is running ${port}`);
})
