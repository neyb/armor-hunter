import {hash, is, Set, ValueObject} from "immutable"
import {Slot} from "./types"
import {Skill} from "./Skill"
import {LeveledSkill} from "./LeveledSkill"

export class Decoration implements ValueObject {
  static of = (size: number, skill: string) => new Decoration(size, [new LeveledSkill(1, new Skill(skill))])
  static dual = (skill1: string, skill2: string) =>
    new Decoration(Slot.lvl4, [new LeveledSkill(1, new Skill(skill1)), new LeveledSkill(1, new Skill(skill2))])
  static pure = (skill: string, level: number) => new Decoration(Slot.lvl4, [new LeveledSkill(level, new Skill(skill))])

  constructor(readonly size: Slot, readonly leveledSkills: LeveledSkill[]) {}

  hasSkill = (skill: Skill) => this.leveledSkills.some(leveledSkill => leveledSkill.skill.equals(skill))
  hashCode = () => hash(this.leveledSkills)
  equals = (other: Decoration) => is(this.size, other.size) && is(this.leveledSkills, other.leveledSkills)
}
