import {createStore, combineReducers} from "redux"
import {reducer as builder, State as Builder} from "./builder/store"

export type RootState = {builder: Builder}

export default createStore(combineReducers({builder}))
