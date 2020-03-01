import {LeveledSkill} from "./LeveledSkill"
import {ArmorPart as Data, PartType, SearchRequest, Size} from "./data"
import {ArmorSet} from "./ArmorSet"

export class ArmorPart implements Data {
  static ofData = ({set, partType, skills, slots}: Data) =>
    new ArmorPart(ArmorSet.ofData(set), partType, skills.map(LeveledSkill.ofData), slots)

  constructor(
    readonly set: ArmorSet,
    readonly partType: PartType,
    readonly skills: LeveledSkill[],
    readonly slots: Size[]
  ) {}

  isABetterPart(other: ArmorPart, request: SearchRequest): boolean {
    return this.hasBetterSkills(other, request) && this.hasBetterSlots(other) && this.set.rarity >= other.set.rarity
  }

  private hasBetterSkills(other: ArmorPart, request: SearchRequest) {
    return other.skills.reduce<boolean>(
      (acc, otherSkill) =>
        acc &&
        (!request.leveledSkills.some(skill => skill.skill.id === otherSkill.skill.id) ||
          this.skills.some(lskill => lskill.isBetterOrSameLevelThan(otherSkill))),
      true
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
