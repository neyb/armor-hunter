import {ArmorPart} from "./armorPart"
import {Build, PartType, SearchRequest, Slot} from "./types"
import {searchBuild} from "/logic/search/searchBuild"
import {LeveledSkill} from "/logic/search/leveledSkill"
import {Skill} from "/logic/search/skill"
import {SearchContext} from "/logic/search/searchContext"
import {Decoration} from "/logic/search/decoration"
import {Map} from "immutable"

export class PartsCandidate {
  constructor(readonly parts: ArmorPart[]) {}

  searchBuild(request: SearchRequest, context: SearchContext): Build | undefined {
    return searchBuild(this, request, context)
  }

  skillFor(searchedSkill: Skill): LeveledSkill {
    return this.parts
      .flatMap(part => part.skills)
      .filter(skill => skill.skill.id === searchedSkill.id)
      .reduce((skill1, skill2) => skill1.plus(skill2), new LeveledSkill(0, searchedSkill))
  }

  availableSlots(): Map<Slot, number> {
    return this.parts.reduce(
      (nbBySlot, part) => part.slots.reduce((nbBySlot, slot) => nbBySlot.update(slot, (nb = 0) => nb + 1), nbBySlot),
      Map<Slot, number>()
    )
  }

  withDecorations(decorations: Decoration[]): Build {
    return {
      head: this.parts.find(part => part.partType === PartType.head),
      chest: this.parts.find(part => part.partType === PartType.chest),
      arm: this.parts.find(part => part.partType === PartType.arm),
      waist: this.parts.find(part => part.partType === PartType.waist),
      legs: this.parts.find(part => part.partType === PartType.legs),
      decorations: decorations,
    }
  }
}
