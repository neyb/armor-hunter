import {ArmorPart, Skill, three} from "/logic/conf";

export interface SearchRequest {
    leveledSkills: LeveledSkill[]
}

interface LeveledSkill {
    level: number
    skill: Skill
}


export class Build {
    constructor({}: { readonly parts: ArmorPart[] }) {
    }
}