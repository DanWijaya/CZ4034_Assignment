import React from "react";
import axios from "axios";
import LanguageDetect from "languagedetect";
import { useEffect } from "react";
import { resolveConfig } from "prettier";

function getAllReviewsById(product_id) {
  console.log("SDSD");
  const data = { id: product_id };
  var result = [];

  return axios.post(`/api/reviews/${product_id}`).then((res) => {
    if (!res.data.length) {
      result = res.data.length;
      return result;
    } else {
      result = res.data;
    }
    console.log(result);

    const reviewTitles = [];
  const reviews = [];

  const lngDetector = new LanguageDetect();

  result.map((record) => {
    // reviewTitles.push(record.review_title[0]);
    // reviews.push(record.review[0]);
    const langugage = lngDetector.detect(record.review[0], 1);
    if (langugage && langugage[0] && langugage[0][0] == "english") {
      reviews.push(record.review[0]);
    }
  });
  const corpus = reviews.join(" ");
  // console.log(corpus);
  console.log("fnkjdf");
  return corpus;
  });

  
}

export default function Wordcloud(props) {
  // Promise((resolve, reject) => {
  var { product_id } = props.match.params;
  const [canvas,setCanvas] = React.useState([]);
  useEffect(() => {
    var urls = ["wordfreq.js", "wordfreq.worker.js", "wordcloud2.js"];
    new Promise((resolve) => {
      for (var i = 0; i < urls.length; i++) {
        let script = document.createElement("script");
        script.src = urls[i];
        document.body.appendChild(script);
        // console.log(document)
        script.onload = function () {
          if (i == 3) {
            resolve("Script added");
          }
        };
      }
      // resolve("Script added")
    }).then((res) => {
      console.log(res);
      var wordlist = [];
      getAllReviewsById(product_id).then((corpus) => {
        var wordfreq = window.WordFreq();
        wordfreq.process(corpus, (result) => {
          wordlist = result;
        }).getList((list) => {
          new Promise((resolve) => {
            window.WordCloud(document.getElementById("canvas", { list: list }, resolve))
          }).then(() => setCanvas(list))
        });
      });
    });
  }, []);

  // useScript(["wordfreq.js", "wordfreq.worker.js", "wordcloud2.js"]);
  // useScript("wordfreq.worker.js");
  // useScript("wordcloud2.js");

  return (
    // <div style={{marginTop: "100px"}}>
    //   {canvas.map((item) => item)}
    // </div>
    <div style={{marginTop: "100px"}}>
      <canvas
        id="canvas"
        className="canvas"
        width="2340"
        height="1520"
        style={{ width: "1170px", height: "760px" }}
      />
    </div>
  
  );
}
