import React from "react";
import "/custom.css";
import ReactDOM from "react-dom";
import Hello from "/Hello";

const App = () => <div><Hello name="world"/></div>;

ReactDOM.render(<App/>, document.getElementById("root"));

