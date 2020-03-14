import {ValueObject} from "immutable"
import {Bonus as Data} from "../data"
import {BonusRank} from "./BonusRank"
import {comparing, hashes} from "../../lib/values"

export class Bonus implements ValueObject {
  static ofData = (bonus: Data) => new Bonus(bonus.id, bonus.ranks.map(BonusRank.ofData))

  constructor(readonly id: string, readonly ranks: BonusRank[]) {}

  data = (): Data => ({
    id: this.id,
    ranks: this.ranks.map(r => r.data()),
  })
  hashCode = () => hashes(this.id)
  equals = comparing(this, b => b.id)
}
