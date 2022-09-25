// instalar os pacotes pra rodar
// node geolocation.cjs
const express = require("express"); //npm i --save express
const fetch = require("node-fetch"); //npm i --save node-fetch
const app = express();
const cors = require("cors"); //npm i --save cors
const mysql = require("mysql"); //npm i --save mysql
require("dotenv").config(); //npm i --save dotenv
const config = {
  host: "qvti2nukhfiig51b.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "sa7f483b4shxxrq7",
  password: "j9uazobqudc0zw61",
  database: "zpzigit5o0jticwb",
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
    .then(
      (data) =>
        // Call procedure
        connection.query(
          "CALL zpzigit5o0jticwb.CalculaDistancia('?','?');",
          [
            data.results[0].geometry.location.lat,
            data.results[0].geometry.location.lng,
          ],
          (error, results, fields) => {
            if (error) {
              return console.error(error.message);
            }
            res.json(results[0][0].distanciaKm);
            res.status(200);
            console.log(results[0][0].distanciaKm);
          }
        )
      // End of procedure
    );
});
app.listen(process.env.PORT || 3000, () =>
  console.log("Server started on port 3000")
);
