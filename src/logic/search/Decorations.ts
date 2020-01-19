import {Decoration, SearchContext, SearchRequest, Skill, Slot} from "./types";
import {min} from "lodash";

export class Decorations {
    constructor(readonly decorations: Decoration[]) {
    }

    filterFor(request: SearchRequest) {
        return new Decorations(this.decorations
            .filter(decoration => request.leveledSkills.some(leveledSkill => leveledSkill.skill.id === decoration.skill.id)))
    }

    forSkill(skill: Skill): Decoration {
        const decoration = this.decorations.find(decoration => decoration.skill.id === skill.id);
        if(decoration === undefined) throw new Error("no decoration for skill skill");
        return decoration
    }

    minNeededSlot(skill: Skill): Slot | undefined {
        return min(this.decorations
            .filter(dec => dec.skill.id === skill.id)
            .map(dec => dec.size))
    }
}