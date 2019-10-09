import {ArmorPart, Skill} from "/logic/conf";

export interface SearchRequest {
    leveledSkills: LeveledSkill[]
}

export interface SearchContext{
    availableParts: ArmorPart[]
}

export interface LeveledSkill {
    level: number
    skill: Skill
}


export interface Build {
    readonly head?: ArmorPart
    readonly chest?: ArmorPart
    readonly arm?: ArmorPart
    readonly waist?: ArmorPart
    readonly legs?: ArmorPart
}