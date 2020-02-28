import {ArmorPart} from "./armorPart"
import {Build, SearchRequest} from "./types"
import {findDecorations} from "/logic/search/findDecorations"
import {LeveledSkill} from "/logic/search/leveledSkill"
import {Skill} from "/logic/search/skill"
import {SearchContext} from "/logic/search/searchContext"

export class PartsCandidate {
  constructor(readonly parts: ArmorPart[]) {}

  searchBuilds(request: SearchRequest, context: SearchContext): Build[] {
    return findDecorations(this, request, context)
  }

  skillFor(searchedSkill: Skill): LeveledSkill {
    return this.parts
      .flatMap(part => part.skills)
      .filter(skill => skill.skill.id === searchedSkill.id)
      .reduce((skill1, skill2) => skill1.plus(skill2), new LeveledSkill(0, searchedSkill))
  }
}
