import {LeveledSkill} from "./leveledSkill";
import {ArmorSet, PartType, SearchRequest} from "./types";

export class ArmorPart {

    static from = ({set, partType, skills}: { set: ArmorSet, partType: PartType, skills: LeveledSkill[] }) =>
        new ArmorPart(set, partType, skills);

    constructor(readonly set: ArmorSet,
                readonly partType: PartType,
                readonly skills: LeveledSkill[]) {
    }

    isABetterPart(other: ArmorPart, request: SearchRequest): boolean {
        return other.skills.reduce((acc: boolean, otherSkill: LeveledSkill) => {
            if (!acc) return false;
            const sameSkill = this.skills.find(lskill => lskill.skill.id === otherSkill.skill.id);
            if (!sameSkill) return false;
            return sameSkill.level > otherSkill.level;
        }, true)
    }
}