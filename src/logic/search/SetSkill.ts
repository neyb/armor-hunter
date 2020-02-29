import {Skill} from "./Skill"
import {is, ValueObject} from "immutable"

export class SetSkill implements ValueObject {
  constructor(readonly skill: Skill, readonly activationPartCount: number) {}
  hashCode = this.skill.hashCode
  equals = (other: any) =>
    other instanceof SetSkill && is(this.skill, other.skill) && is(this.activationPartCount, other.activationPartCount)
}
