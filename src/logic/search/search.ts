import {Build, PartType, SearchContext, SearchRequest} from "./types";
import {ArmorPart} from "./armorPart";
import {Observable} from "rxjs";
import {filter as rxFilter, map} from "rxjs/operators";
import {PartsCandidate} from "/logic/search/partsCandidate";


export function search(request: SearchRequest, context: SearchContext): Observable<Build> {
    context = context.filter(request);
    return allCandidates()
        .pipe(rxFilter(candidate => candidate.satisfy(request, context)))
        .pipe(map(candidate => candidate.fillDecorations(request, context)));

    function allCandidates(): Observable<PartsCandidate> {
        const heads = all(PartType.head);
        const chests = all(PartType.chest);
        const arms = all(PartType.arm);
        const waists = all(PartType.waist);
        const legs = all(PartType.legs);

        return new Observable(subscriber => {
            for (const headPart of heads) {
                for (const chestPart of chests) {
                    for (const armsPart of arms) {
                        for (const waistPart of waists) {
                            for (const legsPart of legs) {
                                subscriber.next(new PartsCandidate([headPart, chestPart, armsPart, waistPart, legsPart]
                                    .filter(part => part !== null)
                                    .map(part => part as ArmorPart)
                                ));
                            }
                        }
                    }
                }
            }
            subscriber.complete();
        });

        function all(partType: PartType): (ArmorPart | null)[] {
            return [...context.availableParts.filter(p => p.partType === partType), null]
        }
    }
}
