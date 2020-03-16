import React from "react"
import {useSelector} from "react-redux"
import {RootState} from "/logic/store"
import {Build} from "/logic/builder/search/Build"
import {ArmorPart} from "/logic/builder/search/ArmorPart"
import {LeveledSkill} from "/logic/builder/search/LeveledSkill"
import {searchRequest} from "/logic/builder/search"

export default function Results({}) {
  const results = useSelector((state: RootState) => state.builder.results)
  const request = useSelector(searchRequest)
  const bonus = (buildSkills: LeveledSkill[]) =>
    buildSkills.filter(buildSkill =>
      request.leveledSkills
        .map(LeveledSkill.ofData)
        .every(searchSkill => !searchSkill.isBetterOrSameLevelThan(buildSkill))
    )

  return (
    <div className="col results">
      <div>nbResults:{results.length}</div>
      {results
        .filter(result => result.build.satisfy(request))
        .map(result => (
          <Result key={result.id} build={result.build} bonus={bonus} />
        ))}
    </div>
  )
}

function Result({build, bonus}: {build: Build; bonus: (skills: LeveledSkill[]) => LeveledSkill[]}) {
  return (
    <div className="col build">
      {build.parts.parts.map((part, index) => (
        <Part key={index} part={part} />
      ))}
      <div />
      {bonus(build.skills()).map(skill => (
        <Skill key={skill.skill.id} skill={skill} />
      ))}
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

function Skill({skill}: {skill: LeveledSkill}) {
  return <div>{`${skill.skill.id}: ${skill.level}`}</div>
}
