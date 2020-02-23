interface WorldInventory {
  parts: ArmorPart[]
}

interface ArmorPart {
  readonly set: ArmorSet
  readonly partType: PartType
  readonly skills: LeveledSkill[]
}

export enum PartType {
  head,
  chest,
  arm,
  waist,
  legs,
}

export interface ArmorSet {
  readonly id: string
}

export const three = {v: 3}

export interface Skill {
  readonly id: string
}

interface SetSkill {
  skill: Skill
  ActivationPartCount: number
}

interface Decoration {
  size: number
  skills: Skill[]
}

export interface LeveledSkill {
  readonly level: number
  readonly skill: Skill
}

export interface SearchRequest {
  leveledSkills: LeveledSkill[]
}
