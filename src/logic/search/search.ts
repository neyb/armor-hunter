import {ArmorPart} from "logic/search/ArmorPart"
import {Observable} from "rxjs"
import {filter, map} from "rxjs/operators"
import {PartsCandidate} from "./PartsCandidate"
import {SearchContext} from "./searchContext"
import {Build, PartType, SearchRequest} from "../data"

export function search(request: SearchRequest, context: SearchContext): Observable<Build> {
  context = context.filter(request)

  return allCandidates().pipe(
    map(candidate => candidate.searchBuild(request, context)),
    filter((buildOrUndefined): buildOrUndefined is Build => buildOrUndefined !== undefined)
  )

  function allCandidates(): Observable<PartsCandidate> {
    const heads = all(PartType.head)
    const chests = all(PartType.chest)
    const arms = all(PartType.arm)
    const waists = all(PartType.waist)
    const legs = all(PartType.legs)

    return new Observable(subscriber => {
      for (const headPart of heads) {
        for (const chestPart of chests) {
          for (const armsPart of arms) {
            for (const waistPart of waists) {
              for (const legsPart of legs) {
                subscriber.next(
                  new PartsCandidate(
                    [headPart, chestPart, armsPart, waistPart, legsPart]
                      .filter(part => part !== null)
                      .map(part => part as ArmorPart)
                  )
                )
              }
            }
          }
        }
      }
      subscriber.complete()
    })

    function all(partType: PartType): (ArmorPart | null)[] {
      return [...context.availableParts.filter(p => p.partType === partType), null]
    }
  }
}
