import React, {useRef, useState} from "react"
import {useDispatch} from "react-redux"
import {startSearchAction} from "../../../logic/builder/search"
import {ThunkDispatch} from "redux-thunk"
import {RootState} from "/logic/store"
import {AnyAction} from "redux"
import {noop} from "lodash"

export function SearchButton() {
  const dispatch = useDispatch<ThunkDispatch<RootState, any, AnyAction>>()
  const [searching, setSearching] = useState(false)
  let cancelRef = useRef<() => void>(noop)

  const cancel = () => {
    cancelRef.current()
    setSearching(false)
  }

  const startSearch = () => {
    setSearching(true)
    const searchResult = dispatch(startSearchAction)
    cancelRef.current = searchResult.cancel
    searchResult.promise.then(() => setTimeout(() => alert("recherche terminée"))).finally(() => setSearching(false))
  }

  const handleClick = () => {
    if (searching) cancel()
    else startSearch()
  }
  return (
    <div>
      <button onClick={handleClick}>{!searching ? "search" : "cancel"}</button>
    </div>
  )
}
