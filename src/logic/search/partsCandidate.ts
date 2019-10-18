import {ArmorPart} from "/logic/search/armorPart";
import {SearchContext, SearchRequest} from "/logic/search/types";
import {LeveledSkill} from "/logic/search/leveledSkill";

export class PartsCandidate {
    constructor(readonly parts: ArmorPart[]) {
    }

    satisfy(request: SearchRequest, context: SearchContext): boolean {
        return request.leveledSkills
            .reduce(
                (acc, skill) => acc && this.skill(skill.skill.id).isBetterOrSameLevelThan(skill),
                true as boolean);
    }

    private missingLeveledSkills(request: SearchRequest): LeveledSkill[] {
        return
    }

    private skillLevelMissing(wantedSkill: LeveledSkill): number {
        return wantedSkill.level - this.skill(wantedSkill.skill.id).level
    }

    private skill(id: string): LeveledSkill {
        return this.parts.flatMap(part => part.skills)
            .filter(skill => skill.skill.id === id)
            .reduce((skill1, skill2) => skill1.combine(skill2), new LeveledSkill(0, {id}))
    }
}