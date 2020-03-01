import {Skill} from "./Skill"
import {is, ValueObject} from "immutable"
import {SetSkill as Data} from "./data"

export class SetSkill implements ValueObject {
  static ofData = ({skill, activationPartCount}: Data) => new SetSkill(Skill.ofData(skill), activationPartCount)

  constructor(readonly skill: Skill, readonly activationPartCount: number) {}

  data = (): Data => ({skill: this.skill.data(), activationPartCount: this.activationPartCount})
  hashCode = this.skill.hashCode
  equals = (other: any) =>
    other instanceof SetSkill && is(this.skill, other.skill) && is(this.activationPartCount, other.activationPartCount)
}
