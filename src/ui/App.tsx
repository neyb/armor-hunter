import React from "react"
import Builds from "./builds"
import Builder from "./builder"
import {Provider} from "react-redux"
import store from "/logic/store"

export const App = () => (
  <Provider store={store}>
    <div className="row">
      <Builds />
      <Builder />
    </div>
  </Provider>
)
