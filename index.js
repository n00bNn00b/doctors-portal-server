const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;

/**
 * Middleware
 */
app.use(cors()); // connect frontend and backend
app.use(express.json()); // for body input from frontend

// MongoDB Config

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9kjes.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    console.log("DB Connected!");
    const serviceCollection = client
      .db("doctors_portal")
      .collection("doctor_services");
    const bookingCollection = client.db("doctors_portal").collection("booking");

    //   get API for services
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    //   available booking slots
    app.get("/available", async (req, res) => {
      const date = req.query.date || "May 24, 2022";
      // step-1: get all services
      const services = await serviceCollection.find().toArray();
      // step-2: get the booking of that day
    });

    /**
     *
     * API Naming Convention
     * app.get("/booking") get all bookings collection
     * app.get("/booking/:id") get specific booking
     * app.post("/booking") add new booking
     * app.patch("/booking/:id") update booking
     * app.delete("booking/:id") delete
     *
     */

    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const query = {
        treatmen: booking.treatment,
        date: booking.date,
        patient: booking.patient,
      };
      const exists = await bookingCollection.findOne(query);
      if (exists) {
        return res.send({ success: false, booking: exists });
      }
      const result = bookingCollection.insertOne(booking);
      res.send({ success: true, result });
    });
  } finally {
    //
  }
};

run().catch(console.dir);

/**
 * Server root api
 */

app.get("/", (req, res) => {
  res.send("Doctor's Portal Server is running!");
});

app.listen(port, () => {
  console.log("Listening to the port: ", port);
});
