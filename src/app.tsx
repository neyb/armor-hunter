import React from "react";
import ReactDOM from "react-dom";
import "/custom.css";
import Hello from "/Hello";

const App = () => (
  <div>
    <Hello name="world" />
  </div>
)

ReactDOM.render(<App/>, document.getElementById("root"))
