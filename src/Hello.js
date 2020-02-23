import React from "react"
import {startSearch} from "./logic/search/index.ts"

export default function Hello({name}) {
  return (
    <div
      onClick={e => {
        startSearch().promise.then(console.log)
      }}>
      hello {name}
    </div>
  )
}
