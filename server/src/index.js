const express = require("express");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();

const app = express();

//Middlewares

app.use(express.json());
app.use(cors());

//all currencies
app.get("/getAllCurrencies", async (req, res) => {
  const nameURL = `https://openexchangerates.org/api/currencies.json?app_id=${process.env.API_KEY}`;

  try {
    const namesResponse = await axios.get(nameURL);
    const nameData = namesResponse.data;
    return res.json(nameData);
  } catch (err) {
    console.log(err);
  }
});

app.get("/convert", async (req, res) => {
  const { date, sourceCurrency, targetCurrency, amountInSourceCurrency } =
    req.query;

  try {
    const dataURL = `https://openexchangerates.org/api/historical/${date}.json?app_id=${process.env.API_KEY}`;
    const dataResponse = await axios.get(dataURL);
    const rates = dataResponse.data.rates;

    const sourceRate = rates[sourceCurrency];
    const targetRate = rates[targetCurrency];

    const targetAmount = (targetRate / sourceRate) * amountInSourceCurrency;

    return res.json(targetAmount.toFixed(2));
  } catch (err) {
    console.log(err);
  }
});

app.listen(5000, () => {
  console.log("server started");
});
