import React, {useRef} from "react"
import {useDispatch} from "react-redux"
import {startSearchAction} from "../../../logic/builder/search"
import {ThunkDispatch} from "redux-thunk"
import {RootState} from "/logic/store"
import {AnyAction} from "redux"

export function SearchButton() {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>()
  let cancel = useRef<() => void>()
  const handleClick = () => {
    if (cancel.current !== undefined) cancel.current()
    const searchResult = dispatch(startSearchAction)
    cancel.current = searchResult.cancel
    searchResult.promise
  }
  return <button onClick={handleClick}>search</button>
}
