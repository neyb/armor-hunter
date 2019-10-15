import {LeveledSkill} from "./leveledSkill";
import {ArmorPart} from "./armorPart";

export interface SearchRequest {
    leveledSkills: LeveledSkill[]
}

export interface SearchContext {
    availableParts: ArmorPart[]
}

export interface ArmorSet {
    readonly id: string
}

export enum PartType {
    head, chest, arm, waist, legs
}

export interface Skill {
    readonly id: string
}

export interface Build {
    readonly head?: ArmorPart
    readonly chest?: ArmorPart
    readonly arm?: ArmorPart
    readonly waist?: ArmorPart
    readonly legs?: ArmorPart
}