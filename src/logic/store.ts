import {combineReducers, createStore} from "redux"
import {reducer as builder, State as Builder} from "./builder/store"
import {actions, reducer as data, State as Data} from "./data/store"
import {persistReducer, persistStore} from "redux-persist"
import storage from "redux-persist/lib/storage"
import {fetchArmors, fetchSkills} from "./conf/mhwdbClient"

export type RootState = {data: Data; builder: Builder}

export const store = createStore(
  persistReducer({key: "root", blacklist: ["builder"], storage}, combineReducers({data, builder})),
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export const persistor = persistStore(store, {}, async () => {
  if (!store.getState().data.skills.length) {
    const skills = await fetchSkills()
    store.dispatch(actions.updateSkills(skills))
  }
  if (!store.getState().data.armors.length) {
    const armors = await fetchArmors(store.getState().data.skills)
    store.dispatch(actions.updateArmors(armors))
  }
})
