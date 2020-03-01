import {SearchContext as Data, SearchRequest} from "./data"
import {ArmorPart} from "./ArmorPart"
import {Decorations} from "./Decorations"

export class SearchContext {
  static ofData = ({availableParts, decorations}: Data) =>
    new SearchContext(availableParts.map(ArmorPart.ofData), Decorations.ofData(decorations))

  constructor(readonly availableParts: ArmorPart[], readonly decorations: Decorations) {}

  filter(request: SearchRequest): SearchContext {
    const partsByType = this.availableParts.reduce(
      (acc, part) => Object.assign(acc, {[part.partType]: [...(acc[part.partType] || []), part]}),
      {} as any
    )

    return new SearchContext(
      (Object.values(partsByType) as ArmorPart[][]).flatMap(removeUselessArmor),
      this.decorations.filterFor(request)
    )

    function removeUselessArmor(parts: ArmorPart[]): ArmorPart[] {
      return parts.reduce((retainedParts, newPart) => {
        retainedParts = removeObsoleteParts()

        if (!aBetterPartIsAlreadyRetained()) retainedParts.push(newPart)

        return retainedParts

        function removeObsoleteParts(): ArmorPart[] {
          return retainedParts.filter(aRetainedPart => !newPart.isABetterPart(aRetainedPart, request))
        }

        function aBetterPartIsAlreadyRetained(): boolean {
          return retainedParts.some(retainedPart => retainedPart.isABetterPart(newPart, request))
        }
      }, [] as ArmorPart[])
    }
  }
}
