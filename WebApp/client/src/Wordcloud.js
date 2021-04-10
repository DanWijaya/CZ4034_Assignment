import React from "react";
import axios from "axios";
import LanguageDetect from "languagedetect";
import { useEffect } from "react";

const useScript = (url) => {
  
  useEffect(() => {
    const script = document.createElement("script");
    script.src = url;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};

async function getAllReviewsById(product_id) {
  const data = { query: `product_id:${product_id}` };

  var result = [];

  await axios.post(`/api/reviews/`, data).then((res) => {
    if (!res.data.length) {
      result = res.data.length;
      return result;
    } else {
      result = res.data;
    }
  });

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

  // console.log(reviewTitles.join(" "));
  // console.log(reviews.join(" "));

  const corpus = reviews.join(" ");
  // console.log(corpus);
  return corpus;
}

export default function Wordcloud(props) {
  // Promise((resolve, reject) => {

  // })
  useScript("wordfreq.js");
  useScript("wordfreq.worker.js");
  useScript("wordcloud2.js");

  // var wordfreq = window.WordFreq()
  const product_id = props.match.params.product_id;

  var wordlist = [];
  getAllReviewsById(product_id).then((corpus) => {
    var wordfreq = window.WordFreq();
    wordfreq.process(corpus, (result) => {
      wordlist = result;
    });

    console.log(wordlist);
    window.WordCloud(document.getElementById("canvas", { list: wordlist }));
  });

  return (
    <canvas
      id="canvas"
      className="canvas"
      width="2340"
      height="1520"
      style={{ width: "1170px", height: "760px" }}
    ></canvas>
  );
}
