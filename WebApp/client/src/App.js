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
import WordcloudComponent from "./WordcloudComponent";
import NavBar from "./misc/NavBar";
import history from "./history";
// import { createBrowserHistory } from 'history';

function App() {
  return (
    <div>
      <NavBar />
      <Switch>
        <Route exact path="/search" component={HomePage} />
        <Route exact path="/search/:query_string" component={HomePage} />
        <Route exact path="/:_product_id" component={ProductPage} />
        <Redirect to="/search" />
      </Switch>
    </div>
  );
}

export default App;
