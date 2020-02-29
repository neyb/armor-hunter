import {ArmorPart} from "./ArmorPart"
import {Build, PartType, SearchRequest, Size} from "./types"
import {searchBuild} from "./searchBuild"
import {LeveledSkill} from "./LeveledSkill"
import {Skill} from "./Skill"
import {SearchContext} from "./searchContext"
import {Decoration} from "./Decoration"
import {List, Map} from "immutable"

export class PartsCandidate {
  constructor(readonly parts: ArmorPart[]) {}

  searchBuild(request: SearchRequest, context: SearchContext): Build | undefined {
    return searchBuild(this, request, context)
  }

  skillFor(searchedSkill: Skill): LeveledSkill {
    return this.skills()
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

  private skills(): LeveledSkill[] {
    return [
      ...this.parts.flatMap(part => part.skills),
      ...this.activatedSetSkills().map(skill => new LeveledSkill(1, skill)),
    ]
  }

  private activatedSetSkills(): Skill[] {
    const setSkills = this.parts.flatMap(part => part.set).flatMap(set => set.setSkills)
    const countedSetSkills = List(setSkills).countBy(v => v)
    const skills = countedSetSkills
      .filter((nb, setSkills) => setSkills.activationPartCount <= nb)
      .keySeq()
      .map(setSkill => setSkill.skill)
      .toArray()
    return skills
  }
}
