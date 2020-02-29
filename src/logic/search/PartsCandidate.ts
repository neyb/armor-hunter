import {ArmorPart} from "logic/search/ArmorPart"
import {Build, PartType, SearchRequest, Size} from "./types"
import {searchBuild} from "/logic/search/searchBuild"
import {LeveledSkill} from "/logic/search/LeveledSkill"
import {Skill} from "/logic/search/Skill"
import {SearchContext} from "/logic/search/searchContext"
import {Decoration} from "/logic/search/Decoration"
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

  availableSlots(): Map<Size, number> {
    return this.parts
      .flatMap(part => part.slots)
      .reduce((nbBySlot, slot) => nbBySlot.update(slot, (nb = 0) => nb + 1), Map<Size, number>())
  }

  withDecorations(decorations: Decoration[]): Build {
    return {
      head: this.part(PartType.head),
      chest: this.part(PartType.chest),
      arm: this.part(PartType.arm),
      waist: this.part(PartType.waist),
      legs: this.part(PartType.legs),
      decorations: decorations,
    }
  }

  part(partType: PartType): ArmorPart | undefined {
    return this.parts.find(part => part.partType === partType)
  }
}
