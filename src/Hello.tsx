import React from "react";
import {startSearch} from "/logic/search";

export default function Hello({name}:{name:string}) {
  const start = () => startSearch({leveledSkills: []},{availableParts:[],decorations: []}  )
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
