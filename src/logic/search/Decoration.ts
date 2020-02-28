import {hash, is, Set, ValueObject} from "immutable"
import {Slot} from "./types"
import {Skill} from "./Skill"
import {LeveledSkill} from "./LeveledSkill"

export class Decoration implements ValueObject {
  static of = (size: number, skill: string) => new Decoration(size, [new LeveledSkill(1, new Skill(skill))])
  static lvl4 = (skill1: string, skill2: string) =>
    new Decoration(Slot.lvl4, [new LeveledSkill(1, new Skill(skill1)), new LeveledSkill(1, new Skill(skill2))])
  static lvl4Pure = (skill: string, level: number) =>
    new Decoration(Slot.lvl4, [new LeveledSkill(level, new Skill(skill))])

  readonly leveledSkillsSet: Set<LeveledSkill>
  constructor(readonly size: Slot, readonly leveledSkills: LeveledSkill[]) {
    this.leveledSkillsSet = Set(leveledSkills)
  }

  hasSkill(skill: Skill) {
    return this.leveledSkills.some(leveledSkill => leveledSkill.skill.equals(skill))
  }

  hashCode = () => hash(this.leveledSkillsSet)
  equals = (other: Decoration) => is(this.size, other.size) && is(this.leveledSkillsSet, other.leveledSkillsSet)
}
