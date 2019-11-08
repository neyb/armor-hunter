import {ArmorPart} from "./armorPart";
import {SearchContext, SearchRequest, Slot} from "./types";
import {LeveledSkill} from "./leveledSkill";

export class PartsCandidate {
    constructor(readonly parts: ArmorPart[]) {
    }

    satisfy(request: SearchRequest, context: SearchContext): boolean {
        const neededSlots = this.neededSlots(request, context);
        const availableSlots = this.availableSlots();
        const unused = [undefined, Slot.large, Slot.medium, Slot.small]
            .reduce((remaining, slot) => {
                if (remaining < 0) return remaining;
                return remaining + (slot && availableSlots.get(slot) || 0) - (neededSlots.get(slot) || 0)
            }, 0);
        return unused >= 0;
    }

    private neededSlots(request: SearchRequest, context: SearchContext): Map<Slot | undefined, number> {
        return this.missingLeveledSkills(request, context)
            .reduce((neededBySlot, skill) => {
                const slot = context.decorations.minNeededSlot(skill.skill);
                neededBySlot.set(slot, (neededBySlot.get(slot) || 0) + skill.level);
                return neededBySlot;
            }, new Map<Slot | undefined, number>())
    }

    private availableSlots(): Map<Slot, number> {
        return this.parts.reduce((nbBySlot, part) => {
            part.slots.forEach(slot => nbBySlot.set(slot, (nbBySlot.get(slot) || 0) + 1))
            return nbBySlot;
        }, new Map())
    }

    private missingLeveledSkills(request: SearchRequest, context: SearchContext): LeveledSkill[] {
        return request.leveledSkills
            .map(skill => skill.minus(this.skill(skill.skill.id)))
            .filter(skill => skill.level > 0)
    }

    private skill(id: string): LeveledSkill {
        return this.parts.flatMap(part => part.skills)
            .filter(skill => skill.skill.id === id)
            .reduce((skill1, skill2) => skill1.plus(skill2), new LeveledSkill(0, {id}))
    }
}