import React, {useState} from "react"
import {Query} from "./query"
import Results from "./Results"

export default function Builder() {
  const [query, setQuery] = useState<Query>({skills: []})

  return (
    <div className="container row">
      <Query query={query} />
      <Results />
    </div>
  )
}
