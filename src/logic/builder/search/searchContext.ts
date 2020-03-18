import {SearchRequest} from "./SearchRequest"
import {PartType, SearchContext as Data} from "./data"
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
      (Object.values(partsByType) as ArmorPart[][]).flatMap(request.removeUselessArmor),
      this.decorations.filterFor(request)
    )
  }

  all = (partType: PartType): ArmorPart[] => this.availableParts.filter(p => p.partType === partType)
}
