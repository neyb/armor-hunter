import React from "react"
import {useSelector} from "react-redux"
import {RootState} from "../../logic/store"

export default function Results({}) {
  const results = useSelector((state: RootState) => state.builder.results)

  return (
    <div>
      <div>nbResults:{results.length}</div>
      {results.map(result => (
        <div key={result.id}>{JSON.stringify(result)}</div>
      ))}
    </div>
  )
}
