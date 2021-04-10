import React from "react";
import "./App.css";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import HomePage from "./Homepage";
import ProductPage from "./Productpage";
import Wordcloud from "./Wordcloud";

import NavBar from "./misc/NavBar";

function App() {
  return (
    <div>
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/:product_id" component={Wordcloud} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
