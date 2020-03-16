import {LeveledSkill} from "./LeveledSkill"
import {ArmorPart as Data, PartType, SearchRequest, Size} from "./data"
import {ArmorSet} from "./ArmorSet"

export class ArmorPart {
  static ofData = ({set, partType, skills, slots}: Data) =>
    new ArmorPart(ArmorSet.ofData(set), partType, skills.map(LeveledSkill.ofData), slots)

  constructor(
    readonly set: ArmorSet,
    readonly partType: PartType,
    readonly skills: LeveledSkill[],
    readonly slots: Size[]
  ) {}

  data = (): Data => ({
    set: this.set.data(),
    partType: this.partType,
    skills: this.skills.map(s => s.data()),
    slots: this.slots,
  })
  isABetterPart(other: ArmorPart, request: SearchRequest): boolean {
    return this.hasBetterSkills(other, request) && this.hasBetterSlots(other) && this.set.rarity >= other.set.rarity
  }

  private hasBetterSkills(other: ArmorPart, request: SearchRequest) {
    return other
      .interestingSkills(request)
      .every(otherSkill => this.interestingSkills(request).some(skill => skill.isBetterOrSameLevelThan(otherSkill)))
  }

  private interestingSkills(request: SearchRequest) {
    return [...this.skills, ...this.set.setSkills().map(setSkill => new LeveledSkill(1, setSkill))].filter(skill =>
      request.leveledSkills.some(LeveledSkill => LeveledSkill.skill.id === skill.skill.id)
    )
  }

  private hasBetterSlots(other: ArmorPart) {
    return [Size.lvl1, Size.lvl2, Size.lvl3, Size.lvl4].every(
      slot => this.numberOfSlot(slot) >= other.numberOfSlot(slot)
    )
  }

  private numberOfSlot(slot: Size) {
    return this.slots.filter(s => s >= slot).length
  }
}
