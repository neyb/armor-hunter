import React from "react"
import {useSelector} from "react-redux"
import {RootState} from "/logic/store"
import {ArmorPart, Build} from "../../logic/data"

export default function Results({}) {
  const results = useSelector((state: RootState) => state.builder.results)

  return (
    <div className="col">
      <div>nbResults:{results.length}</div>
      {results.map(result => (
        <Result key={result.id} build={result.build} />
      ))}
    </div>
  )
}

function Result({build}: {build: Build}) {
  return (
    <div className="col">
      {build.head !== null && <Part part={build.head} />}
      {build.chest !== null && <Part part={build.chest} />}
      {build.arm !== null && <Part part={build.arm} />}
      {build.waist !== null && <Part part={build.waist} />}
      {build.legs !== null && <Part part={build.legs} />}
      <div>---</div>
    </div>
  )
}

function Part({part}: {part: ArmorPart}) {
  return (
    <div>
      {part.partType}: {part.set.id}
    </div>
  )
}
