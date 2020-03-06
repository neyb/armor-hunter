import {combineReducers, createStore} from "redux"
import {reducer as builder, State as Builder} from "./builder/store"
import {persistReducer, persistStore} from "redux-persist"
import storage from "redux-persist/lib/storage"

export type RootState = {builder: Builder}

export const store = createStore(persistReducer({key: "root", storage}, combineReducers({builder})))

export const persistor = persistStore(store)
