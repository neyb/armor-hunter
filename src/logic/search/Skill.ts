import {hash, is, ValueObject} from "immutable"

export class Skill implements ValueObject {
  constructor(readonly id: string) {}

  equals = (other: any) => is(this.id, other.id)
  hashCode = () => hash(this.id)
}
