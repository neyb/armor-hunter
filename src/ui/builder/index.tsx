import React from "react"
import Results from "./Results"
import {Query} from "./query"

export default function Builder() {
  return (
    <div className="container row">
      <Query />
      <Results />
    </div>
  )
}
