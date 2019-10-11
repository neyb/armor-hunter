import {LeveledSkill, SearchRequest} from "/logic/search/types";

interface WorldInventory {
    parts: ArmorPart[]
}

export class ArmorPart {
    isABetterPart(other: ArmorPart, request: SearchRequest): boolean {
        return other.skills.reduce((acc: boolean, otherSkill: LeveledSkill) => {
            if (!acc) return false;
            const sameSkill = this.skills.find(lskill => lskill.skill === otherSkill.skill);
            if (!sameSkill) return false;
            return sameSkill.level > otherSkill.level;
        }, true)
    }

    static from = ({set, partType, skills}: { set: ArmorSet, partType: PartType, skills: LeveledSkill[] }) =>
        new ArmorPart(set, partType, skills);

    constructor(readonly set: ArmorSet,
                readonly partType: PartType,
                readonly skills: LeveledSkill[]) {
    }
}


export enum PartType {
    head, chest, arm, waist, legs
}

export interface ArmorSet {
    readonly id: string
}

export const three = {v: 3};

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