import {hash, is, ValueObject} from "immutable"
import {Skill as Data} from "./data"

export class Skill implements ValueObject {
  static ofData = ({id, maxLevel}: Data) => new Skill(id, maxLevel)

  constructor(readonly id: string, readonly maxLevel: number) {}

  data = (): Data => ({id: this.id, maxLevel: this.maxLevel})
  equals = (other: any) => is(this.id, other.id)
  hashCode = () => hash(this.id)
}
