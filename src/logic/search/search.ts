import {Build, PartType, SearchContext, SearchRequest} from "./types";
import {BuildFoundMessage, endMessage} from "./messages";
import {ArmorPart} from "./armorPart";
import {Observable, Subscription} from "rxjs";
import {filter as rxFilter, map} from "rxjs/operators";
import {LeveledSkill} from "./leveledSkill";

let messagePosterBuildSubscription: Subscription;
if (typeof window === "undefined")
    onmessage = ({data: {type, data}}
                     : { data: { type: "start" | "stop", data: { request: SearchRequest, context: SearchContext } } }) => {
        switch (type) {
            case "start":
                messagePosterBuildSubscription = search(data.request, data.context)
                    .subscribe({
                        next: build => postMessage(new BuildFoundMessage(build)),
                        complete: () => postMessage(endMessage)
                    });
                break;
            case "stop":
                messagePosterBuildSubscription.unsubscribe();
                break;
        }
    };

export function search(request: SearchRequest, context: SearchContext): Observable<Build> {
    return new Observable<BuildCandidate>(subscriber => {
        context = filter(request, context);
        const buildCandidates = allCandidates();
        for (let buildCandidate of buildCandidates) subscriber.next(buildCandidate);
        subscriber.complete();
    })
        .pipe(rxFilter(candidate => candidate.satisfy(request)))
        .pipe(map(candidate => ({
            head: candidate.parts.find(part => part.partType === PartType.head),
            chest: candidate.parts.find(part => part.partType === PartType.chest),
            arm: candidate.parts.find(part => part.partType === PartType.arm),
            waist: candidate.parts.find(part => part.partType === PartType.waist),
            legs: candidate.parts.find(part => part.partType === PartType.legs),
        })))

        ;

    function* allCandidates(): IterableIterator<BuildCandidate> {
        const heads: (ArmorPart | null)[] = context.availableParts.filter(p => p.partType === PartType.head);
        heads.push(null);
        const chests: (ArmorPart | null)[] = context.availableParts.filter(p => p.partType === PartType.chest);
        chests.push(null);
        const arms: (ArmorPart | null)[] = context.availableParts.filter(p => p.partType === PartType.arm);
        arms.push(null);
        const waists: (ArmorPart | null)[] = context.availableParts.filter(p => p.partType === PartType.waist);
        waists.push(null);
        const legs: (ArmorPart | null)[] = context.availableParts.filter(p => p.partType === PartType.legs);
        legs.push(null);

        for (const headPart of heads) {
            for (const chestPart of chests) {
                for (const armsPart of arms) {
                    for (const waistPart of waists) {
                        for (const legsPart of legs) {
                            yield new BuildCandidate([headPart, chestPart, armsPart, waistPart, legsPart]
                                .filter(part => part !== null)
                                .map(part => part as ArmorPart)
                            )
                        }
                    }
                }
            }
        }
    }
}

class BuildCandidate {
    constructor(readonly parts: ArmorPart[]) {
    }

    satisfy(request: SearchRequest): boolean {
        return request.leveledSkills.reduce(
            (acc, skill) => acc && this.skill(skill.skill.id).isBetterOrSameLevelThan(skill),
            true as boolean);
    }

    private skill(id: string): LeveledSkill {
        return this.parts.flatMap(part => part.skills)
            .filter(skill => skill.skill.id === id)
            .reduce((skill1, skill2) => skill1.combine(skill2), new LeveledSkill(0, {id}))
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

export const _ = {filter};
