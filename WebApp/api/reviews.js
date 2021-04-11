const express = require("express");
const router = express.Router();
const SolrNode = require("solr-node");

const solrClient = new SolrNode({
  host: "127.0.0.1",
  port: "8983",
  core: "review_table",
  protocol: "http",
});

// .start(1)
// .rows(1)

router.post("/:id", (req, res) => {
  // const genderQuery = {
  //     gender: query,
  //   };
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
    .start(0)
    .rows(50);

  solrClient.search(searchQuery, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }

    const response = result.response;
    // console.log("Result: ", response);

    // if (response && response.docs) {
    //   console.log(response.docs.length);
    // response.docs.forEach((doc, idx) => {
    //   console.log(doc);
    // });
    // }
    return res.status(200).json(response.docs);
  });
});

module.exports = router;
