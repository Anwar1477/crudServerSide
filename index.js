const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://anwar:1744@cluster0.lvyqi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
      await client.connect();
      const database = client.db("CrudServer");
      const usersCollection = database.collection("users");

      // GET API
      app.get('/users', async(req,res) => {
        const data = usersCollection.find({});
        const users = await data.toArray();
        res.send(users);
      })

      // specific user
      app.get('/users/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id) };
        const user = await usersCollection.findOne(query);
        console.log('load user', user);
        res.send(user);
      })

      // UPDATE API
    app.put('/users/:id', async(req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      console.log(req.body); 
      const filter = {_id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
      const result = await usersCollection.updateOne( filter, updateDoc, options )
      // console.log('updated user',result);
      res.json(result);
    })
      
      // POST API
      app.post('/users', async(req, res) => {
        const newUser = req.body;
        const result = await usersCollection.insertOne(newUser);
        console.log('got new user', req.body);
        console.log('added new user', result);
        res.json(result);
      })

      
      // DELETE API
      app.delete('/users/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id) };
        const result = await usersCollection.deleteOne(query);
        console.log('deleting the user with id: ', result);
        res.json(result);
      })
    }
    finally {
      // await client.close();
    }
  }
  run().catch(console.dir)

app.get('/', (req, res) => res.send('crud server'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))