import {Decoration, SearchContext, SearchRequest, Skill, Slot} from "./types";
import {min} from "lodash";

export class Decorations {
    constructor(readonly decorations: Decoration[]) {
    }

    filterFor(request: SearchRequest) {
        return new Decorations(this.decorations
            .filter(decoration => request.leveledSkills.some(leveledSkill => leveledSkill.skill.id === decoration.skill.id)))
    }

    minNeededSlot(skill: Skill): Slot | undefined {
        return min(this.decorations
            .filter(dec => dec.skill.id === skill.id)
            .map(dec => dec.size))
    }
}