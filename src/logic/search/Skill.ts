import {hash, is, ValueObject} from "immutable"
import {Skill as Data} from "./data"

export class Skill implements ValueObject {
  static ofData = ({id}: Data) => new Skill(id)

  constructor(readonly id: string) {}

  equals = (other: any) => is(this.id, other.id)
  hashCode = () => hash(this.id)
}
