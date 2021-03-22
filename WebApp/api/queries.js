const express = require("express");
const router = express.Router();
const SolrNode = require("solr-node");

const solrClient = new SolrNode({
    host: "127.0.0.1",
    port: "8983",
    core: "mycore",
    protocol: "http",
  });

  // .start(1)
  // .rows(1)
  
  router.post("/", (req,res) => {
    // const genderQuery = {
    //     gender: query,
    //   };
    // Build a search query var
    const searchQuery = solrClient.query().q(`${req.body.category}: ${req.body.query}`).addParams({
      wt: "json",
      indent: true,
    });

    solrClient.search(searchQuery, function (err, result) {
        if (err) {
          console.log(err);
          return;
        }
      
        const response = result.response;
        console.log("Result: ", response);
      
        if (response && response.docs) {
          response.docs.forEach((doc) => {
            console.log(doc);
          });
        }
    return res.status(200).json(response.docs)
  })
  });

  module.exports = router;