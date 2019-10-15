import {LeveledSkill} from "./leveledSkill";
import {ArmorSet, PartType, SearchRequest} from "./types";

export class ArmorPart {

    static from = ({set, partType, skills}: { set: ArmorSet, partType: PartType, skills: LeveledSkill[] }) =>
        new ArmorPart(set, partType, skills);

    static of = (set: string, partType: PartType, skills: LeveledSkill[]) =>
        new ArmorPart({id: set}, partType, skills);

    constructor(readonly set: ArmorSet,
                readonly partType: PartType,
                readonly skills: LeveledSkill[]) {
    }

    isABetterPart(other: ArmorPart, request: SearchRequest): boolean {
        return other.skills.reduce((acc: boolean, otherSkill: LeveledSkill) => {
            if (!acc) return false;
            return !!this.skills.find(lskill => lskill.isBetterOrSameLevelThan(otherSkill));
        }, true)
    }
}