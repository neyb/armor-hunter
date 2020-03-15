import {Build as Data, ArmorPart as PartData, SearchRequest} from "/logic/data/data"
import {ArmorPart} from "/logic/search/ArmorPart"
import {Decorations} from "/logic/search/Decorations"
import {Parts} from "/logic/search/Parts"
import {LeveledSkill, mergeSkills} from "/logic/search/LeveledSkill"
import {searchRequest} from "/logic/builder/search"

export class Build {
  static ofData = (build: Data) =>
    new Build(
      Parts.ofData(
        [build.head, build.chest, build.arm, build.waist, build.legs].filter((part): part is PartData => part !== null)
      ),
      Decorations.ofData(build.decorations)
    )

  constructor(readonly parts: Parts, readonly decorations: Decorations) {}

  skills = () => mergeSkills([...this.parts.skills(), ...this.decorations.skills()])

  satisfy = (request: SearchRequest): boolean => {
    const skills = this.skills()
    return request.leveledSkills
      .map(LeveledSkill.ofData)
      .every(searchedSkill => skills.some(skill => skill.isBetterOrSameLevelThan(searchedSkill)))
  }
}
