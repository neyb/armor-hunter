import {ArmorPart as PartData, Build as Data, SearchRequest} from "/logic/builder/search/data"
import {Decorations} from "/logic/builder/search/Decorations"
import {LeveledSkill, mergeSkills} from "/logic/builder/search/LeveledSkill"
import {Parts} from "/logic/builder/search/Parts"

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
