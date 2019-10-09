import {LeveledSkill} from "/logic/search/types";

interface WorldInventory {
    parts: ArmorPart[]
}

export interface ArmorPart {
    set: ArmorSet
    partType: PartType
    skills: LeveledSkill[]
}

export enum PartType {
    head,chest, arm, waist, legs
}

export interface ArmorSet {
    readonly id: string
}

export const three = {v:3};

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