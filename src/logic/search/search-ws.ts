import {SearchContext, SearchRequest} from "/logic/search/types";
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