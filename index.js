const express = require("express");
const app = express();
const cors = require("cors");
const { resolve } = require("path");
const env = require("dotenv").config({ path: "./.env" });
const stripe = require("stripe")(
  "sk_test_51LyoyLGYlSiTW2Mhyb1m6UbBENu78RypyTkjFOwNtYuMx87Xp7Pr8VamUnFFbL1c69GEb16xwATqIUSIwoNFBjxm00GaWNcswk",
  {
    apiVersion: "2022-08-01",
  }
);
app.use(express.json());
app.use(express.static("../client"));
app.use(cors());
app.get("/", (req, res) => {
  const path = resolve("../client" + "/index.html");
  res.sendFile(path);
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey:
      "pk_test_51LyoyLGYlSiTW2Mh9fUnZAZGKxj08b7ou2Y9N2I7tmiOtfqn2MaiZjoebe0EuTtMK8QNm3xoTHYjtbl2dZI0wbpo00A8KUDGo2",
  });
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "USD",
      amount: req.body.amount,
      automatic_payment_methods: { enabled: true },
    });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.listen(5252, () =>
  console.log(`Node server listening at http://localhost:5252`)
);
