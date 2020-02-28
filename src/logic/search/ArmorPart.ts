import {LeveledSkill} from "logic/search/LeveledSkill"
import {ArmorSet, PartType, SearchRequest, Slot} from "./types"

export class ArmorPart {
  static of = (set: string, rarity: number, partType: PartType, skills: LeveledSkill[], slots: number[]) =>
    new ArmorPart({id: set, rarity}, partType, skills, slots)

  constructor(
    readonly set: ArmorSet,
    readonly partType: PartType,
    readonly skills: LeveledSkill[],
    readonly slots: Slot[]
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
    return [Slot.lvl1, Slot.lvl2, Slot.lvl3, Slot.lvl4].every(
      slot => this.numberOfSlot(slot) >= other.numberOfSlot(slot)
    )
  }

  private numberOfSlot(slot: Slot) {
    return this.slots.filter(s => s >= slot).length
  }
}
