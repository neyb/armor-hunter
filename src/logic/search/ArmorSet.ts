import {SetSkill} from "./SetSkill"
import {ArmorSet as Data} from "./data"

export class ArmorSet {
  static ofData = ({id, rarity, setSkills}: Data) => new ArmorSet(id, rarity, setSkills.map(SetSkill.ofData))

  constructor(readonly id: string, readonly rarity: number, readonly setSkills: SetSkill[]) {}
}
