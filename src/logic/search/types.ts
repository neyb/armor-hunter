import {LeveledSkill} from "./LeveledSkill"
import {ArmorPart} from "./ArmorPart"
import {Decoration} from "./Decoration"
import {SetSkill} from "/logic/search/SetSkill"

export interface SearchRequest {
  leveledSkills: LeveledSkill[]
}

export interface ArmorSet {
  readonly id: string
  readonly rarity: number
  readonly setSkills: SetSkill[]
}

export enum PartType {
  head,
  chest,
  arm,
  waist,
  legs,
}

export interface Build {
  readonly head?: ArmorPart
  readonly chest?: ArmorPart
  readonly arm?: ArmorPart
  readonly waist?: ArmorPart
  readonly legs?: ArmorPart
  readonly decorations: Decoration[]
}

export enum Size {
  lvl1 = 1,
  lvl2,
  lvl3,
  lvl4,
}
