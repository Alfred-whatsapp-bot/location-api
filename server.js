// instalar os pacotes pra rodar
// node geolocation.cjs
const express = require("express"); //npm i --save express
const fetch = require("node-fetch"); //npm i --save node-fetch
const app = express();
const cors = require("cors"); //npm i --save cors
const mysql = require("mysql"); //npm i --save mysql
require("dotenv").config(); //npm i --save dotenv
const config = {
  socketPath: "/cloudsql/alfred-database:southamerica-east1:alfred-bot-db",
  user: "dev",
  password: "root",
  database: "alfred_bot",
  queueLimit: 0,
  waitForConnection: true,
};
const connection = mysql.createConnection(config, { multipleStatements: true });
app.use(cors());

// API key
const apiKey = "AIzaSyBTJXLspQ0gYUFVe6gYUHCdIg26pZvWJxg";

// Get the user's location
app.get("/location", (req, res) => {
  const { address } = req.query;
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`
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

app.listen(process.env.PORT || 8080, () =>
  console.log("Server started on port" + process.env.PORT)
);
