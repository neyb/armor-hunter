import {LeveledSkill} from "./leveledSkill";
import {ArmorPart} from "./armorPart";
import {Skill} from "./types";

export interface SearchRequest {
    leveledSkills: LeveledSkill[]
}

export class SearchContext {

    static from = ({availableParts, decorations}: { availableParts: ArmorPart[], decorations: Decoration[] }) =>
        new SearchContext(availableParts, decorations || []);

    constructor(readonly availableParts: ArmorPart[],
                readonly decorations: Decoration[]) {
    }

    filter(request: SearchRequest): SearchContext {
        const partsByType = this.availableParts.reduce((acc, part) =>
            Object.assign(acc, {[part.partType]: [...(acc[part.partType] || []), part]}), {} as any);
        return SearchContext.from({
            decorations: this.decorations,
            availableParts: (Object.values(partsByType) as ArmorPart[][]).flatMap(removeUselessArmor)
        });

        function removeUselessArmor(parts: ArmorPart[]): ArmorPart[] {
            return parts.reduce((retainedParts, newPart) => {
                retainedParts = removeObsoleteParts();

                if (!aBetterPartIsAlreadyRetained())
                    retainedParts.push(newPart);

                return retainedParts;

                function removeObsoleteParts(): ArmorPart[] {
                    return retainedParts.filter(aRetainedPart => !newPart.isABetterPart(aRetainedPart, request));
                }

                function aBetterPartIsAlreadyRetained(): boolean {
                    return retainedParts.some(retainedPart => retainedPart.isABetterPart(newPart, request));
                }
            }, [] as ArmorPart[])
        }
    }
}

export interface ArmorSet {
    readonly id: string
    readonly rarity: number
}

export enum PartType {
    head, chest, arm, waist, legs
}

export interface Skill {
    readonly id: string
}

export interface Build {
    readonly head?: ArmorPart
    readonly chest?: ArmorPart
    readonly arm?: ArmorPart
    readonly waist?: ArmorPart
    readonly legs?: ArmorPart
    readonly decorations: Decoration[]
}

export enum Slot {
    small = 1, medium, large, huge
}

export class Decoration {
    static of = (size: number, skill: string) => new Decoration(size, {id: skill});

    constructor(readonly size: number, readonly skill: Skill) {
    }
}