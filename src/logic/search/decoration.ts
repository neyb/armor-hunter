import {hash, is, ValueObject} from "immutable"
import {Slot} from "/logic/search/types"
import {Skill} from "/logic/search/skill"

export class Decoration implements ValueObject {
  static of = (size: number, skill: string) => new Decoration(size, new Skill(skill))

  constructor(readonly size: Slot, readonly skill: Skill) {}

  hashCode = () => hash(this.skill)
  equals = (other: Decoration) => is(this.size, other.size) && is(this.skill, other.skill)
}
