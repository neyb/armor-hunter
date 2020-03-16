import {Skill} from "/logic/builder/search/Skill"
import {LeveledSkill as Data} from "./data"
import {List} from "immutable"

export const mergeSkills = (leveledSkills: Iterable<LeveledSkill>): Array<LeveledSkill> =>
  List(leveledSkills)
    .groupBy(LeveledSkill => LeveledSkill.skill)
    .map(leveledSkills => leveledSkills.reduce((level, leveledSkill) => level + leveledSkill.level, 0))
    .entrySeq()
    .map(([skill, level]) => new LeveledSkill(level, skill))
    .toArray()

export class LeveledSkill {
  static from = ({level, skill}: {level: number; skill: Skill}) => new LeveledSkill(level, skill)
  static ofData = ({level, skill}: Data) => new LeveledSkill(level, Skill.ofData(skill))

  constructor(readonly level: number, readonly skill: Skill) {}

  isBetterOrSameLevelThan(other: LeveledSkill): boolean {
    return other.skill.id === this.skill.id && this.level >= other.level
  }

  atLevel = (level: number) => new LeveledSkill(level, this.skill)

  plus = (other: LeveledSkill) => new LeveledSkill(this.level + other.level, this.skill)
  minus = (other: LeveledSkill) => new LeveledSkill(this.level - other.level, this.skill)
  times = (nb: number) => new LeveledSkill(this.level * nb, this.skill)

  data = (): Data => ({skill: this.skill.data(), level: this.level})
}
