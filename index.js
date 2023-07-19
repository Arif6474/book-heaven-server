const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

const cors = require("cors");

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cckeqw6.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("book-heaven");
    const bookCollection = db.collection("book");
    console.log("DB connect successfully! ");

    // API
    app.get("/books", async (req, res) => {
      const cursor = bookCollection.find({});
      const books = await cursor.toArray();
      res.send({ data: books });
    });

    // single book api
 
    app.get("/book/:id", async (req, res) => {
      const id = req.params.id;
      const result = await bookCollection.findOne({ _id: new ObjectId(id) });
      console.log(result);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Book Heaven!");
});

app.listen(port, () => {
  console.log(`Server Running app listening on port ${port}`);
});
