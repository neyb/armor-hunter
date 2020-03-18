import {Seq} from "immutable"
import {ArmorPart} from "./ArmorPart"
import {SearchRequest} from "./SearchRequest"
import {Observable} from "rxjs"
import {filter, map, take} from "rxjs/operators"
import {Parts} from "./Parts"
import {SearchContext} from "./searchContext"
import {Build, PartType} from "./data"

export function search(request: SearchRequest, context: SearchContext): Observable<Build> {
  context = context.filter(request)

  return allCandidates().pipe(
    map(candidate => candidate.searchBuild(request, context)),
    filter((buildOrUndefined): buildOrUndefined is Build => buildOrUndefined !== undefined),
    take(100)
  )

  function allCandidates(): Observable<Parts> {
    const heads = context.all(PartType.head)
    const chests = context.all(PartType.chest)
    const arms = context.all(PartType.arm)
    const waists = context.all(PartType.waist)
    const legs = context.all(PartType.legs)

    const filter = (usedParts: ArmorPart[], parts: ArmorPart[]) =>
      request.deduce(new Parts(usedParts)).removeUselessArmor(parts)

    const filterAndCombine = (chests: ArmorPart[]) => (parts: (ArmorPart | null)[]): (ArmorPart | null)[][] =>
      [
        ...filter(
          parts.filter((part): part is ArmorPart => part !== null),
          chests
        ),
        null,
      ].map(chest => [...parts, chest])

    return new Observable(subscriber => {
      Seq([[]])
        .flatMap(filterAndCombine(heads))
        .flatMap(filterAndCombine(chests))
        .flatMap(filterAndCombine(arms))
        .flatMap(filterAndCombine(waists))
        .flatMap(filterAndCombine(legs))
        .map(parts => new Parts(parts.filter((part): part is ArmorPart => part !== null)))
        .forEach(parts => subscriber.next(parts))
      subscriber.complete()
    })
  }
}
