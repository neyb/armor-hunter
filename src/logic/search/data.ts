export interface SearchRequest {
  leveledSkills: LeveledSkill[]
}

export interface SearchContext {
  readonly availableParts: ArmorPart[]
  readonly decorations: [Decoration, number][]
}

export interface Build {
  readonly head?: ArmorPart
  readonly chest?: ArmorPart
  readonly arm?: ArmorPart
  readonly waist?: ArmorPart
  readonly legs?: ArmorPart
  readonly decorations: Decoration[]
}

export interface LeveledSkill {
  readonly level: number
  readonly skill: Skill
}

export interface ArmorPart {
  readonly set: ArmorSet
  readonly partType: PartType
  readonly skills: LeveledSkill[]
  readonly slots: Size[]
}

export const simpleDecoration = (size: Size, skill: Skill): Decoration => ({
  size,
  leveledSkills: [{level: 1, skill}],
})
export const dualDecoration = (skill1: Skill, skill2: Skill): Decoration => ({
  size: Size.lvl4,
  leveledSkills: [
    {level: 1, skill: skill1},
    {level: 1, skill: skill2},
  ],
})
export const pureDecoration = (skill: Skill, level: number): Decoration => ({
  size: Size.lvl4,
  leveledSkills: [{level, skill}],
})
export interface Decoration {
  readonly size: Size
  readonly leveledSkills: LeveledSkill[]
}

export interface Skill {
  readonly id: string
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

export enum Size {
  lvl1 = 1,
  lvl2,
  lvl3,
  lvl4,
}

export interface SetSkill {
  readonly skill: Skill
  readonly activationPartCount: number
}
