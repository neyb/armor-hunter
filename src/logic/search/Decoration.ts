import {hash, is, ValueObject} from "immutable"
import {Skill} from "./Skill"
import {LeveledSkill} from "./LeveledSkill"
import {Decoration as Data, Size} from "../data"

export class Decoration implements ValueObject {
  static ofData = ({size, leveledSkills}: Data) => new Decoration(size, leveledSkills.map(LeveledSkill.ofData))
  data = (): Data => ({size: this.size, leveledSkills: this.leveledSkills.map(skill => skill.data())})

  constructor(readonly size: Size, readonly leveledSkills: LeveledSkill[]) {}

  hasSkill = (skill: Skill) => this.leveledSkills.some(leveledSkill => leveledSkill.skill.equals(skill))
  hashCode = () => hash(this.leveledSkills)
  equals = (other: Decoration) => is(this.size, other.size) && is(this.leveledSkills, other.leveledSkills)
}
