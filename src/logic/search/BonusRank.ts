import {ValueObject} from "immutable"
import {BonusRank as Data} from "../data"
import {Skill} from "./Skill"
import {comparing, hashes} from "../../lib/values"

export class BonusRank implements ValueObject {
  static ofData = ({pieces, skill}: Data) => new BonusRank(pieces, Skill.ofData(skill))

  constructor(readonly pieces: number, readonly skill: Skill) {}

  data = (): Data => ({pieces: this.pieces, skill: this.skill.data()})
  hashCode = () => hashes(this.pieces, this.skill)
  equals = comparing(
    this,
    rank => rank.pieces,
    rank => rank.skill
  )
}
