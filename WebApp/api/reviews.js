const express = require("express");
const router = express.Router();
const SolrNode = require("solr-node");

const solrClient = new SolrNode({
  host: "127.0.0.1",
  port: "8983",
  core: "review_table",
  protocol: "http",
});

router.post("/update", (req, res) => {
  var params = req.params;
  var body = req.body;

  solrClient.update(body, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(body);
    console.log("Response:", result.responseHeader);
  });
});

router.post("/:id", (req, res) => {
  // Build a search query var
  var query = req.params.id.replace(" ", "+");
  console.log(query);
  const searchQuery = solrClient
    .query()
    .q(query)
    .addParams({
      wt: "json",
      indent: true,
    })
    .sort({
      click_counts: "desc",
      score: "desc",
    })
    .start(0)
    .rows(50);

  solrClient.search(searchQuery, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    const response = result.response;
    return res.status(200).json(response.docs);
  });
});

module.exports = router;
