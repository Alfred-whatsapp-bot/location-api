// instalar os pacotes pra rodar
// node geolocation.cjs
const express = require("express"); //npm i --save express
const fetch = require("node-fetch"); //npm i --save node-fetch
const app = express();
const cors = require("cors"); //npm i --save cors
const mysql = require("mysql2"); //npm i --save mysql2
require("dotenv").config(); //npm i --save dotenv
const config = {
  host: process.env.INSTANCE_HOST, // e.g. '127.0.0.1'
  port: process.env.DB_PORT, // e.g. '3306'
  user: process.env.DB_USER, // e.g. 'my-db-user'
  password: process.env.DB_PASS, // e.g. 'my-db-password'
  database: process.env.DB_NAME, // e.g. 'my-database'
};
console.log(config);
const connection = mysql.createPool(config);
app.use(cors());

// Get the user's location
app.get("/location", (req, res) => {
  const { address } = req.query;
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.APIKEY}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "OK") {
        // Call procedure
        connection.query(
          "CALL alfred_bot.CalculaDistancia('?','?');",
          [
            data.results[0].geometry.location.lat,
            data.results[0].geometry.location.lng,
          ],
          (error, results, fields) => {
            if (error) {
              return console.error(error.message);
            }
            res.status(200);
            res.json(results[0][0].distanciaKm);
            console.log(results[0][0].distanciaKm);
          }
        );
        // End of procedure
      } else {
        res.status(400);
        res.json("Endereço não encontrado");
      }
    });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log("Server started on port" + PORT));
