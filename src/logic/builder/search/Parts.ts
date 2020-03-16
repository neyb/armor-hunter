import {ArmorPart as ArmorPartData} from "/logic/builder/search/data"
import {ArmorPart} from "./ArmorPart"
import {searchBuild} from "./searchBuild"
import {LeveledSkill} from "./LeveledSkill"
import {Skill} from "./Skill"
import {SearchContext} from "./searchContext"
import {Decoration} from "./Decoration"
import {List, Map} from "immutable"
import {Build, PartType, SearchRequest, Size} from "./data"
import {Bonus} from "./Bonus"

export class Parts {
  static ofData = (parts: ArmorPartData[]) => new Parts(parts.map(ArmorPart.ofData))

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
      head: this.part(PartType.head)?.data() || null,
      chest: this.part(PartType.chest)?.data() || null,
      arm: this.part(PartType.arm)?.data() || null,
      waist: this.part(PartType.waist)?.data() || null,
      legs: this.part(PartType.legs)?.data() || null,
      decorations: List(decorations)
        .countBy(dec => dec)
        .mapKeys(dec => dec.data())
        .toArray(),
    }
  }

  part(partType: PartType): ArmorPart | undefined {
    return this.parts.find(part => part.partType === partType)
  }

  skills(): LeveledSkill[] {
    return [
      ...this.parts.flatMap(part => part.skills),
      ...this.activatedSetSkills().map(skill => new LeveledSkill(1, skill)),
    ]
  }

  private activatedSetSkills(): Skill[] {
    return List(this.parts.map(part => part.set.bonus).filter((bonus): bonus is Bonus => bonus !== null))
      .countBy(v => v)
      .entrySeq()
      .toArray()
      .flatMap(([bonus, nb]) => bonus.ranks.filter(rank => rank.pieces <= nb))
      .map(setSkill => setSkill.skill)
  }
}
