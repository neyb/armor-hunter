import React from "react";
import Builds from "./builds";
import Builder from "./builder";
import {Provider} from "react-redux";
import {persistor, store} from "/logic/store";
import {PersistGate} from "redux-persist/integration/react";

export const App = () => (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <div className="row">
        <Builds />
        <Builder />
      </div>
    </PersistGate>
  </Provider>
)
