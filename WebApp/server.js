const SolrNode = require("solr-node");
const people = require("./people.json");
const express = require("express");
const queries = require("./api/queries");
const bodyParser = require("body-parser");

const app = express();
// var solrClient = new SolrNode({
//   host: "127.0.0.1",
//   port: "8983",
//   core: "review_table",
//   protocol: "http",
// });

// Add One item
// Solr adds ID to each document by default, however, if you specify an id, solr will use that instead.

// solrClient.update(data, function(err, result) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log('Response:', result.responseHeader);
// });


// Delete
// const stringQuery = 'id:2';    // delete document with id 2
// const deleteAllQuery = '*';    // delete all
// const objectQUery = {id: 'd7497504-22d9-4a22-9635-88dd437712ff'};   // Object query
// solrClient.delete(deleteAllQuery, function(err, result) {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log('Response:', result.responseHeader);
// });

//-------------------------------------------------------------------------------------------

// Search
// const authorQuery = {
//   author: 'Nobody'
// };

// const genderQuery = {
//   gender: "Female",
// };

// // Build a search query var
// const searchQuery = solrClient.query().q(genderQuery).addParams({
//   wt: "json",
//   indent: true,
// });
// // .start(1)
// // .rows(1)

// solrClient.search(searchQuery, function (err, result) {
//   if (err) {
//     console.log(err);
//     return;
//   }

//   const response = result.response;
//   // console.log("Result: ", response);

//   if (response && response.docs) {
//     response.docs.forEach((doc) => {
//       console.log(doc);
//     });
//   }
// });

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)


// for parsing application/json
app.use(bodyParser.json())

app.use("/api/query", queries)
const port = 5001;
app.listen(port, () => console.log(`Server is running on port ${port}.`))
