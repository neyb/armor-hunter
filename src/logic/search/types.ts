import {LeveledSkill} from "./leveledSkill"
import {ArmorPart} from "./armorPart"
import {Decoration} from "/logic/search/decoration"

export interface SearchRequest {
  leveledSkills: LeveledSkill[]
}

export interface ArmorSet {
  readonly id: string
  readonly rarity: number
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

export enum Slot {
  small = 1,
  medium,
  large,
  huge,
}
