interface WorldInventory {
    parts: ArmorPart[]
}

export interface ArmorPart {
    set: ArmorSet
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