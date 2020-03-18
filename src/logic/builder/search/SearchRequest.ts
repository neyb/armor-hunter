import {SearchRequest as Data} from "./data"
import {Parts} from "./Parts"
import {ArmorPart} from "./ArmorPart"
import {deduce, LeveledSkill} from "./LeveledSkill"

export class SearchRequest {
  static ofData = (data: Data) => new SearchRequest(data.leveledSkills.map(LeveledSkill.ofData))

  constructor(readonly leveledSkills: LeveledSkill[]) {}

  removeUselessArmor = (parts: ArmorPart[]): ArmorPart[] =>
    parts.reduce((retainedParts, newPart) => {
      retainedParts = retainedParts.filter(aRetainedPart => !newPart.isABetterPart(aRetainedPart, this))
      if (!retainedParts.some(retainedPart => retainedPart.isABetterPart(newPart, this))) retainedParts.push(newPart)
      return retainedParts
    }, [] as ArmorPart[])

  deduce = (parts: Parts): SearchRequest => new SearchRequest(deduce(this.leveledSkills, parts.skills()))
}
