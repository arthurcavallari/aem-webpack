import React from "react";
import ReactDOM from "react-dom";
import App from "./component/App";
import "./react-calculator.scss";
import "github-fork-ribbon-css/gh-fork-ribbon.css";


const el = document.getElementById("react-calculator");

if(el) {
  ReactDOM.render(<App />, el);
}
