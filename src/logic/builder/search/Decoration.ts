import {ValueObject} from "immutable"
import {Skill} from "./Skill"
import {LeveledSkill} from "./LeveledSkill"
import {Decoration as Data, Size} from "./data"
import {comparing, hashes} from "/lib/values"

export class Decoration implements ValueObject {
  static ofData = ({size, leveledSkills}: Data) => new Decoration(size, leveledSkills.map(LeveledSkill.ofData))
  data = (): Data => ({size: this.size, leveledSkills: this.leveledSkills.map(skill => skill.data())})

  constructor(readonly size: Size, readonly leveledSkills: LeveledSkill[]) {}

  hasSkill = (skill: Skill) => this.leveledSkills.some(leveledSkill => leveledSkill.skill.equals(skill))
  hashCode = () => hashes(this.size, this.leveledSkills)
  equals = comparing(
    this,
    d => d.size,
    d => d.leveledSkills
  )
}
