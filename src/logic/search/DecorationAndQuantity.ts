import {is, hash, ValueObject} from "immutable"
import {Decoration} from "/logic/search/decoration"

export class DecorationAndQuantity implements ValueObject {
  constructor(readonly decoration: Decoration, readonly qty: number) {}

  hashCode = () => hash(this.decoration) + this.qty
  equals = (other: DecorationAndQuantity) => is(this.decoration, other.decoration) && is(this.qty, other.qty)
}
