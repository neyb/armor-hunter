import {SerialisableObject} from "../lib/serialisable"

export interface SearchRequest extends SerialisableObject {
  leveledSkills: LeveledSkill[]
}

export interface SearchContext extends SerialisableObject {
  readonly availableParts: ArmorPart[]
  readonly decorations: [Decoration, number][]
}

export interface Build extends SerialisableObject {
  readonly head: ArmorPart | null
  readonly chest: ArmorPart | null
  readonly arm: ArmorPart | null
  readonly waist: ArmorPart | null
  readonly legs: ArmorPart | null
  readonly decorations: [Decoration, number][]
}

export interface LeveledSkill extends SerialisableObject {
  readonly level: number
  readonly skill: Skill
}

export interface ArmorPart extends SerialisableObject {
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
export interface Decoration extends SerialisableObject {
  readonly size: Size
  readonly leveledSkills: LeveledSkill[]
}

export interface Skill extends SerialisableObject {
  readonly id: string
  readonly maxLevel: number
}

export interface ArmorSet extends SerialisableObject {
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

export interface SetSkill extends SerialisableObject {
  readonly skill: Skill
  readonly pieces: number
}
