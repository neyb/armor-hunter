import {ArmorPart} from "/logic/search/armorPart"
import {Decoration, SearchRequest} from "/logic/search/types"
import {Decorations} from "/logic/search/Decorations"

export class SearchContext {
  static from = ({availableParts, decorations}: {availableParts: ArmorPart[]; decorations: Decoration[]}) =>
    new SearchContext(availableParts, Decorations.of(decorations))

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
