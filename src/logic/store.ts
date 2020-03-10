import {combineReducers, createStore, Store} from "redux"
import {reducer as builder, State as Builder} from "./builder/store"
import {reducer as data, State as Data} from "./data/store"
import {persistReducer, persistStore} from "redux-persist"
import storage from "redux-persist/lib/storage"
import {reloadData} from "./conf/conf"

export type RootState = {data: Data; builder: Builder}

export const store: Store<RootState> = createStore(
  combineReducers({
    data: persistReducer({key: "data", storage}, data),
    builder,
  }),

  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export const persistor = persistStore(store, {}, () => reloadData(store))
