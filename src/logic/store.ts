import {applyMiddleware, combineReducers, compose, createStore, Store} from "redux"
import {persistReducer, persistStore} from "redux-persist"
import storage from "redux-persist/lib/storage"
import thunk from "redux-thunk"
import {reducer as builder, State as Builder} from "./builder/store"
import {reloadData} from "./data/conf"
import {reducer as data, State as Data} from "./data/store"
import {reducer as stock, Stock} from "./stock/store"

export type RootState = {data: Data; builder: Builder; stock: Stock}

export const store: Store<RootState> = createStore(
  combineReducers({
    data: persistReducer({key: "data", storage}, data),
    builder,
    stock,
  }),
  compose(applyMiddleware(thunk), ((window as any).__REDUX_DEVTOOLS_EXTENSION__ || compose)())
)

export const persistor = persistStore(store, {}, () => reloadData(store))
