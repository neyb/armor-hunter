import React from "react"
import {startSearch} from "/logic/search"
import {PartType, Size} from "./logic/data"

export default function Hello({name}: {name: string}) {
  const skill = {id: "skill1"}
  const start = () =>
    startSearch(
      {leveledSkills: [{skill, level: 2}]},
      {
        availableParts: [
          {
            set: {id: "set", rarity: 1, setSkills: []},
            partType: PartType.head,
            skills: [{skill, level: 1}],
            slots: [1],
          },
        ],
        decorations: [[{size: Size.lvl1, leveledSkills: [{level: 1, skill}]}, 1]],
      }
    )
      .toPromise()
      .then(console.log)
  return (
    <div
      onClick={() => {
        start()
      }}>
      hello {name}
    </div>
  )
}
