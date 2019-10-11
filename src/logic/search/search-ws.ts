import {LeveledSkill, SearchContext, SearchRequest} from "/logic/search/types";
import {BuildFoundMessage, endMessage} from "/logic/search/index";
import {ArmorPart, PartType} from "/logic/conf";

// onmessage = null;
if (typeof window === "undefined")
    onmessage = ({data: {type, data}}
                     : { data: { type: "start", data: { request: SearchRequest, context: SearchContext } } }) => {
        switch (type) {
            case "start":
                search(data.request, data.context, postMessage);
                break;
        }
    };

export function search(request: SearchRequest, context: SearchContext, postMessage: (message: any) => void) {
    context = filter(request, context);
    const buildCandidates = allCandidates();
    buildCandidates.forEach(buildCandidate => postMessage(new BuildFoundMessage({
        head: buildCandidate.parts.find(part => part.partType === PartType.head),
        chest: buildCandidate.parts.find(part => part.partType === PartType.chest),
        arm: buildCandidate.parts.find(part => part.partType === PartType.arm),
        waist: buildCandidate.parts.find(part => part.partType === PartType.waist),
        legs: buildCandidate.parts.find(part => part.partType === PartType.legs),
    })));
    postMessage(endMessage);

    function allCandidates(): BuildCandidate[] {
        const heads = context.availableParts.filter(p => p.partType === PartType.head);
        return heads.map(headPart => new BuildCandidate([headPart]))
    }
}

class BuildCandidate {
    constructor(readonly parts: ArmorPart[]) {
    }
}

function filter(request: SearchRequest, context: SearchContext): SearchContext {
    const partsByType = context.availableParts.reduce((acc, part) =>
        Object.assign(acc, {[part.partType]: [...(acc[part.partType] || []), part]}), {} as any);
    return {
        availableParts: (Object.values(partsByType) as ArmorPart[][]).flatMap(removeUselessArmor)
    };

    function removeUselessArmor(parts: ArmorPart[]): ArmorPart[] {
        return parts.reduce((retainedParts, newPart) => {
            retainedParts = removeObsoleteParts();

            if (!aBetterPartIsAlreadyRetained())
                retainedParts.push(newPart);

            return retainedParts;

            function removeObsoleteParts() {
                return retainedParts.filter(aRetainedPart => !newPart.isABetterPart(aRetainedPart, request));
            }

            function aBetterPartIsAlreadyRetained() {
                return retainedParts.find(retainedPart => retainedPart.isABetterPart(newPart, request));
            }
        }, [] as ArmorPart[])
    }

}

export const _ = {filter}
