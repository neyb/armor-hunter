import {ArmorSet as Data} from "./data"
import {Bonus} from "./Bonus"
import {Skill} from "./Skill"

export class ArmorSet {
  static ofData = ({id, rarity, bonus}: Data) => new ArmorSet(id, rarity, bonus === null ? null : Bonus.ofData(bonus))

  constructor(readonly id: string, readonly rarity: number, readonly bonus: Bonus | null) {}

  setSkills = (): Skill[] => (this.bonus !== null ? this.bonus.ranks.map(rank => rank.skill) : [])

  data = (): Data => ({id: this.id, rarity: this.rarity, bonus: this.bonus?.data() || null})
}
