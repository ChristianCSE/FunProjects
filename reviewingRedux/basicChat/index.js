import React from "react";
import ReactDOM from 'react-dom';

import App from "./App";
import "./semantic-dist/semantic.min.css"; //need to have actual dependency here!

ReactDOM.render(<App />, document.getElementById("root"));