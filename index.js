import express from 'express';
const app = express()
const port = process.env.PORT || 5000
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import cors from 'cors';


app.use(cors());
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = "mongodb+srv://news:news@cluster0.avdod.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const newsCollection = client.db("pc-builder").collection("products")
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        app.get('/products', async (req, res) => {
            let result = await newsCollection.find({}).toArray()
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            function getRandomObjects(data, count) {
                const randomObjects = [];
                const dataCount = data.length;

                if (count >= dataCount) {
                    return data;
                }

                while (randomObjects.length < count) {
                    const randomIndex = getRandomInt(0, dataCount - 1);
                    const randomObject = data[randomIndex];

                    if (!randomObjects.includes(randomObject)) {
                        randomObjects.push(randomObject);
                    }
                }

                return randomObjects;
            }


            const randomObjects = getRandomObjects(result, 6);

            res.send({ message: "success", data: randomObjects, status: 200 })
        })
        app.get('/products/:category', async (req, res) => {
            const category = req.params.category
            let result = await newsCollection.find({ category }).toArray()


            res.send({ message: "success", data: result, status: 200 })
        })
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            let result = await newsCollection.findOne({ _id: new ObjectId(id) })
            console.log("🚀 ~ file: index.js:73 ~ app.get ~ result:", result,id)
            res.send({ message: "success", data: result, status: 200 })
        })
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// client.connect(err => {
// console.log("db connected");




//     // client.close();
// });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})