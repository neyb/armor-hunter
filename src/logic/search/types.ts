import {LeveledSkill} from "logic/search/LeveledSkill"
import {ArmorPart} from "logic/search/ArmorPart"
import {Decoration} from "/logic/search/Decoration"
import {Skill} from "/logic/conf/conf"

export interface SearchRequest {
  leveledSkills: LeveledSkill[]
}

export interface ArmorSet {
  readonly id: string
  readonly rarity: number
  readonly setSkills: SetSkill[]
}

export interface SetSkill {
  skill: Skill
  ActivationPartCount: number
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
