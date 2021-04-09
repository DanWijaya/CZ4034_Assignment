const SolrNode = require("solr-node");
const people = require("./people.json");
const express = require("express");
const reviews = require("./api/reviews");
const products = require("./api/products");
const bodyParser = require("body-parser");

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// for parsing application/json
app.use(bodyParser.json());

app.use("/api/reviews", reviews);
app.use("/api/products", products);

const port = 5001;
app.listen(port, () => console.log(`Server is running on port ${port}.`));
